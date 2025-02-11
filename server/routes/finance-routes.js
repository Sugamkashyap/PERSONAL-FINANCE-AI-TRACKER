const express = require('express');
const router = express.Router();
const firebaseService = require('../services/firebase-service');
const { getAdmin } = require('../config/firebase');

// Middleware to verify Firebase ID token
const authenticateUser = async (req, res, next) => {
  try {
    const idToken = req.headers.authorization?.split('Bearer ')[1];
    if (!idToken) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decodedToken = await getAdmin().auth().verifyIdToken(idToken);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('Error verifying token:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Apply authentication middleware to all routes
router.use(authenticateUser);

// Transaction routes
router.post('/transactions', async (req, res) => {
  try {
    const transaction = await firebaseService.addTransaction(req.user.uid, req.body);
    res.json(transaction);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/transactions', async (req, res) => {
  try {
    const { startDate, endDate, category } = req.query;
    const filters = {
      startDate: startDate ? new Date(startDate) : null,
      endDate: endDate ? new Date(endDate) : null,
      category
    };
    
    const transactions = await firebaseService.getTransactions(req.user.uid, filters);
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Budget routes
router.post('/budget', async (req, res) => {
  try {
    const budget = await firebaseService.setBudget(req.user.uid, req.body);
    res.json(budget);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/budget', async (req, res) => {
  try {
    const budget = await firebaseService.getBudget(req.user.uid);
    if (!budget) {
      return res.status(404).json({ error: 'Budget not found' });
    }
    res.json(budget);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Category routes
router.get('/categories', async (req, res) => {
  try {
    const categories = await firebaseService.getCategories(req.user.uid);
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/categories', async (req, res) => {
  try {
    const category = await firebaseService.addCategory(req.user.uid, req.body);
    res.json(category);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
