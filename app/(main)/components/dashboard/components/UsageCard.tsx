import { UsageCardProps } from '@/app/types';
import React, { useMemo } from 'react';

export default function UsageCard({ data, selectedUsername }: UsageCardProps) {
  const thisMonthUsage = useMemo(() => {
    if (!data) return 0;
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();
    return data.filter((item) => {
      const itemDate = new Date(item.CREATED_AT);
      const isSameMonth =
        itemDate.getFullYear() === currentYear &&
        itemDate.getMonth() === currentMonth;
      const isSameUser =
        selectedUsername === 'all' || item.USERNAME === selectedUsername;
      return isSameMonth && isSameUser;
    }).length;
  }, [data, selectedUsername]);

  return (
    <div className="col-span-4 flex items-center rounded-lg border bg-white p-4 shadow dark:border-zinc-700 dark:bg-zinc-800 dark:shadow-gray-900/20">
      <b className="text-gray-900 dark:text-zinc-100">
        {new Date().getMonth() + 1}월 사용 횟수 :{' '}
      </b>
      &nbsp;
      <span className="text-gray-700 dark:text-zinc-300">
        {thisMonthUsage}회
      </span>
    </div>
  );
}
