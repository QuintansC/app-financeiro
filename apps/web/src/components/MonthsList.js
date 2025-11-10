'use client';

import { formatCurrency } from '../utils/format';
import { Button } from './Button';
import styles from './MonthsList.module.css';

export function MonthsList({ months = [], onEdit }) {
  return (
    <div>
      {months.map((month) => (
        <div key={month.id} className={styles.item}>
          <div>
            <span className={styles.label}>{month.label}</span>
            <p className={styles.value}>{formatCurrency(month.total)}</p>
          </div>
          <Button
            title="Editar"
            variant="outline"
            size="small"
            onClick={() => onEdit?.(month)}
          />
        </div>
      ))}
    </div>
  );
}
