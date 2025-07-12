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
    <div className="room-list-container relative h-full max-h-[calc(100svh-22rem)] divide-gray-300 overflow-auto md:max-h-full">
      <div className="flex h-full flex-col overflow-y-scroll [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-gray-800/0 dark:[&::-webkit-scrollbar-thumb]:bg-gray-800/0 [&::-webkit-scrollbar-track]:bg-gray-800/0 dark:[&::-webkit-scrollbar-track]:bg-gray-800/0">
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
