'use client';

import { useState } from 'react';
import { Button } from './Button';
import styles from './ConfirmModal.module.css';

export function ConfirmModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  variant = 'danger'
}) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleConfirm = async () => {
    try {
      setIsProcessing(true);
      await onConfirm();
      onClose();
    } catch (err) {
      // Se houver erro, não fecha o modal
      console.error('Erro na confirmação:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h3 className={styles.title}>{title}</h3>
          <button 
            className={styles.closeButton} 
            onClick={onClose} 
            aria-label="Fechar"
            disabled={isProcessing}
          >
            ×
          </button>
        </div>
        
        <div className={styles.body}>
          <p className={styles.message}>{message}</p>
        </div>

        <div className={styles.actions}>
          <Button
            title={cancelText}
            variant="outline"
            onClick={onClose}
            className={styles.cancelButton}
            disabled={isProcessing}
          />
          <Button
            title={isProcessing ? 'Processando...' : confirmText}
            variant={variant}
            onClick={handleConfirm}
            disabled={isProcessing}
          />
        </div>
      </div>
    </div>
  );
}

