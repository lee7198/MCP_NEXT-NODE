import { DateDividerProps } from '@/app/types';

export default function DateDivider({ date }: DateDividerProps) {
  const year = date ? new Date(date).getFullYear() : new Date().getFullYear();
  const month = date
    ? new Date(date).getMonth() + 1
    : new Date().getMonth() + 1;
  const day = date ? new Date(date).getDate() : new Date().getDate();
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
