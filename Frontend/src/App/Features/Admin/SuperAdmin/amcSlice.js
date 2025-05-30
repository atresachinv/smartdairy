import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../../axiosInstance";

const initialState = {
  onestatus: "idle",
  allstatus: "idle",
  error: null,
};

// Async thunk for fetching dairy info
export const updateAllAmc = createAsyncThunk(
  "access/updateAllAmc",
  async ({ access_name, access_desc }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/update/all-dairy/amc", {
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
export const updateDairyAmc = createAsyncThunk(
  "access/updateDairyAmc",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/update/one-dairy/amc");
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
    builder // update all dairy amc -------------------------------->
      .addCase(updateAllAmc.pending, (state) => {
        state.allstatus = "loading";
      })
      .addCase(updateAllAmc.fulfilled, (state) => {
        state.allstatus = "succeeded";
      })
      .addCase(updateAllAmc.rejected, (state, action) => {
        state.allstatus = "failed";
        state.error = action.payload;
      }) // update one dairy amc -------------------------------->
      .addCase(updateDairyAmc.pending, (state) => {
        state.onestatus = "loading";
      })
      .addCase(updateDairyAmc.fulfilled, (state, action) => {
        state.onestatus = "succeeded";
      })
      .addCase(updateDairyAmc.rejected, (state, action) => {
        state.onestatus = "failed";
        state.error = action.payload;
      });
  },
});

export default accessSlice.reducer;
