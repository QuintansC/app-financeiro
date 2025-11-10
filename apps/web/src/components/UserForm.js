'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from './UserForm.module.css';

export function UserForm({ user, onSave, isLoading = false }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    avatar: '',
  });
  const [avatarPreviewError, setAvatarPreviewError] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        avatar: user.avatar || '',
      });
      setAvatarPreviewError(false);
    }
  }, [user]);

  useEffect(() => {
    setAvatarPreviewError(false);
  }, [form.avatar]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (onSave) {
      await onSave(form);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.field}>
        <label htmlFor="name" className={styles.label}>
          Nome Completo
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={form.name}
          onChange={handleChange}
          className={styles.input}
          placeholder="Digite seu nome completo"
          required
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="email" className={styles.label}>
          E-mail
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          className={styles.input}
          placeholder="seu@email.com"
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="phone" className={styles.label}>
          Telefone
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          className={styles.input}
          placeholder="(00) 00000-0000"
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="avatar" className={styles.label}>
          URL do Avatar (opcional)
        </label>
        <input
          type="url"
          id="avatar"
          name="avatar"
          value={form.avatar}
          onChange={handleChange}
          className={styles.input}
          placeholder="https://exemplo.com/avatar.jpg"
        />
        {form.avatar && !avatarPreviewError && (
          <div className={styles.avatarPreview}>
            <Image
              src={form.avatar}
              alt="Preview do avatar"
              width={72}
              height={72}
              className={styles.avatarImage}
              unoptimized
              onError={() => setAvatarPreviewError(true)}
            />
          </div>
        )}
      </div>

      <div className={styles.actions}>
        <button
          type="submit"
          disabled={isLoading}
          className={styles.submitButton}
        >
          {isLoading ? 'Salvando...' : 'Salvar Perfil'}
        </button>
      </div>
    </form>
  );
}

