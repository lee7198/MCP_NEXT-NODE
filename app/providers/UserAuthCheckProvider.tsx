'use client';

import { useEffect, useState, useMemo } from 'react';
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
  const [lastCheckedEmail, setLastCheckedEmail] = useState<string | null>(null);

  // 세션 상태를 메모이제이션하여 불필요한 리렌더링 방지
  const sessionState = useMemo(
    () => ({
      email: session?.user?.email,
      isAuthenticated: status === 'authenticated',
      isLoading: status === 'loading',
    }),
    [session?.user?.email, status]
  );

  const checkUser = async () => {
    // 이미 같은 이메일로 체크했거나 인증되지 않은 경우 스킵
    if (
      !sessionState.email ||
      !sessionState.isAuthenticated ||
      lastCheckedEmail === sessionState.email
    ) {
      return;
    }

    setIsChecking(true);
    try {
      const response = await fetch(
        `/api/common/check_user?email=${sessionState.email}`,
        {
          // 캐시 설정으로 성능 향상
          cache: 'force-cache',
          next: { revalidate: 300 }, // 5분간 캐시
        }
      );

      const data = await response.json();

      if (!response.ok || data.error) {
        setIsAuthorized(false);
        setLastCheckedEmail(sessionState.email);

        if (pathname !== '/no_role') {
          router.push('/no_role');
        }
      } else {
        setIsAuthorized(true);
        setLastCheckedEmail(sessionState.email);
      }
    } catch {
      setIsAuthorized(false);
      setLastCheckedEmail(sessionState.email);

      if (pathname !== '/no_role') {
        router.push('/no_role');
      }
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    // 세션이 로딩 중이거나 이메일이 없으면 스킵
    if (sessionState.isLoading || !sessionState.email) {
      return;
    }

    checkUser();
  }, [sessionState.email, sessionState.isAuthenticated, pathname]);

  // /no_role 페이지에서는 로딩 표시하지 않음
  if (pathname === '/no_role') {
    return <>{children}</>;
  }

  // 로딩 중일 때는 로딩 표시
  if (sessionState.isLoading || isChecking) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="border-primary size-16 animate-spin rounded-full border-4 border-t-transparent"></div>
      </div>
    );
  }

  // 미승인된 사용자인 경우 빈 화면 (리다이렉트 중)
  if (sessionState.isAuthenticated && !isAuthorized) {
    return null;
  }

  return <>{children}</>;
}
