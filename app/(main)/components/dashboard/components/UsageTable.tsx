import React, { useMemo } from 'react';
import { UsageTableProps } from '@/app/types';

export default function UsageTable({ data }: UsageTableProps) {
  const usageByUser = useMemo(() => {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();
    const counts = new Map<string, number>();

    data.forEach((item) => {
      const itemDate = new Date(item.CREATED_AT);
      if (
        itemDate.getFullYear() === currentYear &&
        itemDate.getMonth() === currentMonth
      ) {
        counts.set(item.USERNAME, (counts.get(item.USERNAME) || 0) + 1);
      }
    });

    return Array.from(counts.entries())
      .map(([username, count]) => ({ username, count }))
      .sort((a, b) => b.count - a.count);
  }, [data]);

  return (
    <div className="col-span-12 row-start-5 rounded-lg bg-white p-4 shadow">
      <h2 className="mb-2 text-lg font-bold">
        {new Date().getMonth() + 1}월 사용자별 사용 횟수
      </h2>
      <table className="w-full table-auto text-sm">
        <thead>
          <tr>
            <th className="border-b p-2 text-left">사용자</th>
            <th className="border-b p-2 text-right">횟수</th>
          </tr>
        </thead>
        <tbody>
          {usageByUser.length > 0 ? (
            usageByUser.map((item) => (
              <tr key={item.username}>
                <td className="border-b p-2">{item.username}</td>
                <td className="border-b p-2 text-right">{item.count}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={2}
                className="py-4 text-center text-gray-500"
              >
                데이터가 없습니다
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
