import React, { useState } from 'react';
import { CreditCard, Shield, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { paymentService } from '../../services/paymentService';
import { Booking } from '../../types';

interface PaymentProcessorProps {
  booking: Partial<Booking>;
  onPaymentSuccess: (paymentData: any) => void;
  onPaymentError: (error: string) => void;
}

export function PaymentProcessor({ booking, onPaymentSuccess, onPaymentError }: PaymentProcessorProps) {
  const { user } = useAuth();
  const [processing, setProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');

  const handlePayment = async () => {
    if (!user || !booking.owner_id) {
      onPaymentError('Invalid booking data');
      return;
    }

    setProcessing(true);
    
    try {
      // Determine which payment gateway to use
      // If it's a broker booking, use broker's gateway
      // If it's a direct booking, use owner's gateway
      // Fallback to admin gateway if neither is available
      const paymentUserId = user.role === 'broker' ? user.id : booking.owner_id;
      
      // Check if payment gateway is available
      const paymentStatus = await paymentService.getUserPaymentStatus(paymentUserId);
      
      if (!paymentStatus.canAcceptPayments) {
        onPaymentError('Payment gateway not configured. Please contact support.');
        return;
      }

      // Create Razorpay order
      const order = await paymentService.createOrder(
        paymentUserId,
        booking.total_amount || 0,
        'INR',
        `booking_${booking.property_id}_${Date.now()}`
      );

      // In a real implementation, this would open Razorpay checkout
      // For demo purposes, we'll simulate successful payment
      setTimeout(async () => {
        try {
          const paymentResult = await paymentService.processPayment(
            paymentUserId,
            order.id,
            `pay_${Date.now()}`,
            'mock_signature'
          );

          if (paymentResult.success) {
            // Record the transaction
            await paymentService.recordTransaction({
              booking_id: booking.id,
              user_id: user.id,
              amount: booking.total_amount || 0,
              type: 'payment',
              status: 'success',
              gateway_txn_id: paymentResult.payment_id,
              description: `Payment for booking at ${booking.property_title}`,
              metadata: {
                order_id: order.id,
                payment_method: paymentMethod,
                gateway_used: paymentStatus.hasOwnGateway ? 'user_gateway' : 'admin_gateway'
              }
            });

            onPaymentSuccess({
              payment_id: paymentResult.payment_id,
              order_id: order.id,
              amount: booking.total_amount,
              status: 'success'
            });
          } else {
            onPaymentError(paymentResult.error || 'Payment failed');
          }
        } catch (error) {
          console.error('Payment processing error:', error);
          onPaymentError('Payment processing failed');
        } finally {
          setProcessing(false);
        }
      }, 2000); // Simulate payment processing time

    } catch (error) {
      console.error('Payment initialization error:', error);
      onPaymentError('Failed to initialize payment');
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <CreditCard className="h-6 w-6 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900">Secure Payment</h3>
        <Shield className="h-5 w-5 text-green-500" />
      </div>

      {/* Payment Summary */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-3">Payment Summary</h4>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Property:</span>
            <span className="font-medium">{booking.property_title}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Duration:</span>
            <span className="font-medium">
              {booking.duration_type === 'day' ? 'Daily' : 'Hourly'} booking
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Guests:</span>
            <span className="font-medium">{booking.guests}</span>
          </div>
          {booking.discount_amount && booking.discount_amount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Discount ({booking.coupon_code}):</span>
              <span>-₹{booking.discount_amount.toLocaleString()}</span>
            </div>
          )}
          <div className="border-t border-gray-200 pt-2">
            <div className="flex justify-between text-lg font-bold">
              <span>Total Amount:</span>
              <span className="text-orange-600">₹{booking.total_amount?.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900">Select Payment Method</h4>
        
        <div className="space-y-3">
          {[
            { id: 'card', label: 'Credit/Debit Card', icon: CreditCard },
            { id: 'upi', label: 'UPI', icon: CreditCard },
            { id: 'netbanking', label: 'Net Banking', icon: CreditCard },
            { id: 'wallet', label: 'Digital Wallet', icon: CreditCard }
          ].map((method) => {
            const Icon = method.icon;
            return (
              <label
                key={method.id}
                className="flex items-center space-x-3 p-4 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer"
              >
                <input
                  type="radio"
                  name="payment_method"
                  value={method.id}
                  checked={paymentMethod === method.id}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="text-orange-500 focus:ring-orange-500"
                />
                <Icon className="h-5 w-5 text-gray-400" />
                <span className="font-medium text-gray-900">{method.label}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Security Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-900 mb-1">Secure Payment Processing</h4>
            <p className="text-sm text-blue-700">
              Your payment is processed securely through Razorpay with bank-level encryption. 
              We never store your card details.
            </p>
          </div>
        </div>
      </div>

      {/* Payment Button */}
      <button
        onClick={handlePayment}
        disabled={processing}
        className="w-full flex items-center justify-center space-x-2 px-6 py-4 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
      >
        {processing ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span>Processing Payment...</span>
          </>
        ) : (
          <>
            <CreditCard className="h-5 w-5" />
            <span>Pay ₹{booking.total_amount?.toLocaleString()}</span>
          </>
        )}
      </button>

      {/* Demo Notice */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-yellow-900 mb-1">Demo Mode</h4>
            <p className="text-sm text-yellow-700">
              This is a demonstration. No actual payment will be charged. 
              In production, this would integrate with real Razorpay payment processing.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}