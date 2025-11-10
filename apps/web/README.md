# Projeto Financeiro - Web

Aplicação web para gestão financeira pessoal, construída com Next.js.

## Tecnologias

- Next.js 15
- React 19
- Victory (gráficos)
- CSS Modules

## Como executar

### Desenvolvimento

```bash
npm install
npm run dev
```

A aplicação estará disponível em `http://localhost:3000`

### Build de produção

```bash
npm run build
npm start
```

## Estrutura do projeto

```
mobile/
├── app/              # Páginas Next.js (App Router)
│   ├── layout.js     # Layout principal
│   ├── page.js       # Dashboard
│   ├── dividas/      # Página de dívidas
│   ├── salario/      # Página de salário
│   ├── poupanca/     # Página de poupança
│   └── planejamento/ # Página de planejamento
├── src/
│   ├── components/   # Componentes React
│   ├── hooks/        # Custom hooks
│   ├── services/     # Serviços (API, cache)
│   └── utils/        # Utilitários
└── public/           # Arquivos estáticos
```

## Variáveis de ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```
NEXT_PUBLIC_API_URL=http://localhost:3333/api
```

## Scripts disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Cria build de produção
- `npm start` - Inicia servidor de produção
- `npm run lint` - Executa o linter

