import React, { useState } from 'react';
import { Download, Calendar, TrendingUp, Users, IndianRupee, Building2 } from 'lucide-react';
import { StatsCard } from '../common/StatsCard';

export function ReportsPage() {
  const [dateRange, setDateRange] = useState({
    start: '2024-03-01',
    end: '2024-03-31'
  });
  const [reportType, setReportType] = useState('overview');

  const reportTypes = [
    { id: 'overview', label: 'Overview', icon: TrendingUp },
    { id: 'bookings', label: 'Bookings', icon: Calendar },
    { id: 'revenue', label: 'Revenue', icon: IndianRupee },
    { id: 'properties', label: 'Properties', icon: Building2 },
    { id: 'users', label: 'Users', icon: Users }
  ];

  const mockReportData = {
    overview: {
      totalBookings: 1847,
      totalRevenue: 4567890,
      totalProperties: 156,
      totalUsers: 1308,
      avgBookingValue: 2475,
      occupancyRate: 78.5,
      topPerformingProperty: 'Luxury Beachside Villa',
      topPerformingCity: 'Goa'
    },
    bookings: [
      { id: '1', property: 'Luxury Beachside Villa', customer: 'David Johnson', amount: 25500, date: '2024-03-15', status: 'confirmed' },
      { id: '2', property: 'Mountain View Resort', customer: 'Sarah Wilson', amount: 18750, date: '2024-03-14', status: 'completed' },
      { id: '3', property: 'City Center Apartment', customer: 'Mike Brown', amount: 12300, date: '2024-03-13', status: 'confirmed' },
      { id: '4', property: 'Beach House Retreat', customer: 'Lisa Davis', amount: 31200, date: '2024-03-12', status: 'completed' },
      { id: '5', property: 'Hillside Villa', customer: 'John Smith', amount: 22800, date: '2024-03-11', status: 'confirmed' }
    ],
    revenue: {
      totalRevenue: 4567890,
      platformCommission: 456789,
      brokerCommissions: 91358,
      netRevenue: 4019743,
      monthlyGrowth: 15.3,
      revenueByCity: [
        { city: 'Goa', revenue: 1523456 },
        { city: 'Manali', revenue: 987654 },
        { city: 'Udaipur', revenue: 876543 },
        { city: 'Munnar', revenue: 654321 },
        { city: 'Ooty', revenue: 525916 }
      ]
    }
  };

  const exportReport = (format: 'csv' | 'pdf') => {
    // Mock export functionality
    alert(`Exporting ${reportType} report as ${format.toUpperCase()}...`);
  };

  const renderOverviewReport = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Bookings"
          value={mockReportData.overview.totalBookings}
          icon={Calendar}
          color="blue"
          change={12.5}
        />
        <StatsCard
          title="Total Revenue"
          value={mockReportData.overview.totalRevenue}
          icon={IndianRupee}
          color="green"
          change={15.3}
        />
        <StatsCard
          title="Total Properties"
          value={mockReportData.overview.totalProperties}
          icon={Building2}
          color="orange"
          change={8.7}
        />
        <StatsCard
          title="Total Users"
          value={mockReportData.overview.totalUsers}
          icon={Users}
          color="purple"
          change={22.1}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Metrics</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Average Booking Value</span>
              <span className="font-semibold">₹{mockReportData.overview.avgBookingValue.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Occupancy Rate</span>
              <span className="font-semibold">{mockReportData.overview.occupancyRate}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Top Performing Property</span>
              <span className="font-semibold">{mockReportData.overview.topPerformingProperty}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Top Performing City</span>
              <span className="font-semibold">{mockReportData.overview.topPerformingCity}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Breakdown</h3>
          <div className="space-y-4">
            {mockReportData.revenue.revenueByCity.map((item, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-gray-600">{item.city}</span>
                <span className="font-semibold">₹{item.revenue.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderBookingsReport = () => (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Booking ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Property
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {mockReportData.bookings.map((booking) => (
              <tr key={booking.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  #{booking.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {booking.property}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {booking.customer}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ₹{booking.amount.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(booking.date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    booking.status === 'confirmed' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderRevenueReport = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Revenue"
          value={mockReportData.revenue.totalRevenue}
          icon={IndianRupee}
          color="green"
          change={mockReportData.revenue.monthlyGrowth}
        />
        <StatsCard
          title="Platform Commission"
          value={mockReportData.revenue.platformCommission}
          icon={TrendingUp}
          color="blue"
          change={18.2}
        />
        <StatsCard
          title="Broker Commissions"
          value={mockReportData.revenue.brokerCommissions}
          icon={Users}
          color="orange"
          change={25.7}
        />
        <StatsCard
          title="Net Revenue"
          value={mockReportData.revenue.netRevenue}
          icon={IndianRupee}
          color="purple"
          change={14.1}
        />
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Revenue by City</h3>
        <div className="space-y-4">
          {mockReportData.revenue.revenueByCity.map((item, index) => {
            const percentage = (item.revenue / mockReportData.revenue.totalRevenue) * 100;
            return (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-900">{item.city}</span>
                  <span className="text-sm text-gray-600">
                    ₹{item.revenue.toLocaleString()} ({percentage.toFixed(1)}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Reports & Analytics</h2>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => exportReport('csv')}
            className="flex items-center space-x-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Download className="h-4 w-4" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => exportReport('pdf')}
            className="flex items-center space-x-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
          >
            <Download className="h-4 w-4" />
            <span>Export PDF</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
          <div className="flex items-end">
            <button className="w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors">
              Apply Filters
            </button>
          </div>
        </div>
      </div>

      {/* Report Type Tabs */}
      <div className="flex space-x-1 bg-gray-200 rounded-lg p-1">
        {reportTypes.map((type) => {
          const Icon = type.icon;
          return (
            <button
              key={type.id}
              onClick={() => setReportType(type.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md font-medium transition-colors ${
                reportType === type.id
                  ? 'bg-white text-orange-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{type.label}</span>
            </button>
          );
        })}
      </div>

      {/* Report Content */}
      {reportType === 'overview' && renderOverviewReport()}
      {reportType === 'bookings' && renderBookingsReport()}
      {reportType === 'revenue' && renderRevenueReport()}
      {reportType === 'properties' && (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
          <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Properties Report</h3>
          <p className="text-gray-600">Detailed property performance analytics coming soon.</p>
        </div>
      )}
      {reportType === 'users' && (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Users Report</h3>
          <p className="text-gray-600">User engagement and growth analytics coming soon.</p>
        </div>
      )}
    </div>
  );

}