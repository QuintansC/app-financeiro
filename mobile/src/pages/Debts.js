import { useState } from 'react';
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
  Platform,
  Text,
} from 'react-native';
import { useFinanceData } from '../hooks/useFinanceData';
import { Section } from '../components/Section';
import { DebtList } from '../components/DebtList';
import { DebtForm } from '../components/DebtForm';
import { Button } from '../components/Button';

export function Debts() {
  const {
    data,
    loading,
    refresh,
    saveDebt,
    removeDebt,
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

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={() => refresh(true)} />
      }
    >
      {feedback ? (
        <View style={styles.feedbackContainer}>
          <Text style={styles.feedback}>{feedback}</Text>
        </View>
      ) : null}

      <Section title="Dívidas">
        {!showDebtForm ? (
          <>
            <DebtList
              debts={data?.debts || []}
              onSelect={(debt) => {
                setSelectedDebt(debt);
                setShowDebtForm(true);
              }}
              onDelete={handleDeleteDebt}
            />
            <Button
              title="Nova dívida"
              variant="primary"
              onPress={handleNewDebt}
              fullWidth
              style={styles.newButton}
            />
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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
    ...(Platform.OS === 'web' && {
      maxWidth: 1200,
      alignSelf: 'center',
      width: '100%',
    }),
  },
  feedbackContainer: {
    marginBottom: 16,
  },
  feedback: {
    backgroundColor: '#D1FAE5',
    color: '#065F46',
    padding: 14,
    borderRadius: 12,
    fontSize: 14,
    fontWeight: '500',
    borderLeftWidth: 4,
    borderLeftColor: '#10B981',
  },
  newButton: {
    marginTop: 16,
  },
});

