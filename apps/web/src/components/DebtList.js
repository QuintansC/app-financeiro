'use client';

import { formatCurrency } from '../utils/format';
import styles from './DebtList.module.css';

function getDebtStatus(debt) {
  if (debt.paidInstallments >= debt.installments) {
    return 'paid';
  }
  if (debt.paidInstallments > 0) {
    return 'in-progress';
  }
  return 'pending';
}

function getStatusLabel(status) {
  const labels = {
    paid: 'Paga',
    'in-progress': 'Em andamento',
    pending: 'Pendente',
  };
  return labels[status] || status;
}

export function DebtList({ debts = [], onSelect, onDelete, onMarkAsPaid, viewMode = 'list' }) {
  if (!debts.length) {
    return <p className={styles.empty}>Nenhuma dívida cadastrada.</p>;
  }

  const handleEdit = (debt, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (onSelect) {
      onSelect(debt);
    }
  };

  const containerClass = viewMode === 'grid' ? styles.gridContainer : styles.listContainer;
  const itemClass = viewMode === 'grid' ? `${styles.item} ${styles.itemGrid}` : styles.item;

  return (
    <div className={containerClass}>
      {debts.map((debt) => {
        const status = getDebtStatus(debt);
        return (
          <div
            key={debt.id}
            className={itemClass}
          >
            <div 
              className={styles.content} 
              onClick={(e) => handleEdit(debt, e)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleEdit(debt, e);
                }
              }}
            >
              <div className={styles.header}>
                <span className={styles.creditor}>{debt.creditor}</span>
                <span className={`${styles.statusBadge} ${styles[`status${status === 'in-progress' ? 'InProgress' : status.charAt(0).toUpperCase() + status.slice(1)}`]}`}>
                  {getStatusLabel(status)}
                </span>
              </div>
              {(() => {
                // Garantir que se parcelas pagas = 0, então valor pago = 0
                const paidInstallments = debt.paidInstallments || 0;
                const paidValue = paidInstallments === 0 ? 0 : (debt.paidValue || 0);
                
                // O valor original é sempre totalValue + paidValue
                // Se nunca foi pago, totalValue já é o valor original
                const originalValue = (debt.totalValue || 0) + paidValue;
                const remainingValue = debt.totalValue || 0;
                const hasPayments = paidValue > 0 && paidInstallments > 0;
                
                return (
                  <>
                    {hasPayments ? (
                      <>
                        <p className={styles.line}>
                          Valor original: <span className={styles.originalValue}>{formatCurrency(originalValue)}</span>
                        </p>
                        <p className={styles.line}>
                          Valor pago: <span className={styles.paidValue}>{formatCurrency(paidValue)}</span>
                        </p>
                        <p className={styles.line}>
                          Valor restante: <span className={styles.value}>{formatCurrency(remainingValue)}</span>
                        </p>
                      </>
                    ) : (
                      <p className={styles.line}>
                        Total: <span className={styles.value}>{formatCurrency(debt.totalValue)}</span>
                      </p>
                    )}
                  </>
                );
              })()}
              {(() => {
                // Calcular valor da parcela regular: totalValue / installments
                // A primeira parcela (entrada) não influencia no cálculo das demais
                // SEMPRE mostrar o valor da parcela regular, não o valor da entrada
                const totalValue = debt.totalValue || 0;
                const installments = debt.installments || 1;
                const paidInstallments = debt.paidInstallments || 0;
                const remainingInstallments = installments - paidInstallments;
                const hasEntry = debt.firstInstallmentValue && debt.firstInstallmentValue > 0;
                
                // Calcular valor da parcela regular
                let installmentValue = 0;
                if (remainingInstallments > 0) {
                  // Se há entrada, as parcelas regulares são: totalValue / (installments - 1)
                  // Se não há entrada, as parcelas são: totalValue / installments
                  if (hasEntry) {
                    // Se já pagou a entrada, calcular baseado nas parcelas restantes
                    if (paidInstallments > 0) {
                      installmentValue = totalValue / remainingInstallments;
                    } else {
                      // Ainda não pagou a entrada, mostrar valor da parcela regular
                      const regularInstallments = installments - 1;
                      installmentValue = totalValue / regularInstallments;
                    }
                  } else {
                    // Não há entrada, calcular normalmente
                    installmentValue = totalValue / remainingInstallments;
                  }
                } else {
                  // Se todas foram pagas, calcular média das parcelas regulares
                  const regularInstallments = hasEntry ? installments - 1 : installments;
                  installmentValue = totalValue / regularInstallments;
                }
                
                return (
                  <p className={styles.line}>
                    Parcelas: {paidInstallments}/{installments} (
                    {formatCurrency(installmentValue)})
                  </p>
                );
              })()}
              <p className={styles.line}>
                Vencimento dia {debt.dueDay || '—'}
              </p>
            </div>
            <div className={styles.actions}>
              {debt.paidInstallments < debt.installments && onMarkAsPaid && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onMarkAsPaid) {
                      onMarkAsPaid(debt);
                    }
                  }}
                  className={styles.markPaidButton}
                  aria-label="Marcar parcelas como pagas"
                  type="button"
                >
                  ✓ Marcar Parcelas
                </button>
              )}
              <button
                onClick={(e) => handleEdit(debt, e)}
                className={styles.editButton}
                aria-label="Editar dívida"
                type="button"
              >
                Editar
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (onDelete) {
                    onDelete(debt.id);
                  }
                }}
                className={styles.deleteButton}
                aria-label="Excluir dívida"
                type="button"
              >
                Excluir
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
