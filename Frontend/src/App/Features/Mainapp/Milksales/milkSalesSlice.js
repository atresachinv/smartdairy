import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../../axiosInstance";

const initialState = {
  records: [],
  centerrecords: [],
  customers: [],
  dairyMilk: [],
  createCuststatus: "idle",
  savestatus: "idle",
  custstatus: "idle",
  getsalestatus: "idle",
  centersalestatus: "idle",
  dairyMilkstatus: "idle",
  error: null,
};

export const createRetailCustomer = createAsyncThunk(
  "milkSales/createRetailCustomer",
  async (values, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        "/create/retail-customer",
        values
      );
      return response.data;
    } catch (error) {
      const errorMessage = error.response
        ? error.response.data
        : "Failed to store milk collection.";
      return rejectWithValue(errorMessage);
    }
  }
);

export const saveMilkEntry = createAsyncThunk(
  "milkSales/saveMilkEntry",
  async (values, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        "/retail/save/collection",
        values
      );
      return response.data;
    } catch (error) {
      const errorMessage = error.response
        ? error.response.data
        : "Failed to store milk collection.";
      return rejectWithValue(errorMessage);
    }
  }
);

export const getRetailMilkReport = createAsyncThunk(
  "milkSales/getRetailMilkReport",
  async (values, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/retail/sale-report", {
        params: values,
      });
      return response.data.retailSales;
    } catch (error) {
      const errorMessage = error.response
        ? error.response.data
        : "Failed to store milk collection.";
      return rejectWithValue(errorMessage);
    }
  }
);

export const getCenterMilkReport = createAsyncThunk(
  "milkSales/getCenterMilkReport",
  async (values, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/retail/center/sale-report", {
        params: values,
      });
      return response.data.retailCenterSales;
    } catch (error) {
      const errorMessage = error.response
        ? error.response.data
        : "Failed to store milk collection.";
      return rejectWithValue(errorMessage);
    }
  }
);

export const getretailCustomer = createAsyncThunk(
  "milkSales/getretailCustomer",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/get/retail-customer");
      return response.data.retailcust;
    } catch (error) {
      const errorMessage = error.response
        ? error.response.data
        : "Failed to get retail customers.";
      return rejectWithValue(errorMessage);
    }
  }
);

// fetch dairy collection  -------------------->
export const getDairyCollection = createAsyncThunk(
  "milkSales/getDairyCollection",
  async ({ fromDate, toDate }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/fetch/dairy/master/coll", {
        params: { fromDate, toDate },
      });
      return response.data.dairyMilk;
    } catch (error) {
      const errorMessage = error.response
        ? error.response.data
        : "Failed to get retail customers.";
      return rejectWithValue(errorMessage);
    }
  }
);

const milkSalesSlice = createSlice({
  name: "milkSales",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder //create retail customer -------------------------------------------------------------------------------->
      .addCase(createRetailCustomer.pending, (state) => {
        state.createCuststatus = "loading";
        state.error = null;
      })
      .addCase(createRetailCustomer.fulfilled, (state) => {
        state.createCuststatus = "succeeded";
      })
      .addCase(createRetailCustomer.rejected, (state, action) => {
        state.createCuststatus = "failed";
        state.error = action.payload;
      }) //save retails milksales entry -------------------------------------------------------------------------------->
      .addCase(saveMilkEntry.pending, (state) => {
        state.savestatus = "loading";
        state.error = null;
      })
      .addCase(saveMilkEntry.fulfilled, (state) => {
        state.savestatus = "succeeded";
      })
      .addCase(saveMilkEntry.rejected, (state, action) => {
        state.savestatus = "failed";
        state.error = action.payload;
      }) //get retails mmilk sale records ------------------------------------------------------------------------------>
      .addCase(getRetailMilkReport.pending, (state) => {
        state.getsalestatus = "loading";
        state.error = null;
      })
      .addCase(getRetailMilkReport.fulfilled, (state, action) => {
        state.getsalestatus = "succeeded";
        state.records = action.payload;
      })
      .addCase(getRetailMilkReport.rejected, (state, action) => {
        state.getsalestatus = "failed";
        state.error = action.payload;
      }) // get center wise retail milk sale report --------------------------------------------------------------------->
      .addCase(getCenterMilkReport.pending, (state) => {
        state.centersalestatus = "loading";
        state.error = null;
      })
      .addCase(getCenterMilkReport.fulfilled, (state, action) => {
        state.centersalestatus = "succeeded";
        state.centerrecords = action.payload;
      })
      .addCase(getCenterMilkReport.rejected, (state, action) => {
        state.centersalestatus = "failed";
        state.error = action.payload;
      }) // get retail customers ---------------------------------------------------------------------------------------->
      .addCase(getretailCustomer.pending, (state) => {
        state.custstatus = "loading";
        state.error = null;
      })
      .addCase(getretailCustomer.fulfilled, (state, action) => {
        state.custstatus = "succeeded";
        state.customers = action.payload;
      })
      .addCase(getretailCustomer.rejected, (state, action) => {
        state.custstatus = "failed";
        state.error = action.payload;
      }) // get dairy collection ---------------------------------------------------------------------------------------->
      .addCase(getDairyCollection.pending, (state) => {
        state.dairyMilkstatus = "loading";
        state.error = null;
      })
      .addCase(getDairyCollection.fulfilled, (state, action) => {
        state.dairyMilkstatus = "succeeded";
        state.dairyMilk = action.payload;
      })
      .addCase(getDairyCollection.rejected, (state, action) => {
        state.dairyMilkstatus = "failed";
        state.error = action.payload;
      });
  },
});

export default milkSalesSlice.reducer;
