const prisma = require('./prisma');
const { calculateSummary } = require('../utils/calculations');

async function getAllData() {
  const [debts, salary, savings, months, preferences, quickActions, user] = await Promise.all([
    prisma.debt.findMany({
      orderBy: { createdAt: 'asc' },
    }),
    prisma.salary.findUnique({
      where: { id: 'single' },
    }),
    prisma.savings.findUnique({
      where: { id: 'single' },
    }),
    prisma.month.findMany({
      orderBy: { id: 'asc' },
    }),
    prisma.userPreferences.findUnique({
      where: { id: 'single' },
    }),
    prisma.quickAction.findMany({
      orderBy: { order: 'asc' },
    }),
    prisma.user.findUnique({
      where: { id: 'single' },
    }),
  ]);

  const data = {
    debts: debts.map(debt => ({
      id: debt.id,
      creditor: debt.creditor,
      totalValue: debt.totalValue,
      paidValue: debt.paidValue,
      installments: debt.installments,
      paidInstallments: debt.paidInstallments,
      installmentValue: debt.installmentValue,
      dueDay: debt.dueDay,
      firstInstallmentValue: debt.firstInstallmentValue,
      notes: debt.notes,
    })),
    salary: salary ? {
      monthlyIncome: salary.monthlyIncome,
      discounts: salary.discounts,
      thirteenth: salary.thirteenth,
      vacation: salary.vacation,
    } : {
      monthlyIncome: 0,
      discounts: 0,
      thirteenth: false,
      vacation: false,
    },
    savings: savings ? {
      savedBalance: savings.savedBalance,
      currentGoal: savings.currentGoal,
      lastSavedAt: savings.lastSavedAt ? savings.lastSavedAt.toISOString() : null,
      notes: savings.notes,
    } : {
      savedBalance: 0,
      currentGoal: 0,
      lastSavedAt: null,
      notes: '',
    },
    months: months.map(month => ({
      id: month.id,
      label: month.label,
      total: month.total,
    })),
    preferences: preferences ? {
      debtsStatusFilter: preferences.debtsStatusFilter,
      debtsSortBy: preferences.debtsSortBy,
      debtsViewMode: preferences.debtsViewMode,
    } : {
      debtsStatusFilter: 'all',
      debtsSortBy: 'status',
      debtsViewMode: 'list',
    },
    quickActions: quickActions.map(action => ({
      id: action.id,
      label: action.label,
      icon: action.icon,
      route: action.route,
      order: action.order,
      isDefault: action.isDefault,
    })),
    user: user ? {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      avatar: user.avatar,
    } : {
      id: 'single',
      name: '',
      email: '',
      phone: '',
      avatar: '',
    },
  };

  return {
    ...data,
    summary: calculateSummary(data),
  };
}

async function upsertDebt(debtData) {
  const id = debtData.id;
  
  // Função auxiliar para converter valores numéricos de forma segura
  // Suporta tanto ponto quanto vírgula como separador decimal
  const toNumber = (value) => {
    if (value === null || value === undefined || value === '') return 0;
    
    // Se for string, substituir vírgula por ponto (formato brasileiro)
    const normalizedValue = typeof value === 'string' 
      ? value.replace(',', '.') 
      : value;
    
    const num = Number(normalizedValue);
    return isNaN(num) ? 0 : num;
  };

  const normalizedDebt = {
    creditor: debtData.creditor || '',
    totalValue: toNumber(debtData.totalValue),
    paidValue: toNumber(debtData.paidValue),
    installments: toNumber(debtData.installments),
    paidInstallments: toNumber(debtData.paidInstallments),
    installmentValue: toNumber(debtData.installmentValue),
    dueDay: debtData.dueDay !== undefined && debtData.dueDay !== null && debtData.dueDay !== ''
      ? Number(debtData.dueDay)
      : null,
    firstInstallmentValue: debtData.firstInstallmentValue != null && debtData.firstInstallmentValue !== ''
      ? toNumber(debtData.firstInstallmentValue)
      : null,
    notes: debtData.notes || '',
  };

  if (id) {
    const debt = await prisma.debt.upsert({
      where: { id },
      update: normalizedDebt,
      create: {
        id,
        ...normalizedDebt,
      },
    });
    return debt;
  }

  const debt = await prisma.debt.create({
    data: normalizedDebt,
  });
  return debt;
}

async function deleteDebt(id) {
  await prisma.debt.delete({
    where: { id },
  });
}

async function updateSalary(payload) {
  const salary = await prisma.salary.upsert({
    where: { id: 'single' },
    update: {
      monthlyIncome: Number(payload.monthlyIncome) || 0,
      discounts: Number(payload.discounts) || 0,
      thirteenth: Boolean(payload.thirteenth),
      vacation: Boolean(payload.vacation),
    },
    create: {
      id: 'single',
      monthlyIncome: Number(payload.monthlyIncome) || 0,
      discounts: Number(payload.discounts) || 0,
      thirteenth: Boolean(payload.thirteenth),
      vacation: Boolean(payload.vacation),
    },
  });
  return salary;
}

async function updateSavings(payload) {
  const updateData = {
    savedBalance: Number(payload.savedBalance) || 0,
    currentGoal: Number(payload.currentGoal) || 0,
    notes: payload.notes || '',
  };

  // Só atualiza lastSavedAt se for fornecido
  if (payload.lastSavedAt !== undefined) {
    updateData.lastSavedAt = payload.lastSavedAt ? new Date(payload.lastSavedAt) : null;
  }

  const savings = await prisma.savings.upsert({
    where: { id: 'single' },
    update: updateData,
    create: {
      id: 'single',
      ...updateData,
      lastSavedAt: payload.lastSavedAt ? new Date(payload.lastSavedAt) : null,
    },
  });
  return savings;
}

async function updateMonth(monthEntry) {
  const month = await prisma.month.upsert({
    where: { id: monthEntry.id },
    update: {
      label: monthEntry.label || monthEntry.id,
      total: Number(monthEntry.total) || 0,
    },
    create: {
      id: monthEntry.id,
      label: monthEntry.label || monthEntry.id,
      total: Number(monthEntry.total) || 0,
    },
  });
  return month;
}

async function updateUserPreferences(preferencesData) {
  const preferences = await prisma.userPreferences.upsert({
    where: { id: 'single' },
    update: {
      debtsStatusFilter: preferencesData.debtsStatusFilter || 'all',
      debtsSortBy: preferencesData.debtsSortBy || 'status',
      debtsViewMode: preferencesData.debtsViewMode || 'list',
    },
    create: {
      id: 'single',
      debtsStatusFilter: preferencesData.debtsStatusFilter || 'all',
      debtsSortBy: preferencesData.debtsSortBy || 'status',
      debtsViewMode: preferencesData.debtsViewMode || 'list',
    },
  });
  return preferences;
}

async function syncQuickActions(actionsData) {
  // Verificar e criar ações padrão se não existirem
  const defaultActionsData = [
    { label: 'Dívidas', icon: '💳', route: '/dividas' },
    { label: 'Salário', icon: '💰', route: '/salario' },
    { label: 'Poupança', icon: '🏦', route: '/poupanca' },
    { label: 'Planejamento', icon: '📅', route: '/planejamento' },
  ];

  for (const defaultAction of defaultActionsData) {
    const exists = await prisma.quickAction.findFirst({
      where: {
        route: defaultAction.route,
        isDefault: true,
      },
    });

    if (!exists) {
      await prisma.quickAction.create({
        data: {
          label: defaultAction.label,
          icon: defaultAction.icon,
          route: defaultAction.route,
          order: defaultActionsData.indexOf(defaultAction),
          isDefault: true,
        },
      });
    }
  }

  // Deletar todas as ações customizadas existentes
  await prisma.quickAction.deleteMany({
    where: {
      isDefault: false,
    },
  });

  // Criar/atualizar ações baseado nos dados recebidos
  const result = [];
  for (let i = 0; i < actionsData.length; i++) {
    const action = actionsData[i];
    
    if (action.isDefault) {
      // Atualizar ação padrão existente (ordem)
      const existing = await prisma.quickAction.findFirst({
        where: {
          route: action.route,
          isDefault: true,
        },
      });
      
      if (existing) {
        const updated = await prisma.quickAction.update({
          where: { id: existing.id },
          data: {
            order: action.order !== undefined ? action.order : i,
          },
        });
        result.push(updated);
      }
    } else {
      // Criar ação customizada
      const newAction = await prisma.quickAction.create({
        data: {
          label: action.label,
          icon: action.icon,
          route: action.route,
          order: action.order !== undefined ? action.order : i,
          isDefault: false,
        },
      });
      result.push(newAction);
    }
  }

  return result;
}

async function updateQuickActionsOrder(routeOrder) {
  // Atualizar a ordem das ações baseado na lista de rotas
  const actions = await prisma.quickAction.findMany();
  
  for (let i = 0; i < routeOrder.length; i++) {
    const route = routeOrder[i];
    const action = actions.find(a => a.route === route);
    if (action) {
      await prisma.quickAction.update({
        where: { id: action.id },
        data: { order: i },
      });
    }
  }

  return await prisma.quickAction.findMany({
    orderBy: { order: 'asc' },
  });
}

async function removeQuickAction(route) {
  // Verificar se é ação padrão ou customizada
  const action = await prisma.quickAction.findFirst({
    where: { route: route },
  });
  
  if (action) {
    if (action.isDefault) {
      // Para ações padrão, apenas atualizamos a ordem para -1 (ocultar)
      await prisma.quickAction.update({
        where: { id: action.id },
        data: { order: -1 },
      });
    } else {
      // Para ações customizadas, deletar completamente
      await prisma.quickAction.delete({
        where: { id: action.id },
      });
    }
  }
}

async function updateUser(userData) {
  const user = await prisma.user.upsert({
    where: { id: 'single' },
    update: {
      name: userData.name || '',
      email: userData.email || null,
      phone: userData.phone || null,
      avatar: userData.avatar || null,
    },
    create: {
      id: 'single',
      name: userData.name || '',
      email: userData.email || null,
      phone: userData.phone || null,
      avatar: userData.avatar || null,
    },
  });
  return user;
}

module.exports = {
  getAllData,
  upsertDebt,
  deleteDebt,
  updateSalary,
  updateSavings,
  updateMonth,
  updateUserPreferences,
  syncQuickActions,
  updateQuickActionsOrder,
  removeQuickAction,
  updateUser,
};
