import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../../axiosInstance";

// Define the initial state
const initialState = {
  dairyData: {},
  allDairyData: [],
  allDstatus: "idle",
  status: "idle",
  error: null,
};

// Async thunk for fetching dairy info
export const fetchAllDairyInfo = createAsyncThunk(
  "dairyInfo/fetchAllDairyInfo",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/all/dairies");
      return response.data.alldairyInfo;
    } catch (error) {
      return rejectWithValue(error.response.data.message || error.message);
    }
  }
);

// Async thunk for fetching dairy info
export const fetchDairyInfo = createAsyncThunk(
  "dairyInfo/fetchDairyInfo",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/dairyinfo");
      return response.data.dairyInfo;
    } catch (error) {
      return rejectWithValue(error.response.data.message || error.message);
    }
  }
);

const dairySlice = createSlice({
  name: "dairy",
  initialState,
  reducers: {
    // Optionally define any reducers here
  },
  extraReducers: (builder) => {
    builder // fetch all dairy list ------------------------------------------------------------->
      .addCase(fetchAllDairyInfo.pending, (state) => {
        state.allDstatus = "loading";
      })
      .addCase(fetchAllDairyInfo.fulfilled, (state, action) => {
        state.allDstatus = "succeeded";
        state.allDairyData = action.payload;
      })
      .addCase(fetchAllDairyInfo.rejected, (state, action) => {
        state.allDstatus = "failed";
        state.error = action.payload;
      }) // fetch login dairy info -------------------------------------------------------------->
      .addCase(fetchDairyInfo.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchDairyInfo.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.dairyData = action.payload;
      })
      .addCase(fetchDairyInfo.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

// Updated selectors
export const selectDairyData = (state) => state.dairy.dairyData;
export const selectDairyStatus = (state) => state.dairy.status;
export const selectDairyError = (state) => state.dairy.error;

export default dairySlice.reducer;
