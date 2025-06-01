'use client';

import { server_management } from '@/app/services/api';
import { ClientInfo } from '@/app/types/socket';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import StatusPing from './components/StatusPing';
import TimeAgo from 'javascript-time-ago';
import ko from 'javascript-time-ago/locale/ko';
import { CheckIcon } from '@phosphor-icons/react';
import Link from 'next/link';

export default function SettingsPage() {
  const [clients, setClients] = useState<ClientInfo[]>([]);
  const [socketInstance, setSocketInstance] = useState<ReturnType<
    typeof io
  > | null>(null);
  const [pingStatus, setPingStatus] = useState<
    Record<string, 'idle' | 'loading' | 'success'>
  >({});
  TimeAgo.addLocale(ko);
  const timeAgo = new TimeAgo('ko');

  const { data: servers, isSuccess: isGetServers } = useQuery({
    queryKey: ['server_list'],
    queryFn: async () => server_management.getServers(),
  });

  useEffect(() => {
    // Socket.IO 연결
    const socket = io('http://localhost:3001');
    setSocketInstance(socket);

    // 초기 클라이언트 목록 가져오기
    fetch('/api/clients')
      .then((res) => res.json())
      .then((data) => setClients(data));

    // 클라이언트 업데이트 이벤트 리스너
    socket.on('clients_update', (updatedClients: ClientInfo[]) => {
      setClients(updatedClients);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleTestPing = (serverName: string) => {
    if (socketInstance) {
      setPingStatus((prev) => ({ ...prev, [serverName]: 'loading' }));
      socketInstance.emit('test_ping', serverName);

      // 3초 후에 성공 상태로 변경
      setTimeout(() => {
        setPingStatus((prev) => ({ ...prev, [serverName]: 'success' }));
        // 1초 후에 다시 idle 상태로 변경
        setTimeout(() => {
          setPingStatus((prev) => ({ ...prev, [serverName]: 'idle' }));
        }, 500);
      }, 1500);
    }
  };

  return (
    <div className="container mx-auto flex flex-col gap-12 p-4">
      <div>
        <div className="flex items-center justify-between">
          <h1 className="mb-4 text-2xl font-black">SERVER LIST</h1>
          <Link href="/settings/new" className="px-2">
            NEW
          </Link>
        </div>

        <div className="flex flex-wrap gap-4">
          {isGetServers
            ? servers.map((server) => {
                const isAlive = clients.some(
                  (client) => client.clientId === server.SERVERNAME
                );
                const client =
                  clients.filter(
                    (client) => client.clientId === server.SERVERNAME
                  )[0] || undefined;

                return (
                  <div className="flex w-full items-center justify-between rounded-lg bg-gray-200 px-4 py-2 sm:w-[calc(50%-0.5rem)]">
                    <div className="flex items-center gap-2">
                      {isAlive ? (
                        <StatusPing status={isAlive} />
                      ) : (
                        <StatusPing status={isAlive} />
                      )}
                      <div className="flex flex-col">
                        <div className="font-bold">{server.SERVERNAME}</div>
                        <div className="text-xs">
                          {client
                            ? timeAgo.format(
                                new Date(client.lastActivity && new Date())
                              )
                            : '-'}
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="flex min-w-30 cursor-pointer items-center justify-center rounded-md bg-white px-2 active:opacity-35 disabled:cursor-not-allowed disabled:opacity-50"
                      disabled={
                        !isAlive || pingStatus[server.SERVERNAME] === 'loading'
                      }
                      onClick={() => handleTestPing(server.SERVERNAME)}
                    >
                      {pingStatus[server.SERVERNAME] === 'loading' ? (
                        <div className="py-1">
                          <div className="size-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600"></div>
                        </div>
                      ) : pingStatus[server.SERVERNAME] === 'success' ? (
                        <CheckIcon size={24} color="#00c951" weight="bold" />
                      ) : (
                        'PING TEST'
                      )}
                    </button>
                  </div>
                );
              })
            : new Array(5)
                .fill(0)
                .map((_, idx) => (
                  <div
                    key={idx}
                    className={`h-14 w-full animate-pulse rounded-lg bg-gray-300 px-4 py-2 transition-all sm:w-[calc(50%-0.5rem)] delay-[${idx * 100}] duration-[${idx * 100}]`}
                  ></div>
                ))}
        </div>
      </div>
    </div>
  );
}
