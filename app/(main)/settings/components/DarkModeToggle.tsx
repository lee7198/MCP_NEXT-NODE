'use client';

import { useEffect, useState } from 'react';
import { useThemeStore } from '@/app/store/themeStore';

export default function DarkModeToggle() {
  const theme = useThemeStore((state) => state.theme);
  const setTheme = useThemeStore((state) => state.setTheme);
  const [systemDark, setSystemDark] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    const handle = (e: MediaQueryListEvent) => setSystemDark(e.matches);
    setSystemDark(mql.matches);
    mql.addEventListener('change', handle);
    return () => mql.removeEventListener('change', handle);
  }, []);

  const isDark = theme === 'dark' || (theme === 'system' && systemDark);

  const toggle = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  return (
    <label className="inline-flex cursor-pointer items-center gap-2">
      <input
        type="checkbox"
        checked={isDark}
        onChange={toggle}
        className="peer sr-only"
      />
      <div className="peer relative h-6 w-11 rounded-full bg-gray-200 peer-checked:bg-gray-700 after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-white rtl:peer-checked:after:-translate-x-full" />
      <span className="text-sm select-none">
        {isDark ? '다크 모드' : '라이트 모드'}
      </span>
    </label>
  );
}
