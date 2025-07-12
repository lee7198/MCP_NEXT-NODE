'use client';

import React from 'react';
import {
  ArrowDownIcon,
  ArrowUpIcon,
  PencilSimpleIcon,
  TrashIcon,
} from '@phosphor-icons/react/dist/ssr';
import {
  GRID_STYLES,
  GridHeader,
  LoadingSkeleton,
  getGridRowClass2,
  getGridRowClass,
  getGridRowClass3,
} from '@/app/components/common/GridStyles';
import { PromptTableProps } from '@/app/types';
import MultiToSpan from '../../../components/common/MultiToSpan';
import { AddPromptForm } from './AddPromptForm';

export function PromptTable({
  prompts,
  isPending,
  modifiedPrompts,
  editingIdx,
  deletingOrderNos,
  changedItems,
  animatingOrderNo,
  animationDirection,
  onMoveUp,
  onMoveDown,
  onEditClick,
  onPromptChange,
  onEditCancel,
  onApplyChanges,
  onDeleteClick,
  onDeleteCancel,
  isAdding,
  addMutate,
  onAddCancel,
  onAdd,
}: PromptTableProps) {
  const columns = [
    { label: '순서', span: 1 },
    { label: '*prompt명', span: 2 },
    { label: 'porompt', span: 7 },
    { label: '작업', span: 2 },
  ];
  return (
    <div className={GRID_STYLES.container}>
      {isAdding && (
        <AddPromptForm
          onCancel={onAddCancel}
          onAdd={onAdd}
          isSaving={addMutate.isPending}
        />
      )}
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
                } ease-[cubic-bezier(0.18, 0.89, 0.32, 1.28)] transition-all duration-100 ${
                  animatingOrderNo === prompt.ORDER_NO
                    ? animationDirection === 'up'
                      ? '-translate-y-[2px] transform'
                      : animationDirection === 'down'
                        ? 'translate-y-[2px] transform'
                        : ''
                    : ''
                }`}
              >
                <div className={`col-span-${columns[0].span}`}>
                  <span className={GRID_STYLES.cellMuted}>
                    {(() => {
                      // 원본에서 현재 항목의 초기 순서 찾기
                      const originalIndex =
                        prompts?.findIndex(
                          (p) => p.ORDER_NO === prompt.ORDER_NO
                        ) ?? -1;
                      const originalOrder = originalIndex + 1;

                      // 삭제 체크되지 않은 항목들 중에서 현재 항목의 순서 계산
                      let currentOrder = 1;
                      for (let i = 0; i < modifiedPrompts.length; i++) {
                        if (i === idx) break;
                        if (
                          !deletingOrderNos.has(modifiedPrompts[i].ORDER_NO)
                        ) {
                          currentOrder++;
                        }
                      }

                      // 변경사항이 있는지 확인
                      const isDeleted = deletingOrderNos.has(prompt.ORDER_NO);
                      const isChanged = changedItems.has(prompt.ORDER_NO);

                      if (isDeleted) {
                        return `${originalOrder} → 삭제`;
                      } else if (isChanged) {
                        return `${originalOrder} → ${currentOrder}`;
                      } else {
                        return currentOrder.toString();
                      }
                    })()}
                  </span>
                </div>
                <div className={`col-span-${columns[1].span}`}>
                  <span className={GRID_STYLES.cellMuted}>{prompt.TITLE}</span>
                </div>
                <div className={`col-span-${columns[2].span}`}>
                  {editingIdx === idx ? (
                    <textarea
                      className="w-full rounded border p-1 text-sm"
                      value={prompt.PROMPT}
                      onChange={(e) => onPromptChange(idx, e.target.value)}
                      rows={5}
                    />
                  ) : (
                    <span className={GRID_STYLES.cellMuted}>
                      {MultiToSpan({ input: prompt.PROMPT })}
                    </span>
                  )}
                </div>

                {/* row 제어 */}
                <div className={`col-span-${columns[3].span}`}>
                  <div className="grid grid-cols-4 items-center justify-center justify-items-center-safe gap-2">
                    {/* 순서 올리기 */}
                    <button
                      onClick={() => onMoveUp(idx)}
                      disabled={idx === 0}
                      className={`aspect-square cursor-pointer rounded border border-gray-300 bg-gray-50 p-0.5 hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50 ${
                        idx === 0 ? 'opacity-50' : ''
                      }`}
                    >
                      <ArrowUpIcon />
                    </button>
                    {/* 순서 내리기 */}
                    <button
                      onClick={() => onMoveDown(idx)}
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
                          onClick={onEditCancel}
                        >
                          되돌리기
                        </button>

                        <button
                          className="col-span-4 w-full cursor-pointer rounded border border-gray-300 bg-gray-50 p-0.5 text-xs hover:bg-gray-200"
                          onClick={onApplyChanges}
                        >
                          변경사항 적용
                        </button>
                      </>
                    ) : deletingOrderNos.has(prompt.ORDER_NO) ? null : (
                      <button
                        className="aspect-square cursor-pointer rounded border border-gray-300 bg-gray-50 p-0.5 hover:bg-gray-200"
                        onClick={() => onEditClick(idx)}
                      >
                        <PencilSimpleIcon />
                      </button>
                    )}
                    {/* 삭제 */}
                    {deletingOrderNos.has(prompt.ORDER_NO) ? (
                      // 삭제 취소
                      <button
                        className="col-span-2 w-full cursor-pointer rounded border border-black bg-gray-800 p-0.5 text-xs break-keep text-white hover:bg-gray-700"
                        onClick={() => onDeleteCancel(prompt.ORDER_NO)}
                      >
                        삭제 취소
                      </button>
                    ) : editingIdx === idx ? null : (
                      <button
                        className="aspect-square cursor-pointer rounded border border-gray-300 bg-gray-50 p-0.5 hover:bg-gray-200"
                        onClick={() => onDeleteClick(prompt.ORDER_NO)}
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
  );
}
