'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import * as authApi from '@/services/authApi';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const verifyToken = async (tokenToVerify) => {
    try {
      const userData = await authApi.verifyToken(tokenToVerify);
      
      // Verificar se userData existe e tem a propriedade user
      if (!userData || !userData.user) {
        throw new Error('Resposta inválida do servidor');
      }
      
      setUser(userData.user);
      setToken(tokenToVerify);
      setLoading(false);
    } catch (error) {
      // Token inválido, limpar dados
      setUser(null);
      setToken(null);
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      setLoading(false);
    }
  };

  // Carregar token do localStorage ao iniciar
  useEffect(() => {
    const loadAuth = async () => {
      const storedToken = localStorage.getItem('auth_token');
      const storedUser = localStorage.getItem('auth_user');

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        
        // Verificar se o token ainda é válido
        await verifyToken(storedToken);
      } else {
        setLoading(false);
      }
    };

    loadAuth();
  }, []);


  const login = async (email, password) => {
    try {
      const result = await authApi.login(email, password);
      
      // Verificar se result existe e tem as propriedades necessárias
      if (!result || !result.user || !result.token) {
        throw new Error('Resposta inválida do servidor');
      }
      
      setUser(result.user);
      setToken(result.token);
      
      // Salvar no localStorage
      localStorage.setItem('auth_token', result.token);
      localStorage.setItem('auth_user', JSON.stringify(result.user));
      
      return result;
    } catch (error) {
      throw error;
    }
  };

  const register = async (email, password, name) => {
    try {
      const result = await authApi.register(email, password, name);
      
      // Verificar se result existe e tem as propriedades necessárias
      if (!result || !result.user || !result.token) {
        throw new Error('Resposta inválida do servidor');
      }
      
      setUser(result.user);
      setToken(result.token);
      
      // Salvar no localStorage
      localStorage.setItem('auth_token', result.token);
      localStorage.setItem('auth_user', JSON.stringify(result.user));
      
      return result;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    router.push('/login');
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user && !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
}

