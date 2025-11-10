'use client';

import { useState } from 'react';
import { useFinanceData } from '@/hooks/useFinanceData';
import { Section } from '@/components/Section';
import { Calendar } from '@/components/Calendar';
import { MonthEditModal } from '@/components/MonthEditModal';
import { LoadingScreen } from '@/components/LoadingScreen';
import styles from '../page.module.css';

export default function Planning() {
  const {
    data,
    loading,
    refresh,
    saveMonth,
    operationLoading,
  } = useFinanceData();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [feedback, setFeedback] = useState('');

  const showFullScreenLoading = (loading && !data) || operationLoading;

  if (showFullScreenLoading) {
    return (
      <LoadingScreen
        message={operationLoading ? 'Processando...' : 'Carregando dados...'}
      />
    );
  }

  function handleEditMonth(month) {
    setSelectedMonth(month);
    setIsModalOpen(true);
  }

  async function handleSaveMonth(payload) {
    try {
      await saveMonth(payload);
      setFeedback('Mês atualizado');
      setIsModalOpen(false);
      setSelectedMonth(null);
      setTimeout(() => setFeedback(''), 3000);
    } catch (err) {
      setFeedback(err.message || 'Erro ao atualizar mês');
    }
  }

  function handleCloseModal() {
    setIsModalOpen(false);
    setSelectedMonth(null);
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Planejamento Mensal</h1>

      {feedback && (
        <div className={feedback.includes('Erro') ? styles.error : styles.success}>
          {feedback}
        </div>
      )}

      <Section title="Calendário de Planejamento">
        <Calendar months={data?.months || []} onMonthClick={handleEditMonth} />
      </Section>

      <MonthEditModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        month={selectedMonth}
        onSubmit={handleSaveMonth}
      />
    </div>
  );
}

