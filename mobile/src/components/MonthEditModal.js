'use client';

import { useState, useEffect } from 'react';
import { Button } from './Button';
import styles from './MonthEditModal.module.css';

export function MonthEditModal({ isOpen, onClose, month, onSubmit }) {
  const [amount, setAmount] = useState('');

  useEffect(() => {
    if (month && isOpen) {
      setAmount(String(month.total || ''));
    }
  }, [month, isOpen]);

  if (!isOpen || !month) return null;

  function handleSubmit(e) {
    e.preventDefault();
    if (!amount.trim()) {
      return;
    }

    const toNumber = (value) => {
      if (value === '' || value === null || value === undefined) return 0;
      const normalizedValue = String(value).replace(',', '.');
      const num = Number(normalizedValue);
      return isNaN(num) ? 0 : num;
    };

    onSubmit?.({
      id: month.id,
      label: month.label,
      total: toNumber(amount),
    });

    setAmount('');
    onClose();
  }

  function handleClose() {
    setAmount('');
    onClose();
  }

  return (
    <div className={styles.overlay} onClick={handleClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>Atualizar {month.label}</h2>
          <button className={styles.closeButton} onClick={handleClose} aria-label="Fechar">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label}>Valor planejado</label>
            <input
              className={styles.input}
              type="text"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Ex: 5000,00"
              inputMode="numeric"
              required
              autoFocus
            />
            <small className={styles.hint}>
              Digite o valor total planejado para {month.label}
            </small>
          </div>

          <div className={styles.actions}>
            <Button
              type="button"
              title="Cancelar"
              variant="outline"
              onClick={handleClose}
              className={styles.cancelButton}
            />
            <Button
              type="submit"
              title="Salvar"
              variant="primary"
            />
          </div>
        </form>
      </div>
    </div>
  );
}

