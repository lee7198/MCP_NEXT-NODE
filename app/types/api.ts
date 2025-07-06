import { ChatResponse } from 'ollama';

// NextAuth 타입 확장
declare module 'next-auth' {
  interface Session {
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      accessToken?: string;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    accessToken?: string;
  }
}

// 채팅 관련 API 타입
export interface SaveChatRes {
  id: number;
  success: boolean;
  CONTENT: string;
  USER_ID: string;
  MCP_SERVER?: string;
  roomId?: string;
}

export interface AIChatRes extends ChatResponse {
  id: number;
  USER_ID: string;
}

// 서버 관련 API 타입
export interface ServerRes {
  SERVERNAME: string;
  RESPONSED_AT: Date;
}

export interface ServerDetail {
  SERVERNAME: string;
  COMMENT: string;
  RESPONSED_AT: Date;
}

// MCP 관련 API 타입
export interface McpRes {
  TOOLNAME: string;
  TOOL_COMMENT: string;
  SERVERNAME: string;
  USE_YON: 'Y' | 'N';
}

export interface McpParamsRes {
  SERVERNAME: string;
  TOOLNAME: string;
  ARGUMENT: string;
  ORDER_NO: number;
  COMMENT: string;
}

// 사용자 관련 API 타입
export interface UserListRes {
  USERNAME: string;
  EMAIL: string;
  USE_YON: 'Y' | 'N';
  LAST_LOGIN_AT: Date;
  ROLE: string;
}
