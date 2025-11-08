const { v4: uuid } = require('uuid');
const { readData, writeData } = require('../database/dataStore');
const { calculateSummary } = require('../utils/calculations');

async function getAllData() {
  const data = await readData();
  return {
    ...data,
    summary: calculateSummary(data),
  };
}

async function upsertDebt(debt) {
  const data = await readData();
  const id = debt.id || uuid();
  const normalizedDebt = {
    id,
    creditor: debt.creditor,
    totalValue: Number(debt.totalValue) || 0,
    paidValue: Number(debt.paidValue) || 0,
    installments: Number(debt.installments) || 0,
    paidInstallments: Number(debt.paidInstallments) || 0,
    installmentValue: Number(debt.installmentValue) || 0,
    dueDay: debt.dueDay !== undefined ? Number(debt.dueDay) : null,
    firstInstallmentValue: debt.firstInstallmentValue != null
      ? Number(debt.firstInstallmentValue)
      : null,
    notes: debt.notes || '',
  };

  const index = data.debts.findIndex((item) => item.id === id);
  if (index >= 0) {
    data.debts[index] = normalizedDebt;
  } else {
    data.debts.push(normalizedDebt);
  }

  await writeData(data);
  return normalizedDebt;
}

async function deleteDebt(id) {
  const data = await readData();
  data.debts = data.debts.filter((debt) => debt.id !== id);
  await writeData(data);
}

async function updateSalary(payload) {
  const data = await readData();
  data.salary = {
    monthlyIncome: Number(payload.monthlyIncome) || 0,
    discounts: Number(payload.discounts) || 0,
    thirteenth: Boolean(payload.thirteenth),
    vacation: Boolean(payload.vacation),
  };
  await writeData(data);
  return data.salary;
}

async function updateSavings(payload) {
  const data = await readData();
  data.savings = {
    savedBalance: Number(payload.savedBalance) || 0,
    currentGoal: Number(payload.currentGoal) || 0,
    lastSavedAt: payload.lastSavedAt || new Date().toISOString(),
    notes: payload.notes || '',
  };
  await writeData(data);
  return data.savings;
}

async function updateMonth(monthEntry) {
  const data = await readData();
  const index = data.months.findIndex((item) => item.id === monthEntry.id);
  const normalized = {
    id: monthEntry.id,
    label: monthEntry.label || monthEntry.id,
    total: Number(monthEntry.total) || 0,
  };
  if (index >= 0) {
    data.months[index] = normalized;
  } else {
    data.months.push(normalized);
  }
  await writeData(data);
  return normalized;
}

module.exports = {
  getAllData,
  upsertDebt,
  deleteDebt,
  updateSalary,
  updateSavings,
  updateMonth,
};

