import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../../axiosInstance";
import { generatePDF } from "../../../../Utility/GeneratePDF";

const initialState = {
  milkReport: {
    records: [],
    summary: {
      totalLiters: 0,
      avgFat: 0,
      avgSNF: 0,
      avgRate: 0,
      totalAmount: 0,
    },
    fromDate: null,
    toDate: null,
  },
  loading: false,
  error: null,
};

export const fetchMilkReports = createAsyncThunk(
  "milkReport/fetchMilkReports",
  async ({ fromDate, toDate }, { getState, rejectWithValue }) => {
    try {
      const { milkReport } = getState().milk;

      // Check if we already have the data for the current date range
      if (milkReport.fromDate === fromDate && milkReport.toDate === toDate) {
        return milkReport; // Return cached data
      }

      // Fetch new data using axiosInstance
      const response = await axiosInstance.post("/customer/milkreport", {
        fromDate,
        toDate,
      });

      return {
        data: response.data,
        fromDate,
        toDate,
      };
    } catch (error) {
      const errorMessage = error.response
        ? error.response.data
        : "Table Not Found!";
      return rejectWithValue(errorMessage);
    }
  }
);

const milkSlice = createSlice({
  name: "milkReport",
  initialState,
  reducers: {
    clearMilkReportState: (state) => {
      state.milkReport = { ...initialState.milkReport };
      state.loading = false;
      state.error = null;
    },
    savePDF: (state, action) => {
      const { fromDate, toDate, milkReport, summary } = action.payload;
      generatePDF(fromDate, toDate, milkReport, summary);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMilkReports.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMilkReports.fulfilled, (state, action) => {
        state.loading = false;
        state.milkReport.records = action.payload.data.records;
        state.milkReport.summary = action.payload.data.summary;
        state.milkReport.fromDate = action.payload.fromDate;
        state.milkReport.toDate = action.payload.toDate;
      })
      .addCase(fetchMilkReports.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearMilkReportState, savePDF } = milkSlice.actions;
export default milkSlice.reducer;
