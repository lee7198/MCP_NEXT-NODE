'use client';

import { useEffect, useState } from 'react';
import { useThemeStore } from '@/app/store/themeStore';

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const theme = useThemeStore((state) => state.theme);
  const isHydrated = useThemeStore((state) => state.isHydrated);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // 수동으로 hydration 처리
    useThemeStore.persist.rehydrate();
  }, []);

  useEffect(() => {
    if (!mounted || !isHydrated) return;

    const root = document.documentElement;

    const applyTheme = () => {
      // 시스템 다크모드 감지
      const systemDark = window.matchMedia(
        '(prefers-color-scheme: dark)'
      ).matches;

      // 테마 결정 로직
      let isDark = false;

      if (theme === 'dark') {
        isDark = true;
      } else if (theme === 'light') {
        isDark = false;
      } else if (theme === 'system') {
        isDark = systemDark;
      }

      // Tailwind dark 클래스 적용
      if (isDark) {
        root.classList.add('dark');
        // 추가로 data-theme 속성도 설정 (디버깅용)
        root.setAttribute('data-theme', 'dark');
      } else {
        root.classList.remove('dark');
        root.setAttribute('data-theme', 'light');
      }
    };

    applyTheme();

    // 시스템 테마 변경 감지 (system 모드일 때만)
    if (theme === 'system') {
      const mql = window.matchMedia('(prefers-color-scheme: dark)');
      mql.addEventListener('change', applyTheme);
      return () => mql.removeEventListener('change', applyTheme);
    }
  }, [theme, mounted, isHydrated]);

  // hydration 중에는 기본 스타일을 적용하지 않음
  if (!mounted || !isHydrated) {
    return (
      <html lang="ko" suppressHydrationWarning>
        <body suppressHydrationWarning>{children}</body>
      </html>
    );
  }

  return <>{children}</>;
}
