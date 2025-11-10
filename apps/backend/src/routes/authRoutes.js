const express = require('express');
const { register, login } = require('../services/authService');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Registrar novo usuário
router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email e senha são obrigatórios' });
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({ message: 'Email inválido' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Senha deve ter no mínimo 6 caracteres' });
    }

    const result = await register(email.trim().toLowerCase(), password, name?.trim() || '');

    // Verificar se result existe e tem as propriedades necessárias
    if (!result || !result.user || !result.token) {
      console.error('Erro: register retornou resultado inválido:', result);
      return res.status(500).json({ message: 'Erro ao criar usuário. Tente novamente.' });
    }

    res.status(201).json(result);
  } catch (error) {
    console.error('Erro no register:', error);
    res.status(400).json({ message: error.message || 'Erro ao registrar usuário' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email e senha são obrigatórios' });
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({ message: 'Email inválido' });
    }

    const result = await login(email.trim().toLowerCase(), password);

    // Verificar se result existe e tem as propriedades necessárias
    if (!result || !result.user || !result.token) {
      console.error('Erro: login retornou resultado inválido:', result);
      return res.status(500).json({ message: 'Erro ao fazer login. Tente novamente.' });
    }

    res.json(result);
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(401).json({ message: error.message || 'Erro ao fazer login' });
  }
});

// Verificar token (rota protegida)
router.get('/me', authenticate, async (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;

