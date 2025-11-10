'use client';

import styles from './Section.module.css';

export function Section({ title, children }) {
  return (
    <div className={styles.container}>
      {title && <h2 className={styles.title}>{title}</h2>}
      {children}
    </div>
  );
}
