const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firebaseUid: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  displayName: {
    type: String,
    trim: true
  },
  preferences: {
    currency: {
      type: String,
      enum: ['USD', 'EUR', 'GBP', 'JPY', 'INR'],
      default: 'USD'
    },
    theme: {
      type: String,
      enum: ['light', 'dark', 'system'],
      default: 'light'
    },
    notifications: {
      email: {
        type: Boolean,
        default: true
      },
      push: {
        type: Boolean,
        default: true
      },
      budgetAlerts: {
        type: Boolean,
        default: true
      },
      weeklyReport: {
        type: Boolean,
        default: true
      }
    },
    categories: {
      income: [{
        type: String,
        trim: true
      }],
      expense: [{
        type: String,
        trim: true
      }]
    }
  },
  monthlyBudget: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Initialize default categories when creating a new user
userSchema.pre('save', function(next) {
  if (this.isNew) {
    const defaultCategories = {
      income: ['Salary', 'Freelance', 'Investments', 'Other'],
      expense: [
        'Food & Dining',
        'Shopping',
        'Transportation',
        'Bills & Utilities',
        'Entertainment',
        'Health & Fitness',
        'Travel',
        'Education',
        'Other'
      ]
    };

    if (!this.preferences) {
      this.preferences = {};
    }
    
    if (!this.preferences.categories) {
      this.preferences.categories = defaultCategories;
    }
  }
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
