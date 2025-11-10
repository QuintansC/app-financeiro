const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

console.log('🔍 Verificando instalação e configuração do SQLite...\n');

// 1. Verificar variáveis de ambiente
console.log('1️⃣ Verificando variáveis de ambiente...');
const envPath = path.join(__dirname, '..', '.env');
const envExamplePath = path.join(__dirname, '..', '.env.example');

if (!fs.existsSync(envPath)) {
  console.log('❌ Arquivo .env não encontrado');
  console.log(`   Local esperado: ${envPath}`);
  
  if (fs.existsSync(envExamplePath)) {
    console.log('\n💡 Encontrado arquivo .env.example');
    console.log('   Copie o arquivo .env.example para .env e configure:');
    console.log(`   cp .env.example .env`);
    console.log('   (ou copie manualmente e edite)\n');
  } else {
    console.log('\n💡 Crie um arquivo .env na raiz do backend com:');
    console.log('   DATABASE_URL="file:./dev.db"');
    console.log('   PORT=3333\n');
  }
  process.exit(1);
}

require('dotenv').config({ path: envPath });

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.log('❌ DATABASE_URL não encontrada no arquivo .env');
  console.log('   Adicione a seguinte linha ao arquivo .env:');
  console.log('   DATABASE_URL="file:./dev.db"');
  console.log('   (O arquivo será criado automaticamente na primeira migration)\n');
  process.exit(1);
}

console.log('✅ DATABASE_URL encontrada');
console.log(`   ${databaseUrl}\n`);

// 2. Extrair informações da URL de conexão
console.log('2️⃣ Analisando string de conexão...');
try {
  if (databaseUrl.startsWith('file:')) {
    const dbPath = databaseUrl.replace('file:', '');
    const fullPath = path.isAbsolute(dbPath) 
      ? dbPath 
      : path.join(__dirname, '..', dbPath);
    
    console.log(`   Tipo: SQLite`);
    console.log(`   Arquivo: ${fullPath}`);
    
    if (fs.existsSync(fullPath)) {
      const stats = fs.statSync(fullPath);
      const sizeInMB = (stats.size / (1024 * 1024)).toFixed(2);
      console.log(`   Tamanho: ${sizeInMB} MB`);
      console.log(`   Status: ✅ Arquivo existe\n`);
    } else {
      console.log(`   Status: ⚠️  Arquivo não existe ainda (será criado na primeira migration)\n`);
    }
  } else {
    console.log(`   Tipo: SQLite (URL: ${databaseUrl})\n`);
  }
} catch (error) {
  console.log('⚠️  Erro ao analisar DATABASE_URL');
  console.log(`   ${error.message}\n`);
}

// 3. Testar conexão com Prisma
console.log('3️⃣ Testando conexão com Prisma e verificando banco de dados...');
const prisma = new PrismaClient({
  log: ['error'],
});

prisma.$connect()
  .then(async () => {
    console.log('✅ Prisma conectado com sucesso ao banco de dados\n');
    
    // Verificar se as tabelas existem
    console.log('4️⃣ Verificando tabelas do banco...');
    let tables = [];
    try {
      tables = await prisma.$queryRaw`
        SELECT name 
        FROM sqlite_master 
        WHERE type='table' AND name NOT LIKE 'sqlite_%'
        ORDER BY name;
      `;
      
      if (tables.length > 0) {
        console.log('✅ Tabelas encontradas:');
        tables.forEach(table => {
          console.log(`   - ${table.name}`);
        });
        console.log('\n');
      } else {
        console.log('⚠️  Nenhuma tabela encontrada');
        console.log('   Execute: npm run prisma:migrate\n');
      }
    } catch (error) {
      console.log('⚠️  Erro ao verificar tabelas');
      console.log(`   ${error.message}\n`);
    }
    
    await prisma.$disconnect();
    console.log('✨ Verificação concluída com sucesso!');
    console.log('\n📝 Próximos passos:');
    if (tables.length === 0) {
      console.log('   1. Execute: npm run prisma:migrate');
      console.log('   2. Execute: npm run prisma:seed');
    } else {
      console.log('   ✅ Banco de dados configurado corretamente!');
      console.log('   Execute: npm run dev para iniciar o servidor');
    }
    console.log('');
  })
  .catch((error) => {
    console.log('❌ Erro ao conectar com Prisma');
    console.log(`   ${error.message}\n`);
    
    // Análise do erro
    if (error.message.includes('P1001')) {
      console.log('💡 Não foi possível acessar o arquivo do banco de dados');
      console.log('   - Verifique se o caminho está correto');
      console.log('   - Verifique se há permissões de escrita no diretório\n');
    } else if (error.message.includes('P1003')) {
      console.log('💡 Banco de dados não encontrado');
      console.log('   - Execute: npm run prisma:migrate para criar o banco\n');
    } else {
      console.log('💡 Dicas gerais:');
      console.log('   - Verifique se a DATABASE_URL está correta no .env');
      console.log('   - Execute: npm run prisma:migrate para criar o banco');
      console.log('   - Verifique se há permissões de escrita no diretório\n');
    }
    process.exit(1);
  });

