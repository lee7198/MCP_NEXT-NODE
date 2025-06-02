import { useEffect, useState } from 'react';
import ServerCard from './ServerCard';
import ServerCardSkeleton from './ServerCardSkeleton';
import { pingStatus, ServerListProps, serverStatus } from '@/app/types';
import { useSocket } from '@/app/hooks/useSocket';

export default function ServerList({ servers, isGetServers }: ServerListProps) {
  const [pingStatuses, setPingStatuses] = useState<Record<string, pingStatus>>(
    {}
  );
  const [serverState, setServerState] = useState<Record<string, serverStatus>>(
    {}
  );
  const { clients, handleTestPing: pingTest } = useSocket(
    servers[0]?.SERVERNAME || ''
  );

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
    servers.forEach((server) => {
      const isOnLine = clients.some(
        (client) => client.clientId === server.SERVERNAME
      );
      setServerState((prev) => ({
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
        setServerState((prev) => ({
          ...prev,
          [client.clientId]: client ? 'success' : 'offline',
        }));
      }
    }
    servers.forEach((server) => {
      if (clients.some((client) => client.clientId === server.SERVERNAME))
        setServerState((prev) => ({
          ...prev,
          [server.SERVERNAME]: 'success',
        }));
      else
        setServerState((prev) => ({
          ...prev,
          [server.SERVERNAME]: 'offline',
        }));
    });
  }, [clients]);

  if (!isGetServers) {
    return (
      <div className="flex flex-wrap gap-4">
        {new Array(5).fill(0).map((_, idx) => (
          <ServerCardSkeleton key={idx} index={idx} />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-4">
      {servers.map((server) => {
        const client = clients.find(
          (client) => client.clientId === server.SERVERNAME
        );
        return (
          <ServerCard
            key={server.SERVERNAME}
            serverName={server.SERVERNAME}
            serverStatus={serverState[server.SERVERNAME] || 'offline'}
            client={client || undefined}
            pingStatus={pingStatuses[server.SERVERNAME] || 'idle'}
            onTestPing={() => handleTestPing(server.SERVERNAME)}
          />
        );
      })}
    </div>
  );
}
