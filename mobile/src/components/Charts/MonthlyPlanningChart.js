import { View, Text, StyleSheet, Dimensions, Platform } from 'react-native';
import { VictoryChart, VictoryBar, VictoryAxis, VictoryTheme } from 'victory-native';
import { formatCurrency } from '../../utils/format';

const screenWidth = Dimensions.get('window').width;
const chartWidth = screenWidth - 80;

export function MonthlyPlanningChart({ months }) {
  if (!months || months.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Planejamento Mensal</Text>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Nenhum mês planejado</Text>
        </View>
      </View>
    );
  }

  // Pegar os últimos 6 meses ou todos se tiver menos
  const recentMonths = months.slice(-6);
  const data = recentMonths.map((month) => ({
    x: month.label.substring(0, 3), // Primeiras 3 letras do mês
    y: month.total || 0,
    fullLabel: month.label,
  }));

  const maxValue = Math.max(...data.map(d => d.y), 1000) * 1.2;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Planejamento Mensal</Text>
      <View style={styles.chartContainer}>
        <VictoryChart
          theme={VictoryTheme.material}
          width={Math.min(chartWidth, 400)}
          height={250}
          domainPadding={{ x: 20 }}
        >
          <VictoryAxis
            style={{
              axis: { stroke: '#E5E7EB' },
              tickLabels: { fill: '#6B7280', fontSize: 10, fontWeight: '600' },
            }}
          />
          <VictoryAxis
            dependentAxis
            tickFormat={(t) => `R$ ${(t / 1000).toFixed(0)}k`}
            style={{
              axis: { stroke: '#E5E7EB' },
              tickLabels: { fill: '#6B7280', fontSize: 9, fontWeight: '500' },
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
              labels: { fontSize: 9, fill: '#1F2937', fontWeight: '600' },
            }}
          />
        </VictoryChart>
      </View>
      <View style={styles.summary}>
        <Text style={styles.summaryText}>
          Total planejado: {formatCurrency(data.reduce((sum, d) => sum + d.y, 0))}
        </Text>
        <Text style={styles.summarySubtext}>
          {data.length} {data.length === 1 ? 'mês' : 'meses'} exibidos
        </Text>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
  },
  chartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  summary: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    alignItems: 'center',
  },
  summaryText: {
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '700',
    marginBottom: 4,
  },
  summarySubtext: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    color: '#9CA3AF',
    fontSize: 14,
    fontStyle: 'italic',
  },
});

