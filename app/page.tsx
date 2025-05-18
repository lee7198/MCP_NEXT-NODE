'use client';

import ChatContainer from '@/app/components/chat/ChatContainer';
import { useUserStore } from '@/app/store/userStore';

export default function Home() {
  const userId = useUserStore((state) => state.userId);

  return (
    <main className="min-h-screen overflow-y-hidden bg-gray-50">
      <div className="absolute top-0 w-screen border-b bg-gray-50">
        <div className="mx-auto flex h-12 w-full max-w-2xl items-center">
          <div className="text-xl font-extrabold">{userId || ''}</div>
        </div>
      </div>
      <div className="pt-12" />
      <ChatContainer />
    </main>
  );
}
