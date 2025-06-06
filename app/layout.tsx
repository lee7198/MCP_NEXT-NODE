import React from 'react';
import type { Metadata } from 'next';
import ReactQueryProvider from '@/app/(main)/components/providers/ReactQueryProvider';
import { NextAuthProvider } from '@/app/providers/NextAuthProvider';
import './globals.css';

export const metadata: Metadata = {
  title: 'MCP_TEST',
  description: 'MCP_TEST Web',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body
        suppressHydrationWarning={process.env.NODE_ENV === 'development'}
        className="antialiased"
      >
        <NextAuthProvider>
          <ReactQueryProvider>{children}</ReactQueryProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
