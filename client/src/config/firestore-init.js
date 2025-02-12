import { db } from './firebase';
import { collection, getDocs, query, where, doc } from 'firebase/firestore';

// Default categories for new users
const defaultCategories = [
  { name: 'Food & Dining', type: 'expense', icon: '🍽️' },
  { name: 'Transportation', type: 'expense', icon: '🚗' },
  { name: 'Shopping', type: 'expense', icon: '🛍️' },
  { name: 'Bills & Utilities', type: 'expense', icon: '📱' },
  { name: 'Entertainment', type: 'expense', icon: '🎬' },
  { name: 'Health & Fitness', type: 'expense', icon: '💪' },
  { name: 'Travel', type: 'expense', icon: '✈️' },
  { name: 'Education', type: 'expense', icon: '📚' },
  { name: 'Salary', type: 'income', icon: '💰' },
  { name: 'Investments', type: 'income', icon: '📈' },
  { name: 'Freelance', type: 'income', icon: '💻' },
  { name: 'Others', type: 'both', icon: '📌' }
];

// Initialize collections for a new user
export const initializeUserData = async (userId) => {
  try {
    // Check if user already has categories
    const categoriesRef = collection(db, 'categories');
    const q = query(categoriesRef, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);

    // Only create default categories if user doesn't have any
    if (querySnapshot.empty) {
      console.log('Creating default categories for new user');
      const batch = db.batch();

      // Add default categories
      defaultCategories.forEach((category) => {
        const docRef = doc(categoriesRef);
        batch.set(docRef, {
          ...category,
          userId,
          createdAt: new Date(),
          isDefault: true
        });
      });

      // Create default budget
      const budgetRef = doc(collection(db, 'budgets'));
      batch.set(budgetRef, {
        userId,
        monthlyLimit: 0,
        categories: {},
        createdAt: new Date()
      });

      await batch.commit();
      console.log('Default data created successfully');
    }
  } catch (error) {
    console.error('Error initializing user data:', error);
    throw error;
  }
};

// Firestore collection names
export const COLLECTIONS = {
  TRANSACTIONS: 'transactions',
  BUDGETS: 'budgets',
  CATEGORIES: 'categories'
};
