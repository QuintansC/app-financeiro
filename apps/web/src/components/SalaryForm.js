'use client';

import { useEffect, useState } from 'react';
import { Button } from './Button';
import styles from './SalaryForm.module.css';

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
    <div>
      <label className={styles.label}>Salário mensal</label>
      <input
        className={styles.input}
        type="text"
        value={form.monthlyIncome}
        onChange={(e) => updateField('monthlyIncome', e.target.value)}
        placeholder="Ex: 5000,00"
        inputMode="numeric"
      />

      <label className={styles.label}>Descontos</label>
      <input
        className={styles.input}
        type="text"
        value={form.discounts}
        onChange={(e) => updateField('discounts', e.target.value)}
        placeholder="Ex: 500,00"
        inputMode="numeric"
      />

      <div className={styles.switchRow}>
        <div>
          <span className={styles.switchLabel}>Possui 13º salário</span>
          <p className={styles.switchDescription}>Recebe décimo terceiro salário</p>
        </div>
        <label className={styles.switch}>
          <input
            type="checkbox"
            checked={form.thirteenth}
            onChange={(e) => updateField('thirteenth', e.target.checked)}
          />
          <span className={styles.slider}></span>
        </label>
      </div>

      <div className={styles.switchRow}>
        <div>
          <span className={styles.switchLabel}>Possui férias</span>
          <p className={styles.switchDescription}>Recebe férias remuneradas</p>
        </div>
        <label className={styles.switch}>
          <input
            type="checkbox"
            checked={form.vacation}
            onChange={(e) => updateField('vacation', e.target.checked)}
          />
          <span className={styles.slider}></span>
        </label>
      </div>

      <Button
        title="Salvar salário"
        variant="primary"
        onClick={handleSubmit}
        fullWidth
        className={styles.submitButton}
      />
    </div>
  );
}
