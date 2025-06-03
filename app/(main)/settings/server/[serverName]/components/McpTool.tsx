import React from 'react';
import { mcp_management } from '@/app/services/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { McpToolProps } from '@/app/types';

export default function McpTool({
  serverId,
  isGetMcps,
  mcpTools,
}: McpToolProps) {
  const queryClient = useQueryClient();

  const updateMcpToolMutation = useMutation({
    mutationFn: ({
      toolName,
      useYon,
    }: {
      toolName: string;
      useYon: 'Y' | 'N';
    }) => mcp_management.updateMcpToolUsage(serverId, toolName, useYon),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mcp_list'] });
      toast.success('Tool 사용 여부가 업데이트되었습니다');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleToggle = (toolName: string, currentUseYon: 'Y' | 'N') => {
    const newUseYon = currentUseYon === 'Y' ? 'N' : 'Y';
    updateMcpToolMutation.mutate({ toolName, useYon: newUseYon });
  };

  return (
    <div className="rounded-lg bg-gray-50 p-4">
      <h2 className="mb-4 text-lg font-semibold">
        MCP(Model Context Protocol) 정보
      </h2>
      <div className="mt-2 flex flex-col gap-2">
        {/* header */}
        <div className="grid grid-cols-5 gap-4 border-b px-2 pb-2">
          <div className="col-span-4 font-bold">MCP:설명</div>
          <div className="text-center font-bold">사용유무</div>
        </div>
        {/* content */}
        {isGetMcps
          ? mcpTools?.map((mcp) => (
              <div
                key={mcp.TOOLNAME}
                className="mb-2 grid grid-cols-5 gap-4 rounded-sm px-2 py-1 hover:bg-gray-100"
              >
                <div className="col-span-4 flex flex-col gap-1">
                  <div className="font-bold">{mcp.TOOLNAME}</div>
                  <div className="text-sm">{mcp.TOOL_COMMENT}</div>
                </div>

                <label
                  className="inline-flex cursor-pointer items-center justify-center"
                  aria-label={`${mcp.TOOLNAME} 사용 여부 토글`}
                >
                  <input
                    type="checkbox"
                    checked={mcp.USE_YON === 'Y'}
                    onChange={() => handleToggle(mcp.TOOLNAME, mcp.USE_YON)}
                    disabled={updateMcpToolMutation.isPending}
                    className="peer sr-only"
                  />
                  <div
                    className={`peer relative h-6 w-11 rounded-full bg-gray-200 peer-checked:bg-green-600 peer-focus:ring-0 peer-focus:outline-none after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-white rtl:peer-checked:after:-translate-x-full ${updateMcpToolMutation.isPending ? 'cursor-not-allowed opacity-50' : ''}`}
                  />
                </label>
              </div>
            ))
          : new Array(3).fill(0).map((_, i) => (
              <div
                key={i}
                className="mb-2 flex animate-pulse flex-col gap-1 py-1"
              >
                <div className="h-6 w-50 rounded-lg bg-gray-300 font-bold" />
                <div className="h-5 w-20 rounded-lg bg-gray-300 font-bold" />
              </div>
            ))}
      </div>
    </div>
  );
}
