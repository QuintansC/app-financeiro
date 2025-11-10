'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  fetchFinanceData,
  createOrUpdateDebt,
  deleteDebt,
  updateSalary,
  updateSavings,
  updateMonth,
  updateUserPreferences,
  updateUser,
} from '../services/api';
import {
  getCachedData,
  setCachedData,
  invalidateCache,
} from '../services/cache';

export function useFinanceData() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [operationLoading, setOperationLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadData = useCallback(async (forceRefresh = false) => {
    try {
      setLoading(true);
      setError(null);
      
      // Tenta usar cache primeiro (se não for refresh forçado)
      if (!forceRefresh) {
        const cachedData = getCachedData();
        if (cachedData) {
          setData(cachedData);
          setLoading(false);
          
          // Atualiza em background sem bloquear a UI
          try {
            const response = await fetchFinanceData();
            setCachedData(response);
            setData(response);
          } catch (err) {
            // Se falhar, mantém os dados do cache
            console.warn('Erro ao atualizar cache em background:', err);
          }
          return;
        }
      }
      
      // Se não há cache válido ou é refresh forçado, busca do servidor
      const response = await fetchFinanceData();
      setCachedData(response);
      setData(response);
    } catch (err) {
      // Se falhar e houver cache, usa o cache como fallback
      const cachedData = getCachedData();
      if (cachedData) {
        setData(cachedData);
        setError('Erro ao atualizar dados. Mostrando dados em cache.');
      } else {
        setError(err.message || 'Erro ao carregar dados');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Tenta carregar do cache primeiro para mostrar dados imediatamente
    const cachedData = getCachedData();
    if (cachedData) {
      setData(cachedData);
    }
    
    // Depois carrega dados atualizados
    loadData();
  }, [loadData]);

  const withRefresh = useCallback(
    async (operation) => {
      setOperationLoading(true);
      setError(null);
      try {
        const result = await operation();
        // Invalida cache e recarrega dados após operação
        invalidateCache();
        await loadData(true); // Força refresh após operação
        return result;
      } catch (err) {
        setError(err.message || 'Erro inesperado');
        throw err;
      } finally {
        setOperationLoading(false);
      }
    },
    [loadData],
  );

  const savePreferences = useCallback(
    async (payload) => {
      try {
        await updateUserPreferences(payload);
        // Atualiza apenas as preferências no estado, sem refresh completo
        setData((prev) => ({
          ...prev,
          preferences: payload,
        }));
      } catch (err) {
        setError(err.message || 'Erro ao salvar preferências');
        throw err;
      }
    },
    []
  );

  return {
    data,
    loading,
    operationLoading,
    error,
    refresh: (force = false) => loadData(force),
    saveDebt: (payload) => withRefresh(() => createOrUpdateDebt(payload)),
    removeDebt: (id) => withRefresh(() => deleteDebt(id)),
    saveSalary: (payload) => withRefresh(() => updateSalary(payload)),
    saveSavings: (payload) => withRefresh(() => updateSavings(payload)),
    saveMonth: (payload) => withRefresh(() => updateMonth(payload)),
    savePreferences,
    saveUser: (payload) => withRefresh(() => updateUser(payload)),
  };
}
