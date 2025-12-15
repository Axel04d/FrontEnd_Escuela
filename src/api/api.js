// src/api/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://192.168.59.43:3000/api",
});

// 🔐 INTERCEPTOR: agrega token a TODAS las peticiones
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["x-access-token"] = token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
