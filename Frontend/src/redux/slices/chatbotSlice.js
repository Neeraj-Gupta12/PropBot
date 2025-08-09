import { createSlice } from "@reduxjs/toolkit";
import { chatbotAPI } from "../api/chatbotAPI.js";

const initialState = {
  messages: [],
  suggestions: [],
  loading: false,
  error: null,
};

const chatbotSlice = createSlice({
  name: "chatbot",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearMessages: (state) => {
      state.messages = [];
    },
    addUserMessage: (state, action) => {
      state.messages.push({
        type: "user",
        content: action.payload,
        timestamp: new Date().toISOString(),
      });
    },
    addBotMessage: (state, action) => {
      state.messages.push({
        type: "bot",
        content: action.payload,
        timestamp: new Date().toISOString(),
      });
    },
  },
  extraReducers: (builder) => {
    // Chat with bot
    builder
      .addCase("chatbot/chatWithBot/pending", (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase("chatbot/chatWithBot/fulfilled", (state, action) => {
        state.loading = false;
        // Add bot response to messages
        state.messages.push({
          type: "bot",
          content: action.payload.response,
          timestamp: new Date().toISOString(),
        });
      })
      .addCase("chatbot/chatWithBot/rejected", (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        // Add error message
        state.messages.push({
          type: "bot",
          content: "Sorry, I'm having trouble responding right now. Please try again.",
          timestamp: new Date().toISOString(),
        });
      });

    // Get chatbot suggestions
    builder
      .addCase("chatbot/getChatbotSuggestions/pending", (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase("chatbot/getChatbotSuggestions/fulfilled", (state, action) => {
        state.loading = false;
        state.suggestions = action.payload.suggestions;
      })
      .addCase("chatbot/getChatbotSuggestions/rejected", (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { clearError, clearMessages, addUserMessage, addBotMessage } = chatbotSlice.actions;

// Thunk actions
export const chatWithBot = (message) => async (dispatch) => {
  try {
    dispatch({ type: "chatbot/chatWithBot/pending" });
    const data = await chatbotAPI.chatWithBot(message);
    dispatch({ type: "chatbot/chatWithBot/fulfilled", payload: data });
  } catch (error) {
    dispatch({ type: "chatbot/chatWithBot/rejected", error: error.message });
  }
};

export const getChatbotSuggestions = () => async (dispatch) => {
  try {
    dispatch({ type: "chatbot/getChatbotSuggestions/pending" });
    const data = await chatbotAPI.getChatbotSuggestions();
    dispatch({ type: "chatbot/getChatbotSuggestions/fulfilled", payload: data });
  } catch (error) {
    dispatch({ type: "chatbot/getChatbotSuggestions/rejected", error: error.message });
  }
};

export default chatbotSlice.reducer; 