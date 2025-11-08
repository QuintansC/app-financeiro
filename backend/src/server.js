const express = require('express');
const cors = require('cors');
const financeRoutes = require('./routes/financeRoutes');
const { port } = require('./config/env');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (_, res) => {
  res.json({ status: 'ok' });
});

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

