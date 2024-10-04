import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../axiosInstance";

// Initial state
const initialState = {
  customerInfo: {},
  milkRate: {},
  milkCollection: {},
  status: "idle",
  error: null,
};

// Async Thunk to get Customer Information
export const getCustInfo = createAsyncThunk(
  "milkCollection/getCustInfo",
  async ({ user_code, dairy_id }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/collection/custname", {
        user_code,
        dairy_id,
      });
      return response.data;
    } catch (error) {
      const errorMessage = error.response
        ? error.response.data
        : "Failed to fetch Customer information.";
      return rejectWithValue(errorMessage);
    }
  }
);

// Async Thunk to get Milk Rate
export const getMilkRate = createAsyncThunk(
  "milkCollection/getMilkRate",
  async (
    { dairy_id, rccode, rcdate, fat, snf, liters },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.post("/collection/milkrate", {
        dairy_id,
        rccode,
        rcdate,
        fat,
        snf,
        liters,
      });
      return response.data;
    } catch (error) {
      const errorMessage = error.response
        ? error.response.data
        : "Failed to fetch Milk Rate information.";
      return rejectWithValue(errorMessage);
    }
  }
);

// Async Thunk to Save Milk Collection
export const saveMilkCollection = createAsyncThunk(
  "milkCollection/saveMilkCollection",
  async (
    {
      companyid,
      DMEId,
      ReceiptDate,
      time,
      animal,
      liter, 
      fat,
      snf,
      amt, 
      GLCode,
      code, 
      degree,
      rate,
      cname,
      rno,
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.post("/milk/collection", {
        companyid,
        DMEId,
        ReceiptDate,
        time,
        animal,
        liter,
        fat,
        snf,
        amt,
        GLCode,
        code,
        degree,
        rate,
        cname,
        rno,
      });
      return response.data;
    } catch (error) {
      const errorMessage = error.response
        ? error.response.data
        : "Failed to save Milk Collection.";
      return rejectWithValue(errorMessage);
    }
  }
);

// Creating the Slice
const milkCollectionSlice = createSlice({
  name: "milkCollection",
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    // Handling getCustInfo
    builder
      .addCase(getCustInfo.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(getCustInfo.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.customerInfo = action.payload;
      })
      .addCase(getCustInfo.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Handling getMilkRate
      .addCase(getMilkRate.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(getMilkRate.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.milkRate = action.payload;
      })
      .addCase(getMilkRate.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Handling saveMilkCollection
      .addCase(saveMilkCollection.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(saveMilkCollection.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.milkCollection = action.payload;
      })
      .addCase(saveMilkCollection.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default milkCollectionSlice.reducer;
