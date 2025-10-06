import React, { useState, useEffect } from 'react';
import { ArrowLeft, Phone, MessageCircle, Mail, User, Building2, Star, Calendar, IndianRupee } from 'lucide-react';
import { userService, bookingService } from '../../services/supabaseService';
import { BookingCard } from '../common/BookingCard';

interface BrokerDetailsPageProps {
  brokerId: string;
  onBack: () => void;
}

export function BrokerDetailsPage({ brokerId, onBack }: BrokerDetailsPageProps) {
  const [brokerData, setBrokerData] = useState<any>(null);
  const [brokerBookings, setBrokerBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadBrokerData();
  }, [brokerId]);

  const loadBrokerData = async () => {
    try {
      setLoading(true);
      
      // Load broker profile
      const profile = await userService.getProfile(brokerId);
      setBrokerData(profile);
      
      // Load broker's bookings
      const bookings = await bookingService.getBookings(brokerId, 'broker');
      setBrokerBookings(bookings || []);
      
    } catch (error) {
      console.error('Error loading broker data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCall = () => {
    const phoneNumber = brokerData?.contact_info?.calling_number;
    if (phoneNumber) {
      window.open(`tel:${phoneNumber}`);
    } else {
      alert('No calling number available for this broker');
    }
  };

  const handleWhatsApp = () => {
    const whatsappNumber = brokerData?.contact_info?.whatsapp_number;
    if (whatsappNumber) {
      const message = encodeURIComponent(`Hi ${brokerData?.name || 'there'}, I found your profile on ECR Beach Resorts and would like to inquire about your services.`);
      window.open(`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${message}`);
    } else {
      alert('No WhatsApp number available for this broker');
    }
  };

  const handleEmail = () => {
    const email = brokerData?.contact_info?.email_for_inquiries;
    if (email) {
      const subject = encodeURIComponent(`Inquiry from ECR Beach Resorts`);
      const body = encodeURIComponent(`Hi ${brokerData?.name || 'there'},\n\nI found your profile on ECR Beach Resorts and would like to inquire about your services.\n\nBest regards`);
      window.open(`mailto:${email}?subject=${subject}&body=${body}`);
    } else {
      alert('No email available for this broker');
    }
  };

  const calculateBrokerStats = () => {
    const totalBookings = brokerBookings.length;
    const totalCommission = brokerBookings.reduce((sum, booking) => sum + (booking.broker_commission || 0), 0);
    const avgBookingValue = totalBookings > 0 ? brokerBookings.reduce((sum, booking) => sum + booking.total_amount, 0) / totalBookings : 0;
    const successRate = totalBookings > 0 ? (brokerBookings.filter(b => b.status === 'confirmed' || b.status === 'completed').length / totalBookings) * 100 : 0;

    return {
      totalBookings,
      totalCommission,
      avgBookingValue,
      successRate
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600">Loading broker details...</p>
        </div>
      </div>
    );
  }

  if (!brokerData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <User className="h-12 w-12 text-gray-400 mx-auto" />
          <h3 className="text-lg font-medium text-gray-900">Broker Not Found</h3>
          <p className="text-gray-600">The broker profile could not be loaded.</p>
          <button
            onClick={onBack}
            className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const stats = calculateBrokerStats();

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'bookings', label: 'Bookings History', icon: Calendar },
    { id: 'performance', label: 'Performance', icon: Star }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Bookings</span>
          </button>
          
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-500 rounded-full flex items-center justify-center">
                  <User className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-1">{brokerData.name}</h1>
                  <p className="text-gray-600 mb-2">{brokerData.agency_name || 'Travel Broker'}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span>Broker ID: {brokerId.slice(0, 8)}</span>
                    <span>•</span>
                    <span>Member since {new Date(brokerData.created_at).getFullYear()}</span>
                    <span>•</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      brokerData.kyc_status === 'verified' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {brokerData.kyc_status === 'verified' ? 'Verified' : 'Pending Verification'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Contact Buttons */}
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleCall}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors shadow-md hover:shadow-lg"
                >
                  <Phone className="h-4 w-4" />
                  <span>Call</span>
                </button>
                
                <button
                  onClick={handleWhatsApp}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors shadow-md hover:shadow-lg"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>WhatsApp</span>
                </button>
                
                <button
                  onClick={handleEmail}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors shadow-md hover:shadow-lg"
                >
                  <Mail className="h-4 w-4" />
                  <span>Email</span>
                </button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-200">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{stats.totalBookings}</div>
                <div className="text-sm text-gray-600">Total Bookings</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">₹{stats.totalCommission.toLocaleString()}</div>
                <div className="text-sm text-gray-600">Total Commission</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">₹{Math.round(stats.avgBookingValue).toLocaleString()}</div>
                <div className="text-sm text-gray-600">Avg Booking Value</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{stats.successRate.toFixed(1)}%</div>
                <div className="text-sm text-gray-600">Success Rate</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
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

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Broker Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Business Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Agency Name:</span>
                      <span className="font-medium">{brokerData.agency_name || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">License Number:</span>
                      <span className="font-medium">{brokerData.license_number || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">GST Number:</span>
                      <span className="font-medium">{brokerData.gst_number || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">PAN Number:</span>
                      <span className="font-medium">{brokerData.pan_number || 'N/A'}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Contact Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Contact Person:</span>
                      <span className="font-medium">{brokerData.contact_info?.contact_person_name || brokerData.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Business Hours:</span>
                      <span className="font-medium">{brokerData.contact_info?.business_hours || '9 AM - 6 PM'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Primary Phone:</span>
                      <span className="font-medium">{brokerData.contact_info?.calling_number || brokerData.phone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">WhatsApp:</span>
                      <span className="font-medium">{brokerData.contact_info?.whatsapp_number || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'bookings' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Booking History</h3>
              <span className="text-sm text-gray-600">{brokerBookings.length} total bookings</span>
            </div>
            
            {brokerBookings.length > 0 ? (
              <div className="grid grid-cols-1 gap-6">
                {brokerBookings.map((booking) => (
                  <BookingCard
                    key={booking.id}
                    booking={booking}
                    userRole="broker"
                    showActions={false}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Bookings Yet</h3>
                <p className="text-gray-600">This broker hasn't made any bookings yet.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'performance' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
                <Calendar className="h-8 w-8 text-green-600 mx-auto mb-3" />
                <div className="text-2xl font-bold text-gray-900">{stats.totalBookings}</div>
                <div className="text-sm text-gray-600">Total Bookings</div>
              </div>
              
              <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
                <IndianRupee className="h-8 w-8 text-green-600 mx-auto mb-3" />
                <div className="text-2xl font-bold text-gray-900">₹{stats.totalCommission.toLocaleString()}</div>
                <div className="text-sm text-gray-600">Total Commission</div>
              </div>
              
              <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
                <Star className="h-8 w-8 text-green-600 mx-auto mb-3" />
                <div className="text-2xl font-bold text-gray-900">{stats.successRate.toFixed(1)}%</div>
                <div className="text-sm text-gray-600">Success Rate</div>
              </div>
              
              <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
                <Building2 className="h-8 w-8 text-green-600 mx-auto mb-3" />
                <div className="text-2xl font-bold text-gray-900">₹{Math.round(stats.avgBookingValue).toLocaleString()}</div>
                <div className="text-sm text-gray-600">Avg Booking Value</div>
              </div>
            </div>

            {/* Performance Chart Placeholder */}
            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
              <Star className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Performance Analytics</h3>
              <p className="text-gray-600">Detailed performance charts and analytics coming soon.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}