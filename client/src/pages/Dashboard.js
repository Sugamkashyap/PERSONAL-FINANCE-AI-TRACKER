import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import DashboardStats from '../components/DashboardStats';
import TransactionList from '../components/TransactionList';

const Dashboard = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      if (!user) {
        throw new Error('Please sign in to view dashboard');
      }

      const response = await fetch('http://localhost:5000/api/transactions', {
        headers: {
          'Authorization': `Bearer ${await user.getIdToken()}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch transactions');
      const data = await response.json();
      setTransactions(data);
    } catch (err) {
      console.error('Error fetching transactions:', err);
      setError(err.message || 'Failed to load transactions');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchTransactions();
    }
  }, [fetchTransactions, user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  const recentTransactions = transactions.slice(0, 5); // Get last 5 transactions

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <Link
          to="/transactions"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          View All Transactions
        </Link>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <div className="mb-8">
        <DashboardStats transactions={transactions} />
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Recent Transactions</h2>
          <Link
            to="/transactions"
            className="text-primary-600 hover:text-primary-700 text-sm font-medium"
          >
            View all
          </Link>
        </div>
        <TransactionList
          transactions={recentTransactions}
          onEdit={() => {}} // We don't need edit/delete on dashboard
          onDelete={() => {}}
        />
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Tips</h2>
          <ul className="space-y-3 text-gray-600">
            <li className="flex items-start">
              <span className="flex-shrink-0 h-5 w-5 text-green-500">✓</span>
              <span className="ml-2">Set up monthly budgets for better financial planning</span>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 h-5 w-5 text-green-500">✓</span>
              <span className="ml-2">Categorize transactions for detailed insights</span>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 h-5 w-5 text-green-500">✓</span>
              <span className="ml-2">Review your spending patterns regularly</span>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 h-5 w-5 text-green-500">✓</span>
              <span className="ml-2">Set up recurring transactions for regular expenses</span>
            </li>
          </ul>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <Link
              to="/transactions"
              className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100"
            >
              <span className="text-xl mb-2">💰</span>
              <span className="text-sm font-medium text-gray-900">Add Transaction</span>
            </Link>
            <Link
              to="/budget"
              className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100"
            >
              <span className="text-xl mb-2">📊</span>
              <span className="text-sm font-medium text-gray-900">Set Budget</span>
            </Link>
            <Link
              to="/profile"
              className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100"
            >
              <span className="text-xl mb-2">⚙️</span>
              <span className="text-sm font-medium text-gray-900">Settings</span>
            </Link>
            <Link
              to="/transactions?filter=recurring"
              className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100"
            >
              <span className="text-xl mb-2">🔄</span>
              <span className="text-sm font-medium text-gray-900">Recurring</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
