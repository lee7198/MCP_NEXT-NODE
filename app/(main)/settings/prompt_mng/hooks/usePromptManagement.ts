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
    if (index === 0) return; // 첫 번째 항목은 위로 이동 불가
    // 배열 복사 (불변성 유지)
    const newPrompts = [...promptsWithStatus];
    // 현재 항목과 이전 항목 복사
    const currentItem = { ...newPrompts[index] };
    const prevItem = { ...newPrompts[index - 1] };
    // changedPrompt 기준으로 ORDER_NO(순서) 교환
    const tempOrder = currentItem.changedPrompt.ORDER_NO;
    currentItem.changedPrompt.ORDER_NO = prevItem.changedPrompt.ORDER_NO;
    prevItem.changedPrompt.ORDER_NO = tempOrder;
    // 실제 배열 내 위치도 교환
    newPrompts[index] = prevItem;
    newPrompts[index - 1] = currentItem;

    // 삭제된 항목을 제외한 전체 순서가 원본과 동일한지 확인
    const visiblePrompts = newPrompts.filter(
      (p) => p.changeStatus !== 'deleted'
    );
    const isOrderSameAsOriginal = visiblePrompts.every((p, idx) => {
      const originalIndex =
        prompts?.findIndex(
          (original) => original.ORDER_NO === p.original.ORDER_NO
        ) ?? -1;
      return originalIndex === idx;
    });

    // 전체 순서가 원본과 동일하면 모든 항목의 modified 상태 제거
    if (isOrderSameAsOriginal) {
      newPrompts.forEach((p) => {
        if (p.changeStatus === 'modified') {
          p.changeStatus = undefined;
        }
        // deleted 상태는 절대 변경하지 않음
      });
    } else {
      // 개별 항목별로 상태 설정 (순서 표시 로직과 동일하게)
      const visiblePrompts = newPrompts.filter(
        (p) => p.changeStatus !== 'deleted'
      );

      // 현재 항목의 원본 순서와 현재 순서 비교
      const currentOriginalIndex =
        prompts?.findIndex(
          (original) => original.ORDER_NO === currentItem.original.ORDER_NO
        ) ?? -1;
      const currentCurrentIndex = visiblePrompts.findIndex(
        (p) => p.changedPrompt.ORDER_NO === currentItem.changedPrompt.ORDER_NO
      );

      // 이전 항목의 원본 순서와 현재 순서 비교
      const prevOriginalIndex =
        prompts?.findIndex(
          (original) => original.ORDER_NO === prevItem.original.ORDER_NO
        ) ?? -1;
      const prevCurrentIndex = visiblePrompts.findIndex(
        (p) => p.changedPrompt.ORDER_NO === prevItem.changedPrompt.ORDER_NO
      );

      // deleted 상태는 절대 변경하지 않음
      if (currentItem.changeStatus !== 'deleted') {
        if (
          currentOriginalIndex === currentCurrentIndex &&
          currentCurrentIndex !== -1
        ) {
          currentItem.changeStatus = undefined;
        } else {
          currentItem.changeStatus = 'modified';
        }
      }

      if (prevItem.changeStatus !== 'deleted') {
        if (prevOriginalIndex === prevCurrentIndex && prevCurrentIndex !== -1) {
          prevItem.changeStatus = undefined;
        } else {
          prevItem.changeStatus = 'modified';
        }
      }
    }

    setPromptsWithStatus(newPrompts);
    // 애니메이션 효과 부여 (위로 이동)
    currentItem.isAnimating = true;
    currentItem.animationDirection = 'up';
    setTimeout(() => {
      setPromptsWithStatus((prev) =>
        prev.map((p) =>
          p.changedPrompt.ORDER_NO === currentItem.changedPrompt.ORDER_NO
            ? { ...p, isAnimating: false, animationDirection: null }
            : p
        )
      );
    }, 200);
    // 모든 항목의 수정모드 해제
    setPromptsWithStatus((prev) =>
      prev.map((p) => ({ ...p, isEditing: false }))
    );
  };

  // 프롬프트 순서 아래로 이동
  const handleMoveDown = (index: number) => {
    if (index === promptsWithStatus.length - 1) return; // 마지막 항목은 아래로 이동 불가
    // 배열 복사 (불변성 유지)
    const newPrompts = [...promptsWithStatus];
    // 현재 항목과 다음 항목 복사
    const currentItem = { ...newPrompts[index] };
    const nextItem = { ...newPrompts[index + 1] };
    // changedPrompt 기준으로 ORDER_NO(순서) 교환
    const tempOrder = currentItem.changedPrompt.ORDER_NO;
    currentItem.changedPrompt.ORDER_NO = nextItem.changedPrompt.ORDER_NO;
    nextItem.changedPrompt.ORDER_NO = tempOrder;
    // 실제 배열 내 위치도 교환
    newPrompts[index] = nextItem;
    newPrompts[index + 1] = currentItem;

    // 삭제된 항목을 제외한 전체 순서가 원본과 동일한지 확인
    const visiblePrompts = newPrompts.filter(
      (p) => p.changeStatus !== 'deleted'
    );
    const isOrderSameAsOriginal = visiblePrompts.every((p, idx) => {
      const originalIndex =
        prompts?.findIndex(
          (original) => original.ORDER_NO === p.original.ORDER_NO
        ) ?? -1;
      return originalIndex === idx;
    });

    // 전체 순서가 원본과 동일하면 모든 항목의 modified 상태 제거
    if (isOrderSameAsOriginal) {
      newPrompts.forEach((p) => {
        if (p.changeStatus === 'modified') {
          p.changeStatus = undefined;
        }
        // deleted 상태는 절대 변경하지 않음
      });
    } else {
      // 개별 항목별로 상태 설정 (순서 표시 로직과 동일하게)
      const visiblePrompts = newPrompts.filter(
        (p) => p.changeStatus !== 'deleted'
      );

      // 현재 항목의 원본 순서와 현재 순서 비교
      const currentOriginalIndex =
        prompts?.findIndex(
          (original) => original.ORDER_NO === currentItem.original.ORDER_NO
        ) ?? -1;
      const currentCurrentIndex = visiblePrompts.findIndex(
        (p) => p.changedPrompt.ORDER_NO === currentItem.changedPrompt.ORDER_NO
      );

      // 다음 항목의 원본 순서와 현재 순서 비교
      const nextOriginalIndex =
        prompts?.findIndex(
          (original) => original.ORDER_NO === nextItem.original.ORDER_NO
        ) ?? -1;
      const nextCurrentIndex = visiblePrompts.findIndex(
        (p) => p.changedPrompt.ORDER_NO === nextItem.changedPrompt.ORDER_NO
      );

      // deleted 상태는 절대 변경하지 않음
      if (currentItem.changeStatus !== 'deleted') {
        if (
          currentOriginalIndex === currentCurrentIndex &&
          currentCurrentIndex !== -1
        ) {
          currentItem.changeStatus = undefined;
        } else {
          currentItem.changeStatus = 'modified';
        }
      }

      if (nextItem.changeStatus !== 'deleted') {
        if (nextOriginalIndex === nextCurrentIndex && nextCurrentIndex !== -1) {
          nextItem.changeStatus = undefined;
        } else {
          nextItem.changeStatus = 'modified';
        }
      }
    }

    setPromptsWithStatus(newPrompts);
    // 애니메이션 효과 부여 (아래로 이동)
    currentItem.isAnimating = true;
    currentItem.animationDirection = 'down';
    setTimeout(() => {
      setPromptsWithStatus((prev) =>
        prev.map((p) =>
          p.changedPrompt.ORDER_NO === currentItem.changedPrompt.ORDER_NO
            ? { ...p, isAnimating: false, animationDirection: null }
            : p
        )
      );
    }, 200);
    // 모든 항목의 수정모드 해제
    setPromptsWithStatus((prev) =>
      prev.map((p) => ({ ...p, isEditing: false }))
    );
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
    setPromptsWithStatus((prev) =>
      prev.map((p) =>
        p.changedPrompt.TITLE === title
          ? {
              ...p,
              changedPrompt: { ...p.changedPrompt, PROMPT: value },
              changeStatus:
                value === p.original.PROMPT
                  ? undefined
                  : ('modified' as PromptChangeStatus),
            }
          : p
      )
    );
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
      return prev.map((p) => {
        if (p.changedPrompt.TITLE === title) {
          // 삭제 처리할 항목
          return {
            ...p,
            changeStatus:
              p.changeStatus === 'deleted'
                ? undefined
                : ('deleted' as PromptChangeStatus),
            isEditing: false,
          };
        } else if (p.changeStatus !== 'deleted') {
          // 삭제된 항목 아래에 있는 항목들은 순서가 바뀌므로 modified로 설정
          const originalIndex =
            prompts?.findIndex(
              (original) => original.ORDER_NO === p.original.ORDER_NO
            ) ?? -1;

          // 삭제된 항목을 제외한 현재 순서 계산
          const visiblePrompts = prev.filter(
            (item) =>
              item.changedPrompt.TITLE !== title &&
              item.changeStatus !== 'deleted'
          );
          const currentIndex = visiblePrompts.findIndex(
            (item) => item.changedPrompt.TITLE === p.changedPrompt.TITLE
          );

          // 원본 순서와 현재 순서가 다르면 modified로 설정
          if (originalIndex !== currentIndex && currentIndex !== -1) {
            console.log(
              '삭제 후 index 조정 ',
              originalIndex + 1,
              ' -> ',
              currentIndex + 1
            );
            return {
              ...p,
              changeStatus: 'modified' as PromptChangeStatus,
              changedPrompt: { ...p.changedPrompt, ORDER_NO: currentIndex + 1 },
            };
          }
        }
        return p;
      });
    });
  };

  // 삭제 취소
  const handleDeleteCancel = (title: string) => {
    setPromptsWithStatus((prev) => {
      return prev.map((p) => {
        if (p.changedPrompt.TITLE === title) {
          // 삭제 취소할 항목
          return { ...p, changeStatus: undefined };
        } else if (p.changeStatus === 'modified') {
          // 삭제 취소로 인해 순서가 원래대로 돌아간 항목들 확인
          const originalIndex =
            prompts?.findIndex(
              (original) => original.ORDER_NO === p.original.ORDER_NO
            ) ?? -1;

          // 삭제 취소된 항목을 포함한 현재 순서 계산
          const visiblePrompts = prev.filter(
            (item) =>
              item.changeStatus !== 'deleted' ||
              item.changedPrompt.TITLE === title
          );
          const currentIndex = visiblePrompts.findIndex(
            (item) => item.changedPrompt.TITLE === p.changedPrompt.TITLE
          );

          // 원본 순서와 현재 순서가 같으면 modified 상태 제거 & 되돌리기
          if (originalIndex === currentIndex && currentIndex !== -1) {
            return { ...p, changeStatus: undefined, changedPrompt: p.original };
          }
        }
        return p;
      });
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
