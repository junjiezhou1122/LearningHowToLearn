import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: null,
  preferences: {
    topics: [],
    difficulty: "intermediate",
    resourceTypes: [],
  },
  learningHistory: [],
  isAuthenticated: false,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.currentUser = action.payload;
      state.isAuthenticated = true;
    },
    setPreferences: (state, action) => {
      state.preferences = { ...state.preferences, ...action.payload };
    },
    addToHistory: (state, action) => {
      state.learningHistory.push(action.payload);
    },
    logout: (state) => {
      state.currentUser = null;
      state.isAuthenticated = false;
      state.preferences = initialState.preferences;
      state.learningHistory = [];
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  setUser,
  setPreferences,
  addToHistory,
  logout,
  setLoading,
  setError,
} = userSlice.actions;
export default userSlice.reducer;
