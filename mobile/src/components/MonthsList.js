import { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { formatCurrency } from '../utils/format';
import { Button } from './Button';

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
          <Button title="Editar" variant="outline" size="small" onPress={() => startEdit(month)} />
        </View>
      ))}

      {editing && (
        <View style={styles.form}>
          <Text style={styles.formTitle}>Atualizar {editing.label}</Text>
          <TextInput
            style={styles.input}
            value={amount}
            onChangeText={setAmount}
            placeholder="Ex: 5000,00"
            keyboardType="numeric"
            placeholderTextColor="#9CA3AF"
          />
          <View style={styles.formActions}>
            <Button
              title="Cancelar"
              variant="outline"
              onPress={() => setEditing(null)}
              style={styles.cancelButton}
            />
            <Button
              title="Salvar"
              variant="primary"
              onPress={handleSubmit}
            />
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
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderColor: '#E5E7EB',
  },
  label: {
    fontWeight: '600',
    fontSize: 15,
    color: '#1F2937',
    marginBottom: 4,
  },
  value: {
    color: '#6366F1',
    fontSize: 16,
    fontWeight: '700',
  },
  form: {
    marginTop: 20,
    padding: 18,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    backgroundColor: '#FAFBFC',
  },
  formTitle: {
    fontWeight: '700',
    marginBottom: 12,
    fontSize: 16,
    color: '#1F2937',
  },
  input: {
    borderWidth: 1.5,
    borderColor: '#D1D5DB',
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    fontSize: 15,
    backgroundColor: '#FFFFFF',
    color: '#1F2937',
  },
  formActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  cancelButton: {
    marginRight: 12,
  },
});

