import React from 'react';

export default function LoadingResponse() {
  return (
    <div className="flex items-center">
      <div className="grow-0 animate-pulse rounded-lg bg-gray-200 px-4 py-1 text-sm transition-all">
        🤖 대화를 불러오고 있어요
      </div>
    </div>
  );
}
