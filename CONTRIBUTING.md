# Guia de Contribuição

## Desenvolvimento com Turbo

Este projeto usa Turbo para gerenciar o monorepo. O Turbo otimiza builds e execução de tarefas através de cache inteligente.

### Conceitos Principais

1. **Pipeline**: Define como as tarefas se relacionam
2. **Cache**: Turbo cacheia resultados de tarefas para acelerar execuções futuras
3. **Dependências**: Tarefas podem depender de outras tarefas em outros workspaces

### Comandos Úteis

```bash
# Ver tarefas disponíveis
npx turbo run --help

# Executar tarefa específica em todos os workspaces
npx turbo run dev

# Executar tarefa em workspace específico
npx turbo run dev --filter=backend
npx turbo run dev --filter=mobile

# Limpar cache
npx turbo run clean

# Ver gráfico de dependências
npx turbo run build --graph
```

### Adicionar Nova Tarefa ao Pipeline

Edite `turbo.json` e adicione a nova tarefa:

```json
{
  "pipeline": {
    "nova-tarefa": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"]
    }
  }
}
```

### Cache

O Turbo cacheia automaticamente:
- Outputs de builds
- Resultados de testes
- Resultados de lint

Para invalidar o cache, use:
```bash
npx turbo run build --force
```

### Workspaces

Cada workspace (backend, mobile) pode ter suas próprias tarefas definidas no `package.json`. O Turbo executa essas tarefas respeitando as dependências definidas no `turbo.json`.

