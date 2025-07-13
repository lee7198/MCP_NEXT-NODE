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
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false);

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
        `/api/common/check_user?email=${sessionState.email}`
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
      setHasCheckedAuth(true);
    }
  };

  useEffect(() => {
    // 세션이 로딩 중이거나 이메일이 없으면 스킵
    if (sessionState.isLoading || !sessionState.email) {
      return;
    }

    checkUser();
  }, [sessionState.email, sessionState.isAuthenticated, pathname]);

  // 세션이 로딩 중이거나 권한 체크 중일 때는 로딩 표시
  if (sessionState.isLoading || isChecking) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="border-primary size-16 animate-spin rounded-full border-4 border-t-transparent"></div>
      </div>
    );
  }

  const publicPaths = ['/']; // 공개 경로 추가

  if (!sessionState.isAuthenticated && publicPaths.includes(pathname)) {
    return <>{children}</>;
  }

  // 인증되지 않은 사용자는 로그인 페이지로 리다이렉트
  if (!sessionState.isAuthenticated) {
    return null;
  }

  // 권한 체크가 완료되지 않았고, /no_role 페이지가 아닌 경우 로딩 표시
  if (!hasCheckedAuth && pathname !== '/no_role') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="border-primary size-16 animate-spin rounded-full border-4 border-t-transparent"></div>
      </div>
    );
  }

  // 권한이 없는 사용자가 /no_role 페이지가 아닌 곳에 접근하려고 할 때
  if (hasCheckedAuth && !isAuthorized && pathname !== '/no_role') {
    return null; // 리다이렉트 중이므로 빈 화면
  }

  return <>{children}</>;
}
