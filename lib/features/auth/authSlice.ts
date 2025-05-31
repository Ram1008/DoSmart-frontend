'use client';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getUser, loginRequest, signupRequest } from '../../api/authAPI';

interface AuthState {
  username: string | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  username: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

const saveToLocalStorage = (username: string, token: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('username', username);
    localStorage.setItem('authToken', token);
  }
};

const removeFromLocalStorage = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('username');
    localStorage.removeItem('authToken');
  }
};

const createAuthThunk = (
  type: 'loginUser' | 'signupUser',
  requestFn: typeof loginRequest | typeof signupRequest
) =>
  createAsyncThunk<{ username: string; token: string }, { username: string; password: string }, { rejectValue: string }>(
    `auth/${type}`,
    async ({ username, password }, thunkAPI) => {
      try {
        return await requestFn(username, password);
      } catch (err) {
        const message = err instanceof Error ? err.message : `${type} failed`;
        return thunkAPI.rejectWithValue(message);
      }
    }
  );

export const loginUser = createAuthThunk('loginUser', loginRequest);
export const signupUser = createAuthThunk('signupUser', signupRequest);

export const fetchUser = createAsyncThunk<
  { username: string; token: string },
  string,
  { rejectValue: string }
>('auth/fetchUser', async (token, thunkAPI) => {
  try {
    const storedUsername = typeof window !== 'undefined' ? localStorage.getItem('username') : '';
    await getUser(token);
    return { username: storedUsername || '', token };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Fetch user failed';
    return thunkAPI.rejectWithValue(message);
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: () => {
      removeFromLocalStorage();
      return initialState;
    },
  },
  extraReducers: (builder) => {
    const setAuth = (
      state: AuthState,
      { payload }: { payload: { username: string; token: string } }
    ) => {
      state.loading = false;
      state.username = payload.username;
      state.token = payload.token;
      state.isAuthenticated = true;
      saveToLocalStorage(payload.username, payload.token);
    };

    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, setAuth)
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Login failed';
      });

    builder
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, setAuth)
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Signup failed';
      });

    builder
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, setAuth)
      .addCase(fetchUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Fetch user failed';
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
