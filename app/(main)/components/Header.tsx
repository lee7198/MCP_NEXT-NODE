'use client';

import React, { useState } from 'react';
import { pages } from '@/app/lib/common';
import Link from 'next/link';
import UserInfo from './common/UserInfo';
import Image from 'next/image';
import { GoogleLogoIcon } from '@phosphor-icons/react/dist/ssr';
import { signIn, signOut, useSession } from 'next-auth/react';

const Header = React.memo(function Header() {
  const { data: session } = useSession();
  const [openHover, setOpenHover] = useState(false);

  return (
    <div className="absolute top-0 z-[9999] w-screen border-b bg-gray-50">
      <div className="container mx-auto flex h-12 w-full items-center justify-between gap-2 px-4">
        {/* links */}
        <div className="flex gap-4 uppercase">
          {pages.map((item) => (
            <Link key={item.path} href={item.path} className="cursor-pointer">
              {item.name}
            </Link>
          ))}
        </div>
        {session?.user ? (
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
                />
              ) : (
                <div className="size-8 animate-pulse rounded-full bg-gray-300" />
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
        ) : (
          <>
            <button
              onClick={() => signIn('google')}
              className="flex cursor-pointer items-center gap-2 rounded-md border px-4 py-1 text-sm hover:bg-gray-200"
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
