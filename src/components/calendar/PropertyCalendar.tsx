import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, X } from 'lucide-react';
import { Property, CalendarSlot } from '../../types';

interface PropertyCalendarProps {
  property: Property;
  onDateSelect?: (date: string) => void;
  onSlotBlock?: (date: string, hours?: number[]) => void;
  showControls?: boolean;
}

export function PropertyCalendar({ property, onDateSelect, onSlotBlock, showControls = false }: PropertyCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [blockingMode, setBlockingMode] = useState(false);

  // Mock calendar data - in real app, this would come from API
  const [calendarSlots, setCalendarSlots] = useState<CalendarSlot[]>([
    {
      id: '1',
      property_id: property.id,
      room_type_id: property.room_types[0]?.id || '',
      date: '2024-03-15',
      status: 'booked',
      booking_id: '1'
    },
    {
      id: '2',
      property_id: property.id,
      room_type_id: property.room_types[0]?.id || '',
      date: '2024-03-16',
      status: 'booked',
      booking_id: '1'
    },
    {
      id: '3',
      property_id: property.id,
      room_type_id: property.room_types[0]?.id || '',
      date: '2024-03-20',
      status: 'blocked'
    }
  ]);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const getDateStatus = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    const slot = calendarSlots.find(s => s.date === dateStr);
    
    if (slot) {
      return slot.status;
    }
    
    // Check if date is in the past
    if (date < new Date()) {
      return 'past';
    }
    
    return 'available';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'booked':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'blocked':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'past':
        return 'bg-gray-50 text-gray-400 border-gray-100';
      default:
        return 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200';
    }
  };

  const handleDateClick = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    const status = getDateStatus(date);
    
    if (status === 'past') return;
    
    setSelectedDate(dateStr);
    onDateSelect?.(dateStr);
    
    if (blockingMode && status === 'available') {
      handleBlockDate(dateStr);
    }
  };

  const handleBlockDate = (dateStr: string) => {
    const newSlot: CalendarSlot = {
      id: Date.now().toString(),
      property_id: property.id,
      room_type_id: property.room_types[0]?.id || '',
      date: dateStr,
      status: 'blocked'
    };
    
    setCalendarSlots(prev => [...prev, newSlot]);
    onSlotBlock?.(dateStr);
  };

  const handleUnblockDate = (dateStr: string) => {
    setCalendarSlots(prev => prev.filter(slot => 
      !(slot.date === dateStr && slot.status === 'blocked')
    ));
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const days = getDaysInMonth(currentDate);
  const monthYear = currentDate.toLocaleDateString('en-US', { 
    month: 'long', 
    year: 'numeric' 
  });

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Availability Calendar</h3>
        {showControls && (
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setBlockingMode(!blockingMode)}
              className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                blockingMode
                  ? 'bg-red-100 text-red-700 border border-red-200'
                  : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
              }`}
            >
              {blockingMode ? 'Cancel Blocking' : 'Block Dates'}
            </button>
          </div>
        )}
      </div>

      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => navigateMonth('prev')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <h4 className="text-lg font-medium text-gray-900">{monthYear}</h4>
        <button
          onClick={() => navigateMonth('next')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Days of Week */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((date, index) => {
          if (!date) {
            return <div key={index} className="p-2" />;
          }

          const status = getDateStatus(date);
          const dateStr = date.toISOString().split('T')[0];
          const isSelected = selectedDate === dateStr;

          return (
            <button
              key={index}
              onClick={() => handleDateClick(date)}
              disabled={status === 'past'}
              className={`
                relative p-2 text-sm border rounded-lg transition-colors
                ${getStatusColor(status)}
                ${isSelected ? 'ring-2 ring-orange-500' : ''}
                ${status === 'past' ? 'cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              <span className="block">{date.getDate()}</span>
              
              {/* Status indicators */}
              {status === 'booked' && (
                <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-red-500 rounded-full" />
              )}
              {status === 'blocked' && (
                <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-gray-500 rounded-full" />
              )}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center space-x-6 mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-100 border border-green-200 rounded" />
          <span className="text-sm text-gray-600">Available</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-red-100 border border-red-200 rounded" />
          <span className="text-sm text-gray-600">Booked</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-gray-100 border border-gray-200 rounded" />
          <span className="text-sm text-gray-600">Blocked</span>
        </div>
      </div>

      {/* Selected Date Actions */}
      {selectedDate && showControls && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-900">
              Selected: {new Date(selectedDate).toLocaleDateString()}
            </span>
            <div className="flex items-center space-x-2">
              {getDateStatus(new Date(selectedDate)) === 'blocked' ? (
                <button
                  onClick={() => handleUnblockDate(selectedDate)}
                  className="px-3 py-1 text-sm bg-green-500 hover:bg-green-600 text-white rounded transition-colors"
                >
                  Unblock
                </button>
              ) : getDateStatus(new Date(selectedDate)) === 'available' ? (
                <button
                  onClick={() => handleBlockDate(selectedDate)}
                  className="px-3 py-1 text-sm bg-red-500 hover:bg-red-600 text-white rounded transition-colors"
                >
                  Block
                </button>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}