import React, { useState } from 'react';
import { Message } from '@/app/types';
import TimeAgo from 'javascript-time-ago';
import ko from 'javascript-time-ago/locale/ko';
// import Avatar from 'boring-avatars';
// import { avatarColor } from '@/app/lib/common';
import MultiToSpan from '../../../../components/common/MultiToSpan';

export default function MessageItem({
  CONTENT,
  isLoading = false,
  CREATED_AT,
}: Message) {
  TimeAgo.addLocale(ko);
  const timeAgo = new TimeAgo('ko');
  const lines = (CONTENT ?? '').split('\n');
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="flex flex-row items-start justify-end gap-1">
      <div className="flex max-w-4/5 flex-col items-end justify-end gap-0.5 overflow-hidden">
        <div
          className={`rounded-lg bg-gray-200 px-2 py-1 text-gray-800 ${isLoading ? 'animate-pulse' : ''}`}
        >
          <div
            className={`${!isExpanded && lines.length > 7 ? 'max-h-64 overflow-hidden' : ''}`}
          >
            <MultiToSpan input={CONTENT} />
          </div>
          {lines.length > 7 && (
            <div className="py-2">
              <button
                onClick={toggleExpand}
                className="cursor-pointer text-sm text-gray-600 hover:text-gray-800"
              >
                {isExpanded ? '접기' : '대화 내용 자세히 보기'}
              </button>
            </div>
          )}
        </div>
        <div className="text-xs">
          {timeAgo.format(new Date(CREATED_AT || new Date()))}
        </div>
      </div>
      {/* <Avatar
        className="shrink-0"
        colors={avatarColor}
        size={32}
        variant="beam"
        name={USER_ID || 'user'}
      /> */}
    </div>
  );
}
