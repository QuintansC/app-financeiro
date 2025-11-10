'use client';

import { useEffect, useState } from 'react';
import { VictoryPie } from 'victory';
import { formatCurrency } from '../../utils/format';
import { useTheme } from '@/contexts/ThemeContext';
import styles from './DebtsChart.module.css';

export function DebtsChart({ summary }) {
  const { theme } = useTheme();
  const [labelColor, setLabelColor] = useState('#1F2937');

  useEffect(() => {
    setLabelColor(theme === 'dark' ? '#D1D5DB' : '#1F2937');
  }, [theme]);

  if (!summary || !summary.debtsTotals) return null;

  const { paid, remaining, total } = summary.debtsTotals;

  const pieData = [
    { x: 'Pago', y: paid, color: '#10B981' },
    { x: 'Restante', y: remaining, color: '#EF4444' },
  ].filter(item => item.y > 0);

  if (pieData.length === 0) {
    return (
      <div className={styles.container}>
        <h3 className={styles.title}>Distribuição de Dívidas</h3>
        <div className={styles.emptyContainer}>
          <p className={styles.emptyText}>Nenhuma dívida cadastrada</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Distribuição de Dívidas</h3>
      <div className={styles.chartContainer}>
        <VictoryPie
          data={pieData}
          width={300}
          height={300}
          colorScale={['#10B981', '#EF4444']}
          innerRadius={60}
          labelRadius={({ innerRadius }) => innerRadius + 30}
          style={{
            labels: {
              fill: labelColor,
              fontSize: 12,
              fontWeight: '600',
            },
          }}
          labelPlacement="perpendicular"
        />
      </div>
      <div className={styles.legend}>
        <div className={styles.legendItem}>
          <div className={styles.legendColor} style={{ backgroundColor: '#10B981' }} />
          <span className={styles.legendText}>
            Pago: {formatCurrency(paid)} ({((paid / total) * 100).toFixed(1)}%)
          </span>
        </div>
        <div className={styles.legendItem}>
          <div className={styles.legendColor} style={{ backgroundColor: '#EF4444' }} />
          <span className={styles.legendText}>
            Restante: {formatCurrency(remaining)} ({((remaining / total) * 100).toFixed(1)}%)
          </span>
        </div>
      </div>
    </div>
  );
}
