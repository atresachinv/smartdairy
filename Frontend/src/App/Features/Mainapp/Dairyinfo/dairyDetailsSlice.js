import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../../axiosInstance";

// Initial state with separate status and error for each thunk
const initialState = {
  initialInfo: {},
  createStatus: "idle",
  updateStatus: "idle",
  fetchStatus: "idle",
  Error: null,
};

// Async Thunk to create dairy initial information ------------------------------>
export const createInitInfo = createAsyncThunk(
  "dairyinfo/createInitInfo",
  async ({ formData }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/dairy/create/init-info", {
        formData,
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

// Async Thunk to updat dairy initial information ------------------------------->
export const updateInitInfo = createAsyncThunk(
  "dairyinfo/updateInitInfo",
  async ({ formData }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put("/dairy/update/init-info", {
        formData,
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

// Async Thunk to fetch dairy initial information ------------------------------>
export const fetchInitInfo = createAsyncThunk(
  "dairyinfo/fetchInitInfo",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/dairy/fetch/init-info");
      return response.data.initialInfo;
    } catch (error) {
      const errorMessage = error.response
        ? error.response.data
        : "Failed to get dairy initial information!";
      return rejectWithValue(errorMessage);
    }
  }
);

// Creating the Slice
const milkCollectionSlice = createSlice({
  name: "milkCollection",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder // create dairy intial information ------------------------------>
      .addCase(createInitInfo.pending, (state) => {
        state.createStatus = "loading";
        state.Error = null;
      })
      .addCase(createInitInfo.fulfilled, (state) => {
        state.createStatus = "succeeded";
      })
      .addCase(createInitInfo.rejected, (state, action) => {
        state.createStatus = "failed";
        state.Error = action.payload;
      }) // update dairy initial informtion ---------------------------------->
      .addCase(updateInitInfo.pending, (state) => {
        state.updateStatus = "loading";
        state.Error = null;
      })
      .addCase(updateInitInfo.fulfilled, (state) => {
        state.updateStatus = "succeeded";
      })
      .addCase(updateInitInfo.rejected, (state, action) => {
        state.updateStatus = "failed";
        state.Error = action.payload;
      }) // fetch dairy initial information --------------------------------->
      .addCase(fetchInitInfo.pending, (state) => {
        state.fetchStatus = "loading";
        state.Error = null;
      })
      .addCase(fetchInitInfo.fulfilled, (state, action) => {
        state.fetchStatus = "succeeded";
        state.initialInfo = action.payload;
      })
      .addCase(fetchInitInfo.rejected, (state, action) => {
        state.fetchStatus = "failed";
        state.Error = action.payload;
      });
  },
});

export default milkCollectionSlice.reducer;
