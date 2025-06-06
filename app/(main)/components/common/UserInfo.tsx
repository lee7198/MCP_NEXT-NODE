// import { X } from '@phosphor-icons/react/dist/ssr';
import React from 'react';

export default function UserInfo({
  userId,
  email,
  openHover = false,
  onSignOut,
}: {
  userId: string;
  email: string;
  openHover: boolean;
  setOpenHover: React.Dispatch<React.SetStateAction<boolean>>;
  onSignOut: () => void;
}) {
  if (!openHover) return null;
  return (
    <div className="absolute top-12 right-0 flex h-48 w-52 flex-col items-center justify-around gap-2 rounded-lg bg-white p-3 shadow-2xl">
      <div className="flex flex-col items-center gap-1">
        <div className="text-base font-black">{userId}</div>
        <div className="text-sm wrap-anywhere">{email}</div>
      </div>

      <button
        onClick={onSignOut}
        className="cursor-pointer rounded-md bg-gray-200 px-2 py-1 text-sm hover:bg-gray-300"
      >
        로그아웃
      </button>
    </div>
  );
}
