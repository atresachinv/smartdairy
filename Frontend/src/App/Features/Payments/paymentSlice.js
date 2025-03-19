import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../axiosInstance";

const initialState = {
  payment: {},
  customerMilkData: [],
  transferedMilkData: [],
  status: "idle",
  getMilkstatus: "idle",
  transferedMilkstatus: "idle",
  transtodatestatus: "idle",
  copyCollstatus: "idle",
  deleteCollstatus: "idle",
  transferCollshiftstatus: "idle",
  error: null,
};

// Retriving Payments Data
export const getPaymentInfo = createAsyncThunk(
  "payment/getPaymentInfo",
  async ({ fromDate, toDate }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/payment-info", {
        fromDate,
        toDate,
      });
      return response.data;
    } catch (error) {
      const errorMessage = error.response
        ? error.response.data
        : "Failed to fetch payment information.";
      return rejectWithValue(errorMessage);
    }
  }
);

// Transfer Milk Morning TO Evening ------------>
export const updateMilkData = createAsyncThunk(
  "payment/updateMilkData",
  async ({ data }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch("/update/milk-data", {
        data,
      });
      return response.data;
    } catch (error) {
      const errorMessage = error.response
        ? error.response.data
        : "Failed to update milk records!.";
      return rejectWithValue(errorMessage);
    }
  }
);

// Transfer Milk Morning TO Evening ------------>
export const transferTOEvening = createAsyncThunk(
  "payment/transferTOEvening",
  async ({ records }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(
        "/transfer/milk-time/evening",
        {
          records,
        }
      );
      return response.data;
    } catch (error) {
      const errorMessage = error.response
        ? error.response.data
        : "Failed to update milk records!.";
      return rejectWithValue(errorMessage);
    }
  }
);

// Transfer Milk Evenning TO Morning ----------->
export const transferTOMorning = createAsyncThunk(
  "payment/transferTOMorning",
  async ({ records }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(
        "/transfer/milk-time/morning",
        {
          records,
        }
      );
      return response.data;
    } catch (error) {
      const errorMessage = error.response
        ? error.response.data
        : "Failed to update milk records!.";
      return rejectWithValue(errorMessage);
    }
  }
);

// Milk data to Transfer Customer To Customer ---------->
export const getMilkToTransfer = createAsyncThunk(
  "payment/getMilkToTransfer",
  async ({ code, fromDate, toDate }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        "/customer/milkdata/to-transfer",
        {
          params: {
            code,
            fromDate,
            toDate,
          },
        }
      );
      return response.data.customerMilkData;
    } catch (error) {
      const errorMessage = error.response
        ? error.response.data
        : "Failed to update milk records!.";
      return rejectWithValue(errorMessage);
    }
  }
);

// Milk data to Transfer Customer To Customer ---------->
export const getTransferedMilk = createAsyncThunk(
  "payment/getTransferedMilk",
  async ({ code, fromDate, toDate }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        "/customer/transfered/milkdata",
        {
          params: {
            code,
            fromDate,
            toDate,
          },
        }
      );
      return response.data.customerMilkData;
    } catch (error) {
      const errorMessage = error.response
        ? error.response.data
        : "Failed to update milk records!.";
      return rejectWithValue(errorMessage);
    }
  }
);

// Transfer Milk Customer To Customer ---------->
export const transferTOCustomer = createAsyncThunk(
  "payment/transferTOCustomer",
  async (
    { ucode, ucname, uacccode, fromDate, toDate, records },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.patch("/transfer/milk-to/customer", {
        ucode,
        ucname,
        uacccode,
        fromDate,
        toDate,
        records,
      });
      return response.data;
    } catch (error) {
      const errorMessage = error.response
        ? error.response.data
        : "Failed to update milk records!.";
      return rejectWithValue(errorMessage);
    }
  }
);

// Transfer Milk Date To Date ------------------>
export const transferTODate = createAsyncThunk(
  "payment/transferTODate",
  async ({ date, updatedate, fromCode, toCode }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch("/transfer/milk-to/date", {
        date,
        updatedate,
        fromCode,
        toCode,
      });
      return response.data;
    } catch (error) {
      const errorMessage = error.response
        ? error.response.data
        : "Failed to update milk records!.";
      return rejectWithValue(errorMessage);
    }
  }
);

// Delete Selected Milk Record ----------------->
export const deleteMilkRecord = createAsyncThunk(
  "payment/deleteMilkRecord",
  async ({ records }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete("/delete/milk-record", {
        data: { records },
      });
      return response.data;
    } catch (error) {
      const errorMessage = error.response
        ? error.response.data
        : "Failed to delete milk record!.";
      return rejectWithValue(errorMessage);
    }
  }
);

// Copy milk collection ------------------>
export const copyCollection = createAsyncThunk(
  "payment/copyCollection",
  async (
    { currentdate, updatedate, fromCode, toCode, time, updatetime },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.put("/milk/copy-paste", {
        currentdate,
        updatedate,
        fromCode,
        toCode,
        time,
        updatetime,
      });
      return response.data;
    } catch (error) {
      const errorMessage = error.response
        ? error.response.data
        : "Failed to copy paste milk records!.";
      return rejectWithValue(errorMessage);
    }
  }
);

// Delete milk collection ------------------>
export const deleteCollection = createAsyncThunk(
  "payment/deleteCollection",
  async (values, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(
        "/milk/correction/delete-milk",
        {
          data: values,
        }
      );
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to delete milk records.";
      return rejectWithValue(errorMessage);
    }
  }
);

export const transferToShift = createAsyncThunk(
  "payment/transferToShift",
  async (
    { currentdate, updatedate, fromCode, toCode, time, updatetime },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.patch("/transfer-milk/to-shift", {
        currentdate,
        updatedate,
        fromCode,
        toCode,
        time,
        updatetime,
      });
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to delete milk records.";
      return rejectWithValue(errorMessage);
    }
  }
);

const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {
    reset: () => initialState, // Add reset action to return the initial state
  },
  extraReducers: (builder) => {
    builder
      .addCase(getPaymentInfo.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(getPaymentInfo.fulfilled, (state, action) => {
        state.loading = false;
        state.status = "succeeded";
        state.payment = action.payload.payment;
      })
      .addCase(getPaymentInfo.rejected, (state, action) => {
        state.loading = false;
        state.status = "failed";
        state.error = action.payload;
      }) // Update milk one record ------------------------------------------->
      .addCase(updateMilkData.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(updateMilkData.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(updateMilkData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      }) // Transfer to evening ------------------------------------------->
      .addCase(transferTOEvening.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(transferTOEvening.fulfilled, (state, action) => {
        state.status = "succeeded";
      })
      .addCase(transferTOEvening.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      }) // Transfer to morning ------------------------------------------->
      .addCase(transferTOMorning.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(transferTOMorning.fulfilled, (state, action) => {
        state.status = "succeeded";
      })
      .addCase(transferTOMorning.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      }) //get milkdata transfer ----------------------------------------->
      .addCase(getMilkToTransfer.pending, (state) => {
        state.getMilkstatus = "loading";
        state.error = null;
      })
      .addCase(getMilkToTransfer.fulfilled, (state, action) => {
        state.getMilkstatus = "succeeded";
        state.customerMilkData = action.payload;
      })
      .addCase(getMilkToTransfer.rejected, (state, action) => {
        state.getMilkstatus = "failed";
        state.error = action.payload;
      }) //get transfered milkdata----------------------------------------->
      .addCase(getTransferedMilk.pending, (state) => {
        state.transferedMilkstatus = "loading";
        state.error = null;
      })
      .addCase(getTransferedMilk.fulfilled, (state, action) => {
        state.transferedMilkstatus = "succeeded";
        state.transferedMilkData = action.payload;
      })
      .addCase(getTransferedMilk.rejected, (state, action) => {
        state.transferedMilkstatus = "failed";
        state.error = action.payload;
      }) //transfer to customer ------------------------------------------>
      .addCase(transferTOCustomer.pending, (state) => {
        state.transtatus = "loading";
        state.error = null;
      })
      .addCase(transferTOCustomer.fulfilled, (state) => {
        state.transtatus = "succeeded";
      })
      .addCase(transferTOCustomer.rejected, (state, action) => {
        state.transtatus = "failed";
        state.error = action.payload;
      }) // transfer to date ------------------------------------------->
      .addCase(transferTODate.pending, (state) => {
        state.transtodatestatus = "loading";
        state.error = null;
      })
      .addCase(transferTODate.fulfilled, (state, action) => {
        state.transtodatestatus = "succeeded";
      })
      .addCase(transferTODate.rejected, (state, action) => {
        state.transtodatestatus = "failed";
        state.error = action.payload;
      }) // delete milk record ------------------------------------------->
      .addCase(deleteMilkRecord.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(deleteMilkRecord.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(deleteMilkRecord.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      }) // transfer milk collection to shift ------------------------------------------->
      .addCase(transferToShift.pending, (state) => {
        state.transferCollshiftstatus = "loading";
        state.error = null;
      })
      .addCase(transferToShift.fulfilled, (state) => {
        state.transferCollshiftstatus = "succeeded";
      })
      .addCase(transferToShift.rejected, (state, action) => {
        state.transferCollshiftstatus = "failed";
        state.error = action.payload;
      }) // copy milk collection  ------------------------------------------->
      .addCase(copyCollection.pending, (state) => {
        state.copyCollstatus = "loading";
        state.error = null;
      })
      .addCase(copyCollection.fulfilled, (state) => {
        state.copyCollstatus = "succeeded";
      })
      .addCase(copyCollection.rejected, (state, action) => {
        state.copyCollstatus = "failed";
        state.error = action.payload;
      }) //delete milk collection ------------------------------------------->
      .addCase(deleteCollection.pending, (state) => {
        state.deleteCollstatus = "loading";
        state.error = null;
      })
      .addCase(deleteCollection.fulfilled, (state) => {
        state.deleteCollstatus = "succeeded";
      })
      .addCase(deleteCollection.rejected, (state, action) => {
        state.deleteCollstatus = "failed";
        state.error = action.payload;
      });
  },
});

export const { reset: resetPayment } = paymentSlice.actions; // Export the reset action
export default paymentSlice.reducer;
