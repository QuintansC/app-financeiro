'use client';

import { useState } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useFinanceData } from '@/hooks/useFinanceData';
import { useAuth } from '@/contexts/AuthContext';
import { UserForm } from '@/components/UserForm';
import { LoadingScreen } from '@/components/LoadingScreen';
import styles from './page.module.css';

export default function Usuario() {
  const {
    data,
    loading,
    refresh,
    saveUser,
    operationLoading,
  } = useFinanceData();
  
  const { user: authUser } = useAuth();

  const [feedback, setFeedback] = useState('');

  const showFullScreenLoading = (loading && !data) || operationLoading;

  if (showFullScreenLoading) {
    return (
      <ProtectedRoute>
        <LoadingScreen
          message={operationLoading ? 'Processando...' : 'Carregando dados...'}
        />
      </ProtectedRoute>
    );
  }

  async function handleSaveUser(payload) {
    try {
      await saveUser(payload);
      setFeedback('Perfil atualizado com sucesso!');
      setTimeout(() => setFeedback(''), 3000);
    } catch (err) {
      setFeedback(err.message || 'Erro ao atualizar perfil');
    }
  }

  const displayUser = data?.user || authUser;
  const userAvatar = displayUser?.avatar || (displayUser?.name ? `https://ui-avatars.com/api/?name=${encodeURIComponent(displayUser.name)}&background=6366F1&color=fff&size=200` : null);

  return (
    <ProtectedRoute>
      <div className={styles.container}>
        <div className={styles.profileHeader}>
          <div className={styles.avatarContainer}>
            {userAvatar ? (
              <img 
                src={userAvatar} 
                alt={displayUser?.name || 'Usuário'} 
                className={styles.avatar}
                onError={(e) => {
                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(displayUser?.name || 'U')}&background=6366F1&color=fff&size=200`;
                }}
              />
            ) : (
              <div className={styles.avatarPlaceholder}>
                <span className={styles.avatarIcon}>👤</span>
              </div>
            )}
          </div>
          <div className={styles.profileInfo}>
            <h1 className={styles.profileName}>{displayUser?.name || 'Usuário'}</h1>
            <p className={styles.profileEmail}>{displayUser?.email || ''}</p>
          </div>
        </div>

        {feedback && (
          <div className={`${styles.feedback} ${feedback.includes('Erro') ? styles.error : styles.success}`}>
            {feedback}
          </div>
        )}

        <div className={styles.formCard}>
          <h2 className={styles.formTitle}>Informações Pessoais</h2>
          <UserForm
            user={data?.user || authUser}
            onSave={handleSaveUser}
            isLoading={operationLoading}
          />
        </div>
      </div>
    </ProtectedRoute>
  );
}

