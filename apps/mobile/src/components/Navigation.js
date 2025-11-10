'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { navItems } from '@/config/routes';
import styles from './Navigation.module.css';

export function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const { user, logout, isAuthenticated } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      // No desktop, sidebar sempre aberto
      if (!mobile) {
        setIsSidebarOpen(true);
      } else {
        // No mobile, inicia fechado
        setIsSidebarOpen(false);
      }
    };
    
    // Verificar no mount
    if (typeof window !== 'undefined') {
      checkMobile();
      window.addEventListener('resize', checkMobile);
      
      return () => window.removeEventListener('resize', checkMobile);
    }
  }, []);

  useEffect(() => {
    // Fechar sidebar mobile ao navegar
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  }, [pathname, isMobile]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      {/* Overlay para mobile */}
      {isMobile && isSidebarOpen && (
        <div 
          className={styles.overlay}
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Botão Hambúrguer */}
      <button
        className={styles.menuToggle}
        onClick={toggleSidebar}
        aria-label="Toggle menu"
        aria-expanded={isSidebarOpen}
      >
        <span className={styles.hamburger}>
          <span className={isSidebarOpen ? styles.hamburgerOpen : ''}></span>
          <span className={isSidebarOpen ? styles.hamburgerOpen : ''}></span>
          <span className={isSidebarOpen ? styles.hamburgerOpen : ''}></span>
        </span>
      </button>

      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${isSidebarOpen ? styles.sidebarOpen : ''} ${!isMobile ? styles.sidebarDesktop : ''}`}>
        <div className={styles.sidebarHeader}>
          <h1 className={styles.title}>Projeto Financeiro</h1>
          <button
            className={styles.themeToggleButton}
            onClick={toggleTheme}
            aria-label={`Alternar para ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            <span className={styles.themeToggleIcon}>
              {theme === 'light' ? '🌙' : '☀️'}
            </span>
          </button>
        </div>
        
        <nav className={styles.nav}>
          <ul className={styles.menu}>
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`${styles.link} ${pathname === item.href ? styles.active : ''}`}
                  onClick={() => isMobile && setIsSidebarOpen(false)}
                >
                  <span className={styles.icon}>{item.icon}</span>
                  <span className={styles.label}>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.sidebarFooter}>
          {isAuthenticated && user && (
            <button
              className={styles.userButton}
              onClick={() => {
                router.push('/usuario');
                if (isMobile) {
                  setIsSidebarOpen(false);
                }
              }}
              aria-label="Ver perfil do usuário"
            >
              <span className={styles.userIcon}>👤</span>
              <span className={styles.userName}>{user.name || user.email}</span>
            </button>
          )}

          {isAuthenticated && (
            <button
              className={styles.logoutButton}
              onClick={logout}
              aria-label="Sair"
            >
              <span className={styles.logoutIcon}>🚪</span>
              <span className={styles.logoutLabel}>Sair</span>
            </button>
          )}
        </div>
      </aside>
    </>
  );
}

