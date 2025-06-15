'use client';

import React from 'react';
import { Message, MessageListProps } from '@/app/types';
import ChatMessage from '@/app/(main)/chat/components/MessageList/components/ChatMessage';
import DateDivider from '@/app/(main)/components/common/DateDivider';

export default function MessageList({
  messages,
  userId,
  messagesEndRef,
  reqState,
  setReqState,
  lastMessageRef,
}: MessageListProps) {
  if (!messages || messages.length === 0) {
    return null;
  }

  // 날짜별로 메시지 그룹화
  const messagesByDate = messages.reduce(
    (acc, message) => {
      const date = new Date(message.CREATED_AT).toLocaleDateString();
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(message);
      return acc;
    },
    {} as Record<string, Message[]>
  );

  return (
    <div className="flex flex-col gap-4">
      {Object.entries(messagesByDate).map(([date, dateMessages]) => (
        <div
          key={date}
          className="flex flex-col gap-4 rounded-2xl border border-gray-300 bg-white p-4 shadow"
        >
          <DateDivider date={date} />

          {dateMessages.map((message, index) => (
            <div
              key={message.ID}
              ref={
                index === dateMessages.length - 1 ? lastMessageRef : undefined
              }
            >
              <ChatMessage
                message={{ ...message, isUser: message.USER_ID === userId }}
                reqState={reqState}
                setReqState={setReqState}
              />
            </div>
          ))}
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
}
