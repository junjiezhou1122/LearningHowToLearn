import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  records: [],
  todos: [],
  loading: false,
  error: null,
};

const learningRecordSlice = createSlice({
  name: "learningRecord",
  initialState,
  reducers: {
    addTodo: (state, action) => {
      const newTodo = {
        id: Date.now(),
        title: action.payload.title,
        description: action.payload.description,
        priority: action.payload.priority || "medium",
        dueDate: action.payload.dueDate,
        completed: false,
        createdAt: new Date().toISOString(),
        relatedRecordId: action.payload.relatedRecordId,
      };
      state.todos.push(newTodo);
    },
    updateTodo: (state, action) => {
      const { id, updates } = action.payload;
      const todo = state.todos.find((t) => t.id === id);
      if (todo) {
        Object.assign(todo, updates);
      }
    },
    deleteTodo: (state, action) => {
      state.todos = state.todos.filter((todo) => todo.id !== action.payload);
    },
    toggleTodoStatus: (state, action) => {
      const todo = state.todos.find((t) => t.id === action.payload);
      if (todo) {
        todo.completed = !todo.completed;
      }
    },
    addLearningRecord: (state, action) => {
      const newRecord = {
        ...action.payload,
        startTime: new Date().toISOString(),
        completionStatus: "in_progress",
        duration: 0,
        lastAccessTime: new Date().toISOString(),
      };
      state.records.push(newRecord);
    },
    updateLearningRecord: (state, action) => {
      const { resourceId, updates } = action.payload;
      const record = state.records.find((r) => r.id === resourceId);
      if (record) {
        Object.assign(record, updates);
        record.lastAccessTime = new Date().toISOString();
        if (updates.completionStatus === "completed") {
          record.completedAt = new Date().toISOString();
          record.duration = new Date(record.completedAt) - new Date(record.startTime);
        }
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
  addLearningRecord,
  updateLearningRecord,
  setLoading,
  setError,
  addTodo,
  updateTodo,
  deleteTodo,
  toggleTodoStatus,
} = learningRecordSlice.actions;

export default learningRecordSlice.reducer;