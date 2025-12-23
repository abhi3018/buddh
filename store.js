import { configureStore, createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: { token: null, user: null },
  reducers: {
    setCredentials: (state, action) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
    },
  },
});

const usersSlice = createSlice({
  name: "allUsers",
  initialState: { users: [] },
  reducers: {
    setAllUsers: (state, action) => {
      state.users = action.payload;
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export const { setAllUsers } = usersSlice.actions;

// --- IMPORTANT: store factory for SSR ---
export function makeStore(preloadedState = {}) {
  return configureStore({
    reducer: {
      auth: authSlice.reducer,
      allUsers: usersSlice.reducer,
    },
    preloadedState,
  });
}
