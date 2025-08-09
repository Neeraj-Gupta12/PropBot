
import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice.js';
import propertiesReducer from './slices/propertiesSlice.js';
import chatbotReducer from './slices/chatbotSlice.js';
import compareReducer from './slices/compareSlice.js';
import { userApi } from './api/userAPI.js';


const store = configureStore({
  reducer: {
    user: userReducer,
    properties: propertiesReducer,
    chatbot: chatbotReducer,
    compare: compareReducer,
    [userApi.reducerPath]: userApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(userApi.middleware),
});

export default store;
