import { ChatResponse } from 'ollama';

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
