import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../axiosInstance";

const initialState = {
  salesRates: [],
  vehiclesales: [],
  allSales: [],
  status: "idle",
  salesstatus: "idle",
  allstatus: "idle",
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
  async ({ fromdate, todate }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/vehicle-sales", {
        params: { fromdate, todate },
      });
      return response.data.vehicleSales;
    } catch (error) {
      const errorMessage = error.response
        ? error.response.data
        : "Failed to fetch Sales Rates.";
      return rejectWithValue(errorMessage);
    }
  }
);
// get all sales details for admin -------------------------------->
export const getAllSale = createAsyncThunk(
  "sales/getAllSale",
  async ({ fromdate, todate }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/admin/all-sales", {
        params: { fromdate, todate },
      });
      return response.data.allSales;
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
      // Get Product Sales Rate ------------------------------------------------------>
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
      }) // get vehicle sales -------------------------------------------------------->
      .addCase(getvehicleSale.pending, (state) => {
        state.salesstatus = "loading";
        state.error = null;
      })
      .addCase(getvehicleSale.fulfilled, (state, action) => {
        state.salesstatus = "succeeded";
        state.vehiclesales = action.payload;
      })
      .addCase(getvehicleSale.rejected, (state, action) => {
        state.salesstatus = "failed";
        state.error = action.payload;
      }) // get all sales -------------------------------------------------------->
      .addCase(getAllSale.pending, (state) => {
        state.allstatus = "loading";
        state.error = null;
      })
      .addCase(getAllSale.fulfilled, (state, action) => {
        state.allstatus = "succeeded";
        state.allSales = action.payload;
      })
      .addCase(getAllSale.rejected, (state, action) => {
        state.allstatus = "failed";
        state.error = action.payload;
      });
  },
});

export default salesSlice.reducer;
