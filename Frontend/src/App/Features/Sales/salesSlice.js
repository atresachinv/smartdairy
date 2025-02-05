import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../axiosInstance";

const initialState = {
  salesRates: [],
  status: "idle",
  error: null,
};

export const getProductSaleRates = createAsyncThunk(
  "sales/getProductSaleRates",
  async (groupCode, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/sales-rate", {
        params: { groupCode },
      });
      return response.data.saleRates;
    } catch (error) {
      const errorMessage = error.response
        ? error.response.data
        : "Failed to fetch Sales Rates.";
      return rejectWithValue(errorMessage);
    }
  }
);

export const getvehicleSale = createAsyncThunk(
  "sales/getvehicleSale",
  async (groupCode, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/sales-rate", {
        params: { groupCode },
      });
      return response.data.saleRates;
    } catch (error) {
      const errorMessage = error.response
        ? error.response.data
        : "Failed to fetch Sales Rates.";
      return rejectWithValue(errorMessage);
    }
  }
);

const salesSlice = createSlice({
  name: "sales",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Get Product Sales Rate -------------------------------->
      .addCase(getProductSaleRates.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(getProductSaleRates.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.salesRates = action.payload;
      })
      .addCase(getProductSaleRates.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default salesSlice.reducer;
