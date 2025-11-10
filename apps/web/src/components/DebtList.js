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
        <TouchableOpacity onPress={() => onDelete?.(debt.id)}>
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
    color: '#666',
  },
  item: {
    borderWidth: 1,
    borderColor: '#e3e3e3',
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  creditor: {
    fontSize: 16,
    fontWeight: '600',
  },
  delete: {
    color: '#d9534f',
    fontWeight: '600',
  },
  line: {
    color: '#333',
  },
  value: {
    fontWeight: '600',
  },
});

export const DebtList = memo(DebtListComponent);

