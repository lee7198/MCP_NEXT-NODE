'use client';

import React, { useEffect } from 'react';
import { signOut, useSession } from 'next-auth/react';
import {
  ArrowClockwiseIcon,
  SignOutIcon,
} from '@phosphor-icons/react/dist/ssr';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { common_management } from '../services/api';

export default function Role() {
  const { data: session } = useSession();
  const router = useRouter();

  const { data, isPending } = useQuery({
    queryKey: ['check_user'],
    queryFn: async () => {
      if (!session?.user?.email) throw new Error('이메일이 없습니다.');
      return common_management.checkUser(session.user.email);
    },
    enabled: !!session?.user?.email,
    retry: false,
  });

  useEffect(() => {
    if (!data?.success) router.push('/');
  }, [data]);

  if (isPending || !session) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-zinc-900">
        <div className="border-primary size-16 animate-spin rounded-full border-4 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center bg-gray-50 dark:bg-zinc-900">
      <div className="container flex flex-col items-center gap-4">
        <h1 className="pb-2 text-5xl font-black">보유중인 권한이 없습니다.</h1>
        <p>권한 신청 후 재시도 해주세요.</p>

        <div className="w-full rounded-md bg-gray-200 p-6 text-sm text-gray-500 dark:bg-zinc-800 dark:text-zinc-300">
          <div>신청자 : {session?.user?.name}</div>
          <div>이메일 : {session?.user?.email}</div>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => window.location.reload()}
            className="flex cursor-pointer items-center gap-2 rounded-md border px-4 py-1 hover:bg-zinc-700 hover:text-white"
          >
            <ArrowClockwiseIcon />
            새로고침
          </button>
          <button
            onClick={() => signOut()}
            className="flex cursor-pointer items-center gap-2 rounded-md border px-4 py-1 hover:bg-zinc-700 hover:text-white"
          >
            <SignOutIcon />
            로그아웃
          </button>
        </div>
      </div>
    </div>
  );
}
