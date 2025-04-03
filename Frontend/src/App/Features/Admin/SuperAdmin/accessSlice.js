import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../../axiosInstance";

const initialState = {
  dairyData: {},
  dairyList: [],
  centerList: [],
  status: "idle",
  error: null,
};

// Async thunk for fetching dairy info
export const createAccess = createAsyncThunk(
  "access/createAccess",
  async ({ access_name, access_desc }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/add/new-access", {
        access_name,
        access_desc,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message || error.message);
    }
  }
);
// Async thunk for fetching dairy list
export const getDairyList = createAsyncThunk(
  "access/dairyList",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/sadmin/dairy-list");
      return response.data?.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message || error.message);
    }
  }
);
// Async thunk for fetching center list
export const getCenterList = createAsyncThunk(
  "access/centerList",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/sadmin/center-list");
      return response.data?.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message || error.message);
    }
  }
);

const accessSlice = createSlice({
  name: "access",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createAccess.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createAccess.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(createAccess.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(getDairyList.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getDairyList.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.dairyList = action.payload;
      })
      .addCase(getDairyList.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
        state.dairyList = [];
      })
      .addCase(getCenterList.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getCenterList.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.centerList = action.payload;
      })
      .addCase(getCenterList.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
        state.centerList = [];
      });
  },
});

export default accessSlice.reducer;
