import { UsageCardProps } from '@/app/types';
import React from 'react';

export default function UsageCard({ todayUsage }: UsageCardProps) {
  return (
    <div className="flex items-center rounded-lg bg-white p-4 shadow">
      <b>{new Date().getMonth() + 1}월 사용 횟수 : </b>&nbsp;{todayUsage}회
    </div>
  );
}
