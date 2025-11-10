'use client';

import { usePathname } from 'next/navigation';

export function ConditionalMainContent({ children }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/login';
  
  return (
    <main className={`main-content ${isLoginPage ? 'login-page' : ''}`}>
      {children}
    </main>
  );
}

