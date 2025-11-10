import './globals.css';
import { ConditionalNavigation } from '@/components/ConditionalNavigation';
import { ConditionalMainContent } from '@/components/ConditionalMainContent';
import { ThemeProviderWrapper } from '@/components/ThemeProviderWrapper';
import { AuthProvider } from '@/contexts/AuthContext';

export const metadata = {
  title: 'Projeto Financeiro',
  description: 'Sistema de gestão financeira pessoal',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
  },
  themeColor: '#6366F1',
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes" />
        <meta name="theme-color" content="#6366F1" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body>
        <ThemeProviderWrapper>
          <AuthProvider>
            <ConditionalNavigation />
            <ConditionalMainContent>{children}</ConditionalMainContent>
          </AuthProvider>
        </ThemeProviderWrapper>
      </body>
    </html>
  );
}

