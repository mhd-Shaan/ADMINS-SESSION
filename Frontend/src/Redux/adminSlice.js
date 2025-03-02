import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  admin: null, 
  token: null, 
  role: null, // Add role to state

};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    loginAdmin: (state, action) => {
      console.log("LoginAdmin action payload:", action.payload); // Debugging line
      state.admin = action.payload.admin;
      state.token = action.payload.token;
      state.role = action.payload.role;
      console.log("Redux State After Login:", state); // Debugging line
    },
    
    logoutAdmin: (state) => {
      state.admin = null;
      state.token = null;
      state.role = null;

    },
  },
});

export const { loginAdmin, logoutAdmin } = adminSlice.actions;
export default adminSlice.reducer;
