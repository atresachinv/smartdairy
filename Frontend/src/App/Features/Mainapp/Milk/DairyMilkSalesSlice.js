import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../../axiosInstance";

const initialState = {
  centerMilkData: [],
  shiftMilkData: [],
  masterMilkData: [],
  status: "idle",
  addstatus: "idle",
  error: null,
};

export const getCenterMSales = createAsyncThunk(
  "milksales/getCenterMSales",
  async ({ date, centerid, collectedBy, shift }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/fetch/center/milkcoll", {
        params: {
          date,
          centerid,
          collectedBy,
          shift,
        },
      });
      return response.data.centerMilkColl;
    } catch (error) {
      const errorMessage = error.response
        ? error.response.data
        : "Failed to fetch milk record.";
      return rejectWithValue(errorMessage);
    }
  }
);

// Insert center milk collection --------------------------------->
export const createCenterMColl = createAsyncThunk(
  "milksales/createCenterMColl",
  async (values, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/center/milk/coll", {
        values,
      });
      return response.data;
    } catch (error) {
      const errorMessage = error.response
        ? error.response.data
        : "Failed to save center milk collection.";
      return rejectWithValue(errorMessage);
    }
  }
);

// fetch center milk collection for current shift ---------------------------->
export const getShiftCenterMilkcoll = createAsyncThunk(
  "milksales/getShiftCenterMilkcoll",
  async ({ fromDate, toDate }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/fetch/center/milkcoll", {
        fromDate,
        toDate,
      });
      return response.data;
    } catch (error) {
      const errorMessage = error.response
        ? error.response.data
        : "Failed to fetch milk reports.";
      return rejectWithValue(errorMessage);
    }
  }
);

// fetch center milk collection for master ---------------------------->
export const getMasterCenterMilkCOll = createAsyncThunk(
  "milksales/getMasterCenterMilkCOll",
  async ({ fromDate, toDate }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        "/fetch/center/coll/master/report",
        {
          params: {
            fromDate,
            toDate,
          },
        }
      );

      return response.data.centerMReport;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch milk reports.";
      return rejectWithValue(errorMessage);
    }
  }
);


// update center milk collection ------------------------------------>
export const updateCenterMilkColl = createAsyncThunk(
  "milksales/updateCenterMilkColl",
  async ({ id }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put("/fetch/center/milkcoll", {
        id,
      });
      return response.data;
    } catch (error) {
      const errorMessage = error.response
        ? error.response.data
        : "Failed to fetch milk reports.";
      return rejectWithValue(errorMessage);
    }
  }
);
// update isdeleted = 1 center milk collection ------------------------------------>
export const deleteCenterMilkColl = createAsyncThunk(
  "milksales/deleteCenterMilkColl",
  async ({ id }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put("/delete/center/milkcoll", {
        id,
      });
      return response.data;
    } catch (error) {
      const errorMessage = error.response
        ? error.response.data
        : "Failed to fetch milk reports.";
      return rejectWithValue(errorMessage);
    }
  }
);

const DairyMilkSalesSlice = createSlice({
  name: "milkSales",
  initialState,
  reducers: {
    setEntries: (state, action) => {
      state.entries = action.payload;
    },
    addEntry: (state, action) => {
      state.entries.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCenterMSales.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(getCenterMSales.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.centerMilkData = action.payload;
      })
      .addCase(getCenterMSales.rejected, (state, action) => {
        state.status = "failed";
        state.centerMilkColl = [];
        state.error = action.payload;
      }) // save center milk collection
      .addCase(createCenterMColl.pending, (state) => {
        state.addstatus = "loading";
        state.error = null;
      })
      .addCase(createCenterMColl.fulfilled, (state) => {
        state.addstatus = "succeeded";
      })
      .addCase(createCenterMColl.rejected, (state, action) => {
        state.addstatus = "failed";
        state.error = action.payload;
      }) // get milk collection of perticular shift
      .addCase(getShiftCenterMilkcoll.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(getShiftCenterMilkcoll.fulfilled, (state) => {
        state.status = "succeeded";
        state.shiftMilkData = action.payload;
      })
      .addCase(getShiftCenterMilkcoll.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      }) // get master milk collection
      .addCase(getMasterCenterMilkCOll.pending, (state) => {
        state.fetchstatus = "loading";
        state.error = null;
      })
      .addCase(getMasterCenterMilkCOll.fulfilled, (state, action) => {
        state.fetchstatus = "succeeded";
        state.masterMilkData = action.payload;
      })
      .addCase(getMasterCenterMilkCOll.rejected, (state, action) => {
        state.fetchstatus = "failed";
        state.error = action.payload;
      }) // update center milk collection
      .addCase(updateCenterMilkColl.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(updateCenterMilkColl.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(updateCenterMilkColl.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      }) // delete center milk collection
      .addCase(deleteCenterMilkColl.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(deleteCenterMilkColl.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(deleteCenterMilkColl.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default DairyMilkSalesSlice.reducer;
