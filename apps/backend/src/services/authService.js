const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = require('../database/prisma');
const { jwtSecret, jwtExpiresIn } = require('../config/env');

async function hashPassword(password) {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
}

async function comparePassword(password, hash) {
  return bcrypt.compare(password, hash);
}

function generateToken(userId) {
  return jwt.sign({ userId }, jwtSecret, { expiresIn: jwtExpiresIn });
}

function verifyToken(token) {
  try {
    return jwt.verify(token, jwtSecret);
  } catch (error) {
    return null;
  }
}

async function register(email, password, name = '') {
  try {
    // Normalizar email (lowercase e trim)
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail || !password) {
      throw new Error('Email e senha são obrigatórios');
    }

    // Verificar se o email já existe
    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      throw new Error('Email já cadastrado');
    }

    // Hash da senha
    const passwordHash = await hashPassword(password);

    // Criar usuário
    const user = await prisma.user.create({
      data: {
        email: normalizedEmail,
        password: passwordHash,
        name: name.trim() || normalizedEmail.split('@')[0],
      },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        avatar: true,
        createdAt: true,
      },
    });

    if (!user || !user.id) {
      throw new Error('Erro ao criar usuário no banco de dados');
    }

    // Gerar token
    const token = generateToken(user.id);

    if (!token) {
      throw new Error('Erro ao gerar token de autenticação');
    }

    return { user, token };
  } catch (error) {
    console.error('Erro em register:', error);
    throw error;
  }
}

async function login(email, password) {
  try {
    // Normalizar email (lowercase e trim)
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail || !password) {
      throw new Error('Email e senha são obrigatórios');
    }

    // Buscar usuário
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      throw new Error('Email ou senha incorretos');
    }

    // Verificar senha
    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      throw new Error('Email ou senha incorretos');
    }

    // Gerar token
    const token = generateToken(user.id);

    if (!token) {
      throw new Error('Erro ao gerar token de autenticação');
    }

    // Retornar usuário sem senha
    const { password: _, ...userWithoutPassword } = user;

    if (!userWithoutPassword || !userWithoutPassword.id) {
      throw new Error('Erro ao processar dados do usuário');
    }

    return { user: userWithoutPassword, token };
  } catch (error) {
    console.error('Erro em login:', error);
    throw error;
  }
}

async function getUserById(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      phone: true,
      avatar: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return user;
}

module.exports = {
  register,
  login,
  generateToken,
  verifyToken,
  getUserById,
};

