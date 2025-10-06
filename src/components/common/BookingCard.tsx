import React from 'react';
import { Calendar, Users, MapPin, Clock, IndianRupee, User } from 'lucide-react';
import { Booking } from '../../types';

interface BookingCardProps {
  booking: Booking;
  showActions?: boolean;
  userRole?: 'admin' | 'owner' | 'broker' | 'customer';
  onBrokerClick?: (brokerId: string) => void;
}

export function BookingCard({ booking, showActions = false, userRole, onBrokerClick }: BookingCardProps) {
  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    confirmed: 'bg-green-100 text-green-800 border-green-200',
    cancelled: 'bg-red-100 text-red-800 border-red-200',
    completed: 'bg-blue-100 text-blue-800 border-blue-200'
  };

  const paymentStatusColors = {
    pending: 'bg-orange-100 text-orange-800',
    success: 'bg-green-100 text-green-800',
    failed: 'bg-red-100 text-red-800',
    refunded: 'bg-gray-100 text-gray-800'
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getDuration = () => {
    const start = new Date(booking.start_date);
    const end = new Date(booking.end_date);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    
    if (booking.duration_type === 'hour') {
      const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
      return `${diffHours} hours`;
    } else {
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return `${diffDays} days`;
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 hover:shadow-md transition-all duration-200 overflow-hidden">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="font-semibold text-lg text-gray-900 mb-1">
              {booking.property_title}
            </h3>
            <p className="text-sm text-gray-600">
              {booking.room_types.join(', ')} • Booking #{booking.id.slice(0, 8)}
            </p>
          </div>
          <div className="flex flex-col items-end space-y-2">
            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusColors[booking.status]}`}>
              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
            </span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${paymentStatusColors[booking.payment_status]}`}>
              {booking.payment_status === 'success' ? 'Paid' : booking.payment_status.charAt(0).toUpperCase() + booking.payment_status.slice(1)}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Calendar className="h-4 w-4" />
            <div>
              <div>{formatDate(booking.start_date)}</div>
              {booking.duration_type === 'hour' && (
                <div className="text-xs">{formatTime(booking.start_date)} - {formatTime(booking.end_date)}</div>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Clock className="h-4 w-4" />
            <span>{getDuration()}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Users className="h-4 w-4" />
            <span>{booking.guests} guests</span>
          </div>
          {booking.broker_name && (
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <button
                onClick={() => booking.broker_id && onBrokerClick?.(booking.broker_id)}
                className="flex items-center space-x-1 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full hover:bg-green-200 transition-colors cursor-pointer"
              >
                <User className="h-3 w-3" />
                <span>Via {booking.broker_name}</span>
              </button>
            </div>
          )}
        </div>

        {booking.coupon_code && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center justify-between text-sm">
              <span className="text-green-700 font-medium">Coupon Applied: {booking.coupon_code}</span>
              <span className="text-green-600">-₹{booking.discount_amount?.toLocaleString()}</span>
            </div>
          </div>
        )}

        <div className="border-t border-gray-200 pt-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              {userRole === 'owner' && (
                <>
                  <div className="text-sm text-gray-600">
                    Total Amount: ₹{booking.total_amount.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">
                    Platform Fee: -₹{booking.platform_commission.toLocaleString()}
                  </div>
                  {booking.broker_commission && (
                    <div className="text-sm text-gray-600">
                      Broker Commission: -₹{booking.broker_commission.toLocaleString()}
                    </div>
                  )}
                  <div className="text-lg font-semibold text-green-600">
                    You Earn: ₹{booking.net_to_owner.toLocaleString()}
                  </div>
                </>
              )}
              {userRole === 'broker' && booking.broker_commission && (
                <>
                  <div className="text-sm text-gray-600">
                    Booking Amount: ₹{booking.total_amount.toLocaleString()}
                  </div>
                  <div className="text-lg font-semibold text-green-600">
                    Your Commission: ₹{booking.broker_commission.toLocaleString()}
                  </div>
                </>
              )}
              {(userRole === 'customer' || userRole === 'admin') && (
                <div className="text-lg font-semibold text-gray-900">
                  Total: ₹{booking.total_amount.toLocaleString()}
                </div>
              )}
            </div>
            {showActions && (
              <div className="flex space-x-2">
                <button className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors">
                  View Details
                </button>
                {booking.status === 'pending' && (
                  <button className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors">
                    Cancel
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}