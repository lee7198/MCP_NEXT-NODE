import React from 'react';
import Header from './components/Header';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen overflow-y-hidden bg-gray-50">
      <Header />
      <div className="pt-12" />
      {children}
    </div>
  );
}
