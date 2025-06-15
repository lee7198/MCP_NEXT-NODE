import React from 'react';
import { EdgeTypes, NodeTypes, ReactFlow } from '@xyflow/react';
import CustomFlowNode from './CustomFlowNode';
import { FlowSectionProps } from '@/app/types/dashboard';
import { serverStatusType } from '@/app/types';
import { initialEdges, initialNodes } from './nodeAndEede';
import CustomFlowEdge from './CustomFlowEdge';
import {
  CircleNotchIcon,
  LinkBreakIcon,
  LinkIcon,
} from '@phosphor-icons/react/dist/ssr';

import '@xyflow/react/dist/style.css';

const stateToDisplay = (serverState: serverStatusType) => {
  switch (serverState) {
    case 'success':
      return { icon: LinkIcon, label: 'success' };
    case 'offline':
      return { icon: LinkBreakIcon, label: 'offline' };
    default:
      return { icon: CircleNotchIcon, label: 'loading' };
  }
};

export default function McpFlowSection({
  servers,
  serverStatuses,
  modelStatus,
  dbStatus,
}: FlowSectionProps) {
  const nodeTypes: NodeTypes = {
    custom: CustomFlowNode,
  };

  const edgeTypes: EdgeTypes = {
    custom: CustomFlowEdge,
  };

  // 서버 리스트 중 연결상태가 있다면 true
  const agentStatus = servers?.filter(
    (server) => serverStatuses[server.SERVERNAME] === 'success'
  );

  const nodes = initialNodes.map((node) => {
    let state: serverStatusType = 'offline';
    if (node.id === 'Web Server') {
      state = 'success';
    } else if (node.id === 'DB Server') {
      state = dbStatus || 'offline';
    } else if (node.id === 'AI Model') {
      state = modelStatus || 'offline';
    } else if (node.id === 'AI Agent') {
      state = agentStatus.length > 0 ? 'success' : 'offline';
    }
    return {
      ...node,
      state,
      data: {
        ...node.data,
        status: state,
      },
    };
  });

  const edges = initialEdges.map((edge) => {
    let animated = true;
    let conf = undefined;

    if (edge.id === 'eb-w') {
      const dbState = dbStatus || 'offline';
      animated = dbState !== 'offline';
      conf = stateToDisplay(dbState);
    } else if (edge.id === 'ea-w') {
      const modelState = modelStatus || 'offline';
      animated = modelState !== 'offline';
      conf = stateToDisplay(modelState);
    } else if (edge.id === 'ew-c') {
      const webState = agentStatus.length > 0 ? 'success' : 'offline';
      animated = webState !== 'offline';
      conf = stateToDisplay(webState);
    } else if (edge.id === 'ec-a') {
      const agentState = modelStatus || 'offline';
      animated = agentState !== 'offline';
      conf = stateToDisplay(agentState);
    }

    return {
      ...edge,
      animated,
      data: { ...conf },
    };
  });

  return (
    <div className="relative col-span-3 h-[350px] w-full rounded-lg bg-white p-4 shadow">
      <h2 className="absolute z-50 bg-white/40 px-2 text-lg font-bold backdrop-blur">
        System Flow
      </h2>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        className="h-full w-full"
      />
    </div>
  );
}
