'use client';

import { useState } from 'react';
import { useFinanceData } from '@/hooks/useFinanceData';
import { Section } from '@/components/Section';
import { SalaryForm } from '@/components/SalaryForm';
import { LoadingScreen } from '@/components/LoadingScreen';
import styles from '../page.module.css';

export default function Salary() {
  const {
    data,
    loading,
    refresh,
    saveSalary,
    operationLoading,
  } = useFinanceData();

  const [feedback, setFeedback] = useState('');

  const showFullScreenLoading = (loading && !data) || operationLoading;

  if (showFullScreenLoading) {
    return (
      <LoadingScreen
        message={operationLoading ? 'Processando...' : 'Carregando dados...'}
      />
    );
  }

  async function handleSaveSalary(payload) {
    try {
      await saveSalary(payload);
      setFeedback('Salário atualizado');
      setTimeout(() => setFeedback(''), 3000);
    } catch (err) {
      setFeedback(err.message || 'Erro ao atualizar salário');
    }
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Salário e Descontos</h1>

      {feedback && (
        <div className={feedback.includes('Erro') ? styles.error : styles.success}>
          {feedback}
        </div>
      )}

      <Section title="Salário e descontos">
        <SalaryForm salary={data?.salary} onSubmit={handleSaveSalary} />
      </Section>
    </div>
  );
}

