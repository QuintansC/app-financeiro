const fs = require('fs/promises');
const { existsSync } = require('fs');
const path = require('path');
const { dataFile } = require('../config/env');

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

async function ensureDataFile() {
  const dir = path.dirname(dataFile);
  if (!existsSync(dir)) {
    await fs.mkdir(dir, { recursive: true });
  }

  if (!existsSync(dataFile)) {
    await fs.writeFile(dataFile, JSON.stringify(defaultData, null, 2), 'utf-8');
  }
}

async function readData() {
  await ensureDataFile();
  const raw = await fs.readFile(dataFile, 'utf-8');
  return JSON.parse(raw);
}

async function writeData(newData) {
  await ensureDataFile();
  await fs.writeFile(dataFile, JSON.stringify(newData, null, 2), 'utf-8');
  return newData;
}

module.exports = {
  readData,
  writeData,
};

