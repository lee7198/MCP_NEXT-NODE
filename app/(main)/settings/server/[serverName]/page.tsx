'use client';

import React from 'react';
import Link from 'next/link';
import StatusPing from '../../components/StatusPing';
import { ServerDetailPageProps } from '@/app/types';
import {
  ArrowLeftIcon,
  WarningOctagonIcon,
  CheckIcon,
} from '@phosphor-icons/react/dist/ssr';
import { server_management } from '@/app/services/api';
import { useQuery } from '@tanstack/react-query';
import { useSocket } from '@/app/hooks/useSocket';

export default function ServerDetailPage({ params }: ServerDetailPageProps) {
  const resolvedParams = React.use(params);
  const {
    data: server,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['server_detail', resolvedParams.serverName],
    queryFn: async () => server_management.getServer(resolvedParams.serverName),
    enabled: !!resolvedParams.serverName,
  });

  const { pingStatus, handleTestPing } = useSocket(resolvedParams.serverName);

  return (
    <div className="container mx-auto px-4 py-8">
      <Link
        href="/settings"
        className="mb-6 inline-flex items-center gap-2 text-gray-600 hover:text-gray-900"
      >
        <ArrowLeftIcon size={20} />
        <span>설정으로 돌아가기</span>
      </Link>

      {isError && (
        <div className="mb-6 rounded-lg bg-red-50 p-4 text-red-700">
          <div className="flex items-center gap-2">
            <WarningOctagonIcon size={24} weight="fill" />
            <p className="font-medium">서버 정보를 가져오는데 실패했습니다.</p>
          </div>
          <p className="mt-2 text-sm">잠시 후 다시 시도해주세요.</p>
        </div>
      )}

      <div className="rounded-lg bg-white p-6 shadow-lg">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <StatusPing status={true} />
            <h1 className="text-2xl font-bold">{resolvedParams?.serverName}</h1>
          </div>

          <button
            type="button"
            className="flex min-w-30 cursor-pointer items-center justify-center rounded-md bg-white px-2 active:opacity-35 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={pingStatus === 'loading'}
            onClick={handleTestPing}
          >
            {pingStatus === 'loading' ? (
              <div className="py-1">
                <div className="size-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600"></div>
              </div>
            ) : pingStatus === 'success' ? (
              <div className="flex gap-2">
                <div>PONG</div>
                <CheckIcon size={24} color="#00c951" weight="bold" />
              </div>
            ) : (
              'PING TEST'
            )}
          </button>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-lg bg-gray-50 p-4">
            <h2 className="mb-4 text-lg font-semibold">서버 설명</h2>
            {isLoading ? (
              <div className="h-4 w-3/4 animate-pulse rounded-lg bg-gray-400" />
            ) : (
              <p>{server?.COMMENT}</p>
            )}
          </div>

          <div className="rounded-lg bg-gray-50 p-4">
            <h2 className="mb-4 text-lg font-semibold">서버 정보</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">서버 이름</span>
                {isLoading ? (
                  <div className="h-4 w-32 animate-pulse rounded-lg bg-gray-400" />
                ) : (
                  <span className="font-medium">
                    {resolvedParams?.serverName}
                  </span>
                )}
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">마지막 응답 시간</span>
                {isLoading ? (
                  <div className="h-4 w-48 animate-pulse rounded-lg bg-gray-400" />
                ) : (
                  <span className="font-medium">
                    {server?.RESPONSED_AT &&
                      new Date(server.RESPONSED_AT).toLocaleString('ko-KR', {
                        timeZone: 'Asia/Seoul',
                      })}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
