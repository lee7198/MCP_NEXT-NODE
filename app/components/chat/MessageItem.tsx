import React from 'react';
import { Message } from '@/app/types';
import TimeAgo from 'javascript-time-ago';
import ko from 'javascript-time-ago/locale/ko';

export default function MessageItem({
  isUser,
  CONTENT,
  isLoading = false,
  CREATED_AT,
}: Message) {
  TimeAgo.addLocale(ko);
  const timeAgo = new TimeAgo('ko');

  return (
    <div
      className={`flex items-center gap-2 ${isUser ? 'flex-row-reverse' : ''}`}
    >
      <div
        className={`rounded-lg p-2 ${
          isUser ? 'bg-gray-200 text-gray-800' : 'bg-gray-200 text-gray-800'
        } ${isLoading ? 'animate-pulse' : ''}`}
      >
        {(CONTENT ?? '').split('\n').map((line: string, idx: number) => (
          <span key={idx}>
            {line}
            {idx !== (CONTENT ?? '').split('\n').length - 1 && <br />}
          </span>
        ))}
      </div>
      <div className="text-xs">{timeAgo.format(new Date(CREATED_AT))}</div>
    </div>
  );
}
