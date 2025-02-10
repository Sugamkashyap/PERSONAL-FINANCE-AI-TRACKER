import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const DashboardStats = ({ transactions = [] }) => {
  // Calculate total income and expenses
  const totals = transactions.reduce(
    (acc, transaction) => {
      if (transaction.type === 'income') {
        acc.income += transaction.amount;
      } else {
        acc.expenses += transaction.amount;
      }
      return acc;
    },
    { income: 0, expenses: 0 }
  );

  // Calculate category-wise expenses
  const categoryTotals = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, transaction) => {
      acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount;
      return acc;
    }, {});

  // Prepare data for pie chart
  const pieChartData = {
    labels: Object.keys(categoryTotals),
    datasets: [
      {
        data: Object.values(categoryTotals),
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
          '#FF6384',
        ],
        borderWidth: 1,
      },
    ],
  };

  const pieChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
      },
      title: {
        display: true,
        text: 'Expenses by Category'
      }
    }
  };

  // Get monthly totals for bar chart
  const monthlyTotals = transactions.reduce((acc, transaction) => {
    const month = new Date(transaction.date).toLocaleString('default', { month: 'short' });
    if (!acc[month]) {
      acc[month] = { income: 0, expenses: 0 };
    }
    if (transaction.type === 'income') {
      acc[month].income += transaction.amount;
    } else {
      acc[month].expenses += transaction.amount;
    }
    return acc;
  }, {});

  const barChartData = {
    labels: Object.keys(monthlyTotals),
    datasets: [
      {
        label: 'Income',
        data: Object.values(monthlyTotals).map(m => m.income),
        backgroundColor: '#4BC0C0',
        borderRadius: 6,
      },
      {
        label: 'Expenses',
        data: Object.values(monthlyTotals).map(m => m.expenses),
        backgroundColor: '#FF6384',
        borderRadius: 6,
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Monthly Income vs Expenses'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          drawBorder: false,
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Overview</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-green-600">Total Income</p>
              <p className="text-2xl font-bold text-green-700">
                ${totals.income.toFixed(2)}
              </p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <p className="text-sm text-red-600">Total Expenses</p>
              <p className="text-2xl font-bold text-red-700">
                ${totals.expenses.toFixed(2)}
              </p>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm text-gray-600">Net Balance</p>
            <p className={`text-xl font-bold ${
              totals.income - totals.expenses >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              ${(totals.income - totals.expenses).toFixed(2)}
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Expense Categories</h2>
          {Object.keys(categoryTotals).length > 0 ? (
            <div className="h-64">
              <Pie data={pieChartData} options={pieChartOptions} />
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-500">
              No expense data available
            </div>
          )}
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Monthly Trends</h2>
        {Object.keys(monthlyTotals).length > 0 ? (
          <div className="h-80">
            <Bar data={barChartData} options={barChartOptions} />
          </div>
        ) : (
          <div className="h-80 flex items-center justify-center text-gray-500">
            No transaction data available
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardStats;
