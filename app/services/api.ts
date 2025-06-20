import {
  AIChatRes,
  AIResponse,
  ChatReq,
  DurationData,
  McpParamsRes,
  McpRes,
  MessagesResponse,
  SaveAIResponseRes,
  SaveChatRes,
  ServerDetail,
  ServerRes,
  UserListRes,
} from '@/app/types';
import { ChatResponse } from 'ollama';
import { SaveServerForm } from '../types/server';
import { McpToolRes } from '../types/management';

const API_BASE_URL = '/api';

export const aiModel_management = {
  // AI 요청
  requestAI: async (data: SaveChatRes): Promise<AIChatRes> => {
    const res = await fetch(`${API_BASE_URL}/model/ai-request`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const con: ChatResponse = await res.json();

    if (!res.ok) throw new Error('AI 응답 생성 실패');

    // AI 응답을 비동기적으로 저장
    message_management
      .saveAIResponse({
        id: data.id,
        success: true,
        messageId: data.id,
        content: con.message.content,
        total_duration: con.total_duration,
      })
      .catch((error) => {
        console.error('AI 응답 저장 실패:', error);
      });

    return { ...con, id: data.id, USER_ID: data.USER_ID };
  },

  // ai ping
  getModelPing: async () => {
    const res = await fetch(`${API_BASE_URL}/model/status-ping`);
    if (!res.ok) throw new Error('model ping 조회 실패');
    return res.json();
  },
};

export const message_management = {
  // 메시지 목록 조회
  getMessages: async (
    userId: string,
    cursor?: string,
    limit: number = 5
  ): Promise<MessagesResponse> => {
    const queryParams = new URLSearchParams({
      userId,
      limit: limit.toString(),
    });
    if (cursor) queryParams.append('cursor', cursor);

    const url = `${API_BASE_URL}/message/get-messages?${queryParams.toString()}`;

    const res = await fetch(url);
    if (!res.ok) throw new Error('메시지 조회 실패');

    return res.json();
  },

  // 전체 메시지 날짜 목록 조회
  getAllMessageDates: async (
    userId: string
  ): Promise<{ dates: { date: string; count: number }[] }> => {
    const res = await fetch(
      `${API_BASE_URL}/message/get-all-dates?userId=${userId}`
    );
    if (!res.ok) throw new Error('메시지 날짜 목록 조회 실패');
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
  getAIResponse: async (messageId: number): Promise<AIResponse | null> => {
    const res = await fetch(
      `${API_BASE_URL}/message/get-ai-response?messageId=${messageId}`
    );
    if (!res.ok) throw new Error('AI 응답 조회 실패');
    return res.json();
  },

  // ai 응답 시간 조회
  getMessageDuration: async (): Promise<DurationData[]> => {
    const response = await fetch(`${API_BASE_URL}/message/get-durations`);

    if (!response.ok) throw new Error('서버 정보 수정 실패');
    return response.json();
  },

  // MCP 응답 저장
  saveMcpResponse: async (data: {
    messageId: number;
    response: string;
    clientId: string;
  }): Promise<{ success: boolean; id: number }> => {
    const res = await fetch(`${API_BASE_URL}/message/save-mcp-response`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('MCP 응답 저장 실패');
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

    if (!response.ok) throw new Error('서버 등록 실패');
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

    if (!response.ok) throw new Error('서버 삭제 실패');
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

    if (!response.ok) throw new Error('서버 정보 수정 실패');
    return response.json();
  },
};

export const mcp_management = {
  getMcpTools: async () => {
    const response = await fetch(`${API_BASE_URL}/mcp/get-mcp-tools`);
    if (!response.ok) {
      throw new Error('MCP 정보 조회 실패');
    }
    return response.json();
  },
  updateMcpTools: async (tools: McpToolRes[]) => {
    const response = await fetch(`${API_BASE_URL}/mcp/update-mcp-tools`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ tools }),
    });
    if (!response.ok) {
      throw new Error('MCP 정보 업데이트 실패');
    }
    return response.json();
  },
  addMcpTool: async (tool: McpToolRes) => {
    const response = await fetch(`${API_BASE_URL}/mcp/add-mcp-tool`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(tool),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'MCP 정보 추가 실패');
    }
    return response.json();
  },
  deleteMcpTool: async (TOOLNAME: string) => {
    const response = await fetch(
      `${API_BASE_URL}/mcp/delete-mcp-tool?TOOLNAME=${TOOLNAME}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'MCP 정보 삭제 실패');
    }
    return response.json();
  },
  getMcpToolUsage: async (serverId: string): Promise<McpRes[]> => {
    const response = await fetch(
      `${API_BASE_URL}/mcp/get-mcp-tool-usage?serverId=${serverId}`
    );
    if (!response.ok) {
      throw new Error('MCP 툴 사용 현황 조회 실패');
    }
    return response.json();
  },
  updateMcpToolUsage: async (
    serverId: string,
    toolName: string,
    useYon: 'Y' | 'N'
  ) => {
    const response = await fetch(`${API_BASE_URL}/mcp/update-mcp-tool-usage`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ serverId, toolName, useYon }),
    });
    if (!response.ok) {
      throw new Error('MCP 툴 사용 현황 업데이트 실패');
    }
    return response.json();
  },

  getMcpToolParams: async (
    SERVERNAME: string,
    TOOLNAME?: string
  ): Promise<McpParamsRes[]> => {
    const url = `${API_BASE_URL}/mcp/${TOOLNAME ? 'get-mcp-tool-params' : 'get-mcp-tools-params'}?SERVERNAME=${SERVERNAME}${TOOLNAME ? '&TOOLNAME=' + TOOLNAME : ''}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('MCP 툴 사용 현황 조회 실패');
    }
    return response.json();
  },

  updateMcpToolParams: async (param: McpParamsRes) => {
    const response = await fetch(`${API_BASE_URL}/mcp/update-mcp-tool-params`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(param),
    });
    if (!response.ok) {
      throw new Error('MCP 툴 파라미터 업데이트 실패');
    }
    return response.json();
  },

  addMcpToolParam: async (param: Partial<McpParamsRes>) => {
    const response = await fetch(`${API_BASE_URL}/mcp/add-mcp-tool-param`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(param),
    });
    if (!response.ok) {
      throw new Error('MCP 툴 파라미터 추가 실패');
    }
    return response.json();
  },

  deleteMcpToolParams: async (param: McpParamsRes) => {
    const response = await fetch(`${API_BASE_URL}/mcp/delete-mcp-tool-params`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(param),
    });
    if (!response.ok) {
      throw new Error('MCP 툴 파라미터 삭제 실패');
    }
    return response.json();
  },
};

export const common_management = {
  getUserList: async (): Promise<UserListRes[]> => {
    const res = await fetch(`${API_BASE_URL}/common/get-user-list`);
    if (!res.ok) throw new Error('유저 목록 조회 실패');
    return res.json();
  },

  updateUsers: async (users: UserListRes[]): Promise<{ success: boolean }> => {
    const res = await fetch(`${API_BASE_URL}/common/update-users`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ users }),
    });
    if (!res.ok) throw new Error('사용자 정보 수정 실패');
    return res.json();
  },

  addUser: async (
    user: Partial<UserListRes>
  ): Promise<{ success: boolean }> => {
    const res = await fetch(`${API_BASE_URL}/common/add-user`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || '사용자 추가 실패');
    }
    return res.json();
  },

  deleteUser: async (email: string): Promise<{ success: boolean }> => {
    const res = await fetch(`${API_BASE_URL}/common/delete-user`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || '사용자 삭제 실패');
    }
    return res.json();
  },

  getDBSserverPing: async (): Promise<{ success: boolean }> => {
    const res = await fetch(`${API_BASE_URL}/common/db-server-ping`);
    if (!res.ok) throw new Error('DB 서버 ping 실패');
    return res.json();
  },
};
