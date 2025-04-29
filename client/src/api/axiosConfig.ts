import axios, { AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { TOKEN_KEY } from "../contexts/AuthContext";
import { ApiError } from "../types/error";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig<any>) => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response: AxiosResponse<any, any>) => response,
  (error: any) => {
    if (error.response?.data) {
      const apiError = error.response.data as ApiError;
      throw apiError;
    }

    throw {
      status: error.response?.status || 500,
      detail: error.message || "Unknown error occurred",
      title: "Request Failed",
    } as ApiError;
  }
);

export default apiClient