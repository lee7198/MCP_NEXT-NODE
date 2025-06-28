import React from 'react';
import { McpTableProps } from '@/app/types';

export const McpTable: React.FC<McpTableProps> = ({
  mcpTools,
  onEdit,
  onDelete,
  editedTools,
  setEditedTools,
  isPending,
}) => {
  return (
    <>
      {isPending ? (
        <div className="grid grid-cols-8 gap-4 p-4">
          <div className="col-span-2 my-1 h-4 w-24 animate-pulse rounded-lg bg-gray-300 dark:bg-zinc-600" />
          <div className="col-span-4 my-1 h-4 w-32 animate-pulse rounded-lg bg-gray-300 dark:bg-zinc-600" />
          <div className="col-span-2 my-1 h-4 w-16 animate-pulse rounded-lg bg-gray-300 dark:bg-zinc-600" />
        </div>
      ) : (
        <div className="divide-y divide-gray-200 dark:divide-zinc-700">
          {mcpTools.map((tool) => {
            const isEditing = editedTools[tool.TOOLNAME];
            const currentTool = isEditing || tool;

            return (
              <div
                key={tool.TOOLNAME}
                className="grid grid-cols-8 gap-4 p-4 hover:bg-gray-50 dark:hover:bg-zinc-700"
              >
                <div className="col-span-2 text-sm font-medium text-gray-900 dark:text-zinc-100">
                  {tool.TOOLNAME}
                </div>
                <div className="col-span-4 text-sm text-gray-500 dark:text-zinc-400">
                  {isEditing ? (
                    <input
                      type="text"
                      value={currentTool.COMMENT}
                      onChange={(e) =>
                        setEditedTools((prev) => ({
                          ...prev,
                          [tool.TOOLNAME]: {
                            ...currentTool,
                            COMMENT: e.target.value,
                          },
                        }))
                      }
                      className="w-full rounded-md border border-gray-300 bg-white px-2 text-sm text-gray-900 dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-100"
                    />
                  ) : (
                    currentTool.COMMENT
                  )}
                </div>
                <div className="col-span-2 flex justify-between gap-2">
                  <button
                    onClick={() => onEdit(currentTool)}
                    className="w-full cursor-pointer rounded-md bg-gray-100 px-2 py-1 text-xs text-gray-600 hover:bg-gray-200 dark:bg-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-600"
                  >
                    {isEditing ? '취소' : '수정'}
                  </button>
                  {isEditing && (
                    <button
                      onClick={() => onDelete(currentTool.TOOLNAME)}
                      className="w-full cursor-pointer rounded-md bg-red-100 px-2 py-1 text-xs text-gray-600 hover:bg-red-200 dark:bg-red-900 dark:text-red-200 dark:hover:bg-red-800"
                    >
                      삭제
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};
