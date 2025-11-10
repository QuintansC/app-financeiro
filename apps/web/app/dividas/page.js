'use client';

import { useState, useMemo, useEffect } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useFinanceData } from '@/hooks/useFinanceData';
import { invalidateCache } from '@/services/cache';
import { createOrUpdateDebt } from '@/services/api';
import { Section } from '@/components/Section';
import { DebtList } from '@/components/DebtList';
import { DebtFilters } from '@/components/DebtFilters';
import { DebtFormModal } from '@/components/DebtFormModal';
import { MarkInstallmentsModal } from '@/components/MarkInstallmentsModal';
import { SpreadsheetUpload } from '@/components/SpreadsheetUpload';
import { LoadingScreen } from '@/components/LoadingScreen';
import styles from '../page.module.css';

function getDebtStatus(debt) {
  if (debt.paidInstallments >= debt.installments) {
    return 'paid';
  }
  if (debt.paidInstallments > 0) {
    return 'in-progress';
  }
  return 'pending';
}

export default function Debts() {
  const {
    data,
    loading,
    refresh,
    saveDebt,
    removeDebt,
    operationLoading,
    savePreferences,
  } = useFinanceData();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDebt, setSelectedDebt] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('status');
  const [viewMode, setViewMode] = useState('list');
  const [markInstallmentsModal, setMarkInstallmentsModal] = useState({ isOpen: false, debt: null });
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const [preferencesLoaded, setPreferencesLoaded] = useState(false);

  // Carregar preferências salvas quando os dados estiverem disponíveis (apenas uma vez)
  useEffect(() => {
    if (data?.preferences && !preferencesLoaded) {
      setStatusFilter(data.preferences.debtsStatusFilter || 'all');
      setSortBy(data.preferences.debtsSortBy || 'status');
      setViewMode(data.preferences.debtsViewMode || 'list');
      setPreferencesLoaded(true);
    }
  }, [data?.preferences, preferencesLoaded]);

  // Salvar preferências quando mudarem (após carregar)
  useEffect(() => {
    if (preferencesLoaded && data?.preferences) {
      const hasChanged = 
        statusFilter !== data.preferences.debtsStatusFilter ||
        sortBy !== data.preferences.debtsSortBy ||
        viewMode !== data.preferences.debtsViewMode;

      if (hasChanged) {
        // Debounce para evitar muitas requisições
        const timeoutId = setTimeout(() => {
          savePreferences({
            debtsStatusFilter: statusFilter,
            debtsSortBy: sortBy,
            debtsViewMode: viewMode,
          }).catch((err) => {
            console.error('Erro ao salvar preferências:', err);
          });
        }, 500);

        return () => clearTimeout(timeoutId);
      }
    }
  }, [statusFilter, sortBy, viewMode, data?.preferences, savePreferences, preferencesLoaded]);

  const filteredAndSortedDebts = useMemo(() => {
    let debts = data?.debts || [];

    // Normalizar dados: garantir que se parcelas pagas = 0, então valor pago = 0
    debts = debts.map(debt => {
      const normalizedDebt = { ...debt };
      if ((normalizedDebt.paidInstallments || 0) === 0) {
        normalizedDebt.paidValue = 0;
      }
      return normalizedDebt;
    });

    // Filtrar por status
    if (statusFilter !== 'all') {
      debts = debts.filter((debt) => getDebtStatus(debt) === statusFilter);
    }

    // Ordenar
    debts = [...debts].sort((a, b) => {
      switch (sortBy) {
        case 'status':
          const statusOrder = { paid: 3, 'in-progress': 2, pending: 1 };
          return statusOrder[getDebtStatus(b)] - statusOrder[getDebtStatus(a)];
        case 'creditor':
          return a.creditor.localeCompare(b.creditor);
        case 'totalValue':
          return b.totalValue - a.totalValue;
        case 'dueDay':
          const dayA = a.dueDay || 999;
          const dayB = b.dueDay || 999;
          return dayA - dayB;
        default:
          return 0;
      }
    });

    return debts;
  }, [data?.debts, statusFilter, sortBy]);

  const showFullScreenLoading = (loading && !data) || operationLoading;

  if (showFullScreenLoading) {
    return (
      <LoadingScreen
        message={operationLoading ? 'Processando...' : 'Carregando dados...'}
      />
    );
  }

  function handleNewDebt() {
    setSelectedDebt(null);
    setIsModalOpen(true);
  }

  async function handleSubmitDebt(payload) {
    try {
      // Normalizar dados: garantir que se parcelas pagas = 0, então valor pago = 0
      const normalizedPayload = { ...payload };
      if ((normalizedPayload.paidInstallments || 0) === 0) {
        normalizedPayload.paidValue = 0;
      }
      
      await saveDebt(normalizedPayload);
      setFeedback('Dívida salva com sucesso!');
      setIsModalOpen(false);
      setSelectedDebt(null);
      setTimeout(() => setFeedback(''), 3000);
    } catch (err) {
      setFeedback(err.message || 'Erro ao salvar dívida');
    }
  }

  async function handleDeleteDebt(id) {
    if (!confirm('Tem certeza que deseja excluir esta dívida?')) {
      return;
    }
    try {
      await removeDebt(id);
      setFeedback('Dívida removida!');
      setTimeout(() => setFeedback(''), 3000);
    } catch (err) {
      setFeedback(err.message || 'Erro ao remover dívida');
    }
  }

  function handleMarkInstallmentsClick(debt) {
    setMarkInstallmentsModal({
      isOpen: true,
      debt,
    });
  }

  async function handleMarkInstallmentsConfirm(updatedDebt) {
    try {
      // Garantir que os valores são números
      const normalizedDebt = {
        id: updatedDebt.id,
        creditor: updatedDebt.creditor,
        totalValue: Number(updatedDebt.totalValue),
        paidValue: Number(updatedDebt.paidValue),
        installments: Number(updatedDebt.installments),
        paidInstallments: Number(updatedDebt.paidInstallments),
        installmentValue: Number(updatedDebt.installmentValue),
        dueDay: updatedDebt.dueDay,
        firstInstallmentValue: updatedDebt.firstInstallmentValue,
        notes: updatedDebt.notes || '',
      };
      
      // Normalizar: se parcelas pagas = 0, então valor pago = 0
      if ((normalizedDebt.paidInstallments || 0) === 0) {
        normalizedDebt.paidValue = 0;
      }
      
      await saveDebt(normalizedDebt);
      const remaining = normalizedDebt.installments - normalizedDebt.paidInstallments;
      if (remaining === 0) {
        setFeedback('Todas as parcelas foram marcadas como pagas!');
      } else {
        setFeedback('Parcela(s) marcada(s) como paga(s)!');
      }
      setTimeout(() => setFeedback(''), 3000);
    } catch (err) {
      setFeedback(err.message || 'Erro ao marcar parcelas');
      throw err;
    }
  }

  function handleEditDebt(debt) {
    setSelectedDebt(debt);
    setIsModalOpen(true);
  }

  function handleCloseModal() {
    setIsModalOpen(false);
    setSelectedDebt(null);
  }

  async function handleSpreadsheetUpload(debts) {
    if (!debts || debts.length === 0) {
      setFeedback('Nenhuma dívida válida para importar');
      return;
    }

    try {
      let successCount = 0;
      let updateCount = 0;
      let createCount = 0;
      let errorCount = 0;
      const errors = [];
      const processedDebts = [];
      const processedCreditors = new Set(); // Para rastrear credores processados

      // Processar cada dívida da planilha
      for (const debt of debts) {
        try {
          let isUpdate = false;
          
          // Se não tem ID, tentar encontrar dívida existente pelo credor
          if (!debt.id) {
            const existingDebt = data?.debts?.find(
              d => d.creditor.toLowerCase().trim() === debt.creditor.toLowerCase().trim()
            );
            if (existingDebt) {
              // Atualizar dívida existente
              debt.id = existingDebt.id;
              isUpdate = true;
              updateCount++;
            } else {
              // Criar nova dívida
              createCount++;
            }
          } else {
            // Verificar se o ID existe
            const existingDebt = data?.debts?.find(d => d.id === debt.id);
            if (existingDebt) {
              isUpdate = true;
              updateCount++;
            } else {
              createCount++;
            }
          }

          // Garantir que o valor da parcela seja calculado corretamente
          if (debt.installments > 0) {
            debt.installmentValue = debt.totalValue / debt.installments;
          }

          // Se parcelas pagas = 0, garantir que valor pago = 0
          if (debt.paidInstallments === 0) {
            debt.paidValue = 0;
          } else if (debt.paidValue === 0 && debt.paidInstallments > 0) {
            // Se não foi informado valor pago mas há parcelas pagas, calcular
            debt.paidValue = debt.paidInstallments * debt.installmentValue;
          }

          // Salvar dívida diretamente sem invalidar cache a cada iteração
          // Vamos fazer batch e invalidar apenas no final
          await createOrUpdateDebt(debt);
          successCount++;
          processedDebts.push({ ...debt, isUpdate });
          processedCreditors.add(debt.creditor.toLowerCase().trim());
        } catch (err) {
          errorCount++;
          const errorMsg = err.message || 'Erro desconhecido';
          errors.push(`${debt.creditor}: ${errorMsg}`);
          console.error(`Erro ao processar dívida ${debt.creditor}:`, err);
        }
      }

      // Limpar cache e forçar refresh completo após importação
      // Isso garante que dados antigos que não estão mais na planilha não apareçam
      // e remove qualquer dado "fantasma" do cache
      invalidateCache();
      await refresh(true);

      // Preparar mensagem de feedback
      if (errorCount === 0) {
        const details = [];
        if (updateCount > 0) details.push(`${updateCount} atualizada(s)`);
        if (createCount > 0) details.push(`${createCount} criada(s)`);
        setFeedback(`${successCount} dívida(s) processada(s) com sucesso! (${details.join(', ')})`);
      } else {
        const details = [];
        if (successCount > 0) {
          if (updateCount > 0) details.push(`${updateCount} atualizada(s)`);
          if (createCount > 0) details.push(`${createCount} criada(s)`);
          const errorDetails = errors.slice(0, 3).join('; ');
          const moreErrors = errors.length > 3 ? ` e mais ${errors.length - 3} erro(s)` : '';
          setFeedback(`${successCount} dívida(s) processada(s) com sucesso (${details.join(', ')}), mas ${errorCount} erro(s) ocorreram: ${errorDetails}${moreErrors}`);
        } else {
          const errorDetails = errors.slice(0, 3).join('; ');
          const moreErrors = errors.length > 3 ? ` e mais ${errors.length - 3} erro(s)` : '';
          setFeedback(`Erro ao processar todas as dívidas: ${errorDetails}${moreErrors}`);
        }
        console.error('Erros durante importação:', errors);
      }
      
      // Limpar feedback após 8 segundos
      setTimeout(() => {
        setFeedback('');
      }, 8000);
    } catch (err) {
      setFeedback(`Erro ao processar planilha: ${err.message}`);
      console.error('Erro ao processar planilha:', err);
      setTimeout(() => {
        setFeedback('');
      }, 5000);
    }
  }

  return (
    <ProtectedRoute>
      <div className={styles.container}>
        <h1 className={styles.header}>Dívidas</h1>

      {feedback && (
        <div className={feedback.includes('Erro') ? styles.error : styles.success}>
          {feedback}
        </div>
      )}

      <Section title="Lista de Dívidas">
        <DebtFilters
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          sortBy={sortBy}
          onSortByChange={setSortBy}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />
        <div className={styles.actionButtons}>
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className={`${styles.addButton} ${styles.uploadButton}`}
          >
            📤 Importar Planilha
          </button>
          <button
            onClick={handleNewDebt}
            className={styles.addButton}
          >
            + Adicionar Dívida
          </button>
        </div>
        <DebtList
          debts={filteredAndSortedDebts}
          onSelect={handleEditDebt}
          onDelete={handleDeleteDebt}
          onMarkAsPaid={handleMarkInstallmentsClick}
          viewMode={viewMode}
        />
      </Section>

      <DebtFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        selectedDebt={selectedDebt}
        onSubmit={handleSubmitDebt}
      />

      <MarkInstallmentsModal
        isOpen={markInstallmentsModal.isOpen}
        onClose={() => {
          if (!operationLoading) {
            setMarkInstallmentsModal({ isOpen: false, debt: null });
          }
        }}
        debt={markInstallmentsModal.debt}
        onConfirm={async (updatedDebt) => {
          await handleMarkInstallmentsConfirm(updatedDebt);
          setMarkInstallmentsModal({ isOpen: false, debt: null });
        }}
      />

      <SpreadsheetUpload
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUpload={handleSpreadsheetUpload}
      />
      </div>
    </ProtectedRoute>
  );
}

