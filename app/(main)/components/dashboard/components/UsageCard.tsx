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
    <div className="col-span-4 flex items-center rounded-lg bg-white p-4 shadow">
      <b>{new Date().getMonth() + 1}월 사용 횟수 : </b>&nbsp;{thisMonthUsage}회
    </div>
  );
}
