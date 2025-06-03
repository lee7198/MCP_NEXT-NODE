import {
  AIChatRes,
  AIResponse,
  ChatReq,
  McpRes,
  MessagesResponse,
  SaveAIResponseRes,
  SaveChatRes,
  ServerDetail,
  ServerRes,
} from '@/app/types';
import { ChatResponse } from 'ollama';
import { SaveServerForm } from '../types/server';

const API_BASE_URL = '/api';

export const messageApi = {
  // 메시지 목록 조회
  getMessages: async (userId: string): Promise<MessagesResponse> => {
    const res = await fetch(
      `${API_BASE_URL}/message/get-messages?userId=${userId}`
    );
    if (!res.ok) throw new Error('메시지 조회 실패');
    return res.json();
  },

  // 메시지 저장
  saveMessage: async (data: ChatReq): Promise<SaveChatRes> => {
    const res = await fetch(`${API_BASE_URL}/message/save-message`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('메시지 저장 실패');
    return res.json();
  },

  // AI 요청
  requestAI: async (data: SaveChatRes): Promise<AIChatRes> => {
    const res = await fetch(`${API_BASE_URL}/model/ai-request`, {
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
    const res = await fetch(`${API_BASE_URL}/message/save-ai-response`, {
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
      `${API_BASE_URL}/message/get-ai-response?messageId=${messageId}`
    );
    if (!res.ok) throw new Error('AI 응답 조회 실패');
    return res.json();
  },
};

export const server_management = {
  getServers: async (): Promise<ServerRes[]> => {
    const res = await fetch(`${API_BASE_URL}/server/get-servers`);
    if (!res.ok) throw new Error('서버 목록 조회 실패');
    return res.json();
  },

  saveServer: async (data: SaveServerForm): Promise<{ success: boolean }> => {
    const response = await fetch(`${API_BASE_URL}/server/save-server`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error('서버 등록에 실패했습니다.');
    return response.json();
  },

  getServer: async (serverId: string): Promise<ServerDetail> => {
    const res = await fetch(
      `${API_BASE_URL}/server/get-server?serverId=${serverId}`
    );
    if (!res.ok) throw new Error('서버 조회 실패');
    return res.json();
  },

  deleteServer: async (serverId: string): Promise<{ success: boolean }> => {
    const response = await fetch(
      `${API_BASE_URL}/server/delete-server?serverId=${serverId}`,
      {
        method: 'DELETE',
      }
    );

    if (!response.ok) throw new Error('서버 삭제에 실패했습니다.');
    return response.json();
  },

  updateServer: async (
    serverId: string,
    comment: string
  ): Promise<{ success: boolean }> => {
    const response = await fetch(`${API_BASE_URL}/server/update-server`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ serverId, comment }),
    });

    if (!response.ok) throw new Error('서버 정보 수정에 실패했습니다.');
    return response.json();
  },
};

export const mcp_management = {
  getMcpTools: async (serverId: string): Promise<McpRes[]> => {
    const res = await fetch(
      `${API_BASE_URL}/mcp/get-mcp-tools?serverId=${serverId}`
    );
    if (!res.ok) throw new Error('MCP 툴 목록 조회 실패');
    return res.json();
  },

  updateMcpToolUsage: async (
    serverId: string,
    toolName: string,
    useYon: 'Y' | 'N'
  ): Promise<{ success: boolean }> => {
    const res = await fetch(`${API_BASE_URL}/mcp/update-mcp-tool-usage`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ serverId, toolName, useYon }),
    });
    if (!res.ok) throw new Error('MCP 툴 사용 여부 업데이트 실패');
    return res.json();
  },
};
