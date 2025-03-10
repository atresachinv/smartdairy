import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../../axiosInstance";

const initialState = {
  customerlist: [],
  maxCustNo: "",
  usedRCNO: [],
  status: "idle",
  cliststatus: "idle",
  createstatus: "idle",
  updatestatus: "idle",
  excelstatus: "idle",
  error: null,
};

// get max customer no
export const getMaxCustNo = createAsyncThunk(
  "customer/getMaxCustNo",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/customer/maxcustno");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Create a new customer
export const createCustomer = createAsyncThunk(
  "customer/createCustomer",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/create/customer", formData);
      return response.data; // return the response data
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
// Create a new customer
export const updateCustomer = createAsyncThunk(
  "customer/updateCustomer",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/update/customer", formData);
      return response.data; // return the response data
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// List all customers
export const listCustomer = createAsyncThunk(
  "customer/listCustomer",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/customer/list");
      return response.data.customerList; // return the response data
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Retrive unique RatechartNo
export const fetchURCNo = createAsyncThunk(
  "customer/fetchURCNo",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/customer/used/ratechartno");
      return response.data; // return the response data
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Upload customer Excel to database
export const uploadCustomerExcel = createAsyncThunk(
  "customer/uploadCustomerExcel",
  async ({ excelData, prefix }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/upload/customer/excel", {
        excelData,
        prefix,
      });
      return response.data; // return the response data
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const custMasterSlice = createSlice({
  name: "customer",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder // Handle getMaxCustNo actions
      .addCase(getMaxCustNo.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getMaxCustNo.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.maxCustNo = action.payload.cust_no;
      })
      .addCase(getMaxCustNo.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })  // Handle createCustomer actions
      .addCase(createCustomer.pending, (state) => {
        state.createstatus = "loading";
      })
      .addCase(createCustomer.fulfilled, (state) => {
        state.createstatus = "succeeded";
      })
      .addCase(createCustomer.rejected, (state, action) => {
        state.createstatus = "failed";
        state.error = action.payload;
      })   // Handle update Customer actions
      .addCase(updateCustomer.pending, (state) => {
        state.updatestatus = "loading";
      })
      .addCase(updateCustomer.fulfilled, (state) => {
        state.updatestatus = "succeeded";
      })
      .addCase(updateCustomer.rejected, (state, action) => {
        state.updatestatus = "failed";
        state.error = action.payload;
      }) // Handle listCustomer actions
      .addCase(listCustomer.pending, (state) => {
        state.cliststatus = "loading";
      })
      .addCase(listCustomer.fulfilled, (state, action) => {
        state.cliststatus = "succeeded";
        state.customerlist = action.payload; // Replace the customer list with the fetched data
      })
      .addCase(listCustomer.rejected, (state, action) => {
        state.cliststatus = "failed";
        state.error = action.payload;
      })
      .addCase(fetchURCNo.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchURCNo.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.usedRCNO = action.payload;
      })
      .addCase(fetchURCNo.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(uploadCustomerExcel.pending, (state) => {
        state.excelstatus = "loading";
      })
      .addCase(uploadCustomerExcel.fulfilled, (state) => {
        state.excelstatus = "succeeded";
      })
      .addCase(uploadCustomerExcel.rejected, (state, action) => {
        state.excelstatus = "failed";
        state.error = action.payload;
      });
  },
});

export default custMasterSlice.reducer;
