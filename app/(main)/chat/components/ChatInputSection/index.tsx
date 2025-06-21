'use client';

import React, { useState, useRef, useEffect } from 'react';
import type { ChatInputProps, ServerStatus } from '@/app/types';
import { useQuery } from '@tanstack/react-query';
import {
  aiModel_management,
  mcp_management,
  server_management,
} from '@/app/services/api';
import { useSocket } from '@/app/hooks/useSocket';
import McpSettingsModal from './components/McpSettingsModal';
import ServerStatusPing from './components/ServerStatusPing';
import MessageInput from './components/MessageInput';

export default function ChatInputSection({
  onSendMessage,
  isDisabled = false,
  USER_ID,
  selectServer,
  setSelectServer,
  mcpParams,
  isMcpParamsPending,
}: ChatInputProps) {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [boxHeight, setBoxHeight] = useState(1);
  const [isMcpSettingsOpen, setIsMcpSettingsOpen] = useState(false);
  const [serverStatuses, setServerStatuses] = useState<
    Record<string, ServerStatus>
  >({});
  const { clients, mcpResponse } = useSocket();

  const { data: servers } = useQuery({
    queryKey: ['server_config'],
    queryFn: () => server_management.getServers(),
  });

  const { data: mcps } = useQuery({
    queryKey: ['mcp_config', selectServer],
    queryFn: () => mcp_management.getMcpToolUsage(selectServer),
    enabled: !!selectServer,
  });

  const { isPending, isSuccess } = useQuery({
    queryKey: ['model_server'],
    queryFn: () => aiModel_management.getModelPing(),
    refetchInterval: 5000,
  });

  useEffect(() => {
    if (servers) {
      servers.forEach((server) => {
        const isOnLine = clients.some(
          (client) => client.clientId === server.SERVERNAME
        );
        setServerStatuses((prev) => ({
          ...prev,
          [server.SERVERNAME]: isOnLine ? 'success' : 'offline',
        }));
      });
    }
  }, [servers, clients]);

  const handleSendMessage = () => {
    if (message.trim() && !isDisabled) {
      if (selectServer !== '' && mcpParams) {
        // message DB 저장
        onSendMessage({
          CONTENT: message.trim(),
          USER_ID,
          MCP_SERVER: selectServer,
        });
      } else {
        // 일반 ai 요청 message 저장
        onSendMessage({ CONTENT: message.trim(), USER_ID });
      }
      setMessage('');
    }
  };

  const handleServerSelect = (serverId: string) => {
    if (serverStatuses[serverId] === 'success') {
      if (selectServer === serverId) {
        setSelectServer('');
        setIsMcpSettingsOpen(false);
      } else {
        setSelectServer(serverId);
      }
    }
  };

  useEffect(() => {
    if (mcpResponse) {
      console.log(mcpResponse.response);
    }
  }, [mcpResponse]);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      const maxRows = 6;
      const lines = message.split('\n').length;
      const rows = Math.min(lines, maxRows);
      setBoxHeight(rows);
    }
  }, [message]);

  return (
    <div className="flex w-full flex-col items-center border-t">
      <div className="relative flex w-full gap-4 py-2 lg:w-3/4 lg:max-w-5xl">
        <button
          onClick={() => setIsMcpSettingsOpen(!isMcpSettingsOpen)}
          className={`cursor-pointer rounded-md px-2 text-sm ${selectServer ? 'border bg-green-500 text-black' : 'border bg-white'} `}
        >
          MCP 설정 : {selectServer ? <b>{selectServer}</b> : '선택안함'}
        </button>

        <McpSettingsModal
          isOpen={isMcpSettingsOpen}
          onClose={() => setIsMcpSettingsOpen(false)}
          selectedServer={selectServer}
          onServerSelect={handleServerSelect}
          onClearSelection={() => {
            setSelectServer('');
            setIsMcpSettingsOpen(false);
          }}
          servers={servers}
          serverStatuses={serverStatuses}
          mcps={mcps}
          isMcpParamsPending={isMcpParamsPending}
        />

        <ServerStatusPing isPending={isPending} isSuccess={isSuccess} />
      </div>

      <MessageInput
        message={message}
        setMessage={setMessage}
        onSendMessage={handleSendMessage}
        isDisabled={isDisabled}
        textareaRef={textareaRef}
        boxHeight={boxHeight}
      />
    </div>
  );
}
