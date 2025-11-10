import { useEffect, useState } from 'react';
import { Button, StyleSheet, Switch, Text, TextInput, View } from 'react-native';

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
        keyboardType="numeric"
      />

      <Text style={styles.label}>Descontos</Text>
      <TextInput
        style={styles.input}
        value={form.discounts}
        onChangeText={(text) => updateField('discounts', text)}
        keyboardType="numeric"
      />

      <View style={styles.switchRow}>
        <Text>Possui 13º salário</Text>
        <Switch
          value={form.thirteenth}
          onValueChange={(value) => updateField('thirteenth', value)}
        />
      </View>

      <View style={styles.switchRow}>
        <Text>Possui férias</Text>
        <Switch
          value={form.vacation}
          onValueChange={(value) => updateField('vacation', value)}
        />
      </View>

      <Button title="Salvar salário" onPress={handleSubmit} />
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
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 8,
  },
});

