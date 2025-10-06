import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: 'orange' | 'blue' | 'green' | 'purple' | 'red';
  change?: number;
  subtitle?: string;
}

export function StatsCard({ title, value, icon: Icon, color, change, subtitle }: StatsCardProps) {
  const colorClasses = {
    orange: {
      bg: 'bg-orange-50',
      icon: 'text-orange-600',
      accent: 'border-orange-200'
    },
    blue: {
      bg: 'bg-blue-50',
      icon: 'text-blue-600',
      accent: 'border-blue-200'
    },
    green: {
      bg: 'bg-green-50',
      icon: 'text-green-600',
      accent: 'border-green-200'
    },
    purple: {
      bg: 'bg-purple-50',
      icon: 'text-purple-600',
      accent: 'border-purple-200'
    },
    red: {
      bg: 'bg-red-50',
      icon: 'text-red-600',
      accent: 'border-red-200'
    }
  };

  const colors = colorClasses[color];

  const formatValue = (val: string | number) => {
    if (typeof val === 'number') {
      if (val >= 100000) {
        return `₹${(val / 100000).toFixed(1)}L`;
      } else if (val >= 1000) {
        return `₹${(val / 1000).toFixed(1)}K`;
      } else if (val > 100) {
        return `₹${val.toLocaleString()}`;
      }
      return val.toString();
    }
    return val;
  };

  return (
    <div className={`${colors.bg} ${colors.accent} border rounded-xl p-6 hover:shadow-lg transition-all duration-200`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mb-1">
            {formatValue(value)}
          </p>
          {subtitle && (
            <p className="text-xs text-gray-500">{subtitle}</p>
          )}
          {change !== undefined && (
            <div className="flex items-center mt-2">
              <span className={`text-sm font-medium ${
                change >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {change >= 0 ? '+' : ''}{change}%
              </span>
              <span className="text-xs text-gray-500 ml-1">vs last month</span>
            </div>
          )}
        </div>
        <div className={`${colors.bg} border ${colors.accent} rounded-lg p-3`}>
          <Icon className={`h-6 w-6 ${colors.icon}`} />
        </div>
      </div>
    </div>
  );
}