import { auth, db, COLLECTIONS } from '../config/firebase';
import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  Timestamp,
  limit,
  startAfter,
  serverTimestamp
} from 'firebase/firestore';

class ApiService {
  constructor() {
    this.transactionsRef = collection(db, COLLECTIONS.TRANSACTIONS);
    this.budgetsRef = collection(db, COLLECTIONS.BUDGETS);
    this.categoriesRef = collection(db, COLLECTIONS.CATEGORIES);
  }

  // Error handling helper
  handleError(error, operation) {
    console.error(`Error in ${operation}:`, error);
    if (error.code === 'permission-denied') {
      throw new Error('You do not have permission to perform this action');
    } else if (error.code === 'not-found') {
      throw new Error('The requested resource was not found');
    } else if (error.code === 'unauthenticated') {
      throw new Error('Please sign in to continue');
    } else {
      throw new Error(error.message || 'An unexpected error occurred');
    }
  }

  // Authentication check helper
  checkAuth() {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('User not authenticated');
    }
    return user;
  }

  // Transactions Methods
  async getTransactions(startAfterDoc = null, limit = 10) {
    try {
      const user = this.checkAuth();
      
      let q = query(
        this.transactionsRef,
        where('userId', '==', user.uid),
        orderBy('date', 'desc'),
        limit(limit)
      );

      if (startAfterDoc) {
        q = query(q, startAfter(startAfterDoc));
      }

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      this.handleError(error, 'getTransactions');
    }
  }

  async addTransaction(transactionData) {
    try {
      const user = this.checkAuth();
      
      const transaction = {
        ...transactionData,
        userId: user.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      const docRef = await addDoc(this.transactionsRef, transaction);
      return {
        id: docRef.id,
        ...transaction
      };
    } catch (error) {
      this.handleError(error, 'addTransaction');
    }
  }

  async updateTransaction(id, transactionData) {
    try {
      this.checkAuth();
      
      const transactionRef = doc(this.transactionsRef, id);
      const updateData = {
        ...transactionData,
        updatedAt: serverTimestamp()
      };

      await updateDoc(transactionRef, updateData);
      return {
        id,
        ...updateData
      };
    } catch (error) {
      this.handleError(error, 'updateTransaction');
    }
  }

  async deleteTransaction(id) {
    try {
      this.checkAuth();
      await deleteDoc(doc(this.transactionsRef, id));
    } catch (error) {
      this.handleError(error, 'deleteTransaction');
    }
  }

  // Budget Methods
  async getBudget() {
    try {
      const user = this.checkAuth();

      const q = query(
        this.budgetsRef,
        where('userId', '==', user.uid),
        orderBy('createdAt', 'desc'),
        limit(1)
      );

      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        return null;
      }

      const doc = querySnapshot.docs[0];
      return {
        id: doc.id,
        ...doc.data()
      };
    } catch (error) {
      this.handleError(error, 'getBudget');
    }
  }

  async setBudget(budgetData) {
    try {
      const user = this.checkAuth();

      const budget = {
        ...budgetData,
        userId: user.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      const docRef = await addDoc(this.budgetsRef, budget);
      return {
        id: docRef.id,
        ...budget
      };
    } catch (error) {
      this.handleError(error, 'setBudget');
    }
  }

  async updateBudget(id, budgetData) {
    try {
      this.checkAuth();

      const budgetRef = doc(this.budgetsRef, id);
      const updateData = {
        ...budgetData,
        updatedAt: serverTimestamp()
      };

      await updateDoc(budgetRef, updateData);
      return {
        id,
        ...updateData
      };
    } catch (error) {
      this.handleError(error, 'updateBudget');
    }
  }

  // Categories Methods
  async getCategories() {
    try {
      const user = this.checkAuth();

      const q = query(
        this.categoriesRef,
        where('userId', '==', user.uid),
        orderBy('name', 'asc')
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      this.handleError(error, 'getCategories');
    }
  }
}

export default new ApiService();
