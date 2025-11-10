// Configuração centralizada de rotas do sistema
// Quando adicionar novas rotas aqui, elas estarão disponíveis automaticamente
// no menu de navegação e nas ações rápidas

export const navItems = [
  { href: '/', label: 'Dashboard', icon: '📊' },
  { href: '/dividas', label: 'Dívidas', icon: '💳' },
  { href: '/salario', label: 'Salário', icon: '💰' },
  { href: '/poupanca', label: 'Poupança', icon: '🏦' },
  { href: '/planejamento', label: 'Planejamento', icon: '📅' },
];

// Extrair apenas as rotas válidas (excluindo a rota raiz /)
export const validRoutes = navItems
  .map(item => item.href)
  .filter(href => href !== '/'); // Excluir dashboard da lista de rotas válidas para ações rápidas

