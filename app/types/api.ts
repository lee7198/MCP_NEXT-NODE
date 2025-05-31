import { ChatResponse } from 'ollama';
import { WebSocket } from 'ws';

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

export interface SocketClient {
  id: string;
  ws: WebSocket;
}
