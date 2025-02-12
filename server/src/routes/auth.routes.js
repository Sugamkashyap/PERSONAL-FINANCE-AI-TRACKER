const express = require('express');
const router = express.Router();
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');

// Get user profile
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findOne({ firebaseUid: req.user.uid });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update user profile
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const { displayName, preferences } = req.body;
    const user = await User.findOne({ firebaseUid: req.user.uid });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (displayName) {
      user.displayName = displayName;
    }

    if (preferences) {
      // Update currency
      if (preferences.currency) {
        user.preferences.currency = preferences.currency;
      }

      // Update theme
      if (preferences.theme) {
        user.preferences.theme = preferences.theme;
      }

      // Update notifications
      if (preferences.notifications) {
        user.preferences.notifications = {
          ...user.preferences.notifications,
          ...preferences.notifications
        };
      }

      // Update categories
      if (preferences.categories) {
        // Handle income categories
        if (preferences.categories.income) {
          user.preferences.categories.income = [
            ...new Set([...user.preferences.categories.income, ...preferences.categories.income])
          ];
        }

        // Handle expense categories
        if (preferences.categories.expense) {
          user.preferences.categories.expense = [
            ...new Set([...user.preferences.categories.expense, ...preferences.categories.expense])
          ];
        }
      }
    }

    await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Remove category
router.delete('/profile/categories/:type/:category', authMiddleware, async (req, res) => {
  try {
    const { type, category } = req.params;
    const user = await User.findOne({ firebaseUid: req.user.uid });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!['income', 'expense'].includes(type)) {
      return res.status(400).json({ message: 'Invalid category type' });
    }

    user.preferences.categories[type] = user.preferences.categories[type].filter(
      cat => cat !== category
    );

    await user.save();
    res.json(user.preferences.categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new user profile
router.post('/profile', authMiddleware, async (req, res) => {
  try {
    // Check if user already exists
    let user = await User.findOne({ firebaseUid: req.user.uid });
    
    if (user) {
      return res.status(400).json({ message: 'User profile already exists' });
    }

    // Create new user
    user = new User({
      firebaseUid: req.user.uid,
      email: req.user.email,
      displayName: req.user.displayName || '',
      preferences: {
        currency: 'USD',
        theme: 'light',
        notifications: {
          email: true,
          push: true,
          budgetAlerts: true,
          weeklyReport: true
        }
      }
    });

    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete user profile
router.delete('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findOneAndDelete({ firebaseUid: req.user.uid });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User profile deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
