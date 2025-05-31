'use client';

import React, { useEffect } from 'react';
import { AIResponse, ChatMessageProps, Message } from '@/app/types';
import MessageItem from '@/app/(main)/components/chat/MessageItem';
import { useQuery } from '@tanstack/react-query';
import { messageApi } from '@/app/services/api';
import AIResponseItem from './AIResponseItem';
import LoadingResponse from './LoadingResponse';
import ErrorResponse from './ErrorResponse';

export default function ChatMessage({ message, reqState }: ChatMessageProps) {
  const { ID } = message as Message;
  const messageId = ID as number;

  // AI 응답 조회
  const {
    data: aiResponse,
    isError,
    isPending,
    refetch,
  } = useQuery<AIResponse, Error>({
    queryKey: ['aiResponse', messageId],
    queryFn: () => messageApi.getAIResponse(messageId),
    enabled: !!messageId,
  });

  useEffect(() => {
    if (reqState.isAIResSave && reqState.isAIRes) refetch();
  }, [reqState]);

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
      ) : aiResponse ? (
        <AIResponseItem
          CONTENT={aiResponse.CONTENT}
          CREATED_AT={new Date(aiResponse.CREATED_AT)}
        />
      ) : (
        <LoadingResponse />
      )}
    </>
  );
}
