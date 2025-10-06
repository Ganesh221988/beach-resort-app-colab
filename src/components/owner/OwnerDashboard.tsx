import React, { useState } from 'react';
import { Building2, Calendar, CalendarDays, IndianRupee, Camera } from 'lucide-react';
import { PropertyCalendar } from '../calendar/PropertyCalendar';
import { BookingFlow } from '../booking/BookingFlow';
import { Property, Booking } from '../../types';
import { SocialMediaMarketing } from './SocialMediaMarketing';

export function OwnerDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [showBookingFlow, setShowBookingFlow] = useState(false);
  const [selectedOtherProperty, setSelectedOtherProperty] = useState<Property | null>(null);
  const [showMarketingModal, setShowMarketingModal] = useState(false);

  const tabs = [
    { id: 'properties', label: 'My Properties', icon: Building2 },
    { id: 'bookings', label: 'Bookings', icon: Calendar },
    { id: 'calendar', label: 'Calendar', icon: CalendarDays },
    { id: 'earnings', label: 'Earnings', icon: IndianRupee },
    { id: 'marketing', label: 'Social Media Marketing', icon: Camera }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Owner Dashboard</h1>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex space-x-4 mb-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-4 py-2 rounded-lg font-medium ${
                  activeTab === tab.id
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <tab.icon className="w-5 h-5 mr-2" />
                {tab.label}
              </button>
            ))}
          </div>
          
          <div className="mt-6">
            {activeTab === 'properties' && (
              <div>
                <h2 className="text-xl font-semibold mb-4">My Properties</h2>
                <p className="text-gray-600">Property management content goes here.</p>
              </div>
            )}
            
            {activeTab === 'bookings' && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Bookings</h2>
                <p className="text-gray-600">Booking management content goes here.</p>
              </div>
            )}
            
            {activeTab === 'calendar' && selectedProperty && (
              <PropertyCalendar property={selectedProperty} />
            )}
            
            {activeTab === 'earnings' && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Earnings</h2>
                <p className="text-gray-600">Earnings overview content goes here.</p>
              </div>
            )}
            
            {activeTab === 'marketing' && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Social Media Marketing</h2>
                <button
                  onClick={() => setShowMarketingModal(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Setup Marketing Campaign
                </button>
              </div>
            )}
          </div>
        </div>
        
        {showBookingFlow && selectedOtherProperty && (
          <BookingFlow
            property={selectedOtherProperty}
            onClose={() => setShowBookingFlow(false)}
          />
        )}
        
        {showMarketingModal && (
          <SocialMediaMarketing
            onClose={() => setShowMarketingModal(false)}
          />
        )}
      </div>
    </div>
  );
}