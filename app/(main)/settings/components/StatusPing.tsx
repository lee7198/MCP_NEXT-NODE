'use client';

import React from 'react';
import { StatusPingProps } from '@/app/types';

export default function StatusPing({ status, size = 3 }: StatusPingProps) {
  const sizeClass =
    {
      1: 'size-1',
      2: 'size-2',
      3: 'size-3',
      4: 'size-4',
      5: 'size-5',
    }[size] || 'size-3';

  if (status === 'loading')
    return (
      <div className={`${sizeClass} rounded-full bg-yellow-500`}>
        <div className="size-full rounded-full bg-yellow-500" />
      </div>
    );
  if (status === 'offline')
    return (
      <div className={`${sizeClass} rounded-full bg-red-500`}>
        <div className="size-full rounded-full bg-red-500" />
      </div>
    );
  return (
    <div className={`${sizeClass} rounded-full bg-green-500`}>
      <div className="size-full animate-ping rounded-full bg-green-500" />
    </div>
  );
}
