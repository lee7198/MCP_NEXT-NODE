'use client';

import { useState } from 'react';
import { useUserStore } from '@/app/store/userStore';

export default function UserIdInput() {
  const [userIdInput, setUserIdInput] = useState('');
  const setUserId = useUserStore((state) => state.setUserId);

  const handleUserIdSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userIdInput.trim()) {
      setUserId(userIdInput.trim());
    }
  };

  return (
    <div className="bg-opacity-40 fixed inset-0 z-50 flex items-center justify-center bg-gray-50">
      <form
        onSubmit={handleUserIdSubmit}
        className="flex min-w-[320px] flex-col items-center gap-4 rounded-lg bg-white p-8 shadow-xl"
      >
        <h2 className="text-lg font-bold">사용자 ID를 입력하세요</h2>
        <input
          type="text"
          value={userIdInput}
          onChange={(e) => setUserIdInput(e.target.value)}
          className="focus:outline-main w-full rounded border px-3 py-2"
          placeholder="userId"
          autoFocus
        />
        <button
          type="submit"
          className="bg-main hover:bg-main/80 w-full rounded px-4 py-2 text-white"
        >
          확인
        </button>
      </form>
    </div>
  );
}
