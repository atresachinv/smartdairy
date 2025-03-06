import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../../axiosInstance";

const initialState = {
  centerMilk: [],
  custCount: [],
  status: "idle",
  centermilkstatus: "idle",
  error: null,
};

export const getCenterMilkData = createAsyncThunk(
  "dashboard/getCenterMilkData",
  async ({ fromDate, toDate }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/dashboard/centers-data", {
        fromDate,
        toDate,
      });
      return response.data.centerData;
    } catch (error) {
      const errorMessage = error.response
        ? error.response.data
        : "Failed to fetch centerwise liters and amount.";
      return rejectWithValue(errorMessage);
    }
  }
);

export const getCenterCustCount = createAsyncThunk(
  "dashboard/getCenterCustCount",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        "/dashboard/centers/customer-count"
      );
      return response.data.custCounts;
    } catch (error) {
      const errorMessage = error.response
        ? error.response.data
        : "Failed to fetch center wise customer counts.";
      return rejectWithValue(errorMessage);
    }
  }
);

const milkCollectionSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    setEntries: (state, action) => {
      state.entries = action.payload;
    },
    addEntry: (state, action) => {
      state.entries.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCenterMilkData.pending, (state) => {
        state.centermilkstatus = "loading";
        state.error = null;
      })
      .addCase(getCenterMilkData.fulfilled, (state, action) => {
        state.centermilkstatus = "succeeded";
        state.centerMilk = action.payload;
      })
      .addCase(getCenterMilkData.rejected, (state, action) => {
        state.centermilkstatus = "failed";
        state.error = action.payload;
      }) // get customer count -------------------------------------------------------->
      .addCase(getCenterCustCount.pending, (state) => {
        state.centermilkstatus = "loading";
        state.error = null;
      })
      .addCase(getCenterCustCount.fulfilled, (state, action) => {
        state.centermilkstatus = "succeeded";
        state.custCount = action.payload;
      })
      .addCase(getCenterCustCount.rejected, (state, action) => {
        state.centermilkstatus = "failed";
        state.error = action.payload;
      });
  },
});

export default milkCollectionSlice.reducer;
