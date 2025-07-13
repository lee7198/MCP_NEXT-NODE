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

// 프롬프트 관리 커스텀 훅
export function usePromptManagement() {
  const { data: session } = useSession();

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
  // 프롬프트 상태(원본, 변경본, 상태 등 포함)
  const [promptsWithStatus, setPromptsWithStatus] = useState<
    PromptWithChangeStatus[]
  >([]);

  // 프롬프트 목록 조회
  const {
    data: prompts,
    isPending,
    refetch,
  } = useQuery({
    queryKey: ['prompts'],
    queryFn: () => message_management.getUserPrompt(session?.user.email || ''),
    enabled: !!session?.user.email,
  });

  // 프롬프트 추가
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

  // 프롬프트 변경/삭제 저장
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
          console.log(
            prompt.original.ORDER_NO,
            ' > ',
            prompt.changedPrompt.ORDER_NO
          );
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

  // 프롬프트 순서 위로 이동
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
      const updated = refreshStatus(ordered).map((p) => ({ ...p, isEditing: false }));

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

  // 프롬프트 순서 아래로 이동
  const handleMoveDown = (index: number) => {
    setPromptsWithStatus((prev) => {
      const items = [...prev];
      if (index >= items.length - 1) return prev;

      let nextIdx = index + 1;
      while (nextIdx < items.length && items[nextIdx].changeStatus === 'deleted') {
        nextIdx++;
      }
      if (nextIdx >= items.length) return prev;

      [items[index], items[nextIdx]] = [items[nextIdx], items[index]];

      const ordered = recomputeOrder(items);
      const updated = refreshStatus(ordered).map((p) => ({ ...p, isEditing: false }));

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

  // 프롬프트 수정 모드 진입
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

  // 프롬프트 내용 변경
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

  // 수정 취소(되돌리기)
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

  // 수정 적용(수정모드 해제)
  const handleApplyChanges = (title: string) => {
    setPromptsWithStatus((prev) =>
      prev.map((p) =>
        p.changedPrompt.TITLE === title ? { ...p, isEditing: false } : p
      )
    );
  };

  // 프롬프트 삭제
  const handleDeleteClick = (title: string) => {
    setPromptsWithStatus((prev) => {
      const items = prev.map((p) =>
        p.changedPrompt.TITLE === title
          ? { ...p, changeStatus: 'deleted', isEditing: false }
          : p
      );
      const ordered = recomputeOrder(items);
      return refreshStatus(ordered);
    });
  };

  // 삭제 취소
  const handleDeleteCancel = (title: string) => {
    setPromptsWithStatus((prev) => {
      const items = prev.map((p) =>
        p.changedPrompt.TITLE === title ? { ...p, changeStatus: undefined } : p
      );
      const ordered = recomputeOrder(items);
      return refreshStatus(ordered);
    });
  };

  // 전체 변경 취소(초기화)
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

  // 변경사항 저장
  const handleSaveChanges = () => {
    saveChangesMutate.mutate();
  };

  // 최초 데이터 로딩/변경 시 상태 초기화
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

  useEffect(() => {
    console.log(promptsWithStatus);
  }, [promptsWithStatus]);

  // 변경/삭제된 항목 추출
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

  // 훅에서 반환하는 값들
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
