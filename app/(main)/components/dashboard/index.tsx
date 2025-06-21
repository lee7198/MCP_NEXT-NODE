import React, { useState, useMemo, useEffect } from 'react';
import {
  aiModel_management,
  common_management,
  message_management,
  server_management,
} from '@/app/services/api';
import { useQuery } from '@tanstack/react-query';
import { DurationData, ServerStatus } from '@/app/types';
import { useSocket } from '@/app/hooks/useSocket';
import ModelInfoCard from './components/ModelInfoCard';
import ServerStatusCard from './components/ServerStatusCard';
import UsageCard from './components/UsageCard';
import AgentStatusSection from './components/AgentStatusSection';
import ResponseTimeSection from './components/ResponseTimeSection';
import McpLinksSection from './components/McpLinksSection';
import McpFlowSection from './components/McpFlowSection';

export default function Dashboard() {
  const [selectedUsername, setSelectedUsername] = useState<string>('all');
  const { clients } = useSocket();

  const [serverStatuses, setServerStatuses] = useState<
    Record<string, ServerStatus>
  >({});

  const { isPending: isPendingServ, isSuccess: isSuccessServ } = useQuery({
    queryKey: ['model_server_ping'],
    queryFn: () => aiModel_management.getModelPing(),
    refetchInterval: 10000,
  });

  const { isPending: isPendingDB, isSuccess: isSuccessDB } = useQuery({
    queryKey: ['db_server_ping'],
    queryFn: () => common_management.getDBSserverPing(),
    refetchInterval: 10000,
  });

  const { data, isPending: isDataPending } = useQuery<DurationData[]>({
    queryKey: ['model_duration'],
    queryFn: () => message_management.getMessageDuration(),
  });

  const { data: servers } = useQuery({
    queryKey: ['server_agent'],
    queryFn: () => server_management.getServers(),
  });

  const todayUsage = useMemo(() => {
    if (!data) return 0;
    const today = new Date();
    return data.filter((item) => {
      const itemDate = new Date(item.CREATED_AT);
      return (
        itemDate.getDate() === today.getDate() &&
        itemDate.getMonth() === today.getMonth() &&
        itemDate.getFullYear() === today.getFullYear()
      );
    }).length;
  }, [data]);

  const uniqueUsernames = useMemo(() => {
    if (!data) return [];
    return ['all', ...new Set(data.map((item) => item.USERNAME))];
  }, [data]);

  useEffect(() => {
    servers?.forEach((item) => {
      if (item.SERVERNAME) {
        setServerStatuses((prev) => ({
          ...prev,
          [item.SERVERNAME]: clients.some(
            (client) => client.clientId === item.SERVERNAME
          )
            ? 'success'
            : 'offline',
        }));
      }
    });
    if (clients.length > 0) {
      const client = clients[0];
      if (client) {
        setServerStatuses((prev) => ({
          ...prev,
          [client.clientId]: client ? 'success' : 'offline',
        }));
      }
    }
  }, [clients, servers]);

  return (
    <div className="container mx-auto grid w-full grid-cols-3 gap-4 p-4">
      <ModelInfoCard />
      <ServerStatusCard isPending={isPendingServ} isSuccess={isSuccessServ} />
      <UsageCard todayUsage={todayUsage} />

      <McpFlowSection
        servers={servers || []}
        serverStatuses={serverStatuses}
        modelStatus={
          isPendingServ ? 'loading' : isSuccessServ ? 'success' : 'offline'
        }
        dbStatus={isPendingDB ? 'loading' : isSuccessDB ? 'success' : 'offline'}
      />

      <AgentStatusSection
        clients={clients}
        servers={servers || []}
        serverStatuses={serverStatuses}
      />

      <ResponseTimeSection
        data={data || []}
        selectedUsername={selectedUsername}
        isDataPending={isDataPending}
        uniqueUsernames={uniqueUsernames}
        onUsernameChange={setSelectedUsername}
      />

      <McpLinksSection />
    </div>
  );
}
