import React from 'react';
import { Message, ChatReq } from './message';
import { ClientInfo } from './socket';

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
  userId: string;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
  reqState: AIReqState;
  setReqState: React.Dispatch<React.SetStateAction<AIReqState>>;
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

export interface ServerDetailPageProps {
  params: Promise<{ serverName: string }>;
}

export interface ServerListProps {
  servers: Array<{
    SERVERNAME: string;
  }>;
  isGetServers: boolean;
}

export interface ServerCardWrapperProps {
  serverName: string;
  onTestPing: (serverName: string) => void;
  pingStatus: pingStatus;
}
