import { createSlice } from "@reduxjs/toolkit";
import {
  saveToLocalStorage,
  loadFromLocalStorage,
} from "../../utils/localStorage";

// Get posts from localStorage or use default posts if none exist
const savedPosts = loadFromLocalStorage("forum_posts", [
  {
    id: 1,
    title: "学习资源分享",
    content: "推荐一些好用的学习资源和网站...",
    author: "User1",
    time: "2024-01-20",
    comments: 5,
  },
  {
    id: 2,
    title: "学习方法讨论",
    content: "分享一下大家的学习方法和经验...",
    author: "User2",
    time: "2024-01-19",
    comments: 3,
  },
]);

const initialState = {
  posts: savedPosts,
};

const forumSlice = createSlice({
  name: "forum",
  initialState,
  reducers: {
    addPost: (state, action) => {
      state.posts.unshift(action.payload);
      // Save updated posts to localStorage
      saveToLocalStorage("forum_posts", state.posts);
    },
    updatePost: (state, action) => {
      const index = state.posts.findIndex(
        (post) => post.id === action.payload.id
      );
      if (index !== -1) {
        state.posts[index] = action.payload;
        // Save updated posts to localStorage
        saveToLocalStorage("forum_posts", state.posts);
      }
    },
    deletePost: (state, action) => {
      state.posts = state.posts.filter((post) => post.id !== action.payload);
      // Save updated posts to localStorage
      saveToLocalStorage("forum_posts", state.posts);
    },
  },
});

export const { addPost, updatePost, deletePost } = forumSlice.actions;
export default forumSlice.reducer;
