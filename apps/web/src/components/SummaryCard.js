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
    backgroundColor: '#222a45',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    color: '#f4f4f4',
    fontSize: 16,
    fontWeight: '600',
  },
  highlight: {
    color: '#88f2c9',
    fontSize: 16,
    fontWeight: '700',
  },
  line: {
    color: '#dcdcdc',
    marginTop: 4,
  },
  separator: {
    borderBottomWidth: 1,
    borderColor: '#2f385d',
    marginVertical: 12,
  },
});

