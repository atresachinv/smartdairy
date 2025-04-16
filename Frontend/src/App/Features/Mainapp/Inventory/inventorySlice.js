import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../../axiosInstance";

const initialState = {
  customerlist: [],
  allProducts: [],
  usedRCNO: [],
  status: "idle",
  excelstatus: "idle",
  error: null,
};

// get max customer no
export const getAllProducts = createAsyncThunk(
  "inventory/getAllProducts",
  async (autoCenter, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/all/products?autoCenter=${autoCenter}`
      );
      return response.data.productData;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const inventorySlice = createSlice({
  name: "inventory",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder // get all products for mobile collector -------------->
      .addCase(getAllProducts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getAllProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.allProducts = action.payload;
      })
      .addCase(getAllProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
        state.allProducts = [];
      }); // --------------------------------------------------->
  },
});

export default inventorySlice.reducer;
