import React from 'react';
import { Message, ChatReq } from './message';
import { ClientInfo } from './socket';
import { McpRes, ServerRes } from './api';

export interface ChatMessageProps {
  message: Message;
  reqState: AIReqState;
  setReqState: React.Dispatch<React.SetStateAction<AIReqState>>;
}

export interface ChatInputProps {
  onSendMessage: (content: ChatReq) => void;
  isDisabled: boolean;
  USER_ID: string;
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

export type serverStatus = 'offline' | 'loading' | 'success';
export type pingStatus = 'idle' | 'loading' | 'success';
export interface StatusPingProps {
  status: serverStatus;
  size?: number;
}

export interface ServerCardProps {
  serverName: string;
  serverStatus: serverStatus;
  client?: ClientInfo;
  pingStatus: pingStatus;
  onTestPing: (serverName: string) => void;
}

export interface ServerCardSkeletonProps {
  index: number;
}

export interface ServerCardWrapperProps {
  serverName: string;
  onTestPing: (serverName: string) => void;
  pingStatus: pingStatus;
}

export interface ServerListProps {
  clients: ClientInfo[];
  servers: ServerRes[];
  isGetServers: boolean;
  serverStatuses: Record<string, serverStatus>;
  pingStatuses: Record<string, pingStatus>;
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
