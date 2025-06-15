import { Icon } from '@phosphor-icons/react';
import { ServerRes } from './api';
import { serverStatusType } from './components';
import { DurationData } from './message';
import { ClientInfo } from './socket';
import { MarkerType, Position, Node } from '@xyflow/react';

export interface UsageCardProps {
  todayUsage: number;
}

export interface ServerStatusCardProps {
  isPending: boolean;
  isSuccess: boolean;
}

export interface ResponseTimeSectionProps {
  data: DurationData[];
  selectedUsername: string;
  isDataPending: boolean;
  uniqueUsernames: string[];
  onUsernameChange: (username: string) => void;
}

export type McpLinkArticle = { title: string; link: string };

export interface AgentStatusSectionProps {
  clients: ClientInfo[];
  servers: ServerRes[];
  serverStatuses: Record<string, serverStatusType>;
}

export interface FlowSectionProps {
  servers: ServerRes[];
  serverStatuses: Record<string, serverStatusType>;
  modelStatus: serverStatusType;
  dbStatus: serverStatusType;
}

export type FlowNodeDataType = {
  title: string;
  subtitle?: string;
  icon?: Icon;
  isSourceVisible?: boolean;
  isTargetVisible?: boolean;
  sourcePosition?: Position;
  targetPosition?: Position;
  status?: serverStatusType;
};

export interface CustomNode extends Node {
  data: FlowNodeDataType;
  state: serverStatusType;
}

export type CustomEdge = {
  id: string;
  source: string;
  target: string;
  animated: boolean;
  markerEnd: {
    type: MarkerType;
  };
  label?: string;
  type: string;
};
