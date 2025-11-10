'use client';

import { ThemeProvider } from '@/contexts/ThemeContext';

export function ThemeProviderWrapper({ children }) {
  return <ThemeProvider>{children}</ThemeProvider>;
}

