import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';

import '@/tailwind.config';
import { FlowNodeDataType } from '@/app/types';
import StatusPing from '@/app/(main)/settings/components/StatusPing';

function CustomFlowNode({ data }: { data: FlowNodeDataType }) {
  const { icon: Icon } = data;

  return (
    <div className="rounded-md border border-gray-800 bg-white px-4 py-2 shadow-md">
      <div className="absolute top-2 right-1.5">
        <StatusPing status={data.status || 'offline'} size={2} />
      </div>
      <div className="flex items-center gap-2">
        {Icon && (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
            <Icon size={20} />
          </div>
        )}
        <div className="text-xs">
          <div className="font-bold">{data.title}</div>
          <div className="text-gray-500">{data.subtitle}</div>
        </div>
      </div>

      {data.isTargetVisible && (
        <Handle
          type="target"
          position={data.targetPosition || Position.Left}
          className="w-16 !bg-gray-500"
        />
      )}
      {data.isSourceVisible && (
        <Handle
          type="source"
          position={data.sourcePosition || Position.Right}
          className="w-16 !bg-gray-500"
        />
      )}
    </div>
  );
}

export default memo(CustomFlowNode);
