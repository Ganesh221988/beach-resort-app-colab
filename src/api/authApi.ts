// src/api/authApi.ts
import api from '../services/api';
import type { AuthResponse } from '../services/api';

export const authApi = {
  login: (data: { email: string; password: string }): Promise<AuthResponse> =>
    api.post("/auth/login", data),
    
  register: (data: {
    name: string;
    email: string;
    password: string;
    role: "owner" | "customer" | "broker";
  }): Promise<AuthResponse> => api.post("/auth/register", data),
};

export default authApi;
