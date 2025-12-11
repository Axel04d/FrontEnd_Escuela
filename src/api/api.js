import axios from "axios";

const api = axios.create({
  baseURL: "http://192.168.67.43:3000/api", // Ajusta el puerto si tu backend usa otro
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
