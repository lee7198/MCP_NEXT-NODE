import ServerCard from './ServerCard';
import ServerCardSkeleton from './ServerCardSkeleton';
import { ServerListProps } from '@/app/types';

export default function ServerList({
  clients,
  servers,
  isGetServers,
  pingStatuses,
  serverStatuses,
  handleTestPing,
}: ServerListProps) {
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
            serverStatus={serverStatuses[server.SERVERNAME] || 'offline'}
            client={client || undefined}
            pingStatus={pingStatuses[server.SERVERNAME] || 'idle'}
            onTestPing={() => handleTestPing(server.SERVERNAME)}
          />
        );
      })}
    </div>
  );
}
