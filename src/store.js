import { configureStore } from '@reduxjs/toolkit';
import authReducer from './feature/authSlice';
import chatReducer from './feature/chatSlice'
const store = configureStore({
  reducer: {
    auth: authReducer,
    chat: chatReducer
  },
});

export default store;