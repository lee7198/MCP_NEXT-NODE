'use client';

import { useEffect, useState } from 'react';
import { useThemeStore } from '@/app/store/themeStore';
import { SunIcon, MoonIcon, MonitorIcon } from '@phosphor-icons/react/ssr';

export default function ThemeSelector() {
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

  const themeOptions = [
    {
      value: 'light' as const,
      label: '라이트 모드',
      icon: SunIcon,
      description: '밝은 테마를 사용합니다',
    },
    {
      value: 'dark' as const,
      label: '다크 모드',
      icon: MoonIcon,
      description: '어두운 테마를 사용합니다',
    },
    {
      value: 'system' as const,
      label: '시스템 설정',
      icon: MonitorIcon,
      description: `시스템 설정을 따릅니다 (현재: ${systemDark ? '다크' : '라이트'})`,
    },
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-zinc-100">
        테마 설정
      </h3>
      <div className="space-y-3">
        {themeOptions.map((option) => {
          const Icon = option.icon;
          const isSelected = theme === option.value;

          return (
            <label
              key={option.value}
              className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition-all ${
                isSelected
                  ? 'border-gray-300 bg-gray-800 hover:bg-gray-700 dark:border-zinc-400 dark:bg-zinc-600 dark:hover:bg-zinc-500'
                  : 'border-gray-300 bg-white hover:bg-gray-100 dark:border-zinc-700 dark:bg-zinc-800 dark:hover:bg-zinc-700'
              }`}
            >
              <input
                type="radio"
                name="theme"
                value={option.value}
                checked={isSelected}
                onChange={(e) =>
                  setTheme(e.target.value as 'light' | 'dark' | 'system')
                }
                className="sr-only"
              />
              <div
                className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                  isSelected
                    ? 'border-gray-300 bg-gray-500 dark:border-zinc-400 dark:bg-zinc-400'
                    : 'border-gray-300 dark:border-zinc-600'
                }`}
              >
                {isSelected && (
                  <div className="h-2 w-2 rounded-full bg-white dark:bg-zinc-900" />
                )}
              </div>
              <Icon
                size={20}
                className={`${
                  isSelected
                    ? 'text-white dark:text-zinc-400'
                    : 'text-gray-600 dark:text-zinc-400'
                }`}
              />
              <div className="flex-1">
                <div
                  className={`font-medium ${
                    isSelected
                      ? 'text-white dark:text-zinc-100'
                      : 'text-gray-900 dark:text-zinc-100'
                  }`}
                >
                  {option.label}
                </div>
                <div
                  className={`text-sm ${isSelected ? 'text-white dark:text-zinc-400' : 'text-gray-600 dark:text-zinc-400'}`}
                >
                  {option.description}
                </div>
              </div>
            </label>
          );
        })}
      </div>
    </div>
  );
}
