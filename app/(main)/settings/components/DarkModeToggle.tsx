'use client';

import useResolvedTheme from '@/app/hooks/useResolvedTheme';
import { useThemeStore } from '@/app/store/themeStore';

export default function DarkModeToggle() {
  const resolvedTheme = useResolvedTheme();
  const setTheme = useThemeStore((state) => state.setTheme);

  const isDark = resolvedTheme === 'dark';

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
