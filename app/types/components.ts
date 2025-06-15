import React from 'react';
import { Message, ChatReq, DurationData } from './message';
import { ClientInfo } from './socket';
import { McpRes, ServerRes, McpParamsRes } from './api';

export interface ChatMessageProps {
  message: Message;
  reqState: AIReqState;
  setReqState: React.Dispatch<React.SetStateAction<AIReqState>>;
}

export interface ChatInputProps {
  onSendMessage: (content: ChatReq) => void;
  isDisabled: boolean;
  USER_ID: string;
  selectServer: string;
  setSelectServer: React.Dispatch<React.SetStateAction<string>>;
  mcpParams?: McpParamsRes[];
  isMcpParamsPending: boolean;
}

export interface DateDividerProps {
  date?: string;
}

export interface MessageListProps {
  messages: Message[];
  userId?: string;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
  reqState: AIReqState;
  setReqState: React.Dispatch<React.SetStateAction<AIReqState>>;
  lastMessageRef: (node: HTMLDivElement) => void;
}

export interface AIResponseChatProps {
  CONTENT: string;
  CREATED_AT: Date;
}

export interface AIReqState {
  messageId: number;
  isAIRes: boolean;
  isAIResSave: boolean;
}

export type serverStatusType = 'offline' | 'loading' | 'success';
export type pingStatusType = 'idle' | 'loading' | 'success';
export interface StatusPingProps {
  status: serverStatusType;
  size?: number;
}

export interface ServerCardProps {
  serverName: string;
  serverStatus: serverStatusType;
  client?: ClientInfo;
  pingStatus: pingStatusType;
  onTestPing: (serverName: string) => void;
}

export interface ServerCardSkeletonProps {
  index: number;
}

export interface ServerCardWrapperProps {
  serverName: string;
  onTestPing: (serverName: string) => void;
  pingStatus: pingStatusType;
}

export interface ServerListProps {
  clients: ClientInfo[];
  servers: ServerRes[];
  isGetServers: boolean;
  serverStatuses: Record<string, serverStatusType>;
  pingStatuses: Record<string, pingStatusType>;
  handleTestPing: (serverName: string) => void;
}

export interface McpToolProps {
  serverId: string;
  isGetMcps: boolean;
  mcpTools: McpRes[] | undefined;
}

export interface McpToolSettingProps {
  isGetMcps: boolean;
  mcpTools: McpRes[] | undefined;
  serverId: string;
}

export interface McpSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedServer: string;
  onServerSelect: (serverId: string) => void;
  onClearSelection: () => void;
  servers: ServerRes[] | undefined;
  serverStatuses: Record<string, serverStatusType>;
  mcps: McpRes[] | undefined;
  isMcpParamsPending: boolean;
}

export interface ServerStatusProps {
  isPending: boolean;
  isSuccess: boolean;
}

export interface MessageInputProps {
  message: string;
  setMessage: (message: string) => void;
  onSendMessage: () => void;
  isDisabled: boolean;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  boxHeight: number;
}

export interface ResponseTimeChartProps {
  data: DurationData[];
  selectedUsername: string;
  isDataPending: boolean;
}
