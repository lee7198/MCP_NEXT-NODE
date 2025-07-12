'use client';

import React from 'react';
import Link from 'next/link';
import { CaretLeftIcon } from '@phosphor-icons/react/dist/ssr';
import { PromptHeaderProps } from '@/app/types';
import Spinner from '@/app/(main)/components/common/Spinner';

export function PromptHeader({
  isAdding,
  editingIdx,
  changedItems,
  deletingOrderNos,
  isSaving,
  onAddClick,
  onCancel,
  onSave,
}: PromptHeaderProps) {
  const hasChanges =
    editingIdx !== null || changedItems.size > 0 || deletingOrderNos.size > 0;

  return (
    <div className="mb-6 flex items-center justify-between">
      <h1 className="flex items-center gap-2 text-2xl font-bold text-gray-900 dark:text-zinc-100">
        <Link
          href="/settings"
          className="text-gray-900 hover:text-gray-600 dark:text-zinc-100 dark:hover:text-gray-300"
        >
          <CaretLeftIcon size={24} weight="bold" />
        </Link>
        <span>PROMPT 관리</span>
      </h1>
      <div>
        {hasChanges ? (
          isSaving ? (
            <Spinner size={8} />
          ) : (
            <div className="flex gap-2">
              <button
                onClick={onCancel}
                className="cursor-pointer rounded-md border px-4 py-2 text-xs font-medium text-gray-600 hover:bg-gray-200 dark:border-zinc-500 dark:bg-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                취소
              </button>
              <button
                onClick={onSave}
                disabled={isSaving}
                className={`cursor-pointer rounded-md border px-4 py-2 text-xs font-medium dark:border-zinc-600 ${
                  isSaving
                    ? 'cursor-not-allowed bg-gray-400 text-gray-200 dark:bg-zinc-300'
                    : 'bg-zinc-600 text-white hover:bg-gray-800 dark:bg-zinc-100 dark:text-zinc-800 dark:hover:bg-zinc-200'
                }`}
              >
                {isSaving ? '저장 중...' : '저장'}
              </button>
            </div>
          )
        ) : (
          !isAdding && (
            <button
              onClick={onAddClick}
              className="cursor-pointer rounded-md border px-4 py-2 text-xs font-medium text-gray-600 hover:bg-gray-200 dark:border-zinc-500 dark:bg-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              Prompt 추가
            </button>
          )
        )}
      </div>
    </div>
  );
}
