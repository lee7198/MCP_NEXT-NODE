import React from 'react';
import Link from 'next/link';
import StatusPing from '../../../settings/components/StatusPing';
import { AgentStatusSectionProps } from '@/app/types/dashboard';

export default function AgentStatusSection({
  clients,
  servers,
  serverStatuses,
}: AgentStatusSectionProps) {
  return (
    <div className="col-span-3 rounded-lg bg-white p-4 shadow">
      <div className="flex items-center gap-2">
        <h2 className="text-lg font-bold">서버 AGENT 상태</h2>
        {clients.filter((item) => item.clientId).length > 0 && (
          <div className="flex aspect-square size-5 grow-0 items-center justify-center rounded-full bg-gray-700 text-sm font-bold text-white">
            {clients.filter((item) => item.clientId).length}
          </div>
        )}
      </div>
      <div className="mt-4 mb-2 flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <h3>
            online (
            {servers?.filter(
              (server) => serverStatuses[server.SERVERNAME] === 'success'
            ).length || 0}
            ), offline (
            {servers?.filter(
              (server) => serverStatuses[server.SERVERNAME] === 'offline'
            ).length || 0}
            )
          </h3>
          <div className="flex flex-wrap gap-4">
            {!servers ? (
              <div className="flex h-32 w-full items-center justify-center">
                <div className="border-primary size-12 animate-spin rounded-full border-4 border-t-transparent"></div>
              </div>
            ) : servers.length > 0 ? (
              servers
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
                    className="flex items-center gap-2 rounded-full border border-gray-400 px-2 hover:bg-gray-200"
                    href={`/settings/server/${item.SERVERNAME}`}
                  >
                    <StatusPing status={serverStatuses[item.SERVERNAME]} />
                    {item.SERVERNAME}
                  </Link>
                ))
            ) : (
              <div className="text-gray-500">등록된 서버가 없습니다.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
