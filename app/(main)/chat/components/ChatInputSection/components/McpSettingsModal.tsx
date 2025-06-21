'use client';

import { XIcon } from '@phosphor-icons/react/dist/ssr';
import { useRef, useEffect } from 'react';
import { McpSettingsModalProps } from '@/app/types';
import StatusPing from '@/app/(main)/settings/components/StatusPing';
import Spinner from '@/app/(main)/components/common/Spinner';

export default function McpSettingsModal({
  isOpen,
  onClose,
  selectedServer,
  onServerSelect,
  onClearSelection,
  servers,
  serverStatuses,
  mcps,
  isMcpParamsPending,
}: McpSettingsModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  // 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={modalRef}
      className="absolute bottom-12 z-20 max-w-96 rounded-lg bg-white p-4 shadow-2xl"
    >
      <div className="mb-2 flex items-start justify-between">
        <h3 className="text-lg">선택가능한 서버</h3>
        <div className="flex gap-2">
          <button
            className="cursor-pointer rounded-full bg-gray-200 px-1 text-sm"
            onClick={onClearSelection}
          >
            선택 취소
          </button>
          <button
            className="cursor-pointer rounded-full bg-gray-200 p-1"
            onClick={onClose}
          >
            <XIcon size={14} weight="bold" />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-1">
        <div className="col-span-1 flex max-h-52 flex-col gap-2 overflow-y-scroll">
          {servers === undefined ? (
            <div className="flex h-full items-center justify-center py-8">
              <Spinner size={6} />
              <span className="ml-2 text-sm text-gray-500">
                서버 목록을 불러오는 중...
              </span>
            </div>
          ) : servers.length === 0 ? (
            <div className="flex h-full items-center justify-center py-8 text-sm text-gray-400">
              등록된 서버가 없습니다.
            </div>
          ) : (
            servers.map((server) => (
              <button
                key={server.SERVERNAME}
                className={`z-20 mr-2 cursor-pointer rounded-lg border border-gray-300 px-2 py-1 text-sm disabled:cursor-not-allowed disabled:opacity-65 ${
                  selectedServer === server.SERVERNAME ? 'bg-gray-200' : ''
                }`}
                onClick={() => onServerSelect(server.SERVERNAME)}
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
            ))
          )}
        </div>
        <ul className="col-span-1 max-h-52 space-y-2 overflow-y-scroll">
          <div className="font-bold text-gray-700">TOOL(MCP) 정보</div>
          {selectedServer !== '' && isMcpParamsPending ? (
            <div className="flex items-center justify-center p-4">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-gray-500"></div>
            </div>
          ) : (
            mcps?.map((mcp) => (
              <li
                key={mcp.TOOLNAME}
                className="group relative rounded-lg border border-gray-100 bg-gray-50 p-2 text-sm transition-all hover:bg-gray-100"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-800">
                    {mcp.TOOLNAME}
                  </span>
                  <span className="text-xs text-gray-500">
                    {mcp.USE_YON === 'Y' ? '사용' : '미사용'}
                  </span>
                </div>
                {mcp.USE_YON === 'Y' && (
                  <div className="mt-1 pl-2 text-xs text-gray-600">
                    <div className="flex items-center gap-1">
                      <div className="h-1.5 w-1.5 rounded-full bg-green-500"></div>
                      <span>활성화됨</span>
                    </div>
                  </div>
                )}
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
