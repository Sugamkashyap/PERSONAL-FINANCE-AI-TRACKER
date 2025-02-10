import React from 'react';
import { useAuth } from '../hooks/useAuth';

const Profile = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Profile</h1>
      </div>
      
      <div className="bg-white shadow rounded-lg">
        <div className="p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <div className="mt-1 text-gray-900">{user?.email}</div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Account Created</label>
              <div className="mt-1 text-gray-900">
                {user?.metadata.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString() : 'N/A'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
