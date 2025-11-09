import { View, Text, StyleSheet, Dimensions, Platform } from 'react-native';
import { VictoryChart, VictoryBar, VictoryAxis, VictoryTheme } from 'victory-native';
import { formatCurrency } from '../../utils/format';

const screenWidth = Dimensions.get('window').width;
const chartWidth = Platform.OS === 'web' ? 300 : screenWidth - 80;

export function CashFlowChart({ summary }) {
  if (!summary || !summary.salary || !summary.cashFlow) return null;

  const { netIncome } = summary.salary;
  const { availableAfterDebts } = summary.cashFlow;
  const monthlyDebts = summary.debtsTotals?.averageInstallment || 0;

  const data = [
    { x: 'Salário\nLíquido', y: netIncome },
    { x: 'Após\nDívidas', y: availableAfterDebts },
  ];

  const maxValue = Math.max(netIncome, availableAfterDebts) * 1.2;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Fluxo de Caixa Mensal</Text>
      <View style={styles.chartContainer}>
        <VictoryChart
          theme={VictoryTheme.material}
          width={Math.min(chartWidth, Platform.OS === 'web' ? 300 : 350)}
          height={Platform.OS === 'web' ? 220 : 250}
          domainPadding={{ x: 30 }}
        >
          <VictoryAxis
            style={{
              axis: { stroke: '#E5E7EB' },
              tickLabels: { fill: '#6B7280', fontSize: 11, fontWeight: '600' },
            }}
          />
          <VictoryAxis
            dependentAxis
            tickFormat={(t) => `R$ ${(t / 1000).toFixed(0)}k`}
            style={{
              axis: { stroke: '#E5E7EB' },
              tickLabels: { fill: '#6B7280', fontSize: 10, fontWeight: '500' },
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
              labels: { fontSize: 10, fill: '#1F2937', fontWeight: '600' },
            }}
          />
        </VictoryChart>
      </View>
      <View style={styles.info}>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Gasto com dívidas:</Text>
          <Text style={styles.infoValue}>{formatCurrency(monthlyDebts)}/mês</Text>
        </View>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 0,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    minHeight: 400,
    width: '100%',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
    textAlign: 'left',
  },
  chartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  info: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '700',
  },
});

