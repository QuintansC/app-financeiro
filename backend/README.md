# Backend - Projeto Financeiro

Backend Node.js com Express, SQLite e Prisma.

## Pré-requisitos

- Node.js (v18 ou superior)

## Configuração

1. Instale as dependências:
```bash
npm install
```

2. Configure as variáveis de ambiente. Crie um arquivo `.env` na raiz do backend:
```env
DATABASE_URL="file:./dev.db"
PORT=3333
NODE_ENV=development
```

3. Execute as migrations (o banco SQLite será criado automaticamente):
```bash
npm run prisma:migrate
```

4. Popule o banco com dados iniciais:
```bash
npm run prisma:seed
```

## Scripts Disponíveis

- `npm run dev` - Inicia o servidor em modo desenvolvimento com nodemon
- `npm start` - Inicia o servidor em produção
- `npm run prisma:generate` - Gera o Prisma Client
- `npm run prisma:migrate` - Cria e aplica migrations
- `npm run prisma:migrate:deploy` - Aplica migrations em produção
- `npm run prisma:seed` - Popula o banco com dados iniciais
- `npm run prisma:studio` - Abre o Prisma Studio (interface visual do banco)

## Estrutura do Banco de Dados

- **Debt**: Dívidas cadastradas
- **Salary**: Configuração de salário (singleton)
- **Savings**: Configuração de poupança (singleton)
- **Month**: Planejamento mensal

## API Endpoints

- `GET /api/dados` - Retorna todos os dados financeiros
- `POST /api/dividas` - Cria ou atualiza uma dívida
- `DELETE /api/dividas/:id` - Remove uma dívida
- `POST /api/salario` - Atualiza informações de salário
- `POST /api/poupanca` - Atualiza informações de poupança
- `POST /api/meses` - Atualiza planejamento mensal

