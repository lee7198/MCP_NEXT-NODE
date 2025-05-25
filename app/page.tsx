'use client';

import ChatContainer from '@/app/components/chat/ChatContainer';
import { useUserStore } from '@/app/store/userStore';
import Avatar from 'boring-avatars';
import { avatarColor } from '@/app/lib/avatarColors';

export default function Home() {
  const userId = useUserStore((state) => state.userId);

  return (
    <main className="min-h-screen overflow-y-hidden bg-gray-50">
      <div className="absolute top-0 z-[9999] w-screen border-b bg-gray-50">
        <div className="mx-auto flex h-12 w-full max-w-3xl items-center gap-2 px-4">
          {userId ? (
            <>
              <Avatar
                colors={avatarColor}
                size={32}
                variant="beam"
                name={userId}
              />
              <div className="text-xl font-extrabold">{userId}</div>
            </>
          ) : (
            <div className="flex animate-pulse items-center gap-2 transition-all">
              <div className="size-8 rounded-full bg-gray-400" />
              <div className="h-4 w-14 rounded-lg bg-gray-400" />
            </div>
          )}
        </div>
      </div>
      <div className="pt-12" />
      <ChatContainer />
    </main>
  );
}
