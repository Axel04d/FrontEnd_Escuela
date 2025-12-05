import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api", // Ajusta el puerto si tu backend usa otro
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
