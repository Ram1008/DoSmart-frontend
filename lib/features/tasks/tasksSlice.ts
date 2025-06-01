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

export const loadTasks = createAsyncThunk<Task[], string, { rejectValue: string }>(
  'tasks/loadTasks',
  async (token, thunkAPI) => {
    try {
      const tasks = await apiFetchTasks(token);
      return tasks;
    } catch (err) {
      const errorMessage = (err instanceof Error) ? err.message : 'Failed to load tasks';
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

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
    } catch (err) {
      const errorMessage = (err instanceof Error) ? err.message : 'Failed to add task';
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

export const editTask = createAsyncThunk<
  Task,
  { token: string; taskId: string; updatedFields: Partial<Omit<Task, 'id' | 'user_id' | 'created_at' | 'updated_at'>> },
  { rejectValue: string }
>('tasks/editTask', async ({ token, taskId, updatedFields }, thunkAPI) => {
  try {
    const updatedTask = await apiUpdateTask(token, taskId, updatedFields);
    return updatedTask;
  } catch (err) {
    const errorMessage = (err instanceof Error) ? err.message : 'Failed to edit task';
    return thunkAPI.rejectWithValue(errorMessage);
  }
});

export const editTaskStatus = createAsyncThunk<
  Task,
  { token: string; taskId: string; newStatus: string },
  { rejectValue: string }
>('tasks/editTaskStatus', async ({ token, taskId, newStatus }, thunkAPI) => {
  try {
    const updatedTask = await apiUpdateTaskStatus(token, taskId, newStatus);
    return updatedTask;
  } catch (err) {
    const errorMessage = (err instanceof Error) ? err.message : 'Failed to update task status';
    return thunkAPI.rejectWithValue(errorMessage);
  }
});

// 5) Thunk: removeTask → DELETE /api/tasks/:id
export const removeTask = createAsyncThunk<string, { token: string; taskId: string }, { rejectValue: string }>(
  'tasks/removeTask',
  async ({ token, taskId }, thunkAPI) => {
    try {
      await apiDeleteTask(token, taskId);
      return taskId; 
    } catch (err) {
      const errorMessage = (err instanceof Error) ? err.message : 'Failed to delete task';
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    
    setTasks: (state, action: PayloadAction<Task[]>) => {
      state.tasks = action.payload;
    },
  },
  extraReducers: (builder) => {
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

    builder.addCase(removeTask.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(removeTask.fulfilled, (state, action) => {
      state.loading = false;
      state.tasks = state.tasks.filter((task) => task.id !== action.payload.id);
    });
    builder.addCase(removeTask.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload ?? 'Failed to delete task';
    });
  },
});

export const { setTasks } = tasksSlice.actions;
export default tasksSlice.reducer;

export const selectAllTasks = (state: RootState) => state.tasks.tasks;
