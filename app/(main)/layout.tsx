'use client';

import React, { useEffect, useState } from 'react';
import Header from './components/Header';
import { ToastContainer } from 'react-toastify';
import { useThemeStore } from '@/app/store/themeStore';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const theme = useThemeStore((state) => state.theme);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const systemDark = window.matchMedia(
      '(prefers-color-scheme: dark)'
    ).matches;

    if (theme === 'dark') {
      setIsDark(true);
    } else if (theme === 'light') {
      setIsDark(false);
    } else if (theme === 'system') {
      setIsDark(systemDark);
    }

    if (theme === 'system') {
      const mql = window.matchMedia('(prefers-color-scheme: dark)');
      const handle = (e: MediaQueryListEvent) => {
        if (theme === 'system') {
          setIsDark(e.matches);
        }
      };
      mql.addEventListener('change', handle);
      return () => mql.removeEventListener('change', handle);
    }
  }, [theme]);

  return (
    <div
      className="min-h-screen overflow-y-hidden bg-gray-50 text-gray-900 dark:bg-zinc-900 dark:text-zinc-100"
      suppressHydrationWarning
    >
      <Header />
      <div className="pt-12" />
      {children}

      {/* alert 발송 */}
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={isDark ? 'dark' : 'light'}
        // transition={Bounce}
      />
    </div>
  );
}
