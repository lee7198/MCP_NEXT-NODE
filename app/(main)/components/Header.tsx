'use client';

import React, { useState, useEffect } from 'react';
import { pages } from '@/app/lib/common';
import Link from 'next/link';
import UserInfo from './common/UserInfo';
import Image from 'next/image';
import { GoogleLogoIcon } from '@phosphor-icons/react/dist/ssr';
import { signIn, signOut, useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';

const Header = React.memo(function Header() {
  const { data: session, status } = useSession();
  const [openHover, setOpenHover] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  // 서버 사이드 렌더링 중에는 로딩 상태 표시
  if (!mounted) {
    return (
      <div
        className="absolute top-0 z-[9999] w-screen border-b border-gray-300 bg-white dark:border-zinc-700 dark:bg-zinc-800"
        suppressHydrationWarning
      >
        <div className="container mx-auto flex h-12 w-full items-center justify-between gap-2 px-4">
          <div className="flex w-full items-center justify-between">
            <div />
            <div className="size-8 animate-pulse rounded-full bg-gray-300 dark:bg-zinc-600" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="absolute top-0 z-[9999] w-screen border-b border-gray-300 bg-white dark:border-zinc-700 dark:bg-zinc-800"
      suppressHydrationWarning
    >
      <div className="container mx-auto flex h-12 w-full items-center justify-between gap-2 px-4">
        {/* links */}

        {status === 'loading' ? (
          <div className="flex w-full items-center justify-between">
            <div />
            <div className="size-8 animate-pulse rounded-full bg-gray-300 dark:bg-zinc-600" />
          </div>
        ) : session?.user ? (
          <>
            <div className="flex gap-4 uppercase">
              {pages.map((item) => {
                const isActive =
                  item.path === '/'
                    ? pathname === '/'
                    : pathname.startsWith(item.path);
                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    className={`cursor-pointer text-gray-900 hover:text-gray-600 dark:text-zinc-100 dark:hover:text-gray-300 ${isActive ? 'font-black underline underline-offset-4' : ''}`}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </div>
            <div className="relative flex items-center gap-2">
              <button
                className="cursor-pointer"
                onClick={() => setOpenHover(!openHover)}
              >
                {session.user.image ? (
                  <Image
                    width={32}
                    height={32}
                    src={session.user.image}
                    alt="profile_image"
                    className="rounded-full"
                  />
                ) : (
                  <div className="size-8 animate-pulse rounded-full bg-gray-300 dark:bg-zinc-600" />
                )}
              </button>
              <UserInfo
                userId={session.user.name || ''}
                email={session.user.email || ''}
                openHover={openHover}
                setOpenHover={setOpenHover}
                onSignOut={() => signOut()}
              />
            </div>
          </>
        ) : (
          <>
            <div />
            <button
              onClick={() => signIn('google')}
              className="flex cursor-pointer items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-1 text-sm text-gray-700 hover:bg-gray-100 dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-600"
            >
              <GoogleLogoIcon size={16} weight="bold" /> 구글 계정으로 로그인
            </button>
          </>
        )}
      </div>
    </div>
  );
});

export default Header;
