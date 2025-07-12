import { RoomNavigationProps } from '@/app/types';
import React, { useState } from 'react';
import { useBreakpoint } from '@/app/hooks/useBreakpoint';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { message_management } from '@/app/services/api';
import { toast } from 'react-toastify';
import NavigationHeader from './NavigationHeader';
import MobileToggleButton from './MobileToggleButton';
import RoomList from './RoomList';
import { ClockCounterClockwiseIcon } from '@phosphor-icons/react/dist/ssr';

export default function RoomNavigation({
  rooms,
  isRoomSuccess,
  openNav,
  setOpenNav,
  selectRoom,
  setSelectRoom,
  onNewChat,
  userId,
}: RoomNavigationProps) {
  const { isLgAndUp } = useBreakpoint();
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const saveFavoritesRoom = useMutation({
    mutationFn: ({ userId, roomId }: { userId: string; roomId: string }) => {
      return message_management.saveFavorite({ userId, roomId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['room'] });
      toast.success('즐겨찾기 등록 완료.');
    },
  });

  const deleteFavoritesRoom = useMutation({
    mutationFn: ({ userId, roomId }: { userId: string; roomId: string }) => {
      return message_management.deleteFavorite({ userId, roomId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['room'] });
      toast.success('즐겨찾기 해제 완료.');
    },
  });

  const deleteChatRoom = useMutation({
    mutationFn: ({ userId, roomId }: { userId: string; roomId: string }) => {
      return message_management.deleteChatRoom({ userId, roomId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['room'] });
      toast.success('채팅방 삭제 완료.');
    },
  });

  // 메뉴 외부 클릭 시 메뉴 닫기
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.menu-container')) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleToggleFavorite = (roomId: string) => {
    const room = rooms.find((r) => r.roomId === roomId);
    if (!room) return;

    if (room.favorite) {
      deleteFavoritesRoom.mutate({ userId, roomId });
    } else {
      saveFavoritesRoom.mutate({ userId, roomId });
    }
    setOpenMenuId(null);
  };

  const handleDelete = (roomId: string) => {
    deleteChatRoom.mutate({ userId, roomId });
    setOpenMenuId(null);
  };

  return (
    <div
      className={`absolute z-50 w-52 transition-none lg:top-auto lg:left-auto lg:row-span-2 lg:w-full lg:pb-4 ${
        openNav
          ? 'top-4 left-4 lg:relative lg:col-span-4 lg:p-4 xl:col-span-3'
          : 'top-4 -left-64 w-64 lg:relative lg:col-span-1 lg:pt-4 lg:pl-4'
      }`}
    >
      <div className="rounded-2xl border border-gray-300 bg-white shadow-2xl duration-75 lg:h-full lg:max-h-[calc(100svh-5rem)] lg:shadow dark:border-zinc-600 dark:bg-zinc-800">
        <MobileToggleButton openNav={openNav} setOpenNav={setOpenNav} />

        <div
          className={`flex flex-col gap-2 p-2 lg:p-4 ${
            openNav ? '' : 'lg:items-center lg:justify-start lg:p-4'
          }`}
        >
          <NavigationHeader
            openNav={openNav}
            setOpenNav={setOpenNav}
            onNewChat={onNewChat}
          />

          <div
            className={`flex items-center gap-2 p-1 ${
              openNav
                ? ''
                : 'hover:bg-gray-100 lg:aspect-square lg:cursor-pointer lg:justify-center lg:rounded-lg dark:hover:bg-zinc-600'
            }`}
            onClick={() => isLgAndUp && setOpenNav(true)}
          >
            <ClockCounterClockwiseIcon size={24} />
            <div className={` ${!openNav && isLgAndUp ? 'hidden' : ''}`}>
              채팅내역
            </div>
          </div>

          {/* history list */}
          {!openNav && isLgAndUp ? undefined : (
            <RoomList
              rooms={rooms}
              isRoomSuccess={isRoomSuccess}
              selectRoom={selectRoom}
              setSelectRoom={setSelectRoom}
              openMenuId={openMenuId}
              setOpenMenuId={setOpenMenuId}
              onToggleFavorite={handleToggleFavorite}
              onDelete={handleDelete}
            />
          )}
        </div>
      </div>
    </div>
  );
}
