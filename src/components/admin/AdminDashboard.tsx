import React, { useState } from 'react';
import { Users, UserCheck, LogOut } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { mockAuthService } from '../../services/mockAuthService';
import { AIInsights } from './AIInsights';
import { Button } from '../ui/Button';
import { UserAvatar } from '../UserAvatar';

interface DisableModalProps {
  userName: string;
  onConfirm: () => void;
  onClose: () => void;
}

function DisableModal({ userName, onConfirm, onClose }: DisableModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 className="text-lg font-semibold mb-2">Disable Account</h3>
        <p className="text-gray-600 mb-4">
          Are you sure you want to disable {userName}'s account? This action can be reversed later.
        </p>
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button 
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-500"
          >
            Disable Account
          </Button>
        </div>
      </div>
    </div>
  );
}

export function AdminDashboard() {
  const { user, logout } = useAuth();
  const [disableUser, setDisableUser] = useState<{ email: string; name: string } | null>(null);
  const registeredUsers = mockAuthService.getStoredUsers().filter(u => u.role !== 'admin');
  const pandits = registeredUsers.filter(u => u.role === 'pandit');
  const devotees = registeredUsers.filter(u => u.role === 'user');

  const handleDisableAccount = async () => {
    if (!disableUser) return;
    
    try {
      await mockAuthService.disableUser(disableUser.email);
      setDisableUser(null);
      // Force refresh the component
      window.location.reload();
    } catch (error) {
      console.error('Failed to disable account:', error);
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">Manage users and system settings</p>
        </div>
        <Button 
          variant="secondary" 
          className="flex items-center gap-2"
          onClick={logout}
        >
          <LogOut className="w-4 h-4" />
          Logout
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold">Total Users</h3>
          </div>
          <p className="text-2xl font-bold text-gray-900">{registeredUsers.length}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-orange-100 rounded-lg">
              <UserCheck className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="font-semibold">Registered Pandits</h3>
          </div>
          <p className="text-2xl font-bold text-gray-900">{pandits.length}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold">Active Devotees</h3>
          </div>
          <p className="text-2xl font-bold text-gray-900">{devotees.length}</p>
        </div>
      </div>

      <AIInsights users={registeredUsers} />

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold">Registered Users</h2>
        </div>
        <div className="p-6">
          <table className="w-full">
            <thead>
              <tr className="text-left text-gray-500">
                <th className="pb-4">User</th>
                <th className="pb-4">Email</th>
                <th className="pb-4">Role</th>
                <th className="pb-4">Status</th>
                <th className="pb-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {registeredUsers.map((user) => (
                <tr key={user.email} className="border-t border-gray-100">
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <UserAvatar user={user} size="sm" />
                      <span className="font-medium">{user.name}</span>
                    </div>
                  </td>
                  <td className="py-4">{user.email}</td>
                  <td className="py-4">
                    <span className={`inline-block px-2 py-1 rounded-full text-sm ${
                      user.role === 'pandit' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </span>
                  </td>
                  <td className="py-4">
                    <span className={`inline-block px-2 py-1 rounded-full text-sm ${
                      user.disabled ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                    }`}>
                      {user.disabled ? 'Disabled' : 'Active'}
                    </span>
                  </td>
                  <td className="py-4">
                    <button 
                      className="text-red-600 hover:text-red-700"
                      onClick={() => setDisableUser({ email: user.email, name: user.name })}
                    >
                      {user.disabled ? 'Enable Account' : 'Disable Account'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {disableUser && (
        <DisableModal
          userName={disableUser.name}
          onConfirm={handleDisableAccount}
          onClose={() => setDisableUser(null)}
        />
      )}
    </div>
  );
}