import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

const THEME_KEY = '@theme';

// Async thunks
export const loadTheme = createAsyncThunk(
  'theme/loadTheme',
  async (_, { rejectWithValue }) => {
    try {
      const theme = await AsyncStorage.getItem(THEME_KEY);
      return theme || 'light';
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const toggleTheme = createAsyncThunk(
  'theme/toggleTheme',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { mode } = getState().theme;
      const newMode = mode === 'light' ? 'dark' : 'light';
      await AsyncStorage.setItem(THEME_KEY, newMode);
      return newMode;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Initial state
const initialState = {
  mode: 'light',
  loading: false,
  error: null,
};

// Theme slice
const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setTheme: (state, action) => {
      state.mode = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Load theme
      .addCase(loadTheme.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadTheme.fulfilled, (state, action) => {
        state.loading = false;
        state.mode = action.payload;
      })
      .addCase(loadTheme.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Toggle theme
      .addCase(toggleTheme.pending, (state) => {
        state.loading = true;
      })
      .addCase(toggleTheme.fulfilled, (state, action) => {
        state.loading = false;
        state.mode = action.payload;
      })
      .addCase(toggleTheme.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setTheme } = themeSlice.actions;
export default themeSlice.reducer;
