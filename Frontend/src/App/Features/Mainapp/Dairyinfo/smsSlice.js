import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../../axiosInstance";

const initialState = {
  smsList: [],
  loading: false,
  error: null,
  success: false,
};

// Async action to save SMS record
export const saveMessage = createAsyncThunk(
  "sms/saveMessage",
  async (smsData, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post("/save-message", smsData);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "An error occurred");
    }
  }
);

// Create SMS slice
const smsSlice = createSlice({
  name: "sms",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(saveMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveMessage.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.smsList = [...state.smsList, action.payload];
      })
      .addCase(saveMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default smsSlice.reducer;
