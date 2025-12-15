import axios from "axios";

const api = axios.create({
  baseURL: "https://alerta-temprana-g0kp.onrender.com/api",
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
