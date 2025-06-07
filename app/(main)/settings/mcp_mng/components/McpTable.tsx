import React from 'react';
import { McpTableProps } from '@/app/types/management';

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
          <div className="col-span-2 my-1 h-4 w-24 animate-pulse rounded-lg bg-gray-300" />
          <div className="col-span-4 my-1 h-4 w-32 animate-pulse rounded-lg bg-gray-300" />
          <div className="col-span-2 my-1 h-4 w-16 animate-pulse rounded-lg bg-gray-300" />
        </div>
      ) : (
        <div className="divide-y divide-gray-200">
          {mcpTools.map((tool) => {
            const isEditing = editedTools[tool.TOOLNAME];
            const currentTool = isEditing || tool;

            return (
              <div
                key={tool.TOOLNAME}
                className="grid grid-cols-8 gap-4 p-4 hover:bg-gray-50"
              >
                <div className="col-span-2 text-sm font-medium text-gray-900">
                  {tool.TOOLNAME}
                </div>
                <div className="col-span-4 text-sm text-gray-500">
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
                      className="w-full rounded-md border border-gray-300 px-2 text-sm"
                    />
                  ) : (
                    currentTool.COMMENT
                  )}
                </div>
                <div className="col-span-2 flex justify-between gap-2">
                  <button
                    onClick={() => onEdit(currentTool)}
                    className="w-full cursor-pointer rounded-md bg-gray-100 px-2 py-1 text-xs text-gray-600 hover:bg-gray-200"
                  >
                    {isEditing ? '취소' : '수정'}
                  </button>
                  {isEditing && (
                    <button
                      onClick={() => onDelete(currentTool.TOOLNAME)}
                      className="w-full cursor-pointer rounded-md bg-red-100 px-2 py-1 text-xs text-gray-600 hover:bg-red-200"
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
