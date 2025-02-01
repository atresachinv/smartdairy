import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../../axiosInstance";


const initialState = {
  banklist: [],
  status: "idle",
  error: null,
};

// create new bank
export const createBank = createAsyncThunk(
  "bank/createBank",
  async ({ values }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/bank/create", { values });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// update bank details
export const updateBankDetails = createAsyncThunk(
  "bank/updateBankDetails",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch("/bank/update");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Delete bank
export const deleteBank = createAsyncThunk(
  "bank/deleteBank",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete("/bank/delete");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const bankSlice = createSlice({
  name: "bank",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder // create new bank ------------------------------------------->
      .addCase(createBank.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createBank.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.maxCustNo = action.payload;
      })
      .addCase(createBank.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      }) // update bank details ----------------------------------------->
      .addCase(updateBankDetails.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateBankDetails.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.maxCustNo = action.payload;
      })
      .addCase(updateBankDetails.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      }) // Delete bank -------------------------------------------------->
      .addCase(deleteBank.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteBank.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.maxCustNo = action.payload;
      })
      .addCase(deleteBank.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
     
  },
});
export default bankSlice.reducer;