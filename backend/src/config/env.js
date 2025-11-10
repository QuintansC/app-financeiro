const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const rootDir = path.resolve(__dirname, '..', '..');

module.exports = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT) || 3333,
  dataFile: process.env.DATA_FILE || path.join(rootDir, 'data', 'store.json'),
  databaseUrl: process.env.DATABASE_URL || 'file:./dev.db',
  jwtSecret: process.env.JWT_SECRET || 'sua-chave-secreta-super-segura-mude-em-producao',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
};

