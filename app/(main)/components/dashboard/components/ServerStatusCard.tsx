import React from 'react';
import StatusPing from '../../../settings/components/StatusPing';
import { ServerStatusCardProps } from '@/app/types';

export default function ServerStatusCard({
  isPending,
  isSuccess,
}: ServerStatusCardProps) {
  return (
    <div className="col-span-4 flex items-center rounded-lg border bg-white p-4 shadow dark:border-gray-700 dark:bg-gray-800 dark:shadow-gray-900/20">
      <div className="flex items-center gap-2 font-bold text-gray-900 dark:text-gray-100">
        Model Server 상태 :
        <StatusPing
          status={isPending ? 'loading' : isSuccess ? 'success' : 'offline'}
          size={3}
        />
      </div>
    </div>
  );
}
