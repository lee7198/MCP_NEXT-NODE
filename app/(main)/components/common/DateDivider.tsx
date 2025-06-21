import { DateDividerProps } from '@/app/types';

export default function DateDivider({ date }: DateDividerProps) {
  // YYYY-MM-DD 형식의 날짜를 파싱하는 함수
  const parseDate = (dateString: string) => {
    // YYYY-MM-DD 형식인 경우
    if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
      const [year, month, day] = dateString.split('-').map(Number);
      return { year, month, day };
    }

    // 기타 형식은 Date 객체로 파싱
    const date = new Date(dateString);
    return {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate(),
    };
  };

  const { year, month, day } = date
    ? parseDate(date)
    : {
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
        day: new Date().getDate(),
      };

  const formattedDate = `${year}.${month.toString().padStart(2, '0')}.${day
    .toString()
    .padStart(2, '0')}`;

  return (
    <div className="sticky top-0 z-0 flex justify-center">
      <span className="rounded-full bg-gray-800 px-4 py-1 text-sm text-white">
        {formattedDate}
      </span>
    </div>
  );
}
