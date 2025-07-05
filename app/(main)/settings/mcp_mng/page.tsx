'use client';

import React, { useState } from 'react';
import { mcp_management } from '@/app/services/api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { McpToolRes } from '@/app/types';
import { AddMcpForm } from './components/AddMcpForm';
import { McpTable } from './components/McpTable';
import Link from 'next/link';
import { CaretLeftIcon } from '@phosphor-icons/react/dist/ssr';

export default function Mcp_mng() {
  const queryClient = useQueryClient();
  const [editedTools, setEditedTools] = useState<Record<string, McpToolRes>>(
    {}
  );
  const [isAddingTool, setIsAddingTool] = useState(false);

  const {
    data: mcpTools,
    isPending,
    isSuccess,
  } = useQuery({
    queryKey: ['mcp_tool_mst'],
    queryFn: async () => mcp_management.getMcpTools(),
  });

  const updateMcpToolMutation = useMutation({
    mutationFn: async (tools: McpToolRes[]) => {
      return mcp_management.updateMcpTools(tools);
    },
    onSuccess: () => {
      toast.success('성공적으로 수정되었습니다.');
      queryClient.invalidateQueries({ queryKey: ['mcp_tool_mst'] });
      setEditedTools({});
    },
  });

  const addMcpToolMutation = useMutation({
    mutationFn: async (tool: Partial<McpToolRes>) => {
      return mcp_management.addMcpTool(tool as McpToolRes);
    },
    onSuccess: () => {
      toast.success('Tool이 성공적으로 추가되었습니다.');
      queryClient.invalidateQueries({ queryKey: ['mcp_tool_mst'] });
      setIsAddingTool(false);
    },
    onError: (error: Error) => {
      if (error.message === '이미 존재하는 Tool입니다.') {
        toast.error('이미 존재하는 Tool입니다.');
      } else {
        toast.error('Tool 추가에 실패했습니다.');
      }
    },
  });

  const deleteMcpToolMutation = useMutation({
    mutationFn: async (toolName: string) => {
      return mcp_management.deleteMcpTool(toolName);
    },
    onSuccess: () => {
      toast.success('Tool이 성공적으로 삭제되었습니다.');
      queryClient.invalidateQueries({ queryKey: ['mcp_tool_mst'] });
      setEditedTools({});
    },
    onError: (error: Error) => {
      if (error.message === '존재하지 않는 Tool입니다.') {
        toast.error('존재하지 않는 Tool입니다.');
      } else {
        toast.error('Tool 삭제에 실패했습니다.');
      }
    },
  });

  const handleEdit = (tool: McpToolRes) => {
    if (editedTools[tool.TOOLNAME]) {
      setEditedTools((prev) => {
        const newState = { ...prev };
        delete newState[tool.TOOLNAME];
        return newState;
      });
    } else {
      setEditedTools((prev) => ({
        ...prev,
        [tool.TOOLNAME]: { ...tool },
      }));
    }
  };

  const handleSave = () => {
    const toolsToUpdate = Object.values(editedTools);
    if (toolsToUpdate.length > 0) {
      updateMcpToolMutation.mutate(toolsToUpdate);
    }
  };

  const handleAddTool = (tool: Partial<McpToolRes>) => {
    if (!tool.TOOLNAME) {
      toast.error('Tool 이름을 입력해주세요.');
      return;
    }
    addMcpToolMutation.mutate(tool);
  };

  const handleDelete = (toolName: string) => {
    if (window.confirm('정말로 이 Tool을 삭제하시겠습니까?')) {
      deleteMcpToolMutation.mutate(toolName);
    }
  };

  return (
    <div className="container mx-auto bg-gray-50 p-6 dark:bg-zinc-900">
      <div className="mb-6 flex items-center justify-between">
        {' '}
        <h1 className="flex items-center gap-2 text-2xl font-bold text-gray-900 dark:text-zinc-100">
          <Link
            href="/settings"
            className="text-gray-900 hover:text-gray-600 dark:text-zinc-100 dark:hover:text-gray-300"
          >
            <CaretLeftIcon size={24} weight="bold" />
          </Link>
          <span>MCP 마스터 관리</span>
        </h1>
        <div className="flex gap-2">
          {Object.keys(editedTools).length === 0 && !isAddingTool && (
            <button
              onClick={() => {
                if (isSuccess) setIsAddingTool(true);
              }}
              className="cursor-pointer rounded-md bg-gray-600 px-4 py-2 text-xs font-medium text-white hover:bg-gray-800 dark:bg-zinc-700 dark:hover:bg-zinc-600"
            >
              Tool 추가
            </button>
          )}
          {Object.keys(editedTools).length > 0 && (
            <button
              onClick={handleSave}
              className="cursor-pointer rounded-md bg-gray-600 px-4 py-2 text-xs font-medium text-white hover:bg-gray-800 dark:bg-zinc-700 dark:hover:bg-zinc-600"
            >
              변경사항 저장
            </button>
          )}
        </div>
      </div>
      <div className="overflow-auto rounded-lg bg-white shadow dark:bg-zinc-800 dark:shadow-gray-900/20">
        {isAddingTool && (
          <AddMcpForm
            onAdd={handleAddTool}
            onCancel={() => setIsAddingTool(false)}
          />
        )}

        <McpTable
          mcpTools={isSuccess ? mcpTools : []}
          onEdit={handleEdit}
          onDelete={handleDelete}
          editedTools={editedTools}
          setEditedTools={setEditedTools}
          isPending={isPending}
        />

        {/* <GridSystem
          headerList={{
            'TOOL 이름': 'TOOLNAME',
            '설명': 'COMMENT',
            '작업': 'TASK',
          }}
          data={
            isSuccess
              ? mcpTools.map((item) => [
                  <td>{item.TOOLNAME}</td>,
                  <td>{item.COMMENT}</td>,
                  <div>hello</div>,
                ])
              : []
          }
        /> */}
      </div>
    </div>
  );
}
