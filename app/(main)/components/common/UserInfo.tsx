// import { X } from '@phosphor-icons/react/dist/ssr';
import React from 'react';

export default function UserInfo({
  userId,
  openHover = false,
}: {
  userId: string;
  openHover: boolean;
  setOpenHover: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  if (!openHover) return null;
  return (
    <div className="absolute top-12 right-4 flex h-48 w-52 flex-col items-center justify-around gap-2 rounded-lg bg-white p-3 shadow-2xl">
      {/* <div className="flex w-full justify-end">
        <button
          className="size-6 cursor-pointer rounded-full bg-gray-100 p-1 hover:bg-gray-300"
          onClick={() => setOpenHover(false)}
        >
          <X />
        </button>
      </div> */}
      <div className="flex flex-col items-center gap-1">
        <div className="text-base font-black">{userId}</div>
        <div className="text-sm wrap-anywhere">
          lee8.asdasda123@aasd.asdasdasdsdased
        </div>
      </div>

      <button className="cursor-pointer rounded-md bg-gray-200 px-2 py-1 text-sm hover:bg-gray-300">
        로그아웃
      </button>
    </div>
  );
}
