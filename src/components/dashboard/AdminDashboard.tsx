import React, { useState } from 'react';
import { Building2, Users, IndianRupee, TrendingUp, Settings, UserCheck, CreditCard, BarChart3, Calendar } from 'lucide-react';
import { StatsCard } from '../common/StatsCard';
import { Navbar } from '../common/Navbar';
import { useAuth } from '../../contexts/AuthContext';

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const { user } = useAuth();

  const tabs = [
    { id: 'overview', label: 'Overview', icon: TrendingUp },
    { id: 'properties', label: 'Properties', icon: Building2 },
    { id: 'bookings', label: 'Bookings', icon: CreditCard },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Properties"
          value={156}
          icon={Building2}
          color="blue"
          change={15.3}
        />
        <StatsCard
          title="Total Bookings"
          value={1847}
          icon={CreditCard}
          color="green"
          change={12.8}
        />
        <StatsCard
          title="Platform Revenue"
          value={4567890}
          icon={IndianRupee}
          color="orange"
          change={18.7}
        />
        <StatsCard
          title="Pending Payouts"
          value={234567}
          icon={TrendingUp}
          color="purple"
        />
      </div>
    </div>
  );

  const renderProperties = () => (
    <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
      <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">Properties Management</h3>
      <p className="text-gray-600">Manage all properties on the platform.</p>
    </div>
  );

  const renderBookings = () => (
    <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
      <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">Bookings Management</h3>
      <p className="text-gray-600">Monitor and manage all platform bookings.</p>
    </div>
  );

  const renderUsers = () => (
    <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
      <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">User Management</h3>
      <p className="text-gray-600">Manage platform users and their permissions.</p>
    </div>
  );

  const renderReports = () => (
    <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
      <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">Reports & Analytics</h3>
      <p className="text-gray-600">View detailed platform analytics and reports.</p>
    </div>
  );

  const renderSettings = () => (
    <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
      <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">Platform Settings</h3>
      <p className="text-gray-600">Configure platform settings and integrations.</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome, {user?.name}</h1>
          <p className="text-sm text-gray-500 mb-1">Admin ID: {user?.unique_id || 'AD00A0001'}</p>
          <p className="text-gray-600">Manage your ECR Beach Resorts platform</p>
        </div>

        <div className="flex space-x-1 mb-8 bg-gray-200 rounded-lg p-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-white text-orange-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'properties' && renderProperties()}
        {activeTab === 'bookings' && renderBookings()}
        {activeTab === 'users' && renderUsers()}
        {activeTab === 'reports' && renderReports()}
        {activeTab === 'settings' && renderSettings()}
      </div>
    </div>
  );
}