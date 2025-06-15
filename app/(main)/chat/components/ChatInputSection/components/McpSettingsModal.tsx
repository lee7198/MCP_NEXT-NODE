'use client';

import { XIcon } from '@phosphor-icons/react/dist/ssr';
import { McpSettingsModalProps } from '@/app/types';
import StatusPing from '@/app/(main)/settings/components/StatusPing';

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
  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed top-0 left-0 z-10 h-screen w-screen cursor-pointer bg-black/20 backdrop-blur-[4px]"
        onClick={onClose}
      />
      <div className="absolute bottom-12 z-20 max-w-96 rounded-lg bg-white p-4 shadow-2xl">
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
            {servers?.map((server) => (
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
            ))}
          </div>
          <ul className="col-span-1 max-h-52 list-inside list-disc overflow-y-scroll">
            <div className="font-bold">
              {selectedServer && selectedServer + '서버 tool 정보'}
            </div>
            {selectedServer !== '' && isMcpParamsPending ? (
              <div className="flex items-center justify-center p-4">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-gray-500"></div>
              </div>
            ) : (
              mcps?.map((mcp) => (
                <li
                  key={mcp.TOOLNAME}
                  className="z-20 mr-2 rounded-lg px-2 py-1 text-sm"
                >
                  {mcp.TOOLNAME}
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </>
  );
}
