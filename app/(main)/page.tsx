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
    <div className="flex h-[calc(100svh-3rem)] w-screen items-center justify-center">
      <div className="">
        <h1 className="text-center text-7xl font-black">
          MCP 통합 관리 SYSTEM
        </h1>
        <Dashboard />
      </div>
    </div>
  );
}
