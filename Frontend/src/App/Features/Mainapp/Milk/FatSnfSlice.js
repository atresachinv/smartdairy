import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../../axiosInstance";

const initialState = {
  fatstatus: "idle",
  snfstatus: "idle",
  convertKLstatus: "idle",
  error: null,
};

// updating general fat ------------------------------------------>
export const updateGeneralFat = createAsyncThunk(
  "fatsnf/updateGeneralFat",
  async (
    { fromDate, toDate, shift, custFrom, custTo, fat },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.put("/update/fat", {
        fromDate,
        toDate,
        shift,
        custFrom,
        custTo,
        fat,
      });
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// updating todays fat with previous day fat ---------------------------------------->
export const updatePreviousFat = createAsyncThunk(
  "fatsnf/updatePreviousFat",
  async (
    { fromDate, toDate, shift, custFrom, custTo, days },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.put("/update/previous/fat", {
        fromDate,
        toDate,
        shift,
        custFrom,
        custTo,
        days,
      });
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// updating difference fat ---------------------------------------->
export const updateDiffFat = createAsyncThunk(
  "fatsnf/updateDiffFat",
  async (
    { fromDate, toDate, shift, custFrom, custTo, fatDiff },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.put("/update/fat-diff", {
        fromDate,
        toDate,
        shift,
        custFrom,
        custTo,
        fatDiff,
      });
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// updating general snf ------------------------------------------->
export const updateGeneralSnf = createAsyncThunk(
  "fatsnf/updateGeneralSnf",
  async (
    { fromDate, toDate, shift, custFrom, custTo, snf },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.put("/update/snf", {
        fromDate,
        toDate,
        shift,
        custFrom,
        custTo,
        snf,
      });
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// updating todays snf with previous day snf ---------------------------------------->
export const updatePreviousSnf = createAsyncThunk(
  "fatsnf/updatePreviousSnf",
  async (
    { fromDate, toDate, shift, custFrom, custTo, days },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.put("/update/previous/snf", {
        fromDate,
        toDate,
        shift,
        custFrom,
        custTo,
        days,
      });
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// updating difference snf ---------------------------------------->
export const updateDiffSnf = createAsyncThunk(
  "fatsnf/updateDiffSnf",
  async (
    { fromDate, toDate, shift, custFrom, custTo, snfDiff },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.put("/update/snf-diff", {
        fromDate,
        toDate,
        shift,
        custFrom,
        custTo,
        snfDiff,
      });
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// convert kg to liters of liters to kg -------------------------->
export const convertKgLiters = createAsyncThunk(
  "fatsnf/convertKgLiters",
  async (
    { fromDate, toDate, shift, custFrom, custTo, milkIn, amount },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.put("/convert/kg-ltr/ltr-kg", {
        fromDate,
        toDate,
        shift,
        custFrom,
        custTo,
        milkIn,
        amount,
      });
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const FatSnfSlice = createSlice({
  name: "fatsnf",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder // updating general fat --------------------------------------------->
      .addCase(updateGeneralFat.pending, (state) => {
        state.fatstatus = "loading";
      })
      .addCase(updateGeneralFat.fulfilled, (state) => {
        state.fatstatus = "succeeded";
      })
      .addCase(updateGeneralFat.rejected, (state, action) => {
        state.fatstatus = "failed";
        state.error = action.payload;
      }) //  updating todays fat with previous day fat -------------------------->
      .addCase(updatePreviousFat.pending, (state) => {
        state.fatstatus = "loading";
      })
      .addCase(updatePreviousFat.fulfilled, (state) => {
        state.fatstatus = "succeeded";
      })
      .addCase(updatePreviousFat.rejected, (state, action) => {
        state.fatstatus = "failed";
        state.error = action.payload;
      }) //  updating diff fat  ------------------------------------------------->
      .addCase(updateDiffFat.pending, (state) => {
        state.fatstatus = "loading";
      })
      .addCase(updateDiffFat.fulfilled, (state) => {
        state.fatstatus = "succeeded";
      })
      .addCase(updateDiffFat.rejected, (state, action) => {
        state.fatstatus = "failed";
        state.error = action.payload;
      }) // updating general snf ------------------------------------------------>
      .addCase(updateGeneralSnf.pending, (state) => {
        state.snfstatus = "loading";
      })
      .addCase(updateGeneralSnf.fulfilled, (state) => {
        state.snfstatus = "succeeded";
      })
      .addCase(updateGeneralSnf.rejected, (state, action) => {
        state.snfstatus = "failed";
        state.error = action.payload;
      }) // updating todays snf with previous day snf -------------------------->
      .addCase(updatePreviousSnf.pending, (state) => {
        state.snfstatus = "loading";
      })
      .addCase(updatePreviousSnf.fulfilled, (state) => {
        state.snfstatus = "succeeded";
      })
      .addCase(updatePreviousSnf.rejected, (state, action) => {
        state.snfstatus = "failed";
        state.error = action.payload;
      }) // updating snf diff -------------------------------------------------->
      .addCase(updateDiffSnf.pending, (state) => {
        state.snfstatus = "loading";
      })
      .addCase(updateDiffSnf.fulfilled, (state, action) => {
        state.snfstatus = "succeeded";
        state.drList = action.payload;
      })
      .addCase(updateDiffSnf.rejected, (state, action) => {
        state.snfstatus = "failed";
        state.error = action.payload;
      }) // convert kg to liters or liters to kg ------------------------------->
      .addCase(convertKgLiters.pending, (state) => {
        state.convertKLstatus = "loading";
      })
      .addCase(convertKgLiters.fulfilled, (state, action) => {
        state.convertKLstatus = "succeeded";
        state.drList = action.payload;
      })
      .addCase(convertKgLiters.rejected, (state, action) => {
        state.convertKLstatus = "failed";
        state.error = action.payload;
      });
  },
});
export default FatSnfSlice.reducer;
