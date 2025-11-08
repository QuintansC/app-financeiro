import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Button,
} from 'react-native';
import { useFinanceData } from './src/hooks/useFinanceData';
import { SummaryCard } from './src/components/SummaryCard';
import { Section } from './src/components/Section';
import { DebtList } from './src/components/DebtList';
import { DebtForm } from './src/components/DebtForm';
import { SalaryForm } from './src/components/SalaryForm';
import { SavingsForm } from './src/components/SavingsForm';
import { MonthsList } from './src/components/MonthsList';

export default function App() {
  const {
    data,
    loading,
    error,
    refresh,
    saveDebt,
    removeDebt,
    saveSalary,
    saveSavings,
    saveMonth,
  } = useFinanceData();

  const [showDebtForm, setShowDebtForm] = useState(false);
  const [selectedDebt, setSelectedDebt] = useState(null);
  const [feedback, setFeedback] = useState('');

  function handleNewDebt() {
    setSelectedDebt(null);
    setShowDebtForm(true);
  }

  async function handleSubmitDebt(payload) {
    try {
      await saveDebt(payload);
      setFeedback('Dívida salva com sucesso!');
      setShowDebtForm(false);
      setSelectedDebt(null);
      setTimeout(() => setFeedback(''), 3000);
    } catch (err) {
      setFeedback(err.message || 'Erro ao salvar dívida');
    }
  }

  async function handleDeleteDebt(id) {
    try {
      await removeDebt(id);
      setFeedback('Dívida removida!');
      setTimeout(() => setFeedback(''), 3000);
    } catch (err) {
      setFeedback(err.message || 'Erro ao remover dívida');
    }
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

  async function handleSaveSavings(payload) {
    try {
      await saveSavings(payload);
      setFeedback('Poupança atualizada');
      setTimeout(() => setFeedback(''), 3000);
    } catch (err) {
      setFeedback(err.message || 'Erro ao atualizar poupança');
    }
  }

  async function handleSaveMonth(payload) {
    try {
      await saveMonth(payload);
      setFeedback('Mês atualizado');
      setTimeout(() => setFeedback(''), 3000);
    } catch (err) {
      setFeedback(err.message || 'Erro ao atualizar mês');
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="light" />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refresh} />
        }
      >
        <Text style={styles.header}>Controle de Gastos</Text>

        {feedback ? <Text style={styles.feedback}>{feedback}</Text> : null}
        {error ? <Text style={styles.error}>{error}</Text> : null}

        {loading && !data ? (
          <View style={styles.loader}>
            <ActivityIndicator size="large" color="#3d63ff" />
            <Text style={styles.loaderText}>Carregando...</Text>
          </View>
        ) : null}

        {data ? (
          <>
            <SummaryCard summary={data.summary} />

            <Section title="Dívidas">
              {!showDebtForm ? (
                <>
                  <DebtList
                    debts={data.debts}
                    onSelect={(debt) => {
                      setSelectedDebt(debt);
                      setShowDebtForm(true);
                    }}
                    onDelete={handleDeleteDebt}
                  />
                  <Button title="Nova dívida" onPress={handleNewDebt} />
                </>
              ) : (
                <DebtForm
                  selectedDebt={selectedDebt}
                  onSubmit={handleSubmitDebt}
                  onCancel={() => {
                    setSelectedDebt(null);
                    setShowDebtForm(false);
                  }}
                />
              )}
            </Section>

            <Section title="Salário e descontos">
              <SalaryForm salary={data.salary} onSubmit={handleSaveSalary} />
            </Section>

            <Section title="Poupança">
              <SavingsForm savings={data.savings} onSubmit={handleSaveSavings} />
            </Section>

            <Section title="Planejamento mensal">
              <MonthsList months={data.months} onSave={handleSaveMonth} />
            </Section>
          </>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#f1f4ff',
  },
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  header: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 16,
  },
  feedback: {
    backgroundColor: '#d1f7d6',
    color: '#1e6b2d',
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
  },
  error: {
    backgroundColor: '#f8d7da',
    color: '#842029',
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
  },
  loader: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loaderText: {
    marginTop: 8,
    color: '#333',
  },
});
