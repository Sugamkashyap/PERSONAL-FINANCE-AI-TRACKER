import axios from 'axios';
import { getAuth } from 'firebase/auth';

class ApiService {
  constructor() {
    this.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
    this.api = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add token to requests automatically
    this.api.interceptors.request.use(async (config) => {
      const auth = getAuth();
      const user = auth.currentUser;
      if (user) {
        const token = await user.getIdToken();
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  }

  // Transaction Methods
  async addTransaction(transaction) {
    try {
      const response = await this.api.post('/transactions', transaction);
      return response.data;
    } catch (error) {
      console.error('Error adding transaction:', error);
      throw error;
    }
  }

  async getTransactions(filters = {}) {
    try {
      const params = new URLSearchParams();
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);
      if (filters.category) params.append('category', filters.category);

      const response = await this.api.get('/transactions', { params });
      return response.data;
    } catch (error) {
      console.error('Error getting transactions:', error);
      throw error;
    }
  }

  // Budget Methods
  async setBudget(budget) {
    try {
      const response = await this.api.post('/budget', budget);
      return response.data;
    } catch (error) {
      console.error('Error setting budget:', error);
      throw error;
    }
  }

  async getBudget() {
    try {
      const response = await this.api.get('/budget');
      return response.data;
    } catch (error) {
      console.error('Error getting budget:', error);
      throw error;
    }
  }

  // Category Methods
  async getCategories() {
    try {
      const response = await this.api.get('/categories');
      return response.data;
    } catch (error) {
      console.error('Error getting categories:', error);
      throw error;
    }
  }

  async addCategory(category) {
    try {
      const response = await this.api.post('/categories', category);
      return response.data;
    } catch (error) {
      console.error('Error adding category:', error);
      throw error;
    }
  }
}

export default new ApiService();
