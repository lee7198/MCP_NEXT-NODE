'use client';

import { useEffect } from 'react';
import useResolvedTheme from '@/app/hooks/useResolvedTheme';

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const resolvedTheme = useResolvedTheme();

  useEffect(() => {
    const root = document.documentElement;
    if (resolvedTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [resolvedTheme]);

  return <>{children}</>;
}
