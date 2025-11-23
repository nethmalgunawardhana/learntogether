import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FAVOURITES_KEY = '@favourites';

// Async thunks
export const loadFavourites = createAsyncThunk(
  'favourites/loadFavourites',
  async (_, { rejectWithValue }) => {
    try {
      const favouritesStr = await AsyncStorage.getItem(FAVOURITES_KEY);
      return favouritesStr ? JSON.parse(favouritesStr) : [];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addFavourite = createAsyncThunk(
  'favourites/addFavourite',
  async (item, { getState, rejectWithValue }) => {
    try {
      const { favourites } = getState().favourites;
      const updatedFavourites = [...favourites, item];
      await AsyncStorage.setItem(FAVOURITES_KEY, JSON.stringify(updatedFavourites));
      return item;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const removeFavourite = createAsyncThunk(
  'favourites/removeFavourite',
  async (itemId, { getState, rejectWithValue }) => {
    try {
      const { favourites } = getState().favourites;
      const updatedFavourites = favourites.filter(item => item.id !== itemId);
      await AsyncStorage.setItem(FAVOURITES_KEY, JSON.stringify(updatedFavourites));
      return itemId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const toggleFavourite = createAsyncThunk(
  'favourites/toggleFavourite',
  async (item, { getState, dispatch, rejectWithValue }) => {
    try {
      const { favourites } = getState().favourites;
      const exists = favourites.find(fav => fav.id === item.id);

      if (exists) {
        // Remove from favourites
        await dispatch(removeFavourite(item.id)).unwrap();
        return { action: 'removed', id: item.id };
      } else {
        // Add to favourites
        await dispatch(addFavourite(item)).unwrap();
        return { action: 'added', item };
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Initial state
const initialState = {
  favourites: [],
  loading: false,
  error: null,
};

// Favourites slice
const favouritesSlice = createSlice({
  name: 'favourites',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Load favourites
      .addCase(loadFavourites.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadFavourites.fulfilled, (state, action) => {
        state.loading = false;
        state.favourites = action.payload;
        state.error = null;
      })
      .addCase(loadFavourites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add favourite
      .addCase(addFavourite.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addFavourite.fulfilled, (state, action) => {
        state.loading = false;
        state.favourites.push(action.payload);
        state.error = null;
      })
      .addCase(addFavourite.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Remove favourite
      .addCase(removeFavourite.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFavourite.fulfilled, (state, action) => {
        state.loading = false;
        state.favourites = state.favourites.filter(
          item => item.id !== action.payload
        );
        state.error = null;
      })
      .addCase(removeFavourite.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = favouritesSlice.actions;

// Selectors
export const selectIsFavourite = (itemId) => (state) =>
  state.favourites.favourites.some(item => item.id === itemId);

export default favouritesSlice.reducer;
