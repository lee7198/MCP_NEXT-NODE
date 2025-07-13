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
  AIRequestState,
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
import ErrorResponse from './components/MessageList/components/ErrorResponse';
import { initReqState } from '@/app/lib/common';
import { useSession } from 'next-auth/react';
import ChatInputSection from '@/app/(main)/chat/components/ChatInputSection';
import { useSocket } from '@/app/hooks/useSocket';
import RoomNavigation from './components/MessageList/components/RoomNavigation/index';

export default function Chat() {
  const [isMounted, setIsMounted] = useState(false);
  const [reqState, setReqState] = useState<AIRequestState>(initReqState);
  const [openNav, setOpenNav] = useState(true);
  const isUserLoading = useUserStore((state) => state.isLoading);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const observerRef = useRef<IntersectionObserver | null>(null);
  const { sendMessageWithMCP } = useSocket();
  const [selectServer, setSelectServer] = useState('');
  const [selectRoom, setSelectRoom] = useState('');

  const userId = session?.user?.email;

  // 무한 스크롤을 위한 메시지 조회
  const {
    data,
    isLoading: isMessagesLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch: reFetchMessages,
  } = useInfiniteQuery<MessagesResponse, Error>({
    queryKey: ['messages', userId],
    queryFn: ({ pageParam }) =>
      message_management.getMessages({
        userId: userId!,
        cursor: pageParam as string,
        roomId: selectRoom,
      }),
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    enabled: !!userId && isMounted && !!selectRoom,
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
    mutationFn: (content) =>
      message_management.saveMessage({
        CONTENT: content.CONTENT,
        USER_ID: content.USER_ID,
        ID: content.ID,
        isMCP: content.isMCP,
        MCP_SERVER: content.MCP_SERVER,
        roomId: selectRoom,
      }),
    onSuccess: async (res) => {
      const { MCP_SERVER, roomId } = res;
      setReqState(initReqState);

      // 새로 생성된 채팅방이 있으면 바로 이동
      if (roomId) setSelectRoom(roomId);

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
      reFetchRooms();
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

  //채팅방 조회
  const {
    data: roomsData,
    isSuccess: isRoomSuccess,
    isLoading: isRoomLoading,
    refetch: reFetchRooms,
  } = useQuery({
    queryKey: ['room'],
    queryFn: () => message_management.getRooms(userId!),
    enabled: !!userId,
    staleTime: 0,
  });

  const { data: prompts } = useQuery({
    queryKey: ['prompts'],
    queryFn: () => message_management.getUserPrompt(userId!),
    enabled: !!userId,
  });

  // not mcp ai 메세지용
  const handleSendMessage = async (req: ChatReq) => {
    try {
      await saveMessageMutation.mutateAsync(req);
    } catch (error) {
      console.error('메시지 전송 중 오류 발생:', error);
    }
  };

  const handleNewChat = () => {
    setSelectRoom('');
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // useEffect(() => {
  //   console.log('LOADING...');
  // }, [isMessagesLoading]);

  useEffect(() => {
    // agent 서버 선택하면 미리 fetch
    if (selectServer) reFetchParam();
  }, [selectServer]);

  useEffect(() => {
    if (selectRoom) reFetchMessages();
  }, [selectRoom]);

  const messages =
    selectRoom === '' ? [] : data?.pages.flatMap((page) => page.messages) || [];

  if (!isMounted) return null;

  if (isUserLoading)
    return (
      <div className="flex h-[calc(100svh-3rem)] items-center justify-center bg-gray-50 dark:bg-zinc-900">
        <Spinner size={8} />
      </div>
    );

  return (
    <div className="relative mx-auto grid h-[calc(100svh-3rem)] max-h-full min-h-full grid-cols-16 grid-rows-[1fr_auto] bg-gray-50 dark:bg-zinc-900">
      <RoomNavigation
        rooms={roomsData || []}
        isRoomLoading={isRoomLoading}
        isRoomSuccess={isRoomSuccess}
        openNav={openNav}
        userId={userId!}
        setOpenNav={setOpenNav}
        selectRoom={selectRoom}
        setSelectRoom={setSelectRoom}
        onNewChat={handleNewChat}
      />

      <div
        className={`relative top-0 col-span-16 flex min-h-[calc(100%_+_1rem)] flex-col gap-6 overflow-y-scroll bg-gray-50 px-4 pb-4 transition-all duration-300 dark:bg-zinc-900 ${
          openNav
            ? 'lg:col-span-12 lg:pr-4 lg:pl-0 xl:col-span-13 xl:px-0 2xl:col-start-4'
            : 'lg:col-span-15 lg:col-start-2'
        }`}
      >
        {isMessagesLoading ? (
          <div className="flex size-full items-center justify-center">
            {/* <LoadingResponse /> */}
            <Spinner size={12} />
          </div>
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
            prompts={prompts?.map((item) => item.PROMPT) ?? []}
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
        openNav={openNav}
        prompts={prompts ?? []}
      />
    </div>
  );
}
