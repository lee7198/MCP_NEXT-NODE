'use client';

import React from 'react';
import Link from 'next/link';
import { CaretLeftIcon } from '@phosphor-icons/react/dist/ssr';
import { PromptHeaderProps } from '@/app/types';

export function PromptHeader({
  isAdding,
  editingIdx,
  changedItems,
  deletingOrderNos,
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
          <div className="flex gap-2">
            <button
              onClick={onCancel}
              className="cursor-pointer rounded-md border px-4 py-2 text-xs font-medium text-gray-600 hover:bg-gray-200"
            >
              취소
            </button>
            <button
              onClick={onSave}
              className="cursor-pointer rounded-md border bg-gray-600 px-4 py-2 text-xs font-medium text-white hover:bg-gray-800 dark:bg-zinc-700 dark:hover:bg-zinc-600"
            >
              저장
            </button>
          </div>
        ) : (
          !isAdding && (
            <button
              onClick={onAddClick}
              className="cursor-pointer rounded-md border bg-gray-600 px-4 py-2 text-xs font-medium text-white hover:bg-gray-800 dark:bg-zinc-700 dark:hover:bg-zinc-600"
            >
              Prompt 추가
            </button>
          )
        )}
      </div>
    </div>
  );
}
