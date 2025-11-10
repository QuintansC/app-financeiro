const { verifyToken, getUserById } = require('../services/authService');

async function authenticate(req, res, next) {
  try {
    // Pegar token do header Authorization
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Token não fornecido' });
    }

    const token = authHeader.substring(7); // Remove "Bearer "

    // Verificar token
    const decoded = verifyToken(token);

    if (!decoded || !decoded.userId) {
      return res.status(401).json({ message: 'Token inválido' });
    }

    // Buscar usuário
    const user = await getUserById(decoded.userId);

    if (!user) {
      return res.status(401).json({ message: 'Usuário não encontrado' });
    }

    // Adicionar usuário à requisição
    req.user = user;
    req.userId = user.id;

    next();
  } catch (error) {
    return res.status(401).json({ message: 'Erro na autenticação' });
  }
}

// Middleware opcional - não bloqueia se não tiver token
async function optionalAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const decoded = verifyToken(token);

      if (decoded && decoded.userId) {
        const user = await getUserById(decoded.userId);
        if (user) {
          req.user = user;
          req.userId = user.id;
        }
      }
    }

    next();
  } catch (error) {
    // Em caso de erro, continua sem autenticação
    next();
  }
}

module.exports = {
  authenticate,
  optionalAuth,
};

