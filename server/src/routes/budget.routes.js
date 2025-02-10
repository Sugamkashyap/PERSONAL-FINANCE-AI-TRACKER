const express = require('express');
const router = express.Router();
const Budget = require('../models/budget.model');
const auth = require('../middleware/auth');

// Get all budgets for a user
router.get('/', auth, async (req, res) => {
  try {
    const budgets = await Budget.find({ userId: req.user.uid });
    res.json(budgets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new budget
router.post('/', auth, async (req, res) => {
  try {
    const budget = new Budget({
      userId: req.user.uid,
      category: req.body.category,
      amount: req.body.amount,
      period: req.body.period,
      startDate: req.body.startDate,
      notifications: req.body.notifications
    });

    const newBudget = await budget.save();
    res.status(201).json(newBudget);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get a specific budget
router.get('/:id', auth, async (req, res) => {
  try {
    const budget = await Budget.findOne({ _id: req.params.id, userId: req.user.uid });
    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' });
    }
    res.json(budget);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a budget
router.put('/:id', auth, async (req, res) => {
  try {
    const budget = await Budget.findOne({ _id: req.params.id, userId: req.user.uid });
    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' });
    }

    const updates = {
      category: req.body.category,
      amount: req.body.amount,
      period: req.body.period,
      startDate: req.body.startDate,
      notifications: req.body.notifications
    };

    const updatedBudget = await Budget.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true }
    );

    res.json(updatedBudget);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a budget
router.delete('/:id', auth, async (req, res) => {
  try {
    const budget = await Budget.findOne({ _id: req.params.id, userId: req.user.uid });
    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' });
    }

    await Budget.findByIdAndDelete(req.params.id);
    res.json({ message: 'Budget deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get budget statistics
router.get('/stats/overview', auth, async (req, res) => {
  try {
    const budgets = await Budget.find({ userId: req.user.uid });
    
    const stats = {
      totalBudget: 0,
      activeBudgets: 0,
      categoryCounts: {},
      periodDistribution: {
        monthly: 0,
        yearly: 0
      }
    };

    budgets.forEach(budget => {
      stats.totalBudget += budget.amount;
      stats.activeBudgets++;
      stats.categoryCounts[budget.category] = (stats.categoryCounts[budget.category] || 0) + 1;
      stats.periodDistribution[budget.period]++;
    });

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
