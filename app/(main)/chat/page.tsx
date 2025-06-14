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
import ChatInput from '@/app/(main)/chat/components/ChatInput';
import MessageList from '@/app/(main)/chat/components/MessageList';
import Spinner from '@/app/(main)/components/common/Spinner';
import { useUserStore } from '@/app/store/userStore';
import { aiModel_management, message_management } from '@/app/services/api';
import LoadingResponse from './components/LoadingResponse';
import ErrorResponse from './components/ErrorResponse';
import { initReqState } from '@/app/lib/common';
import { useSession } from 'next-auth/react';

export default function Chat() {
  const [isMounted, setIsMounted] = useState(false);
  const [reqState, setReqState] = useState<AIReqState>(initReqState);
  const isUserLoading = useUserStore((state) => state.isLoading);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();
  const { data: session } = useSession();

  useEffect(() => {
    setIsMounted(true);
  }, []);
  const userId = session?.user?.email;
  // 메시지 목록 불러오기
  const {
    data: req_data,
    isLoading: isMessagesLoading,
    isError,
  } = useQuery<MessagesResponse, Error>({
    queryKey: ['messages'],
    queryFn: () => message_management.getMessages(userId!),
    enabled: !!userId && isMounted,
  });

  // 메시지 저장 mutation
  const saveMessageMutation = useMutation<SaveChatRes, Error, ChatReq>({
    mutationFn: (content) => message_management.saveMessage(content),
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
    mutationFn: (content) => aiModel_management.requestAI(content),
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
    mutationFn: (content) => message_management.saveAIResponse(content),
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

  return (
    <div className="container mx-auto flex h-[calc(100svh-3rem)] flex-col px-2 pb-8">
      <div className="flex h-full flex-col gap-2 space-y-4 overflow-y-auto px-4">
        {isMessagesLoading ? (
          <LoadingResponse />
        ) : isError ? (
          <ErrorResponse />
        ) : (
          <MessageList
            messages={req_data?.messages || []}
            userId={userId!}
            messagesEndRef={messagesEndRef}
            reqState={reqState}
            setReqState={setReqState}
          />
        )}
        {/* TODO: 추천 요청 */}
        {/* <div>
          <h3>추천 요청 (최근 3개월 메세지 분석)</h3>
        </div> */}
      </div>
      <ChatInput
        onSendMessage={handleSendMessage}
        isDisabled={
          saveMessageMutation.isPending ||
          aiRequestMutation.isPending ||
          saveAIResponseMutation.isPending
        }
        USER_ID={userId!}
      />
    </div>
  );
}
