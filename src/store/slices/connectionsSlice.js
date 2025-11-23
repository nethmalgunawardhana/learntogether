import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CONNECTIONS_KEY = '@connections';

// Async thunks
export const loadConnections = createAsyncThunk(
  'connections/loadConnections',
  async (_, { rejectWithValue }) => {
    try {
      const connectionsStr = await AsyncStorage.getItem(CONNECTIONS_KEY);
      return connectionsStr ? JSON.parse(connectionsStr) : [];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addConnection = createAsyncThunk(
  'connections/addConnection',
  async (peer, { getState, rejectWithValue }) => {
    try {
      const { connections } = getState().connections;
      const connection = {
        ...peer,
        connectedAt: new Date().toISOString(),
        status: 'connected',
      };
      const updatedConnections = [...connections, connection];
      await AsyncStorage.setItem(CONNECTIONS_KEY, JSON.stringify(updatedConnections));
      return connection;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const removeConnection = createAsyncThunk(
  'connections/removeConnection',
  async (peerId, { getState, rejectWithValue }) => {
    try {
      const { connections } = getState().connections;
      const updatedConnections = connections.filter(conn => conn.id !== peerId);
      await AsyncStorage.setItem(CONNECTIONS_KEY, JSON.stringify(updatedConnections));
      return peerId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Initial state
const initialState = {
  connections: [],
  loading: false,
  error: null,
};

// Connections slice
const connectionsSlice = createSlice({
  name: 'connections',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Load connections
      .addCase(loadConnections.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadConnections.fulfilled, (state, action) => {
        state.loading = false;
        state.connections = action.payload;
        state.error = null;
      })
      .addCase(loadConnections.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add connection
      .addCase(addConnection.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addConnection.fulfilled, (state, action) => {
        state.loading = false;
        state.connections.push(action.payload);
        state.error = null;
      })
      .addCase(addConnection.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Remove connection
      .addCase(removeConnection.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeConnection.fulfilled, (state, action) => {
        state.loading = false;
        state.connections = state.connections.filter(
          conn => conn.id !== action.payload
        );
        state.error = null;
      })
      .addCase(removeConnection.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = connectionsSlice.actions;

// Selectors
export const selectIsConnected = (peerId) => (state) =>
  state.connections.connections.some(conn => conn.id === peerId);

export default connectionsSlice.reducer;
