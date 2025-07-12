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
  getGridRowClassDeleted,
  getGridRowClassDefault,
  getGridRowClassChanged,
} from '@/app/components/common/GridStyles';
import { PromptTableProps } from '@/app/types';
import MultiToSpan from '../../../components/common/MultiToSpan';
import { AddPromptForm } from './AddPromptForm';

export function PromptTable({
  prompts,
  isPending,
  promptsWithStatus,
  editingIdx,
  deletingOrderNos,
  changedItems,
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
    { label: 'prompt', span: 7 },
    { label: '작업', span: 2 },
  ];
  const hasChanges =
    editingIdx !== null || changedItems.size > 0 || deletingOrderNos.size > 0;
  return (
    <div className={GRID_STYLES.container}>
      {isAdding && !hasChanges && (
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
          promptsWithStatus?.map((prompt, idx) => {
            return (
              <div
                key={idx}
                className={`${
                  // 삭제된 항목 체크
                  prompt.changeStatus === 'deleted'
                    ? getGridRowClassDeleted(
                        columns.reduce((acc, col) => acc + col.span, 0)
                      )
                    : // 수정된 항목 체크 (내용, 순서)
                      prompt.changeStatus === 'modified'
                      ? getGridRowClassChanged(
                          columns.reduce((acc, col) => acc + col.span, 0)
                        )
                      : getGridRowClassDefault(
                          columns.reduce((acc, col) => acc + col.span, 0)
                        )
                } ease-[cubic-bezier(0.18, 0.89, 0.32, 1.28)] transition-all duration-100 ${
                  prompt.isAnimating
                    ? prompt.animationDirection === 'up'
                      ? '-translate-y-[2px] transform'
                      : prompt.animationDirection === 'down'
                        ? 'translate-y-[2px] transform'
                        : ''
                    : ''
                }`}
              >
                <div className={`col-span-${columns[0].span}`}>
                  <span className={GRID_STYLES.cellMuted}>
                    {(() => {
                      const originalOrder =
                        prompts?.findIndex(
                          (p) => p.ORDER_NO === prompt.original.ORDER_NO
                        ) ?? -1;
                      const visiblePrompts = promptsWithStatus.filter(
                        (p) => p.changeStatus !== 'deleted'
                      );
                      const currentOrder = visiblePrompts.findIndex(
                        (p) =>
                          p.changedPrompt.ORDER_NO ===
                          prompt.changedPrompt.ORDER_NO
                      );
                      if (prompt.changeStatus === 'deleted') {
                        return `${originalOrder + 1} → 삭제`;
                      } else if (
                        originalOrder !== currentOrder &&
                        currentOrder !== -1
                      ) {
                        // 원본 순서와 현재 순서가 다르면 항상 표시
                        return `${originalOrder + 1} → ${currentOrder + 1}`;
                      } else if (currentOrder !== -1) {
                        // 순서 변화 없음
                        return `${currentOrder + 1}`;
                      } else {
                        // 삭제된 항목 등, 현재 그리드에 없는 경우
                        return '';
                      }
                    })()}
                  </span>
                </div>
                <div className={`col-span-${columns[1].span}`}>
                  <span className={GRID_STYLES.cellMuted}>
                    {prompt.changedPrompt.TITLE}
                  </span>
                </div>
                <div className={`col-span-${columns[2].span}`}>
                  {prompt.isEditing ? (
                    <textarea
                      className="w-full rounded border p-1 text-sm"
                      value={prompt.changedPrompt.PROMPT}
                      onChange={(e) =>
                        onPromptChange(
                          prompt.changedPrompt.TITLE,
                          e.target.value
                        )
                      }
                      rows={5}
                    />
                  ) : (
                    <span className={GRID_STYLES.cellMuted}>
                      {MultiToSpan({ input: prompt.changedPrompt.PROMPT })}
                    </span>
                  )}
                </div>

                {/* row 제어 */}
                <div className={`col-span-${columns[3].span}`}>
                  <div className="grid grid-cols-4 items-center justify-center justify-items-center-safe gap-2">
                    {/* 순서 올리기 */}
                    <button
                      onClick={() => onMoveUp(idx)}
                      disabled={idx === 0 || prompt.changeStatus === 'deleted'}
                      className={`aspect-square cursor-pointer rounded border border-gray-300 bg-gray-50 p-0.5 hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-500 dark:bg-zinc-700 dark:hover:bg-zinc-600 ${
                        idx === 0 || prompt.changeStatus === 'deleted'
                          ? 'opacity-50'
                          : ''
                      }`}
                    >
                      <ArrowUpIcon />
                    </button>
                    {/* 순서 내리기 */}
                    <button
                      onClick={() => onMoveDown(idx)}
                      disabled={
                        idx === promptsWithStatus.length - 1 ||
                        prompt.changeStatus === 'deleted'
                      }
                      className={`aspect-square cursor-pointer rounded border border-gray-300 bg-gray-50 p-0.5 hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-500 dark:bg-zinc-700 dark:hover:bg-zinc-600 ${
                        idx === promptsWithStatus.length - 1 ||
                        prompt.changeStatus === 'deleted'
                          ? 'opacity-50'
                          : ''
                      }`}
                    >
                      <ArrowDownIcon />
                    </button>
                    {/* 수정 */}
                    {prompt.isEditing ? (
                      // 수정 취소
                      <>
                        <button
                          className="col-span-2 w-full cursor-pointer rounded border border-black bg-gray-800 p-0.5 text-xs text-white hover:bg-gray-700 dark:border-zinc-500 dark:bg-zinc-800 dark:hover:bg-zinc-700"
                          onClick={onEditCancel}
                        >
                          되돌리기
                        </button>

                        <button
                          className="col-span-4 w-full cursor-pointer rounded border border-gray-300 bg-gray-50 p-0.5 text-xs hover:bg-gray-200 dark:border-zinc-500 dark:text-black"
                          onClick={() =>
                            onApplyChanges(prompt.changedPrompt.TITLE)
                          }
                        >
                          변경사항 적용
                        </button>
                      </>
                    ) : prompt.changeStatus === 'deleted' ? null : (
                      <button
                        className="aspect-square cursor-pointer rounded border border-gray-300 bg-gray-50 p-0.5 hover:bg-gray-200 dark:border-zinc-500 dark:bg-zinc-700 dark:hover:bg-zinc-600"
                        onClick={() => onEditClick(prompt.changedPrompt.TITLE)}
                      >
                        <PencilSimpleIcon />
                      </button>
                    )}
                    {/* 삭제 */}
                    {prompt.changeStatus === 'deleted' ? (
                      // 삭제 취소
                      <button
                        className="col-span-2 w-full cursor-pointer rounded border border-black bg-gray-800 p-0.5 text-xs break-keep text-white hover:bg-gray-700 dark:border-zinc-500 dark:bg-zinc-900 dark:text-white dark:hover:bg-zinc-800"
                        onClick={() =>
                          onDeleteCancel(prompt.changedPrompt.TITLE)
                        }
                      >
                        삭제 취소
                      </button>
                    ) : prompt.isEditing ? null : (
                      <button
                        className="aspect-square cursor-pointer rounded border border-gray-300 bg-gray-50 p-0.5 hover:bg-gray-200 dark:border-zinc-500 dark:bg-zinc-700 dark:hover:bg-zinc-600"
                        onClick={() =>
                          onDeleteClick(prompt.changedPrompt.TITLE)
                        }
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
