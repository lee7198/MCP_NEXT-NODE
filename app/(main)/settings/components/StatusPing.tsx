'use client';

import React from 'react';
import { StatusPingProps } from '@/app/types';

export default function StatusPing({ status }: StatusPingProps) {
  if (!status)
    return (
      <div className="size-3 rounded-full bg-red-500">
        <div className="size-full rounded-full bg-red-500" />
      </div>
    );
  return (
    <div className="size-3 rounded-full bg-green-500">
      <div className="size-full animate-ping rounded-full bg-green-500" />
    </div>
  );
}
