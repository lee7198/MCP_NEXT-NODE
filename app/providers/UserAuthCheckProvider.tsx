'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';

export default function UserAuthCheckProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);

  const checkUser = async () => {
    if (!session?.user?.email || status !== 'authenticated') return;

    setIsChecking(true);
    try {
      const response = await fetch(
        `/api/common/check_user?email=${session.user.email}`
      );

      const data = await response.json();

      // 응답에 error 필드가 있거나 HTTP 상태 코드가 에러인 경우
      if (!response.ok || data.error) {
        setIsAuthorized(false);

        // /no_role이 아닌 페이지에 있으면 /no_role로 리다이렉트
        if (pathname !== '/no_role') {
          router.push('/no_role');
        }
      } else {
        setIsAuthorized(true);
      }
    } catch {
      setIsAuthorized(false);

      // 오류 발생 시 미승인된 사용자로 간주
      if (pathname !== '/no_role') {
        router.push('/no_role');
      }
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    checkUser();
  }, [session, status, pathname, router]);

  // /no_role 페이지에서는 로딩 표시하지 않음
  if (pathname === '/no_role') {
    return <>{children}</>;
  }

  // 로딩 중일 때는 로딩 표시
  if (status === 'loading' || isChecking) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="border-primary size-16 animate-spin rounded-full border-4 border-t-transparent"></div>
      </div>
    );
  }

  // 미승인된 사용자인 경우 빈 화면 (리다이렉트 중)
  if (status === 'authenticated' && !isAuthorized) {
    return null;
  }

  return <>{children}</>;
}
