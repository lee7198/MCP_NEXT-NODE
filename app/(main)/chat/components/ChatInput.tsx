'use client';

import { PaperPlaneTiltIcon } from '@phosphor-icons/react';
import React, { useState, useRef, useEffect } from 'react';
import type { ChatInputProps, serverStatus } from '@/app/types';
import { useQuery } from '@tanstack/react-query';
import {
  aiModel_management,
  mcp_management,
  server_management,
} from '@/app/services/api';
import { useSocket } from '@/app/hooks/useSocket';
import StatusPing from '../../settings/components/StatusPing';
import { XIcon } from '@phosphor-icons/react/dist/ssr';

export default function ChatInput({
  onSendMessage,
  isDisabled = false,
  USER_ID,
}: ChatInputProps) {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [boxHeight, setBoxHeight] = useState(1);
  const [selectServer, setSelectServer] = useState('');
  const [isMcpSettingsOpen, setIsMcpSettingsOpen] = useState(false);
  const [serverStatuses, setServerStatuses] = useState<
    Record<string, serverStatus>
  >({});
  const { clients, sendMessageWithMCP, mcpResponse } = useSocket();

  const { data: servers } = useQuery({
    queryKey: ['server_config'],
    queryFn: () => server_management.getServers(),
  });
  const { data: mcps } = useQuery({
    queryKey: ['mcp_config', selectServer],
    queryFn: () => mcp_management.getMcpToolUsage(selectServer),
    enabled: !!selectServer,
  });
  const { data: mcpParams } = useQuery({
    queryKey: ['mcp_config_parmas', selectServer],
    queryFn: () => mcp_management.getMcpToolParams(selectServer),
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

  const sendMessage = () => {
    if (message.trim() && !isDisabled) {
      onSendMessage({ CONTENT: message.trim(), USER_ID });
      setMessage('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectServer !== '' && mcpParams) {
      sendMessageWithMCP('TEST', message, mcpParams);
      // setMessage('');
    } else {
      sendMessage();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      // sendMessage();
      if (selectServer !== '' && mcpParams) {
        sendMessageWithMCP('TEST', message, mcpParams);
        // setMessage('');
      } else {
        sendMessage();
      }
    }
    // Shift+Enter는 기본 동작(줄바꿈)을 허용
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
      // MCP 응답 처리
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
    <div className="flex flex-col">
      <div className="relative flex gap-4 border-t py-2">
        <button
          onClick={() => setIsMcpSettingsOpen(!isMcpSettingsOpen)}
          className={`cursor-pointer rounded-md px-2 text-sm ${selectServer ? 'border bg-green-500 text-black' : 'border bg-white'} `}
        >
          MCP 설정 : {selectServer || '선택안함'}
        </button>
        {isMcpSettingsOpen && (
          <>
            <div
              className="fixed top-0 left-0 z-10 h-screen w-screen cursor-pointer bg-black/20 backdrop-blur-[4px]"
              onClick={() => setIsMcpSettingsOpen(false)}
            />
            <div className="absolute bottom-12 z-20 max-w-96 rounded-lg bg-white p-4 shadow-2xl">
              <div className="mb-2 flex items-start justify-between">
                <h3 className="text-lg">선택가능한 서버</h3>
                <div className="flex gap-2">
                  <button
                    className="cursor-pointer rounded-full bg-gray-200 px-1 text-sm"
                    onClick={() => {
                      setSelectServer('');
                      setIsMcpSettingsOpen(false);
                    }}
                  >
                    선택 취소
                  </button>
                  <button
                    className="cursor-pointer rounded-full bg-gray-200 p-1"
                    onClick={() => setIsMcpSettingsOpen(false)}
                  >
                    <XIcon size={14} weight="bold" />
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-1">
                <div className="col-span-1 flex max-h-52 flex-col gap-2 overflow-y-scroll">
                  {servers?.map((server) => (
                    <button
                      key={server.SERVERNAME}
                      className={`z-20 mr-2 cursor-pointer rounded-lg border border-gray-300 px-2 py-1 text-sm disabled:cursor-not-allowed disabled:opacity-65 ${
                        selectServer === server.SERVERNAME ? 'bg-gray-200' : ''
                      }`}
                      onClick={() => handleServerSelect(server.SERVERNAME)}
                      disabled={serverStatuses[server.SERVERNAME] !== 'success'}
                    >
                      <div className="flex items-center gap-2">
                        <StatusPing
                          status={serverStatuses[server.SERVERNAME]}
                          size={2}
                        />
                        <span>{server.SERVERNAME}</span>
                      </div>
                    </button>
                  ))}
                </div>
                <ul className="col-span-1 max-h-52 list-inside list-disc overflow-y-scroll">
                  <div className="font-bold">
                    {selectServer && selectServer + '서버 tool 정보'}
                  </div>
                  {mcps?.map((mcp) => (
                    <li
                      key={mcp.TOOLNAME}
                      className="z-20 mr-2 rounded-lg px-2 py-1 text-sm"
                    >
                      {mcp.TOOLNAME}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </>
        )}

        <div className="flex items-center gap-2 text-sm">
          AI Model Status :
          {isPending ? (
            <StatusPing status="loading" size={2} />
          ) : isSuccess ? (
            <StatusPing status="success" size={2} />
          ) : (
            <StatusPing status="offline" size={2} />
          )}
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className={`flex items-end overflow-y-hidden ${message ? 'gap-2' : 'gap-0'}`}
      >
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="메시지를 입력하세요..."
          className={`focus:border-main/50 max-h-48 min-h-12 flex-1 resize-none overflow-y-auto rounded-lg border border-gray-300 p-2 leading-normal transition-all duration-300 focus:outline-none ${message ? 'mr-0 w-auto' : 'mr-0 w-full'} ${isDisabled ? 'bg-gray-300' : ''}`}
          rows={boxHeight}
          disabled={isDisabled}
        />
        <div
          className={`flex items-end transition-all duration-300 ${
            message
              ? 'ml-0 h-full w-14 scale-100 opacity-100'
              : 'pointer-events-none ml-0 w-0 scale-90 opacity-0'
          } ${isDisabled ? 'cursor-not-allowed opacity-50' : ''}`}
        >
          <button
            type="submit"
            className="bg-main hover:bg-main/80 h-full grow-0 cursor-pointer rounded-lg px-4 py-4 text-white focus:outline-none"
            tabIndex={message ? 0 : -1}
            disabled={!message.trim() || isDisabled}
          >
            <PaperPlaneTiltIcon size={18} />
          </button>
        </div>
      </form>
    </div>
  );
}
