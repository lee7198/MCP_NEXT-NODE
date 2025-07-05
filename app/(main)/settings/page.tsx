import React from 'react';
import {
  HardDrivesIcon,
  UsersIcon,
  RobotIcon,
} from '@phosphor-icons/react/ssr';
import Link from 'next/link';
import ThemeSelector from './components/ThemeSelector';

export default function Setting() {
  const menuList = [
    {
      name: '사용자 관리',
      path: '/settings/user_mng',
      icon: <UsersIcon size={36} />,
    },
    {
      name: '서버(클라이언트) 관리',
      path: '/settings/servers',
      icon: <HardDrivesIcon size={36} />,
    },
    {
      name: 'MCP 마스터 관리',
      path: '/settings/mcp_mng',
      icon: <RobotIcon size={36} />,
    },
  ];
  return (
    <div className="container mx-auto bg-gray-50 p-6 dark:bg-zinc-900">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-zinc-100">
        시스템 설정
      </h1>

      <div className="grid grid-cols-1 gap-4 py-8 sm:grid-cols-2 lg:grid-cols-6">
        {menuList.map((item) => (
          <Link
            href={item.path}
            key={item.name}
            className="grid cursor-pointer grid-cols-5 items-center rounded-lg border border-gray-300 bg-white p-4 transition-colors hover:bg-gray-100 lg:col-span-2 dark:border-zinc-600 dark:bg-zinc-800 dark:hover:bg-zinc-700"
          >
            <div className="text-gray-900 dark:text-zinc-100">{item.icon}</div>
            <div className="col-span-4 text-xl font-bold text-gray-900 dark:text-zinc-100">
              {item.name}
            </div>
          </Link>
        ))}
        <ThemeSelector />
      </div>
    </div>
  );
}
