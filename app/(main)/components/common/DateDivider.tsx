import { DateDividerProps } from '@/app/types';

export default function DateDivider({ date }: DateDividerProps) {
  const displayDate = date || new Date().toLocaleDateString('ko-KR');

  return (
    <div className="sticky top-0 z-0 flex justify-center">
      <span className="rounded-full bg-gray-900 px-4 py-1 text-sm text-white shadow-[0_8px_30px_rgb(0,0,0,0.15)]">
        {displayDate}
      </span>
    </div>
  );
}
