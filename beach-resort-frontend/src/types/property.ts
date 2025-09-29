// src/types/property.ts
export interface Property {
  id: string;        // keep IDs as string
  name: string;
  location: string;
  price: number;
  ownerId: string;   // ✅ ownerId also string
}
