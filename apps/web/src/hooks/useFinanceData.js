import { useCallback, useEffect, useState } from 'react';
import {
  fetchFinanceData,
  createOrUpdateDebt,
  deleteDebt,
  updateSalary,
  updateSavings,
  updateMonth,
} from '../services/api';

export function useFinanceData() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetchFinanceData();
      setData(response);
    } catch (err) {
      setError(err.message || 'Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const withRefresh = useCallback(
    async (operation) => {
      setLoading(true);
      setError(null);
      try {
        const result = await operation();
        await loadData();
        return result;
      } catch (err) {
        setError(err.message || 'Erro inesperado');
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [loadData],
  );

  return {
    data,
    loading,
    error,
    refresh: loadData,
    saveDebt: (payload) => withRefresh(() => createOrUpdateDebt(payload)),
    removeDebt: (id) => withRefresh(() => deleteDebt(id)),
    saveSalary: (payload) => withRefresh(() => updateSalary(payload)),
    saveSavings: (payload) => withRefresh(() => updateSavings(payload)),
    saveMonth: (payload) => withRefresh(() => updateMonth(payload)),
  };
}

