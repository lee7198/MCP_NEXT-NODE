import { ServerInfoProps } from '@/app/types';

export const ServerInfo = ({
  isLoading,
  serverName,
  responsedAt,
}: ServerInfoProps) => {
  return (
    <div className="rounded-lg bg-gray-50 p-4 dark:bg-zinc-700">
      <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-zinc-100">
        서버 정보
      </h2>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-zinc-400">서버 이름</span>
          {isLoading ? (
            <div className="h-4 w-32 animate-pulse rounded-lg bg-gray-400 dark:bg-zinc-600" />
          ) : (
            <span className="font-medium text-gray-900 dark:text-zinc-100">
              {serverName}
            </span>
          )}
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-zinc-400">
            마지막 응답 시간
          </span>
          {isLoading ? (
            <div className="h-4 w-48 animate-pulse rounded-lg bg-gray-400 dark:bg-zinc-600" />
          ) : (
            <span className="font-medium text-gray-900 dark:text-zinc-100">
              {responsedAt &&
                responsedAt.toLocaleString('ko-KR', {
                  timeZone: 'Asia/Seoul',
                })}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
