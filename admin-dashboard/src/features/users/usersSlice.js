
import {
  createSlice,
  createAsyncThunk,
} from "@reduxjs/toolkit";

import usersService from "./usersService";

// Helper for API error messages
const getErrorMessage = (error) =>
  error.response?.data?.message || error.message || "Something went wrong";

// READ ALL USERS
export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async (_, thunkAPI) => {
    try {
      return await usersService.getUsers();
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
  }
);

// READ SINGLE USER
export const fetchUserById = createAsyncThunk(
  "users/fetchUserById",
  async (userId, thunkAPI) => {
    try {
      return await usersService.getUser(userId);
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
  }
);

// CREATE USER
export const createUser = createAsyncThunk(
  "users/createUser",
  async (userData, thunkAPI) => {
    try {
      return await usersService.createUser(userData);
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
  }
);

// UPDATE USER
export const updateUser = createAsyncThunk(
  "users/updateUser",
  async ({ userId, userData }, thunkAPI) => {
    try {
      return await usersService.updateUser({ userId, userData });
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
  }
);

// DELETE USER
export const deleteUser = createAsyncThunk(
  "users/deleteUser",
  async (userId, thunkAPI) => {
    try {
      return await usersService.deleteUser(userId);
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
  }
);

const getUserObject = (response) => response.user || response;

const getUserId = (user) => user._id || user.id;

const initialState = {
  users: [],
  selectedUser: null,
  loading: false,
  actionLoading: false,
  error: null,
  success: false,
};

const usersSlice = createSlice({
  name: "users",
  initialState,

  reducers: {
    clearUsersError: (state) => {
      state.error = null;
    },

    clearUsersSuccess: (state) => {
      state.success = false;
    },

    clearSelectedUser: (state) => {
      state.selectedUser = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // FETCH ALL USERS
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = Array.isArray(action.payload)
          ? action.payload
          : action.payload.users || [];
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // FETCH SINGLE USER
      .addCase(fetchUserById.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.selectedUser = getUserObject(action.payload);
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })

      // CREATE USER
      .addCase(createUser.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.actionLoading = false;

        const newUser = getUserObject(action.payload);
        state.users.unshift(newUser);
        state.success = true;
      })
      .addCase(createUser.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })

      // UPDATE USER
      .addCase(updateUser.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.actionLoading = false;

        const updatedUser = getUserObject(action.payload);
        const updatedId = getUserId(updatedUser);

        state.users = state.users.map((user) =>
          getUserId(user) === updatedId ? updatedUser : user
        );

        if (
          state.selectedUser &&
          getUserId(state.selectedUser) === updatedId
        ) {
          state.selectedUser = updatedUser;
        }

        state.success = true;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })

      // DELETE USER
      .addCase(deleteUser.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.actionLoading = false;

        state.users = state.users.filter(
          (user) => getUserId(user) !== action.payload
        );

        if (
          state.selectedUser &&
          getUserId(state.selectedUser) === action.payload
        ) {
          state.selectedUser = null;
        }

        state.success = true;
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      });
  },
});

export const {
  clearUsersError,
  clearUsersSuccess,
  clearSelectedUser,
} = usersSlice.actions;

export default usersSlice.reducer;
