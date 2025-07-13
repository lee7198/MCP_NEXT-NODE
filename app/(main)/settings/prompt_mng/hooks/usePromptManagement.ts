'use client';

import { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { message_management } from '@/app/services/api';
import {
  SaveUserPromptRequest,
  PromptStatus,
  PromptWithChangeStatus,
  PromptChangeStatus,
} from '@/app/types';
import { toast } from 'react-toastify';

/**
 * 프롬프트 관리 커스텀 훅
 *
 * 사용자 프롬프트의 CRUD 작업과 상태 관리를 담당합니다.
 * - 프롬프트 목록 조회, 추가, 수정, 삭제
 * - 프롬프트 순서 변경 (드래그 앤 드롭 대신 버튼 클릭)
 * - 변경사항 추적 및 일괄 저장
 * - 애니메이션 효과 관리
 */
export function usePromptManagement() {
  const { data: session } = useSession();

  /**
   * 프롬프트 목록의 순서를 재계산합니다.
   * 삭제된 항목을 제외하고 1부터 순차적으로 ORDER_NO를 할당합니다.
   *
   * @param list - 순서를 재계산할 프롬프트 목록
   * @returns 순서가 재계산된 프롬프트 목록
   */
  const recomputeOrder = (
    list: PromptWithChangeStatus[]
  ): PromptWithChangeStatus[] => {
    let order = 1;
    return list.map((p) => {
      if (p.changeStatus === 'deleted') return p;
      const newPrompt = {
        ...p,
        changedPrompt: { ...p.changedPrompt, ORDER_NO: order++ },
      };
      return newPrompt;
    });
  };

  /**
   * 프롬프트의 변경 상태를 새로 계산합니다.
   * 원본과 변경본을 비교하여 수정 여부를 판단합니다.
   *
   * @param list - 상태를 새로 계산할 프롬프트 목록
   * @returns 변경 상태가 업데이트된 프롬프트 목록
   */
  const refreshStatus = (
    list: PromptWithChangeStatus[]
  ): PromptWithChangeStatus[] =>
    list.map((p) => {
      if (p.changeStatus === 'deleted') return p;
      const modified =
        p.changedPrompt.PROMPT !== p.original.PROMPT ||
        p.changedPrompt.ORDER_NO !== p.original.ORDER_NO;
      return { ...p, changeStatus: modified ? 'modified' : undefined };
    });

  // 프롬프트 상태 관리 (원본, 변경본, 편집/애니메이션 상태 포함)
  const [promptsWithStatus, setPromptsWithStatus] = useState<
    PromptWithChangeStatus[]
  >([]);

  /**
   * 사용자 프롬프트 목록을 조회합니다.
   * 세션이 있을 때만 쿼리가 실행됩니다.
   */
  const {
    data: prompts,
    isPending,
    refetch,
  } = useQuery({
    queryKey: ['prompts'],
    queryFn: () => message_management.getUserPrompt(session?.user.email || ''),
    enabled: !!session?.user.email,
  });

  /**
   * 새로운 프롬프트를 추가하는 뮤테이션
   * 성공 시 목록을 새로고침하고 성공 메시지를 표시합니다.
   */
  const addMutate = useMutation({
    mutationFn: (prompt: Partial<PromptStatus>) => {
      const newPrompt: SaveUserPromptRequest = {
        ...prompt,
        userId: session?.user.email || '',
      } as SaveUserPromptRequest;
      return message_management.addUserPrompt(newPrompt);
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
    onSuccess: () => {
      toast.success('Prompt 저장 완료');
      refetch();
    },
  });

  /**
   * 변경사항을 일괄 저장하는 뮤테이션
   * 삭제된 프롬프트와 수정된 프롬프트를 각각 처리합니다.
   */
  const saveChangesMutate = useMutation({
    mutationFn: async () => {
      if (!session?.user.email) {
        throw new Error('사용자 정보를 찾을 수 없습니다.');
      }
      const userId = session.user.email;

      // 삭제된 프롬프트 처리
      const deletedPrompts = promptsWithStatus.filter(
        (p) => p.changeStatus === 'deleted'
      );
      if (deletedPrompts.length > 0) {
        const deletePromises: Promise<unknown>[] = [];
        deletedPrompts.forEach((prompt) => {
          if (prompt.original.TITLE) {
            deletePromises.push(
              message_management.deleteUserPrompt({
                promptName: prompt.original.TITLE,
                userId,
              })
            );
          }
        });
        await Promise.all(deletePromises);
      }

      // 수정된 프롬프트 처리
      const modifiedPrompts = promptsWithStatus.filter(
        (p) => p.changeStatus === 'modified'
      );
      if (modifiedPrompts.length > 0) {
        const updatePromises: Promise<unknown>[] = [];
        modifiedPrompts.forEach((prompt) => {
          updatePromises.push(
            message_management.updateUserPrompt({
              prompt: prompt.changedPrompt,
              userId,
            })
          );
        });
        await Promise.all(updatePromises);
      }
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
    onSuccess: () => {
      toast.success('변경사항이 저장되었습니다.');
      refetch();
    },
  });

  /**
   * 프롬프트를 위로 이동시킵니다.
   * 삭제된 항목을 건너뛰고 이전 항목과 위치를 교환합니다.
   *
   * @param index - 이동할 프롬프트의 인덱스
   */
  const handleMoveUp = (index: number) => {
    setPromptsWithStatus((prev) => {
      if (index <= 0) return prev;
      const items = [...prev];
      let prevIdx = index - 1;
      while (prevIdx >= 0 && items[prevIdx].changeStatus === 'deleted') {
        prevIdx--;
      }
      if (prevIdx < 0) return prev;

      [items[index], items[prevIdx]] = [items[prevIdx], items[index]];

      const ordered = recomputeOrder(items);
      const updated = refreshStatus(ordered).map((p) => ({
        ...p,
        isEditing: false,
      }));

      const movedTitle = updated[prevIdx].changedPrompt.TITLE;
      updated[prevIdx].isAnimating = true;
      updated[prevIdx].animationDirection = 'up';

      setTimeout(() => {
        setPromptsWithStatus((cur) =>
          cur.map((p) =>
            p.changedPrompt.TITLE === movedTitle
              ? { ...p, isAnimating: false, animationDirection: null }
              : p
          )
        );
      }, 200);

      return updated;
    });
  };

  /**
   * 프롬프트를 아래로 이동시킵니다.
   * 삭제된 항목을 건너뛰고 다음 항목과 위치를 교환합니다.
   *
   * @param index - 이동할 프롬프트의 인덱스
   */
  const handleMoveDown = (index: number) => {
    setPromptsWithStatus((prev) => {
      const items = [...prev];
      if (index >= items.length - 1) return prev;

      let nextIdx = index + 1;
      while (
        nextIdx < items.length &&
        items[nextIdx].changeStatus === 'deleted'
      ) {
        nextIdx++;
      }
      if (nextIdx >= items.length) return prev;

      [items[index], items[nextIdx]] = [items[nextIdx], items[index]];

      const ordered = recomputeOrder(items);
      const updated = refreshStatus(ordered).map((p) => ({
        ...p,
        isEditing: false,
      }));

      const movedTitle = updated[nextIdx].changedPrompt.TITLE;
      updated[nextIdx].isAnimating = true;
      updated[nextIdx].animationDirection = 'down';

      setTimeout(() => {
        setPromptsWithStatus((cur) =>
          cur.map((p) =>
            p.changedPrompt.TITLE === movedTitle
              ? { ...p, isAnimating: false, animationDirection: null }
              : p
          )
        );
      }, 200);

      return updated;
    });
  };

  /**
   * 프롬프트 수정 모드를 활성화합니다.
   * 삭제된 항목은 수정 모드 진입이 불가능합니다.
   *
   * @param title - 수정할 프롬프트의 제목
   */
  const handleEditClick = (title: string) => {
    setPromptsWithStatus((prev) =>
      prev.map((p) =>
        p.changedPrompt.TITLE === title
          ? p.changeStatus === 'deleted'
            ? p // 삭제된 항목은 수정 모드 진입 불가
            : { ...p, isEditing: true }
          : { ...p, isEditing: false }
      )
    );
  };

  /**
   * 프롬프트 내용을 변경합니다.
   * 변경 시 자동으로 상태를 새로 계산합니다.
   *
   * @param title - 변경할 프롬프트의 제목
   * @param value - 새로운 프롬프트 내용
   */
  const handlePromptChange = (title: string, value: string) => {
    setPromptsWithStatus((prev) => {
      const updated = prev.map((p) =>
        p.changedPrompt.TITLE === title
          ? { ...p, changedPrompt: { ...p.changedPrompt, PROMPT: value } }
          : p
      );
      return refreshStatus(updated);
    });
  };

  /**
   * 모든 수정사항을 취소하고 원본 상태로 되돌립니다.
   * 편집 모드와 애니메이션 상태도 초기화합니다.
   */
  const handleEditCancel = () => {
    setPromptsWithStatus((prev) =>
      prev.map((p) => ({
        ...p,
        changedPrompt: { ...p.original },
        changeStatus: undefined,
        isEditing: false,
        isAnimating: false,
        animationDirection: null,
      }))
    );
  };

  /**
   * 수정사항을 적용하고 편집 모드를 해제합니다.
   *
   * @param title - 적용할 프롬프트의 제목
   */
  const handleApplyChanges = (title: string) => {
    setPromptsWithStatus((prev) =>
      prev.map((p) =>
        p.changedPrompt.TITLE === title ? { ...p, isEditing: false } : p
      )
    );
  };

  /**
   * 프롬프트를 삭제 상태로 표시합니다.
   * 실제 삭제는 저장 버튼 클릭 시 수행됩니다.
   *
   * @param title - 삭제할 프롬프트의 제목
   */
  const handleDeleteClick = (title: string) => {
    setPromptsWithStatus((prev) => {
      const items = prev.map((p) =>
        p.changedPrompt.TITLE === title
          ? {
              ...p,
              changeStatus: 'deleted' as PromptChangeStatus,
              isEditing: false,
            }
          : p
      );
      const ordered = recomputeOrder(items);
      return refreshStatus(ordered);
    });
  };

  /**
   * 프롬프트 삭제를 취소합니다.
   * 삭제 상태를 해제하고 순서를 재계산합니다.
   *
   * @param title - 삭제 취소할 프롬프트의 제목
   */
  const handleDeleteCancel = (title: string) => {
    setPromptsWithStatus((prev) => {
      const items = prev.map((p) =>
        p.changedPrompt.TITLE === title ? { ...p, changeStatus: undefined } : p
      );
      const ordered = recomputeOrder(items);
      return refreshStatus(ordered);
    });
  };

  /**
   * 모든 변경사항을 취소하고 초기 상태로 되돌립니다.
   * 서버에서 받은 원본 데이터로 상태를 초기화합니다.
   */
  const handleCancelAll = () => {
    if (prompts) {
      setPromptsWithStatus(
        prompts.map((p) => ({
          original: { ...p },
          changedPrompt: { ...p },
          changeStatus: undefined,
          isEditing: false,
          isAnimating: false,
          animationDirection: null,
        }))
      );
    }
  };

  /**
   * 변경사항을 서버에 저장합니다.
   * 삭제된 항목과 수정된 항목을 일괄 처리합니다.
   */
  const handleSaveChanges = () => {
    saveChangesMutate.mutate();
  };

  /**
   * 프롬프트 데이터가 로드되거나 변경될 때 상태를 초기화합니다.
   * 각 프롬프트에 대해 원본과 변경본을 동일하게 설정합니다.
   */
  useEffect(() => {
    if (prompts) {
      setPromptsWithStatus(
        prompts.map((p) => ({
          original: { ...p },
          changedPrompt: { ...p },
          changeStatus: undefined,
          isEditing: false,
          isAnimating: false,
          animationDirection: null,
        }))
      );
    }
  }, [prompts]);

  // 변경/삭제된 항목들의 정보를 추출
  const changedItems = promptsWithStatus
    .filter((p) => p.changeStatus === 'modified')
    .map((p) => p.changedPrompt.ORDER_NO);
  const deletingOrderNos = promptsWithStatus
    .filter((p) => p.changeStatus === 'deleted')
    .map((p) => p.changedPrompt.ORDER_NO);
  const editingIdx = promptsWithStatus.findIndex((p) => p.isEditing);
  const animatingOrderNo =
    promptsWithStatus.find((p) => p.isAnimating)?.changedPrompt.ORDER_NO ||
    null;
  const animationDirection =
    promptsWithStatus.find((p) => p.isAnimating)?.animationDirection || null;

  /**
   * 훅에서 반환하는 값들
   *
   * @returns 프롬프트 관리에 필요한 모든 상태와 핸들러 함수들
   */
  return {
    prompts,
    isPending,
    promptsWithStatus,
    editingIdx: editingIdx >= 0 ? editingIdx : null,
    deletingOrderNos: new Set(deletingOrderNos),
    changedItems: new Set(changedItems),
    animatingOrderNo,
    animationDirection,
    addMutate,
    saveChangesMutate,
    handleMoveUp,
    handleMoveDown,
    handleEditClick,
    handlePromptChange,
    handleEditCancel,
    handleApplyChanges,
    handleDeleteClick,
    handleDeleteCancel,
    handleCancelAll,
    handleSaveChanges,
  };
}
