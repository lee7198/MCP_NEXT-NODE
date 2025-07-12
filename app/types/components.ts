import React from 'react';
import {
  Message,
  ChatReq,
  DurationData,
  RoomInfo,
  UserPromptResponse,
  PromptStatus,
} from './message';
import { ClientInfo } from './socket';
import { McpRes, ServerRes, McpParamsRes } from './api';
import { ServerStatus, PingStatus } from './common';

// 채팅 관련 컴포넌트 타입
export interface ChatMessageProps {
  message: Message;
  reqState: AIRequestState;
  setReqState: React.Dispatch<React.SetStateAction<AIRequestState>>;
}

export interface ChatInputProps {
  onSendMessage: (content: ChatReq) => void;
  isDisabled: boolean;
  USER_ID: string;
  selectServer: string;
  setSelectServer: React.Dispatch<React.SetStateAction<string>>;
  mcpParams?: McpParamsRes[];
  isMcpParamsPending: boolean;
  openNav: boolean;
}

export interface MessageListProps {
  messages: Message[];
  userId?: string;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
  reqState: AIRequestState;
  setReqState: React.Dispatch<React.SetStateAction<AIRequestState>>;
  lastMessageRef: (node: HTMLDivElement) => void;
}

export interface AIResponseChatProps {
  CONTENT: string;
  CREATED_AT: Date;
}

export interface AIRequestState {
  messageId: number;
  isAIRes: boolean;
  isAIResSave: boolean;
}

export interface MessageInputProps {
  message: string;
  setMessage: (message: string) => void;
  onSendMessage: () => void;
  isDisabled: boolean;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  boxHeight: number;
}

// 네비게이션 관련 컴포넌트 타입
export interface DateDividerProps {
  date?: string;
}

export interface DateNavigationProps {
  messages: Message[];
  onDateClick: (date: string) => void;
}

export interface RoomNavigationProps {
  rooms: RoomInfo[];
  isRoomSuccess: boolean;
  isRoomLoading: boolean;
  openNav: boolean;
  setOpenNav: React.Dispatch<React.SetStateAction<boolean>>;
  selectRoom: string;
  setSelectRoom: React.Dispatch<React.SetStateAction<string>>;
  onNewChat: () => void;
}

// 서버 관련 컴포넌트 타입
export interface StatusPingProps {
  status: ServerStatus;
  size?: number;
}

export interface ServerCardProps {
  serverName: string;
  serverStatus: ServerStatus;
  client?: ClientInfo;
  pingStatus: PingStatus;
  onTestPing: (serverName: string) => void;
}

export interface ServerCardSkeletonProps {
  index: number;
}

export interface ServerCardWrapperProps {
  serverName: string;
  onTestPing: (serverName: string) => void;
  pingStatus: PingStatus;
}

export interface ServerListProps {
  clients: ClientInfo[];
  servers: ServerRes[];
  isGetServers: boolean;
  serverStatuses: Record<string, ServerStatus>;
  pingStatuses: Record<string, PingStatus>;
  handleTestPing: (serverName: string) => void;
}

export interface ServerStatusProps {
  isPending: boolean;
  isSuccess: boolean;
}

// MCP 관련 컴포넌트 타입
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
  serverStatuses: Record<string, ServerStatus>;
  mcps: McpRes[] | undefined;
  isMcpParamsPending: boolean;
}

// 차트 관련 컴포넌트 타입
export interface ResponseTimeChartProps {
  data: DurationData[];
  selectedUsername: string;
  isDataPending: boolean;
}

export interface PromptFavoritesModalProps {
  isOpen: boolean;
  onClose: () => void;
  prompts?: UserPromptResponse[];
  setMessage: (msg: string) => void;
}

export interface PromptTableProps {
  prompts: UserPromptResponse[] | undefined;
  isPending: boolean;
  modifiedPrompts: UserPromptResponse[];
  editingIdx: number | null;
  deletingOrderNos: Set<number>;
  changedItems: Set<number>;
  animatingOrderNo: number | null;
  animationDirection: 'up' | 'down' | null;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
  onEditClick: (idx: number) => void;
  onPromptChange: (idx: number, value: string) => void;
  onEditCancel: () => void;
  onApplyChanges: () => void;
  onDeleteClick: (orderNo: number) => void;
  onDeleteCancel: (orderNo: number) => void;
  isAdding: boolean;
  addMutate: { isPending: boolean };
  onAddCancel: () => void;
  onAdd: (prompt: Partial<PromptStatus>) => void;
}

export interface PromptHeaderProps {
  isAdding: boolean;
  editingIdx: number | null;
  changedItems: Set<number>;
  deletingOrderNos: Set<number>;
  onAddClick: () => void;
  onCancel: () => void;
  onSave: () => void;
}

export interface ContainerWrapperProps {
  children: React.ReactNode;
}
