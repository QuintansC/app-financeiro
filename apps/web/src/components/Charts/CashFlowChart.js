'use client';

import { useEffect, useState } from 'react';
import { VictoryChart, VictoryBar, VictoryAxis, VictoryTheme } from 'victory';
import { formatCurrency } from '../../utils/format';
import { useTheme } from '@/contexts/ThemeContext';
import styles from './CashFlowChart.module.css';

export function CashFlowChart({ summary }) {
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

  if (!summary || !summary.salary || !summary.cashFlow) return null;

  const { netIncome } = summary.salary;
  const { availableAfterDebts } = summary.cashFlow;
  const monthlyDebts = summary.debtsTotals?.averageInstallment || 0;

  const data = [
    { x: 'Salário\nLíquido', y: netIncome },
    { x: 'Após\nDívidas', y: availableAfterDebts },
  ];

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Fluxo de Caixa Mensal</h3>
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
                fill: ({ datum }) => datum.y === netIncome ? '#6366F1' : (datum.y < 0 ? '#EF4444' : '#10B981'),
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
      <div className={styles.info}>
        <div className={styles.infoItem}>
          <span className={styles.infoLabel}>Gasto com dívidas:</span>
          <span className={styles.infoValue}>{formatCurrency(monthlyDebts)}/mês</span>
        </div>
      </div>
    </div>
  );
}
