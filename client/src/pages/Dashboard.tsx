import { useState, useEffect } from 'react';
import TransactionList from '../components/TransactionList';
import TransactionForm from '../components/TransactionForm';
import BudgetTracker from '../components/BudgetTracker';
import FinancialInsights from '../components/FinancialInsights';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const Dashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [insights, setInsights] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchTransactions();
    fetchInsights();
  }, [user]);

  const fetchTransactions = async () => {
    const response = await api.get('/transactions');
    setTransactions(response.data);
  };

  const fetchInsights = async () => {
    const response = await api.get('/ai/insights');
    setInsights(response.data);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <TransactionForm onSubmit={fetchTransactions} />
          <TransactionList transactions={transactions} />
        </div>
        <div>
          <BudgetTracker />
          <FinancialInsights insights={insights} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
