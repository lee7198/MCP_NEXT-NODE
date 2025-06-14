import React, { useState, useMemo, useEffect } from 'react';
import {
  aiModel_management,
  message_management,
  server_management,
} from '@/app/services/api';
import { useQuery } from '@tanstack/react-query';
import { DurationData, serverStatusType } from '@/app/types';
import StatusPing from '../settings/components/StatusPing';
import { useSocket } from '@/app/hooks/useSocket';
import Link from 'next/link';
import ResponseTimeChart from './ResponseTimeChart';
import { LinkIcon } from '@phosphor-icons/react/dist/ssr';

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

  // 클라이언트 갱신
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
    <div className="grid w-full grid-cols-3 gap-4 p-4">
      <div className="flex items-center rounded-lg bg-white p-4 shadow">
        <b>AI Model :</b>&nbsp;qwen3:8b
      </div>
      <div className="flex items-center rounded-lg bg-white p-4 shadow">
        <div className="flex items-center gap-2 text-lg font-bold">
          Model Server 상태 :
          <StatusPing
            status={isPending ? 'loading' : isSuccess ? 'success' : 'offline'}
            size={3}
          />
        </div>
      </div>
      <div className="flex items-center rounded-lg bg-white p-4 shadow">
        <b>{new Date().getMonth() + 1}월 사용 횟수 : </b>&nbsp;{todayUsage}회
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
                    // 먼저 서버 상태로 정렬
                    const aStatus =
                      serverStatuses[a.SERVERNAME] === 'success' ? 1 : 0;
                    const bStatus =
                      serverStatuses[b.SERVERNAME] === 'success' ? 1 : 0;

                    // 상태가 같으면 서버 이름으로 정렬
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
                <div>ㅁㄴㅇ</div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="col-span-3 min-h-[441px] rounded-lg bg-white p-4 shadow">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold">응답 시간 추이 (최근30일)</h2>
          <select
            value={selectedUsername}
            onChange={(e) => setSelectedUsername(e.target.value)}
            className="rounded border border-gray-300 px-3 py-1 text-sm"
          >
            {uniqueUsernames.map((username) => (
              <option key={username} value={username}>
                {username === 'all' ? '전체 사용자' : username}
              </option>
            ))}
          </select>
        </div>
        <ResponseTimeChart
          data={data || []}
          selectedUsername={selectedUsername}
          isDataPending={isDataPending}
        />
      </div>

      <div className="col-span-3 rounded-lg bg-white p-4 shadow">
        <h2 className="text-lg font-bold">MCP 관련 DOC & POST</h2>
        <ul className="list-inside list-decimal">
          {mcp_link.map((item) => (
            <li>
              <Link
                href={item.link}
                target="_blank"
                className="hover:font-bold hover:underline"
              >
                {item.title}
              </Link>
              <LinkIcon className="ml-2 inline-block" />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

const mcp_link: Array<{ title: string; link: string }> = [
  {
    title: '🧩 Get started with the Model Context Protocol (MCP)',
    link: 'https://modelcontextprotocol.io/introduction',
  },
  {
    title: '🧠 MCP는 AI 업계의 표준이 될까요?',
    link: 'https://channel.io/ko/blog/articles/what-is-mcp-52c77e72',
  },
  { title: '🌟 Awesome MCP Servers', link: 'https://mcpservers.org/' },
  {
    title:
      '🤗 20 Awesome MCP Servers List I Have Collected (You Should Try Too)',
    link: 'https://huggingface.co/blog/lynn-mikami/awesome-mcp-servers',
  },
  {
    title: '🚀 MCP: 웹 검색부터 파일 관리까지, AI의 한계를 확장하는 표준 기술',
    link: 'https://fornewchallenge.tistory.com/entry/%F0%9F%9A%80-MCP-%EC%9B%B9-%EA%B2%80%EC%83%89%EB%B6%80%ED%84%B0-%ED%8C%8C%EC%9D%BC-%EA%B4%80%EB%A6%AC%EA%B9%8C%EC%A7%80-AI%EC%9D%98-%ED%95%9C%EA%B3%84%EB%A5%BC-%ED%99%95%EC%9E%A5%ED%95%98%EB%8A%94-%ED%91%9C%EC%A4%80-%EA%B8%B0%EC%88%A0',
  },
];
