'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeftIcon } from '@phosphor-icons/react/dist/ssr';
import { mcp_management, server_management } from '@/app/services/api';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { ServerHeader } from './components/ServerHeader';
import { ServerDescription } from './components/ServerDescription';
import { ServerInfo } from './components/ServerInfo';
import { ServerDetailPageProps } from '@/app/types/server';
import McpTool from './components/McpTool';
import McpToolSetting from './components/McpToolSetting';
import { useSocket } from '@/app/hooks/useSocket';

export default function ServerDetailPage({ params }: ServerDetailPageProps) {
  const router = useRouter();
  const resolvedParams = React.use(params);
  const [toggleEdit, setToggleEdit] = useState(false);
  const [editedComment, setEditedComment] = useState('');
  const { clients } = useSocket();

  const {
    data: server,
    isLoading,
    isError,
    refetch: refetchServerDetail,
  } = useQuery({
    queryKey: ['server_detail', resolvedParams.serverName],
    queryFn: async () => server_management.getServer(resolvedParams.serverName),
    enabled: !!resolvedParams.serverName,
  });

  const deleteServerMutation = useMutation({
    mutationFn: (serverId: string) => server_management.deleteServer(serverId),
    onSuccess: () => {
      toast.success('서버가 삭제되었습니다');
      router.push('/settings');
      router.refresh();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const updateServerMutation = useMutation({
    mutationFn: (data: { serverId: string; comment: string }) =>
      server_management.updateServer(data.serverId, data.comment),
    onSuccess: () => {
      toast.success('서버 정보가 수정되었습니다');
      setToggleEdit(false);
      refetchServerDetail();
      router.refresh();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleEdit = () => {
    if (toggleEdit && editedComment !== server?.COMMENT) {
      if (
        !window.confirm(
          '수정된 내용이 있습니다. 정말로 수정을 취소하시겠습니까?'
        )
      ) {
        return;
      }
    }
    setToggleEdit(!toggleEdit);
    setEditedComment(server?.COMMENT || '');
  };

  const handleSave = () => {
    updateServerMutation.mutate({
      serverId: resolvedParams.serverName,
      comment: editedComment,
    });
  };

  const handleDelete = () => {
    if (window.confirm('정말로 이 서버를 삭제하시겠습니까?')) {
      deleteServerMutation.mutate(resolvedParams.serverName);
    }
  };

  const { data: mcpTools, isSuccess: isGetMcps } = useQuery({
    queryKey: ['mcp_list'],
    queryFn: async () =>
      mcp_management.getMcpToolUsage(resolvedParams.serverName),
  });

  const serverStatus = clients.some(
    (client) => client.clientId === resolvedParams.serverName
  )
    ? 'success'
    : 'offline';

  useEffect(() => {
    if (isError)
      toast.error(
        '서버 정보를 가져오는데 실패했습니다. 잠시 후 다시 시도해주세요.'
      );
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <Link
        href="/settings/servers"
        className="mb-6 inline-flex items-center gap-2 text-gray-600 hover:text-gray-900"
      >
        <ArrowLeftIcon size={20} />
        <span>돌아가기</span>
      </Link>

      <div className="rounded-lg bg-white p-6 shadow-lg">
        <ServerHeader
          serverName={resolvedParams.serverName}
          toggleEdit={toggleEdit}
          isEditing={updateServerMutation.isPending}
          isDeleting={deleteServerMutation.isPending}
          onEdit={handleEdit}
          onDelete={handleDelete}
          status={serverStatus}
        />

        <div className="grid gap-6 md:grid-cols-2">
          <ServerDescription
            isEditing={updateServerMutation.isPending}
            isLoading={isLoading}
            toggleEdit={toggleEdit}
            comment={server?.COMMENT || ''}
            editedComment={editedComment}
            isUpdating={updateServerMutation.isPending}
            onCommentChange={setEditedComment}
            onSave={handleSave}
          />

          <ServerInfo
            isLoading={isLoading}
            serverName={resolvedParams.serverName}
            responsedAt={
              server?.RESPONSED_AT ? new Date(server.RESPONSED_AT) : undefined
            }
          />
          <McpTool
            serverId={resolvedParams.serverName}
            isGetMcps={isGetMcps}
            mcpTools={mcpTools}
          />
          <McpToolSetting mcpTools={mcpTools} isGetMcps={isGetMcps} />
        </div>
      </div>
    </div>
  );
}
