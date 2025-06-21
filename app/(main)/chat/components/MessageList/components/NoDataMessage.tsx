import React from 'react';

export default function NoDataMessage() {
  return (
    <div className="flex items-center">
      <div className="grow-0 rounded-lg bg-gray-100 px-4 py-1 text-sm text-gray-500">
        🤖 데이터가 없습니다
      </div>
    </div>
  );
}
