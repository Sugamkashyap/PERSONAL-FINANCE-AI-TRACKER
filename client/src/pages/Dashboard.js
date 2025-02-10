import React from 'react';
import { useAuth } from '../hooks/useAuth';

const DashboardCard = ({ title, value, icon: Icon }) => (
  <div className="bg-white overflow-hidden shadow rounded-lg">
    <div className="p-5">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <Icon className="h-6 w-6 text-gray-400" aria-hidden="true" />
        </div>
        <div className="ml-5 w-0 flex-1">
          <dl>
            <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
            <dd className="flex items-baseline">
              <div className="text-2xl font-semibold text-gray-900">{value}</div>
            </dd>
          </dl>
        </div>
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="text-gray-500">Welcome back, {user?.email}</p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {/* Placeholder cards - will be connected to real data later */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <h3 className="text-lg font-medium text-gray-900">Monthly Overview</h3>
            <div className="mt-1 text-3xl font-semibold text-primary-600">$2,400</div>
            <p className="mt-1 text-sm text-gray-500">Total Expenses</p>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <h3 className="text-lg font-medium text-gray-900">Budget Status</h3>
            <div className="mt-1 text-3xl font-semibold text-green-600">68%</div>
            <p className="mt-1 text-sm text-gray-500">Of monthly budget used</p>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <h3 className="text-lg font-medium text-gray-900">Savings Goal</h3>
            <div className="mt-1 text-3xl font-semibold text-blue-600">$5,000</div>
            <p className="mt-1 text-sm text-gray-500">Target: $10,000</p>
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900">Recent Transactions</h3>
          <div className="mt-4">
            <p className="text-gray-500 text-sm">Loading transactions...</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
