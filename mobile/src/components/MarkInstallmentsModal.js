'use client';

import { useState, useEffect } from 'react';
import { Button } from './Button';
import { formatCurrency } from '../utils/format';
import styles from './MarkInstallmentsModal.module.css';

export function MarkInstallmentsModal({ 
  isOpen, 
  onClose, 
  debt,
  onConfirm 
}) {
  const [mode, setMode] = useState('single'); // 'single' ou 'multiple'
  const [installmentsToMark, setInstallmentsToMark] = useState(1);
  const [error, setError] = useState('');

  useEffect(() => {
    if (debt && isOpen) {
      setInstallmentsToMark(1);
      setMode('single');
      setError('');
    }
  }, [debt, isOpen]);

  if (!isOpen || !debt) return null;

  const remainingInstallments = debt.installments - debt.paidInstallments;
  const maxInstallments = Math.min(remainingInstallments, debt.installments);

  const calculatePaymentValue = (numInstallments) => {
    const currentTotalValue = debt.totalValue || 0;
    const totalInstallments = debt.installments || 1;
    const currentPaid = debt.paidInstallments || 0;
    const remainingInstallments = totalInstallments - currentPaid;
    
    // Se não houver parcelas restantes, retorna 0
    if (remainingInstallments <= 0) return 0;
    
    // Se houver firstInstallmentValue e ainda não foi paga (entrada)
    if (currentPaid === 0 && debt.firstInstallmentValue && debt.firstInstallmentValue > 0) {
      // Primeira parcela é entrada e não influencia no cálculo das demais
      if (numInstallments === 1) {
        return debt.firstInstallmentValue;
      } else {
        // Entrada + demais parcelas
        // As parcelas são calculadas como: totalValue / (installments - 1) porque a entrada não conta
        const regularInstallments = totalInstallments - 1; // Exclui a entrada
        const regularInstallmentValue = currentTotalValue / regularInstallments;
        return debt.firstInstallmentValue + (regularInstallmentValue * (numInstallments - 1));
      }
    } else {
      // Todas as parcelas têm o mesmo valor: totalValue / número de parcelas restantes
      const installmentValue = currentTotalValue / remainingInstallments;
      return installmentValue * numInstallments;
    }
  };

  const handleSingleMark = async () => {
    if (remainingInstallments <= 0) {
      setError('Todas as parcelas já foram pagas');
      return;
    }

    try {
      const paymentValue = calculatePaymentValue(1);
      // O valor original é sempre totalValue + paidValue (antes de atualizar)
      // Reduzir o totalValue pelo valor da parcela paga
      const currentTotalValue = debt.totalValue || 0;
      const currentPaidValue = debt.paidValue || 0;
      const updatedTotalValue = Math.max(0, currentTotalValue - paymentValue);
      const updatedPaidValue = currentPaidValue + paymentValue;
      
      const updatedDebt = {
        ...debt,
        totalValue: updatedTotalValue,
        paidInstallments: debt.paidInstallments + 1,
        paidValue: updatedPaidValue,
      };
      await onConfirm(updatedDebt);
      onClose();
    } catch (err) {
      setError(err.message || 'Erro ao marcar parcela');
    }
  };

  const handleMultipleMark = async () => {
    setError('');

    if (!installmentsToMark || installmentsToMark <= 0) {
      setError('Digite um número válido de parcelas');
      return;
    }

    if (installmentsToMark > remainingInstallments) {
      setError(`Você só pode marcar até ${remainingInstallments} parcela(s) restante(s)`);
      return;
    }

    try {
      const numInstallments = Number(installmentsToMark);
      const paymentValue = calculatePaymentValue(numInstallments);
      // O valor original é sempre totalValue + paidValue (antes de atualizar)
      // Reduzir o totalValue pelo valor das parcelas pagas
      const currentTotalValue = debt.totalValue || 0;
      const currentPaidValue = debt.paidValue || 0;
      const updatedTotalValue = Math.max(0, currentTotalValue - paymentValue);
      const updatedPaidValue = currentPaidValue + paymentValue;
      
      const updatedDebt = {
        ...debt,
        totalValue: updatedTotalValue,
        paidInstallments: debt.paidInstallments + numInstallments,
        paidValue: updatedPaidValue,
      };
      await onConfirm(updatedDebt);
      onClose();
    } catch (err) {
      setError(err.message || 'Erro ao marcar parcelas');
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h3 className={styles.title}>Marcar Parcelas - {debt.creditor}</h3>
          <button className={styles.closeButton} onClick={onClose} aria-label="Fechar">
            ×
          </button>
        </div>
        
        <div className={styles.body}>
          <div className={styles.info}>
            <p className={styles.infoText}>
              Parcelas pagas: <strong>{debt.paidInstallments}</strong> de <strong>{debt.installments}</strong>
            </p>
            <p className={styles.infoText}>
              Parcelas restantes: <strong>{remainingInstallments}</strong>
            </p>
            {(() => {
              // O valor original é sempre totalValue + paidValue
              // Se nunca foi pago, totalValue já é o valor original
              const originalValue = (debt.totalValue || 0) + (debt.paidValue || 0);
              const remainingValue = debt.totalValue || 0;
              const paidValue = debt.paidValue || 0;
              return (
                <>
                  <p className={styles.infoText}>
                    Valor original: <strong>{formatCurrency(originalValue)}</strong>
                  </p>
                  {paidValue > 0 && (
                    <p className={styles.infoText}>
                      Valor pago: <strong>{formatCurrency(paidValue)}</strong>
                    </p>
                  )}
                  <p className={styles.infoText}>
                    Valor restante: <strong>{formatCurrency(remainingValue)}</strong>
                  </p>
                </>
              );
            })()}
          </div>

          <div className={styles.modeSelector}>
            <button
              className={`${styles.modeButton} ${mode === 'single' ? styles.modeButtonActive : ''}`}
              onClick={() => {
                setMode('single');
                setError('');
              }}
            >
              Marcar 1 parcela
            </button>
            <button
              className={`${styles.modeButton} ${mode === 'multiple' ? styles.modeButtonActive : ''}`}
              onClick={() => {
                setMode('multiple');
                setError('');
              }}
            >
              Marcar múltiplas
            </button>
          </div>

          {error && (
            <div className={styles.errorMessage}>{error}</div>
          )}

          {mode === 'multiple' && (
            <div className={styles.multipleInput}>
              <label className={styles.label}>
                Quantas parcelas foram pagas?
              </label>
              <input
                type="number"
                min="1"
                max={remainingInstallments}
                value={installmentsToMark}
                onChange={(e) => {
                  const value = parseInt(e.target.value) || 0;
                  if (value >= 1 && value <= remainingInstallments) {
                    setInstallmentsToMark(value);
                    setError('');
                  } else if (value > remainingInstallments) {
                    setInstallmentsToMark(remainingInstallments);
                  } else {
                    setInstallmentsToMark(value);
                  }
                }}
                className={styles.input}
                placeholder="Ex: 3"
              />
              <small className={styles.hint}>
                Máximo: {remainingInstallments} parcela(s) restante(s)
              </small>
            </div>
          )}

          {mode === 'single' && (
            <div className={styles.singleInfo}>
              <p className={styles.singleText}>
                Ao confirmar, será marcada <strong>1 parcela</strong> como paga.
              </p>
            </div>
          )}
        </div>

        <div className={styles.actions}>
          <Button
            title="Cancelar"
            variant="outline"
            onClick={onClose}
            className={styles.cancelButton}
          />
          <Button
            title={mode === 'single' ? 'Marcar 1 Parcela' : `Marcar ${installmentsToMark} Parcela(s)`}
            variant="primary"
            onClick={mode === 'single' ? handleSingleMark : handleMultipleMark}
          />
        </div>
      </div>
    </div>
  );
}

