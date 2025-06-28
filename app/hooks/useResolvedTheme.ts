import { useEffect, useState } from 'react';
import { useThemeStore } from '@/app/store/themeStore';

export default function useResolvedTheme() {
  const theme = useThemeStore((state) => state.theme);
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    const updateTheme = () => {
      const systemDark = mql.matches;
      setResolvedTheme(
        theme === 'dark' || (theme === 'system' && systemDark) ? 'dark' : 'light'
      );
    };
    updateTheme();

    if (theme === 'system') {
      mql.addEventListener('change', updateTheme);
      return () => mql.removeEventListener('change', updateTheme);
    }
  }, [theme]);

  return resolvedTheme;
}
