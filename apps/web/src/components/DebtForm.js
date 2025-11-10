import { useEffect, useState } from 'react';
import {
  Button,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

const emptyForm = {
  id: undefined,
  creditor: '',
  totalValue: '',
  paidValue: '',
  installments: '',
  paidInstallments: '',
  installmentValue: '',
  dueDay: '',
  firstInstallmentValue: '',
  notes: '',
};

export function DebtForm({ selectedDebt, onSubmit, onCancel }) {
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (selectedDebt) {
      setForm({
        id: selectedDebt.id,
        creditor: selectedDebt.creditor || '',
        totalValue: String(selectedDebt.totalValue || ''),
        paidValue: String(selectedDebt.paidValue || ''),
        installments: String(selectedDebt.installments || ''),
        paidInstallments: String(selectedDebt.paidInstallments || ''),
        installmentValue: String(selectedDebt.installmentValue || ''),
        dueDay: selectedDebt.dueDay != null ? String(selectedDebt.dueDay) : '',
        firstInstallmentValue: selectedDebt.firstInstallmentValue != null
          ? String(selectedDebt.firstInstallmentValue)
          : '',
        notes: selectedDebt.notes || '',
      });
    } else {
      setForm(emptyForm);
    }
  }, [selectedDebt]);

  function updateField(name, value) {
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit() {
    if (!form.creditor || !form.totalValue) {
      return;
    }

    onSubmit?.({
      ...form,
      totalValue: Number(form.totalValue),
      paidValue: Number(form.paidValue),
      installments: Number(form.installments),
      paidInstallments: Number(form.paidInstallments),
      installmentValue: Number(form.installmentValue),
      dueDay: form.dueDay ? Number(form.dueDay) : null,
      firstInstallmentValue: form.firstInstallmentValue
        ? Number(form.firstInstallmentValue)
        : null,
    });
  }

  return (
    <View>
      <Text style={styles.label}>Credor</Text>
      <TextInput
        style={styles.input}
        value={form.creditor}
        onChangeText={(text) => updateField('creditor', text)}
        placeholder="Ex: Itaú"
      />

      <Text style={styles.label}>Valor total</Text>
      <TextInput
        style={styles.input}
        value={form.totalValue}
        onChangeText={(text) => updateField('totalValue', text)}
        placeholder="0,00"
        keyboardType="numeric"
      />

      <Text style={styles.label}>Valor pago</Text>
      <TextInput
        style={styles.input}
        value={form.paidValue}
        onChangeText={(text) => updateField('paidValue', text)}
        placeholder="0,00"
        keyboardType="numeric"
      />

      <View style={styles.row}>
        <View style={styles.half}>
          <Text style={styles.label}>Parcelas</Text>
          <TextInput
            style={[styles.input, styles.rowInput]}
            value={form.installments}
            onChangeText={(text) => updateField('installments', text)}
            placeholder="0"
            keyboardType="numeric"
          />
        </View>
        <View style={styles.half}>
          <Text style={styles.label}>Parcelas pagas</Text>
          <TextInput
            style={styles.input}
            value={form.paidInstallments}
            onChangeText={(text) => updateField('paidInstallments', text)}
            placeholder="0"
            keyboardType="numeric"
          />
        </View>
      </View>

      <Text style={styles.label}>Valor da parcela</Text>
      <TextInput
        style={styles.input}
        value={form.installmentValue}
        onChangeText={(text) => updateField('installmentValue', text)}
        placeholder="0,00"
        keyboardType="numeric"
      />

      <View style={styles.row}>
        <View style={styles.half}>
          <Text style={styles.label}>Dia vencimento</Text>
          <TextInput
            style={[styles.input, styles.rowInput]}
            value={form.dueDay}
            onChangeText={(text) => updateField('dueDay', text)}
            placeholder="0"
            keyboardType="numeric"
          />
        </View>
        <View style={styles.half}>
          <Text style={styles.label}>1ª parcela</Text>
          <TextInput
            style={styles.input}
            value={form.firstInstallmentValue}
            onChangeText={(text) => updateField('firstInstallmentValue', text)}
            placeholder="0,00"
            keyboardType="numeric"
          />
        </View>
      </View>

      <Text style={styles.label}>Observações</Text>
      <TextInput
        style={[styles.input, styles.textarea]}
        value={form.notes}
        onChangeText={(text) => updateField('notes', text)}
        placeholder="Detalhes adicionais"
        multiline
        numberOfLines={3}
      />

      <View style={styles.actions}>
        {onCancel && (
          <Button title="Cancelar" color="#6c757d" onPress={onCancel} />
        )}
        <Button title="Salvar" onPress={handleSubmit} />
      </View>
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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  half: {
    flex: 1,
  },
  rowInput: {
    marginRight: 12,
  },
  actions: {
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

