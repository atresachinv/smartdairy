import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../../axiosInstance";

const initialState = {
  dairyData: {},
  status: "idle",
  error: null,
};

// Async thunk for fetching dairy info
export const createAccess = createAsyncThunk(
  "access/createAccess",
  async ({ access_name, access_desc }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/add/new-access", {
        access_name,
        access_desc,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message || error.message);
    }
  }
);

const accessSlice = createSlice({
  name: "access",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createAccess.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createAccess.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(createAccess.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default accessSlice.reducer;
