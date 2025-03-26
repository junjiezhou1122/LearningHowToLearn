import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import resourceReducer from "./slices/resourceSlice";
import learningRecordReducer from "./slices/learningRecordSlice";
import forumReducer from "./slices/forumSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    resources: resourceReducer,
    forum: forumReducer,
    learningRecord: learningRecordReducer,
  },
});
