// import { X } from '@phosphor-icons/react/dist/ssr';
import React from 'react';
import { XIcon } from '@phosphor-icons/react/dist/ssr';

export default function UserInfo({
  userId,
  email,
  openHover = false,
  setOpenHover,
  onSignOut,
}: {
  userId: string;
  email: string;
  openHover: boolean;
  setOpenHover: React.Dispatch<React.SetStateAction<boolean>>;
  onSignOut: () => void;
}) {
  if (!openHover) return null;

  const handleSignOut = () => {
    onSignOut();
    setOpenHover(false);
  };

  return (
    <>
      <div
        className="fixed top-0 left-0 z-10 h-screen w-screen cursor-pointer bg-black/20 backdrop-blur-[4px]"
        onClick={() => setOpenHover(false)}
      />
      <div className="absolute top-12 right-0 z-20 min-w-56 rounded-lg bg-white p-4 shadow-2xl">
        <div className="mb-3 flex items-start justify-between">
          <h3 className="text-lg font-semibold">사용자 정보</h3>
          <button
            className="cursor-pointer rounded-full bg-gray-200 p-1"
            onClick={() => setOpenHover(false)}
          >
            <XIcon size={14} weight="bold" />
          </button>
        </div>

        <div className="mb-4 flex flex-col items-center gap-2">
          <div className="flex flex-col items-center gap-1">
            <div className="text-base font-black">{userId}</div>
            <div className="text-sm wrap-anywhere text-gray-600">{email}</div>
          </div>
        </div>

        <div className="flex justify-center">
          <button
            onClick={handleSignOut}
            className="cursor-pointer rounded-md bg-gray-800 px-4 py-2 text-sm text-white transition-colors hover:bg-gray-600"
          >
            로그아웃
          </button>
        </div>
      </div>
    </>
  );
}
