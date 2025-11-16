import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { mentionsAPI } from "../api/axiosConfig";

export const fetchMentions = createAsyncThunk(
  "mentions/fetch",
  async (brandName, { rejectWithValue }) => {
    try {
      const response = await mentionsAPI.fetchMentions(brandName);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch mentions"
      );
    }
  }
);

export const getMentions = createAsyncThunk(
  "mentions/getAll",
  async (params, { rejectWithValue }) => {
    try {
      const response = await mentionsAPI.getMentions(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to get mentions"
      );
    }
  }
);

export const deleteMention = createAsyncThunk(
  "mentions/delete",
  async (id, { rejectWithValue }) => {
    try {
      const response = await mentionsAPI.deleteMention(id);
      return { id, ...response.data };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete mention"
      );
    }
  }
);

const storedBrand = localStorage.getItem("brandName") || "";

const initialState = {
  mentions: [],
  pagination: null,
  loading: false,
  error: null,
  success: false,
  message: "",
  brandName: storedBrand,
};

const mentionSlice = createSlice({
  name: "mentions",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
      state.message = "";
    },
    setBrandName: (state, action) => {
      state.brandName = action.payload;
      localStorage.setItem("brandName", action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch mentions
      .addCase(fetchMentions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMentions.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.success = true;
        state.message = action.payload.message;
      })
      .addCase(fetchMentions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get mentions
      .addCase(getMentions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMentions.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.mentions = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(getMentions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete mention
      .addCase(deleteMention.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteMention.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.success = true;
        state.message = action.payload.message;
        state.mentions = state.mentions.filter(m => m._id !== action.payload.id);
      })
      .addCase(deleteMention.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearSuccess, setBrandName } = mentionSlice.actions;
export default mentionSlice.reducer;