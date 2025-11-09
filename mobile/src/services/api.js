const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://192.168.1.12:3333/api';

async function request(path, options = {}) {
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || 'Erro ao comunicar com a API');
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

