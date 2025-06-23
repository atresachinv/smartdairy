import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../../axiosInstance";

const initialState = {
  maxCode: "",
  tankersList: [],
  status: "idle",
  crestatus: "idle",
  upstatus: "idle",
  liststatus: "idle",
  delstatus: "idle",
  error: null,
};

// create new tanker
export const fetchMaxCode = createAsyncThunk(
  "tanker/fetchMaxCode",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/tanker/maxcode");
      return response.data.maxTankerCode;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
// create new tanker
export const createTanker = createAsyncThunk(
  "tanker/createTanker",
  async ({ values }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/tanker/create", { values });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// update tanker details
export const updateTankerDetails = createAsyncThunk(
  "tanker/updateTankerDetails",
  async ({ values }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put("/tanker/update", { values });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Fetch tanker list
export const getTankerList = createAsyncThunk(
  "tanker/getTankerList",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/tanker/list");
      return response.data.tankerList;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Delete tanker
export const deleteTanker = createAsyncThunk(
  "tanker/deleteTanker",
  async ({ id }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete("/tanker/delete", {
        params: { id },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const tankerSlice = createSlice({
  name: "tanker",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder // Max tanker code ------------------------------------------->
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
      }) //  create new tanker  ----------------------------------------->
      .addCase(createTanker.pending, (state) => {
        state.crestatus = "loading";
      })
      .addCase(createTanker.fulfilled, (state) => {
        state.crestatus = "succeeded";
      })
      .addCase(createTanker.rejected, (state, action) => {
        state.crestatus = "failed";
        state.error = action.payload;
      }) // update tanker details ----------------------------------------->
      .addCase(updateTankerDetails.pending, (state) => {
        state.upstatus = "loading";
      })
      .addCase(updateTankerDetails.fulfilled, (state) => {
        state.upstatus = "succeeded";
      })
      .addCase(updateTankerDetails.rejected, (state, action) => {
        state.upstatus = "failed";
        state.error = action.payload;
      }) // get tanker List-------------------------------------------------->
      .addCase(getTankerList.pending, (state) => {
        state.liststatus = "loading";
      })
      .addCase(getTankerList.fulfilled, (state, action) => {
        state.liststatus = "succeeded";
        state.tankersList = action.payload;
      })
      .addCase(getTankerList.rejected, (state, action) => {
        state.liststatus = "failed";
        state.error = action.payload;
      }) // Delete tanker -------------------------------------------------->
      .addCase(deleteTanker.pending, (state) => {
        state.delstatus = "loading";
      })
      .addCase(deleteTanker.fulfilled, (state) => {
        state.delstatus = "succeeded";
      })
      .addCase(deleteTanker.rejected, (state, action) => {
        state.delstatus = "failed";
        state.error = action.payload;
      });
  },
});
export default tankerSlice.reducer;
