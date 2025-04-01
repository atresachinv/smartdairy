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
export const fetchMaxCode = createAsyncThunk(
  "doctor/fetchMaxCode",
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
export const addDoctor = createAsyncThunk(
  "doctor/addDoctor",
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
export const updateDoctorDetails = createAsyncThunk(
  "doctor/updateDoctorDetails",
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
export const getDoctorList = createAsyncThunk(
  "doctor/getDoctorList",
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

const doctorSlice = createSlice({
  name: "doctor",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder // Max doctor code ------------------------------------------->
      .addCase(fetchMaxCode.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchMaxCode.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.maxDrCode = action.payload;
      })
      .addCase(fetchMaxCode.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      }) //  create new doctor  ----------------------------------------->
      .addCase(addDoctor.pending, (state) => {
        state.crestatus = "loading";
      })
      .addCase(addDoctor.fulfilled, (state) => {
        state.crestatus = "succeeded";
      })
      .addCase(addDoctor.rejected, (state, action) => {
        state.crestatus = "failed";
        state.error = action.payload;
      }) // update doctor details ----------------------------------------->
      .addCase(updateDoctorDetails.pending, (state) => {
        state.upstatus = "loading";
      })
      .addCase(updateDoctorDetails.fulfilled, (state) => {
        state.upstatus = "succeeded";
      })
      .addCase(updateDoctorDetails.rejected, (state, action) => {
        state.upstatus = "failed";
        state.error = action.payload;
      }) // get doctor List-------------------------------------------------->
      .addCase(getDoctorList.pending, (state) => {
        state.liststatus = "loading";
      })
      .addCase(getDoctorList.fulfilled, (state, action) => {
        state.liststatus = "succeeded";
        state.drList = action.payload;
      })
      .addCase(getDoctorList.rejected, (state, action) => {
        state.liststatus = "failed";
        state.error = action.payload;
      });
  },
});
export default doctorSlice.reducer;
