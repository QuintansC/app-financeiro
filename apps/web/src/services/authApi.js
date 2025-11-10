const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333/api';

async function request(path, options = {}) {
  try {
    const response = await fetch(`${BASE_URL}${path}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
      ...options,
    });

    if (!response.ok) {
      let errorMessage = 'Erro ao comunicar com a API';
      
      try {
        const data = await response.json();
        errorMessage = data.message || errorMessage;
      } catch {
        errorMessage = response.statusText || errorMessage;
      }
      
      throw new Error(errorMessage);
    }

    if (response.status === 204) {
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    // Se já é um Error com mensagem, re-lançar
    if (error instanceof Error) {
      throw error;
    }
    // Caso contrário, criar um novo Error
    throw new Error(error.message || 'Erro desconhecido');
  }
}

export async function login(email, password) {
  if (!email || !password) {
    throw new Error('Email e senha são obrigatórios');
  }

  // Validar formato de email no frontend também
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    throw new Error('Email inválido');
  }

  return request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
  });
}

export async function register(email, password, name = '') {
  if (!email || !password) {
    throw new Error('Email e senha são obrigatórios');
  }

  // Validar formato de email no frontend também
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    throw new Error('Email inválido');
  }

  if (password.length < 6) {
    throw new Error('Senha deve ter no mínimo 6 caracteres');
  }

  return request('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ 
      email: email.trim().toLowerCase(), 
      password, 
      name: name.trim() 
    }),
  });
}

export async function verifyToken(token) {
  if (!token) {
    throw new Error('Token não fornecido');
  }

  return request('/auth/me', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

