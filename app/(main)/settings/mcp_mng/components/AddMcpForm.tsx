import React, { useState } from 'react';
import { AddMcpFormProps, McpToolRes } from '@/app/types';

export const AddMcpForm: React.FC<AddMcpFormProps> = ({ onAdd, onCancel }) => {
  const [newTool, setNewTool] = useState<Partial<McpToolRes>>({
    TOOLNAME: '',
    COMMENT: '',
  });

  const handleSubmit = () => {
    if (!newTool.TOOLNAME) {
      return;
    }
    onAdd(newTool);
  };

  return (
    <div className="grid grid-cols-8 gap-4 border-b border-gray-300 p-4 dark:border-zinc-700">
      <div className="col-span-2">
        <input
          type="text"
          value={newTool.TOOLNAME}
          onChange={(e) =>
            setNewTool((prev: Partial<McpToolRes>) => ({
              ...prev,
              TOOLNAME: e.target.value,
            }))
          }
          placeholder="Tool 이름"
          className="w-full rounded-md border border-gray-300 bg-white px-2 text-sm text-gray-900 placeholder-gray-500 dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-100 dark:placeholder-gray-400"
        />
      </div>
      <div className="col-span-4">
        <input
          type="text"
          value={newTool.COMMENT}
          onChange={(e) =>
            setNewTool((prev: Partial<McpToolRes>) => ({
              ...prev,
              COMMENT: e.target.value,
            }))
          }
          placeholder="설명"
          className="w-full rounded-md border border-gray-300 bg-white px-2 text-sm text-gray-900 placeholder-gray-500 dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-100 dark:placeholder-gray-400"
        />
      </div>
      <div className="col-span-2 flex justify-between gap-2">
        <button
          onClick={onCancel}
          className="w-full cursor-pointer rounded-md bg-gray-100 px-2 py-1 text-xs text-gray-600 hover:bg-gray-100 dark:bg-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-600"
        >
          취소
        </button>
        <button
          onClick={handleSubmit}
          className="w-full cursor-pointer rounded-md bg-gray-600 px-2 py-1 text-xs text-white hover:bg-gray-800 dark:bg-zinc-700 dark:hover:bg-zinc-600"
        >
          추가
        </button>
      </div>
    </div>
  );
};
