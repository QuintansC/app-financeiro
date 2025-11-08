import { useState } from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { formatCurrency } from '../utils/format';

export function MonthsList({ months = [], onSave }) {
  const [editing, setEditing] = useState(null);
  const [amount, setAmount] = useState('');

  function startEdit(month) {
    setEditing(month);
    setAmount(String(month.total || ''));
  }

  function handleSubmit() {
    if (!editing) return;
    onSave?.({
      id: editing.id,
      label: editing.label,
      total: Number(amount),
    });
    setEditing(null);
    setAmount('');
  }

  return (
    <View>
      {months.map((month) => (
        <View key={month.id} style={styles.item}>
          <View>
            <Text style={styles.label}>{month.label}</Text>
            <Text style={styles.value}>{formatCurrency(month.total)}</Text>
          </View>
          <Button title="Editar" onPress={() => startEdit(month)} />
        </View>
      ))}

      {editing && (
        <View style={styles.form}>
          <Text style={styles.formTitle}>Atualizar {editing.label}</Text>
          <TextInput
            style={styles.input}
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
          />
          <View style={styles.formActions}>
            <Button title="Cancelar" color="#6c757d" onPress={() => setEditing(null)} />
            <Button title="Salvar" onPress={handleSubmit} />
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: '#efefef',
  },
  label: {
    fontWeight: '600',
  },
  value: {
    color: '#333',
  },
  form: {
    marginTop: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#dcdcdc',
    borderRadius: 10,
  },
  formTitle: {
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#dcdcdc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  formActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

