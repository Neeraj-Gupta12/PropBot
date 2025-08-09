
import axios from "axios";

const API_BASE_URL = `${import.meta.env.VITE_BASE_URL}/api`;

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Property API functions
export const propertyAPI = {
  // Get all properties
  getAllProperties: async () => {
    const response = await api.get("/properties/all");
    return response.data;
  },

  // Get single property
  getProperty: async (id) => {
    const response = await api.get(`/property/${id}`);
    return response.data;
  },

  // Filter/search properties (merged JSON, backend filter)
  filterProperties: async (params = {}) => {
    const response = await api.get("/properties/filter", { params });
    return response.data;
  },
  // Save a property for the user
  saveProperty: async (propertyId) => {
    const response = await api.post("/property/save", { propertyId });
    return response.data;
  },

  // Unsave a property for the user
  unsaveProperty: async (propertyId) => {
    const response = await api.post("/property/unsave", { propertyId });
    return response.data;
  },

  // Get all saved properties for the user
  getSavedProperties: async () => {
    const response = await api.get("/properties/saved");
    return response.data;
  },

  // Get properties by chatbot suggestion
  getSuggestionProperties: async (suggestion) => {  
    const response = await api.get("/properties/suggestions", { params: { suggestion } });
    return response.data;
  },

  // Chatbot property search (GET with message param or POST with message body)
  chatbotProperties: async (message) => {
    const response = await api.get("/properties/chatbot", { params: { message } });
    return response.data;
  }
};