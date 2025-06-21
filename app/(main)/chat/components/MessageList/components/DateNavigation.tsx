'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Message, DateNavigationProps } from '@/app/types';
import { CalendarIcon, XIcon } from '@phosphor-icons/react';
import { useQuery } from '@tanstack/react-query';
import { message_management } from '@/app/services/api';

// 날짜 정규화 함수 (YYYY-MM-DD 형식으로 통일)
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

export default function DateNavigation({
  messages,
  onDateClick,
}: DateNavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 현재 메시지에서 사용자 ID 추출
  const userId = messages.length > 0 ? messages[0].USER_ID : '';

  // 전체 메시지 날짜 목록 조회
  const {
    data: allDates,
    isLoading: isDatesLoading,
    error: datesError,
  } = useQuery({
    queryKey: ['all-message-dates', userId],
    queryFn: () => message_management.getAllMessageDates(userId),
    enabled: !!userId,
  });

  // 날짜별로 메시지 그룹화 (현재 로드된 메시지들)
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

  // 전체 날짜 목록과 현재 로드된 메시지 날짜를 결합하고 정규화
  const allAvailableDates = allDates?.dates || [];
  const currentLoadedDates = Object.keys(messagesByDate);

  // 모든 날짜를 정규화하고 중복 제거 후 최신순으로 정렬
  const normalizedDates = [
    ...allAvailableDates.map((item) => normalizeDate(item.date)),
    ...currentLoadedDates.map(normalizeDate),
  ];

  const sortedDates = [...new Set(normalizedDates)].sort((a, b) => {
    return new Date(b).getTime() - new Date(a).getTime();
  });

  // 날짜별 실제 메시지 개수 매핑
  const dateCountMap = new Map<string, number>();

  // API에서 가져온 전체 메시지 개수
  allAvailableDates.forEach((item) => {
    const normalizedDate = normalizeDate(item.date);
    dateCountMap.set(normalizedDate, item.count);
  });

  // 현재 로드된 메시지 개수 (API 데이터가 없는 경우)
  currentLoadedDates.forEach((date) => {
    const normalizedDate = normalizeDate(date);
    if (!dateCountMap.has(normalizedDate)) {
      dateCountMap.set(normalizedDate, messagesByDate[date]?.length || 0);
    }
  });

  // 날짜별 로딩 상태 판단 함수
  const getDateLoadingStatus = (date: string) => {
    const totalMessageCount = dateCountMap.get(date) || 0;
    const loadedMessageCount = messagesByDate[date]?.length || 0;

    // API에서 해당 날짜의 메시지가 있다고 알려줬지만 현재 로드되지 않은 경우
    if (totalMessageCount > 0 && loadedMessageCount === 0) {
      return { isLoaded: false, status: '미로드' };
    }

    // 일부만 로드된 경우
    if (loadedMessageCount > 0 && loadedMessageCount < totalMessageCount) {
      return { isLoaded: false, status: '일부' };
    }

    // 모두 로드된 경우
    if (loadedMessageCount > 0 && loadedMessageCount >= totalMessageCount) {
      return { isLoaded: true, status: '완료' };
    }

    // API 데이터가 없는 경우 (현재 로드된 메시지만 있는 경우)
    if (loadedMessageCount > 0) {
      return { isLoaded: true, status: '완료' };
    }

    return { isLoaded: false, status: '미로드' };
  };

  // 날짜 포맷팅 함수
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return '오늘';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return '어제';
    } else {
      return `${date.getFullYear()}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getDate().toString().padStart(2, '0')}`;
    }
  };

  // 클릭 이벤트 핸들러
  const handleDateClick = (date: string) => {
    setSelectedDate(date);
    onDateClick(date);
    setIsOpen(false);
  };

  // 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (sortedDates.length === 0 && !isDatesLoading) return null;

  return (
    <div className="fixed top-20 left-8 z-50" ref={dropdownRef}>
      {/* 플로팅 버튼 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-gray-800 text-white shadow-xl transition-all duration-200 hover:scale-105 hover:bg-gray-600 active:scale-95"
        aria-label="날짜 네비게이션"
      >
        <CalendarIcon size={24} />
      </button>

      {/* 드롭다운 메뉴 */}
      {isOpen && (
        <div className="absolute top-12 left-0 mt-2 w-64 rounded-lg border border-gray-200 bg-white shadow-xl">
          <div className="flex items-center justify-between border-b border-gray-200 p-3">
            <h3 className="text-sm font-semibold text-gray-800">메시지 기록</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <XIcon size={16} />
            </button>
          </div>

          <div className="max-h-64 overflow-y-auto">
            {isDatesLoading ? (
              <div className="flex items-center justify-center py-4">
                <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-gray-600"></div>
                <span className="ml-2 text-sm text-gray-500">
                  날짜 목록 로딩 중...
                </span>
              </div>
            ) : datesError ? (
              <div className="p-3 text-sm text-red-500">
                날짜 목록을 불러올 수 없습니다.
              </div>
            ) : (
              sortedDates.map((date) => {
                const { isLoaded, status } = getDateLoadingStatus(date);
                const totalMessageCount = dateCountMap.get(date) || 0;

                return (
                  <button
                    key={date}
                    onClick={() => handleDateClick(date)}
                    className={`w-full px-3 py-2 text-left text-sm transition-colors duration-150 hover:bg-gray-50 ${
                      selectedDate === date
                        ? 'bg-blue-50 text-gray-600'
                        : 'text-gray-700'
                    } ${!isLoaded ? 'opacity-60' : ''}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{formatDate(date)}</span>
                      <div className="flex items-center gap-2">
                        {status === '미로드' && (
                          <span className="text-xs text-gray-400">
                            (미로드)
                          </span>
                        )}
                        {status === '일부' && (
                          <span className="text-xs text-blue-500">(일부)</span>
                        )}
                        <span className="text-xs text-gray-500">
                          {totalMessageCount}개 메시지
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
