import React from 'react';
import { Message } from '@/app/types';
import TimeAgo from 'javascript-time-ago';
import ko from 'javascript-time-ago/locale/ko';
import Avatar from 'boring-avatars';
import { avatarColor } from '@/app/lib/common';
import MultiToSpan from '../../components/common/MultiToSpan';

export default function MessageItem({
  CONTENT,
  isLoading = false,
  CREATED_AT,
  USER_ID,
}: Message) {
  TimeAgo.addLocale(ko);
  const timeAgo = new TimeAgo('ko');

  return (
    <div className="flex flex-row items-start justify-end gap-1">
      <div className="flex flex-col items-end justify-end gap-0.5">
        <div
          className={`rounded-lg bg-gray-200 px-2 py-1 text-gray-800 ${isLoading ? 'animate-pulse' : ''}`}
        >
          <MultiToSpan input={CONTENT} />
        </div>
        <div className="text-xs">
          {timeAgo.format(new Date(CREATED_AT && new Date()))}
        </div>
      </div>
      <Avatar
        className="shrink-0"
        colors={avatarColor}
        size={32}
        variant="beam"
        name={USER_ID || 'user'}
      />
    </div>
  );
}
