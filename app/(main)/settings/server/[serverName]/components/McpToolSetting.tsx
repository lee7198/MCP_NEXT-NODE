import { mcp_management } from '@/app/services/api';
import { McpParamsRes, McpToolSettingProps } from '@/app/types';
import { PlusIcon } from '@phosphor-icons/react/dist/ssr';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

export default function McpToolSetting({
  mcpTools,
  isGetMcps,
  serverId,
}: McpToolSettingProps) {
  const [settingTool, setSettingTool] = useState('');
  const [editedParam, setEditedParam] = useState<Record<number, McpParamsRes>>(
    {}
  );
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newParam, setNewParam] = useState<Partial<McpParamsRes>>({
    ARGUMENT: '',
    COMMENT: '',
  });

  const queryClient = useQueryClient();

  const {
    data: toolParams,
    isPending: paramPending,
    isSuccess: paramSuccess,
    refetch,
  } = useQuery({
    queryKey: ['mcpTools', serverId, settingTool],
    queryFn: () => mcp_management.getMcpToolParams(serverId, settingTool),
    enabled: isGetMcps && settingTool !== '' && serverId !== undefined,
  });

  const updateParamMutation = useMutation({
    mutationFn: (param: McpParamsRes) =>
      mcp_management.updateMcpToolParams(param),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['mcpTools', serverId, settingTool],
      });
      toast.success('파라미터가 성공적으로 수정되었습니다.');
      setEditedParam({});
    },
    onError: (error: Error) => {
      if (error.message === '이미 존재하는 순서 번호입니다.') {
        toast.error('이미 존재하는 순서 번호입니다.');
      } else {
        toast.error(error.message || '파라미터 수정에 실패했습니다.');
      }
    },
  });

  const addParamMutation = useMutation({
    mutationFn: (param: Partial<McpParamsRes>) =>
      mcp_management.addMcpToolParam(param),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['mcpTools', serverId, settingTool],
      });
      toast.success('파라미터가 성공적으로 추가되었습니다.');
      setIsAddingNew(false);
      setNewParam({ ARGUMENT: '', COMMENT: '' });
    },
    onError: (error: Error) => {
      toast.error(error.message || '파라미터 추가에 실패했습니다.');
    },
  });

  const deleteParamMutation = useMutation({
    mutationFn: (param: McpParamsRes) =>
      mcp_management.deleteMcpToolParams(param),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['mcpTools', serverId, settingTool],
      });
      toast.success('파라미터가 성공적으로 삭제되었습니다.');
    },
    onError: (error: Error) => {
      toast.error(error.message || '파라미터 삭제에 실패했습니다.');
    },
  });

  const handleEditClick = (param: McpParamsRes) => {
    setEditedParam((prev) => ({
      ...prev,
      [param.ORDER_NO]: { ...param },
    }));
  };

  const handleCancel = (orderNo?: number) => {
    if (orderNo) {
      setEditedParam((prev) => {
        const newState = { ...prev };
        delete newState[orderNo];
        return newState;
      });
    } else {
      setEditedParam({});
    }
  };

  const handleInputChange = (
    param: McpParamsRes,
    field: keyof McpParamsRes,
    value: string
  ) => {
    setEditedParam((prev) => ({
      ...prev,
      [param.ORDER_NO]: {
        ...prev[param.ORDER_NO],
        [field]: value,
      },
    }));
  };

  const handleAddNew = () => {
    setIsAddingNew(true);
  };

  const handleSaveNew = () => {
    const newParamData = {
      ...newParam,
      SERVERNAME: serverId,
      TOOLNAME: settingTool,
    };
    addParamMutation.mutate(newParamData);
  };

  const handleCancelNew = () => {
    setIsAddingNew(false);
    setNewParam({ ARGUMENT: '', COMMENT: '' });
  };

  const handleNewInputChange = (field: keyof McpParamsRes, value: string) => {
    setNewParam((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleDelete = (param: McpParamsRes) => {
    if (window.confirm('정말로 이 파라미터를 삭제하시겠습니까?')) {
      deleteParamMutation.mutate(param);
    }
  };

  // 여러 파라미터 일괄 저장 함수
  const handleBulkUpdate = () => {
    Object.values(editedParam).forEach((param) => {
      const updatedParam = {
        ...param,
        SERVERNAME: serverId,
        TOOLNAME: settingTool,
      };
      updateParamMutation.mutate(updatedParam);
    });
    setEditedParam({});
  };

  useEffect(() => {
    if (mcpTools) {
      const filtedTool = mcpTools.filter((item) => item.USE_YON === 'Y');
      if (filtedTool.length > 1) {
        const filtedTool2 = filtedTool.filter(
          (item) => item.TOOLNAME === settingTool
        );
        if (filtedTool2.length === 0) setSettingTool(filtedTool[0].TOOLNAME);
      } else {
        if (filtedTool[0]) setSettingTool(filtedTool[0].TOOLNAME);
      }
    }
  }, [mcpTools]);

  useEffect(() => {
    if (settingTool) refetch();
  }, [settingTool]);

  return (
    <div className="flex flex-col gap-4 md:col-span-2">
      <h2 className="text-lg font-semibold">MCP Tool 설정</h2>

      <div className="flex flex-wrap gap-2">
        {isGetMcps && mcpTools ? (
          mcpTools.filter((item) => item.USE_YON === 'Y').length > 0 ? (
            mcpTools
              .filter((item) => item.USE_YON === 'Y')
              .map((tool, index) => (
                <button
                  key={index}
                  onClick={() => setSettingTool(tool.TOOLNAME)}
                  className={` ${
                    settingTool === tool.TOOLNAME
                      ? 'bg-gray-800 font-black text-white hover:bg-gray-700'
                      : 'bg-gray-200 hover:bg-gray-300'
                  } flex h-8 cursor-pointer items-center justify-center rounded-full px-4 uppercase`}
                >
                  {tool.TOOLNAME}
                </button>
              ))
          ) : (
            <div>사용하고 있는 Tool이 없어요.</div>
          )
        ) : (
          new Array(3)
            .fill(0)
            .map((_, i) => (
              <div
                key={i}
                className="h-8 w-24 animate-pulse rounded-full bg-gray-200"
              />
            ))
        )}
      </div>
      {/* tools parameter */}
      <div className="rounded-lg bg-gray-50 p-4 md:col-span-2">
        <div className="flex justify-between">
          <h2 className="mb-2 text-lg font-semibold">
            MCP Tool Parameter 정보
          </h2>
          {Object.keys(editedParam).length > 0 && (
            <button
              onClick={handleBulkUpdate}
              className="cursor-pointer rounded bg-gray-600 px-4 py-1 text-sm text-white hover:bg-gray-700"
            >
              변경사항 저장
            </button>
          )}
        </div>
        {/* grid header */}
        <div className="grid grid-cols-8 items-center justify-center gap-1 border-b bg-gray-300 p-2 text-sm lg:grid-cols-12">
          <div className="row-span-2 text-center lg:row-span-1">No.</div>
          <div className="col-span-7 lg:col-span-4">Value</div>
          <div className="col-span-5">설명</div>
          <div className="col-span-2 text-center">작업</div>
        </div>
        <div className="grid grid-cols-8 items-center justify-center divide-y text-sm lg:grid-cols-12">
          {paramPending || !paramSuccess ? (
            <div className="col-span-8 grid grid-cols-8 items-center gap-1 p-2 lg:col-span-12 lg:grid-cols-12">
              <div className="row-span-2 h-5 w-8 animate-pulse rounded-md bg-gray-300 lg:row-span-1" />
              <div className="col-span-7 h-5 w-72 animate-pulse rounded-md bg-gray-300 lg:col-span-4" />
              <div className="col-span-5 h-5 w-56 animate-pulse rounded-md bg-gray-300" />
              <div className="col-span-2 h-5 w-16 animate-pulse rounded-md bg-gray-300" />
            </div>
          ) : (
            toolParams &&
            toolParams.map((item) => (
              <div
                key={item.ORDER_NO}
                className="col-span-8 grid grid-cols-8 items-center gap-1 p-2 lg:col-span-12 lg:grid-cols-12"
              >
                <div className="text-cente row-span-2 text-center lg:row-span-1">
                  {editedParam[item.ORDER_NO] ? (
                    <input
                      type="number"
                      value={editedParam[item.ORDER_NO]?.ORDER_NO || ''}
                      readOnly
                      className="w-full rounded border bg-gray-100 px-1"
                      min="1"
                    />
                  ) : (
                    item.ORDER_NO
                  )}
                </div>
                <div className="col-span-7 font-bold lg:col-span-4">
                  {editedParam[item.ORDER_NO] ? (
                    <input
                      type="text"
                      value={editedParam[item.ORDER_NO]?.ARGUMENT || ''}
                      onChange={(e) =>
                        handleInputChange(item, 'ARGUMENT', e.target.value)
                      }
                      className="w-full rounded border px-1"
                    />
                  ) : (
                    item.ARGUMENT
                  )}
                </div>
                <div className="col-span-5 text-gray-700 italic">
                  {editedParam[item.ORDER_NO] ? (
                    <input
                      type="text"
                      value={editedParam[item.ORDER_NO]?.COMMENT || ''}
                      onChange={(e) =>
                        handleInputChange(item, 'COMMENT', e.target.value)
                      }
                      className="w-full rounded border px-1"
                    />
                  ) : (
                    item.COMMENT
                  )}
                </div>
                <div className="col-span-2">
                  {editedParam[item.ORDER_NO] ? (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDelete(item)}
                        className="w-full cursor-pointer rounded bg-red-200 px-2 py-1 hover:bg-red-300"
                      >
                        삭제
                      </button>
                      <button
                        onClick={() => handleCancel(item.ORDER_NO)}
                        className="w-full cursor-pointer rounded bg-gray-300 px-2 py-1 hover:bg-gray-400"
                      >
                        취소
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2 lg:mx-auto lg:w-1/2">
                      <button
                        onClick={() => handleEditClick(item)}
                        className="w-full cursor-pointer rounded bg-gray-200 px-2 py-1 hover:bg-gray-300"
                      >
                        수정
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
          {/* add parameter */}
          {isAddingNew ? (
            <div className="col-span-8 grid grid-cols-8 items-center justify-center gap-2 bg-amber-50 px-2 py-4 lg:col-span-12 lg:grid-cols-12">
              <div className="row-span-2 text-center lg:row-span-1">New</div>
              <div className="col-span-7 lg:col-span-4">
                <input
                  type="text"
                  value={newParam.ARGUMENT || ''}
                  onChange={(e) =>
                    handleNewInputChange('ARGUMENT', e.target.value)
                  }
                  className="w-full rounded border px-1"
                  placeholder="Value 입력"
                />
              </div>
              <div className="col-span-5">
                <input
                  type="text"
                  value={newParam.COMMENT || ''}
                  onChange={(e) =>
                    handleNewInputChange('COMMENT', e.target.value)
                  }
                  className="w-full rounded border px-1"
                  placeholder="설명 입력"
                />
              </div>
              <div className="col-span-2">
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveNew}
                    className="w-full cursor-pointer rounded bg-gray-500 px-2 py-1 text-white hover:bg-gray-600"
                  >
                    저장
                  </button>
                  <button
                    onClick={handleCancelNew}
                    className="w-full cursor-pointer rounded bg-gray-300 px-2 py-1 hover:bg-gray-400"
                  >
                    취소
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <button
              onClick={handleAddNew}
              className="col-span-8 mt-4 flex w-full cursor-pointer items-center justify-center gap-2 rounded-md bg-gray-200 p-2 hover:bg-gray-300 lg:col-span-12 lg:mx-auto lg:w-1/3"
            >
              Add <PlusIcon size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
