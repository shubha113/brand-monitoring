import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { dashboardAPI } from "../api/axiosConfig";

export const getDashboardStats = createAsyncThunk(
  "dashboard/stats",
  async (timeRange, { rejectWithValue }) => {
    try {
      const response = await dashboardAPI.getStats(timeRange);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch stats"
      );
    }
  }
);

export const getSentimentTrend = createAsyncThunk(
  "dashboard/sentimentTrend",
  async (timeRange, { rejectWithValue }) => {
    try {
      const response = await dashboardAPI.getSentimentTrend(timeRange);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch sentiment trend"
      );
    }
  }
);

export const getSpikeAlerts = createAsyncThunk(
  "dashboard/spikeAlerts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await dashboardAPI.getSpikeAlerts();
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch spike alerts"
      );
    }
  }
);

export const getKeywords = createAsyncThunk(
  "dashboard/keywords",
  async ({ timeRange, limit }, { rejectWithValue }) => {
    try {
      const response = await dashboardAPI.getKeywords(timeRange, limit);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch keywords"
      );
    }
  }
);

export const getRecentActivity = createAsyncThunk(
  "dashboard/recentActivity",
  async (limit, { rejectWithValue }) => {
    try {
      const response = await dashboardAPI.getRecentActivity(limit);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch recent activity"
      );
    }
  }
);

const initialState = {
  stats: null,
  sentimentTrend: [],
  spikeAlerts: null,
  keywords: [],
  recentActivity: [],
  loading: false,
  error: null,
  timeRange: 7,
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setTimeRange: (state, action) => {
      state.timeRange = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Stats
      .addCase(getDashboardStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getDashboardStats.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.stats = action.payload.data;
      })
      .addCase(getDashboardStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Sentiment Trend
      .addCase(getSentimentTrend.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSentimentTrend.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.sentimentTrend = action.payload.data;
      })
      .addCase(getSentimentTrend.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Spike Alerts
      .addCase(getSpikeAlerts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSpikeAlerts.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.spikeAlerts = action.payload.data;
      })
      .addCase(getSpikeAlerts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Keywords
      .addCase(getKeywords.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getKeywords.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.keywords = action.payload.data;
      })
      .addCase(getKeywords.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Recent Activity
      .addCase(getRecentActivity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getRecentActivity.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.recentActivity = action.payload.data;
      })
      .addCase(getRecentActivity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, setTimeRange } = dashboardSlice.actions;
export default dashboardSlice.reducer;