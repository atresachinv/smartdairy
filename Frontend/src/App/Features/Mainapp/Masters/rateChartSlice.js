// rateChartSlice.js

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../../axiosInstance";

const initialState = {
  status: "idle",
  error: null,
  progress: 0, 
};


export const saveRateChart = createAsyncThunk(
  "ratechart/saveRateChart",
  async (
    { rccode, rctype, rcdate, time, animal, rate },
    { rejectWithValue, signal, dispatch }
  ) => {
    try {
      const response = await axiosInstance.post(
        "/upload/ratechart",
        {
          rccode,
          rctype,
          rcdate,
          time,
          animal, 
          rate,
        },
        {
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            dispatch(updateProgress(percentCompleted));
          },
          signal, // Attach the signal for cancellation
        }
      );
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Failed to save Ratechart information.";
      return rejectWithValue(errorMessage);
    }
  }
);

// Slice
const rateChartSlice = createSlice({
  name: "ratechart",
  initialState,
  reducers: {
    updateProgress(state, action) {
      state.progress = action.payload;
    },
    resetProgress(state) {
      state.progress = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(saveRateChart.pending, (state) => {
        state.status = "loading";
        state.error = null;
        state.progress = 0;
      })
      .addCase(saveRateChart.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.progress = 100; 
      })
      .addCase(saveRateChart.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
        state.progress = 0;
      });
  },
});

export const { updateProgress, resetProgress } = rateChartSlice.actions;

export default rateChartSlice.reducer;
