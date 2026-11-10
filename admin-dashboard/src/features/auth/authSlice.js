
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "./authService";

// Restore the saved token when the application starts.
const token = localStorage.getItem("token");

const initialState = {
  user: null,
  token: token || null,
  isAuthenticated: Boolean(token),
  loading: Boolean(token),
  error: null,
};

// LOGIN
export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials, thunkAPI) => {
    try {
      return await authService.login(credentials);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Login failed"
      );
    }
  }
);

// GET CURRENT USER
export const fetchCurrentUser = createAsyncThunk(
  "auth/currentUser",
  async (_, thunkAPI) => {
    try {
      return await authService.getCurrentUser();
    } catch (error) {
      authService.logout();
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Unable to get current user"
      );
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    loggedOut: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
    },

    clearAuthError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // LOGIN PENDING
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      // LOGIN SUCCESS
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.error = null;
      })

      // LOGIN FAILED
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      })

      // FETCH CURRENT USER PENDING
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true;
      })

      // FETCH CURRENT USER SUCCESS
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })

      // FETCH CURRENT USER FAILED
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = action.payload;
      });
  },
});

const { loggedOut, clearAuthError } = authSlice.actions;

export const logoutUser = () => (dispatch) => {
  authService.logout();
  dispatch(loggedOut());
};

export { clearAuthError };

export default authSlice.reducer;
