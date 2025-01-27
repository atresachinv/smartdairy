import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../axiosInstance";

const initialState = {
  deductionInfo: {},
  subdeductions: [],
  alldeductionInfo: [],
  status: "idle",
  deductionstatus: "idle",
  error: null,
};

export const getDeductionInfo = createAsyncThunk(
  "deduction/getDeductionInfo",
  async ({ fromDate, toDate }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/deduction-info", {
        fromDate,
        toDate,
      });
      return response.data;
    } catch (error) {
      const errorMessage = error.response
        ? error.response.data
        : "Failed to fetch deduction information.";
      return rejectWithValue(errorMessage);
    }
  }
);

// get payment deduction for admin
export const getPaymentsDeductionInfo = createAsyncThunk(
  "deduction/getPaymentsDeductionInfo",
  async ({ fromDate, toDate }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/payment/deduction-info", {
        fromDate,
        toDate,
      });
      return response.data.AllDeductions;
    } catch (error) {
      const errorMessage = error.response
        ? error.response.data
        : "Failed to fetch deduction information.";
      return rejectWithValue(errorMessage);
    }
  }
);

const deductionSlice = createSlice({
  name: "deduction",
  initialState,
  reducers: {
    reset: () => initialState, // Add reset action to return the initial state
  },
  extraReducers: (builder) => {
    builder
      .addCase(getDeductionInfo.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(getDeductionInfo.fulfilled, (state, action) => {
        state.loading = false;
        state.status = "succeeded";
        state.deductionInfo = action.payload.mainDeduction;
        state.subdeductions = action.payload.otherDeductions;
      })
      .addCase(getDeductionInfo.rejected, (state, action) => {
        state.loading = false;
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(getPaymentsDeductionInfo.pending, (state) => {
        state.deductionstatus = "loading";
        state.error = null;
      })
      .addCase(getPaymentsDeductionInfo.fulfilled, (state, action) => {
        state.loading = false;
        state.deductionstatus = "succeeded";
        state.alldeductionInfo = action.payload;
      })
      .addCase(getPaymentsDeductionInfo.rejected, (state, action) => {
        state.loading = false;
        state.deductionstatus = "failed";
        state.error = action.payload;
      });
  },
});

export const { reset: resetDeduction } = deductionSlice.actions; // Export the reset action
export default deductionSlice.reducer;
