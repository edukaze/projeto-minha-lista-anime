import axios from "axios";
import { getToken, logout } from "./auth";

const api = axios.create({
  baseURL: "http://localhost:3001/api",
});

//  INTERCEPTA TODA REQUISIÇÃO
api.interceptors.request.use((config) => {
  const token = getToken(); // usa a função centralizada

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

//  INTERCEPTA TODA RESPOSTA
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const urlOriginal = error.config?.url || "";

    if (error.response?.status === 401) {

      if (urlOriginal.includes("/status")) {
        // Se o erro 401 for em uma requisição de status, apenas retornamos um erro customizado
        return Promise.reject(error);
      }
      logout();
     window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
