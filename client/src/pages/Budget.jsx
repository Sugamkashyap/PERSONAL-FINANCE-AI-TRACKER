import React, { useState, useEffect } from 'react';
import apiService from '../services/api-service';
import Loading from '../components/Loading';
import { useAuth } from '../context/AuthContext';

const Budget = () => {
  const [budget, setBudget] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    monthlyLimit: '',
    categories: {}
  });

  const loadBudget = async (retryCount = 0) => {
    try {
      setLoading(true);
      setError(null);

      if (!user) {
        throw new Error('Please sign in to access budget settings');
      }

      const budgetData = await apiService.getBudget();
      
      if (budgetData) {
        setBudget(budgetData);
        setFormData({
          monthlyLimit: budgetData.monthlyLimit || '',
          categories: budgetData.categories || {}
        });
      } else {
        // If no budget exists, create a default one
        const defaultBudget = {
          monthlyLimit: 0,
          categories: {}
        };
        const newBudget = await apiService.setBudget(defaultBudget);
        setBudget(newBudget);
        setFormData({
          monthlyLimit: defaultBudget.monthlyLimit,
          categories: defaultBudget.categories
        });
      }
    } catch (err) {
      console.error('Error loading budget:', err);
      setError(err.message || 'Failed to load budget settings');
      
      // Retry logic for network errors
      if (retryCount < 3 && err.message.includes('network')) {
        setTimeout(() => {
          loadBudget(retryCount + 1);
        }, 1000 * (retryCount + 1)); // Exponential backoff
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadBudget();
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      if (!user) {
        throw new Error('Please sign in to save budget settings');
      }

      const updatedBudget = {
        monthlyLimit: Number(formData.monthlyLimit) || 0,
        categories: Object.fromEntries(
          Object.entries(formData.categories).map(([key, value]) => [key, Number(value) || 0])
        )
      };

      let savedBudget;
      if (budget?.id) {
        savedBudget = await apiService.updateBudget(budget.id, updatedBudget);
      } else {
        savedBudget = await apiService.setBudget(updatedBudget);
      }

      setBudget(savedBudget);
      setIsEditing(false);
      // Show success message
      const successMessage = document.createElement('div');
      successMessage.className = 'fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg';
      successMessage.textContent = 'Budget saved successfully';
      document.body.appendChild(successMessage);
      setTimeout(() => successMessage.remove(), 3000);
    } catch (err) {
      console.error('Error saving budget:', err);
      setError(err.message || 'Failed to save budget settings');
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryLimitChange = (category, value) => {
    setFormData(prev => ({
      ...prev,
      categories: {
        ...prev.categories,
        [category]: value
      }
    }));
  };

  if (loading && !budget) {
    return <Loading />;
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                Please sign in to access budget settings
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Budget Settings</h1>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              Edit Budget
            </button>
          )}
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 relative">
            <span className="block sm:inline">{error}</span>
            <button
              onClick={() => setError(null)}
              className="absolute top-0 bottom-0 right-0 px-4 py-3"
            >
              <svg className="fill-current h-6 w-6 text-red-500" role="button" viewBox="0 0 20 20">
                <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/>
              </svg>
            </button>
          </div>
        )}

        <div className="bg-white shadow rounded-lg p-6">
          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Monthly Budget Limit
                </label>
                <div className="mt-1">
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.monthlyLimit}
                    onChange={(e) => setFormData(prev => ({ ...prev, monthlyLimit: e.target.value }))}
                    className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    placeholder="Enter monthly limit"
                    required
                  />
                </div>
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">
                  Category Limits
                </label>
                {['Food', 'Transportation', 'Entertainment', 'Shopping', 'Bills', 'Others'].map((category) => (
                  <div key={category} className="flex items-center space-x-4">
                    <span className="w-32 text-sm text-gray-600">{category}</span>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.categories[category] || ''}
                      onChange={(e) => handleCategoryLimitChange(category, e.target.value)}
                      className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      placeholder={`Limit for ${category}`}
                    />
                  </div>
                ))}
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setFormData({
                      monthlyLimit: budget?.monthlyLimit || '',
                      categories: budget?.categories || {}
                    });
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Monthly Budget Limit</h3>
                <p className="mt-1 text-2xl font-semibold text-primary-600">
                  ${budget?.monthlyLimit?.toLocaleString() || '0'}
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Category Limits</h3>
                <div className="space-y-4">
                  {Object.entries(budget?.categories || {}).map(([category, limit]) => (
                    <div key={category} className="flex justify-between items-center">
                      <span className="text-gray-600">{category}</span>
                      <span className="font-medium">${Number(limit).toLocaleString()}</span>
                    </div>
                  ))}
                  {Object.keys(budget?.categories || {}).length === 0 && (
                    <p className="text-gray-500 italic">No category limits set</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Budget;
