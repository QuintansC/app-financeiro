const { v4: uuid } = require('uuid');
const {
  getAllData,
  upsertDebt,
  deleteDebt,
  updateSalary,
  updateSavings,
  updateMonth,
} = require('../database/dataStore');

async function getAllDataService() {
  return await getAllData();
}

async function upsertDebtService(debt) {
  const id = debt.id || uuid();
  return await upsertDebt({ ...debt, id });
}

async function deleteDebtService(id) {
  await deleteDebt(id);
}

async function updateSalaryService(payload) {
  return await updateSalary(payload);
}

async function updateSavingsService(payload) {
  return await updateSavings(payload);
}

async function updateMonthService(monthEntry) {
  return await updateMonth(monthEntry);
}

module.exports = {
  getAllData: getAllDataService,
  upsertDebt: upsertDebtService,
  deleteDebt: deleteDebtService,
  updateSalary: updateSalaryService,
  updateSavings: updateSavingsService,
  updateMonth: updateMonthService,
};

