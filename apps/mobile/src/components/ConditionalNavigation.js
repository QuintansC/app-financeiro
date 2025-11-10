'use client';

import { usePathname } from 'next/navigation';
import { Navigation } from './Navigation';

export function ConditionalNavigation() {
  const pathname = usePathname();
  
  // Não mostrar navegação na página de login
  if (pathname === '/login') {
    return null;
  }
  
  return <Navigation />;
}

