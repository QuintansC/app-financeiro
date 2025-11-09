import { useEffect, useState } from 'react';
import { StyleSheet, Switch, Text, TextInput, View } from 'react-native';
import { Button } from './Button';

const emptyForm = {
  monthlyIncome: '',
  discounts: '',
  thirteenth: true,
  vacation: true,
};

export function SalaryForm({ salary, onSubmit }) {
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (salary) {
      setForm({
        monthlyIncome: String(salary.monthlyIncome || ''),
        discounts: String(salary.discounts || ''),
        thirteenth: Boolean(salary.thirteenth),
        vacation: Boolean(salary.vacation),
      });
    }
  }, [salary]);

  function updateField(name, value) {
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit() {
    if (!form.monthlyIncome) return;

    onSubmit?.({
      monthlyIncome: Number(form.monthlyIncome),
      discounts: Number(form.discounts) || 0,
      thirteenth: form.thirteenth,
      vacation: form.vacation,
    });
  }

  return (
    <View>
      <Text style={styles.label}>Salário mensal</Text>
      <TextInput
        style={styles.input}
        value={form.monthlyIncome}
        onChangeText={(text) => updateField('monthlyIncome', text)}
        placeholder="Ex: 5000,00"
        keyboardType="numeric"
        placeholderTextColor="#9CA3AF"
      />

      <Text style={styles.label}>Descontos</Text>
      <TextInput
        style={styles.input}
        value={form.discounts}
        onChangeText={(text) => updateField('discounts', text)}
        placeholder="Ex: 500,00"
        keyboardType="numeric"
        placeholderTextColor="#9CA3AF"
      />

      <View style={styles.switchRow}>
        <View>
          <Text style={styles.switchLabel}>Possui 13º salário</Text>
          <Text style={styles.switchDescription}>Recebe décimo terceiro salário</Text>
        </View>
        <Switch
          value={form.thirteenth}
          onValueChange={(value) => updateField('thirteenth', value)}
          trackColor={{ false: '#D1D5DB', true: '#6366F1' }}
          thumbColor={form.thirteenth ? '#FFFFFF' : '#F3F4F6'}
        />
      </View>

      <View style={styles.switchRow}>
        <View>
          <Text style={styles.switchLabel}>Possui férias</Text>
          <Text style={styles.switchDescription}>Recebe férias remuneradas</Text>
        </View>
        <Switch
          value={form.vacation}
          onValueChange={(value) => updateField('vacation', value)}
          trackColor={{ false: '#D1D5DB', true: '#6366F1' }}
          thumbColor={form.vacation ? '#FFFFFF' : '#F3F4F6'}
        />
      </View>

      <Button title="Salvar salário" variant="primary" onPress={handleSubmit} fullWidth style={styles.submitButton} />
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
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 12,
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderRadius: 10,
    backgroundColor: '#FAFBFC',
  },
  switchLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  switchDescription: {
    fontSize: 12,
    color: '#6B7280',
  },
  submitButton: {
    marginTop: 8,
  },
});

