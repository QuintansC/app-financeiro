'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import styles from './page.module.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register, isAuthenticated } = useAuth();
  const router = useRouter();

  // Se já estiver autenticado, redirecionar
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validações básicas
      if (!email.trim()) {
        setError('Email é obrigatório');
        setLoading(false);
        return;
      }

      if (!password.trim()) {
        setError('Senha é obrigatória');
        setLoading(false);
        return;
      }

      if (isRegister) {
        if (!name.trim()) {
          setError('Nome é obrigatório');
          setLoading(false);
          return;
        }

        if (password.length < 6) {
          setError('Senha deve ter no mínimo 6 caracteres');
          setLoading(false);
          return;
        }

        await register(email.trim(), password, name.trim());
      } else {
        await login(email.trim(), password);
      }
      
      // Redirecionar após login/registro bem-sucedido
      router.push('/');
    } catch (err) {
      setError(err.message || (isRegister ? 'Erro ao criar conta' : 'Erro ao fazer login'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>
          {isRegister ? 'Criar Conta' : 'Login'}
        </h1>
        <p className={styles.subtitle}>
          {isRegister 
            ? 'Crie sua conta para começar a gerenciar suas finanças' 
            : 'Entre para acessar seu sistema financeiro'}
        </p>

        {error && (
          <div className={styles.error}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          {isRegister && (
            <div className={styles.field}>
              <label className={styles.label}>Nome</label>
              <input
                type="text"
                className={styles.input}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Seu nome"
                required={isRegister}
                disabled={loading}
              />
            </div>
          )}

          <div className={styles.field}>
            <label className={styles.label}>Email</label>
            <input
              type="email"
              className={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
              disabled={loading}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Senha</label>
            <input
              type="password"
              className={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
              disabled={loading}
            />
            {isRegister && (
              <small className={styles.hint}>Mínimo de 6 caracteres</small>
            )}
          </div>

          <button
            type="submit"
            className={styles.button}
            disabled={loading}
          >
            {loading ? 'Carregando...' : (isRegister ? 'Criar Conta' : 'Entrar')}
          </button>
        </form>

        <div className={styles.switch}>
          <button
            type="button"
            className={styles.switchButton}
            onClick={() => {
              setIsRegister(!isRegister);
              setError('');
            }}
            disabled={loading}
          >
            {isRegister 
              ? 'Já tem uma conta? Faça login' 
              : 'Não tem uma conta? Criar conta'}
          </button>
        </div>
      </div>
    </div>
  );
}

