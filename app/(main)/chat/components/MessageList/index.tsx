'use client';

import React, { useRef, useCallback } from 'react';
import { Message, MessageListProps } from '@/app/types';
import ChatMessage from '@/app/(main)/chat/components/MessageList/components/ChatMessage';
import DateDivider from '@/app/(main)/components/common/DateDivider';
import DateNavigation from './components/DateNavigation';

// 날짜 정규화 함수 (DateNavigation과 동일한 방식)
const normalizeDate = (dateString: string): string => {
  // "2025. 6. 21." 형식 처리
  const dotFormat = dateString.match(/(\d{4})\.\s*(\d{1,2})\.\s*(\d{1,2})\.?/);
  if (dotFormat) {
    const [, year, month, day] = dotFormat;
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }

  // "2025-06-21" 형식은 그대로 반환
  if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
    return dateString;
  }

  // 기타 형식은 Date 객체로 파싱 시도
  try {
    const date = new Date(dateString);
    if (!isNaN(date.getTime())) {
      return date.toISOString().split('T')[0];
    }
  } catch {
    console.warn('날짜 파싱 실패:', dateString);
  }

  return dateString; // 파싱 실패 시 원본 반환
};

export default function MessageList({
  messages,
  userId,
  messagesEndRef,
  reqState,
  setReqState,
  lastMessageRef,
}: MessageListProps) {
  const dateRefs = useRef<Record<string, HTMLDivElement | null>>({});

  if (!messages || messages.length === 0) {
    return null;
  }

  // 날짜별로 메시지 그룹화 (DateNavigation과 동일한 정규화 방식 사용)
  const messagesByDate = messages.reduce(
    (acc, message) => {
      const date = normalizeDate(
        new Date(message.CREATED_AT).toISOString().split('T')[0]
      );
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(message);
      return acc;
    },
    {} as Record<string, Message[]>
  );

  // 날짜 클릭 시 해당 위치로 스크롤
  const handleDateClick = useCallback((date: string) => {
    const targetRef = dateRefs.current[date];
    if (targetRef) {
      // 해당 날짜의 메시지가 이미 로드된 경우
      targetRef.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    } else {
      // 해당 날짜의 메시지가 로드되지 않은 경우
      // 스크롤을 맨 위로 이동하여 무한 스크롤이 해당 날짜까지 로드하도록 함
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  }, []);

  return (
    <>
      <div className="flex flex-col items-center gap-4">
        {Object.entries(messagesByDate).map(([date, dateMessages]) => (
          <div
            key={date}
            ref={(el) => {
              dateRefs.current[date] = el;
            }}
            className="flex w-full max-w-5xl flex-col gap-4 rounded-2xl border border-gray-300 bg-white p-4 shadow"
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

      {/* 날짜 네비게이션 플로팅 버튼 */}
      <DateNavigation messages={messages} onDateClick={handleDateClick} />
    </>
  );
}
