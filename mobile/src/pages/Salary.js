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
import { SalaryForm } from '../components/SalaryForm';

export function Salary() {
  const {
    data,
    loading,
    refresh,
    saveSalary,
  } = useFinanceData();

  const [feedback, setFeedback] = useState('');

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

      <Section title="Salário e descontos">
        <SalaryForm salary={data?.salary} onSubmit={handleSaveSalary} />
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
});

