import {
  CaretLeftIcon,
  ChatCircleDotsIcon,
  SidebarSimpleIcon,
} from '@phosphor-icons/react/dist/ssr';
import React from 'react';
import { useBreakpoint } from '@/app/hooks/useBreakpoint';
import { NavigationHeaderProps } from '@/app/types';

export default function NavigationHeader({
  openNav,
  setOpenNav,
  onNewChat,
}: NavigationHeaderProps) {
  const { isLgAndUp } = useBreakpoint();

  return (
    <>
      <div>
        <button
          className={`aspect-square rounded-lg p-1 hover:bg-gray-100 ${
            isLgAndUp
              ? openNav
                ? 'cursor-w-resize'
                : 'cursor-e-resize lg:w-full'
              : 'cursor-pointer'
          } dark:hover:bg-zinc-600`}
          onClick={() => setOpenNav(!openNav)}
        >
          {isLgAndUp ? (
            <SidebarSimpleIcon size={24} />
          ) : (
            <CaretLeftIcon size={24} />
          )}
        </button>
      </div>
      <button
        className={`flex cursor-pointer items-center gap-2 rounded-lg p-1 hover:bg-gray-100 ${
          openNav ? '' : 'lg:aspect-square lg:justify-center'
        } dark:hover:bg-zinc-600`}
        onClick={onNewChat}
      >
        <ChatCircleDotsIcon size={24} />
        <div className={`${!openNav && isLgAndUp ? 'hidden' : ''}`}>
          새로운 채팅
        </div>
      </button>
    </>
  );
}
