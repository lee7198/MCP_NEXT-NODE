export const avatarColor = [
  '#fa6a64',
  '#68ae61',
  '#ddaf69',
  '#f6e2bb',
  '#71d682',
];

export const initReqState = {
  messageId: 0,
  isAIRes: false,
  isAIResSave: false,
};

export const pages = [
  { name: 'main', path: '/' },
  { name: 'chat', path: '/chat' },
  { name: 'settings', path: '/settings' },
];

/**
 * 날짜를 yy.mm.dd hh:mm 형식으로 변환
 * @param date - 변환할 날짜 (Date 객체 또는 ISO 문자열)
 * @returns yy.mm.dd hh:mm 형식의 문자열
 */
export const formatDateToKorean = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  const year = dateObj.getFullYear().toString().slice(-2); // 마지막 2자리
  const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
  const day = dateObj.getDate().toString().padStart(2, '0');
  const hours = dateObj.getHours().toString().padStart(2, '0');
  const minutes = dateObj.getMinutes().toString().padStart(2, '0');

  return `${year}.${month}.${day} ${hours}:${minutes}`;
};

/**
 * ISO 문자열을 yy.mm.dd hh:mm 형식으로 변환 (한국 시간대)
 * @param isoString - ISO 8601 형식의 날짜 문자열
 * @returns yy.mm.dd hh:mm 형식의 문자열
 *
 * @example
 * formatISOToKorean('2025-06-15T00:04:22.000Z') // '25.06.15 09:04'
 */
export const formatISOToKorean = (isoString: Date): string => {
  const date = new Date(isoString);

  // 한국 시간대로 변환
  const koreanTime = new Date(date.getTime() + 9 * 60 * 60 * 1000);

  return formatDateToKorean(koreanTime);
};
