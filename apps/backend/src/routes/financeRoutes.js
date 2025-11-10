const { Router } = require('express');
const financeService = require('../services/financeService');
const { authenticate } = require('../middleware/auth');

const router = Router();

// Todas as rotas financeiras requerem autenticação
router.use(authenticate);

router.get('/dados', async (req, res, next) => {
  try {
    const data = await financeService.getAllData();
    res.json(data);
  } catch (error) {
    next(error);
  }
});

router.post('/dividas', async (req, res, next) => {
  try {
    // Log para debug (apenas em desenvolvimento)
    if (process.env.NODE_ENV === 'development') {
      console.log('📥 Dados recebidos:', JSON.stringify(req.body, null, 2));
    }
    const created = await financeService.upsertDebt(req.body);
    if (process.env.NODE_ENV === 'development') {
      console.log('✅ Dívida salva:', JSON.stringify(created, null, 2));
    }
    res.status(201).json(created);
  } catch (error) {
    next(error);
  }
});

router.delete('/dividas/:id', async (req, res, next) => {
  try {
    await financeService.deleteDebt(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

router.post('/salario', async (req, res, next) => {
  try {
    const salary = await financeService.updateSalary(req.body);
    res.json(salary);
  } catch (error) {
    next(error);
  }
});

router.post('/poupanca', async (req, res, next) => {
  try {
    const savings = await financeService.updateSavings(req.body);
    res.json(savings);
  } catch (error) {
    next(error);
  }
});

router.post('/meses', async (req, res, next) => {
  try {
    const month = await financeService.updateMonth(req.body);
    res.status(201).json(month);
  } catch (error) {
    next(error);
  }
});

router.post('/preferencias', async (req, res, next) => {
  try {
    const preferences = await financeService.updateUserPreferences(req.body);
    res.json(preferences);
  } catch (error) {
    next(error);
  }
});

router.post('/acoes-rapidas', async (req, res, next) => {
  try {
    const actions = await financeService.syncQuickActions(req.body);
    res.json(actions);
  } catch (error) {
    next(error);
  }
});

router.post('/acoes-rapidas/ordem', async (req, res, next) => {
  try {
    const actions = await financeService.updateQuickActionsOrder(req.body.routeOrder || []);
    res.json(actions);
  } catch (error) {
    next(error);
  }
});

router.delete('/acoes-rapidas/:route', async (req, res, next) => {
  try {
    await financeService.removeQuickAction(req.params.route);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

router.post('/usuario', async (req, res, next) => {
  try {
    const user = await financeService.updateUser(req.body);
    res.json(user);
  } catch (error) {
    next(error);
  }
});

module.exports = router;

