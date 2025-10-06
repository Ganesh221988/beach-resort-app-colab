import React from 'react';
import { useState } from 'react';
import { LogOut, User, Settings, Crown, Building2, Users, ShoppingBag } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export function Navbar() {
  const { user, logout, switchRole } = useAuth();
  const [showSettings, setShowSettings] = useState(false);

  const roleConfig = {
    admin: { icon: Crown, label: 'Admin', color: 'text-purple-600' },
    owner: { icon: Building2, label: 'Owner', color: 'text-blue-600' },
    broker: { icon: Users, label: 'Broker', color: 'text-green-600' },
    customer: { icon: ShoppingBag, label: 'Customer', color: 'text-orange-600' }
  };

  const currentRole = user?.role ? roleConfig[user.role] : null;
  const RoleIcon = currentRole?.icon || User;

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">ECR</span>
              </div>
              <span className="font-bold text-xl text-gray-900">ECR Beach Resorts</span>
            </div>
            
            {currentRole && (
              <div className={`flex items-center space-x-1 px-3 py-1 rounded-full bg-gray-100 ${currentRole.color}`}>
                <RoleIcon className="h-4 w-4" />
                <span className="text-sm font-medium">{currentRole.label}</span>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {user?.role === 'admin' && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Switch to:</span>
                <select 
                  onChange={(e) => switchRole(e.target.value as any)}
                  value={user.role}
                  className="text-sm border border-gray-300 rounded-md px-2 py-1 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="admin">Admin</option>
                  <option value="owner">Owner</option>
                  <option value="broker">Broker</option>
                  <option value="customer">Customer</option>
                </select>
              </div>
            )}
            
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-gray-600" />
                <span className="text-sm font-medium text-gray-900">{user?.name}</span>
              </div>
              
              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                <Settings 
                  className="h-5 w-5 cursor-pointer" 
                  onClick={() => alert('Settings coming soon!')}
                />
              </button>
              
              <button 
                onClick={logout}
                className="flex items-center space-x-1 px-3 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span className="text-sm">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}