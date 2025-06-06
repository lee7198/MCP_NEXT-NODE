'use client';

import React, { useEffect } from 'react';
import { GoogleLogoIcon } from '@phosphor-icons/react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function Signin() {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) router.push('/');
  }, [session]);

  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <div className="">
        <h1 className="text-7xl font-black">MCP 통합 관리 SYSTEM</h1>
        <button
          onClick={() => signIn('google')}
          className="mx-auto my-14 flex grow-0 cursor-pointer items-center gap-2 rounded-md border bg-white px-4 py-1 text-lg drop-shadow-2xl hover:bg-gray-200"
        >
          <GoogleLogoIcon size={24} weight="bold" /> 구글 계정으로 로그인
        </button>
      </div>
    </div>
  );
}
