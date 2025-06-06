import React from 'react';
import { HardDrivesIcon, UsersIcon, Robot } from '@phosphor-icons/react/ssr';
import Link from 'next/link';

export default function Setting() {
  const menuList = [
    {
      name: '사용자 관리',
      path: '/settings/user_mng',
      icon: <UsersIcon size={48} />,
    },
    {
      name: '서버(클라이언트) 관리',
      path: '/settings/servers',
      icon: <HardDrivesIcon size={48} />,
    },
    {
      name: 'MCP 마스터 관리',
      path: '/settings/mcp_mng',
      icon: <Robot size={48} />,
    },
  ];
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold">시스템 설정</h1>

      <div className="grid grid-cols-1 gap-4 py-8 sm:grid-cols-2 lg:grid-cols-3">
        {menuList.map((item) => (
          <Link
            href={item.path}
            key={item.name}
            className="grid cursor-pointer grid-cols-4 items-center rounded-lg border p-4 hover:bg-gray-200"
          >
            <div>{item.icon}</div>
            <div className="col-span-3 text-xl font-bold">{item.name}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
