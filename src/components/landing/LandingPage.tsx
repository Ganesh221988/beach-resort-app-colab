import React, { useState } from 'react';
import { Search, MapPin, Calendar, Users, Star, ChevronRight, ChevronDown, Menu, X, User, Heart, Shield, Award, Globe } from 'lucide-react';
import { mockEvents } from '../../data/mockData';
import { useAuth } from '../../contexts/AuthContext';
import { PropertyPage } from '../property/PropertyPage';
import { SearchResultsPage } from '../search/SearchResultsPage';
import { Property } from '../../types';
import { useSupabaseQuery } from '../../hooks/useSupabase';
import { SEOHead } from '../common/SEOHead';

interface LandingPageProps {
  onLogin: () => void;
  onSignup: () => void;
}

export function LandingPage({ onLogin, onSignup }: LandingPageProps) {
  const { user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEventsOpen, setIsEventsOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<any>(null);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const { data: allProperties } = useSupabaseQuery('properties', { filter: { status: 'active' } });
  const [searchData, setSearchData] = useState({
    selectedEvent: '',
    checkIn: '',
    checkOut: '',
    adults: 1,
    children: 0
  });

  // Define closePropertyDetails function before it's used
  const closePropertyDetails = () => {
    setSelectedProperty(null);
  };

  // Handle event venue search
  const handleEventVenueSearch = (eventName: string) => {
    setSearchData(prev => ({ ...prev, selectedEvent: eventName }));
    setShowSearchResults(true);
  };

  // Handle featured property click
  const handleFeaturedPropertyClick = (property: any) => {
    const fullProperty = convertFeaturedToFullProperty(property);
    setSelectedProperty(fullProperty);
  };

  // Show search results if search was performed
  if (showSearchResults) {
    return (
      <SearchResultsPage
        searchQuery={searchData}
        properties={allProperties || []}
        onBack={() => setShowSearchResults(false)}
        onLogin={onLogin}
      />
    );
  }

  // Show property details if property is selected
  if (selectedProperty) {
    return (
      <PropertyPage
        property={selectedProperty}
        onBack={closePropertyDetails}
        onLogin={onLogin}
      />
    );
  }

  const featuredDestinations = [
    {
      name: 'Weddings',
      properties: 245,
      image: 'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=800',
      description: 'Dream venues for your perfect wedding day'
    },
    {
      name: 'Corporate Events',
      properties: 156,
      image: 'https://images.pexels.com/photos/1181396/pexels-photo-1181396.jpeg?auto=compress&cs=tinysrgb&w=800',
      description: 'Professional venues for business gatherings'
    },
    {
      name: 'Family Reunions',
      properties: 89,
      image: 'https://images.pexels.com/photos/1128318/pexels-photo-1128318.jpeg?auto=compress&cs=tinysrgb&w=800',
      description: 'Spacious venues for family celebrations'
    },
    {
      name: 'Team Outings',
      properties: 198,
      image: 'https://images.pexels.com/photos/1181533/pexels-photo-1181533.jpeg?auto=compress&cs=tinysrgb&w=800',
      description: 'Perfect locations for team building activities'
    }
  ];

  const featuredProperties = [
    {
      id: 1,
      name: 'Luxury Beachside Villa',
      location: 'Goa, India',
      image: 'https://images.pexels.com/photos/1732414/pexels-photo-1732414.jpeg?auto=compress&cs=tinysrgb&w=800',
      price: 8500,
      rating: 4.8,
      reviews: 124,
      amenities: ['Private Pool', 'Beach Access', 'WiFi', 'AC']
    },
    {
      id: 2,
      name: 'Mountain View Resort',
      location: 'Manali, Himachal Pradesh',
      image: 'https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg?auto=compress&cs=tinysrgb&w=800',
      price: 7200,
      rating: 4.9,
      reviews: 89,
      amenities: ['Mountain View', 'Spa', 'Restaurant', 'Fireplace']
    },
    {
      id: 3,
      name: 'Royal Heritage Hotel',
      location: 'Udaipur, Rajasthan',
      image: 'https://images.pexels.com/photos/2506988/pexels-photo-2506988.jpeg?auto=compress&cs=tinysrgb&w=800',
      price: 12500,
      rating: 4.7,
      reviews: 156,
      amenities: ['Palace View', 'Pool', 'Heritage', 'Luxury']
    },
    {
      id: 4,
      name: 'Backwater Retreat',
      location: 'Alleppey, Kerala',
      image: 'https://images.pexels.com/photos/1134176/pexels-photo-1134176.jpeg?auto=compress&cs=tinysrgb&w=800',
      price: 6800,
      rating: 4.6,
      reviews: 92,
      amenities: ['Backwater View', 'Boat Ride', 'Ayurveda', 'Nature']
    }
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Show search results page (no authentication required for search)
    setShowSearchResults(true);
  };

  const handleFavoriteClick = (propertyId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!user) {
      // Not logged in, show login page
      onLogin();
      return;
    }
    
    // User is logged in, add to favorites
    console.log(`Adding property ${propertyId} to favorites for user ${user.id}`);
    alert(`Property added to favorites! 
    
Property ID: ${propertyId}
User: ${user.name}

You can view your favorites in your dashboard.`);
  };

  const handleBookNow = (propertyId: number) => {
    if (!user) {
      // Not logged in, show login page
      onLogin();
      return;
    }
    
    // Check if user is customer or broker
    if (user.role !== 'customer' && user.role !== 'broker') {
      alert('Only customers and brokers can make bookings.');
      return;
    }
    
    // User is logged in and has permission, proceed with booking
    console.log(`Starting booking for property ${propertyId} by user ${user.id} (${user.role})`);
    
    // Find the property and convert to full property
    const property = featuredProperties.find(p => p.id === propertyId);
    if (property) {
      const fullProperty = convertFeaturedToFullProperty(property);
      setSelectedProperty(fullProperty);
    }
  };

  const handlePropertyClick = (property: any) => {
    return convertFeaturedToFullProperty(property);
  };

  const convertFeaturedToFullProperty = (property: any): Property => {
    const fullProperty: Property = {
      id: property.id.toString(),
      owner_id: 'demo-owner',
      title: property.name,
      description: `Experience luxury and comfort at ${property.name}. This beautiful property offers stunning views and world-class amenities for an unforgettable stay. Perfect for ${property.name.includes('Villa') ? 'families and groups' : property.name.includes('Resort') ? 'romantic getaways' : 'business and leisure travelers'}.`,
      address: `123 Main Street, ${property.location}`,
      city: property.location.split(',')[0].trim(),
      state: property.location.split(',')[1]?.trim() || 'India',
      geo: { lat: 0, lng: 0 },
      amenities: property.amenities,
      images: [property.image, property.image, property.image], // Demo: use same image multiple times
      video_url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
      booking_mode: 'both' as const,
      booking_types: 'both' as const,
      full_villa_rates: {
        daily_rate: property.price * 3, // Assume villa rate is 3x room rate
        hourly_rate: Math.round(property.price / 8)
      },
      policies: {},
      check_in_time: '15:00',
      check_out_time: '11:00',
      room_types: [
        {
          id: '1',
          property_id: property.id.toString(),
          title: 'Deluxe Room',
          capacity: 2,
          price_per_night: property.price,
          price_per_hour: Math.round(property.price / 8),
          extra_person_charge: 500,
          amenities: ['King Bed', 'Private Bathroom', 'AC', 'WiFi']
        },
        {
          id: '2',
          property_id: property.id.toString(),
          title: 'Standard Room',
          capacity: 2,
          price_per_night: Math.round(property.price * 0.8),
          price_per_hour: Math.round(property.price * 0.8 / 8),
          extra_person_charge: 300,
          amenities: ['Queen Bed', 'Private Bathroom', 'AC']
        }
      ],
      created_at: '2024-01-01T00:00:00Z',
      status: 'active' as const
    };
    return fullProperty;
  };

  return (
    <div className="min-h-screen bg-white">
      <SEOHead />
      
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">ECR</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">ECR Beach Resorts</h1>
                <p className="text-xs text-gray-600">Your Perfect Getaway</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <div className="relative events-dropdown">
                <button
                  onClick={() => setIsEventsOpen(!isEventsOpen)}
                  className="flex items-center space-x-1 text-gray-700 hover:text-orange-600 font-medium"
                >
                  <span>Events</span>
                  <ChevronDown className={`h-4 w-4 transition-transform ${isEventsOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {isEventsOpen && (
                  <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    {mockEvents.map((event, index) => (
                      <a
                        key={index}
                        href={`#event-${event.id}`}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-orange-600"
                        onClick={() => setIsEventsOpen(false)}
                      >
                        {event.name}
                      </a>
                    ))}
                  </div>
                )}
              </div>
              <a href="#properties" className="text-gray-700 hover:text-orange-600 font-medium">Properties</a>
              <a href="#about" className="text-gray-700 hover:text-orange-600 font-medium">About</a>
              <a href="#contact" className="text-gray-700 hover:text-orange-600 font-medium">Contact</a>
            </nav>

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              <button
                onClick={onLogin}
                className="text-gray-700 hover:text-orange-600 font-medium"
              >
                Sign In
              </button>
              <button
                onClick={onSignup}
                className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-medium rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Sign Up
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-700"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-200 mobile-menu">
              <div className="flex flex-col space-y-4">
                <div className="space-y-2">
                  <button
                    onClick={() => setIsEventsOpen(!isEventsOpen)}
                    className="flex items-center justify-between w-full text-gray-700 hover:text-orange-600 font-medium"
                  >
                    <span>Events</span>
                    <ChevronDown className={`h-4 w-4 transition-transform ${isEventsOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isEventsOpen && mockEvents && (
                    <div className="pl-4 space-y-2">
                      {mockEvents.map((event, index) => (
                        <a
                          key={index}
                          href="#events"
                          className="block text-sm text-gray-600 hover:text-orange-600"
                          onClick={() => {
                            setIsEventsOpen(false);
                            setIsMenuOpen(false);
                          }}
                        >
                          {event.name}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
                <a href="#properties" className="text-gray-700 hover:text-orange-600 font-medium">Properties</a>
                <a href="#about" className="text-gray-700 hover:text-orange-600 font-medium">About</a>
                <a
                  href="#contact"
                  className="text-gray-700 hover:text-orange-600 font-medium"
                >
                  Contact
                </a>
                <div className="flex flex-col space-y-2 pt-4 border-t border-gray-200">
                  <button
                    onClick={onLogin}
                    className="text-left text-gray-700 hover:text-orange-600 font-medium"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={onSignup}
                    className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white font-medium rounded-lg"
                  >
                    Sign Up
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-orange-50 via-white to-blue-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Find Your Perfect
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500"> Getaway</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover amazing hotels, resorts, and vacation rentals for your next adventure. 
              From luxury beachside villas to cozy mountain retreats.
            </p>
          </div>

          {/* Search Form */}
          <div className="max-w-4xl mx-auto">
            <form onSubmit={handleSearch} className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Event Type</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <select
                      value={searchData.selectedEvent}
                      onChange={(e) => setSearchData(prev => ({ ...prev, selectedEvent: e.target.value }))}
                      className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    >
                      <option value="">Select Event Type</option>
                      {mockEvents.map((event) => (
                        <option key={event.id} value={event.id}>
                          {event.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Check-in</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="date"
                      value={searchData.checkIn}
                      onChange={(e) => setSearchData(prev => ({ ...prev, checkIn: e.target.value }))}
                      className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Check-out</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="date"
                      value={searchData.checkOut}
                      onChange={(e) => setSearchData(prev => ({ ...prev, checkOut: e.target.value }))}
                      className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Guests</label>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Adults</label>
                      <div className="relative">
                        <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          type="number"
                          value={searchData.adults}
                          onChange={(e) => setSearchData(prev => ({ ...prev, adults: parseInt(e.target.value) || 1 }))}
                          min="1"
                          max="20"
                          className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Children</label>
                      <input
                        type="number"
                        value={searchData.children}
                        onChange={(e) => setSearchData(prev => ({ ...prev, children: parseInt(e.target.value) || 0 }))}
                        min="0"
                        max="10"
                        className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <button
                  type="submit"
                  className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                >
                  <Search className="h-5 w-5" />
                  <span>Search Properties</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Featured Destinations */}
      <section id="events" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Popular Events</h2>
            <p className="text-xl text-gray-600">Explore our most loved celebrations</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredDestinations.map((event, index) => (
              <div 
                key={index} 
                className="group cursor-pointer"
                onClick={() => handleEventVenueSearch(event.name)}
              >
                <div className="relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                  <img
                    src={event.image}
                    alt={event.name}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-xl font-bold mb-1">{event.name}</h3>
                    <p className="text-sm opacity-90">{event.properties} venues</p>
                    <p className="text-xs opacity-75">{event.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section id="properties" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Featured Properties</h2>
            <p className="text-xl text-gray-600">Handpicked accommodations for unforgettable experiences</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProperties.map((property) => (
              <div 
                key={property.id} 
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer"
                onClick={() => {
                  const fullProperty = convertFeaturedToFullProperty(property);
                  setSelectedProperty(fullProperty);
                }}
              >
                <div className="relative">
                  <img
                    src={property.image}
                    alt={property.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFavoriteClick(property.id, e);
                    }}
                    className="absolute top-3 right-3 p-2 bg-white/90 rounded-full hover:bg-white transition-colors"
                  >
                    <Heart className="h-4 w-4 text-gray-600 hover:text-red-500" />
                  </button>
                  <div className="absolute top-3 left-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                    Available
                  </div>
                </div>

                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 truncate">{property.name}</h3>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-medium">{property.rating}</span>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mb-3 flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {property.location}
                  </p>

                  <div className="flex flex-wrap gap-1 mb-3">
                    {property.amenities.slice(0, 2).map((amenity, idx) => (
                      <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                        {amenity}
                      </span>
                    ))}
                    {property.amenities.length > 2 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                        +{property.amenities.length - 2} more
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-lg font-bold text-gray-900">₹{property.price.toLocaleString()}</span>
                      <span className="text-sm text-gray-600"> /night</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      {property.reviews} reviews
                    </div>
                  </div>
                </div>
                
                <div className="px-4 pb-4">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!user) {
                        onLogin();
                        return;
                      }
                      
                      if (user.role !== 'customer' && user.role !== 'broker') {
                        alert('Only customers and brokers can make bookings.');
                        return;
                      }
                      
                      const fullProperty = convertFeaturedToFullProperty(property);
                      setSelectedProperty(fullProperty);
                    }}
                    className="w-full px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <button 
              onClick={onSignup}
              className="px-8 py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              View All Properties
            </button>
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Perfect Venues for Every Event</h2>
            <p className="text-xl text-gray-600">From intimate gatherings to grand celebrations</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {mockEvents.map((event) => (
              <div key={event.id} className="bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300 overflow-hidden group">
                <div className="p-6 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-xl">{event.name.charAt(0)}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{event.name}</h3>
                  <p className="text-gray-600 mb-4">{event.description}</p>
                  <button 
                    onClick={() => {
                      handleEventVenueSearch(event.name);
                    }}
                    className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors"
                  >
                    Find Venues
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Choose ECR Beach Resorts?</h2>
            <p className="text-xl text-gray-600">We make your travel dreams come true</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Secure Booking</h3>
              <p className="text-gray-600">Your bookings are protected with bank-level security and instant confirmation.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Best Price Guarantee</h3>
              <p className="text-gray-600">Find a lower price elsewhere? We'll match it and give you an extra discount.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">24/7 Support</h3>
              <p className="text-gray-600">Our customer support team is available round the clock to assist you.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Curated Experiences</h3>
              <p className="text-gray-600">Every property is handpicked and verified for quality and authenticity.</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">About ECR Beach Resorts</h2>
              <p className="text-lg text-gray-600 mb-6">
                We are India's premier booking platform for luxury accommodations and event venues. 
                With over 500+ verified properties across the country, we make it easy to find and 
                book your perfect getaway.
              </p>
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-orange-600 mb-2">500+</h3>
                  <p className="text-gray-600">Verified Properties</p>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-orange-600 mb-2">50,000+</h3>
                  <p className="text-gray-600">Happy Customers</p>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-orange-600 mb-2">25+</h3>
                  <p className="text-gray-600">Cities Covered</p>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-orange-600 mb-2">4.8★</h3>
                  <p className="text-gray-600">Average Rating</p>
                </div>
              </div>
              <button 
               onClick={onLogin}
                className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-colors"
              >
                Join Our Community
              </button>
            </div>
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/1134176/pexels-photo-1134176.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="About ECR Beach Resorts"
                className="rounded-2xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">ECR</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Trusted Platform</p>
                    <p className="text-sm text-gray-600">Since 2020</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-orange-500 to-red-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl text-orange-100 mb-8">
            Join thousands of travelers who trust ECR Beach Resorts for their perfect getaways
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <button
              onClick={onSignup}
              className="px-8 py-4 bg-white text-orange-600 font-semibold rounded-xl hover:bg-gray-100 transition-colors shadow-lg hover:shadow-xl"
            >
              Sign Up Now
            </button>
            <button
              onClick={onLogin}
              className="px-8 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-orange-600 transition-colors"
            >
              Sign In
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">Get in Touch</h2>
            <p className="text-gray-300">We're here to help you plan your perfect getaway</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg">ECR</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold">ECR Beach Resorts</h3>
                  <p className="text-sm text-gray-400">Your Perfect Getaway</p>
                </div>
              </div>
              <p className="text-gray-400">
                Discover amazing accommodations and create unforgettable memories with ECR Beach Resorts.
              </p>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#events" className="hover:text-white">Events</a></li>
                <li><a href="#properties" className="hover:text-white">Properties</a></li>
                <li><a href="#about" className="hover:text-white">About Us</a></li>
                <li><a href="#contact" className="hover:text-white">Contact</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><button onClick={onSignup} className="hover:text-white">Help Center</button></li>
                <li><button onClick={onSignup} className="hover:text-white">Booking Policy</button></li>
                <li><button onClick={onSignup} className="hover:text-white">Cancellation</button></li>
                <li><button onClick={onSignup} className="hover:text-white">Privacy Policy</button></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
              <div className="space-y-2 text-gray-400">
                <p>📧 info@ecrbeachresorts.com</p>
                <p>📞 +91 98765 43210</p>
                <p>📍 Mumbai, Maharashtra, India</p>
                <div className="mt-4">
                  <button 
                   onClick={onLogin}
                    className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors"
                  >
                    Contact Us
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 ECR Beach Resorts. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}