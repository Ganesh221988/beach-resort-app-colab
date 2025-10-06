import React, { useState, useEffect } from 'react';
import { Instagram, Facebook, Calendar, Image, Settings, Play, Pause, Eye, CreditCard as Edit2, Save, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { userIntegrationService } from '../../services/integrationService';
import { Property } from '../../types';

interface SocialMediaMarketingProps {
  properties: Property[];
  onClose: () => void;
}

export function SocialMediaMarketing({ properties, onClose }: SocialMediaMarketingProps) {

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Social Media Marketing</h3>
      <p className="text-gray-600 mb-4">Marketing features will be available soon.</p>
      <button
        onClick={onClose}
        className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
      >
        Close
      </button>
    </div>
  );
}