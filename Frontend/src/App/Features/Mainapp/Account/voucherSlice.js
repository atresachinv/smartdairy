import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../../axiosInstance";

const initialState = {
  voucherList: [],
  loading: false,
  error: null,
  success: false,
};

// get all action to fetch voucher record
export const getAllVoucher = createAsyncThunk(
  "allVoucher",
  async ({ VoucherDate, autoCenter, filter }, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get(
        `/all/voucher?VoucherDate=${VoucherDate}&autoCenter=${autoCenter}&filter=${filter}`
      );
      return data.voucherData;
    } catch (error) {
      return rejectWithValue(error.response?.data || "An error occurred");
    }
  }
);

// Create SMS slice
const voucherSlice = createSlice({
  name: "voucher",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllVoucher.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllVoucher.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.voucherList = action.payload;
      })
      .addCase(getAllVoucher.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default voucherSlice.reducer;
