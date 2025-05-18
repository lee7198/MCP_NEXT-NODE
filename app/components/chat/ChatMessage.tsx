'use client';

import React from 'react';
import { Message } from '@/app/types';
import MessageItem from '@/app/components/chat/MessageItem';
import Spinner from '@/app/components/common/Spinner';

interface ChatMessageProps {
  message: Message | 'alert' | 'error';
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const now = new Date();

  if (message === 'alert') {
    return (
      <div className="mt-4 flex w-full items-center gap-4">
        <Spinner size={8} />
        <MessageItem
          USER_ID="system"
          isUser={false}
          CONTENT="대화를 불러오고 있어요."
          CREATED_AT={now}
        />
      </div>
    );
  }

  if (message === 'error') {
    return (
      <>
        <div className="h-4" />
        <MessageItem
          USER_ID="system"
          isUser={false}
          CONTENT="오류가 발생했어요."
          CREATED_AT={now}
        />
      </>
    );
  }

  return (
    <MessageItem
      USER_ID={message.USER_ID}
      isUser={message.isUser}
      CONTENT={message.CONTENT}
      CREATED_AT={new Date(message.CREATED_AT)}
    />
  );
}
