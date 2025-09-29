import React from "react";
import { MapPin, IndianRupee } from "lucide-react";
import { Property } from "../../types/property";

interface PropertyCardProps {
  property: Property;
  onSelect?: (property: Property) => void;
  showBookButton?: boolean;
}

export function PropertyCard({
  property,
  onSelect,
  showBookButton = true,
}: PropertyCardProps) {
  return (
    <div
      className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer"
      onClick={() => onSelect?.(property)}
    >
      {/* Image placeholder (since Property type has no images now) */}
      <div className="relative">
        <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-500">
          No Image
        </div>
        <div className="absolute bottom-3 left-3">
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Available
          </span>
        </div>
      </div>

      <div className="p-6">
        {/* Property Name + Location */}
        <div className="mb-3">
          <h3 className="font-semibold text-lg text-gray-900 mb-1">
            {property.name}
          </h3>
          <div className="flex items-center space-x-1 text-gray-600">
            <MapPin className="h-4 w-4" />
            <span className="text-sm">{property.location}</span>
          </div>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            <IndianRupee className="h-5 w-5 text-gray-600" />
            <span className="text-xl font-bold text-gray-900">
              {property.price.toLocaleString()}
            </span>
            <span className="text-gray-600 text-sm">/ night</span>
          </div>

          {showBookButton && (
            <button
              className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                onSelect?.(property);
              }}
            >
              Book Now
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
