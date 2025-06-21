import { Message } from '@/app/types';

// 날짜 정규화 함수 (YYYY-MM-DD 형식으로 통일)
export const normalizeDate = (dateString: string): string => {
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

// 날짜별 로딩 상태 판단 함수
export const getDateLoadingStatus = (
  date: string,
  dateCountMap: Map<string, number>,
  messagesByDate: Record<string, Message[]>
) => {
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
export const formatDate = (dateString: string) => {
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
