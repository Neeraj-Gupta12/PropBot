import axios from "axios";

const API_BASE_URL = `${import.meta.env.VITE_BASE_URL}/api`;

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Chatbot API functions
export const chatbotAPI = {
  // Chat with bot
  chatWithBot: async (message) => {
    const response = await api.post("/chatbot/chat", { message });
    return response.data;
  },

  // Get chatbot suggestions
  getChatbotSuggestions: async () => {
    const response = await api.get("/chatbot/chat/suggestions");
    return response.data;
  },
}; 