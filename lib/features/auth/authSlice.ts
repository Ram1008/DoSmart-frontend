// features/auth/authSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getUser, loginRequest, signupRequest } from '../../api/authAPI';
import type { Task } from '@/types/types';

// 1) AuthState इंटरफ़ेस
interface AuthState {
  username: string | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

// 2) Initial State
const initialState: AuthState = {
  username: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

// 3) AsyncThunk: loginUser
export const loginUser = createAsyncThunk<
  { username: string; token: string },
  { username: string; password: string },
  { rejectValue: string }
>('auth/loginUser', async (creds, thunkAPI) => {
  try {
    const response = await loginRequest(creds.username, creds.password);
    return response; // { username, token }
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err.message);
  }
});

// 4) AsyncThunk: signupUser
export const signupUser = createAsyncThunk<
  { username: string; token: string },
  { username: string; password: string },
  { rejectValue: string }
>('auth/signupUser', async (creds, thunkAPI) => {
  try {
    const response = await signupRequest(creds.username, creds.password);
    return response; // { username, token }
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err.message);
  }
});

// 5) AsyncThunk: fetchUser → GET /api/tasks (token-authenticated) + username from localStorage
export const fetchUser = createAsyncThunk<
  { username: string; token: string; tasks: Task[] },
  string,
  { rejectValue: string }
>('auth/fetchUser', async (token, thunkAPI) => {
  try {
    // 5.1) लोकल स्टोरेज से username पढ़ें (login/signup के दौरान सेट हुआ होगा)
    const storedUsername = localStorage.getItem('username') || '';
    // 5.2) getUser में हमने /api/tasks+username logic रखा है
    const response = await getUser(token);
    // response: { username, tasks }
    // 5.3) अगर बैकएंड ने रीडिस्पैचिंग के समय नया token भेजा हो, तो response.token यूज़रिंग करें
    return { username: storedUsername, token, tasks: response.tasks || [] };
  } catch (err: any) {
    return thunkAPI.rejectWithValue('Failed to fetch user');
  }
});

// 6) Create the slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // 6.1) Logout → लोकल स्टोरेज + Redux state क्लियर
    logout: (state) => {
      localStorage.removeItem('authToken');
      localStorage.removeItem('username');
      state.username = null;
      state.token = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // —— LOGIN —— 
    builder.addCase(loginUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.loading = false;
      state.username = action.payload.username;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      localStorage.setItem('authToken', action.payload.token);
      localStorage.setItem('username', action.payload.username);
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload ?? 'Login failed';
    });

    // —— SIGNUP —— 
    builder.addCase(signupUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(signupUser.fulfilled, (state, action) => {
      state.loading = false;
      state.username = action.payload.username;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      localStorage.setItem('authToken', action.payload.token);
      localStorage.setItem('username', action.payload.username);
    });
    builder.addCase(signupUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload ?? 'Signup failed';
    });

    // —— FETCH USER —— 
    builder.addCase(fetchUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchUser.fulfilled, (state, action) => {
      state.loading = false;
      state.username = action.payload.username;
      state.token = action.payload.token;
      state.isAuthenticated = true;
    });
    builder.addCase(fetchUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload ?? 'Failed to fetch user';
    });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
