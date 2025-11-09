import React from 'react';
import { Platform, Text, View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Dashboard } from '../pages/Dashboard';
import { Debts } from '../pages/Debts';
import { Salary } from '../pages/Salary';
import { Savings } from '../pages/Savings';
import { Planning } from '../pages/Planning';
import { useFinanceData } from '../hooks/useFinanceData';
import { LoadingScreen } from '../components/LoadingScreen';

const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

// Navegação para Mobile (Tabs)
function MobileNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#6366F1',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E5E7EB',
          height: Platform.OS === 'ios' ? 88 : 64,
          paddingBottom: Platform.OS === 'ios' ? 28 : 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={Dashboard}
        options={{
          tabBarLabel: 'Dashboard',
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 20 }}>📊</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Debts"
        component={Debts}
        options={{
          tabBarLabel: 'Dívidas',
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 20 }}>💳</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Salary"
        component={Salary}
        options={{
          tabBarLabel: 'Salário',
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 20 }}>💰</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Savings"
        component={Savings}
        options={{
          tabBarLabel: 'Poupança',
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 20 }}>🏦</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Planning"
        component={Planning}
        options={{
          tabBarLabel: 'Planejamento',
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 20 }}>📅</Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

// Navegação para Web (Drawer ou Top Nav)
function WebNavigator() {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: '#6366F1',
        },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: {
          fontWeight: '700',
          fontSize: 20,
        },
        drawerStyle: {
          backgroundColor: '#FFFFFF',
          width: 280,
        },
        drawerActiveTintColor: '#6366F1',
        drawerInactiveTintColor: '#6B7280',
        drawerLabelStyle: {
          fontSize: 16,
          fontWeight: '600',
          marginLeft: -16,
        },
        drawerItemStyle: {
          marginVertical: 4,
          borderRadius: 8,
          marginHorizontal: 12,
        },
      }}
    >
      <Drawer.Screen
        name="Dashboard"
        component={Dashboard}
        options={{
          drawerLabel: 'Dashboard',
          title: 'Dashboard',
          drawerIcon: () => <Text style={{ fontSize: 24 }}>📊</Text>,
        }}
      />
      <Drawer.Screen
        name="Debts"
        component={Debts}
        options={{
          drawerLabel: 'Dívidas',
          title: 'Dívidas',
          drawerIcon: () => <Text style={{ fontSize: 24 }}>💳</Text>,
        }}
      />
      <Drawer.Screen
        name="Salary"
        component={Salary}
        options={{
          drawerLabel: 'Salário',
          title: 'Salário e Descontos',
          drawerIcon: () => <Text style={{ fontSize: 24 }}>💰</Text>,
        }}
      />
      <Drawer.Screen
        name="Savings"
        component={Savings}
        options={{
          drawerLabel: 'Poupança',
          title: 'Poupança',
          drawerIcon: () => <Text style={{ fontSize: 24 }}>🏦</Text>,
        }}
      />
      <Drawer.Screen
        name="Planning"
        component={Planning}
        options={{
          drawerLabel: 'Planejamento',
          title: 'Planejamento Mensal',
          drawerIcon: () => <Text style={{ fontSize: 24 }}>📅</Text>,
        }}
      />
    </Drawer.Navigator>
  );
}

export function AppNavigator() {
  const isWeb = Platform.OS === 'web';
  const { loading, operationLoading, data } = useFinanceData();

  // Mostrar loading fullscreen no carregamento inicial ou durante operações
  const showFullScreenLoading = (loading && !data) || operationLoading;

  return (
    <NavigationContainer>
      <View style={styles.container}>
        {isWeb ? <WebNavigator /> : <MobileNavigator />}
        {showFullScreenLoading && (
          <View style={styles.loadingOverlay}>
            <LoadingScreen 
              message={operationLoading ? "Processando..." : "Carregando dados..."} 
            />
          </View>
        )}
      </View>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(248, 249, 250, 0.95)',
    zIndex: 9999,
    elevation: 9999,
  },
});

