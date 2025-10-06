import React, { useState } from 'react';
import { Users, IndianRupee, TrendingUp, Calendar, Search, Settings } from 'lucide-react';
import { StatsCard } from '../common/StatsCard';
import { SubscriptionBadge } from '../common/SubscriptionBadge';
import { Navbar } from '../common/Navbar';
import { useAuth } from '../../contexts/AuthContext';
import { BrokerSettings } from '../broker/BrokerSettings';

export function BrokerDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [showSettings, setShowSettings] = useState(false);
  const { user } = useAuth();

  const tabs = [
    { id: 'overview', label: 'Overview', icon: TrendingUp },
    { id: 'bookings', label: 'My Bookings', icon: Calendar },
    { id: 'commissions', label: 'Commissions', icon: IndianRupee },
    { id: 'properties', label: 'Browse Properties', icon: Search }
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          title="Total Bookings"
          value={23}
          icon={Calendar}
          color="green"
          change={24.7}
        />
        <StatsCard
          title="Commission Earned"
          value={18750}
          icon={IndianRupee}
          color="orange"
          change={24.7}
        />
        <StatsCard
          title="Success Rate"
          value="92%"
          icon={TrendingUp}
          color="blue"
          change={5.2}
        />
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button 
            onClick={() => setShowSettings(true)}
            className="flex items-center space-x-3 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors group"
          >
            <Settings className="h-6 w-6 text-gray-400 group-hover:text-green-500" />
            <div className="text-left">
              <p className="font-medium text-gray-900 group-hover:text-green-600">Settings</p>
              <p className="text-sm text-gray-500">Manage contact & integrations</p>
            </div>
          </button>
          <button className="flex items-center space-x-3 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors group">
            <Search className="h-6 w-6 text-gray-400 group-hover:text-blue-500" />
            <div className="text-left">
              <p className="font-medium text-gray-900 group-hover:text-blue-600">Browse Properties</p>
              <p className="text-sm text-gray-500">Find properties to book</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );

  const renderBookings = () => (
    <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
      <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">My Bookings</h3>
      <p className="text-gray-600">Track your booking history and commissions.</p>
    </div>
  );

  const renderCommissions = () => (
    <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
      <IndianRupee className="h-12 w-12 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">Commission Tracking</h3>
      <p className="text-gray-600">Monitor your commission earnings and payouts.</p>
    </div>
  );

  const renderProperties = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Browse Properties</h2>
        <div className="flex items-center space-x-3">
          <input
            type="text"
            placeholder="Search properties..."
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
          <button className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors">
            Search
          </button>
        </div>
      </div>
      
      {/* Demo Properties for Booking */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
          <img 
            src="https://images.pexels.com/photos/1732414/pexels-photo-1732414.jpeg?auto=compress&cs=tinysrgb&w=800"
            alt="Luxury Beachside Villa"
            className="w-full h-48 object-cover"
          />
          <div className="p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-900">Luxury Beachside Villa</h3>
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 text-yellow-500 fill-current" />
                <span className="text-sm font-medium">4.8</span>
              </div>
            </div>
            <p className="text-gray-600 text-sm mb-3">📍 Goa, India</p>
            <p className="text-gray-600 text-sm mb-4">Private pool, beach access, 4 bedrooms</p>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-lg font-bold text-gray-900">₹8,500</span>
                <span className="text-sm text-gray-600">/night</span>
                <div className="text-xs text-green-600">Commission: 20%</div>
              </div>
              <button 
                onClick={() => alert('Booking flow will open here for customer')}
                className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
              >
                Book for Customer
              </button>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
          <img 
            src="https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg?auto=compress&cs=tinysrgb&w=800"
            alt="Mountain View Resort"
            className="w-full h-48 object-cover"
          />
          <div className="p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-900">Mountain View Resort</h3>
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 text-yellow-500 fill-current" />
                <span className="text-sm font-medium">4.9</span>
              </div>
            </div>
            <p className="text-gray-600 text-sm mb-3">📍 Manali, Himachal Pradesh</p>
            <p className="text-gray-600 text-sm mb-4">Mountain views, spa, restaurant, fireplace</p>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-lg font-bold text-gray-900">₹7,200</span>
                <span className="text-sm text-gray-600">/night</span>
                <div className="text-xs text-green-600">Commission: 20%</div>
              </div>
              <button 
                onClick={() => alert('Booking flow will open here for customer')}
                className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
              >
                Book for Customer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome, {user?.name}</h1>
              <p className="text-sm text-gray-500 mb-1">Broker ID: {user?.unique_id}</p>
              <p className="text-gray-600">Manage bookings and track your commissions</p>
            </div>
            <div className="flex items-center space-x-4">
              <SubscriptionBadge 
                planName="Trial" 
                expiryDate="2024-05-20T00:00:00Z" 
                userRole="broker"
                status={user?.accountActivated ? "approved_account" : "activation_pending"}
                accountActivated={user?.accountActivated}
              />
              <button
                onClick={() => setShowSettings(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
              >
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </button>
            </div>
          </div>
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
                    ? 'bg-white text-green-600 shadow-sm'
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
        {activeTab === 'bookings' && renderBookings()}
        {activeTab === 'commissions' && renderCommissions()}
        {activeTab === 'properties' && renderProperties()}

        {/* Settings Modal */}
        {showSettings && (
          <BrokerSettings onClose={() => setShowSettings(false)} />
        )}
      </div>
    </div>
  );
}