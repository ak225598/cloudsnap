import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  name: "",
  email: "",
  lastLogin: "",
  memberSince: "",
};

export const getUserDetails = createAsyncThunk(
  "profile/getUserDetails",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/api/users/getUserDetails");
      return response.data.data;
    } catch (error) {
      console.error("Error fetching user details:", error);
      return rejectWithValue(error.response.data);
    }
  }
);

export const logoutUser = createAsyncThunk(
  "profile/logOutUser",
  async (_, { rejectWithValue }) => {
    try {
      await axios.get("/api/users/logout");
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUserDetails.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getUserDetails.fulfilled, (state, action) => {
        const userData = action.payload;
        state.status = "succeeded";
        state.name = userData.username;
        state.email = userData.email;
        state.lastLogin = userData.lastLogin;
        state.memberSince = userData.createdAt;
      })
      .addCase(getUserDetails.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Something went wrong";
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.userData = null;
      });
  },
});

export default profileSlice.reducer;
