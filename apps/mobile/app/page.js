'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useFinanceData } from '@/hooks/useFinanceData';
import { syncQuickActions, updateQuickActionsOrder, removeQuickAction as removeQuickActionAPI } from '@/services/api';
import { SummaryCard } from '@/components/SummaryCard';
import { DebtsChart } from '@/components/Charts/DebtsChart';
import { CashFlowChart } from '@/components/Charts/CashFlowChart';
import { SavingsProgressChart } from '@/components/Charts/SavingsProgressChart';
import { MonthlyPlanningChart } from '@/components/Charts/MonthlyPlanningChart';
import { LoadingScreen } from '@/components/LoadingScreen';
import { AddQuickActionModal } from '@/components/AddQuickActionModal';
import styles from './page.module.css';

const defaultActions = [
  { label: 'Dívidas', icon: '💳', route: '/dividas' },
  { label: 'Salário', icon: '💰', route: '/salario' },
  { label: 'Poupança', icon: '🏦', route: '/poupanca' },
  { label: 'Planejamento', icon: '📅', route: '/planejamento' },
];

export default function Dashboard() {
  const router = useRouter();
  const { data, loading, error, refresh, operationLoading } = useFinanceData();
  const [customActions, setCustomActions] = useState([]);
  const [removedDefaultActions, setRemovedDefaultActions] = useState([]);
  const [actionsOrder, setActionsOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Carregar configurações do banco de dados
  useEffect(() => {
    if (data?.quickActions) {
      // Separar ações customizadas das padrão
      const custom = data.quickActions.filter(a => !a.isDefault && a.order >= 0);
      const removedDefaults = defaultActions
        .filter(da => !data.quickActions.some(qa => qa.route === da.route && qa.order >= 0))
        .map(da => da.route);
      
      // Extrair ordem das rotas
      const order = data.quickActions
        .filter(a => a.order >= 0)
        .sort((a, b) => a.order - b.order)
        .map(a => a.route);
      
      setCustomActions(custom);
      setRemovedDefaultActions(removedDefaults);
      if (order.length > 0) {
        setActionsOrder(order);
      }
    }
  }, [data?.quickActions]);

  const handleAddAction = async (newAction) => {
    try {
      // Preparar todas as ações para sincronizar
      const currentActions = allActions.filter(a => a.route !== newAction.route);
      const allActionsToSync = [...currentActions, newAction].map((action, index) => ({
        label: action.label,
        icon: action.icon,
        route: action.route,
        order: index,
        isDefault: defaultActions.some(da => da.route === action.route),
      }));
      
      await syncQuickActions(allActionsToSync);
      await refresh(true); // Recarregar dados
    } catch (err) {
      console.error('Erro ao adicionar ação:', err);
    }
  };

  const handleRemoveAction = async (actionToRemove) => {
    try {
      // Remover do banco de dados
      await removeQuickActionAPI(actionToRemove.route);
      
      // Sincronizar ações restantes
      const remainingActions = allActions
        .filter(a => a.route !== actionToRemove.route)
        .map((action, index) => ({
          label: action.label,
          icon: action.icon,
          route: action.route,
          order: index,
          isDefault: defaultActions.some(da => da.route === action.route),
        }));
      
      await syncQuickActions(remainingActions);
      await refresh(true); // Recarregar dados
    } catch (err) {
      console.error('Erro ao remover ação:', err);
    }
  };

  const handleReorder = async (newOrder) => {
    try {
      await updateQuickActionsOrder(newOrder);
      await refresh(true); // Recarregar dados
    } catch (err) {
      console.error('Erro ao reordenar ações:', err);
    }
  };

  // Construir lista final de ações
  const allActions = useMemo(() => {
    if (data?.quickActions && data.quickActions.length > 0) {
      // Usar ações do banco de dados (já ordenadas)
      return data.quickActions
        .filter(a => a.order >= 0) // Filtrar ações ocultas (order = -1)
        .map(a => ({
          label: a.label,
          icon: a.icon,
          route: a.route,
        }));
    }
    
    // Fallback: usar lógica antiga se não houver dados do banco
    const availableDefaults = defaultActions.filter(
      da => !removedDefaultActions.includes(da.route)
    );
    
    const combined = [...availableDefaults, ...customActions];
    
    if (actionsOrder && actionsOrder.length > 0) {
      const ordered = [];
      const combinedMap = new Map(combined.map(a => [a.route, a]));
      
      actionsOrder.forEach(route => {
        if (combinedMap.has(route)) {
          ordered.push(combinedMap.get(route));
          combinedMap.delete(route);
        }
      });
      
      combinedMap.forEach(action => ordered.push(action));
      
      return ordered;
    }
    
    return combined;
  }, [data?.quickActions, defaultActions, customActions, removedDefaultActions, actionsOrder]);

  const showFullScreenLoading = (loading && !data) || operationLoading;

  if (showFullScreenLoading) {
    return (
      <ProtectedRoute>
        <LoadingScreen
          message={operationLoading ? 'Processando...' : 'Carregando dados...'}
        />
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className={styles.container}>
      <h1 className={styles.header}>Dashboard</h1>

      {error && <div className={styles.error}>{error}</div>}

      {data && (
        <>
          <SummaryCard summary={data.summary} />

          <div className={styles.quickActions}>
            <h2 className={styles.quickActionsTitle}>Ações Rápidas</h2>
            <div className={styles.quickActionsGrid}>
              {allActions.map((action, index) => (
                <button
                  key={`${action.route}-${index}`}
                  className={styles.quickActionCard}
                  onClick={() => router.push(action.route)}
                >
                  <span className={styles.quickActionIcon}>{action.icon}</span>
                  <span className={styles.quickActionText}>{action.label}</span>
                </button>
              ))}
              <button
                className={`${styles.quickActionCard} ${styles.addActionCard}`}
                onClick={() => setIsModalOpen(true)}
              >
                <span className={styles.quickActionIcon}>➕</span>
                <span className={styles.quickActionText}>Adicionar</span>
              </button>
            </div>
          </div>

          <AddQuickActionModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onAdd={handleAddAction}
            onRemove={handleRemoveAction}
            onReorder={handleReorder}
            existingActions={allActions}
            defaultActions={defaultActions}
          />

          <h2 className={styles.sectionTitle}>Visualizações</h2>

          <div className={styles.chartsGrid}>
            <div className={styles.chartColumn}>
              <DebtsChart summary={data.summary} />
            </div>
            <div className={styles.chartColumn}>
              <CashFlowChart summary={data.summary} />
            </div>
            <div className={styles.chartColumn}>
              <SavingsProgressChart summary={data.summary} />
            </div>
          </div>

          <MonthlyPlanningChart months={data.months} />
        </>
      )}
      </div>
    </ProtectedRoute>
  );
}

