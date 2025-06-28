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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 서버 사이드 렌더링 중에는 기본값 사용
  if (!mounted) {
    return (
      <div
        className="bg-background text-foreground min-h-screen overflow-y-hidden"
        suppressHydrationWarning
      >
        <Header />
        <div className="pt-12" />
        {children}
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
          theme="light"
        />
      </div>
    );
  }

  return (
    <div
      className="bg-background text-foreground min-h-screen overflow-y-hidden"
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
        theme={theme === 'dark' ? 'dark' : 'light'}
        // transition={Bounce}
      />
    </div>
  );
}
