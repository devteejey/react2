// import { createSlice } from "@reduxjs/toolkit";

// const dashboardSlice = createSlice({
//   name: "dashboard",
//   initialState: {
//     stats: {},
//     loading: false,
//     error: null,
//   },
//   reducers: {},
// });

// export default dashboardSlice.reducer;


import {
  createSlice,
  createAsyncThunk,
} from "@reduxjs/toolkit";

import dashboardService from "./dashboardService";

// FETCH DASHBOARD DATA
export const fetchDashboard = createAsyncThunk(
  "dashboard/fetchDashboard",
  async (period = "month", thunkAPI) => {
    try {
      return await dashboardService.getDashboardData(period);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
        error.message ||
        "Failed to load dashboard data"
      );
    }
  }
);

const initialState = {
  stats: {
    totalUsers: 0,
    totalRevenue: 0,
    totalOrders: 0,
    conversionRate: 0,
  },

  revenue: [],
  userGrowth: [],
  sales: [],
  recentActivities: [],

  period: "month",
  loading: false,
  error: null,
  lastUpdated: null,
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,

  reducers: {
    setDashboardPeriod: (state, action) => {
      state.period = action.payload;
    },

    clearDashboardError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // FETCH PENDING
      .addCase(fetchDashboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      // FETCH SUCCESSFUL
      .addCase(fetchDashboard.fulfilled, (state, action) => {
        state.loading = false;

        const data = action.payload;

        state.stats = {
          ...initialState.stats,
          ...data.stats,
        };

        state.revenue = data.revenue || [];
        state.userGrowth = data.userGrowth || [];
        state.sales = data.sales || [];
        state.recentActivities = data.recentActivities || [];

        state.lastUpdated = new Date().toISOString();
      })

      // FETCH FAILED
      .addCase(fetchDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setDashboardPeriod,
  clearDashboardError,
} = dashboardSlice.actions;

export default dashboardSlice.reducer;
