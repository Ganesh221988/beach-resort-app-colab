import React, { useState } from 'react';
import { ArrowLeft, Heart, Share2, Star, MapPin, Users, Wifi, Car, Calendar, Clock, IndianRupee, Mail, MessageCircle, Copy, Check, Play, X } from 'lucide-react';
import { Property } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { favoritesService, userService } from '../../services/supabaseService';
import { SEOHead, generatePropertySEO } from '../common/SEOHead';

interface PropertyPageProps {
  property: Property;
  onBack: () => void;
  onBookNow?: () => void;
  onLogin: () => void;
}

export function PropertyPage({ property, onBack, onBookNow = () => {}, onLogin }: PropertyPageProps) {
  const { user } = useAuth();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [ownerContactInfo, setOwnerContactInfo] = useState<any>(null);

  const propertyUrl = `${window.location.origin}/property/${property.id}`;
  const [contactLoading, setContactLoading] = useState(false);

  React.useEffect(() => {
    if (user) {
      checkIfFavorite();
    }
    loadOwnerContactInfo();
  }, [user, property.id]);

  const loadOwnerContactInfo = async () => {
    setContactLoading(true);
    try {
      // For demo purposes, use mock contact info
      const mockContactInfo = {
        calling_number: '+91 98765 43210',
        whatsapp_number: '+91 98765 43210',
        contact_person_name: 'John Smith',
        business_hours: '9 AM - 6 PM',
        email_for_inquiries: 'john@beachresorts.com'
      };
      setOwnerContactInfo(mockContactInfo);
    } catch (error) {
      console.error('Error loading owner contact info:', error);
      // Fallback to basic contact info
      setOwnerContactInfo({
        calling_number: '+91 98765 43210',
        whatsapp_number: '+91 98765 43210',
        contact_person_name: 'Property Owner',
        business_hours: '9 AM - 6 PM'
      });
    } finally {
      setContactLoading(false);
    }
  };
  
  const checkIfFavorite = async () => {
    if (!user) return;
    try {
      const favorite = await favoritesService.isFavorite(user.id, property.id);
      setIsFavorite(favorite);
    } catch (error) {
      console.error('Error checking favorite status:', error);
    }
  };

  const handleFavoriteClick = async () => {
    if (!user) {
      onLogin();
      return;
    }

    try {
      if (isFavorite) {
        await favoritesService.removeFromFavorites(user.id, property.id);
        setIsFavorite(false);
      } else {
        await favoritesService.addToFavorites(user.id, property.id);
        setIsFavorite(true);
      }
    } catch (error) {
      console.error('Error updating favorites:', error);
      alert('Error updating favorites. Please try again.');
    }
  };

  const handleBookNow = () => {
    if (!user) {
      onLogin();
      return;
    }

    if (user.role !== 'customer' && user.role !== 'broker') {
      alert('Only customers and brokers can make bookings.');
      return;
    }

    onBookNow();
  };

  const handleOwnerCall = () => {
    const phoneNumber = ownerContactInfo?.calling_number || '+91 98765 43210';
    if (phoneNumber) {
      window.open(`tel:${phoneNumber}`);
    } else {
      // Fallback to default number
      window.open(`tel:+91 98765 43210`);
    }
  };

  const handleOwnerWhatsApp = () => {
    const whatsappNumber = ownerContactInfo?.whatsapp_number || '+91 98765 43210';
    if (whatsappNumber) {
      const message = encodeURIComponent(`Hi! I'm interested in ${property.title} in ${property.city}. Could you please provide more details?`);
      const cleanNumber = whatsappNumber.replace(/[^0-9]/g, '');
      window.open(`https://wa.me/${cleanNumber}?text=${message}`, '_blank');
    } else {
      // Fallback to default number
      const message = encodeURIComponent(`Hi! I'm interested in ${property.title} in ${property.city}. Could you please provide more details?`);
      window.open(`https://wa.me/919876543210?text=${message}`, '_blank');
    }
  };
  
  const handleShare = (method: 'email' | 'whatsapp' | 'copy') => {
    const shareText = `Check out this amazing property: ${property.title} in ${property.city}. Starting from ₹${Math.min(...property.room_types.map(r => r.price_per_night)).toLocaleString()}/night`;
    
    switch (method) {
      case 'email':
        const emailSubject = encodeURIComponent(`Amazing Property: ${property.title}`);
        const emailBody = encodeURIComponent(`${shareText}\n\nView details: ${propertyUrl}`);
        window.open(`mailto:?subject=${emailSubject}&body=${emailBody}`);
        break;
        
      case 'whatsapp':
        const whatsappText = encodeURIComponent(`${shareText}\n\n${propertyUrl}`);
        window.open(`https://wa.me/?text=${whatsappText}`);
        break;
        
      case 'copy':
        navigator.clipboard.writeText(propertyUrl).then(() => {
          setCopySuccess(true);
          setTimeout(() => setCopySuccess(false), 2000);
        });
        break;
    }
    
    setShowShareModal(false);
  };

  const getMinPrice = () => {
    return Math.min(...property.room_types.map(room => room.price_per_night));
  };

  const amenityIcons = {
    'WiFi': Wifi,
    'Parking': Car,
    'AC': null,
    'Pool': null,
    'Kitchen': null,
    'Beach Access': null,
    'Mountain View': null,
    'Spa': null,
    'Restaurant': null,
    'Fireplace': null
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <SEOHead {...generatePropertySEO(property)} />
      
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={onBack}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Properties</span>
            </button>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowShareModal(true)}
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <Share2 className="h-4 w-4" />
                <span>Share</span>
              </button>
              
              <button
                onClick={handleFavoriteClick}
                className={`p-3 rounded-lg transition-colors ${
                  isFavorite 
                    ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Heart className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Property Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{property.title}</h1>
              <div className="flex items-center space-x-4 text-gray-600">
                <div className="flex items-center space-x-1">
                  <MapPin className="h-5 w-5" />
                  <span>{property.address}, {property.city}, {property.state}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Star className="h-5 w-5 text-yellow-500 fill-current" />
                  <span className="font-medium">4.8</span>
                  <span>(124 reviews)</span>
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-3xl font-bold text-gray-900">₹{getMinPrice().toLocaleString()}</div>
              <div className="text-gray-600">per night</div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              property.status === 'active' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {property.status === 'active' ? 'Available' : 'Under Review'}
            </span>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              {property.booking_mode === 'both' ? 'Full Villa & Rooms' : 
               property.booking_mode === 'full_villa' ? 'Full Villa Only' : 'Rooms Only'}
            </span>
            <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
              {property.booking_types === 'both' ? 'Daily & Hourly' : 
               property.booking_types === 'daily' ? 'Daily Booking' : 'Hourly Booking'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Images and Video */}
          <div className="lg:col-span-2 space-y-6">
            {/* Main Image */}
            <div className="relative">
              <img
                src={property.images[selectedImageIndex]}
                alt={property.title}
                className="w-full h-96 object-cover rounded-xl shadow-lg"
              />
              {property.video_url && (
                <button
                  onClick={() => setShowVideoModal(true)}
                  className="absolute top-4 left-4 flex items-center space-x-2 px-4 py-2 bg-black/70 text-white rounded-lg hover:bg-black/80 transition-colors"
                >
                  <Play className="h-4 w-4" />
                  <span>Watch Video</span>
                </button>
              )}
            </div>

            {/* Image Gallery */}
            <div className="grid grid-cols-4 gap-3">
              {property.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`relative rounded-lg overflow-hidden ${
                    selectedImageIndex === index ? 'ring-2 ring-orange-500' : ''
                  }`}
                >
                  <img
                    src={image}
                    alt={`Property ${index + 1}`}
                    className="w-full h-20 object-cover hover:opacity-80 transition-opacity"
                  />
                </button>
              ))}
            </div>

            {/* Description */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Property</h2>
              <p className="text-gray-700 leading-relaxed mb-6">{property.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Property Details</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Check-in:</span>
                      <span className="font-medium">{property.check_in_time}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Check-out:</span>
                      <span className="font-medium">{property.check_out_time}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Max Capacity:</span>
                      <span className="font-medium">{Math.max(...property.room_types.map(r => r.capacity))} guests</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Room Types:</span>
                      <span className="font-medium">{property.room_types.length}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Cancellation Policy</h3>
                  <p className="text-sm text-gray-600">{property.cancellation_policy}</p>
                </div>
              </div>
            </div>

            {/* Amenities */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {property.amenities.map((amenity, index) => {
                  const Icon = amenityIcons[amenity as keyof typeof amenityIcons];
                  return (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      {Icon ? (
                        <Icon className="h-5 w-5 text-orange-500" />
                      ) : (
                        <div className="w-5 h-5 bg-orange-500 rounded-full" />
                      )}
                      <span className="text-gray-700">{amenity}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Room Types */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Room Types & Rates</h2>
              <div className="space-y-4">
                {property.room_types.map((room, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-semibold text-gray-900">{room.title}</h3>
                      <div className="text-right">
                        <div className="text-xl font-bold text-gray-900">₹{room.price_per_night.toLocaleString()}</div>
                        <div className="text-sm text-gray-600">per night</div>
                        {room.price_per_hour && (
                          <div className="text-sm text-gray-600">₹{room.price_per_hour.toLocaleString()}/hour</div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                      <div className="flex items-center space-x-1">
                        <Users className="h-4 w-4" />
                        <span>Up to {room.capacity} guests</span>
                      </div>
                      {room.extra_person_charge > 0 && (
                        <span>Extra person: ₹{room.extra_person_charge}</span>
                      )}
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {room.amenities.map((amenity, idx) => (
                        <span key={idx} className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs">
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Booking Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-24">
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  ₹{getMinPrice().toLocaleString()}
                </div>
                <div className="text-gray-600">per night</div>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Check-in</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Check-out</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Adults</label>
                    <input
                      type="number"
                      defaultValue="1"
                      min="1"
                      max="20"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Children</label>
                    <input
                      type="number"
                      defaultValue="0"
                      min="0"
                      max="10"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                </div>
              </div>

              <button
                onClick={handleBookNow}
                className="w-full px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl mb-4"
              >
                Book Now
              </button>

              {/* Owner Contact Buttons - Always Show */}
              <div className="space-y-3 mb-4">
                <div className="text-sm font-medium text-gray-700 text-center">Contact Property Owner</div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={handleOwnerCall}
                    className="flex items-center justify-center space-x-2 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors shadow-md hover:shadow-lg"
                  >
                    <Phone className="h-4 w-4" />
                    <span>Call Now</span>
                  </button>
                  
                  <button
                    onClick={handleOwnerWhatsApp}
                    className="flex items-center justify-center space-x-2 px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors shadow-md hover:shadow-lg"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span>WhatsApp</span>
                  </button>
                </div>
                
                <div className="text-center text-xs text-gray-500">
                  Contact: {ownerContactInfo?.contact_person_name || 'John Smith'}
                </div>
                
                <div className="text-center text-xs text-gray-500">
                  Hours: {ownerContactInfo?.business_hours || '9 AM - 6 PM'}
                </div>
                
                <div className="text-center text-xs text-gray-500">
                  📞 {ownerContactInfo?.calling_number || '+91 98765 43210'}
                </div>
              </div>
              
              <div className="text-center text-sm text-gray-600 mb-4">
                You won't be charged yet
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">₹{getMinPrice().toLocaleString()} × 3 nights</span>
                  <span>₹{(getMinPrice() * 3).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Service fee</span>
                  <span>₹{Math.round(getMinPrice() * 3 * 0.1).toLocaleString()}</span>
                </div>
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>₹{Math.round(getMinPrice() * 3 * 1.1).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">Share Property</h3>
              <button
                onClick={() => setShowShareModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="mb-6">
                <img
                  src={property.images[0]}
                  alt={property.title}
                  className="w-full h-32 object-cover rounded-lg mb-3"
                />
                <h4 className="font-semibold text-gray-900">{property.title}</h4>
                <p className="text-sm text-gray-600">{property.city}, {property.state}</p>
              </div>
              
              <div className="space-y-3">
                <button
                  onClick={() => handleShare('whatsapp')}
                  className="w-full flex items-center space-x-3 p-4 bg-green-50 hover:bg-green-100 border border-green-200 rounded-lg transition-colors"
                >
                  <MessageCircle className="h-6 w-6 text-green-600" />
                  <div className="text-left">
                    <div className="font-medium text-gray-900">Share on WhatsApp</div>
                    <div className="text-sm text-gray-600">Send to friends and family</div>
                  </div>
                </button>
                
                <button
                  onClick={() => handleShare('email')}
                  className="w-full flex items-center space-x-3 p-4 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors"
                >
                  <Mail className="h-6 w-6 text-blue-600" />
                  <div className="text-left">
                    <div className="font-medium text-gray-900">Share via Email</div>
                    <div className="text-sm text-gray-600">Send property details by email</div>
                  </div>
                </button>
                
                <button
                  onClick={() => handleShare('copy')}
                  className="w-full flex items-center space-x-3 p-4 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg transition-colors"
                >
                  {copySuccess ? (
                    <Check className="h-6 w-6 text-green-600" />
                  ) : (
                    <Copy className="h-6 w-6 text-gray-600" />
                  )}
                  <div className="text-left">
                    <div className="font-medium text-gray-900">
                      {copySuccess ? 'Link Copied!' : 'Copy Link'}
                    </div>
                    <div className="text-sm text-gray-600">
                      {copySuccess ? 'Property link copied to clipboard' : 'Copy property link to clipboard'}
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Video Modal */}
      {showVideoModal && property.video_url && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl">
            <button
              onClick={() => setShowVideoModal(false)}
              className="absolute -top-12 right-0 p-2 text-white hover:text-gray-300 rounded-lg transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
            <video
              src={property.video_url}
              controls
              autoPlay
              className="w-full rounded-xl shadow-2xl"
            >
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      )}
    </div>
  );
}