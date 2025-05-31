'use client';

import React from 'react';
import { Message, MessageListProps } from '@/app/types';
import ChatMessage from '@/app/(main)/components/chat/ChatMessage';
import DateDivider from '@/app/(main)/components/common/DateDivider';

export default function MessageList({
  messages,
  userId,
  messagesEndRef,
  reqState,
  setReqState,
}: MessageListProps) {
  if (!messages || messages.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-gray-500">대화 내역이 없습니다.</p>
      </div>
    );
  }

  return (
    <>
      {messages
        .sort(
          (a: Message, b: Message) =>
            new Date(a.CREATED_AT).getTime() - new Date(b.CREATED_AT).getTime()
        )
        .map((message: Message, idx: number, messages: Message[]) => {
          const currentDate = new Date(message.CREATED_AT).toLocaleDateString(
            'ko-KR'
          );
          const prevDate =
            idx > 0
              ? new Date(messages[idx - 1].CREATED_AT).toLocaleDateString(
                  'ko-KR'
                )
              : null;

          const isUser = message.USER_ID === userId;

          return (
            <React.Fragment key={message.ID || idx}>
              {currentDate !== prevDate && <DateDivider date={currentDate} />}
              <ChatMessage
                message={{ ...message, isUser }}
                reqState={reqState}
                setReqState={setReqState}
              />
            </React.Fragment>
          );
        })}
      <div ref={messagesEndRef} />
    </>
  );
}
