import React from 'react';
import StatusPing from '../../../settings/components/StatusPing';
import { ServerStatusCardProps } from '@/app/types';

export default function ServerStatusCard({
  isPending,
  isSuccess,
}: ServerStatusCardProps) {
  return (
    <div className="col-span-5 flex items-center rounded-lg bg-white p-4 shadow lg:col-span-3">
      <div className="flex items-center gap-2 text-lg font-bold">
        Model Server 상태 :
        <StatusPing
          status={isPending ? 'loading' : isSuccess ? 'success' : 'offline'}
          size={3}
        />
      </div>
    </div>
  );
}
