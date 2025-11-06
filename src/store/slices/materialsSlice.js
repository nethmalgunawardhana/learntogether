import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getStudyMaterials, getStudyMaterialById } from '../../services/firestoreService';

// Async thunks
export const fetchMaterials = createAsyncThunk(
  'materials/fetchMaterials',
  async (_, { rejectWithValue }) => {
    try {
      const materials = await getStudyMaterials();
      return materials;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchMaterialById = createAsyncThunk(
  'materials/fetchMaterialById',
  async (materialId, { rejectWithValue }) => {
    try {
      const material = await getStudyMaterialById(materialId);
      return material;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Initial state
const initialState = {
  materials: [],
  selectedMaterial: null,
  loading: false,
  error: null,
};

// Materials slice
const materialsSlice = createSlice({
  name: 'materials',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSelectedMaterial: (state) => {
      state.selectedMaterial = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch materials
      .addCase(fetchMaterials.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMaterials.fulfilled, (state, action) => {
        state.loading = false;
        state.materials = action.payload;
        state.error = null;
      })
      .addCase(fetchMaterials.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch material by ID
      .addCase(fetchMaterialById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMaterialById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedMaterial = action.payload;
        state.error = null;
      })
      .addCase(fetchMaterialById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearSelectedMaterial } = materialsSlice.actions;
export default materialsSlice.reducer;
