import { useEffect, useState } from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { formatDate } from '../utils/format';

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
        keyboardType="numeric"
      />

      <Text style={styles.label}>Meta atual</Text>
      <TextInput
        style={styles.input}
        value={form.currentGoal}
        onChangeText={(text) => updateField('currentGoal', text)}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Observações</Text>
      <TextInput
        style={[styles.input, styles.textarea]}
        value={form.notes}
        onChangeText={(text) => updateField('notes', text)}
        multiline
      />

      {savings?.lastSavedAt && (
        <Text style={styles.lastSaved}>
          Último registro: {formatDate(savings.lastSavedAt)}
        </Text>
      )}

      <Button title="Salvar poupança" onPress={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontWeight: '600',
    marginBottom: 4,
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#dcdcdc',
    borderRadius: 8,
    padding: 10,
  },
  textarea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  lastSaved: {
    marginTop: 8,
    marginBottom: 12,
    color: '#555',
  },
});

