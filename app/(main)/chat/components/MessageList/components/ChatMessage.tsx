'use client';

import React, { useEffect, useState } from 'react';
import { AIResponse, ChatMessageProps, Message } from '@/app/types';
import MessageItem from '@/app/(main)/chat/components/MessageList/components/MessageItem';
import { useQuery } from '@tanstack/react-query';
import { message_management } from '@/app/services/api';
import AIResponseItem from './AIResponseItem';
import LoadingResponse from './LoadingResponse';
import ErrorResponse from './ErrorResponse';
import NoDataMessage from './NoDataMessage';

export default function ChatMessage({ message, reqState }: ChatMessageProps) {
  const { ID } = message as Message;
  const messageId = ID as number;
  const [isInitialLoading, setIsInitialLoading] = useState(false);

  // AI 응답 조회
  const {
    data: aiResponse,
    isError,
    isLoading,
    refetch,
  } = useQuery<AIResponse | null, Error>({
    queryKey: ['aiResponse', messageId],
    queryFn: () => message_management.getAIResponse(messageId),
    enabled: !!messageId,
    staleTime: 0, // 항상 최신 데이터를 가져오도록 설정
    refetchOnMount: true, // 컴포넌트가 마운트될 때마다 refetch
    retry: false, // 실패 시 재시도하지 않음
  });

  useEffect(() => {
    if (reqState.isAIResSave && reqState.isAIRes) refetch();
  }, [reqState]);

  // 현재 메시지가 새로 생성된 메시지이고 AI 응답을 기다리는 중인지 확인
  const isWaitingForAI = reqState.messageId === messageId && !reqState.isAIRes;

  // 새로운 메시지에 대해서는 초기 로딩 상태 설정
  useEffect(() => {
    if (isWaitingForAI) {
      setIsInitialLoading(true);
      // 3초 후에 초기 로딩 상태 해제 (AI 응답이 오지 않았을 경우)
      const timer = setTimeout(() => {
        setIsInitialLoading(false);
      }, 3000);
      return () => clearTimeout(timer);
    } else {
      setIsInitialLoading(false);
    }
  }, [isWaitingForAI]);

  return (
    <>
      {
        <>
          <MessageItem
            USER_ID={message.USER_ID}
            isUser={message.isUser}
            CONTENT={message.CONTENT}
            CREATED_AT={new Date(message.CREATED_AT)}
          />
        </>
      }
      {isError ? (
        <ErrorResponse />
      ) : isLoading || isWaitingForAI || isInitialLoading || !aiResponse ? (
        <LoadingResponse />
      ) : aiResponse ? (
        <AIResponseItem
          CONTENT={aiResponse.CONTENT}
          CREATED_AT={new Date(aiResponse.CREATED_AT)}
        />
      ) : (
        <NoDataMessage />
      )}
    </>
  );
}
