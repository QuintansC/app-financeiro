'use client';

import { useState } from 'react';
import { useFinanceData } from '@/hooks/useFinanceData';
import { Section } from '@/components/Section';
import { SavingsForm } from '@/components/SavingsForm';
import { LoadingScreen } from '@/components/LoadingScreen';
import styles from '../page.module.css';

export default function Savings() {
  const {
    data,
    loading,
    refresh,
    saveSavings,
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

  async function handleSaveSavings(payload) {
    try {
      await saveSavings(payload);
      setFeedback('Poupança atualizada');
      setTimeout(() => setFeedback(''), 3000);
    } catch (err) {
      setFeedback(err.message || 'Erro ao atualizar poupança');
    }
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Poupança</h1>

      {feedback && (
        <div className={feedback.includes('Erro') ? styles.error : styles.success}>
          {feedback}
        </div>
      )}

      <Section title="Poupança">
        <SavingsForm savings={data?.savings} onSubmit={handleSaveSavings} />
      </Section>
    </div>
  );
}

