'use client';

import React, { useEffect, useState } from 'react';
import { useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  AIChatRes,
  ChatReq,
  Message,
  MessagesResponse,
  SaveChatRes,
} from '@/app/types';
import ChatInput from '@/app/components/chat/ChatInput';
import UserIdInput from '@/app/components/chat/UserIdInput';
import MessageList from '@/app/components/chat/MessageList';
import ChatMessage from '@/app/components/chat/ChatMessage';
import Spinner from '@/app/components/common/Spinner';
import { useUserStore } from '@/app/store/userStore';
import { messageApi } from '@/app/services/api';
import { ChatResponse } from 'ollama';

export default function ChatContainer() {
  const [isMounted, setIsMounted] = useState(false);
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
      console.log('DB: ', res.id);
      queryClient.invalidateQueries({ queryKey: ['messages'] });
    },
  });

  // AI 요청 mutation
  const aiRequestMutation = useMutation<AIChatRes, Error, SaveChatRes>({
    mutationFn: (content) => messageApi.requestAI(content),
    onSuccess: (res) => {
      console.log('AI: ', res);
      queryClient.invalidateQueries({ queryKey: ['messages'] });
    },
  });

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [req_data]);

  const handleSendMessage = async (req: ChatReq) => {
    try {
      // 메시지 저장
      const saveDB = await saveMessageMutation.mutateAsync(req);
      // AI 요청
      await aiRequestMutation.mutateAsync(saveDB);
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
    <div className="mx-auto flex h-[calc(100svh-3rem)] max-w-2xl flex-col px-2 pb-8">
      <div className="h-full flex-1 space-y-4 overflow-y-auto px-4">
        {isMessagesLoading ? (
          <ChatMessage message="alert" />
        ) : isError ? (
          <ChatMessage message="error" />
        ) : (
          <MessageList
            messages={req_data?.messages || []}
            userId={userId}
            messagesEndRef={messagesEndRef}
          />
        )}
      </div>
      <ChatInput
        onSendMessage={handleSendMessage}
        isDisabled={
          saveMessageMutation.isPending || aiRequestMutation.isPending
        }
        USER_ID={userId}
      />
    </div>
  );
}
