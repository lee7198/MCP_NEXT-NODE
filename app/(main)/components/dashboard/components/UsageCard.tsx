import { UsageCardProps } from '@/app/types';
import React, { useMemo } from 'react';

export default function UsageCard({ data }: UsageCardProps) {
  const todayUsage = useMemo(() => {
    if (!data) return 0;
    const today = new Date();
    return data.filter((item) => {
      const itemDate = new Date(item.CREATED_AT);
      return (
        itemDate.getDate() === today.getDate() &&
        itemDate.getMonth() === today.getMonth() &&
        itemDate.getFullYear() === today.getFullYear()
      );
    }).length;
  }, [data]);

  return (
    <div className="flex items-center rounded-lg bg-white p-4 shadow">
      <b>{new Date().getMonth() + 1}월 사용 횟수 : </b>&nbsp;{todayUsage}회
    </div>
  );
}
