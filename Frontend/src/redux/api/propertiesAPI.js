
import axios from "axios";

const API_BASE_URL = `${import.meta.env.VITE_BASE_URL}/api`;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const propertyAPI = {
  getAllProperties: async () => {
    const response = await api.get("/properties/all");
    return response.data;
  },
  getProperty: async (id) => {
    const response = await api.get(`/property/${id}`);
    return response.data;
  },
  filterProperties: async (params = {}) => {
    const response = await api.get("/properties/filter", { params });
    return response.data;
  },
  saveProperty: async (propertyId) => {
    const response = await api.post("/property/save", { propertyId });
    return response.data;
  },
  unsaveProperty: async (propertyId) => {
    const response = await api.post("/property/unsave", { propertyId });
    return response.data;
  },
  getSavedProperties: async () => {
    const response = await api.get("/properties/saved");
    return response.data;
  },
  getSuggestionProperties: async (suggestion) => {
    const response = await api.get("/properties/suggestions", { params: { suggestion } });
    return response.data;
  },
  chatbotProperties: async (message) => {
    const response = await api.get("/properties/chatbot", { params: { message } });
    return response.data;
  }
};