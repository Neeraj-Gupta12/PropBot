import { createSlice } from "@reduxjs/toolkit";
import { propertyAPI } from "../api/propertiesAPI.js";

const initialState = {
  properties: [],
  currentProperty: null,
  savedProperties: [],
  loading: false,
  error: null,
  saveLoading: false,
  saveSuccess: null,
  saveError: null,
  chatbotProperties: [],
  chatbotMessage: null,
};

const propertySlice = createSlice({
  name: "property",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentProperty: (state) => {
      state.currentProperty = null;
    },
    clearSaveStatus: (state) => {
      state.saveSuccess = null;
      state.saveError = null;
    }
  },
  extraReducers: (builder) => {
  // Get all properties (async)
    builder
      .addCase("property/getAllProperties/pending", (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase("property/getAllProperties/fulfilled", (state, action) => {
        state.loading = false;
        state.properties = action.payload;
      })
      .addCase("property/getAllProperties/rejected", (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });

  // Get single property (async)
    builder
      .addCase("property/getProperty/pending", (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase("property/getProperty/fulfilled", (state, action) => {
        state.loading = false;
        state.currentProperty = action.payload.property;
      })
      .addCase("property/getProperty/rejected", (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });

  // Filter/search properties (async)
    builder
      .addCase("property/filterProperties/pending", (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase("property/filterProperties/fulfilled", (state, action) => {
        state.loading = false;
        state.properties = action.payload.properties;
      })
      .addCase("property/filterProperties/rejected", (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });

  // Save property (async)
    builder
      .addCase("property/saveProperty/pending", (state) => {
        state.saveLoading = true;
        state.saveSuccess = null;
        state.saveError = null;
      })
      .addCase("property/saveProperty/fulfilled", (state, action) => {
        state.saveLoading = false;
        state.saveSuccess = action.payload.message;
      })
      .addCase("property/saveProperty/rejected", (state, action) => {
        state.saveLoading = false;
        state.saveError = action.error.message;
      });

  // Unsave property (async)
    builder
      .addCase("property/unsaveProperty/pending", (state) => {
        state.saveLoading = true;
        state.saveSuccess = null;
        state.saveError = null;
      })
      .addCase("property/unsaveProperty/fulfilled", (state, action) => {
        state.saveLoading = false;
        state.saveSuccess = action.payload.message;
      })
      .addCase("property/unsaveProperty/rejected", (state, action) => {
        state.saveLoading = false;
        state.saveError = action.error.message;
      });

  // Get saved properties (async)
    builder
      .addCase("property/getSavedProperties/pending", (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase("property/getSavedProperties/fulfilled", (state, action) => {
        state.loading = false;
        state.savedProperties = action.payload.savedProperties || [];
      })
      .addCase("property/getSavedProperties/rejected", (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });

  // Suggestion properties (chatbot async)
    builder
      .addCase("property/getSuggestionProperties/pending", (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase("property/getSuggestionProperties/fulfilled", (state, action) => {
        state.loading = false;
        state.properties = action.payload.properties;
      })
      .addCase("property/getSuggestionProperties/rejected", (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });

  // Chatbot property search (async)
    builder
      .addCase("property/chatbotProperties/pending", (state) => {
        state.loading = true;
        state.error = null;
        state.chatbotProperties = [];
        state.chatbotMessage = null;
      })
      .addCase("property/chatbotProperties/fulfilled", (state, action) => {
        state.loading = false;
        state.chatbotProperties = action.payload.properties || [];
        state.chatbotMessage = action.payload.message || null;
      })
      .addCase("property/chatbotProperties/rejected", (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.chatbotProperties = [];
        state.chatbotMessage = null;
      });
  }
});

// Thunk actions
export const getAllProperties = (params = {}) => async (dispatch) => {
  try {
    dispatch({ type: "property/getAllProperties/pending" });
    const data = await propertyAPI.getAllProperties(params);
    dispatch({ type: "property/getAllProperties/fulfilled", payload: data.properties || [] });
  } catch (error) {
    dispatch({ type: "property/getAllProperties/rejected", error: error.message });
  }
};

export const getProperty = (id) => async (dispatch) => {
  try {
    dispatch({ type: "property/getProperty/pending" });
    const data = await propertyAPI.getProperty(id);
    dispatch({ type: "property/getProperty/fulfilled", payload: data });
  } catch (error) {
    dispatch({ type: "property/getProperty/rejected", error: error.message });
  }
};

export const filterProperties = (params) => async (dispatch) => {
  try {
    dispatch({ type: "property/filterProperties/pending" });
    const data = await propertyAPI.filterProperties(params);
    dispatch({ type: "property/filterProperties/fulfilled", payload: data });
  } catch (error) {
    dispatch({ type: "property/filterProperties/rejected", error: error.message });
  }
};

// Save property thunk
export const saveProperty = (propertyId) => async (dispatch) => {
  try {
    dispatch({ type: "property/saveProperty/pending" });
    const data = await propertyAPI.saveProperty(propertyId);
    dispatch({ type: "property/saveProperty/fulfilled", payload: data });
    // Optionally, refresh saved properties
    dispatch(getSavedProperties());
  } catch (error) {
    dispatch({ type: "property/saveProperty/rejected", error: error.message });
  }
};

// Unsave property thunk
export const unsaveProperty = (propertyId) => async (dispatch) => {
  try {
    dispatch({ type: "property/unsaveProperty/pending" });
    const data = await propertyAPI.unsaveProperty(propertyId);
    dispatch({ type: "property/unsaveProperty/fulfilled", payload: data });
    // Optionally, refresh saved properties
    dispatch(getSavedProperties());
  } catch (error) {
    dispatch({ type: "property/unsaveProperty/rejected", error: error.message });
  }
};

// Get saved properties thunk
export const getSavedProperties = () => async (dispatch) => {
  try {
    dispatch({ type: "property/getSavedProperties/pending" });
    const data = await propertyAPI.getSavedProperties();
    dispatch({ type: "property/getSavedProperties/fulfilled", payload: data });
  } catch (error) {
    dispatch({ type: "property/getSavedProperties/rejected", error: error.message });
  }
};

// Thunk for chatbot suggestion
export const getSuggestionProperties = (suggestion) => async (dispatch) => {
  try {
    dispatch({ type: "property/getSuggestionProperties/pending" });
    const data = await propertyAPI.getSuggestionProperties(suggestion);
    dispatch({ type: "property/getSuggestionProperties/fulfilled", payload: data });
  } catch (error) {
    dispatch({ type: "property/getSuggestionProperties/rejected", error: error.message });
  }
};

// Thunk for chatbot property search
export const chatbotProperties = (message) => async (dispatch) => {
  try {
    dispatch({ type: "property/chatbotProperties/pending" });
    const data = await propertyAPI.chatbotProperties(message);
    dispatch({ type: "property/chatbotProperties/fulfilled", payload: data });
  } catch (error) {
    dispatch({ type: "property/chatbotProperties/rejected", error: error.message });
  }
};

export const { clearError, clearCurrentProperty, clearSaveStatus } = propertySlice.actions;
export default propertySlice.reducer;