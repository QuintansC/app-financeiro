import { useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { formatDate } from '../utils/format';
import { Button } from './Button';

const emptyForm = {
  savedBalance: '',
  currentGoal: '',
  notes: '',
};

export function SavingsForm({ savings, onSubmit }) {
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (savings) {
      setForm({
        savedBalance: String(savings.savedBalance || ''),
        currentGoal: String(savings.currentGoal || ''),
        notes: savings.notes || '',
      });
    }
  }, [savings]);

  function updateField(name, value) {
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit() {
    onSubmit?.({
      savedBalance: Number(form.savedBalance),
      currentGoal: Number(form.currentGoal),
      notes: form.notes,
    });
  }

  return (
    <View>
      <Text style={styles.label}>Saldo guardado</Text>
      <TextInput
        style={styles.input}
        value={form.savedBalance}
        onChangeText={(text) => updateField('savedBalance', text)}
        placeholder="Ex: 10000,00"
        keyboardType="numeric"
        placeholderTextColor="#9CA3AF"
      />

      <Text style={styles.label}>Meta atual</Text>
      <TextInput
        style={styles.input}
        value={form.currentGoal}
        onChangeText={(text) => updateField('currentGoal', text)}
        placeholder="Ex: 50000,00"
        keyboardType="numeric"
        placeholderTextColor="#9CA3AF"
      />

      <Text style={styles.label}>Observações</Text>
      <TextInput
        style={[styles.input, styles.textarea]}
        value={form.notes}
        onChangeText={(text) => updateField('notes', text)}
        placeholder="Adicione observações sobre sua poupança..."
        multiline
        placeholderTextColor="#9CA3AF"
      />

      {savings?.lastSavedAt && (
        <Text style={styles.lastSaved}>
          Último registro: {formatDate(savings.lastSavedAt)}
        </Text>
      )}

      <Button title="Salvar poupança" variant="primary" onPress={handleSubmit} fullWidth style={styles.submitButton} />
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 16,
    color: '#374151',
    fontSize: 14,
  },
  input: {
    borderWidth: 1.5,
    borderColor: '#D1D5DB',
    borderRadius: 10,
    padding: 12,
    fontSize: 15,
    backgroundColor: '#FFFFFF',
    color: '#1F2937',
  },
  textarea: {
    minHeight: 90,
    textAlignVertical: 'top',
  },
  lastSaved: {
    marginTop: 12,
    marginBottom: 16,
    color: '#6B7280',
    fontSize: 13,
    fontStyle: 'italic',
  },
  submitButton: {
    marginTop: 8,
  },
});

