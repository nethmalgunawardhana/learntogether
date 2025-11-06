import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getStudyMaterials,
  getStudyMaterialById,
  addStudyMaterial,
  updateStudyMaterial,
  deleteStudyMaterial,
} from '../../services/firestoreService';

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

export const createMaterial = createAsyncThunk(
  'materials/createMaterial',
  async (materialData, { rejectWithValue }) => {
    try {
      const materialId = await addStudyMaterial(materialData);
      return { id: materialId, ...materialData };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const editMaterial = createAsyncThunk(
  'materials/editMaterial',
  async ({ materialId, updates }, { rejectWithValue }) => {
    try {
      await updateStudyMaterial(materialId, updates);
      return { materialId, updates };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const removeMaterial = createAsyncThunk(
  'materials/removeMaterial',
  async (materialId, { rejectWithValue }) => {
    try {
      await deleteStudyMaterial(materialId);
      return materialId;
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
    setMaterials: (state, action) => {
      state.materials = action.payload;
    },
    addMaterialToList: (state, action) => {
      state.materials.unshift(action.payload);
    },
    updateMaterialInList: (state, action) => {
      const index = state.materials.findIndex(m => m.id === action.payload.id);
      if (index !== -1) {
        state.materials[index] = { ...state.materials[index], ...action.payload };
      }
    },
    removeMaterialFromList: (state, action) => {
      state.materials = state.materials.filter(m => m.id !== action.payload);
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
      })
      // Create material
      .addCase(createMaterial.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createMaterial.fulfilled, (state, action) => {
        state.loading = false;
        state.materials.unshift(action.payload);
        state.error = null;
      })
      .addCase(createMaterial.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Edit material
      .addCase(editMaterial.fulfilled, (state, action) => {
        const { materialId, updates } = action.payload;
        const index = state.materials.findIndex(m => m.id === materialId);
        if (index !== -1) {
          state.materials[index] = { ...state.materials[index], ...updates };
        }
        if (state.selectedMaterial?.id === materialId) {
          state.selectedMaterial = { ...state.selectedMaterial, ...updates };
        }
      })
      .addCase(editMaterial.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Remove material
      .addCase(removeMaterial.fulfilled, (state, action) => {
        state.materials = state.materials.filter(m => m.id !== action.payload);
        if (state.selectedMaterial?.id === action.payload) {
          state.selectedMaterial = null;
        }
      })
      .addCase(removeMaterial.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const {
  clearError,
  clearSelectedMaterial,
  setMaterials,
  addMaterialToList,
  updateMaterialInList,
  removeMaterialFromList,
} = materialsSlice.actions;
export default materialsSlice.reducer;
