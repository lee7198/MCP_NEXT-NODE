import React from 'react';
import ResponseTimeChart from '../../ResponseTimeChart';
import { ResponseTimeSectionProps } from '@/app/types/dashboard';

export default function ResponseTimeSection({
  data,
  selectedUsername,
  isDataPending,
  uniqueUsernames,
  onUsernameChange,
}: ResponseTimeSectionProps) {
  return (
    <div className="col-span-3 min-h-[441px] rounded-lg bg-white p-4 shadow">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold">응답 시간 추이 (최근30일)</h2>
        <select
          value={selectedUsername}
          onChange={(e) => onUsernameChange(e.target.value)}
          className="rounded border border-gray-300 px-3 py-1 text-sm"
        >
          {uniqueUsernames.map((username) => (
            <option key={username} value={username}>
              {username === 'all' ? '전체 사용자' : username}
            </option>
          ))}
        </select>
      </div>
      <ResponseTimeChart
        data={data}
        selectedUsername={selectedUsername}
        isDataPending={isDataPending}
      />
    </div>
  );
}
