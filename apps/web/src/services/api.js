const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333/api';

async function request(path, options = {}) {
  // Obter token do localStorage
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
  
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    // Se for erro 401 (não autorizado), limpar token e redirecionar
    if (response.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
        window.location.href = '/login';
      }
    }
    
    const data = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(data.message || 'Erro ao comunicar com a API');
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export function fetchFinanceData() {
  return request('/dados');
}

export function createOrUpdateDebt(payload) {
  return request('/dividas', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function deleteDebt(id) {
  return request(`/dividas/${id}`, {
    method: 'DELETE',
  });
}

export function updateSalary(payload) {
  return request('/salario', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function updateSavings(payload) {
  return request('/poupanca', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function updateMonth(payload) {
  return request('/meses', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function updateUserPreferences(payload) {
  return request('/preferencias', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function syncQuickActions(payload) {
  return request('/acoes-rapidas', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function updateQuickActionsOrder(routeOrder) {
  return request('/acoes-rapidas/ordem', {
    method: 'POST',
    body: JSON.stringify({ routeOrder }),
  });
}

export function removeQuickAction(route) {
  return request(`/acoes-rapidas/${encodeURIComponent(route)}`, {
    method: 'DELETE',
  });
}

export function updateUser(payload) {
  return request('/usuario', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
