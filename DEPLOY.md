# Deploy na Vercel

Este projeto está configurado para ser deployado na Vercel usando Turbo monorepo.

## 📋 Pré-requisitos

- Conta na [Vercel](https://vercel.com)
- Banco de dados PostgreSQL (Vercel Postgres, Supabase, Railway, etc.)
- Repositório Git (GitHub, GitLab, Bitbucket)

## 🚀 Configuração

### Opção 1: Deploy do Frontend (Recomendado - Projeto Único)

O frontend Next.js pode ser deployado sozinho e fazer chamadas para um backend externo.

#### 1. Conectar Repositório

1. Acesse [vercel.com](https://vercel.com)
2. Clique em "Add New Project"
3. Importe seu repositório

#### 2. Configurar Projeto

- **Framework Preset**: Next.js
- **Root Directory**: `mobile`
- **Build Command**: `cd ../.. && npm install && npm run build --filter=mobile`
- **Output Directory**: `.next` (deixar vazio, Next.js detecta automaticamente)
- **Install Command**: `cd ../.. && npm install`

#### 3. Variáveis de Ambiente

Configure as seguintes variáveis na Vercel:

```
NEXT_PUBLIC_API_URL=https://seu-backend.vercel.app/api
```

### Opção 2: Deploy Separado (Frontend + Backend)

#### Deploy do Frontend

1. **Criar primeiro projeto na Vercel**
   - Root Directory: `mobile`
   - Framework: Next.js
   - Build Command: `cd ../.. && npm install && npm run build --filter=mobile`

2. **Variáveis de Ambiente**:
   ```
   NEXT_PUBLIC_API_URL=https://seu-backend.vercel.app/api
   ```

#### Deploy do Backend

1. **Criar segundo projeto na Vercel**
   - Root Directory: `backend`
   - Framework: Other
   - Build Command: `npm run build`
   - Install Command: `npm install`
   - Output Directory: (deixar vazio)

2. **Variáveis de Ambiente**:
   ```
   DATABASE_URL=postgresql://user:password@host:5432/database
   JWT_SECRET=sua-chave-secreta-super-segura-aleatoria
   JWT_EXPIRES_IN=7d
   NODE_ENV=production
   PORT=3000
   ```

3. **Configurar Rotas**:
   - A Vercel detectará automaticamente o arquivo `backend/api/index.js`
   - As rotas `/api/*` serão servidas pelo backend

## 🗄️ Banco de Dados

### Configurar PostgreSQL

1. **Criar banco PostgreSQL**:
   - Opção 1: [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres)
   - Opção 2: [Supabase](https://supabase.com)
   - Opção 3: [Railway](https://railway.app)
   - Opção 4: [Neon](https://neon.tech)

2. **Obter string de conexão**:
   ```
   postgresql://user:password@host:5432/database?sslmode=require
   ```

3. **Configurar no Prisma**:
   - **Para PostgreSQL**: Execute `node scripts/setup-postgres.js` no diretório `backend/`
   - **Para voltar ao SQLite**: Execute `node scripts/setup-sqlite.js` no diretório `backend/`
   - Ou edite manualmente `backend/prisma/schema.prisma` e altere `provider = "sqlite"` para `provider = "postgresql"`

4. **Executar Migrations**:
   
   **Via Vercel CLI** (recomendado):
   ```bash
   npm i -g vercel
   vercel login
   vercel link
   cd backend
   vercel env pull .env.production
   npx prisma migrate deploy
   ```

   **Ou via script de build**:
   - Adicione `prisma migrate deploy` ao script de build

## 📝 Variáveis de Ambiente

### Frontend (mobile)

| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| `NEXT_PUBLIC_API_URL` | URL da API backend | `https://backend.vercel.app/api` |

### Backend

| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| `DATABASE_URL` | String de conexão PostgreSQL | `postgresql://...` |
| `JWT_SECRET` | Chave secreta para JWT | (gerar string aleatória) |
| `JWT_EXPIRES_IN` | Tempo de expiração do token | `7d` |
| `NODE_ENV` | Ambiente | `production` |
| `PORT` | Porta (opcional, Vercel define) | `3000` |

## 🔧 Scripts de Build

### Backend

O script `build` no `backend/package.json` executa:
- `prisma generate` - Gera o Prisma Client

### Frontend

O script `build` no `mobile/package.json` executa:
- `next build` - Build do Next.js

## 🚨 Importante

1. **SQLite não funciona na Vercel**: Use PostgreSQL em produção
2. **JWT_SECRET**: Gere uma chave forte e segura:
   ```bash
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```
3. **CORS**: O backend já está configurado para aceitar requisições de qualquer origem
4. **Migrations**: Execute `prisma migrate deploy` após configurar o banco

## 📦 Estrutura de Deploy

```
Vercel
├── Projeto 1: Frontend (mobile/)
│   └── Deploy automático via Git
│   └── Variável: NEXT_PUBLIC_API_URL
│
└── Projeto 2: Backend (backend/)
    └── Deploy automático via Git
    └── Variáveis: DATABASE_URL, JWT_SECRET, etc.
    └── Rotas: /api/*
```

## ✅ Checklist de Deploy

- [ ] Criar banco PostgreSQL
- [ ] Configurar variáveis de ambiente no frontend
- [ ] Configurar variáveis de ambiente no backend
- [ ] Executar migrations do Prisma
- [ ] Testar autenticação
- [ ] Verificar CORS
- [ ] Testar todas as rotas da API
- [ ] Configurar domínio customizado (opcional)

## 🔍 Troubleshooting

### Erro: "Cannot find module '@prisma/client'"
- Execute `npm run prisma:generate` no backend antes do build

### Erro: "Database connection failed"
- Verifique se `DATABASE_URL` está configurada corretamente
- Verifique se o banco PostgreSQL está acessível
- Execute migrations: `npx prisma migrate deploy`

### Erro: "CORS policy"
- O backend já está configurado com `cors()`, mas verifique se a URL do frontend está correta

### Build falha
- Verifique os logs na Vercel
- Certifique-se de que todas as dependências estão no `package.json`
- Verifique se o Root Directory está correto
