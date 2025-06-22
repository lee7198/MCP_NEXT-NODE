import { RoomNavigationProps } from '@/app/types';
import {
  CaretLeftIcon,
  CaretRightIcon,
  ChatCircleDotsIcon,
  ClockCounterClockwiseIcon,
} from '@phosphor-icons/react/dist/ssr';
import React from 'react';
import { normalizeDate } from './lib';
import { useBreakpoint } from '@/app/hooks/useBreakpoint';

export default function RoomNavigation({
  rooms,
  isRoomSuccess,
  openNav,
  setOpenNav,
  selectRoom,
  setSelectRoom,
  onNewChat,
}: RoomNavigationProps) {
  const { isLgAndUp } = useBreakpoint();

  return (
    <div
      className={`absolute z-50 w-52 transition-none lg:top-auto lg:left-auto lg:row-span-2 lg:w-full lg:pb-4 ${openNav ? 'top-4 left-4 lg:relative lg:col-span-4 lg:p-4 xl:col-span-3' : 'top-4 -left-64 w-64 lg:relative lg:col-span-1 lg:pt-4 lg:pl-4'}`}
    >
      <div className="rounded-2xl border border-gray-300 bg-white shadow-2xl duration-75 lg:h-full lg:max-h-[calc(100svh-5rem)] lg:shadow">
        {/* 모바일용 버튼 */}
        {!openNav && (
          <button
            className={`absolute -right-16 aspect-square cursor-pointer rounded-full border border-gray-300 bg-white p-2 shadow-2xl duration-150 hover:scale-95 hover:bg-gray-200 active:scale-105 lg:hidden ${openNav ? 'opacity-0' : 'opacity-100'}`}
            onClick={() => setOpenNav(!openNav)}
          >
            <CaretRightIcon size={24} />
          </button>
        )}
        <div
          className={`flex flex-col gap-2 p-4 ${openNav ? '' : 'lg:items-center lg:justify-start lg:p-4'}`}
        >
          <div>
            <button
              className={`aspect-square cursor-pointer rounded-lg p-1 hover:bg-gray-200 ${openNav ? '' : 'lg:w-full'}`}
              onClick={() => setOpenNav(!openNav)}
            >
              <CaretLeftIcon size={24} />
            </button>
          </div>
          <button
            className={`flex cursor-pointer items-center gap-2 rounded-lg p-1 hover:bg-gray-200 ${openNav ? '' : 'lg:aspect-square lg:justify-center'}`}
            onClick={onNewChat}
          >
            <ChatCircleDotsIcon size={24} />
            <div className={`${!openNav && isLgAndUp ? 'hidden' : ''}`}>
              새로운 채팅
            </div>
          </button>

          <div
            className={`flex items-center gap-2 p-1 ${openNav ? '' : 'hover:bg-gray-200 lg:aspect-square lg:cursor-pointer lg:justify-center lg:rounded-lg'}`}
            // lg 이상에서는 항상 open 하도록
            onClick={() => isLgAndUp && setOpenNav(true)}
          >
            <ClockCounterClockwiseIcon size={24} />
            <h2
              className={`font-bold ${!openNav && isLgAndUp ? 'hidden' : ''}`}
            >
              HISTORY
            </h2>
          </div>
          {/* history list */}
          {!openNav && isLgAndUp ? undefined : (
            <div className="relative max-h-[calc(100svh-15rem)] divide-gray-300 overflow-auto lg:h-full">
              <div className="flex flex-col overflow-y-scroll">
                {isRoomSuccess
                  ? rooms.map((item) => {
                      const date = normalizeDate(
                        new Date(item.createdAt).toISOString().split('T')[0]
                      );
                      return (
                        <div className="py-1" key={item.roomId}>
                          <div
                            className={`grid cursor-pointer grid-cols-13 grid-rows-2 rounded-lg px-2 py-1 ${selectRoom === item.roomId ? 'bg-gray-800 text-white hover:bg-gray-600' : 'hover:bg-gray-200'}`}
                            onClick={() => setSelectRoom(item.roomId)}
                          >
                            <div className="col-span-11 truncate text-sm leading-3.5 whitespace-nowrap">
                              {item.content}
                            </div>

                            <div className="col-span-11 flex gap-2 text-xs leading-3.5">
                              <span className="font-bold">{date}</span>
                              <span>[{item.roomId}]</span>
                            </div>

                            <div className="col-span-2 col-start-12 row-span-2 row-start-1 flex items-center justify-end">
                              <div
                                className={`flex size-6 items-center justify-center rounded-full text-center text-xs font-bold ${selectRoom === item.roomId ? 'bg-gray-300 text-black' : 'bg-gray-500 text-white'}`}
                              >
                                {item.count}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  : Array(5)
                      .fill(1)
                      .map((_, idx) => (
                        <div key={idx} className="h-12 w-full py-1">
                          <div className="size-full animate-pulse rounded-lg bg-gray-300" />
                        </div>
                      ))}
              </div>
            </div>
          )}
          {/* <div className="w-ful h-full bg-amber-200" /> */}
        </div>
      </div>
    </div>
  );
}
