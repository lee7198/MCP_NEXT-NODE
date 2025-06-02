import { ServerCardSkeletonProps } from '@/app/types/components';

export default function ServerCardSkeleton({ index }: ServerCardSkeletonProps) {
  return (
    <div
      className={`h-14 w-full animate-pulse rounded-lg bg-gray-300 px-4 py-2 transition-all lg:w-[calc(50%-0.5rem)] delay-[${index * 100}] duration-[${index * 100}]`}
    ></div>
  );
}
