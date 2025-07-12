import { MobileToggleButtonProps } from '@/app/types';
import { CaretRightIcon } from '@phosphor-icons/react/dist/ssr';
import React from 'react';

export default function MobileToggleButton({
  openNav,
  setOpenNav,
}: MobileToggleButtonProps) {
  if (openNav) return null;

  return (
    <button
      className={`absolute -right-16 aspect-square cursor-pointer rounded-full border border-gray-300 bg-white p-2 shadow-2xl duration-150 hover:scale-95 hover:bg-gray-100 active:scale-105 lg:hidden dark:bg-zinc-800 dark:hover:bg-zinc-600 ${
        openNav ? 'opacity-0' : 'opacity-100'
      }`}
      onClick={() => setOpenNav(!openNav)}
    >
      <CaretRightIcon size={24} />
    </button>
  );
}
