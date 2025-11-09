import { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Button } from './Button';

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

    // Função auxiliar para converter string para número
    // Suporta tanto ponto quanto vírgula como separador decimal (formato brasileiro)
    const toNumber = (value) => {
      if (value === '' || value === null || value === undefined) return 0;
      
      // Substituir vírgula por ponto para conversão correta
      const normalizedValue = String(value).replace(',', '.');
      const num = Number(normalizedValue);
      return isNaN(num) ? 0 : num;
    };

    onSubmit?.({
      ...form,
      totalValue: toNumber(form.totalValue),
      paidValue: toNumber(form.paidValue),
      installments: toNumber(form.installments),
      paidInstallments: toNumber(form.paidInstallments),
      installmentValue: toNumber(form.installmentValue),
      dueDay: form.dueDay ? Number(form.dueDay) : null,
      firstInstallmentValue: form.firstInstallmentValue
        ? toNumber(form.firstInstallmentValue)
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
        placeholderTextColor="#9CA3AF"
      />

      <Text style={styles.label}>Valor total</Text>
      <TextInput
        style={styles.input}
        value={form.totalValue}
        onChangeText={(text) => updateField('totalValue', text)}
        placeholder="0,00"
        placeholderTextColor="#9CA3AF"
        keyboardType="numeric"
      />

      <Text style={styles.label}>Valor pago</Text>
      <TextInput
        style={styles.input}
        value={form.paidValue}
        onChangeText={(text) => updateField('paidValue', text)}
        placeholder="0,00"
        placeholderTextColor="#9CA3AF"
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
        placeholderTextColor="#9CA3AF"
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
        placeholderTextColor="#9CA3AF"
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
        placeholderTextColor="#9CA3AF"
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
        placeholderTextColor="#9CA3AF"
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
        placeholderTextColor="#9CA3AF"
            keyboardType="numeric"
          />
        </View>
      </View>

      <Text style={styles.label}>Observações</Text>
      <TextInput
        style={[styles.input, styles.textarea]}
        value={form.notes}
        onChangeText={(text) => updateField('notes', text)}
        placeholder="Adicione detalhes sobre esta dívida..."
        placeholderTextColor="#9CA3AF"
        multiline
        numberOfLines={3}
      />

      <View style={styles.actions}>
        {onCancel && (
          <Button
            title="Cancelar"
            variant="outline"
            onPress={onCancel}
            style={styles.cancelButton}
          />
        )}
        <Button
          title="Salvar"
          variant="primary"
          onPress={handleSubmit}
        />
      </View>
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
    marginTop: 24,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  cancelButton: {
    marginRight: 12,
  },
});

