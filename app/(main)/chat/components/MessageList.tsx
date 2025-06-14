'use client';

import React from 'react';
import { Message, MessageListProps } from '@/app/types';
import ChatMessage from '@/app/(main)/chat/components/ChatMessage';
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
      {Object.entries(
        messages
          .sort(
            (a: Message, b: Message) =>
              new Date(b.CREATED_AT).getTime() -
              new Date(a.CREATED_AT).getTime()
          )
          .reduce((acc: { [key: string]: Message[] }, message: Message) => {
            const date = new Date(message.CREATED_AT).toLocaleDateString(
              'ko-KR'
            );
            if (!acc[date]) {
              acc[date] = [];
            }
            acc[date].push(message);
            return acc;
          }, {})
      ).map(([date, dateMessages]) => (
        <div
          key={date}
          className="rounded-2xl border border-gray-400 bg-white p-4"
        >
          <DateDivider date={date} />
          {dateMessages.map((message: Message) => (
            <ChatMessage
              key={message.ID}
              message={{ ...message, isUser: message.USER_ID === userId }}
              reqState={reqState}
              setReqState={setReqState}
            />
          ))}
        </div>
      ))}
      <div ref={messagesEndRef} />
    </>
  );
}
