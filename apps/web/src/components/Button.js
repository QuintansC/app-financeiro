'use client';

import styles from './Button.module.css';

export function Button({
  title,
  onClick,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  fullWidth = false,
  type = 'button',
  className = '',
  ...props
}) {
  const buttonClasses = [
    styles.button,
    styles[variant],
    styles[size],
    disabled && styles.disabled,
    fullWidth && styles.fullWidth,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className={styles.loadingContainer}>
          <span className={styles.spinner}></span>
          <span>Carregando...</span>
        </span>
      ) : (
        title
      )}
    </button>
  );
}
