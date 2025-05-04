import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { socket } from "../../socket";
import axios from "axios";
import customFetch from "../../hooks/customAxios";

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials, thunkAPI) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_APP_API_URL}/api/v1/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(credentials || {}),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }

      const data = await response.json();

      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getUserByUsername = createAsyncThunk(
  "auth/getUserByUsername",
  async (credentials, thunkAPI) => {
    try {
      const response = await customFetch(`/api/v1/users/${credentials}`);

      const data = await response.data;

      return data;
    } catch (error) {
      console.log(error);
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const followUser = createAsyncThunk(
  "auth/followUser",
  async (credentials, thunkAPI) => {
    try {
      const response = await customFetch.post(
        `${import.meta.env.VITE_APP_API_URL}/api/v1/users/${
          credentials?.id
        }/follow/${credentials?.followingId}`
      );

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const unfollowUser = createAsyncThunk(
  "auth/unfollowUser",
  async (credentials, thunkAPI) => {
    try {
      const response = await customFetch.post(
        `${import.meta.env.VITE_APP_API_URL}/api/v1/users/${
          credentials?.id
        }/unfollow/${credentials?.followingId}`
      );

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    isAuth: false,
    user: null,
    status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
    token: null,
    userByUsername: null,
    userByUsernameError: false,
    followLoading: false,
    followError: false,
    refetchUsers: `refresh-users-${new Date()}`,
  },
  reducers: {
    logout: (state) => {
      state.isAuth = false;
      state.user = null;
      state.token = null;
      socket.disconnect();
    },
    updateRefetchUsers: (state, action) => {
      state.refetchUsers = new Date();
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.isAuth = true;
        state.user = action.payload.user;
        state.token = action.payload?.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.isAuth = false;
        state.error = action.payload;
        state.token = null;
      })
      .addCase(getUserByUsername.pending, (state) => {
        state.followLoading = true;
      })
      .addCase(getUserByUsername.fulfilled, (state, action) => {
        state.followLoading = false;
        state.userByUsername = action.payload?.user;
        state.userByUsernameError = false;
      })
      .addCase(getUserByUsername.rejected, (state, action) => {
        state.followLoading = false;
        state.userByUsernameError = true;
      })
      .addCase(followUser.pending, (state) => {
        state.followLoading = true;
      })
      .addCase(followUser.fulfilled, (state, action) => {
        state.followLoading = false;
        state.followError = false;
        state.refetchUsers = `refresh-users-${new Date()}`;
      })
      .addCase(followUser.rejected, (state, action) => {
        state.followLoading = false;
        state.followError = true;
      })
      .addCase(unfollowUser.pending, (state) => {
        state.followLoading = true;
      })
      .addCase(unfollowUser.fulfilled, (state, action) => {
        state.followLoading = false;
        state.followError = false;
        state.refetchUsers = `refresh-users-${new Date()}`;
      })
      .addCase(unfollowUser.rejected, (state, action) => {
        state.followLoading = false;
        state.followError = true;
      });
  },
});

export const { logout, addFollowerToUserByUsername } = authSlice.actions;
export default authSlice.reducer;
