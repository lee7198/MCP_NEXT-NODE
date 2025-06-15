'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRef } from 'react';
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
  useQuery,
} from '@tanstack/react-query';
import {
  AIChatRes,
  AIReqState,
  ChatReq,
  MessagesResponse,
  SaveChatRes,
} from '@/app/types';
import MessageList from '@/app/(main)/chat/components/MessageList';
import Spinner from '@/app/(main)/components/common/Spinner';
import { useUserStore } from '@/app/store/userStore';
import {
  aiModel_management,
  message_management,
  mcp_management,
} from '@/app/services/api';
import LoadingResponse from './components/MessageList/components/LoadingResponse';
import ErrorResponse from './components/MessageList/components/ErrorResponse';
import { initReqState } from '@/app/lib/common';
import { useSession } from 'next-auth/react';
import ChatInputSection from '@/app/(main)/chat/components/ChatInputSection';
import { useSocket } from '@/app/hooks/useSocket';

export default function Chat() {
  const [isMounted, setIsMounted] = useState(false);
  const [reqState, setReqState] = useState<AIReqState>(initReqState);
  const isUserLoading = useUserStore((state) => state.isLoading);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const observerRef = useRef<IntersectionObserver | null>(null);
  const { sendMessageWithMCP } = useSocket();
  const [selectServer, setSelectServer] = useState('');

  const userId = session?.user?.email;

  // 무한 스크롤을 위한 메시지 조회
  const {
    data,
    isLoading: isMessagesLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery<MessagesResponse, Error>({
    queryKey: ['messages', userId],
    queryFn: ({ pageParam }) =>
      message_management.getMessages(userId!, pageParam as string),
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    enabled: !!userId && isMounted,
    initialPageParam: undefined,
  });

  // 스크롤 감지
  const lastMessageRef = useCallback(
    (node: HTMLDivElement) => {
      if (isFetchingNextPage) return;
      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      });

      if (node) observerRef.current.observe(node);
    },
    [isFetchingNextPage, hasNextPage, fetchNextPage]
  );

  // MCP 파라미터 조회
  const {
    data: mcpParams,
    isPending: isMcpParamsPending,
    refetch: reFetchParam,
  } = useQuery({
    queryKey: ['mcp_config_parmas', selectServer],
    queryFn: () => mcp_management.getMcpToolParams(selectServer),
    enabled: !!selectServer,
  });

  // 메시지 저장 mutation
  const saveMessageMutation = useMutation<SaveChatRes, Error, ChatReq>({
    mutationFn: (content) => message_management.saveMessage(content),
    onSuccess: async (res) => {
      const { MCP_SERVER } = res;
      setReqState(initReqState);

      // mcp 요청이라면
      if (MCP_SERVER === selectServer) {
        await reFetchParam().then((result) => {
          // message 전송 to mcp server
          sendMessageWithMCP({ messageData: res, arg: result.data ?? [] });
        });
      } else {
        // 일반 AI 요청 (요청 후 바로 저장됨)
        aiRequestMutation.mutateAsync(res);
      }
      queryClient.invalidateQueries({ queryKey: ['messages'] });
      setReqState((prev) => ({
        ...prev,
        messageId: res.id,
      }));
    },
  });

  // AI 요청 mutation
  const aiRequestMutation = useMutation<AIChatRes, Error, SaveChatRes>({
    mutationFn: (content) => aiModel_management.requestAI(content),
    onSuccess: () => {
      setReqState((prev) => ({
        ...prev,
        isAIRes: true,
        isAIResSave: true,
      }));
    },
  });

  // not mcp ai 메세지용
  const handleSendMessage = async (req: ChatReq) => {
    try {
      await saveMessageMutation.mutateAsync(req);
    } catch (error) {
      console.error('메시지 전송 중 오류 발생:', error);
    }
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    console.log('LOADING...');
  }, [isMessagesLoading]);

  useEffect(() => {
    // agent 서버 선택하면 미리 fetch
    if (selectServer) reFetchParam();
  }, [selectServer]);

  if (!isMounted) return null;

  if (isUserLoading)
    return (
      <div className="flex h-[calc(100svh-3rem)] items-center justify-center">
        <Spinner size={8} />
      </div>
    );

  const messages = data?.pages.flatMap((page) => page.messages) || [];

  return (
    <div className="bg= container mx-auto flex h-[calc(100svh-3rem)] flex-col px-2 pb-8">
      <div className="flex h-full flex-col gap-6 overflow-y-auto p-4">
        {isMessagesLoading ? (
          <LoadingResponse />
        ) : isError ? (
          <ErrorResponse />
        ) : (
          <MessageList
            messages={messages}
            userId={userId!}
            messagesEndRef={messagesEndRef}
            reqState={reqState}
            setReqState={setReqState}
            lastMessageRef={lastMessageRef}
          />
        )}
        {isFetchingNextPage && (
          <div className="flex justify-center py-4">
            <Spinner size={6} />
          </div>
        )}
      </div>
      <ChatInputSection
        onSendMessage={handleSendMessage}
        isDisabled={
          saveMessageMutation.isPending || aiRequestMutation.isPending
        }
        USER_ID={userId!}
        selectServer={selectServer}
        setSelectServer={setSelectServer}
        mcpParams={mcpParams}
        isMcpParamsPending={isMcpParamsPending}
      />
    </div>
  );
}
