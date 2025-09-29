// src/contexts/PropertyContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { Property } from "../types/property";

interface PropertyContextType {
  properties: Property[];
  addProperty: (property: Property) => void;
}

const PropertyContext = createContext<PropertyContextType | undefined>(undefined);

export const PropertyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [properties, setProperties] = useState<Property[]>([]);

  useEffect(() => {
    // Simulated API fetch (replace with real API)
    const storedProperties: Property[] = [
      { id: "p1", name: "Sea View Resort", location: "Goa", price: 5000, ownerId: "201" },
      { id: "p2", name: "Mountain Retreat", location: "Manali", price: 4000, ownerId: "202" },
    ];
    setProperties(storedProperties);
  }, []);

  const addProperty = (property: Property) => {
    setProperties((prev) => [...prev, property]);
  };

  return (
    <PropertyContext.Provider value={{ properties, addProperty }}>
      {children}
    </PropertyContext.Provider>
  );
};

export const useProperty = () => {
  const context = useContext(PropertyContext);
  if (!context) {
    throw new Error("useProperty must be used within a PropertyProvider");
  }
  return context;
};
