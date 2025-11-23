import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loginUser, registerUser, logoutUser, getUserData } from '../../services/authService';

// Async thunks
export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const result = await loginUser(email, password);
      await AsyncStorage.setItem('user', JSON.stringify(result.user));
      await AsyncStorage.setItem('userData', JSON.stringify(result.userData));
      if (result.accessToken) {
        await AsyncStorage.setItem('accessToken', result.accessToken);
      }
      if (result.refreshToken) {
        await AsyncStorage.setItem('refreshToken', result.refreshToken);
      }
      return result;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async ({ email, password, username, profile }, { rejectWithValue }) => {
    try {
      const result = await registerUser(email, password, username, profile);
      await AsyncStorage.setItem('user', JSON.stringify(result.user));
      await AsyncStorage.setItem('userData', JSON.stringify(result.userData));
      if (result.accessToken) {
        await AsyncStorage.setItem('accessToken', result.accessToken);
      }
      if (result.refreshToken) {
        await AsyncStorage.setItem('refreshToken', result.refreshToken);
      }
      return result;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await logoutUser();
      await AsyncStorage.removeItem('user');
      await AsyncStorage.removeItem('userData');
      await AsyncStorage.removeItem('accessToken');
      await AsyncStorage.removeItem('refreshToken');
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const loadStoredUser = createAsyncThunk(
  'auth/loadStoredUser',
  async (_, { rejectWithValue }) => {
    try {
      const userStr = await AsyncStorage.getItem('user');
      const userDataStr = await AsyncStorage.getItem('userData');
      const accessToken = await AsyncStorage.getItem('accessToken');

      if (userStr && userDataStr) {
        const user = JSON.parse(userStr);
        const userData = JSON.parse(userDataStr);

        // Optionally refresh user data from API using access token
        const freshUserData = await getUserData(user.uid, accessToken);

        return {
          user,
          userData: freshUserData || userData,
          accessToken,
        };
      }
      return null;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Initial state
const initialState = {
  user: null,
  userData: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  initialized: false,
};

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    updateUserData: (state, action) => {
      state.userData = {
        ...state.userData,
        ...action.payload,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.userData = action.payload.userData;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      })
      // Register
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.userData = action.payload.userData;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      })
      // Logout
      .addCase(logout.pending, (state) => {
        state.loading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.userData = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(logout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Load stored user
      .addCase(loadStoredUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadStoredUser.fulfilled, (state, action) => {
        state.loading = false;
        state.initialized = true;
        if (action.payload) {
          state.user = action.payload.user;
          state.userData = action.payload.userData;
          state.accessToken = action.payload.accessToken;
          state.refreshToken = action.payload.refreshToken;
          state.isAuthenticated = true;
        } else {
          state.isAuthenticated = false;
        }
      })
      .addCase(loadStoredUser.rejected, (state, action) => {
        state.loading = false;
        state.initialized = true;
        state.error = action.payload;
        state.isAuthenticated = false;
      });
  },
});

export const { clearError, updateUserData } = authSlice.actions;
export default authSlice.reducer;
