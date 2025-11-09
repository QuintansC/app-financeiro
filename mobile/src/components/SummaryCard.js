import { StyleSheet, Text, View } from 'react-native';
import { formatCurrency, formatPercent } from '../utils/format';

export function SummaryCard({ summary }) {
  if (!summary) return null;

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.title}>Dívidas</Text>
        <Text style={styles.highlight}>{formatCurrency(summary.debtsTotals.total)}</Text>
      </View>
      <Text style={styles.line}>
        Pago: {formatCurrency(summary.debtsTotals.paid)} | Restante:{' '}
        {formatCurrency(summary.debtsTotals.remaining)}
      </Text>
      <Text style={styles.line}>
        Parcelas restantes: {summary.debtsTotals.remainingInstallments} | Parcela média:{' '}
        {formatCurrency(summary.debtsTotals.averageInstallment)}
      </Text>

      <View style={styles.separator} />

      <View style={styles.row}>
        <Text style={styles.title}>Salário líquido</Text>
        <Text style={styles.highlight}>{formatCurrency(summary.salary.netIncome)}</Text>
      </View>
      <Text style={styles.line}>
        Após dívidas: {formatCurrency(summary.cashFlow.availableAfterDebts)}{' '}
        {summary.cashFlow.isNegative ? '(atenção)' : ''}
      </Text>

      <View style={styles.separator} />

      <View style={styles.row}>
        <Text style={styles.title}>Poupança</Text>
        <Text style={styles.highlight}>{formatCurrency(summary.savings.savedBalance)}</Text>
      </View>
      <Text style={styles.line}>
        Meta: {formatCurrency(summary.savings.currentGoal)} (
        {formatPercent(summary.savings.progress)})
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderRadius: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    color: '#4B5563',
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  highlight: {
    color: '#6366F1',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  line: {
    color: '#6B7280',
    marginTop: 6,
    fontSize: 13,
    lineHeight: 20,
  },
  separator: {
    borderBottomWidth: 1,
    borderColor: '#E5E7EB',
    marginVertical: 16,
  },
});

