// lib/features/tasks/tasksSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { Task, TaskInput } from '@/types/types';
import {
  fetchTasks as apiFetchTasks,
  createTask as apiCreateTask,
  updateTask as apiUpdateTask,
  updateTaskStatus as apiUpdateTaskStatus,
  deleteTask as apiDeleteTask,
} from '@/lib/api/taskAPI';
import type { RootState } from '@/lib/store';

// TasksState इंटरफ़ेस
interface TasksState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
}

const initialState: TasksState = {
  tasks: [],
  loading: false,
  error: null,
};

// 1) Thunk: loadTasks → GET /api/tasks
export const loadTasks = createAsyncThunk<Task[], string, { rejectValue: string }>(
  'tasks/loadTasks',
  async (token, thunkAPI) => {
    try {
      const tasks = await apiFetchTasks(token);
      return tasks;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

// 2) Thunk: addNewTask → POST /api/tasks (Simple or Custom)
export const addNewTask = createAsyncThunk<
  Task,
  { token: string; payload: { type: 'simple'; textInput: string } | ({ type: 'custom' } & TaskInput) },
  { rejectValue: string }
>(
  'tasks/addNewTask',
  async ({ token, payload }, thunkAPI) => {
    try {
      const newTask = await apiCreateTask(token, payload);
      return newTask;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

// 3) Thunk: editTask → PUT /api/tasks/:id
export const editTask = createAsyncThunk<
  Task,
  { token: string; taskId: string; updatedFields: Partial<Omit<Task, 'id' | 'user_id' | 'created_at' | 'updated_at'>> },
  { rejectValue: string }
>('tasks/editTask', async ({ token, taskId, updatedFields }, thunkAPI) => {
  try {
    const updatedTask = await apiUpdateTask(token, taskId, updatedFields);
    return updatedTask;
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err.message);
  }
});

// 4) Thunk: editTaskStatus → PATCH /api/tasks/:id/status
export const editTaskStatus = createAsyncThunk<
  Task,
  { token: string; taskId: string; newStatus: string },
  { rejectValue: string }
>('tasks/editTaskStatus', async ({ token, taskId, newStatus }, thunkAPI) => {
  try {
    const updatedTask = await apiUpdateTaskStatus(token, taskId, newStatus);
    return updatedTask;
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err.message);
  }
});

// 5) Thunk: removeTask → DELETE /api/tasks/:id
export const removeTask = createAsyncThunk<string, { token: string; taskId: string }, { rejectValue: string }>(
  'tasks/removeTask',
  async ({ token, taskId }, thunkAPI) => {
    try {
      await apiDeleteTask(token, taskId);
      return taskId; // सफलता पर taskId वापस
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    // setTasks तभी इस्तेमाल होगा जब आप किसी अन्य थंक/एक्शन से मनमाफ़िक लोड करना चाहें
    setTasks: (state, action: PayloadAction<Task[]>) => {
      state.tasks = action.payload;
    },
  },
  extraReducers: (builder) => {
    // —— loadTasks —— 
    builder.addCase(loadTasks.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(loadTasks.fulfilled, (state, action) => {
      state.loading = false;
      state.tasks = action.payload;
    });
    builder.addCase(loadTasks.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload ?? 'Failed to load tasks';
    });

    // —— addNewTask —— 
    builder.addCase(addNewTask.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(addNewTask.fulfilled, (state, action) => {
      state.loading = false;
      state.tasks.push(action.payload);
    });
    builder.addCase(addNewTask.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload ?? 'Failed to add task';
    });

    // —— editTask —— 
    builder.addCase(editTask.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(editTask.fulfilled, (state, action) => {
      state.loading = false;
      const idx = state.tasks.findIndex((t) => t.id === action.payload.id);
      if (idx !== -1) state.tasks[idx] = action.payload;
    });
    builder.addCase(editTask.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload ?? 'Failed to edit task';
    });

    // —— editTaskStatus —— 
    builder.addCase(editTaskStatus.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(editTaskStatus.fulfilled, (state, action) => {
      state.loading = false;
      const idx = state.tasks.findIndex((t) => t.id === action.payload.id);
      if (idx !== -1) state.tasks[idx] = action.payload;
    });
    builder.addCase(editTaskStatus.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload ?? 'Failed to update task status';
    });

    // —— removeTask —— 
    builder.addCase(removeTask.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(removeTask.fulfilled, (state, action) => {
      state.loading = false;
      state.tasks = state.tasks.filter((t) => t.id !== action.payload);
    });
    builder.addCase(removeTask.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload ?? 'Failed to delete task';
    });
  },
});

export const { setTasks } = tasksSlice.actions;
export default tasksSlice.reducer;

// Optional selector
export const selectAllTasks = (state: RootState) => state.tasks.tasks;
