import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../../axiosInstance";

const initialState = {
  maxDrCode: "",
  drList: [],
  status: "idle",
  crestatus: "idle",
  upstatus: "idle",
  liststatus: "idle",
  delstatus: "idle",
  error: null,
};

// updating general fat ------------------------------------------>
export const updateGeneralFat = createAsyncThunk(
  "fatsnf/updateGeneralFat",
  async ({ fromDate, toDate, custFrom, custTo, fat }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put("/update/fat", {
        params: { fromDate, toDate, custFrom, custTo, fat },
      });
      return response.data.maxDrCode;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// updating difference fat ---------------------------------------->
export const updateDiffFat = createAsyncThunk(
  "fatsnf/updateDiffFat",
  async (
    { fromDate, toDate, custFrom, custTo, fatDiff },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.post("/update/fat-diff", {
        params: { fromDate, toDate, custFrom, custTo, fatDiff },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// updating general snf ------------------------------------------->
export const updateGeneralSnf = createAsyncThunk(
  "fatsnf/updateGeneralSnf",
  async ({ fromDate, toDate, custFrom, custTo, snf }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put("/update/snf", {
        params: {
          fromDate,
          toDate,
          custFrom,
          custTo,
          snf,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// updating difference snf ---------------------------------------->
export const updateDiffSnf = createAsyncThunk(
  "fatsnf/updateDiffSnf",
  async (
    { fromDate, toDate, custFrom, custTo, snfDiff },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.get("/update/snf-diff", {
        param: { fromDate, toDate, custFrom, custTo, snfDiff },
      });
      return response.data.drList;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// convert kg to liters of liters to kg -------------------------->
export const convertKgLiters = createAsyncThunk(
  "fatsnf/convertKgLiters",
  async ({ fromDate, toDate, milkIn, amount }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put("/convert/kg-ltr/ltr-kg", {
        params: { fromDate, toDate, milkIn, amount },
      });
      return response.data.drList;
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
    builder // updating general fat ------------------------------------------->
      .addCase(updateGeneralFat.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateGeneralFat.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.maxDrCode = action.payload;
      })
      .addCase(updateGeneralFat.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      }) //  updating diff fat  ----------------------------------------->
      .addCase(updateDiffFat.pending, (state) => {
        state.crestatus = "loading";
      })
      .addCase(updateDiffFat.fulfilled, (state) => {
        state.crestatus = "succeeded";
      })
      .addCase(updateDiffFat.rejected, (state, action) => {
        state.crestatus = "failed";
        state.error = action.payload;
      }) // updating general snf ----------------------------------------->
      .addCase(updateGeneralSnf.pending, (state) => {
        state.upstatus = "loading";
      })
      .addCase(updateGeneralSnf.fulfilled, (state) => {
        state.upstatus = "succeeded";
      })
      .addCase(updateGeneralSnf.rejected, (state, action) => {
        state.upstatus = "failed";
        state.error = action.payload;
      }) // updating snf diff -------------------------------------------------->
      .addCase(updateDiffSnf.pending, (state) => {
        state.liststatus = "loading";
      })
      .addCase(updateDiffSnf.fulfilled, (state, action) => {
        state.liststatus = "succeeded";
        state.drList = action.payload;
      })
      .addCase(updateDiffSnf.rejected, (state, action) => {
        state.liststatus = "failed";
        state.error = action.payload;
      }) // convert kg to liters or liters to kg -------------------------------------------------->
      .addCase(convertKgLiters.pending, (state) => {
        state.liststatus = "loading";
      })
      .addCase(convertKgLiters.fulfilled, (state, action) => {
        state.liststatus = "succeeded";
        state.drList = action.payload;
      })
      .addCase(convertKgLiters.rejected, (state, action) => {
        state.liststatus = "failed";
        state.error = action.payload;
      });
  },
});
export default FatSnfSlice.reducer;
