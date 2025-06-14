import React, { useState, useMemo, useEffect } from 'react';
import { aiModel_management, message_management } from '@/app/services/api';
import { useQuery } from '@tanstack/react-query';
import dynamic from 'next/dynamic';
import { ApexOptions } from 'apexcharts';
import { DurationData, serverStatusType } from '@/app/types';
import StatusPing from '../settings/components/StatusPing';
import { useSocket } from '@/app/hooks/useSocket';
import Link from 'next/link';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

export default function Dashboard() {
  const [selectedUsername, setSelectedUsername] = useState<string>('all');
  const { clients } = useSocket();

  const [serverStatuses, setServerStatuses] = useState<
    Record<string, serverStatusType>
  >({});

  const { isPending, isSuccess } = useQuery({
    queryKey: ['model_server'],
    queryFn: () => aiModel_management.getModelPing(),
    refetchInterval: 5000,
  });

  const { data, isPending: isDataPending } = useQuery<DurationData[]>({
    queryKey: ['model_duration'],
    queryFn: () => message_management.getMessageDuration(),
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

  const filteredData = useMemo(() => {
    if (!data) return [];
    if (selectedUsername === 'all') return data;
    return data.filter((item) => item.USERNAME === selectedUsername);
  }, [data, selectedUsername]);

  const chartOptions: ApexOptions = {
    chart: {
      type: 'bar',
      animations: {
        enabled: false,
      },
    },
    stroke: {
      curve: 'smooth',
    },
    xaxis: {
      categories:
        filteredData?.map((item) => {
          const month = new Date(item.CREATED_AT).getMonth() + 1;
          const day = new Date(item.CREATED_AT).getDate();
          const hour = new Date(item.CREATED_AT).getHours();

          return `${month.toString().padStart(2, '0')}.${day.toString().padStart(2, '0')} ${hour.toString().padStart(2, '0')}시`;
        }) || [],
      labels: {
        style: {
          fontSize: '12px',
        },
      },
      tickAmount: 15,
      tickPlacement: 'between',
      tooltip: {
        enabled: false,
      },
    },
    yaxis: {
      title: {
        text: '응답 시간 (ms)',
      },
      labels: {
        formatter: (value) => {
          return value.toLocaleString();
        },
      },
    },
    tooltip: {
      y: {
        formatter: (value) => {
          return `${value.toLocaleString()} ms`;
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
  };

  const series = [
    {
      name: '응답 시간(ms)',
      data:
        filteredData?.map((item) =>
          Math.round(item.TOTAL_DURATION / 1000000)
        ) || [],
    },
  ];

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
  }, [clients]);

  return (
    <div className="container my-16 grid grid-cols-3 gap-4">
      <div className="rounded-lg bg-white p-4 shadow">
        <div className="flex items-center gap-2 text-lg font-bold">
          Model Server 상태 :
          <StatusPing
            status={isPending ? 'loading' : isSuccess ? 'success' : 'offline'}
            size={3}
          />
        </div>
      </div>
      <div className="rounded-lg bg-white p-4 shadow">
        {new Date().getMonth() + 1}월 사용 개수 : {todayUsage}회
      </div>

      <div className="col-span-3 rounded-lg bg-white p-4 shadow">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-bold">서버 AGENT 상태</h2>
          {clients.filter((item) => item.clientId).length > 0 && (
            <div className="flex aspect-square size-5 grow-0 items-center justify-center rounded-full bg-gray-700 text-sm font-bold text-white">
              {clients.filter((item) => item.clientId).length}
            </div>
          )}
        </div>

        <div className="mt-4 mb-2 flex flex-wrap gap-4">
          {clients.length === 0 ? (
            <div className="text-gray-500">연결된 클라이언트가 없습니다.</div>
          ) : clients[0] === undefined ? (
            <div className="flex h-32 w-full items-center justify-center">
              <div className="border-primary size-12 animate-spin rounded-full border-4 border-t-transparent"></div>
            </div>
          ) : (
            clients
              .filter((item) => item.clientId)
              .map((item) => (
                <Link
                  key={item.clientId}
                  className="flex items-center gap-2 rounded-full border px-2 hover:bg-gray-200"
                  href={`/settings/server/${item.clientId}`}
                >
                  <StatusPing status={serverStatuses[item.clientId]} />
                  {item.clientId}
                </Link>
              ))
          )}
        </div>
      </div>

      <div className="col-span-3 min-h-[441px] rounded-lg bg-white p-4 shadow">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold">응답 시간 추이 (최근30일)</h2>
          <select
            value={selectedUsername}
            onChange={(e) => setSelectedUsername(e.target.value)}
            className="rounded border border-gray-300 px-3 py-1"
          >
            {uniqueUsernames.map((username) => (
              <option key={username} value={username}>
                {username === 'all' ? '전체 사용자' : username}
              </option>
            ))}
          </select>
        </div>
        {isDataPending ? (
          <div className="flex h-[350px] items-center justify-center">
            <div className="border-primary size-16 animate-spin rounded-full border-4 border-t-transparent"></div>
          </div>
        ) : (
          typeof window !== 'undefined' && (
            <Chart
              options={chartOptions}
              series={series}
              type="area"
              height={350}
            />
          )
        )}
      </div>
    </div>
  );
}
