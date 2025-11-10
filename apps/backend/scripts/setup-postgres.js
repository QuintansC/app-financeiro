#!/usr/bin/env node

/**
 * Script para configurar o Prisma para PostgreSQL
 * 
 * Uso:
 *   node scripts/setup-postgres.js
 * 
 * Este script atualiza o schema.prisma para usar PostgreSQL
 */

const fs = require('fs');
const path = require('path');

const schemaPath = path.join(__dirname, '..', 'prisma', 'schema.prisma');

try {
  let schema = fs.readFileSync(schemaPath, 'utf8');
  
  // Substituir provider de sqlite para postgresql
  schema = schema.replace(
    /provider\s*=\s*"sqlite"/,
    'provider = "postgresql"'
  );
  
  // Remover comentários sobre PostgreSQL se existirem
  schema = schema.replace(
    /\/\/ Para PostgreSQL em produção, use:[\s\S]*?url\s*=\s*env\("DATABASE_URL"\)/,
    'url      = env("DATABASE_URL")'
  );
  
  fs.writeFileSync(schemaPath, schema, 'utf8');
  
  console.log('✅ Schema atualizado para PostgreSQL!');
  console.log('📝 Execute: npm run prisma:generate');
  console.log('📝 Execute: npm run prisma:migrate:deploy');
} catch (error) {
  console.error('❌ Erro ao atualizar schema:', error.message);
  process.exit(1);
}

