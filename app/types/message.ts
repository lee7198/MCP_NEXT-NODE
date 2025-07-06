// 채팅 메시지 관련 타입 정의

// 기본 메시지 타입
export interface Message {
  ID?: string | number;
  USER_ID: string;
  CONTENT: string;
  CREATED_AT: Date;
  isUser?: boolean;
  isLoading?: boolean;
}

// 채팅 요청/응답 타입
export interface ChatReq {
  CONTENT: string;
  USER_ID: string;
  ID?: string;
  isMCP?: boolean;
  MCP_SERVER?: string;
  roomId?: string;
}

export interface ChatRes extends Message {
  res: string;
}

// AI 응답 관련 타입
export interface AIResponse {
  ID: number;
  MESSAGE_ID: number;
  CONTENT: string;
  CREATED_AT: Date;
}

export interface AIResponseResponse {
  response: AIResponse | null;
}

export interface SaveAIResponseRes {
  id: number;
  success: boolean;
  messageId: number;
  content: string;
  total_duration: number;
}

// 대화방 관련 타입
export interface RoomInfo {
  roomId: string;
  content: string;
  createdAt: Date;
  count: string;
}

// 통계 데이터 타입
export interface DurationData {
  USERNAME: string;
  CREATED_AT: Date;
  TOTAL_DURATION: number;
}

// 페이지네이션 응답 타입
export interface MessagesResponse {
  messages: Message[];
  hasMore: boolean;
  nextCursor?: string;
}

// 사용자 프롬프트 응답 타입
export interface UserPromptResponse {
  TITLE: string;
  PROMPT: string;
  CREATED_AT: Date;
  ORDER_NO: number;
}
