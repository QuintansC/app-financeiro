# Controle de Gastos – App Multiplataforma

Aplicação pessoal para acompanhar dívidas, salário, metas de poupança e planejamento mensal. O backend em Node.js expõe uma API REST simples com persistência em arquivo JSON e o frontend Expo (React Native) consome esses dados para entregar uma experiência multiplataforma (web/mobile).

## Estrutura

```
<<<<<<< Updated upstream
Projeto Planilha/
├── backend/   # API Node/Express
├── mobile/    # App Expo (React Native)
└── shared/    # Espaço reservado para módulos compartilhados futuros
=======
projeto-financeiro/
├── apps/
│   ├── backend/     # API Node.js com Express e Prisma
│   └── mobile/      # Aplicação web (Next.js)
└── package.json     # Configuração do monorepo
>>>>>>> Stashed changes
```

## Backend (Node.js + Express)

1. Acesse a pasta do backend e instale as dependências (já feito na primeira configuração):

   ```bash
   cd backend
   npm install
   ```

2. Crie um arquivo `.env` caso deseje alterar configurações padrão:

   ```bash
   PORT=3333
   DATA_FILE=C:\Users\artur\Projeto Planilha\backend\data\store.json
   ```

   Se não criar o arquivo, o servidor usa os valores padrão acima.

3. Execute em modo desenvolvimento (com recarga automática):

<<<<<<< Updated upstream
   ```bash
   npm run dev
   ```
=======
1. Crie um arquivo `.env` em `apps/backend/`:
```env
DATABASE_URL="file:./dev.db"
PORT=3333
NODE_ENV=development
```
>>>>>>> Stashed changes

   A API fica disponível em `http://localhost:3333`. Endpoints principais:

<<<<<<< Updated upstream
   - `GET /api/dados` – retorna dívidas, salário, poupança, meses e um resumo calculado.
   - `POST /api/dividas` – cria/atualiza uma dívida.
   - `DELETE /api/dividas/:id` – remove uma dívida.
   - `POST /api/salario` – atualiza salário/descontos.
   - `POST /api/poupanca` – atualiza dados da poupança.
   - `POST /api/meses` – atualiza totais planejados por mês.
=======
3. Execute as migrations:
```bash
cd apps/backend
npm run prisma:migrate
npm run prisma:seed
```
>>>>>>> Stashed changes

   Os dados ficam gravados em `backend/data/store.json`. O arquivo é criado automaticamente com valores iniciais iguais à planilha.

## Frontend (Expo / React Native)

<<<<<<< Updated upstream
1. Instale dependências (já concluído na criação do projeto, mas repita se necessário):

   ```bash
   cd mobile
   npm install
   ```
=======
**Apenas backend:** `npm run backend:dev`

**Apenas mobile:** `npm run mobile:dev`
>>>>>>> Stashed changes

2. Informe a URL da API através de variável pública do Expo. Crie um arquivo `mobile/.env`:

   ```bash
   EXPO_PUBLIC_API_URL=http://192.168.0.xxx:3333/api
   ```

   > **Importante:** use o IP da sua máquina se for testar no celular físico. Para rodar tudo no mesmo computador (Expo web ou emulador), `http://localhost:3333/api` funciona.

3. Inicie o app:

   ```bash
   npm start
   ```

   Escolha entre web, Android ou iOS (via Expo Go ou emuladores).

### Principais telas/fluxos

- **Dashboard**: mostra resumo de dívidas, salário líquido e status da poupança.
- **Dívidas**: lista todas as dívidas. Ao tocar em uma delas, abre o formulário preenchido para edição. Botão “Nova dívida” cria um novo registro.
- **Salário**: formulário para salário mensal, descontos, 13º e férias.
- **Poupança**: permite atualizar saldo guardado, meta e observações.
- **Meses**: lista meses planejados e permite atualizar o total de cada um.

As ações exibem mensagens rápidas de feedback e atualizam os dados automaticamente após cada operação.

## Próximos passos sugeridos

- Validar campos obrigatórios com mensagens mais detalhadas no frontend.
- Adicionar autenticação (ex: login simples) caso compartilhe o app.
- Criar gráficos (gastos x meses, evolução da poupança) usando bibliotecas como Victory Native ou Recharts (na web).
- Escrever testes automatizados para os cálculos do backend.

---

<<<<<<< Updated upstream
Qualquer dúvida ou nova funcionalidade que quiser adicionar, é só pedir! :)

=======
### Backend (`/apps/backend`)
- API REST com Express
- Prisma para ORM
- SQLite como banco de dados
- Endpoints para gerenciar dívidas, salário, poupança e planejamento

### Mobile (`/apps/mobile`)
- App React Native multiplataforma
- Navegação com React Navigation
- Dashboard com gráficos
- Integração com API do backend

## 🔧 Desenvolvimento

### Adicionar nova dependência

**No workspace específico:**
```bash
cd apps/backend
npm install nome-do-pacote

# ou
cd apps/mobile
npm install nome-do-pacote
```

**Na raiz (dependência compartilhada):**
```bash
npm install nome-do-pacote -w
```

### Executar comandos em workspace específico

```bash
# Backend
cd apps/backend
npm run dev

# Mobile
cd apps/mobile
npm run dev
```

## 📝 Documentação Adicional

- [Backend Setup](./apps/backend/SETUP.md) - Guia detalhado de configuração do SQLite
- [Backend README](./apps/backend/README.md) - Documentação da API

## 🤝 Contribuindo

1. Faça fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

ISC
>>>>>>> Stashed changes
