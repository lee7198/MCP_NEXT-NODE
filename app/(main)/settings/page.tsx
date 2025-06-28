import React from 'react';
import {
  HardDrivesIcon,
  UsersIcon,
  RobotIcon,
} from '@phosphor-icons/react/ssr';
import Link from 'next/link';
import DarkModeToggle from './components/DarkModeToggle';

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
      icon: <RobotIcon size={48} />,
    },
  ];
  return (
    <div className="container mx-auto min-h-screen bg-gray-50 p-6 dark:bg-gray-900">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
        시스템 설정
      </h1>

      <div className="grid grid-cols-1 gap-4 py-8 sm:grid-cols-2 lg:grid-cols-3">
        {menuList.map((item) => (
          <Link
            href={item.path}
            key={item.name}
            className="grid cursor-pointer grid-cols-4 items-center rounded-lg border border-gray-300 bg-white p-4 transition-colors hover:bg-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:hover:bg-gray-700"
          >
            <div className="text-gray-900 dark:text-gray-100">{item.icon}</div>
            <div className="col-span-3 text-xl font-bold text-gray-900 dark:text-gray-100">
              {item.name}
            </div>
          </Link>
        ))}
      </div>
      <div className="mt-8">
        <DarkModeToggle />
      </div>
    </div>
  );
}
