import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../../axiosInstance";

const initialState = {
  status: "idle",
  error: null,
};

//upload milk collection from excel file
export const uploadMilkCollection = createAsyncThunk(
  "milkUpload/uploadMilkCollection",
  async (milkData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        "/upload/milk/collection",
        milkData
      );
      return response.data;
    } catch (error) {
      const errorMessage = error.response
        ? error.response.data
        : "Failed to upload milk collection.";
      return rejectWithValue(errorMessage);
    }
  }
);

const milkDUploadSlice = createSlice({
  name: "milkUpload",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(uploadMilkCollection.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(uploadMilkCollection.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(uploadMilkCollection.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default milkDUploadSlice.reducer;
