'use client';

import { server_management } from '@/app/services/api';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import ServerList from '../components/ServerList';
import { useSocket } from '@/app/hooks/useSocket';
import { useEffect, useState } from 'react';
import { pingStatus, serverStatus } from '@/app/types';

export default function Servers() {
  const [pingStatuses, setPingStatuses] = useState<Record<string, pingStatus>>(
    {}
  );
  const [serverStatuses, setServerStatuses] = useState<
    Record<string, serverStatus>
  >({});

  const { data: servers, isSuccess: isGetServers } = useQuery({
    queryKey: ['server_list'],
    queryFn: async () => server_management.getServers(),
  });

  const { clients, handleTestPing: pingTest } = useSocket();

  const handleTestPing = (serverName: string) => {
    setPingStatuses((prev) => ({ ...prev, [serverName]: 'loading' }));
    pingTest();

    setTimeout(() => {
      setPingStatuses((prev) => ({ ...prev, [serverName]: 'success' }));
      setTimeout(() => {
        setPingStatuses((prev) => ({ ...prev, [serverName]: 'idle' }));
      }, 500);
    }, 1500);
  };
  useEffect(() => {
    // 초기 상태
    if (servers)
      servers.forEach((server) => {
        const isOnLine = clients.some(
          (client) => client.clientId === server.SERVERNAME
        );
        setServerStatuses((prev) => ({
          ...prev,
          [server.SERVERNAME]: isOnLine ? 'success' : 'loading',
        }));
      });
  }, [servers]);

  // 클라이언트 갱신
  useEffect(() => {
    if (clients.length > 0) {
      const client = clients[0];
      if (client) {
        setServerStatuses((prev) => ({
          ...prev,
          [client.clientId]: client ? 'success' : 'offline',
        }));
      }
    }
    if (servers)
      servers.forEach((server) => {
        if (clients.some((client) => client.clientId === server.SERVERNAME))
          setServerStatuses((prev) => ({
            ...prev,
            [server.SERVERNAME]: 'success',
          }));
        else
          setServerStatuses((prev) => ({
            ...prev,
            [server.SERVERNAME]: 'offline',
          }));
      });
  }, [clients]);

  return (
    <div className="container mx-auto flex flex-col gap-12 p-6">
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">서버(클라이언트) 관리</h1>
          <Link href="/settings/new" className="px-2">
            NEW
          </Link>
        </div>

        <ServerList
          servers={servers || []}
          isGetServers={isGetServers}
          pingStatuses={pingStatuses}
          serverStatuses={serverStatuses}
          handleTestPing={handleTestPing}
          clients={clients}
        />
      </div>
    </div>
  );
}
