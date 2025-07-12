import { ContainerWrapperProps } from '@/app/types';
import React from 'react';

export default function ContainerWrapper({ children }: ContainerWrapperProps) {
  return (
    <div className="h-[calc(100svh-3rem)] overflow-y-scroll">
      <div className="container mx-auto bg-gray-50 p-6 dark:bg-zinc-900">
        {children}
      </div>
    </div>
  );
}
