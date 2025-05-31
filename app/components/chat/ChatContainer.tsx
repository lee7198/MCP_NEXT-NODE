'use client';

import React, { useEffect, useState } from 'react';
import { useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  AIChatRes,
  AIReqState,
  ChatReq,
  MessagesResponse,
  SaveAIResponseRes,
  SaveChatRes,
} from '@/app/types';
import ChatInput from '@/app/components/chat/ChatInput';
import UserIdInput from '@/app/components/chat/UserIdInput';
import MessageList from '@/app/components/chat/MessageList';
import Spinner from '@/app/components/common/Spinner';
import { useUserStore } from '@/app/store/userStore';
import { messageApi } from '@/app/services/api';
import LoadingResponse from './LoadingResponse';
import ErrorResponse from './ErrorResponse';
import { initReqState } from '@/app/lib/common';

export default function ChatContainer() {
  const [isMounted, setIsMounted] = useState(false);
  const [reqState, setReqState] = useState<AIReqState>(initReqState);
  const userId = useUserStore((state) => state.userId);
  const isUserLoading = useUserStore((state) => state.isLoading);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // 메시지 목록 불러오기
  const {
    data: req_data,
    isLoading: isMessagesLoading,
    isError,
  } = useQuery<MessagesResponse, Error>({
    queryKey: ['messages'],
    queryFn: () => messageApi.getMessages(userId!),
    enabled: !!userId && isMounted,
  });

  // 메시지 저장 mutation
  const saveMessageMutation = useMutation<SaveChatRes, Error, ChatReq>({
    mutationFn: (content) => messageApi.saveMessage(content),
    onSuccess: (res) => {
      setReqState(initReqState);
      queryClient.invalidateQueries({ queryKey: ['messages'] });
      aiRequestMutation.mutateAsync(res);
      setReqState((prev) => ({
        ...prev,
        messageId: res.id,
      }));
    },
  });

  // AI 요청 mutation
  const aiRequestMutation = useMutation<AIChatRes, Error, SaveChatRes>({
    mutationFn: (content) => messageApi.requestAI(content),
    onSuccess: (resAI) => {
      // queryClient.invalidateQueries({ queryKey: ['messages'] });
      saveAIResponseMutation.mutateAsync({
        id: resAI.id,
        success: true,
        messageId: resAI.id,
        content: resAI.message.content,
      });
      setReqState((prev) => ({
        ...prev,
        isAIRes: true,
      }));
    },
  });

  // AI 응답 저장 mutation
  const saveAIResponseMutation = useMutation<
    SaveAIResponseRes,
    Error,
    SaveAIResponseRes
  >({
    mutationFn: (content) => messageApi.saveAIResponse(content),
    onSuccess: () => {
      setReqState((prev) => ({
        ...prev,
        isAIResSave: true,
      }));
    },
  });

  useEffect(() => {
    // 가장 하단 위치로 스크롤 (메세지 불러올때, AI 응답 받을 때)
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [req_data, reqState]);

  const handleSendMessage = async (req: ChatReq) => {
    try {
      // 메시지 저장
      await saveMessageMutation.mutateAsync(req);
    } catch (error) {
      console.error('메시지 전송 중 오류 발생:', error);
    }
  };

  if (!isMounted) {
    return null;
  }

  if (isUserLoading) {
    return (
      <div className="flex h-[calc(100svh-3rem)] items-center justify-center">
        <Spinner size={8} />
      </div>
    );
  }

  if (!userId) {
    return <UserIdInput />;
  }

  return (
    <div className="mx-auto flex h-[calc(100svh-3rem)] max-w-3xl flex-col px-2 pb-8">
      <div className="flex h-full flex-col gap-2 space-y-4 overflow-y-auto px-4">
        {isMessagesLoading ? (
          <LoadingResponse />
        ) : isError ? (
          <ErrorResponse />
        ) : (
          <MessageList
            messages={req_data?.messages || []}
            userId={userId}
            messagesEndRef={messagesEndRef}
            reqState={reqState}
            setReqState={setReqState}
          />
        )}
      </div>
      <ChatInput
        onSendMessage={handleSendMessage}
        isDisabled={
          saveMessageMutation.isPending ||
          aiRequestMutation.isPending ||
          saveAIResponseMutation.isPending
        }
        USER_ID={userId}
      />
    </div>
  );
}
