import axios from "axios";

const api = axios.create({
  baseURL: "https://alerta-temprana-g0kp.onrender.com/api",
});

export default api;
