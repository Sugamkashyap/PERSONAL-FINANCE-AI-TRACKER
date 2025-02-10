const { initializeFirebase } = require('../config/firebase');
const admin = initializeFirebase();

class FirebaseService {
  // User Authentication Methods
  async createUser(email, password, displayName) {
    try {
      const userRecord = await admin.auth().createUser({
        email,
        password,
        displayName,
      });
      
      // Create a user document in Firestore
      await admin.firestore().collection('users').doc(userRecord.uid).set({
        email: userRecord.email,
        displayName: userRecord.displayName,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      
      return userRecord;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  // Transaction Methods
  async addTransaction(userId, transaction) {
    try {
      const transactionRef = admin.firestore().collection('users').doc(userId)
        .collection('transactions');
      
      const newTransaction = {
        ...transaction,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      };
      
      const docRef = await transactionRef.add(newTransaction);
      return { id: docRef.id, ...newTransaction };
    } catch (error) {
      console.error('Error adding transaction:', error);
      throw error;
    }
  }

  async getTransactions(userId, filters = {}) {
    try {
      let query = admin.firestore().collection('users').doc(userId)
        .collection('transactions');
      
      // Apply filters
      if (filters.startDate) {
        query = query.where('date', '>=', filters.startDate);
      }
      if (filters.endDate) {
        query = query.where('date', '<=', filters.endDate);
      }
      if (filters.category) {
        query = query.where('category', '==', filters.category);
      }
      
      // Order by date
      query = query.orderBy('date', 'desc');
      
      const snapshot = await query.get();
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting transactions:', error);
      throw error;
    }
  }

  // Budget Methods
  async setBudget(userId, budget) {
    try {
      const budgetRef = admin.firestore().collection('users').doc(userId)
        .collection('budgets').doc('current');
      
      const newBudget = {
        ...budget,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      };
      
      await budgetRef.set(newBudget);
      return newBudget;
    } catch (error) {
      console.error('Error setting budget:', error);
      throw error;
    }
  }

  async getBudget(userId) {
    try {
      const budgetRef = admin.firestore().collection('users').doc(userId)
        .collection('budgets').doc('current');
      
      const doc = await budgetRef.get();
      if (!doc.exists) {
        return null;
      }
      return { id: doc.id, ...doc.data() };
    } catch (error) {
      console.error('Error getting budget:', error);
      throw error;
    }
  }

  // Category Methods
  async getCategories(userId) {
    try {
      const categoriesRef = admin.firestore().collection('users').doc(userId)
        .collection('categories');
      
      const snapshot = await categoriesRef.get();
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting categories:', error);
      throw error;
    }
  }

  async addCategory(userId, category) {
    try {
      const categoriesRef = admin.firestore().collection('users').doc(userId)
        .collection('categories');
      
      const newCategory = {
        ...category,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      };
      
      const docRef = await categoriesRef.add(newCategory);
      return { id: docRef.id, ...newCategory };
    } catch (error) {
      console.error('Error adding category:', error);
      throw error;
    }
  }
}

module.exports = new FirebaseService();
