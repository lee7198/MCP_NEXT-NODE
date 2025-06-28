'use client';

import React from 'react';
import Header from './components/Header';
import { ToastContainer } from 'react-toastify';
import useResolvedTheme from '@/app/hooks/useResolvedTheme';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const resolvedTheme = useResolvedTheme();
  return (
    <div className="min-h-screen overflow-y-hidden bg-background text-foreground">
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
        theme={resolvedTheme === 'dark' ? 'dark' : 'light'}
        // transition={Bounce}
      />
    </div>
  );
}
