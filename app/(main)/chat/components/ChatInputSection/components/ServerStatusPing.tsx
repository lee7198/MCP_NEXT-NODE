'use client';

import StatusPing from '@/app/(main)/settings/components/StatusPing';
import { ServerStatusProps } from '@/app/types';

export default function ServerStatusPing({
  isPending,
  isSuccess,
}: ServerStatusProps) {
  return (
    <div className="flex items-center gap-2 text-sm">
      AI Model Status :
      {isPending ? (
        <StatusPing status="loading" size={2} />
      ) : isSuccess ? (
        <StatusPing status="success" size={2} />
      ) : (
        <StatusPing status="offline" size={2} />
      )}
    </div>
  );
}
