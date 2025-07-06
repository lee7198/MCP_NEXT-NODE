'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowDownIcon,
  ArrowUpIcon,
  CaretLeftIcon,
  PencilSimpleIcon,
  TrashIcon,
} from '@phosphor-icons/react/dist/ssr';
import { useQuery } from '@tanstack/react-query';
import { message_management } from '@/app/services/api';
import { useSession } from 'next-auth/react';
import {
  getColSpanClass,
  GRID_STYLES,
  GridHeader,
  LoadingSkeleton,
  getGridRowClass2,
  getGridRowClass,
  getGridRowClass3,
} from '@/app/components/common/GridStyles';
import { UserPromptResponse } from '@/app/types';

export default function Prompt_Mng() {
  const { data: session } = useSession();
  const [modifiedPrompts, setModifiedPrompts] = useState<UserPromptResponse[]>(
    []
  );
  const [changedItems, setChangedItems] = useState<Set<number>>(new Set());
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [deletingOrderNos, setDeletingOrderNos] = useState<Set<number>>(
    new Set()
  );

  const { data: prompts, isPending } = useQuery({
    queryKey: ['prompts'],
    queryFn: () => message_management.getMyPrompt(session?.user.email || ''),
    enabled: !!session?.user.email,
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

    // 수정 모드가 활성화되어 있으면 수정 모드 종료
    if (editingIdx !== null) {
      setEditingIdx(null);
    }

    // 삭제 모드가 활성화되어 있으면 삭제 모드도 함께 이동
    if (deletingOrderNos.size > 0) {
      const newDeletingOrderNos = new Set(deletingOrderNos);
      if (newDeletingOrderNos.has(currentItem.ORDER_NO)) {
        // 현재 항목이 삭제 모드였다면, 이제 prevItem의 ORDER_NO로 변경
        newDeletingOrderNos.delete(currentItem.ORDER_NO);
        newDeletingOrderNos.add(prevItem.ORDER_NO);
      } else if (newDeletingOrderNos.has(prevItem.ORDER_NO)) {
        // 이전 항목이 삭제 모드였다면, 이제 currentItem의 ORDER_NO로 변경
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

    // 수정 모드가 활성화되어 있으면 수정 모드 종료
    if (editingIdx !== null) {
      setEditingIdx(null);
    }

    // 삭제 모드가 활성화되어 있으면 삭제 모드도 함께 이동
    if (deletingOrderNos.size > 0) {
      const newDeletingOrderNos = new Set(deletingOrderNos);
      if (newDeletingOrderNos.has(currentItem.ORDER_NO)) {
        // 현재 항목이 삭제 모드였다면, 이제 nextItem의 ORDER_NO로 변경
        newDeletingOrderNos.delete(currentItem.ORDER_NO);
        newDeletingOrderNos.add(nextItem.ORDER_NO);
      } else if (newDeletingOrderNos.has(nextItem.ORDER_NO)) {
        // 다음 항목이 삭제 모드였다면, 이제 currentItem의 ORDER_NO로 변경
        newDeletingOrderNos.delete(nextItem.ORDER_NO);
        newDeletingOrderNos.add(currentItem.ORDER_NO);
      }
      setDeletingOrderNos(newDeletingOrderNos);
    }
  };

  const columns = [
    { label: '순서', span: 1 },
    { label: '*prompt명', span: 2 },
    { label: 'porompt', span: 7 },
    { label: '작업', span: 2 },
  ];

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

    // 현재 수정 중인 항목의 ORDER_NO
    const currentOrderNo = modifiedPrompts[editingIdx].ORDER_NO;

    // 원본 prompts에서 같은 ORDER_NO를 가진 항목 찾기
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

    // 수정한 내역이 이미 modifiedPrompts에 반영되어 있으므로
    // 추가 작업 없이 수정 모드만 해제
    setEditingIdx(null);
  };

  const handleDeleteClick = (orderNo: number) => {
    setDeletingOrderNos((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(orderNo)) {
        newSet.delete(orderNo); // 이미 체크되어 있으면 해제
      } else {
        newSet.add(orderNo); // 체크되지 않았으면 추가
      }
      return newSet;
    });
    setEditingIdx(null); // 삭제 모드 시작 시 수정 모드 종료
  };

  const handleDeleteCancel = (orderNo: number) => {
    setDeletingOrderNos((prev) => {
      const newSet = new Set(prev);
      newSet.delete(orderNo);
      return newSet;
    });
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

    // 삭제 체크된 항목이 있는지 확인
    const hasDeletions = deletingOrderNos.size > 0;

    if (hasDeletions) {
      // 삭제 체크된 항목을 제외하고 순서를 다시 계산
      let currentOrder = 1;

      modifiedPrompts.forEach((item) => {
        const isDeleted = deletingOrderNos.has(item.ORDER_NO);

        if (!isDeleted) {
          // 원본에서 같은 ORDER_NO를 가진 항목의 원래 순서 찾기
          const originalItem = prompts.find(
            (p) => p.ORDER_NO === item.ORDER_NO
          );
          if (originalItem) {
            const originalIndex = prompts.findIndex(
              (p) => p.ORDER_NO === item.ORDER_NO
            );
            const originalOrderInList = originalIndex + 1;

            // 현재 순서와 원래 순서가 다르면 변경된 것으로 간주
            if (currentOrder !== originalOrderInList) {
              newChanged.add(item.ORDER_NO);
            }
          }
          currentOrder++;
        }

        // PROMPT가 변경된 경우도 추가
        const originalItem = prompts.find((p) => p.ORDER_NO === item.ORDER_NO);
        if (originalItem && item.PROMPT !== originalItem.PROMPT) {
          newChanged.add(item.ORDER_NO);
        }
      });
    } else {
      // 삭제 체크된 항목이 없으면 기존 로직 사용
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

  return (
    <div className="container mx-auto bg-gray-50 p-6 dark:bg-zinc-900">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="flex items-center gap-2 text-2xl font-bold text-gray-900 dark:text-zinc-100">
          <Link
            href="/settings"
            className="text-gray-900 hover:text-gray-600 dark:text-zinc-100 dark:hover:text-gray-300"
          >
            <CaretLeftIcon size={24} weight="bold" />
          </Link>
          <span>프롬프트 관리</span>
        </h1>
      </div>

      <div className={GRID_STYLES.container}>
        <GridHeader
          columns={columns}
          totalColumns={columns.reduce((acc, col) => acc + col.span, 0)}
        />
        <div className={GRID_STYLES.divider}>
          {isPending ? (
            <LoadingSkeleton
              columns={columns}
              totalColumns={columns.reduce((acc, col) => acc + col.span, 0)}
            />
          ) : (
            modifiedPrompts?.map((prompt, idx) => {
              return (
                <div
                  key={idx}
                  className={`${
                    // 삭제된 항목 체크
                    deletingOrderNos.has(prompt.ORDER_NO)
                      ? getGridRowClass3(
                          columns.reduce((acc, col) => acc + col.span, 0)
                        )
                      : // 수정된 항목 체크 (내용, 순서)
                        changedItems.has(prompt.ORDER_NO)
                        ? getGridRowClass2(
                            columns.reduce((acc, col) => acc + col.span, 0)
                          )
                        : getGridRowClass(
                            columns.reduce((acc, col) => acc + col.span, 0)
                          )
                  }`}
                >
                  <div className={getColSpanClass(columns[0].span)}>
                    <span className={GRID_STYLES.cellMuted}>
                      {deletingOrderNos.has(prompt.ORDER_NO)
                        ? '삭제'
                        : (() => {
                            // 삭제 체크되지 않은 항목들 중에서 현재 항목의 순서 계산
                            let displayOrder = 1;
                            for (let i = 0; i < modifiedPrompts.length; i++) {
                              if (i === idx) break;
                              if (
                                !deletingOrderNos.has(
                                  modifiedPrompts[i].ORDER_NO
                                )
                              ) {
                                displayOrder++;
                              }
                            }
                            return displayOrder;
                          })()}
                    </span>
                  </div>
                  <div className={getColSpanClass(columns[1].span)}>
                    <span className={GRID_STYLES.cellMuted}>
                      {prompt.TITLE}
                    </span>
                  </div>
                  <div className={getColSpanClass(columns[2].span)}>
                    {editingIdx === idx ? (
                      <textarea
                        className="w-full rounded border p-1 text-sm"
                        value={prompt.PROMPT}
                        onChange={(e) =>
                          handlePromptChange(idx, e.target.value)
                        }
                        rows={5}
                      />
                    ) : (
                      <span className={GRID_STYLES.cellMuted}>
                        {prompt.PROMPT}
                      </span>
                    )}
                  </div>

                  {/* row 제어 */}
                  <div className={getColSpanClass(columns[3].span)}>
                    <div className="grid grid-cols-4 items-center justify-center justify-items-center-safe gap-2">
                      {/* 순서 올리기 */}
                      <button
                        onClick={() => handleMoveUp(idx)}
                        disabled={idx === 0}
                        className={`aspect-square cursor-pointer rounded border border-gray-300 bg-gray-50 p-0.5 hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50 ${
                          idx === 0 ? 'opacity-50' : ''
                        }`}
                      >
                        <ArrowUpIcon />
                      </button>
                      {/* 순서 내리기 */}
                      <button
                        onClick={() => handleMoveDown(idx)}
                        disabled={idx === modifiedPrompts.length - 1}
                        className={`aspect-square cursor-pointer rounded border border-gray-300 bg-gray-50 p-0.5 hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50 ${
                          idx === modifiedPrompts.length - 1 ? 'opacity-50' : ''
                        }`}
                      >
                        <ArrowDownIcon />
                      </button>
                      {/* 수정 */}
                      {editingIdx === idx ? (
                        // 수정 취소
                        <>
                          <button
                            className="col-span-2 w-full cursor-pointer rounded border border-black bg-gray-800 p-0.5 text-xs text-white hover:bg-gray-700"
                            onClick={handleEditCancel}
                          >
                            되돌리기
                          </button>

                          <button
                            className="col-span-4 w-full cursor-pointer rounded border border-gray-300 bg-gray-50 p-0.5 text-xs hover:bg-gray-200"
                            onClick={handleApplyChanges}
                          >
                            변경사항 적용
                          </button>
                        </>
                      ) : deletingOrderNos.has(prompt.ORDER_NO) ? null : (
                        <button
                          className="aspect-square cursor-pointer rounded border border-gray-300 bg-gray-50 p-0.5 hover:bg-gray-200"
                          onClick={() => handleEditClick(idx)}
                        >
                          <PencilSimpleIcon />
                        </button>
                      )}
                      {/* 삭제 */}
                      {deletingOrderNos.has(prompt.ORDER_NO) ? (
                        // 삭제 취소
                        <button
                          className="col-span-2 w-full cursor-pointer rounded border border-black bg-gray-800 p-0.5 text-xs text-white hover:bg-gray-700"
                          onClick={() => handleDeleteCancel(prompt.ORDER_NO)}
                        >
                          삭제 취소
                        </button>
                      ) : editingIdx === idx ? null : (
                        <button
                          className="aspect-square cursor-pointer rounded border border-gray-300 bg-gray-50 p-0.5 hover:bg-gray-200"
                          onClick={() => handleDeleteClick(prompt.ORDER_NO)}
                        >
                          <TrashIcon />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
