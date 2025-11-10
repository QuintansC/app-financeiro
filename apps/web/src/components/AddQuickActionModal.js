'use client';

import { useState, useEffect } from 'react';
import { Button } from './Button';
import { ConfirmModal } from './ConfirmModal';
import styles from './AddQuickActionModal.module.css';

import { validRoutes, navItems } from '@/config/routes';

const availableIcons = [
  '💳', '💰', '🏦', '📅', '📊', '💵', '💸', '💼', '🏠', '🚗',
  '✈️', '🍔', '🛒', '🎮', '📱', '💻', '🎓', '🏥', '⚽', '🎬',
  '🎵', '📚', '🎨', '🏋️', '🧘', '🍕', '☕', '🍰', '🎁', '⭐'
];

export function AddQuickActionModal({ isOpen, onClose, onAdd, onRemove, onReorder, existingActions = [], defaultActions = [] }) {
  const [label, setLabel] = useState('');
  const [icon, setIcon] = useState('⭐');
  const [route, setRoute] = useState('');
  const [error, setError] = useState('');
  const [confirmRemove, setConfirmRemove] = useState({ isOpen: false, index: null, action: null });
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [displayOrder, setDisplayOrder] = useState(existingActions);
  
  // Atualizar displayOrder quando existingActions mudar
  useEffect(() => {
    setDisplayOrder(existingActions);
  }, [existingActions]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!label.trim()) {
      setError('O nome da ação é obrigatório');
      return;
    }

    if (!route.trim()) {
      setError('A rota é obrigatória');
      return;
    }

    // Normalizar a rota (garantir que começa com /)
    const normalizedRoute = route.trim().startsWith('/') ? route.trim() : `/${route.trim()}`;

    // Verificar se já existe uma ação com o mesmo nome
    if (existingActions.some(action => action.label.toLowerCase() === label.toLowerCase())) {
      setError('Já existe uma ação com este nome');
      return;
    }

    // Verificar se já existe uma ação com a mesma rota
    if (existingActions.some(action => action.route === normalizedRoute)) {
      setError('Já existe uma ação com esta rota');
      return;
    }

    const newAction = {
      label: label.trim(),
      icon,
      route: normalizedRoute,
    };
    
    onAdd(newAction);

    // Reset form
    setLabel('');
    setIcon('⭐');
    setRoute('');
    onClose();
  };

  const handleClose = () => {
    setLabel('');
    setIcon('⭐');
    setRoute('');
    setError('');
    onClose();
  };

  return (
    <div className={styles.overlay} onClick={handleClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>Gerenciar Ações Rápidas</h2>
          <button className={styles.closeButton} onClick={handleClose} aria-label="Fechar">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {error && <div className={styles.error}>{error}</div>}

          <div className={styles.field}>
            <label className={styles.label}>Nome da Ação</label>
            <input
              type="text"
              className={styles.input}
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="Ex: Investimentos"
              required
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Rota</label>
            <select
              className={styles.select}
              value={route}
              onChange={(e) => setRoute(e.target.value)}
              required
            >
              <option value="">Selecione uma rota</option>
              {navItems
                .filter(item => item.href !== '/') // Excluir dashboard
                .map(item => (
                  <option key={item.href} value={item.href}>
                    {item.label} ({item.href})
                  </option>
                ))}
            </select>
            <small className={styles.hint}>
              Selecione a rota que será acessada quando clicar na ação
            </small>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Ícone</label>
            <div className={styles.iconGrid}>
              {availableIcons.map((icn) => (
                <button
                  key={icn}
                  type="button"
                  className={`${styles.iconButton} ${icon === icn ? styles.iconButtonActive : ''}`}
                  onClick={() => setIcon(icn)}
                >
                  {icn}
                </button>
              ))}
            </div>
            <div className={styles.selectedIcon}>
              Ícone selecionado: <span className={styles.iconPreview}>{icon}</span>
            </div>
          </div>

          {existingActions.length > 0 && (
            <div className={styles.existingActions}>
              <label className={styles.label}>Ações Rápidas Existentes</label>
              <small className={styles.hint}>
                Arraste para reordenar ou clique no ícone 🗑️ para remover
              </small>
              <div className={styles.actionsList}>
                {displayOrder.map((action, index) => {
                  const isDefault = defaultActions.some(da => da.route === action.route);
                  return (
                    <div
                      key={`${action.route}-${index}`}
                      className={`${styles.actionItem} ${draggedIndex === index ? styles.dragging : ''}`}
                      draggable
                      onDragStart={() => setDraggedIndex(index)}
                      onDragOver={(e) => {
                        e.preventDefault();
                        e.dataTransfer.dropEffect = 'move';
                      }}
                      onDrop={(e) => {
                        e.preventDefault();
                        if (draggedIndex === null || draggedIndex === index) return;
                        
                        const newOrder = [...displayOrder];
                        const draggedItem = newOrder[draggedIndex];
                        newOrder.splice(draggedIndex, 1);
                        newOrder.splice(index, 0, draggedItem);
                        setDisplayOrder(newOrder);
                        
                        if (onReorder) {
                          const routeOrder = newOrder.map(a => a.route);
                          onReorder(routeOrder);
                        }
                        
                        setDraggedIndex(null);
                      }}
                      onDragEnd={() => {
                        setDraggedIndex(null);
                      }}
                    >
                      <div className={styles.actionInfo}>
                        <span className={styles.dragHandle}>☰</span>
                        <span className={styles.actionIcon}>{action.icon}</span>
                        <div className={styles.actionDetails}>
                          <span className={styles.actionLabel}>
                            {action.label}
                            {isDefault && <span className={styles.defaultBadge}>Padrão</span>}
                          </span>
                          <span className={styles.actionRoute}>{action.route}</span>
                        </div>
                      </div>
                      {onRemove && (
                        <button
                          type="button"
                          className={styles.removeButton}
                          onClick={() => {
                            setConfirmRemove({
                              isOpen: true,
                              index,
                              action,
                            });
                          }}
                          aria-label={`Remover ${action.label}`}
                        >
                          🗑️
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className={styles.actions}>
            <Button
              type="button"
              title="Cancelar"
              variant="outline"
              onClick={handleClose}
              className={styles.cancelButton}
            />
            <Button
              type="submit"
              title="Adicionar"
              variant="primary"
            />
          </div>
        </form>

        <ConfirmModal
          isOpen={confirmRemove.isOpen}
          onClose={() => setConfirmRemove({ isOpen: false, index: null, action: null })}
          onConfirm={() => {
            if (confirmRemove.action && onRemove) {
              onRemove(confirmRemove.action);
            }
            setConfirmRemove({ isOpen: false, index: null, action: null });
          }}
          title="Remover Ação Rápida"
          message={`Deseja remover a ação "${confirmRemove.action?.label}"?`}
          confirmText="Remover"
          cancelText="Cancelar"
          variant="danger"
        />
      </div>
    </div>
  );
}

