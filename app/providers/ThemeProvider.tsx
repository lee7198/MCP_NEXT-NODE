'use client';

import { useEffect, useState } from 'react';
import { useThemeStore } from '@/app/store/themeStore';

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const theme = useThemeStore((state) => state.theme);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // 수동으로 hydration 처리
    useThemeStore.persist.rehydrate();
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const root = document.documentElement;
    const applyTheme = () => {
      const systemDark = window.matchMedia(
        '(prefers-color-scheme: dark)'
      ).matches;
      const isDark = theme === 'dark' || (theme === 'system' && systemDark);
      if (isDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    };

    applyTheme();

    if (theme === 'system') {
      const mql = window.matchMedia('(prefers-color-scheme: dark)');
      mql.addEventListener('change', applyTheme);
      return () => mql.removeEventListener('change', applyTheme);
    }
  }, [theme, mounted]);

  return <>{children}</>;
}
