import { StatusBar } from 'expo-status-bar';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useFinanceData } from '../hooks/useFinanceData';
import { SummaryCard } from '../components/SummaryCard';
import { DebtsChart } from '../components/Charts/DebtsChart';
import { CashFlowChart } from '../components/Charts/CashFlowChart';
import { SavingsProgressChart } from '../components/Charts/SavingsProgressChart';
import { MonthlyPlanningChart } from '../components/Charts/MonthlyPlanningChart';

export function Dashboard() {
  const navigation = useNavigation();
  const { data, loading, error, refresh } = useFinanceData();

  return (
    <>
      <StatusBar style="light" />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={() => refresh(true)} />
        }
      >
        <Text style={styles.header}>Dashboard</Text>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        {loading && !data ? (
          <View style={styles.loader}>
            <ActivityIndicator size="large" color="#6366F1" />
            <Text style={styles.loaderText}>Carregando...</Text>
          </View>
        ) : null}

        {data ? (
          <>
            <SummaryCard summary={data.summary} />
            
            <View style={styles.quickActions}>
              <Text style={styles.quickActionsTitle}>Ações Rápidas</Text>
              <View style={styles.quickActionsGrid}>
                <TouchableOpacity
                  style={styles.quickActionCard}
                  onPress={() => navigation.navigate('Debts')}
                  activeOpacity={0.7}
                >
                  <Text style={styles.quickActionIcon}>💳</Text>
                  <Text style={styles.quickActionText}>Dívidas</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.quickActionCard}
                  onPress={() => navigation.navigate('Salary')}
                  activeOpacity={0.7}
                >
                  <Text style={styles.quickActionIcon}>💰</Text>
                  <Text style={styles.quickActionText}>Salário</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.quickActionCard}
                  onPress={() => navigation.navigate('Savings')}
                  activeOpacity={0.7}
                >
                  <Text style={styles.quickActionIcon}>🏦</Text>
                  <Text style={styles.quickActionText}>Poupança</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.quickActionCard}
                  onPress={() => navigation.navigate('Planning')}
                  activeOpacity={0.7}
                >
                  <Text style={styles.quickActionIcon}>📅</Text>
                  <Text style={styles.quickActionText}>Planejamento</Text>
                </TouchableOpacity>
              </View>
            </View>
            
            <Text style={styles.sectionTitle}>Visualizações</Text>
            
            {Platform.OS === 'web' ? (
              <View style={styles.chartsGrid}>
                <View style={styles.chartColumn}>
                  <DebtsChart summary={data.summary} />
                </View>
                <View style={styles.chartColumn}>
                  <CashFlowChart summary={data.summary} />
                </View>
                <View style={styles.chartColumn}>
                  <SavingsProgressChart summary={data.summary} />
                </View>
              </View>
            ) : (
              <>
                <DebtsChart summary={data.summary} />
                <CashFlowChart summary={data.summary} />
                <SavingsProgressChart summary={data.summary} />
              </>
            )}
            
            <MonthlyPlanningChart months={data.months} />
          </>
        ) : null}
      </ScrollView>
    </>
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
  header: {
    fontSize: 32,
    fontWeight: '800',
    marginBottom: 24,
    color: '#1F2937',
    letterSpacing: -0.5,
  },
  error: {
    backgroundColor: '#FEE2E2',
    color: '#991B1B',
    padding: 14,
    borderRadius: 12,
    marginBottom: 16,
    fontSize: 14,
    fontWeight: '500',
    borderLeftWidth: 4,
    borderLeftColor: '#EF4444',
  },
  loader: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loaderText: {
    marginTop: 12,
    color: '#6B7280',
    fontSize: 14,
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 20,
    marginTop: 8,
  },
  chartsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -10,
    alignItems: 'flex-start',
    ...(Platform.OS !== 'web' && {
      flexDirection: 'column',
      marginHorizontal: 0,
    }),
  },
  chartColumn: {
    paddingHorizontal: 10,
    marginBottom: 20,
    ...(Platform.OS === 'web' && {
      flex: 1,
      minWidth: 350,
      maxWidth: '33.333%',
    }),
    ...(Platform.OS !== 'web' && {
      width: '100%',
      paddingHorizontal: 0,
    }),
  },
  quickActions: {
    marginTop: 0,
    marginBottom: 32,
  },
  quickActionsTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
  },
  quickActionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: Platform.OS === 'web' ? 150 : '45%',
    flex: Platform.OS === 'web' ? 0 : 1,
    margin: 6,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  quickActionIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
});

