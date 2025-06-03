import { McpToolSettingProps } from '@/app/types';
import React from 'react';

export default function McpToolSetting({
  mcpTools,
  isGetMcps,
}: McpToolSettingProps) {
  return (
    <div className="p-4 pt-0">
      <h2 className="mb-4 text-lg font-semibold">MCP Tool 설정</h2>
      <div className="flex flex-wrap gap-2">
        {isGetMcps && mcpTools ? (
          mcpTools.filter((item) => item.USE_YON === 'Y').length > 0 ? (
            mcpTools
              .filter((item) => item.USE_YON === 'Y')
              .map((tool, index) => (
                <button
                  key={index}
                  className="flex h-8 cursor-pointer items-center justify-center rounded-full bg-gray-200 px-4 uppercase hover:bg-gray-300"
                >
                  {tool.TOOLNAME}
                </button>
              ))
          ) : (
            <div>사용하고 있는 Tool이 없어요.</div>
          )
        ) : (
          new Array(3)
            .fill(0)
            .map((_, i) => (
              <div
                key={i}
                className="h-8 w-24 animate-pulse rounded-full bg-gray-200"
              />
            ))
        )}
      </div>
    </div>
  );
}
