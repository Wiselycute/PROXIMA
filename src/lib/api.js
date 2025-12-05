import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
  timeout: 10000,
});

// simple response interceptor
api.interceptors.response.use(
  (res) => res,
  (err) => {
    // normalize error shape
    const error = err.response?.data || { message: err.message || "Unknown error" };
    return Promise.reject(error);
  }
);

export default api;
