import MultiToSpan from '@/app/(main)/components/common/MultiToSpan';
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

export function GuideMessage({ prompts }: { prompts: string[] }) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-12 pr-4">
      <div className="rounded-lg bg-white px-6 py-3 text-center font-semibold text-gray-700 shadow dark:bg-zinc-800 dark:text-white">
        🤖 어떤 것을 도와드릴까요?
      </div>
      <div className="rounded-lg bg-gray-200 p-4 dark:bg-zinc-700">
        <h3 className="pb-2 text-lg font-bold">프롬프트 즐겨찾기 :</h3>
        <div className="grid w-3xl max-w-full grid-cols-3 gap-4">
          {prompts.slice(0, 3).map((item, idx) => (
            <button
              key={idx}
              className="aspect-[1.333] cursor-pointer truncate rounded-xl border bg-gray-50 p-2 hover:bg-gray-200 dark:border-zinc-400 dark:bg-zinc-800 dark:hover:bg-zinc-700"
            >
              {MultiToSpan({ input: item })}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
