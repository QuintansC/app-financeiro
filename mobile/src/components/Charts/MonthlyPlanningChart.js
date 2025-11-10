'use client';

import { useEffect, useState } from 'react';
import { VictoryChart, VictoryBar, VictoryAxis, VictoryTheme } from 'victory';
import { formatCurrency } from '../../utils/format';
import { useTheme } from '@/contexts/ThemeContext';
import styles from './MonthlyPlanningChart.module.css';

export function MonthlyPlanningChart({ months }) {
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

  if (!months || months.length === 0) {
    return (
      <div className={styles.container}>
        <h3 className={styles.title}>Planejamento Mensal</h3>
        <div className={styles.emptyContainer}>
          <p className={styles.emptyText}>Nenhum mês planejado</p>
        </div>
      </div>
    );
  }

  // Pegar os últimos 6 meses ou todos se tiver menos
  const recentMonths = months.slice(-6);
  const data = recentMonths.map((month) => ({
    x: month.label.substring(0, 3), // Primeiras 3 letras do mês
    y: month.total || 0,
    fullLabel: month.label,
  }));

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Planejamento Mensal</h3>
      <div className={styles.chartContainer}>
        <VictoryChart
          theme={VictoryTheme.material}
          width={Math.min(400, 100 * data.length + 100)}
          height={250}
          domainPadding={{ x: 20 }}
        >
          <VictoryAxis
            style={{
              axis: { stroke: axisColor },
              tickLabels: { fill: tickLabelColor, fontSize: 10, fontWeight: '600' },
            }}
          />
          <VictoryAxis
            dependentAxis
            tickFormat={(t) => `R$ ${(t / 1000).toFixed(0)}k`}
            style={{
              axis: { stroke: axisColor },
              tickLabels: { fill: tickLabelColor, fontSize: 9, fontWeight: '500' },
            }}
          />
          <VictoryBar
            data={data}
            x="x"
            y="y"
            barWidth={30}
            style={{
              data: {
                fill: '#6366F1',
              },
            }}
            cornerRadius={{ top: 6 }}
            labels={({ datum }) => datum.y > 0 ? formatCurrency(datum.y) : ''}
            style={{
              labels: { fontSize: 9, fill: labelColor, fontWeight: '600' },
            }}
          />
        </VictoryChart>
      </div>
      <div className={styles.summary}>
        <p className={styles.summaryText}>
          Total planejado: {formatCurrency(data.reduce((sum, d) => sum + d.y, 0))}
        </p>
        <p className={styles.summarySubtext}>
          {data.length} {data.length === 1 ? 'mês' : 'meses'} exibidos
        </p>
      </div>
    </div>
  );
}
