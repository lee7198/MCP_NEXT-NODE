'use client';

import { server_management } from '@/app/services/api';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import ServerList from './components/ServerList';

export default function SettingsPage() {
  const { data: servers, isSuccess: isGetServers } = useQuery({
    queryKey: ['server_list'],
    queryFn: async () => server_management.getServers(),
  });

  return (
    <div className="container mx-auto flex flex-col gap-12 p-4">
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-black">SERVER LIST</h1>
          <Link href="/settings/new" className="px-2">
            NEW
          </Link>
        </div>

        <ServerList servers={servers || []} isGetServers={isGetServers} />
      </div>
    </div>
  );
}
