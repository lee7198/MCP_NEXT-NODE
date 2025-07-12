import React from 'react';
import { UserListRes } from './api';
import { SaveUserPromptRequest } from './message';

// 사용자 관리 관련 타입
export interface UserFormData {
  USERNAME: string;
  EMAIL: string;
  USE_YON: 'Y' | 'N';
}

export interface UserTableProps {
  users: UserListRes[];
  onEdit: (user: UserListRes) => void;
  onDelete: (email: string) => void;
  editedUsers: Record<string, UserListRes>;
  setEditedUsers: React.Dispatch<
    React.SetStateAction<Record<string, UserListRes>>
  >;
  isSuccess: boolean;
  isPending: boolean;
}

export interface AddUserFormProps {
  onAdd: (user: Partial<UserListRes>) => void;
  onCancel: () => void;
  isSaving?: boolean;
}

// MCP 도구 관리 관련 타입
export interface McpToolRes {
  TOOLNAME: string;
  COMMENT: string;
}

export interface McpTableProps {
  mcpTools: McpToolRes[];
  onEdit: (tool: McpToolRes) => void;
  onDelete: (toolName: string) => void;
  editedTools: Record<string, McpToolRes>;
  setEditedTools: React.Dispatch<
    React.SetStateAction<Record<string, McpToolRes>>
  >;
  isPending: boolean;
}

export interface AddMcpFormProps {
  onAdd: (tool: Partial<McpToolRes>) => void;
  onCancel: () => void;
  isSaving?: boolean;
}

export interface AddPromptFormProps {
  onAdd: (tool: Partial<SaveUserPromptRequest>) => void;
  onCancel: () => void;
  isSaving: boolean;
}
