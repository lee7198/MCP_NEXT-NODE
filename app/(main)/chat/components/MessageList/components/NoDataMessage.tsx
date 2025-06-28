import React from 'react';

export default function NoDataMessage() {
  return (
    <div className="flex items-center">
      <div className="grow-0 rounded-lg bg-gray-100 px-4 py-1 text-sm text-gray-500 dark:bg-zinc-800 dark:text-white">
        🤖 데이터가 없습니다
      </div>
    </div>
  );
}

export function GuideMessage() {
  return (
    <div className="flex h-full w-full items-center justify-center pr-4">
      <div className="rounded-lg bg-white px-6 py-3 text-center font-semibold text-gray-700 shadow dark:bg-zinc-800 dark:text-white">
        🤖 어떤 것을 도와드릴까요?
      </div>
    </div>
  );
}
