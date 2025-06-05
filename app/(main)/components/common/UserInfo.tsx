import React from 'react';

export default function UserInfo({ userId }: { userId: string }) {
  return (
    <div className="absolute top-12 right-4 h-36 w-52 rounded-lg bg-white p-4 shadow-2xl">
      <div>{userId}</div>
    </div>
  );
}
