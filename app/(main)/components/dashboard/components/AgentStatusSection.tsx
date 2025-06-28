import React, { useState } from 'react';
import Link from 'next/link';
import StatusPing from '../../../settings/components/StatusPing';
import { AgentStatusSectionProps } from '@/app/types';
import { XIcon } from '@phosphor-icons/react/dist/ssr';

export default function AgentStatusSection({
  clients,
  servers,
  serverStatuses,
  isLoggedIn,
}: AgentStatusSectionProps) {
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

  const filteredServers = servers?.filter((server) => {
    if (!selectedStatus) return true;
    return serverStatuses[server.SERVERNAME] === selectedStatus;
  });

  return (
    <div className="col-span-12 row-start-3 rounded-lg border bg-white p-4 shadow lg:col-span-4 lg:row-start-2 dark:border-gray-700 dark:bg-gray-800 dark:shadow-gray-900/20">
      <div className="flex items-center gap-2">
        <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
          서버 AGENT 상태
        </h2>
        {isLoggedIn && clients.filter((item) => item.clientId).length > 0 && (
          <div className="flex aspect-square size-5 grow-0 items-center justify-center rounded-full bg-gray-700 text-sm font-bold text-white dark:bg-gray-600">
            {clients.filter((item) => item.clientId).length}
          </div>
        )}
      </div>
      <div className="my-2 flex flex-col gap-2">
        {isLoggedIn ? (
          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              <button
                onClick={() =>
                  setSelectedStatus(
                    selectedStatus === 'success' ? null : 'success'
                  )
                }
                className={`cursor-pointer rounded px-3 hover:opacity-70 ${
                  selectedStatus === 'success'
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-gray-100'
                }`}
              >
                online (
                {servers?.filter(
                  (server) => serverStatuses[server.SERVERNAME] === 'success'
                ).length || 0}
                )
              </button>
              <button
                onClick={() =>
                  setSelectedStatus(
                    selectedStatus === 'offline' ? null : 'offline'
                  )
                }
                className={`cursor-pointer rounded px-3 hover:opacity-70 ${
                  selectedStatus === 'offline'
                    ? 'bg-red-500 text-white'
                    : 'bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-gray-100'
                }`}
              >
                offline (
                {servers?.filter(
                  (server) => serverStatuses[server.SERVERNAME] === 'offline'
                ).length || 0}
                )
              </button>
              {selectedStatus && (
                <button
                  onClick={() => setSelectedStatus(null)}
                  className="cursor-pointer rounded bg-gray-200 px-3 text-gray-900 hover:opacity-70 dark:bg-gray-700 dark:text-gray-100"
                >
                  <XIcon />
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {!servers ? (
                <div className="flex h-32 w-full items-center justify-center">
                  <div className="border-primary size-12 animate-spin rounded-full border-4 border-t-transparent"></div>
                </div>
              ) : filteredServers?.length > 0 ? (
                filteredServers
                  .sort((a, b) => {
                    const aStatus =
                      serverStatuses[a.SERVERNAME] === 'success' ? 1 : 0;
                    const bStatus =
                      serverStatuses[b.SERVERNAME] === 'success' ? 1 : 0;

                    if (aStatus === bStatus) {
                      return a.SERVERNAME.localeCompare(b.SERVERNAME);
                    }

                    return bStatus - aStatus;
                  })
                  .map((item) => (
                    <Link
                      key={item.SERVERNAME}
                      className="flex items-center gap-2 rounded-full border border-gray-400 px-2 text-sm text-gray-900 hover:bg-gray-200 dark:border-gray-600 dark:text-gray-100 dark:hover:bg-gray-700"
                      href={`/settings/server/${item.SERVERNAME}`}
                    >
                      <StatusPing status={serverStatuses[item.SERVERNAME]} />
                      {item.SERVERNAME}
                    </Link>
                  ))
              ) : (
                <div className="text-gray-500 dark:text-gray-400">
                  등록된 서버가 없습니다.
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex h-32 w-full items-center justify-center">
            <div className="text-center text-gray-500 dark:text-gray-400">
              <p className="text-lg font-medium">로그인 후 사용 가능합니다</p>
              <p className="text-sm">
                서버 AGENT 상태를 확인하려면 로그인이 필요합니다.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
