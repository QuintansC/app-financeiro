'use client';

import { formatCurrency, formatPercent } from '../utils/format';
import styles from './SummaryCard.module.css';

export function SummaryCard({ summary }) {
  if (!summary) return null;

  return (
    <div className={styles.container}>
      <div className={styles.row}>
        <span className={styles.title}>Dívidas</span>
        <span className={styles.highlight}>{formatCurrency(summary.debtsTotals.total)}</span>
      </div>
      <p className={styles.line}>
        Pago: {formatCurrency(summary.debtsTotals.paid)} | Restante:{' '}
        {formatCurrency(summary.debtsTotals.remaining)}
      </p>
      <p className={styles.line}>
        Parcelas restantes: {summary.debtsTotals.remainingInstallments} | Parcela média:{' '}
        {formatCurrency(summary.debtsTotals.averageInstallment)}
      </p>

      <div className={styles.separator} />

      <div className={styles.row}>
        <span className={styles.title}>Salário líquido</span>
        <span className={styles.highlight}>{formatCurrency(summary.salary.netIncome)}</span>
      </div>
      <p className={styles.line}>
        Após dívidas: {formatCurrency(summary.cashFlow.availableAfterDebts)}{' '}
        {summary.cashFlow.isNegative ? '(atenção)' : ''}
      </p>

      <div className={styles.separator} />

      <div className={styles.row}>
        <span className={styles.title}>Poupança</span>
        <span className={styles.highlight}>{formatCurrency(summary.savings.savedBalance)}</span>
      </div>
      <p className={styles.line}>
        Meta: {formatCurrency(summary.savings.currentGoal)} (
        {formatPercent(summary.savings.progress)})
      </p>
    </div>
  );
}
