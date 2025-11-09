import { View, Text, StyleSheet, Dimensions, Platform } from 'react-native';
import { VictoryPie } from 'victory-native';
import { formatCurrency } from '../../utils/format';

const screenWidth = Dimensions.get('window').width;
const chartWidth = Platform.OS === 'web' ? 250 : screenWidth - 80;

export function DebtsChart({ summary }) {
  if (!summary || !summary.debtsTotals) return null;

  const { paid, remaining, total } = summary.debtsTotals;

  const pieData = [
    { x: 'Pago', y: paid, color: '#10B981' },
    { x: 'Restante', y: remaining, color: '#EF4444' },
  ].filter(item => item.y > 0);

  if (pieData.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Distribuição de Dívidas</Text>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Nenhuma dívida cadastrada</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Distribuição de Dívidas</Text>
      <View style={styles.chartContainer}>
        <VictoryPie
          data={pieData}
          width={Math.min(chartWidth, 300)}
          height={Math.min(chartWidth, 300)}
          colorScale={['#10B981', '#EF4444']}
          innerRadius={60}
          labelRadius={({ innerRadius }) => innerRadius + 30}
          style={{
            labels: {
              fill: '#1F2937',
              fontSize: 12,
              fontWeight: '600',
            },
          }}
          labelPlacement="perpendicular"
        />
      </View>
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: '#10B981' }]} />
          <Text style={styles.legendText}>
            Pago: {formatCurrency(paid)} ({((paid / total) * 100).toFixed(1)}%)
          </Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: '#EF4444' }]} />
          <Text style={styles.legendText}>
            Restante: {formatCurrency(remaining)} ({((remaining / total) * 100).toFixed(1)}%)
          </Text>
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
  legend: {
    marginTop: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 4,
    marginRight: 8,
  },
  legendText: {
    fontSize: 14,
    color: '#4B5563',
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

