import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import resourceReducer from "./slices/resourceSlice";
import forumReducer from "./slices/forumSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    resources: resourceReducer,
    forum: forumReducer,
  },
});
