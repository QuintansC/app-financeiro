import { View, Text, StyleSheet, Dimensions, Platform } from 'react-native';
import { VictoryBar, VictoryChart, VictoryAxis, VictoryTheme } from 'victory-native';
import { formatCurrency, formatPercent } from '../../utils/format';

const screenWidth = Dimensions.get('window').width;
const chartWidth = Platform.OS === 'web' ? 300 : screenWidth - 80;

export function SavingsProgressChart({ summary }) {
  if (!summary || !summary.savings) return null;

  const { savedBalance, currentGoal } = summary.savings;
  const progress = currentGoal > 0 ? (savedBalance / currentGoal) * 100 : 0;

  const data = [
    { x: 'Saldo\nAtual', y: savedBalance },
    { x: 'Meta', y: currentGoal },
  ];

  const maxValue = Math.max(savedBalance, currentGoal) * 1.2 || 1000;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Progresso da Poupança</Text>
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
                fill: ({ datum }) => datum.x === 'Saldo\nAtual' ? '#6366F1' : '#10B981',
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
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${Math.min(progress, 100)}%` }]} />
        </View>
        <Text style={styles.progressText}>
          {formatPercent(progress)} da meta alcançada
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
  progressContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  progressBar: {
    height: 12,
    backgroundColor: '#E5E7EB',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#6366F1',
    borderRadius: 6,
  },
  progressText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '600',
    textAlign: 'center',
  },
});

