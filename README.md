# Projeto Financeiro

Sistema de gestão financeira pessoal desenvolvido com React Native (Expo) e Node.js.

## 🏗️ Estrutura do Monorepo

Este projeto utiliza um monorepo gerenciado pelo **Turbo** para otimizar o desenvolvimento e build.

```
projeto-financeiro/
├── backend/          # API Node.js com Express e Prisma
├── mobile/          # App React Native com Expo
└── package.json     # Configuração do monorepo
```

## 📋 Pré-requisitos

- Node.js >= 18.0.0
- npm >= 9.0.0

## 🚀 Início Rápido

### 1. Instalar dependências

```bash
npm install
```

Isso instalará as dependências de todos os workspaces (backend e mobile).

### 2. Configurar Backend

1. Crie um arquivo `.env` em `backend/`:
```env
DATABASE_URL="file:./dev.db"
PORT=3333
NODE_ENV=development
```

2. Verifique a configuração do SQLite:
```bash
npm run backend:check
```

3. Execute as migrations:
```bash
cd backend
npm run prisma:migrate
npm run prisma:seed
```

### 3. Iniciar o desenvolvimento

**Iniciar tudo (backend + mobile):**
```bash
npm run dev
```

**Apenas backend:**
```bash
npm run backend:dev
```

**Apenas mobile:**
```bash
npm run mobile:dev
```

## 📦 Scripts Disponíveis

### Scripts Globais (raiz)
- `npm run dev` - Inicia backend e mobile em modo desenvolvimento
- `npm run build` - Build de todos os workspaces
- `npm run lint` - Executa lint em todos os workspaces
- `npm run clean` - Limpa node_modules e cache

### Scripts do Backend
- `npm run backend:dev` - Inicia servidor em desenvolvimento
- `npm run backend:check` - Verifica configuração do SQLite

### Scripts do Mobile
- `npm run mobile:dev` - Inicia Expo em desenvolvimento
- `npm run mobile:start` - Inicia Expo

## 🛠️ Tecnologias

### Backend
- Node.js + Express
- SQLite (desenvolvimento) / PostgreSQL (produção) + Prisma ORM
- JWT para autenticação
- bcrypt para hash de senhas

### Frontend
- Next.js 15
- React 19
- Victory (gráficos)
- XLSX (importação de planilhas)

## 🚀 Deploy na Vercel

Este projeto está configurado para deploy na Vercel. Veja [DEPLOY.md](./DEPLOY.md) para instruções detalhadas.

### Deploy Rápido

1. Conecte o repositório na Vercel
2. Configure as variáveis de ambiente
3. Configure o banco PostgreSQL
4. Deploy automático via Git

## 📁 Estrutura de Workspaces

### Backend (`/backend`)
- API REST com Express
- Prisma para ORM
- SQLite como banco de dados
- Endpoints para gerenciar dívidas, salário, poupança e planejamento

### Mobile (`/mobile`)
- App React Native multiplataforma
- Navegação com React Navigation
- Dashboard com gráficos
- Integração com API do backend

## 🔧 Desenvolvimento

### Adicionar nova dependência

**No workspace específico:**
```bash
cd backend
npm install nome-do-pacote

# ou
cd mobile
npm install nome-do-pacote
```

**Na raiz (dependência compartilhada):**
```bash
npm install nome-do-pacote -w
```

### Executar comandos em workspace específico

```bash
# Backend
npm run dev --filter=backend

# Mobile
npm run dev --filter=mobile
```

## 📝 Documentação Adicional

- [Backend Setup](./backend/SETUP.md) - Guia detalhado de configuração do SQLite
- [Backend README](./backend/README.md) - Documentação da API

## 🤝 Contribuindo

1. Faça fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

ISC
