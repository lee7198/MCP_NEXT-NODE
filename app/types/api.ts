import { ChatResponse } from 'ollama';

// API 응답 및 에러 처리 관련 타입 정의
export interface ApiResponse<T> {
  data: T;
  error?: string;
}

export interface ApiError {
  message: string;
  status: number;
}

export interface SaveChatRes {
  id: number;
  success: boolean;
  content: string;
  USER_ID: string;
}

export interface AIChatRes extends ChatResponse {
  id: number;
  USER_ID: string;
}

export interface ServerRes {
  SERVERNAME: string;
  RESPONSED_AT: Date;
}

export interface ServerDetail {
  SERVERNAME: string;
  COMMENT: string;
  RESPONSED_AT: Date;
}

export interface McpRes {
  TOOLNAME: string;
  TOOL_COMMENT: string;
  SERVERNAME: string;
  USE_YON: 'Y' | 'N';
}

export interface UserListRes {
  USERNAME: string;
  EMAIL: string;
  USE_YON: 'Y' | 'N';
  LAST_LOGIN_AT: Date;
  ROLE: string;
}

export interface McpParamsRes {
  SERVERNAME: string;
  TOOLNAME: string;
  ARGUMENT: string;
  ORDER_NO: number;
  COMMENT: string;
}
