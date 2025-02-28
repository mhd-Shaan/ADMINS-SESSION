import { configureStore } from "@reduxjs/toolkit";
import adminReducer from './adminSlice'
const store = configureStore({
  reducer: {
    admin: adminReducer, // Add the admin reducer
  },
});

export default store;
