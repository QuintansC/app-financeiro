'use client';

import { useEffect, useState } from 'react';
import { Button } from './Button';
import styles from './DebtFormModal.module.css';

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

export function DebtFormModal({ isOpen, onClose, selectedDebt, onSubmit }) {
  const [form, setForm] = useState(emptyForm);
  const [isManualEdit, setIsManualEdit] = useState(false);
  const [isManualEditPaidValue, setIsManualEditPaidValue] = useState(false);

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
      setIsManualEdit(false);
      setIsManualEditPaidValue(false);
    } else {
      setForm(emptyForm);
      setIsManualEdit(false);
      setIsManualEditPaidValue(false);
    }
  }, [selectedDebt, isOpen]);

  // Calcular automaticamente o valor da parcela quando totalValue ou installments mudarem
  // IMPORTANTE: O valor da parcela NÃO deve mudar quando parcelas pagas mudam
  // O valor é sempre: totalValue / installments (ou considerando entrada se houver)
  useEffect(() => {
    // Não calcular se o usuário editou manualmente
    if (isManualEdit) return;

    const toNumber = (value) => {
      if (value === '' || value === null || value === undefined) return 0;
      const normalizedValue = String(value).replace(',', '.');
      const num = Number(normalizedValue);
      return isNaN(num) ? 0 : num;
    };

    const totalValue = toNumber(form.totalValue);
    const installments = toNumber(form.installments);
    const hasEntry = form.firstInstallmentValue && toNumber(form.firstInstallmentValue) > 0;

    // Só calcular se ambos os valores estiverem preenchidos e válidos
    if (totalValue > 0 && installments > 0) {
      let calculatedValue = 0;
      
      // O valor da parcela é SEMPRE baseado no total e no número total de parcelas
      // Não depende de quantas parcelas foram pagas
      if (hasEntry) {
        // Se há entrada, as parcelas regulares são: totalValue / (installments - 1)
        // A entrada não conta como parcela regular
        const regularInstallments = installments - 1;
        calculatedValue = totalValue / regularInstallments;
      } else {
        // Se não há entrada, as parcelas são: totalValue / installments
        calculatedValue = totalValue / installments;
      }
      
      // Atualizar apenas se o campo estiver vazio
      if (form.installmentValue === '') {
        setForm((prev) => ({
          ...prev,
          installmentValue: calculatedValue.toFixed(2).replace('.', ','),
        }));
      } else {
        // Se já tem valor, só atualizar se for muito diferente (tolerância de 1%)
        const currentValue = toNumber(form.installmentValue);
        const difference = Math.abs(currentValue - calculatedValue) / (calculatedValue || 1);
        if (difference > 0.01) {
          setForm((prev) => ({
            ...prev,
            installmentValue: calculatedValue.toFixed(2).replace('.', ','),
          }));
        }
      }
    }
  }, [form.totalValue, form.installments, form.firstInstallmentValue, form.installmentValue, isManualEdit]);

  // Calcular automaticamente o valor pago quando paidInstallments ou installmentValue mudarem
  useEffect(() => {
    // Não calcular se o usuário editou manualmente
    if (isManualEditPaidValue) return;

    const toNumber = (value) => {
      if (value === '' || value === null || value === undefined) return 0;
      const normalizedValue = String(value).replace(',', '.');
      const num = Number(normalizedValue);
      return isNaN(num) ? 0 : num;
    };

    const paidInstallments = toNumber(form.paidInstallments);
    const installmentValue = toNumber(form.installmentValue);

    // Só calcular se ambos os valores estiverem preenchidos e válidos
    if (paidInstallments > 0 && installmentValue > 0) {
      const calculatedPaidValue = paidInstallments * installmentValue;
      // Atualizar apenas se o campo estiver vazio
      if (form.paidValue === '') {
        setForm((prev) => ({
          ...prev,
          paidValue: calculatedPaidValue.toFixed(2).replace('.', ','),
        }));
      } else {
        // Se já tem valor, só atualizar se for muito diferente (tolerância de 1%)
        const currentPaidValue = toNumber(form.paidValue);
        const difference = Math.abs(currentPaidValue - calculatedPaidValue) / (calculatedPaidValue || 1);
        if (difference > 0.01) {
          setForm((prev) => ({
            ...prev,
            paidValue: calculatedPaidValue.toFixed(2).replace('.', ','),
          }));
        }
      }
    }
  }, [form.paidInstallments, form.installmentValue, form.paidValue, isManualEditPaidValue]);

  if (!isOpen) return null;

  function updateField(name, value) {
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.creditor || !form.totalValue) {
      return;
    }

    const toNumber = (value) => {
      if (value === '' || value === null || value === undefined) return 0;
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
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>
            {selectedDebt ? 'Editar Dívida' : 'Nova Dívida'}
          </h2>
          <button className={styles.closeButton} onClick={onClose} aria-label="Fechar">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label}>Credor</label>
            <input
              className={styles.input}
              type="text"
              value={form.creditor}
              onChange={(e) => updateField('creditor', e.target.value)}
              placeholder="Ex: Itaú"
              required
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Valor total</label>
            <input
              className={styles.input}
              type="text"
              value={form.totalValue}
              onChange={(e) => updateField('totalValue', e.target.value)}
              placeholder="0,00"
              inputMode="numeric"
              required
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>
              Valor pago
              <span className={styles.hint}>(Calculado automaticamente: Parcelas Pagas × Valor da Parcela)</span>
            </label>
            <input
              className={styles.input}
              type="text"
              value={form.paidValue}
              onChange={(e) => {
                setIsManualEditPaidValue(true);
                updateField('paidValue', e.target.value);
              }}
              onBlur={() => {
                // Resetar flag quando sair do campo para permitir recálculo
                setIsManualEditPaidValue(false);
              }}
              placeholder="0,00"
              inputMode="numeric"
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>
              Total restante
              <span className={styles.hint}>(Calculado automaticamente: Total - Valor Pago)</span>
            </label>
            <input
              className={`${styles.input} ${styles.readonly}`}
              type="text"
              value={(() => {
                const toNumber = (value) => {
                  if (value === '' || value === null || value === undefined) return 0;
                  const normalizedValue = String(value).replace(',', '.');
                  const num = Number(normalizedValue);
                  return isNaN(num) ? 0 : num;
                };
                const totalValue = toNumber(form.totalValue);
                const paidValue = toNumber(form.paidValue);
                const remaining = Math.max(0, totalValue - paidValue);
                return remaining > 0 ? remaining.toFixed(2).replace('.', ',') : '0,00';
              })()}
              readOnly
              placeholder="0,00"
            />
          </div>

          <div className={styles.row}>
            <div className={styles.half}>
              <label className={styles.label}>Parcelas</label>
              <input
                className={styles.input}
                type="text"
                value={form.installments}
                onChange={(e) => updateField('installments', e.target.value)}
                placeholder="0"
                inputMode="numeric"
              />
            </div>
            <div className={styles.half}>
              <label className={styles.label}>Parcelas pagas</label>
              <input
                className={styles.input}
                type="text"
                value={form.paidInstallments}
                onChange={(e) => updateField('paidInstallments', e.target.value)}
                placeholder="0"
                inputMode="numeric"
              />
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>
              Valor da parcela
              <span className={styles.hint}>(Calculado automaticamente: Total ÷ Parcelas)</span>
            </label>
            <input
              className={styles.input}
              type="text"
              value={form.installmentValue}
              onChange={(e) => {
                setIsManualEdit(true);
                updateField('installmentValue', e.target.value);
              }}
              onBlur={() => {
                // Resetar flag quando sair do campo para permitir recálculo
                setIsManualEdit(false);
              }}
              placeholder="0,00"
              inputMode="numeric"
            />
          </div>

          <div className={styles.row}>
            <div className={styles.half}>
              <label className={styles.label}>Dia vencimento</label>
              <input
                className={styles.input}
                type="text"
                value={form.dueDay}
                onChange={(e) => updateField('dueDay', e.target.value)}
                placeholder="0"
                inputMode="numeric"
              />
            </div>
            <div className={styles.half}>
              <label className={styles.label}>1ª parcela</label>
              <input
                className={styles.input}
                type="text"
                value={form.firstInstallmentValue}
                onChange={(e) => updateField('firstInstallmentValue', e.target.value)}
                placeholder="0,00"
                inputMode="numeric"
              />
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Observações</label>
            <textarea
              className={`${styles.input} ${styles.textarea}`}
              value={form.notes}
              onChange={(e) => updateField('notes', e.target.value)}
              placeholder="Adicione detalhes sobre esta dívida..."
              rows={3}
            />
          </div>

          <div className={styles.actions}>
            <Button
              type="button"
              title="Cancelar"
              variant="outline"
              onClick={onClose}
              className={styles.cancelButton}
            />
            <Button
              type="submit"
              title="Salvar"
              variant="primary"
            />
          </div>
        </form>
      </div>
    </div>
  );
}

