import {
  AIChatRes,
  AIResponse,
  ChatReq,
  MessagesResponse,
  SaveAIResponseRes,
  SaveChatRes,
  ServerDetail,
  ServerList,
} from '@/app/types';
import { ChatResponse } from 'ollama';
import { SaveServerForm } from '../types/server';

const API_BASE_URL = '/api';

export const messageApi = {
  // 메시지 목록 조회
  getMessages: async (userId: string): Promise<MessagesResponse> => {
    const res = await fetch(`${API_BASE_URL}/get-messages?userId=${userId}`);
    if (!res.ok) throw new Error('메시지 조회 실패');
    return res.json();
  },

  // 메시지 저장
  saveMessage: async (data: ChatReq): Promise<SaveChatRes> => {
    const res = await fetch(`${API_BASE_URL}/save-message`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('메시지 저장 실패');
    return res.json();
  },

  // AI 요청
  requestAI: async (data: SaveChatRes): Promise<AIChatRes> => {
    const res = await fetch(`${API_BASE_URL}/ai-request`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const con: ChatResponse = await res.json();

    if (!res.ok) throw new Error('AI 응답 생성 실패');
    return { ...con, id: data.id, USER_ID: data.USER_ID };
  },

  // AI 응답 저장
  saveAIResponse: async (
    data: SaveAIResponseRes
  ): Promise<SaveAIResponseRes> => {
    const res = await fetch(`${API_BASE_URL}/save-ai-response`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('AI 응답 저장 실패');
    return res.json();
  },

  // AI 응답 조회
  getAIResponse: async (messageId: number): Promise<AIResponse> => {
    const res = await fetch(
      `${API_BASE_URL}/get-ai-response?messageId=${messageId}`
    );
    if (!res.ok) throw new Error('AI 응답 조회 실패');
    return res.json();
  },
};

export const server_management = {
  getServers: async (): Promise<ServerList[]> => {
    const res = await fetch(`${API_BASE_URL}/get-servers`);
    if (!res.ok) throw new Error('서버 목록 조회 실패');
    return res.json();
  },

  saveServer: async (data: SaveServerForm): Promise<{ success: boolean }> => {
    const response = await fetch(`${API_BASE_URL}/save-server`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error('서버 등록에 실패했습니다.');
    return response.json();
  },

  getServer: async (serverId: string): Promise<ServerDetail> => {
    const res = await fetch(`${API_BASE_URL}/get-server?serverId=${serverId}`);
    if (!res.ok) throw new Error('서버 조회 실패');
    return res.json();
  },
};
