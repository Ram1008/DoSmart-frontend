// lib/store.ts
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/authSlice';
import tasksReducer from './features/tasks/tasksSlice';

export const makeStore = () =>
  configureStore({
    reducer: {
      auth: authReducer,
      tasks: tasksReducer,
    },
  });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
