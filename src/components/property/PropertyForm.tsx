import React, { useState } from 'react';
import { X, Plus, Upload, MapPin, Camera, Save, ArrowLeft } from 'lucide-react';
import { Property, RoomType } from '../../types';
import { FileUpload, ImageGallery } from '../common/FileUpload';
import { fileStorageService, FileUploadResult } from '../../services/fileStorageService';
import { useAuth } from '../../contexts/AuthContext';

interface PropertyFormProps {
  property?: Property;
  onSave: (property: Partial<Property>) => void;
  onCancel: () => void;
}

export function PropertyForm({ property, onSave, onCancel }: PropertyFormProps) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: property?.title || '',
    description: property?.description || '',
    address: property?.address || '',
    city: property?.city || '',
    state: property?.state || '',
    amenities: property?.amenities || [],
    images: property?.images || [],
    video_url: property?.video_url || '',
    booking_mode: property?.booking_mode || 'both',
    booking_types: property?.booking_types || 'both',
    full_villa_rates: property?.full_villa_rates || {
      daily_rate: 0,
      hourly_rate: 0
    },
    cancellation_policy: property?.cancellation_policy || 'Free cancellation up to 24 hours before check-in',
    check_in_time: property?.check_in_time || '15:00',
    check_out_time: property?.check_out_time || '11:00',
    room_types: property?.room_types || []
  });

  const [newAmenity, setNewAmenity] = useState('');
  const [uploadingImages, setUploadingImages] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);

  const commonAmenities = [
    'WiFi', 'AC', 'Pool', 'Parking', 'Kitchen', 'Beach Access', 
    'Garden', 'Balcony', 'Fireplace', 'Spa', 'Restaurant', 'Gym'
  ];

  const addAmenity = (amenity: string) => {
    if (amenity && !formData.amenities.includes(amenity)) {
      setFormData(prev => ({
        ...prev,
        amenities: [...prev.amenities, amenity]
      }));
      setNewAmenity('');
    }
  };

  const removeAmenity = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.filter(a => a !== amenity)
    }));
  };

  const handleImageUpload = (result: FileUploadResult) => {
    if (result.success && result.url) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, result.url!]
      }));
    }
  };

  const handleVideoUpload = (result: FileUploadResult) => {
    if (result.success && result.url) {
      setFormData(prev => ({
        ...prev,
        video_url: result.url!
      }));
    }
  };

  const removeImage = (image: string) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter(img => img !== image)
    }));
  };

  const addRoomType = () => {
    const newRoom: RoomType = {
      id: Date.now().toString(),
      property_id: property?.id || '',
      title: 'New Room Type',
      capacity: 2,
      price_per_night: 5000,
      price_per_hour: 800,
      extra_person_charge: 500,
      amenities: []
    };
    setFormData(prev => ({
      ...prev,
      room_types: [...prev.room_types, newRoom]
    }));
  };

  const updateRoomType = (index: number, updates: Partial<RoomType>) => {
    setFormData(prev => ({
      ...prev,
      room_types: prev.room_types.map((room, i) => 
        i === index ? { ...room, ...updates } : room
      )
    }));
  };

  const removeRoomType = (index: number) => {
    setFormData(prev => ({
      ...prev,
      room_types: prev.room_types.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <button
            onClick={onCancel}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Properties</span>
          </button>
          <h1 className="text-3xl font-bold text-gray-900">
            {property ? 'Edit Property' : 'Add New Property'}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Basic Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Property Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City *
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  required
                />
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                required
              />
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Address *
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  State *
                </label>
                <input
                  type="text"
                  value={formData.state}
                  onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Check-in Time
                </label>
                <input
                  type="time"
                  value={formData.check_in_time}
                  onChange={(e) => setFormData(prev => ({ ...prev, check_in_time: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Check-out Time
                </label>
                <input
                  type="time"
                  value={formData.check_out_time}
                  onChange={(e) => setFormData(prev => ({ ...prev, check_out_time: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Property Images</h2>
            
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-700">
                <strong>Upload Tips:</strong> Add up to 10 high-quality images. These will be used for automated social media marketing posts. Images are automatically optimized for web.
              </p>
            </div>
            
            {formData.images.length < 10 && (
              <div className="mb-6">
                <FileUpload
                  type="image"
                  propertyId={property?.id || 'new-property'}
                  multiple={true}
                  maxFiles={10 - formData.images.length}
                  onUploadComplete={handleImageUpload}
                  onUploadError={(error) => alert(error)}
                  className="mb-4"
                />
              </div>
            )}
            
            <div className="mb-4 text-sm text-gray-600">
              {formData.images.length}/10 images added
              {formData.images.length >= 10 && (
                <span className="text-orange-600 ml-2">(Maximum reached)</span>
              )}
            </div>

            {formData.images.length > 0 && (
              <ImageGallery
                images={formData.images}
                onRemove={(index) => {
                  const imageToRemove = formData.images[index];
                  removeImage(imageToRemove);
                }}
                editable={true}
              />
            )}
          </div>

          {/* Video Upload */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Property Video (Optional)</h2>
            
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-700">
                <strong>Video Tip:</strong> Upload a property tour video to showcase your property better. Videos increase booking rates by 40%.
              </p>
            </div>

            {!formData.video_url ? (
              <FileUpload
                type="video"
                propertyId={property?.id || 'new-property'}
                onUploadComplete={handleVideoUpload}
                onUploadError={(error) => alert(error)}
              />
            ) : (
              <div className="space-y-4">
                <div className="relative">
                  <video
                    src={formData.video_url}
                    controls
                    className="w-full h-64 object-cover rounded-lg"
                  >
                    Your browser does not support the video tag.
                  </video>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, video_url: '' }))}
                    className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <p className="text-sm text-gray-600">Video uploaded successfully. Click the X to remove and upload a different video.</p>
              </div>
            )}
          </div>

          {/* Amenities */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Amenities</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              {commonAmenities.map((amenity) => (
                <button
                  key={amenity}
                  type="button"
                  onClick={() => addAmenity(amenity)}
                  className={`p-2 text-sm rounded-lg border transition-colors ${
                    formData.amenities.includes(amenity)
                      ? 'bg-orange-100 border-orange-300 text-orange-700'
                      : 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {amenity}
                </button>
              ))}
            </div>

            <div className="flex items-center space-x-3">
              <input
                type="text"
                value={newAmenity}
                onChange={(e) => setNewAmenity(e.target.value)}
                placeholder="Add custom amenity"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
              <button
                type="button"
                onClick={() => addAmenity(newAmenity)}
                className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
              >
                Add
              </button>
            </div>

            <div className="flex flex-wrap gap-2 mt-4">
              {formData.amenities.map((amenity) => (
                <span
                  key={amenity}
                  className="flex items-center space-x-1 px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm"
                >
                  <span>{amenity}</span>
                  <button
                    type="button"
                    onClick={() => removeAmenity(amenity)}
                    className="text-orange-500 hover:text-orange-700"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Booking Configuration */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Booking Configuration</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Booking Mode */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Booking Mode *
                </label>
                <select
                  value={formData.booking_mode}
                  onChange={(e) => setFormData(prev => ({ ...prev, booking_mode: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  required
                >
                  <option value="full_villa">Full Villa Only</option>
                  <option value="rooms_only">Rooms Only</option>
                  <option value="both">Both (Full Villa & Rooms)</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Choose how guests can book your property
                </p>
              </div>
              
              {/* Booking Types */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Booking Types *
                </label>
                <select
                  value={formData.booking_types}
                  onChange={(e) => setFormData(prev => ({ ...prev, booking_types: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  required
                >
                  <option value="daily">Daily Only</option>
                  <option value="hourly">Hourly Only</option>
                  <option value="both">Both (Daily & Hourly)</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Select available booking durations
                </p>
              </div>
            </div>
          </div>

          {/* Rate Configuration */}
          {(formData.booking_mode === 'full_villa' || formData.booking_mode === 'both') && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Full Villa Rates</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {(formData.booking_types === 'daily' || formData.booking_types === 'both') && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Daily Rate (₹) *
                    </label>
                    <input
                      type="number"
                      value={formData.full_villa_rates.daily_rate}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        full_villa_rates: {
                          ...prev.full_villa_rates,
                          daily_rate: parseInt(e.target.value) || 0
                        }
                      }))}
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="Enter daily rate for full villa"
                      required
                    />
                  </div>
                )}
                
                {(formData.booking_types === 'hourly' || formData.booking_types === 'both') && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Hourly Rate (₹) *
                    </label>
                    <input
                      type="number"
                      value={formData.full_villa_rates.hourly_rate}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        full_villa_rates: {
                          ...prev.full_villa_rates,
                          hourly_rate: parseInt(e.target.value) || 0
                        }
                      }))}
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="Enter hourly rate for full villa"
                      required
                    />
                  </div>
                )}
              </div>
              
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-700">
                  <strong>Full Villa Booking:</strong> Guests book the entire property exclusively. 
                  This rate applies when the whole villa/property is reserved.
                </p>
              </div>
            </div>
          )}

          {/* Room Types */}
          {(formData.booking_mode === 'rooms_only' || formData.booking_mode === 'both') && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Room Types & Rates</h2>
              <button
                type="button"
                onClick={addRoomType}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>Add Room Type</span>
              </button>
            </div>

            <div className="space-y-6">
              {formData.room_types.map((room, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium text-gray-900">Room Type {index + 1}</h3>
                    <button
                      type="button"
                      onClick={() => removeRoomType(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Room Title
                      </label>
                      <input
                        type="text"
                        value={room.title}
                        onChange={(e) => updateRoomType(index, { title: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Capacity (guests)
                      </label>
                      <input
                        type="number"
                        value={room.capacity}
                        onChange={(e) => updateRoomType(index, { capacity: parseInt(e.target.value) })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {(formData.booking_types === 'daily' || formData.booking_types === 'both') ? 'Price per Night (₹)' : 'Daily Rate (₹)'}
                      </label>
                      <input
                        type="number"
                        value={room.price_per_night}
                        onChange={(e) => updateRoomType(index, { price_per_night: parseInt(e.target.value) })}
                        disabled={formData.booking_types === 'hourly'}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      />
                    </div>
                    
                    {(formData.booking_types === 'hourly' || formData.booking_types === 'both') && (
                      <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Price per Hour (₹)
                      </label>
                      <input
                        type="number"
                        value={room.price_per_hour}
                        onChange={(e) => updateRoomType(index, { price_per_hour: parseInt(e.target.value) })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      />
                      </div>
                    )}
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Extra Person Charge (₹)
                      </label>
                      <input
                        type="number"
                        value={room.extra_person_charge}
                        onChange={(e) => updateRoomType(index, { extra_person_charge: parseInt(e.target.value) })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-700">
                <strong>Room-wise Booking:</strong> Guests can book individual rooms. 
                Each room type can have different rates and capacities.
              </p>
            </div>
          </div>
          )}

          {/* Policies */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Policies</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cancellation Policy
              </label>
              <textarea
                value={formData.cancellation_policy}
                onChange={(e) => setFormData(prev => ({ ...prev, cancellation_policy: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex items-center justify-end space-x-4 pb-8">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center space-x-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
            >
              <Save className="h-4 w-4" />
              <span>{property ? 'Update Property' : 'Create Property'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}