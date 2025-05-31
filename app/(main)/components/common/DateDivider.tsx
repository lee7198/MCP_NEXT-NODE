import type { DateDividerProps } from './types';

export default function DateDivider({ date }: DateDividerProps) {
  const displayDate = date || new Date().toLocaleDateString('ko-KR');

  return (
    <div className="my-6 flex justify-center">
      <span className="rounded-full bg-gray-100 px-4 py-1 text-sm text-gray-600">
        {displayDate}
      </span>
    </div>
  );
}
