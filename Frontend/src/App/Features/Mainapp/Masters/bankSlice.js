import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../../axiosInstance";

const initialState = {
  maxCode: "",
  banksList: [],
  status: "idle",
  crestatus: "idle",
  upstatus: "idle",
  liststatus: "idle",
  delstatus: "idle",
  error: null,
};

// create new bank
export const fetchMaxCode = createAsyncThunk(
  "bank/fetchMaxCode",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/bank/maxcode");
      return response.data.maxBankCode;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
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
  async ({ values }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put("/bank/update", { values });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Fetch bank list
export const getBankList = createAsyncThunk(
  "bank/getBankList",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/bank/list");
      return response.data.bankList;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Delete bank
export const deleteBank = createAsyncThunk(
  "bank/deleteBank",
  async ({ id }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete("/bank/delete", {
        params: { id },
      });
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
    builder // Max bank code ------------------------------------------->
      .addCase(fetchMaxCode.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchMaxCode.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.maxCode = action.payload;
      })
      .addCase(fetchMaxCode.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      }) //  create new bank  ----------------------------------------->
      .addCase(createBank.pending, (state) => {
        state.crestatus = "loading";
      })
      .addCase(createBank.fulfilled, (state) => {
        state.crestatus = "succeeded";
      })
      .addCase(createBank.rejected, (state, action) => {
        state.crestatus = "failed";
        state.error = action.payload;
      }) // update bank details ----------------------------------------->
      .addCase(updateBankDetails.pending, (state) => {
        state.upstatus = "loading";
      })
      .addCase(updateBankDetails.fulfilled, (state) => {
        state.upstatus = "succeeded";
      })
      .addCase(updateBankDetails.rejected, (state, action) => {
        state.upstatus = "failed";
        state.error = action.payload;
      }) // get bank List-------------------------------------------------->
      .addCase(getBankList.pending, (state) => {
        state.liststatus = "loading";
      })
      .addCase(getBankList.fulfilled, (state, action) => {
        state.liststatus = "succeeded";
        state.banksList = action.payload;
      })
      .addCase(getBankList.rejected, (state, action) => {
        state.liststatus = "failed";
        state.error = action.payload;
      }) // Delete bank -------------------------------------------------->
      .addCase(deleteBank.pending, (state) => {
        state.delstatus = "loading";
      })
      .addCase(deleteBank.fulfilled, (state) => {
        state.delstatus = "succeeded";
      })
      .addCase(deleteBank.rejected, (state, action) => {
        state.delstatus = "failed";
        state.error = action.payload;
      });
  },
});
export default bankSlice.reducer;
