'use client';

import { useEffect, useState } from 'react';
import { formatDate } from '../utils/format';
import { Button } from './Button';
import styles from './SavingsForm.module.css';

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
    <div>
      <label className={styles.label}>Saldo guardado</label>
      <input
        className={styles.input}
        type="text"
        value={form.savedBalance}
        onChange={(e) => updateField('savedBalance', e.target.value)}
        placeholder="Ex: 10000,00"
        inputMode="numeric"
      />

      <label className={styles.label}>Meta atual</label>
      <input
        className={styles.input}
        type="text"
        value={form.currentGoal}
        onChange={(e) => updateField('currentGoal', e.target.value)}
        placeholder="Ex: 50000,00"
        inputMode="numeric"
      />

      <label className={styles.label}>Observações</label>
      <textarea
        className={`${styles.input} ${styles.textarea}`}
        value={form.notes}
        onChange={(e) => updateField('notes', e.target.value)}
        placeholder="Adicione observações sobre sua poupança..."
        rows={4}
      />

      {savings?.lastSavedAt && (
        <p className={styles.lastSaved}>
          Último registro: {formatDate(savings.lastSavedAt)}
        </p>
      )}

      <Button
        title="Salvar poupança"
        variant="primary"
        onClick={handleSubmit}
        fullWidth
        className={styles.submitButton}
      />
    </div>
  );
}
