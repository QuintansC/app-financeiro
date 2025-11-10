const express = require('express');
const cors = require('cors');
const financeRoutes = require('./routes/financeRoutes');
const authRoutes = require('./routes/authRoutes');
const { port } = require('./config/env');

const app = express();

app.use(cors());
app.use(express.json());

// Middleware para logar cada conexão/requisição
app.use((req, res, next) => {
  const start = Date.now();
  const ip = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || req.ip;
  const now = new Date().toISOString();

  // Quando a resposta terminar, loga status e tempo decorrido
  res.on('finish', () => {
    const duration = Date.now() - start;
    // eslint-disable-next-line no-console
    console.log(`[${now}] ${ip} - ${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`);
  });

  next();
});

app.get('/health', (_, res) => {
  res.json({ status: 'ok' });
});

// Rotas de autenticação (públicas)
app.use('/api/auth', authRoutes);

// Rotas financeiras (protegidas)
app.use('/api', financeRoutes);

app.use((err, req, res, next) => {
  // eslint-disable-next-line no-console
  console.error(err);
  res.status(500).json({ message: 'Erro interno do servidor' });
});

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Servidor iniciado em http://localhost:${port}`);
});

