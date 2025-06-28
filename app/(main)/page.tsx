'use client';

import React, { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Dashboard from './components/dashboard';

export default function Home() {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) router.push('/');
  }, [session]);

  return (
    <div className="flex h-[calc(100svh-3rem)] w-full justify-center bg-background">
      <div className="flex h-full w-full flex-col overflow-y-scroll py-8">
        <h1 className="my-16 text-center text-[8vw] font-black text-gray-900 lg:text-6xl dark:text-gray-100">
          MCP 통합 관리 SYSTEM
        </h1>
        <Dashboard />
      </div>
    </div>
  );
}
