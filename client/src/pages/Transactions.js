import React from 'react';

const Transactions = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Transactions</h1>
        <button className="btn-primary">Add Transaction</button>
      </div>
      
      <div className="bg-white shadow rounded-lg">
        <div className="p-6">
          <div className="text-gray-500">Transaction list coming soon...</div>
        </div>
      </div>
    </div>
  );
};

export default Transactions;
