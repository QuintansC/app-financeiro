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
import { SavingsForm } from '../components/SavingsForm';

export function Savings() {
  const {
    data,
    loading,
    refresh,
    saveSavings,
  } = useFinanceData();

  const [feedback, setFeedback] = useState('');

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

      <Section title="Poupança">
        <SavingsForm savings={data?.savings} onSubmit={handleSaveSavings} />
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

