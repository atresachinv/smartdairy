import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../axiosInstance";

const initialState = {
  payment: {},
  status: "idle",
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

// Transfer Milk Customer To Customer ---------->
export const transferTOCustomer = createAsyncThunk(
  "payment/transferTOCustomer",
  async ({ fromDate, toDate }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch("/transfer/milk-to/customer", {
        fromDate,
        toDate,
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
  async ({ fromDate, toDate }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch("/transfer/milk-to/date", {
        fromDate,
        toDate,
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
  async ({ values }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put("/copy-milk", {
        values,
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

// Delete milk collection ------------------>
export const deleteCollection = createAsyncThunk(
  "payment/deleteCollection",
  async ({ values }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(
        "/milk/correction/delete-milk",
        {
          data: { values },
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
  async ({ values }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch("/transfer-milk/to-shift", {
        values,
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
      }) //------------------------------------------->
      .addCase(transferTOCustomer.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(transferTOCustomer.fulfilled, (state, action) => {
        state.status = "succeeded";
      })
      .addCase(transferTOCustomer.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      }) // transfer to date ------------------------------------------->
      .addCase(transferTODate.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(transferTODate.fulfilled, (state, action) => {
        state.status = "succeeded";
      })
      .addCase(transferTODate.rejected, (state, action) => {
        state.status = "failed";
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
