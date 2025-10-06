import React from 'react';
import { Crown, Calendar, AlertCircle, CheckCircle } from 'lucide-react';

interface SubscriptionBadgeProps {
  planName: string;
  expiryDate: string;
  userRole: 'owner' | 'broker';
  status?: 'active' | 'activation_pending' | 'approved_account' | 'expired';
  accountActivated?: boolean;
}

export function SubscriptionBadge({ planName, expiryDate, userRole, status = 'activation_pending', accountActivated = false }: SubscriptionBadgeProps) {
  const isExpiringSoon = new Date(expiryDate) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
  const isExpired = new Date(expiryDate) <= new Date();
  
  const getBadgeColor = () => {
    if (status === 'approved_account' || accountActivated) return 'bg-green-100 text-green-800 border-green-200';
    if (status === 'activation_pending') return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    if (isExpired) return 'bg-red-100 text-red-800 border-red-200';
    if (isExpiringSoon) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    if (planName === 'Free' || planName === 'Trial') return 'bg-gray-100 text-gray-800 border-gray-200';
    return 'bg-green-100 text-green-800 border-green-200';
  };

  const getIcon = () => {
    if (status === 'approved_account' || accountActivated) return CheckCircle;
    if (status === 'activation_pending') return AlertCircle;
    if (isExpired || isExpiringSoon) return AlertCircle;
    if (planName === 'Free' || planName === 'Trial') return Calendar;
    return Crown;
  };

  const getDisplayText = () => {
    if (status === 'approved_account' || accountActivated) {
      return {
        main: planName,
        sub: 'Approved Account'
      };
    }
    
    if (status === 'activation_pending') {
      return {
        main: planName,
        sub: 'Activation Pending'
      };
    }
    
    if (isExpired) {
      return {
        main: planName,
        sub: 'Expired'
      };
    }
    
    if (planName === 'Trial') {
      return {
        main: planName,
        sub: 'Trial Period'
      };
    }
    
    return {
      main: planName,
      sub: `Expires ${new Date(expiryDate).toLocaleDateString()}`
    };
  };
  const Icon = getIcon();
  const displayText = getDisplayText();

  return (
    <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg border text-sm font-medium ${getBadgeColor()}`}>
      <Icon className="h-4 w-4" />
      <div>
        <span className="font-semibold">{displayText.main}</span>
        <div className="text-xs opacity-75">
          {displayText.sub}
        </div>
      </div>
    </div>
  );
}