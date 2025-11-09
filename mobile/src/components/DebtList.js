import { memo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { formatCurrency } from '../utils/format';

function DebtListComponent({ debts = [], onSelect, onDelete }) {
  if (!debts.length) {
    return <Text style={styles.empty}>Nenhuma dívida cadastrada.</Text>;
  }

  return debts.map((debt) => (
    <TouchableOpacity
      key={debt.id}
      style={styles.item}
      onPress={() => onSelect?.(debt)}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <Text style={styles.creditor}>{debt.creditor}</Text>
        <TouchableOpacity
          onPress={() => onDelete?.(debt.id)}
          style={styles.deleteButton}
          activeOpacity={0.7}
        >
          <Text style={styles.delete}>Excluir</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.line}>
        Total: <Text style={styles.value}>{formatCurrency(debt.totalValue)}</Text>
      </Text>
      <Text style={styles.line}>
        Parcelas: {debt.paidInstallments}/{debt.installments} (
        {formatCurrency(debt.installmentValue)})
      </Text>
      <Text style={styles.line}>
        Vencimento dia {debt.dueDay || '—'}
      </Text>
    </TouchableOpacity>
  ));
}

const styles = StyleSheet.create({
  empty: {
    color: '#9CA3AF',
    fontSize: 14,
    fontStyle: 'italic',
    textAlign: 'center',
    padding: 16,
  },
  item: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    backgroundColor: '#FAFBFC',
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  creditor: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1F2937',
    letterSpacing: -0.2,
  },
  deleteButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  delete: {
    color: '#EF4444',
    fontWeight: '600',
    fontSize: 12,
    letterSpacing: 0.2,
  },
  line: {
    color: '#4B5563',
    fontSize: 14,
    marginTop: 4,
    lineHeight: 20,
  },
  value: {
    fontWeight: '700',
    color: '#6366F1',
  },
});

export const DebtList = memo(DebtListComponent);

