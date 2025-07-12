import { RoomListProps } from '@/app/types';
import React from 'react';
import RoomItem from './RoomItem';

export default function RoomList({
  rooms,
  isRoomSuccess,
  selectRoom,
  setSelectRoom,
  openMenuId,
  setOpenMenuId,
  onToggleFavorite,
  onDelete,
}: RoomListProps) {
  return (
    <div className="relative max-h-[calc(100svh-25rem)] divide-gray-300 overflow-auto md:max-h-[calc(100svh-15rem)]">
      <div className="flex flex-col overflow-y-scroll">
        {isRoomSuccess
          ? rooms.map((item) => (
              <RoomItem
                key={item.roomId}
                room={item}
                isSelected={selectRoom === item.roomId}
                onSelect={setSelectRoom}
                onToggleFavorite={onToggleFavorite}
                onDelete={onDelete}
                openMenuId={openMenuId}
                onToggleMenu={(roomId) =>
                  setOpenMenuId(openMenuId === roomId ? null : roomId)
                }
              />
            ))
          : Array(5)
              .fill(1)
              .map((_, idx) => (
                <div key={idx} className="h-12 w-full py-1">
                  <div className="size-full animate-pulse rounded-lg bg-gray-300" />
                </div>
              ))}
      </div>
    </div>
  );
}
