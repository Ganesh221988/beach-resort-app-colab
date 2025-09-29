// src/services/api.ts
import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { AppError, handleApiError } from '../utils/errorUtils';

// Add metadata to AxiosRequestConfig
declare module 'axios' {
  export interface AxiosRequestConfig {
    metadata?: {
      startTime: number;
    };
  }
}

// Define the base API types
export interface ApiResponse<T = any> {
  data: T;
  message?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "owner" | "customer" | "broker";
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface ApiClient extends AxiosInstance {
  setToken: (token: string | null) => void;
  login: (data: { email: string; password: string }) => Promise<AuthResponse>;
  register: (data: {
    name: string;
    email: string;
    password: string;
    role: "owner" | "customer" | "broker";
  }) => Promise<AuthResponse>;
}

// Create the API instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
}) as ApiClient;

// Add token handling
api.setToken = (token: string | null) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
};

// Add request interceptor for error handling
api.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error.response?.data || error);
  }
);

// Export everything
export {
  api as default
};

// Auth endpoints
api.login = (data: { email: string; password: string }): Promise<AuthResponse> =>
  api.post("/auth/login", data);

api.register = (data: {
  name: string;
  email: string;
  password: string;
  role: "owner" | "customer" | "broker";
}): Promise<AuthResponse> => api.post("/auth/register", data);

// Type Definitions
export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  amenities: string[];
  images: string[];
  ownerId: string;
  status: 'available' | 'booked' | 'maintenance';
  createdAt: string;
  updatedAt: string;
}

export interface Booking {
  id: string;
  propertyId: string;
  customerId: string;
  checkIn: string;
  checkOut: string;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  id: string;
  bookingId: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
}

export interface Customer {
  id: string;
  userId: string;
  phone: string;
  address: string;
  preferences?: Record<string, any>;
}

export interface Broker {
  id: string;
  userId: string;
  licenseNumber: string;
  agency: string;
  commissionRate: number;
}

// API Endpoints
// Properties
export const properties = {
  fetchAll: () => api.get<ApiResponse<Property[]>>("/properties"),
  fetchById: (id: string) => api.get<ApiResponse<Property>>(`/properties/${id}`),
  create: (data: Partial<Property>) => api.post<ApiResponse<Property>>("/properties", data),
  update: (id: string, data: Partial<Property>) => api.put<ApiResponse<Property>>(`/properties/${id}`, data),
  delete: (id: string) => api.delete<ApiResponse<void>>(`/properties/${id}`)
};

// Bookings
export const bookings = {
  fetchAll: () => api.get<ApiResponse<Booking[]>>("/bookings"),
  fetchById: (id: string) => api.get<ApiResponse<Booking>>(`/bookings/${id}`),
  create: (data: Partial<Booking>) => api.post<ApiResponse<Booking>>("/bookings", data),
  update: (id: string, data: Partial<Booking>) => api.put<ApiResponse<Booking>>(`/bookings/${id}`, data),
  delete: (id: string) => api.delete<ApiResponse<void>>(`/bookings/${id}`)
};

// Payments
export const payments = {
  fetchAll: () => api.get<ApiResponse<Payment[]>>("/payments"),
  fetchById: (id: string) => api.get<ApiResponse<Payment>>(`/payments/${id}`),
  create: (data: Partial<Payment>) => api.post<ApiResponse<Payment>>("/payments", data),
  update: (id: string, data: Partial<Payment>) => api.put<ApiResponse<Payment>>(`/payments/${id}`, data),
  delete: (id: string) => api.delete<ApiResponse<void>>(`/payments/${id}`)
};

// Customers
export const customers = {
  fetchAll: () => api.get<ApiResponse<Customer[]>>("/customers"),
  fetchById: (id: string) => api.get<ApiResponse<Customer>>(`/customers/${id}`),
  create: (data: Partial<Customer>) => api.post<ApiResponse<Customer>>("/customers", data),
  update: (id: string, data: Partial<Customer>) => api.put<ApiResponse<Customer>>(`/customers/${id}`, data),
  delete: (id: string) => api.delete<ApiResponse<void>>(`/customers/${id}`)
};

// Brokers
export const brokers = {
  fetchAll: () => api.get<ApiResponse<Broker[]>>("/brokers"),
  fetchById: (id: string) => api.get<ApiResponse<Broker>>(`/brokers/${id}`),
  create: (data: Partial<Broker>) => api.post<ApiResponse<Broker>>("/brokers", data),
  update: (id: string, data: Partial<Broker>) => api.put<ApiResponse<Broker>>(`/brokers/${id}`, data),
  delete: (id: string) => api.delete<ApiResponse<void>>(`/brokers/${id}`)
};
