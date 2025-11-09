const prisma = require('./prisma');
const { calculateSummary } = require('../utils/calculations');

async function getAllData() {
  const [debts, salary, savings, months] = await Promise.all([
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

module.exports = {
  getAllData,
  upsertDebt,
  deleteDebt,
  updateSalary,
  updateSavings,
  updateMonth,
};
