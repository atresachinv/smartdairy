import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../axiosInstance";

const initialState = {
  deductionInfo: {},
  subdeductions: [],
  alldeductionInfo: [],
  deductionData: [],
  deductionDetails: [],
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

//get all Deduction
export const getDeductionMaster = createAsyncThunk(
  "deduction/getDeductionMaster",
  async (autoCenter, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        `/deductions?autoCenter=${autoCenter}`
      );
      return response.data.DeductionData;
    } catch (error) {
      const errorMessage = error.response
        ? error.response.data
        : "Failed to fetch deduction information.";
      return rejectWithValue(errorMessage);
    }
  }
);

//get all DeductionDetails
export const getDeductionDetails = createAsyncThunk(
  "deduction/getDeductionDetails",
  async (autoCenter, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        `/deduction-details?autoCenter=${autoCenter}`
      );
      return response.data.DedDetailsData;
    } catch (error) {
      const errorMessage = error.response
        ? error.response.data
        : "Failed to fetch deduction Details.";
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
      }) // payment deduction
      .addCase(getPaymentsDeductionInfo.pending, (state) => {
        state.deductionstatus = "loading";
        state.error = null;
      })
      .addCase(getPaymentsDeductionInfo.fulfilled, (state, action) => {
        state.deductionstatus = "succeeded";
        state.alldeductionInfo = action.payload;
      })
      .addCase(getPaymentsDeductionInfo.rejected, (state, action) => {
        state.deductionstatus = "failed";
        state.error = action.payload;
      })
      .addCase(getDeductionMaster.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getDeductionMaster.fulfilled, (state, action) => {
        state.loading = false;
        state.deductionData = action.payload;
      })
      .addCase(getDeductionMaster.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getDeductionDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getDeductionDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.deductionDetails = action.payload;
      })
      .addCase(getDeductionDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { reset: resetDeduction } = deductionSlice.actions; // Export the reset action
export default deductionSlice.reducer;
