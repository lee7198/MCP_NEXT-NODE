import type { Metadata } from 'next';
import './globals.css';
import ReactQueryProvider from '@/app/components/providers/ReactQueryProvider';

export const metadata: Metadata = {
  title: 'MCP_TEST',
  description: 'MCP_TEST Web',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased">
        <ReactQueryProvider>{children}</ReactQueryProvider>
      </body>
    </html>
  );
}
