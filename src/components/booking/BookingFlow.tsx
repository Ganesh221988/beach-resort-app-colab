import React, { useState } from 'react';
import { Calendar, Clock, Users, IndianRupee, ArrowLeft, ArrowRight, CreditCard } from 'lucide-react';
import { Property, RoomType, Booking } from '../../types';
import { useAuth } from '../../contexts/AuthContext';

interface BookingFlowProps {
  property: Property;
  properties?: Property[];
  onComplete: (booking: Partial<Booking>) => void;
  onCancel: () => void;
  userRole?: 'customer' | 'broker';
  customerId?: string;
  isManualBooking?: boolean;
}

export function BookingFlow({ property, properties = [], onComplete, onCancel, userRole = 'customer', customerId, isManualBooking = false }: BookingFlowProps) {
  const [step, setStep] = useState(1);
  const [selectedPropertyId, setSelectedPropertyId] = useState(property.id);
  const [bookingData, setBookingData] = useState({
    room_type_ids: [] as string[],
    start_date: '',
    end_date: '',
    start_time: '',
    end_time: '',
    duration_type: 'day' as 'day' | 'hour',
    guests: 1,
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    coupon_code: '',
    special_requests: ''
  });

  const [pricing, setPricing] = useState({
    subtotal: 0,
    discount: 0,
    total: 0,
    platform_commission: 0,
    broker_commission: 0,
    net_to_owner: 0
  });

  const currentProperty = properties.find(p => p.id === selectedPropertyId) || property;
  const selectedRooms = currentProperty.room_types.filter(room => 
    bookingData.room_type_ids.includes(room.id)
  );

  const calculatePricing = () => {
    let subtotal = 0;
    
    selectedRooms.forEach(room => {
      if (bookingData.duration_type === 'day') {
        const days = Math.ceil((new Date(bookingData.end_date).getTime() - new Date(bookingData.start_date).getTime()) / (1000 * 60 * 60 * 24));
        subtotal += room.price_per_night * days;
      } else {
        const startTime = new Date(`${bookingData.start_date}T${bookingData.start_time}`);
        const endTime = new Date(`${bookingData.start_date}T${bookingData.end_time}`);
        const hours = Math.ceil((endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60));
        subtotal += (room.price_per_hour || 0) * hours;
      }
    });

    // Add extra person charges
    if (bookingData.guests > selectedRooms.reduce((sum, room) => sum + room.capacity, 0)) {
      const extraGuests = bookingData.guests - selectedRooms.reduce((sum, room) => sum + room.capacity, 0);
      subtotal += extraGuests * selectedRooms.reduce((sum, room) => sum + room.extra_person_charge, 0);
    }

    const discount = bookingData.coupon_code ? subtotal * 0.1 : 0; // 10% discount for demo
    const total = subtotal - discount;
    const platform_commission = total * 0.1;
    const broker_commission = userRole === 'broker' ? platform_commission * 0.2 : 0;
    const net_to_owner = total - platform_commission;

    setPricing({
      subtotal,
      discount,
      total,
      platform_commission,
      broker_commission,
      net_to_owner
    });
  };

  React.useEffect(() => {
    calculatePricing();
  }, [bookingData]);

  const toggleRoomSelection = (roomId: string) => {
    setBookingData(prev => ({
      ...prev,
      room_type_ids: prev.room_type_ids.includes(roomId)
        ? prev.room_type_ids.filter(id => id !== roomId)
        : [...prev.room_type_ids, roomId]
    }));
  };

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleComplete = () => {
    if (!bookingData.customer_name || !bookingData.customer_email || !bookingData.customer_phone) {
      alert('Please fill in all required customer information');
      return;
    }
    
    if (bookingData.room_type_ids.length === 0) {
      alert('Please select at least one room type');
      return;
    }
    
    const booking: Partial<Booking> = {
      property_id: currentProperty.id,
      property_title: currentProperty.title,
      room_type_ids: bookingData.room_type_ids,
      room_types: selectedRooms.map(r => r.title),
      start_date: bookingData.duration_type === 'day' 
        ? `${bookingData.start_date}T${property.check_in_time}:00Z`
        : `${bookingData.start_date}T${bookingData.start_time}:00Z`,
      end_date: bookingData.duration_type === 'day'
        ? `${bookingData.end_date}T${currentProperty.check_out_time}:00Z`
        : `${bookingData.start_date}T${bookingData.end_time}:00Z`,
      duration_type: bookingData.duration_type,
      guests: bookingData.guests,
      total_amount: pricing.total,
      platform_commission: pricing.platform_commission,
      broker_commission: pricing.broker_commission,
      net_to_owner: pricing.net_to_owner,
      status: 'pending',
      payment_status: 'pending',
      coupon_code: bookingData.coupon_code || undefined,
      discount_amount: pricing.discount || undefined
    };

    // Show success message for demo
    alert(`Booking created successfully! 
    
Property: ${booking.property_title}
Customer: ${bookingData.customer_name}
Total Amount: ₹${booking.total_amount?.toLocaleString()}
Status: Pending Payment

In production, this would redirect to payment gateway.`);
    
    onComplete(booking);
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Select Rooms & Dates</h2>
      
      {/* Property Selection for Manual Booking */}
      {isManualBooking && properties.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Select Property</label>
          <select
            value={selectedPropertyId}
            onChange={(e) => {
              setSelectedPropertyId(e.target.value);
              setBookingData(prev => ({ ...prev, room_type_ids: [] })); // Reset room selection
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          >
            {properties.map((prop) => (
              <option key={prop.id} value={prop.id}>
                {prop.title} - {prop.city}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Duration Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">Booking Type</label>
        <div className="flex space-x-4">
          <button
            type="button"
            onClick={() => setBookingData(prev => ({ ...prev, duration_type: 'day' }))}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
              bookingData.duration_type === 'day'
                ? 'bg-orange-100 border-orange-300 text-orange-700'
                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Calendar className="h-4 w-4" />
            <span>Daily Booking</span>
          </button>
          <button
            type="button"
            onClick={() => setBookingData(prev => ({ ...prev, duration_type: 'hour' }))}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
              bookingData.duration_type === 'hour'
                ? 'bg-orange-100 border-orange-300 text-orange-700'
                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Clock className="h-4 w-4" />
            <span>Hourly Booking</span>
          </button>
        </div>
      </div>

      {/* Date Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {bookingData.duration_type === 'day' ? 'Check-in Date' : 'Date'}
          </label>
          <input
            type="date"
            value={bookingData.start_date}
            onChange={(e) => setBookingData(prev => ({ ...prev, start_date: e.target.value }))}
            min={new Date().toISOString().split('T')[0]}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            required
          />
        </div>
        
        {bookingData.duration_type === 'day' ? (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Check-out Date</label>
            <input
              type="date"
              value={bookingData.end_date}
              onChange={(e) => setBookingData(prev => ({ ...prev, end_date: e.target.value }))}
              min={bookingData.start_date || new Date().toISOString().split('T')[0]}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              required
            />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Start Time</label>
              <input
                type="time"
                value={bookingData.start_time}
                onChange={(e) => setBookingData(prev => ({ ...prev, start_time: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">End Time</label>
              <input
                type="time"
                value={bookingData.end_time}
                onChange={(e) => setBookingData(prev => ({ ...prev, end_time: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                required
              />
            </div>
          </div>
        )}
      </div>

      {/* Room Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">Select Rooms</label>
        <div className="space-y-3">
          {currentProperty.room_types.map((room) => (
            <div
              key={room.id}
              className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                bookingData.room_type_ids.includes(room.id)
                  ? 'bg-orange-50 border-orange-300'
                  : 'bg-white border-gray-300 hover:bg-gray-50'
              }`}
              onClick={() => toggleRoomSelection(room.id)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">{room.title}</h3>
                  <p className="text-sm text-gray-600">Up to {room.capacity} guests</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">
                    ₹{bookingData.duration_type === 'day' ? room.price_per_night.toLocaleString() : (room.price_per_hour || 0).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600">
                    per {bookingData.duration_type === 'day' ? 'night' : 'hour'}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Guests */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Number of Guests</label>
        <input
          type="number"
          value={bookingData.guests}
          onChange={(e) => setBookingData(prev => ({ ...prev, guests: parseInt(e.target.value) }))}
          min="1"
          max="20"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
        />
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Guest Information</h2>
      
      {userRole === 'broker' && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-700">
            You are booking on behalf of a customer. Please enter their details below.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full Name *
          </label>
          <input
            type="text"
            value={bookingData.customer_name}
            onChange={(e) => setBookingData(prev => ({ ...prev, customer_name: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address *
          </label>
          <input
            type="email"
            value={bookingData.customer_email}
            onChange={(e) => setBookingData(prev => ({ ...prev, customer_email: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Phone Number *
        </label>
        <input
          type="tel"
          value={bookingData.customer_phone}
          onChange={(e) => setBookingData(prev => ({ ...prev, customer_phone: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Special Requests (Optional)
        </label>
        <textarea
          value={bookingData.special_requests}
          onChange={(e) => setBookingData(prev => ({ ...prev, special_requests: e.target.value }))}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          placeholder="Any special requirements or requests..."
        />
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Review & Apply Offers</h2>
      
      {/* Booking Summary */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Booking Summary</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Property:</span>
            <span className="font-medium">{property.title}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Rooms:</span>
            <span className="font-medium">{selectedRooms.map(r => r.title).join(', ')}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Dates:</span>
            <span className="font-medium">
              {bookingData.duration_type === 'day' 
                ? `${bookingData.start_date} to ${bookingData.end_date}`
                : `${bookingData.start_date} (${bookingData.start_time} - ${bookingData.end_time})`
              }
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Guests:</span>
            <span className="font-medium">{bookingData.guests}</span>
          </div>
        </div>
      </div>

      {/* Coupon Code */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Coupon Code (Optional)
        </label>
        <div className="flex space-x-3">
          <input
            type="text"
            value={bookingData.coupon_code}
            onChange={(e) => setBookingData(prev => ({ ...prev, coupon_code: e.target.value }))}
            placeholder="Enter coupon code"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          />
          <button
            type="button"
            className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
          >
            Apply
          </button>
        </div>
        {bookingData.coupon_code && (
          <p className="text-sm text-green-600 mt-2">
            ✓ Coupon applied! You saved ₹{pricing.discount.toLocaleString()}
          </p>
        )}
      </div>

      {/* Price Breakdown */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Price Breakdown</h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Subtotal</span>
            <span>₹{pricing.subtotal.toLocaleString()}</span>
          </div>
          {pricing.discount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Discount</span>
              <span>-₹{pricing.discount.toLocaleString()}</span>
            </div>
          )}
          <div className="border-t border-gray-200 pt-3">
            <div className="flex justify-between text-lg font-semibold">
              <span>Total Amount</span>
              <span>₹{pricing.total.toLocaleString()}</span>
            </div>
          </div>
          
          {userRole === 'broker' && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Your Commission</span>
                <span className="text-green-600 font-medium">₹{pricing.broker_commission.toLocaleString()}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Payment</h2>
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-700">
          <strong>Demo Mode:</strong> This is a demonstration. No actual payment will be processed.
        </p>
      </div>

      {/* Payment Summary */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Payment Summary</h3>
        <div className="flex justify-between items-center text-xl font-bold">
          <span>Total to Pay</span>
          <span className="text-orange-600">₹{pricing.total.toLocaleString()}</span>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="space-y-4">
        <h3 className="font-semibold text-gray-900">Select Payment Method</h3>
        
        <div className="space-y-3">
          {['Credit/Debit Card', 'UPI', 'Net Banking', 'Wallet'].map((method) => (
            <label key={method} className="flex items-center space-x-3 p-4 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
              <input type="radio" name="payment_method" className="text-orange-500" defaultChecked={method === 'Credit/Debit Card'} />
              <CreditCard className="h-5 w-5 text-gray-400" />
              <span>{method}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Terms */}
      <div className="bg-gray-50 rounded-lg p-4">
        <label className="flex items-start space-x-3">
          <input type="checkbox" className="mt-1 text-orange-500" required />
          <span className="text-sm text-gray-600">
            I agree to the <a href="#" className="text-orange-600 hover:underline">Terms & Conditions</a> and 
            <a href="#" className="text-orange-600 hover:underline"> Cancellation Policy</a>
          </span>
        </label>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={onCancel}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Property</span>
          </button>
          
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">Book Your Stay</h1>
            <div className="text-sm text-gray-500">
              Step {step} of 4
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center space-x-4">
            {[1, 2, 3, 4].map((stepNum) => (
              <div key={stepNum} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  stepNum <= step 
                    ? 'bg-orange-500 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {stepNum}
                </div>
                {stepNum < 4 && (
                  <div className={`w-16 h-1 mx-2 ${
                    stepNum < step ? 'bg-orange-500' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl border border-gray-200 p-8 mb-8">
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
          {step === 4 && renderStep4()}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={handleBack}
            disabled={step === 1}
            className="flex items-center space-x-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </button>
          
          {step < 4 ? (
            <button
              onClick={handleNext}
              disabled={
                (step === 1 && (bookingData.room_type_ids.length === 0 || !bookingData.start_date)) ||
                (step === 2 && (!bookingData.customer_name || !bookingData.customer_email || !bookingData.customer_phone))
              }
              className="flex items-center space-x-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>Next</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              onClick={handleComplete}
              className="flex items-center space-x-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
            >
              <CreditCard className="h-4 w-4" />
              <span>Complete Booking</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}