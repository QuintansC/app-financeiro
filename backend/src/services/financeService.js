const { v4: uuid } = require('uuid');
const {
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

async function updateUserPreferencesService(preferences) {
  return await updateUserPreferences(preferences);
}

async function syncQuickActionsService(actions) {
  return await syncQuickActions(actions);
}

async function updateQuickActionsOrderService(routeOrder) {
  return await updateQuickActionsOrder(routeOrder);
}

async function removeQuickActionService(route) {
  return await removeQuickAction(route);
}

async function updateUserService(userData) {
  return await updateUser(userData);
}

module.exports = {
  getAllData: getAllDataService,
  upsertDebt: upsertDebtService,
  deleteDebt: deleteDebtService,
  updateSalary: updateSalaryService,
  updateSavings: updateSavingsService,
  updateMonth: updateMonthService,
  updateUserPreferences: updateUserPreferencesService,
  syncQuickActions: syncQuickActionsService,
  updateQuickActionsOrder: updateQuickActionsOrderService,
  removeQuickAction: removeQuickActionService,
  updateUser: updateUserService,
};

