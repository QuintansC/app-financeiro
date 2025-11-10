'use client';

import { useEffect, useState } from 'react';
import { VictoryBar, VictoryChart, VictoryAxis, VictoryTheme } from 'victory';
import { formatCurrency, formatPercent } from '../../utils/format';
import { useTheme } from '@/contexts/ThemeContext';
import styles from './SavingsProgressChart.module.css';

export function SavingsProgressChart({ summary }) {
  const { theme } = useTheme();
  const [axisColor, setAxisColor] = useState('#E5E7EB');
  const [tickLabelColor, setTickLabelColor] = useState('#6B7280');
  const [labelColor, setLabelColor] = useState('#1F2937');

  useEffect(() => {
    if (theme === 'dark') {
      setAxisColor('#374151');
      setTickLabelColor('#9CA3AF');
      setLabelColor('#D1D5DB');
    } else {
      setAxisColor('#E5E7EB');
      setTickLabelColor('#6B7280');
      setLabelColor('#1F2937');
    }
  }, [theme]);

  if (!summary || !summary.savings) return null;

  const { savedBalance, currentGoal } = summary.savings;
  const progress = currentGoal > 0 ? (savedBalance / currentGoal) * 100 : 0;

  const data = [
    { x: 'Saldo\nAtual', y: savedBalance },
    { x: 'Meta', y: currentGoal },
  ];

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Progresso da Poupança</h3>
      <div className={styles.chartContainer}>
        <VictoryChart
          theme={VictoryTheme.material}
          width={300}
          height={220}
          domainPadding={{ x: 30 }}
        >
          <VictoryAxis
            style={{
              axis: { stroke: axisColor },
              tickLabels: { fill: tickLabelColor, fontSize: 11, fontWeight: '600' },
            }}
          />
          <VictoryAxis
            dependentAxis
            tickFormat={(t) => `R$ ${(t / 1000).toFixed(0)}k`}
            style={{
              axis: { stroke: axisColor },
              tickLabels: { fill: tickLabelColor, fontSize: 10, fontWeight: '500' },
            }}
          />
          <VictoryBar
            data={data}
            x="x"
            y="y"
            barWidth={60}
            style={{
              data: {
                fill: ({ datum }) => datum.x === 'Saldo\nAtual' ? '#6366F1' : '#10B981',
              },
            }}
            cornerRadius={{ top: 8 }}
            labels={({ datum }) => formatCurrency(datum.y)}
            style={{
              labels: { fontSize: 10, fill: labelColor, fontWeight: '600' },
            }}
          />
        </VictoryChart>
      </div>
      <div className={styles.progressContainer}>
        <div className={styles.progressBar}>
          <div className={styles.progressFill} style={{ width: `${Math.min(progress, 100)}%` }} />
        </div>
        <p className={styles.progressText}>
          {formatPercent(progress)} da meta alcançada
        </p>
      </div>
    </div>
  );
}
