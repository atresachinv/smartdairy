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

// create new doctor
export const updateGeneralFat = createAsyncThunk(
  "fatsnf/updateGeneralFat",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/doctor/maxcode");
      return response.data.maxDrCode;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// create new doctor
export const updateDiffFat = createAsyncThunk(
  "fatsnf/updateDiffFat",
  async ({ values }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/doctor/create", { values });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// update doctor details
export const updateGeneralSnf = createAsyncThunk(
  "fatsnf/updateGeneralSnf",
  async ({ values }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put("/doctor/update", { values });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Fetch doctor list
export const updateDiffSnf = createAsyncThunk(
  "fatsnf/updateDiffSnf",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/doctor/list");
      return response.data.drList;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Delete bank
// export const deleteDr = createAsyncThunk(
//   "doctor/deleteDr",
//   async ({ id }, { rejectWithValue }) => {
//     try {
//       const response = await axiosInstance.delete("/doctor/delete", {
//         params: { id },
//       });
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data || error.message);
//     }
//   }
// );

const FatSnfSlice = createSlice({
  name: "fatsnf",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder // Max doctor code ------------------------------------------->
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
      }) //  create new doctor  ----------------------------------------->
      .addCase(updateDiffFat.pending, (state) => {
        state.crestatus = "loading";
      })
      .addCase(updateDiffFat.fulfilled, (state) => {
        state.crestatus = "succeeded";
      })
      .addCase(updateDiffFat.rejected, (state, action) => {
        state.crestatus = "failed";
        state.error = action.payload;
      }) // update doctor details ----------------------------------------->
      .addCase(updateGeneralSnf.pending, (state) => {
        state.upstatus = "loading";
      })
      .addCase(updateGeneralSnf.fulfilled, (state) => {
        state.upstatus = "succeeded";
      })
      .addCase(updateGeneralSnf.rejected, (state, action) => {
        state.upstatus = "failed";
        state.error = action.payload;
      }) // get doctor List-------------------------------------------------->
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
      }) // get doctor List-------------------------------------------------->
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
      });
  },
});
export default FatSnfSlice.reducer;
