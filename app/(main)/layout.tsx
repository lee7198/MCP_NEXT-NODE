'use client';

import React from 'react';
import Header from './components/Header';
import { ToastContainer } from 'react-toastify';
import { useThemeStore } from '@/app/store/themeStore';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const theme = useThemeStore((state) => state.theme);
  return (
    <div className="min-h-screen overflow-y-hidden bg-gray-50 dark:bg-gray-900">
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
