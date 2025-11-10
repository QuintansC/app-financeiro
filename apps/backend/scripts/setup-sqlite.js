#!/usr/bin/env node

/**
 * Script para configurar o Prisma para SQLite
 * 
 * Uso:
 *   node scripts/setup-sqlite.js
 * 
 * Este script atualiza o schema.prisma para usar SQLite
 */

const fs = require('fs');
const path = require('path');

const schemaPath = path.join(__dirname, '..', 'prisma', 'schema.prisma');

try {
  let schema = fs.readFileSync(schemaPath, 'utf8');
  
  // Substituir provider de postgresql para sqlite
  schema = schema.replace(
    /provider\s*=\s*"postgresql"/,
    'provider = "sqlite"'
  );
  
  fs.writeFileSync(schemaPath, schema, 'utf8');
  
  console.log('✅ Schema atualizado para SQLite!');
  console.log('📝 Execute: npm run prisma:generate');
} catch (error) {
  console.error('❌ Erro ao atualizar schema:', error.message);
  process.exit(1);
}

