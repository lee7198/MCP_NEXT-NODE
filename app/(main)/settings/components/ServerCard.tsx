import { CheckIcon } from '@phosphor-icons/react';
import StatusPing from './StatusPing';
import TimeAgo from 'javascript-time-ago';
import ko from 'javascript-time-ago/locale/ko';
import { ServerCardProps } from '@/app/types/components';
import Link from 'next/link';

TimeAgo.addLocale(ko);
const timeAgo = new TimeAgo('ko');

export default function ServerCard({
  serverName,
  serverStatus,
  client,
  pingStatus,
  onTestPing,
}: ServerCardProps) {
  return (
    <div className="flex w-full items-center justify-between rounded-lg bg-gray-200 px-4 py-2 transition-colors hover:bg-gray-300 lg:w-[calc(50%-0.5rem)]">
      <div className="flex items-center gap-2">
        <StatusPing status={serverStatus} />
        <div className="flex flex-col">
          <Link href={`/settings/server/${serverName}`} className="font-bold">
            {serverName}
          </Link>
          <div className="text-xs">
            {client
              ? timeAgo.format(
                  client.lastActivity
                    ? new Date(client.lastActivity)
                    : new Date()
                )
              : '-'}
          </div>
        </div>
      </div>
      <button
        type="button"
        className="flex min-w-30 cursor-pointer items-center justify-center rounded-md bg-white px-2 active:opacity-35 disabled:cursor-not-allowed disabled:opacity-50"
        disabled={serverStatus !== 'success' || pingStatus === 'loading'}
        onClick={() => onTestPing(serverName)}
      >
        {pingStatus === 'loading' ? (
          <div className="py-1">
            <div className="size-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
          </div>
        ) : pingStatus === 'success' ? (
          <div className="flex gap-2">
            <div>PONG</div>
            <CheckIcon size={24} color="#00c951" weight="bold" />
          </div>
        ) : (
          'PING TEST'
        )}
      </button>
    </div>
  );
}
