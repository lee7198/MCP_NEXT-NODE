import React from 'react';
import ResponseTimeChart from '../../ResponseTimeChart';
import { ResponseTimeSectionProps } from '@/app/types';

export default function ResponseTimeSection({
  data,
  selectedUsername,
  isDataPending,
  uniqueUsernames,
  onUsernameChange,
  isLoggedIn,
}: ResponseTimeSectionProps) {
  return (
    <div className="col-span-12 row-start-4 min-h-[441px] rounded-lg bg-white p-4 shadow">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold">응답 시간 추이 (최근30일)</h2>
        {isLoggedIn && (
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
        )}
      </div>
      {isLoggedIn ? (
        <ResponseTimeChart
          data={data}
          selectedUsername={selectedUsername}
          isDataPending={isDataPending}
        />
      ) : (
        <div className="flex h-[350px] items-center justify-center">
          <div className="text-center text-gray-500">
            <p className="text-lg font-medium">로그인 후 확인 가능합니다</p>
            <p className="text-sm">
              응답 시간 추이를 보려면 로그인이 필요합니다.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
