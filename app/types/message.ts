export interface Message {
  ID?: string | number;
  USER_ID: string;
  CONTENT: string;
  CREATED_AT: Date;
  isUser?: boolean;
  isLoading?: boolean;
}

export interface MessagesResponse {
  messages: Message[];
}

export interface ChatRes extends Message {
  res: string;
}

export interface ChatReq {
  CONTENT: string;
  USER_ID: string;
  ID?: string;
}

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
}
