import axios, { AxiosInstance } from "axios";

export interface CustomAxiosInstance extends AxiosInstance {
  setToken(token: string | null): void;
  login(credentials: { email: string; password: string }): Promise<any>;
}

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
}) as CustomAxiosInstance;

// Add custom methods
axiosClient.setToken = (token: string | null) => {
  if (token) {
    axiosClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    localStorage.setItem('token', token);
  } else {
    delete axiosClient.defaults.headers.common['Authorization'];
    localStorage.removeItem('token');
  }
};

axiosClient.login = async (credentials: { email: string; password: string }) => {
  const response = await axiosClient.post('/auth/login', credentials);
  return response.data;
};

// Request interceptor - Add auth token
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - Handle errors
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server returned an error response
      if (error.response.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
      return Promise.reject(error.response.data);
    }
    if (error.request) {
      // Request was made but no response
      return Promise.reject({ message: "No response from server" });
    }
    // Something else happened
    return Promise.reject({ message: "Request failed" });
  }
);

export default axiosClient;
