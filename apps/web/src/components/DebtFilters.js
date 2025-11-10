'use client';

import styles from './DebtFilters.module.css';

const STATUS_OPTIONS = [
  { value: 'all', label: 'Todas' },
  { value: 'paid', label: 'Pagas' },
  { value: 'in-progress', label: 'Em andamento' },
  { value: 'pending', label: 'Pendentes' },
];

const SORT_OPTIONS = [
  { value: 'status', label: 'Status' },
  { value: 'creditor', label: 'Credor' },
  { value: 'totalValue', label: 'Valor Total' },
  { value: 'dueDay', label: 'Dia de Vencimento' },
];

const VIEW_OPTIONS = [
  { value: 'list', label: 'Lista', icon: '☰' },
  { value: 'grid', label: 'Grade', icon: '⊞' },
];

export function DebtFilters({ 
  statusFilter, 
  onStatusFilterChange,
  sortBy,
  onSortByChange,
  viewMode,
  onViewModeChange,
}) {
  return (
    <div className={styles.filtersContainer}>
      <div className={styles.filterGroup}>
        <label className={styles.label}>Filtrar por status:</label>
        <select
          className={styles.select}
          value={statusFilter}
          onChange={(e) => onStatusFilterChange(e.target.value)}
        >
          {STATUS_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.filterGroup}>
        <label className={styles.label}>Ordenar por:</label>
        <select
          className={styles.select}
          value={sortBy}
          onChange={(e) => onSortByChange(e.target.value)}
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.filterGroup}>
        <label className={styles.label}>Visualização:</label>
        <div className={styles.viewButtons}>
          {VIEW_OPTIONS.map((option) => (
            <button
              key={option.value}
              className={`${styles.viewButton} ${viewMode === option.value ? styles.viewButtonActive : ''}`}
              onClick={() => onViewModeChange(option.value)}
              aria-label={option.label}
              title={option.label}
            >
              <span className={styles.viewIcon}>{option.icon}</span>
              <span className={styles.viewLabel}>{option.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

