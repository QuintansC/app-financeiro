# Guia de Configuração - SQLite + Prisma

## Passo a Passo

### 1. Configurar Variáveis de Ambiente

Crie um arquivo `.env` na raiz do backend:

```env
DATABASE_URL="file:./dev.db"
PORT=3333
NODE_ENV=development
```

**Nota:** O arquivo do banco SQLite será criado automaticamente na primeira migration. Você pode usar um caminho absoluto ou relativo. Exemplos:
- `file:./dev.db` - Arquivo na raiz do backend
- `file:./data/dev.db` - Arquivo em uma pasta data
- `file:/caminho/absoluto/dev.db` - Caminho absoluto

### 2. Executar Migrations

```bash
cd backend
npm run prisma:migrate
```

Quando solicitado, dê um nome à migration (ex: "init"). O banco de dados SQLite será criado automaticamente.

### 3. Popular o Banco com Dados Iniciais

```bash
npm run prisma:seed
```

### 4. Iniciar o Servidor

```bash
npm run dev
```

## Comandos Úteis

- `npm run prisma:studio` - Abre interface visual do banco de dados
- `npm run prisma:migrate` - Cria nova migration
- `npm run prisma:migrate:deploy` - Aplica migrations em produção
- `npm run prisma:generate` - Regenera o Prisma Client
- `npm run check:sqlite` - Verifica configuração do SQLite

## Vantagens do SQLite

- **Sem instalação necessária**: SQLite vem integrado com Node.js via Prisma
- **Sem servidor**: Não precisa de um servidor de banco de dados rodando
- **Arquivo único**: Todo o banco está em um único arquivo, fácil de fazer backup
- **Perfeito para desenvolvimento**: Ideal para projetos pequenos e médios
- **Portável**: Pode copiar o arquivo do banco facilmente

## Troubleshooting

### Erro de conexão com o banco

1. Verifique se a string `DATABASE_URL` está correta no `.env`
2. Verifique se há permissões de escrita no diretório onde o banco será criado
3. Execute o script de verificação:
```bash
npm run check:sqlite
```

### Erro ao executar migrations

Certifique-se de que:
- A string `DATABASE_URL` está correta
- Você tem permissões de escrita no diretório
- O caminho do arquivo está acessível

### Backup do banco de dados

Para fazer backup do banco SQLite, simplesmente copie o arquivo `.db`:

```bash
# Exemplo
cp dev.db dev.db.backup
```

### Resetar o banco de dados

Para resetar o banco (apagar todas as tabelas e dados):

```bash
# 1. Deletar o arquivo do banco
rm dev.db

# 2. Recriar as migrations
npm run prisma:migrate

# 3. Popular com dados iniciais (opcional)
npm run prisma:seed
```
