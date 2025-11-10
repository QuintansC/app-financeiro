function calculateDebtTotals(debts = []) {
  const totals = debts.reduce(
    (acc, debt) => {
      const remaining = Math.max(debt.totalValue - (debt.paidValue || 0), 0);
      const remainingInstallments = Math.max(debt.installments - (debt.paidInstallments || 0), 0);
      acc.total += debt.totalValue || 0;
      acc.paid += debt.paidValue || 0;
      acc.remaining += remaining;
      acc.installmentValue += debt.installmentValue || 0;
      acc.remainingInstallments += remainingInstallments;
      return acc;
    },
    { total: 0, paid: 0, remaining: 0, installmentValue: 0, remainingInstallments: 0 },
  );

  return {
    ...totals,
    averageInstallment: totals.remainingInstallments > 0
      ? totals.remaining / totals.remainingInstallments
      : 0,
  };
}

function calculateSummary(data) {
  const { debts = [], salary = {}, savings = {} } = data;
  const debtsTotals = calculateDebtTotals(debts);

  const netIncome = (salary.monthlyIncome || 0) - (salary.discounts || 0);
  const availableAfterDebts = netIncome - debtsTotals.installmentValue;

  return {
    debtsTotals,
    salary: {
      monthlyIncome: salary.monthlyIncome || 0,
      discounts: salary.discounts || 0,
      netIncome,
      hasThirteenth: Boolean(salary.thirteenth),
      hasVacation: Boolean(salary.vacation),
    },
    savings: {
      savedBalance: savings.savedBalance || 0,
      currentGoal: savings.currentGoal || 0,
      progress: savings.currentGoal
        ? (savings.savedBalance || 0) / (savings.currentGoal || 1)
        : 0,
      lastSavedAt: savings.lastSavedAt || null,
    },
    cashFlow: {
      availableAfterDebts,
      isNegative: availableAfterDebts < 0,
    },
  };
}

module.exports = {
  calculateDebtTotals,
  calculateSummary,
};

