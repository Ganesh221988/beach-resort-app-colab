// src/services/api.ts
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

// ========== AUTH ==========
export const login = (data: { email: string; password: string }) =>
  API.post("/auth/login", data);

export const register = (data: {
  name: string;
  email: string;
  password: string;
  role: string;
}) => API.post("/auth/register", data);

// ========== OWNERS ==========
export const fetchOwners = () => API.get("/owners");
export const fetchOwnerById = (id: number) => API.get(`/owners/${id}`);
export const createOwner = (data: any) => API.post("/owners", data);
export const updateOwner = (id: number, data: any) =>
  API.put(`/owners/${id}`, data);
export const deleteOwner = (id: number) => API.delete(`/owners/${id}`);

// ========== BROKERS ==========
export const fetchBrokers = () => API.get("/brokers");
export const fetchBrokerById = (id: number) => API.get(`/brokers/${id}`);
export const createBroker = (data: any) => API.post("/brokers", data);
export const updateBroker = (id: number, data: any) =>
  API.put(`/brokers/${id}`, data);
export const deleteBroker = (id: number) => API.delete(`/brokers/${id}`);

// ========== CUSTOMERS ==========
export const fetchCustomers = () => API.get("/customers");
export const fetchCustomerById = (id: number) => API.get(`/customers/${id}`);
export const createCustomer = (data: any) => API.post("/customers", data);
export const updateCustomer = (id: number, data: any) =>
  API.put(`/customers/${id}`, data);
export const deleteCustomer = (id: number) => API.delete(`/customers/${id}`);

// ========== PROPERTIES ==========
export const fetchProperties = () => API.get("/properties");
export const fetchPropertyById = (id: number) => API.get(`/properties/${id}`);
export const createProperty = (data: any) => API.post("/properties", data);
export const updateProperty = (id: number, data: any) =>
  API.put(`/properties/${id}`, data);
export const deleteProperty = (id: number) => API.delete(`/properties/${id}`);

// ========== BOOKINGS ==========
export const fetchBookings = () => API.get("/bookings");
export const fetchBookingById = (id: number) => API.get(`/bookings/${id}`);
export const createBooking = (data: any) => API.post("/bookings", data);
export const updateBooking = (id: number, data: any) =>
  API.put(`/bookings/${id}`, data);
export const deleteBooking = (id: number) => API.delete(`/bookings/${id}`);

// ========== PAYMENTS ==========
export const fetchPayments = () => API.get("/payments");
export const fetchPaymentById = (id: number) => API.get(`/payments/${id}`);
export const createPayment = (data: any) => API.post("/payments", data);
export const updatePayment = (id: number, data: any) =>
  API.put(`/payments/${id}`, data);
export const deletePayment = (id: number) => API.delete(`/payments/${id}`);

export default API;
