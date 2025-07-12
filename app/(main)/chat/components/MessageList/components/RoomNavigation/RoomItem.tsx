import { RoomItemProps } from '@/app/types';
import {
  DotsThreeVerticalIcon,
  BookmarkSimpleIcon,
  TrashIcon,
} from '@phosphor-icons/react/dist/ssr';
import React, { useRef, useEffect, useState } from 'react';
import { normalizeDate } from '../lib';

export default function RoomItem({
  room,
  isSelected,
  onSelect,
  onToggleFavorite,
  onDelete,
  openMenuId,
  onToggleMenu,
}: RoomItemProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const [menuPosition, setMenuPosition] = useState<'top' | 'bottom'>('bottom');

  const date = normalizeDate(
    new Date(room.createdAt).toISOString().split('T')[0]
  );

  // 메뉴 위치 계산
  useEffect(() => {
    if (openMenuId === room.roomId && menuRef.current) {
      const rect = menuRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      // 메뉴가 화면 하단에 가까우면 위쪽으로 표시
      if (rect.bottom + 80 > viewportHeight - 20) {
        setMenuPosition('top');
      } else {
        setMenuPosition('bottom');
      }
    }
  }, [openMenuId, room.roomId]);

  return (
    <div className="w-full py-1">
      <div
        className={`flex w-full cursor-pointer items-center gap-1.5 rounded-lg px-2 py-1 ${
          isSelected
            ? 'bg-zinc-700 text-white hover:bg-gray-600 dark:bg-zinc-200 dark:text-black dark:hover:bg-zinc-400'
            : 'hover:bg-gray-100 dark:hover:bg-zinc-700'
        }`}
        onClick={() => onSelect(room.roomId)}
      >
        {/* 메세지 개수 */}
        <div className="flex items-center justify-start">
          <div
            className={`flex size-6 items-center justify-center rounded-full text-center text-xs font-bold ${
              isSelected
                ? 'bg-gray-200 text-black dark:bg-zinc-800 dark:text-white'
                : 'bg-gray-500 text-white dark:bg-zinc-400 dark:text-black'
            }`}
          >
            {room.count}
          </div>
        </div>

        <div className="flex w-full flex-col truncate">
          {/* 최근 메세지 내용 */}
          <span className="flex w-full items-center gap-1 truncate text-xs leading-3.5">
            {room.favorite && (
              <BookmarkSimpleIcon size={12} weight="fill" color="#ffce60" />
            )}
            {room.content}
          </span>

          <div className="flex justify-between text-xs leading-3.5">
            <span className="font-bold">{date}</span>
            <span
              className={`${
                isSelected
                  ? ''
                  : 'bg-gray-100 text-gray-600 dark:bg-zinc-700 dark:text-gray-300'
              } rounded-xs text-[0.65rem]`}
            >
              {room.roomId}
            </span>
          </div>
        </div>

        {/* 추가 기능 메뉴 */}
        <div className="menu-container relative" ref={menuRef}>
          <button
            className="flex cursor-pointer items-center rounded py-1 hover:bg-zinc-900/10 dark:hover:bg-zinc-100/10"
            onClick={(e) => {
              e.stopPropagation();
              onToggleMenu(room.roomId);
            }}
          >
            <DotsThreeVerticalIcon />
          </button>

          {/* Float 메뉴 */}
          {openMenuId === room.roomId && (
            <div
              className={`absolute right-0 z-50 min-w-32 rounded-lg border border-gray-200 bg-white shadow-lg dark:border-zinc-600 dark:bg-zinc-800 ${
                menuPosition === 'top' ? 'bottom-6' : 'top-6'
              }`}
            >
              <button
                className="flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 dark:text-white dark:hover:bg-zinc-700"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite(room.roomId);
                }}
              >
                <BookmarkSimpleIcon
                  size={16}
                  weight={room.favorite ? 'fill' : 'regular'}
                />
                즐겨찾기 {room.favorite ? '해제' : '추가'}
              </button>
              <button
                className="flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-gray-100 dark:text-red-400 dark:hover:bg-zinc-700"
                onClick={(e) => {
                  e.stopPropagation();
                  if (
                    window.confirm(
                      '정말로 이 채팅방을 삭제하시겠습니까?\n삭제된 채팅방은 복구할 수 없습니다.'
                    )
                  ) {
                    onDelete(room.roomId);
                  }
                }}
              >
                <TrashIcon size={16} />
                채팅 삭제
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
