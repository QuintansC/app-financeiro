const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const defaultData = {
  debts: [
    {
      id: 'itau',
      creditor: 'Itau',
      totalValue: 887.28,
      paidValue: 739.4,
      installments: 12,
      paidInstallments: 2,
      installmentValue: 73.94,
      dueDay: 11,
      firstInstallmentValue: 270.27,
      notes: '',
    },
    {
      id: 'santander',
      creditor: 'Santander',
      totalValue: 1055.8,
      paidValue: 0,
      installments: 5,
      paidInstallments: 0,
      installmentValue: 211.16,
      dueDay: 11,
      firstInstallmentValue: null,
      notes: '',
    },
    {
      id: 'financiamento',
      creditor: 'Imobiliaria/Financiamento',
      totalValue: 15494.65,
      paidValue: 0,
      installments: 7,
      paidInstallments: 0,
      installmentValue: 2084.95,
      dueDay: 0,
      firstInstallmentValue: null,
      notes: '',
    },
    {
      id: 'lojas-cem',
      creditor: 'Lojas CEM',
      totalValue: 2500,
      paidValue: 0,
      installments: 10,
      paidInstallments: 0,
      installmentValue: 130,
      dueDay: 0,
      firstInstallmentValue: null,
      notes: '',
    },
    {
      id: 'casas-bahia',
      creditor: 'Casas Bahia',
      totalValue: 3353.3,
      paidValue: 0,
      installments: 6,
      paidInstallments: 0,
      installmentValue: 550.56,
      dueDay: 11,
      firstInstallmentValue: null,
      notes: '',
    },
    {
      id: 'nubank',
      creditor: 'Nubank',
      totalValue: 217.94,
      paidValue: 0,
      installments: 2,
      paidInstallments: 0,
      installmentValue: 108.97,
      dueDay: 11,
      firstInstallmentValue: null,
      notes: '',
    },
    {
      id: 'faculdade',
      creditor: 'Faculdade',
      totalValue: 900,
      paidValue: 0,
      installments: 4,
      paidInstallments: 0,
      installmentValue: 400,
      dueDay: 11,
      firstInstallmentValue: null,
      notes: '',
    },
    {
      id: 'magazine-luiza',
      creditor: 'Magazine Luiza',
      totalValue: 2000,
      paidValue: 0,
      installments: 12,
      paidInstallments: 0,
      installmentValue: 133,
      dueDay: 11,
      firstInstallmentValue: null,
      notes: '',
    },
    {
      id: 'recarga-pay',
      creditor: 'Recarga Pay',
      totalValue: 300,
      paidValue: 0,
      installments: 2,
      paidInstallments: 0,
      installmentValue: 192,
      dueDay: 11,
      firstInstallmentValue: null,
      notes: '',
    },
  ],
  salary: {
    monthlyIncome: 5900,
    discounts: 1000,
    thirteenth: true,
    vacation: true,
  },
  savings: {
    savedBalance: 100,
    currentGoal: 100,
    lastSavedAt: null,
    notes: '',
  },
  months: [
    { id: '2026-01', label: 'janeiro/2026', total: 0 },
    { id: '2026-02', label: 'fevereiro/2026', total: 0 },
    { id: '2026-03', label: 'marco/2026', total: 0 },
    { id: '2026-04', label: 'abril/2026', total: 0 },
    { id: '2026-05', label: 'maio/2026', total: 0 },
    { id: '2026-06', label: 'junho/2026', total: 0 },
    { id: '2026-07', label: 'julho/2026', total: 0 },
    { id: '2026-08', label: 'agosto/2026', total: 0 },
    { id: '2026-09', label: 'setembro/2026', total: 0 },
    { id: '2026-10', label: 'outubro/2026', total: 0 },
  ],
};

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  // Limpar dados existentes
  await prisma.debt.deleteMany();
  await prisma.month.deleteMany();
  await prisma.salary.deleteMany();
  await prisma.savings.deleteMany();

  // Criar dívidas
  for (const debt of defaultData.debts) {
    await prisma.debt.create({
      data: debt,
    });
  }
  console.log(`✅ ${defaultData.debts.length} dívidas criadas`);

  // Criar salário
  await prisma.salary.create({
    data: {
      id: 'single',
      ...defaultData.salary,
    },
  });
  console.log('✅ Salário criado');

  // Criar poupança
  await prisma.savings.create({
    data: {
      id: 'single',
      ...defaultData.savings,
    },
  });
  console.log('✅ Poupança criada');

  // Criar meses
  for (const month of defaultData.months) {
    await prisma.month.create({
      data: month,
    });
  }
  console.log(`✅ ${defaultData.months.length} meses criados`);

  console.log('✨ Seed concluído com sucesso!');
}

main()
  .catch((e) => {
    console.error('❌ Erro ao executar seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

