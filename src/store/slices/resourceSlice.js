import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  resources: [],
  recommendedResources: [],
  categories: [],
  currentResource: null,
  loading: false,
  error: null,
};

const resourceSlice = createSlice({
  name: "resources",
  initialState,
  reducers: {
    setResources: (state, action) => {
      state.resources = action.payload;
    },
    setRecommendedResources: (state, action) => {
      state.recommendedResources = action.payload;
    },
    setCategories: (state, action) => {
      state.categories = action.payload;
    },
    setCurrentResource: (state, action) => {
      state.currentResource = action.payload;
    },
    addResource: (state, action) => {
      state.resources.push(action.payload);
    },
    updateResource: (state, action) => {
      const index = state.resources.findIndex(
        (r) => r.id === action.payload.id
      );
      if (index !== -1) {
        state.resources[index] = action.payload;
      }
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
  setResources,
  setRecommendedResources,
  setCategories,
  setCurrentResource,
  addResource,
  updateResource,
  setLoading,
  setError,
} = resourceSlice.actions;

export default resourceSlice.reducer;
