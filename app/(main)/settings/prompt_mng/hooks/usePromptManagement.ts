'use client';

import { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { message_management } from '@/app/services/api';
import {
  UserPromptResponse,
  SaveUserPromptRequest,
  PromptStatus,
} from '@/app/types';
import { toast } from 'react-toastify';

export function usePromptManagement() {
  const { data: session } = useSession();
  const [modifiedPrompts, setModifiedPrompts] = useState<UserPromptResponse[]>(
    []
  );
  const [changedItems, setChangedItems] = useState<Set<number>>(new Set());
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [deletingOrderNos, setDeletingOrderNos] = useState<Set<number>>(
    new Set()
  );
  const [animatingOrderNo, setAnimatingOrderNo] = useState<number | null>(null);
  const [animationDirection, setAnimationDirection] = useState<
    'up' | 'down' | null
  >(null);

  const {
    data: prompts,
    isPending,
    refetch,
  } = useQuery({
    queryKey: ['prompts'],
    queryFn: () => message_management.getUserPrompt(session?.user.email || ''),
    enabled: !!session?.user.email,
  });

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

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const newPrompts = [...modifiedPrompts];
    const currentItem = newPrompts[index];
    const prevItem = newPrompts[index - 1];
    const tempOrder = currentItem.ORDER_NO;
    currentItem.ORDER_NO = prevItem.ORDER_NO;
    prevItem.ORDER_NO = tempOrder;
    newPrompts[index] = prevItem;
    newPrompts[index - 1] = currentItem;
    setModifiedPrompts(newPrompts);

    // 애니메이션 시작
    setAnimatingOrderNo(currentItem.ORDER_NO);
    setAnimationDirection('up');
    setTimeout(() => {
      setAnimatingOrderNo(null);
      setAnimationDirection(null);
    }, 200);

    // 수정 모드가 활성화되어 있으면 수정 모드 종료
    if (editingIdx !== null) {
      setEditingIdx(null);
    }

    // 삭제 모드가 활성화되어 있으면 삭제 모드도 함께 이동
    if (deletingOrderNos.size > 0) {
      const newDeletingOrderNos = new Set(deletingOrderNos);
      if (newDeletingOrderNos.has(currentItem.ORDER_NO)) {
        newDeletingOrderNos.delete(currentItem.ORDER_NO);
        newDeletingOrderNos.add(prevItem.ORDER_NO);
      } else if (newDeletingOrderNos.has(prevItem.ORDER_NO)) {
        newDeletingOrderNos.delete(prevItem.ORDER_NO);
        newDeletingOrderNos.add(currentItem.ORDER_NO);
      }
      setDeletingOrderNos(newDeletingOrderNos);
    }
  };

  const handleMoveDown = (index: number) => {
    if (index === modifiedPrompts.length - 1) return;
    const newPrompts = [...modifiedPrompts];
    const currentItem = newPrompts[index];
    const nextItem = newPrompts[index + 1];
    const tempOrder = currentItem.ORDER_NO;
    currentItem.ORDER_NO = nextItem.ORDER_NO;
    nextItem.ORDER_NO = tempOrder;
    newPrompts[index] = nextItem;
    newPrompts[index + 1] = currentItem;
    setModifiedPrompts(newPrompts);

    // 애니메이션 시작
    setAnimatingOrderNo(currentItem.ORDER_NO);
    setAnimationDirection('down');
    setTimeout(() => {
      setAnimatingOrderNo(null);
      setAnimationDirection(null);
    }, 200);

    // 수정 모드가 활성화되어 있으면 수정 모드 종료
    if (editingIdx !== null) {
      setEditingIdx(null);
    }

    // 삭제 모드가 활성화되어 있으면 삭제 모드도 함께 이동
    if (deletingOrderNos.size > 0) {
      const newDeletingOrderNos = new Set(deletingOrderNos);
      if (newDeletingOrderNos.has(currentItem.ORDER_NO)) {
        newDeletingOrderNos.delete(currentItem.ORDER_NO);
        newDeletingOrderNos.add(nextItem.ORDER_NO);
      } else if (newDeletingOrderNos.has(nextItem.ORDER_NO)) {
        newDeletingOrderNos.delete(nextItem.ORDER_NO);
        newDeletingOrderNos.add(currentItem.ORDER_NO);
      }
      setDeletingOrderNos(newDeletingOrderNos);
    }
  };

  const handleEditClick = (idx: number) => {
    setEditingIdx(idx);
  };

  const handlePromptChange = (idx: number, value: string) => {
    setModifiedPrompts((prev) => {
      const newArr = [...prev];
      newArr[idx] = { ...newArr[idx], PROMPT: value };
      return newArr;
    });
  };

  const handleEditCancel = () => {
    if (editingIdx === null || !prompts) return;

    const currentOrderNo = modifiedPrompts[editingIdx].ORDER_NO;
    const originalItem = prompts.find((p) => p.ORDER_NO === currentOrderNo);

    if (originalItem) {
      setModifiedPrompts((prev) => {
        const newArr = [...prev];
        newArr[editingIdx] = { ...originalItem };
        return newArr;
      });
    }

    setEditingIdx(null);
  };

  const handleApplyChanges = () => {
    if (editingIdx === null) return;
    setEditingIdx(null);
  };

  const handleDeleteClick = (orderNo: number) => {
    setDeletingOrderNos((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(orderNo)) {
        newSet.delete(orderNo);
      } else {
        newSet.add(orderNo);
      }
      return newSet;
    });
    setEditingIdx(null);
  };

  const handleDeleteCancel = (orderNo: number) => {
    setDeletingOrderNos((prev) => {
      const newSet = new Set(prev);
      newSet.delete(orderNo);
      return newSet;
    });
  };

  const handleCancelAll = () => {
    setEditingIdx(null);
    setChangedItems(new Set());
    setDeletingOrderNos(new Set());
    if (prompts) {
      setModifiedPrompts([...prompts]);
    }
  };

  const handleSaveChanges = () => {
    console.log('변경사항 저장');
    // TODO: 실제 저장 로직 구현
  };

  // init
  useEffect(() => {
    if (prompts) {
      setModifiedPrompts([...prompts]);
      setChangedItems(new Set());
      setEditingIdx(null);
      setDeletingOrderNos(new Set());
    }
  }, [prompts]);

  // 수정 후 기존 data와 같은지 비교
  useEffect(() => {
    if (!prompts) return;
    const newChanged = new Set<number>();

    const hasDeletions = deletingOrderNos.size > 0;

    if (hasDeletions) {
      let currentOrder = 1;

      modifiedPrompts.forEach((item) => {
        const isDeleted = deletingOrderNos.has(item.ORDER_NO);

        if (!isDeleted) {
          const originalItem = prompts.find(
            (p) => p.ORDER_NO === item.ORDER_NO
          );
          if (originalItem) {
            const originalIndex = prompts.findIndex(
              (p) => p.ORDER_NO === item.ORDER_NO
            );
            const originalOrderInList = originalIndex + 1;

            if (currentOrder !== originalOrderInList) {
              newChanged.add(item.ORDER_NO);
            }
          }
          currentOrder++;
        }

        const originalItem = prompts.find((p) => p.ORDER_NO === item.ORDER_NO);
        if (originalItem && item.PROMPT !== originalItem.PROMPT) {
          newChanged.add(item.ORDER_NO);
        }
      });
    } else {
      modifiedPrompts.forEach((item, idx) => {
        if (
          item.ORDER_NO !== prompts[idx]?.ORDER_NO ||
          item.PROMPT !== prompts[idx]?.PROMPT
        ) {
          newChanged.add(item.ORDER_NO);
        }
      });
    }

    setChangedItems(newChanged);
  }, [modifiedPrompts, prompts, deletingOrderNos]);

  return {
    prompts,
    isPending,
    modifiedPrompts,
    editingIdx,
    deletingOrderNos,
    changedItems,
    animatingOrderNo,
    animationDirection,
    addMutate,
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
