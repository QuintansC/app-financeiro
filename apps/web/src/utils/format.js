export function formatCurrency(value = 0) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(Number.isFinite(value) ? value : 0);
}

export function formatPercent(value = 0) {
  return `${Math.round((value || 0) * 100)}%`;
}

export function formatDate(value) {
  if (!value) return '—';
  try {
    return new Intl.DateTimeFormat('pt-BR').format(new Date(value));
  } catch (error) {
    return value;
  }
}

