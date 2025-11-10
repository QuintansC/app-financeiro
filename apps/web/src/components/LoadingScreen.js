'use client';

import styles from './LoadingScreen.module.css';

export function LoadingScreen({ message = 'Carregando...' }) {
  return (
    <div className={styles.container}>
      <div className={styles.spinner}></div>
      <p className={styles.message}>{message}</p>
    </div>
  );
}
