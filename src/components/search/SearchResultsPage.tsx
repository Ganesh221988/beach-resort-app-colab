import React, { useState, useMemo } from 'react';
import { Search, Filter, ArrowLeft, SlidersHorizontal, Star, MapPin, IndianRupee, Users, X, ChevronDown, ChevronUp } from 'lucide-react';
import { Property } from '../../types';
import { PropertyCard } from '../common/PropertyCard';
import { PropertyPage } from '../property/PropertyPage';
import { useAuth } from '../../contexts/AuthContext';
import { mockEvents } from '../../data/mockData';
import { SEOHead, generateSearchSEO } from '../common/SEOHead';

interface SearchResultsPageProps {
  searchQuery: {
    selectedEvent: string;
    checkIn: string;
    checkOut: string;
    adults: number;
    children: number;
  };
  properties: Property[];
  onBack: () => void;
  onLogin: () => void;
}

interface SearchFilters {
  budget: {
    min: number;
    max: number;
  };
  location: string;
  propertyName: string;
  propertyId: string;
  ownerId: string;
  rating: number;
  amenities: string[];
}

type SortOption = 'relevance' | 'price_high' | 'price_low' | 'rating';

export function SearchResultsPage({ searchQuery, properties, onBack, onLogin }: SearchResultsPageProps) {
  const { user } = useAuth();
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('relevance');
  const [filters, setFilters] = useState<SearchFilters>({
    budget: { min: 0, max: 50000 },
    location: '',
    propertyName: '',
    propertyId: '',
    ownerId: '',
    rating: 0,
    amenities: []
  });

  const allAmenities = [
    'WiFi', 'AC', 'Pool', 'Parking', 'Kitchen', 'Beach Access',
    'Garden', 'Balcony', 'Fireplace', 'Spa', 'Restaurant', 'Gym',
    'Mountain View', 'Sea View', 'Private Pool', 'Hot Tub', 'BBQ Area'
  ];

  const sortOptions = [
    { value: 'relevance', label: 'Most Relevant' },
    { value: 'price_low', label: 'Price: Low to High' },
    { value: 'price_high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Top Rated' }
  ];

  // Filter and sort properties
  const filteredAndSortedProperties = useMemo(() => {
    let filtered = properties.filter(property => {
      // Budget filter
      const minPrice = Math.min(...property.room_types.map(r => r.price_per_night));
      if (minPrice < filters.budget.min || minPrice > filters.budget.max) {
        return false;
      }

      // Location filter
      if (filters.location && !property.city.toLowerCase().includes(filters.location.toLowerCase()) && 
          !property.state.toLowerCase().includes(filters.location.toLowerCase())) {
        return false;
      }

      // Property name filter
      if (filters.propertyName && !property.title.toLowerCase().includes(filters.propertyName.toLowerCase())) {
        return false;
      }

      // Property ID filter
      if (filters.propertyId && !property.id.includes(filters.propertyId)) {
        return false;
      }

      // Owner ID filter
      if (filters.ownerId && !property.owner_id.includes(filters.ownerId)) {
        return false;
      }

      // Rating filter (mock rating of 4.8 for demo)
      const propertyRating = 4.8;
      if (filters.rating > 0 && propertyRating < filters.rating) {
        return false;
      }

      // Amenities filter
      if (filters.amenities.length > 0) {
        const hasAllAmenities = filters.amenities.every(amenity => 
          property.amenities.includes(amenity)
        );
        if (!hasAllAmenities) {
          return false;
        }
      }

      return true;
    });

    // Sort properties
    switch (sortBy) {
      case 'price_low':
        filtered.sort((a, b) => {
          const aMin = Math.min(...a.room_types.map(r => r.price_per_night));
          const bMin = Math.min(...b.room_types.map(r => r.price_per_night));
          return aMin - bMin;
        });
        break;
      case 'price_high':
        filtered.sort((a, b) => {
          const aMin = Math.min(...a.room_types.map(r => r.price_per_night));
          const bMin = Math.min(...b.room_types.map(r => r.price_per_night));
          return bMin - aMin;
        });
        break;
      case 'rating':
        // Mock sorting by rating (in real app, would use actual ratings)
        filtered.sort(() => Math.random() - 0.5);
        break;
      case 'relevance':
      default:
        // Keep original order for relevance
        break;
    }

    return filtered;
  }, [properties, filters, sortBy]);

  const handlePropertyClick = (property: Property) => {
    setSelectedProperty(property);
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

    // TODO: Implement booking flow
    alert('Booking flow will be implemented here');
  };

  const toggleAmenity = (amenity: string) => {
    setFilters(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const clearFilters = () => {
    setFilters({
      budget: { min: 0, max: 50000 },
      location: '',
      propertyName: '',
      propertyId: '',
      ownerId: '',
      rating: 0,
      amenities: []
    });
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.location) count++;
    if (filters.propertyName) count++;
    if (filters.propertyId) count++;
    if (filters.ownerId) count++;
    if (filters.rating > 0) count++;
    if (filters.amenities.length > 0) count++;
    if (filters.budget.min > 0 || filters.budget.max < 50000) count++;
    return count;
  };

  if (selectedProperty) {
    return (
      <PropertyPage
        property={selectedProperty}
        onBack={() => setSelectedProperty(null)}
        onBookNow={handleBookNow}
        onLogin={onLogin}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SEOHead {...generateSearchSEO(searchQuery, filteredAndSortedProperties.length)} />
      
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={onBack}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Home</span>
            </button>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {filteredAndSortedProperties.length} properties found
              </span>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors lg:hidden"
              >
                <SlidersHorizontal className="h-4 w-4" />
                <span>Filters</span>
                {getActiveFiltersCount() > 0 && (
                  <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
                    {getActiveFiltersCount()}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Left Panel - Filters */}
          <div className={`w-80 flex-shrink-0 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Filters</h2>
                {getActiveFiltersCount() > 0 && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-orange-600 hover:text-orange-700 font-medium"
                  >
                    Clear All
                  </button>
                )}
              </div>

              <div className="space-y-6">
                {/* Budget Filter */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Budget (per night)</h3>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Min</label>
                        <input
                          type="number"
                          value={filters.budget.min}
                          onChange={(e) => setFilters(prev => ({
                            ...prev,
                            budget: { ...prev.budget, min: parseInt(e.target.value) || 0 }
                          }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          placeholder="₹0"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Max</label>
                        <input
                          type="number"
                          value={filters.budget.max}
                          onChange={(e) => setFilters(prev => ({
                            ...prev,
                            budget: { ...prev.budget, max: parseInt(e.target.value) || 50000 }
                          }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          placeholder="₹50,000"
                        />
                      </div>
                    </div>
                    <div className="text-sm text-gray-600">
                      ₹{filters.budget.min.toLocaleString()} - ₹{filters.budget.max.toLocaleString()}
                    </div>
                  </div>
                </div>

                {/* Location Filter */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Location</h3>
                  <input
                    type="text"
                    value={filters.location}
                    onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="City or State"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>

                {/* Property Name Filter */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Property Name</h3>
                  <input
                    type="text"
                    value={filters.propertyName}
                    onChange={(e) => setFilters(prev => ({ ...prev, propertyName: e.target.value }))}
                    placeholder="Search by property name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>

                {/* Property ID Filter */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Property ID</h3>
                  <input
                    type="text"
                    value={filters.propertyId}
                    onChange={(e) => setFilters(prev => ({ ...prev, propertyId: e.target.value }))}
                    placeholder="Enter property ID"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>

                {/* Owner ID Filter */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Owner ID</h3>
                  <input
                    type="text"
                    value={filters.ownerId}
                    onChange={(e) => setFilters(prev => ({ ...prev, ownerId: e.target.value }))}
                    placeholder="Enter owner ID"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>

                {/* Rating Filter */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Minimum Rating</h3>
                  <div className="space-y-2">
                    {[4.5, 4.0, 3.5, 3.0].map((rating) => (
                      <label key={rating} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          name="rating"
                          checked={filters.rating === rating}
                          onChange={() => setFilters(prev => ({ ...prev, rating }))}
                          className="text-orange-500 focus:ring-orange-500"
                        />
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          <span className="text-sm">{rating}+ stars</span>
                        </div>
                      </label>
                    ))}
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="rating"
                        checked={filters.rating === 0}
                        onChange={() => setFilters(prev => ({ ...prev, rating: 0 }))}
                        className="text-orange-500 focus:ring-orange-500"
                      />
                      <span className="text-sm">Any rating</span>
                    </label>
                  </div>
                </div>

                {/* Amenities Filter */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Amenities</h3>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {allAmenities.map((amenity) => (
                      <label key={amenity} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters.amenities.includes(amenity)}
                          onChange={() => toggleAmenity(amenity)}
                          className="text-orange-500 focus:ring-orange-500 rounded"
                        />
                        <span className="text-sm text-gray-700">{amenity}</span>
                      </label>
                    ))}
                  </div>
                  {filters.amenities.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1">
                      {filters.amenities.map((amenity) => (
                        <span
                          key={amenity}
                          className="flex items-center space-x-1 px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs"
                        >
                          <span>{amenity}</span>
                          <button
                            onClick={() => toggleAmenity(amenity)}
                            className="text-orange-500 hover:text-orange-700"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Results */}
          <div className="flex-1">
            {/* Search Summary */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Search Results</h1>
                  <p className="text-gray-600">
                    {searchQuery.selectedEvent && `Event: ${mockEvents.find(e => e.id === searchQuery.selectedEvent)?.name || searchQuery.selectedEvent} • `}
                    {searchQuery.checkIn && searchQuery.checkOut && 
                      `${new Date(searchQuery.checkIn).toLocaleDateString()} - ${new Date(searchQuery.checkOut).toLocaleDateString()} • `
                    }
                    {(searchQuery.adults || 0) + (searchQuery.children || 0) > 0 && `${(searchQuery.adults || 0) + (searchQuery.children || 0)} guests`}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-gray-900">
                    {filteredAndSortedProperties.length} properties
                  </p>
                  <p className="text-sm text-gray-600">matching your search</p>
                </div>
              </div>

              {/* Sort Options */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-700">Sort by:</span>
                  <div className="flex flex-wrap gap-2">
                    {sortOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setSortBy(option.value)}
                        className={`px-3 py-1 text-sm font-medium rounded-lg transition-colors ${
                          sortBy === option.value
                            ? 'bg-orange-500 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors lg:hidden"
                >
                  <Filter className="h-4 w-4" />
                  <span>Filters</span>
                  {getActiveFiltersCount() > 0 && (
                    <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
                      {getActiveFiltersCount()}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Results Grid */}
            {filteredAndSortedProperties.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredAndSortedProperties.map((property) => (
                  <PropertyCard
                    key={property.id}
                    property={property}
                    onSelect={handlePropertyClick}
                    showBookButton={true}
                    onLogin={onLogin}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No properties found</h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your filters or search criteria to find more properties.
                </p>
                <button
                  onClick={clearFilters}
                  className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}