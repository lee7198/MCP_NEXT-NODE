import React from 'react';

export default function ErrorResponse() {
  return (
    <div className="flex items-center">
      <div className="grow-0 rounded-lg bg-zinc-800 px-4 py-1 text-sm text-white">
        ⚠️ 오류가 발생하였습니다.
      </div>
    </div>
  );
}
