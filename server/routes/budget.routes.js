const express = require('express');
const router = express.Router();
const Budget = require('../models/budget.model');
const auth = require('../middleware/auth');

// Get all budgets for user
router.get('/', auth, async (req, res) => {
  try {
    console.log('Fetching budgets for user:', req.user._id);
    const budgets = await Budget.find({ userId: req.user._id });
    res.json(budgets);
  } catch (error) {
    console.error('Error fetching budgets:', error);
    res.status(500).json({ message: error.message });
  }
});

// Create new budget
router.post('/', auth, async (req, res) => {
  try {
    const budget = new Budget({
      ...req.body,
      userId: req.user._id
    });
    console.log('Creating budget:', budget);
    const newBudget = await budget.save();
    res.status(201).json(newBudget);
  } catch (error) {
    console.error('Error creating budget:', error);
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;