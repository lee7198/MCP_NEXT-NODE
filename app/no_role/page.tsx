'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import React from 'react';

export default function Role() {
  const { data: session } = useSession();

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center">
      <div className="container flex flex-col items-center gap-4">
        <h1 className="pb-4 text-5xl font-black">보유중인 권한이 없습니다.</h1>
        <p>권한 신청 후 재시도 해주세요.</p>

        <div className="w-full rounded-lg bg-gray-200 p-6 text-sm text-gray-500">
          <div>신청자 : {session?.user?.name}</div>
          <div>이메일 : {session?.user?.email}</div>
        </div>
        <Link
          href="/"
          className="rounded-md border px-4 py-1 hover:bg-gray-800 hover:text-white"
        >
          돌아가기
        </Link>
      </div>
    </div>
  );
}
