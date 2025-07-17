import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../axiosInstance";

const initialState = {
  payment: {},
  paymentData: [],
  payZeroData: [],
  paymentDetails: [],
  customerMilkData: [],
  transferedMilkData: [],
  lastMamt: [],
  trnDeductions: [],
  paymasters: [],
  paySummary: [], // payment summary data
  psstatus: "idle",
  status: "idle",
  lockPaytstatus: "idle",
  delOnestatus: "idle",
  delAllstatus: "idle",
  pmaststatus: "idle",
  upaystatus: "idle",
  lastMamtstatus: "idle",
  trnstatus: "idle",
  transtatus: "idle",
  ckeckPaystatus: "idle",
  pzerostatus: "idle",
  paystatus: "idle",
  fpaystatus: "idle",
  savepaystatus: "idle", //save fix dedu m pay
  savededstatus: "idle", //save other dedu m pay
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

// everleap data ------------------------------------------------->
// Retriving Payments Data
export const getPaymentsInfo = createAsyncThunk(
  "payment/getPaymentsInfo",
  async ({ fromDate, toDate }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/payments-info", {
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
//--------------------------------------------------------------------------------->
// generate payment --------------------------------------------------------------->
//--------------------------------------------------------------------------------->

//get total milk payment amt------------------------------------------------------->
export const checkPayExists = createAsyncThunk(
  "payment/checkPayExists",
  async ({ fromDate, toDate, center_id }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/check/payment/exists", {
        params: {
          fromDate,
          toDate,
          center_id,
        },
      });
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to check payment exits.";
      return rejectWithValue(errorMessage);
    }
  }
);

//get total milk payment amt------------------------------------------------------->
export const checkAmtZero = createAsyncThunk(
  "payment/checkAmtZero",
  async ({ fromDate, toDate, center_id }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/check/amt-zero", {
        params: {
          fromDate,
          toDate,
          center_id,
        },
      });
      if (response.status === 204) {
        return { status: 204, paymentZero: [] }; // Ensure a proper response structure
      }
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to check amt zero.";
      return rejectWithValue(errorMessage);
    }
  }
);

//get total milk payment amt------------------------------------------------------->

export const fetchMilkPaydata = createAsyncThunk(
  "payment/fetchMilkPaydata",
  async ({ fromDate, toDate, center_id }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/get/total/payment-amt", {
        params: {
          fromDate,
          toDate,
          center_id,
        },
      });
      return response.data.paymentData;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch payment data.";
      return rejectWithValue(errorMessage);
    }
  }
);

//get trn deduction amt------------------------------------------------------------>

export const fetchTrnDeductions = createAsyncThunk(
  "payment/fetchTrnDeductions",
  async ({ fromDate, toDate, GlCodes, center_id }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/fetch/trn/deductions", {
        params: {
          fromDate,
          toDate,
          GlCodes,
          center_id,
        },
      });
      return response.data.trnDeductions;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch payment data.";
      return rejectWithValue(errorMessage);
    }
  }
);
//get last mamt amt------------------------------------------------------------->

export const fetchLastMAMT = createAsyncThunk(
  "payment/fetchLastMAMT",
  async ({ toDate, GlCodes }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/fetch/payment/mamt", {
        params: {
          toDate,
          GlCodes,
        },
      });
      return response.data.trnLRemaings;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch payment data.";
      return rejectWithValue(errorMessage);
    }
  }
);

//save milk payment Fix deductions and other deductions --------------------------->

export const saveMilkPaydata = createAsyncThunk(
  "payment/saveMilkPaydata",
  async ({ formData, PaymentFD }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/save/milk/payment", {
        formData,
        PaymentFD,
      });
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to save milk payment details.";
      return rejectWithValue(errorMessage);
    }
  }
);

//save milk payment Other deductions and other deductions ------------------------->

export const saveOtherDeductions = createAsyncThunk(
  "payment/saveOtherDeductions",
  async ({ formData, PaymentFD }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/save/other/deductions", {
        formData,
        PaymentFD,
      });
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to save milk payment details.";
      return rejectWithValue(errorMessage);
    }
  }
);

//update milk payment deduction and main payment ---------------------------------->

export const updatePayInfo = createAsyncThunk(
  "payment/updatePayInfo",
  async ({ formData, PaymentFD }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put("/update/payment/deductions", {
        formData,
        PaymentFD,
      });
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to update payment details.";
      return rejectWithValue(errorMessage);
    }
  }
);

//lock milk payment ------------------------------------------------------------>

export const lockMilkPaydata = createAsyncThunk(
  "payment/lockMilkPaydata",
  async ({ updates }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put("/update/payment/lock", {
        updates,
      });
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Failed to update payment lock status.";
      return rejectWithValue(errorMessage);
    }
  }
);

//Fetch selected milk payment ------------------------------------------------------------>

export const fetchPaymentDetails = createAsyncThunk(
  "payment/fetchPaymentDetails",
  async ({ fromdate, todate, center_id }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/fetch/payment", {
        params: {
          fromdate,
          todate,
          center_id,
        },
      });
      return response.data.paymentDetails;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to save milk payment details.";
      return rejectWithValue(errorMessage);
    }
  }
);
//Fetch selected milk payment ------------------------------------------------------------>

export const getPayMasters = createAsyncThunk(
  "payment/getPayMasters",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/fetch/payment/masters");
      return response.data.payMasters;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to save milk payment master!.";
      return rejectWithValue(errorMessage);
    }
  }
);

// Delete milk collection ------------------>
export const deleteSelectedBill = createAsyncThunk(
  "payment/deleteSelectedBill",
  async ({ BillNo }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete("/delete/selected/bill", {
        data: { BillNo },
      });
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to delete selected bills.";
      return rejectWithValue(errorMessage);
    }
  }
);

// Delete milk collection ------------------>
export const deleteAllPayment = createAsyncThunk(
  "payment/deleteAllPayment",
  async ({ FromDate, ToDate }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete("/delete/all/payment", {
        data: { FromDate, ToDate },
      });
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to delete all milk Payment!.";
      return rejectWithValue(errorMessage);
    }
  }
);

// Payment summary data ---------------------------------->
export const getPaymentSummary = createAsyncThunk(
  "payment/getPaymentSummary",
  async ({ FromDate, ToDate }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/payment/summary", {
        params: { FromDate, ToDate },
      });
      return response.data.paymentSummary;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to get payment summary!.";
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
      }) // everleap data ------------------------------------------->
      .addCase(getPaymentsInfo.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(getPaymentsInfo.fulfilled, (state, action) => {
        state.loading = false;
        state.status = "succeeded";
        state.payment = action.payload.payment;
      })
      .addCase(getPaymentsInfo.rejected, (state, action) => {
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
      }) //check payment is exist or not ------------------------------------------->
      .addCase(checkPayExists.pending, (state) => {
        state.ckeckPaystatus = "loading";
        state.error = null;
      })
      .addCase(checkPayExists.fulfilled, (state) => {
        state.ckeckPaystatus = "succeeded";
      })
      .addCase(checkPayExists.rejected, (state, action) => {
        state.ckeckPaystatus = "failed";
        state.error = action.payload;
      }) //check amount zero ------------------------------------------->
      .addCase(checkAmtZero.pending, (state) => {
        state.pzerostatus = "loading";
        state.error = null;
      })
      .addCase(checkAmtZero.fulfilled, (state, action) => {
        state.pzerostatus = "succeeded";
        state.payZeroData = action.payload.paymentZero;
      })
      .addCase(checkAmtZero.rejected, (state, action) => {
        state.pzerostatus = "failed";
        state.error = action.payload;
      }) //Save fix deductions of milk payment ------------------------------------------->
      .addCase(saveMilkPaydata.pending, (state) => {
        state.savepaystatus = "loading";
        state.error = null;
      })
      .addCase(saveMilkPaydata.fulfilled, (state) => {
        state.savepaystatus = "succeeded";
      })
      .addCase(saveMilkPaydata.rejected, (state, action) => {
        state.savepaystatus = "failed";
        state.error = action.payload;
      }) //Save other deductions of milk payment ------------------------------------------->
      .addCase(saveOtherDeductions.pending, (state) => {
        state.savededstatus = "loading";
        state.error = null;
      })
      .addCase(saveOtherDeductions.fulfilled, (state) => {
        state.savededstatus = "succeeded";
      })
      .addCase(saveOtherDeductions.rejected, (state, action) => {
        state.savededstatus = "failed";
        state.error = action.payload;
      }) //update milk payment details ------------------------------------------->
      .addCase(updatePayInfo.pending, (state) => {
        state.upaystatus = "loading";
        state.error = null;
      })
      .addCase(updatePayInfo.fulfilled, (state) => {
        state.upaystatus = "succeeded";
      })
      .addCase(updatePayInfo.rejected, (state, action) => {
        state.upaystatus = "failed";
        state.error = action.payload;
      }) //fetch trn deductions ------------------------------------------->
      .addCase(fetchTrnDeductions.pending, (state) => {
        state.trnstatus = "loading";
        state.error = null;
      })
      .addCase(fetchTrnDeductions.fulfilled, (state, action) => {
        state.trnstatus = "succeeded";
        state.trnDeductions = action.payload;
      })
      .addCase(fetchTrnDeductions.rejected, (state, action) => {
        state.trnstatus = "failed";
        state.error = action.payload;
      }) //fetch trn deductions ------------------------------------------->
      .addCase(fetchLastMAMT.pending, (state) => {
        state.lastMamtstatus = "loading";
        state.error = null;
      })
      .addCase(fetchLastMAMT.fulfilled, (state, action) => {
        state.lastMamtstatus = "succeeded";
        state.lastMamt = action.payload;
      })
      .addCase(fetchLastMAMT.rejected, (state, action) => {
        state.lastMamtstatus = "failed";
        state.error = action.payload;
      }) //get total milk payment ------------------------------------------->
      .addCase(fetchMilkPaydata.pending, (state) => {
        state.paystatus = "loading";
        state.error = null;
      })
      .addCase(fetchMilkPaydata.fulfilled, (state, action) => {
        state.paystatus = "succeeded";
        state.paymentData = action.payload;
      })
      .addCase(fetchMilkPaydata.rejected, (state, action) => {
        state.paystatus = "failed";
        state.error = action.payload;
      }) //get milk payment details ------------------------------------------->
      .addCase(fetchPaymentDetails.pending, (state) => {
        state.fpaystatus = "loading";
        state.error = null;
      })
      .addCase(fetchPaymentDetails.fulfilled, (state, action) => {
        state.fpaystatus = "succeeded";
        state.paymentDetails = action.payload;
      })
      .addCase(fetchPaymentDetails.rejected, (state, action) => {
        state.fpaystatus = "failed";
        state.error = action.payload;
      }) // get payment masters ------------------------------------------------>
      .addCase(getPayMasters.pending, (state) => {
        state.pmaststatus = "loading";
        state.error = null;
      })
      .addCase(getPayMasters.fulfilled, (state, action) => {
        state.pmaststatus = "succeeded";
        state.paymasters = action.payload;
      })
      .addCase(getPayMasters.rejected, (state, action) => {
        state.pmaststatus = "failed";
        state.error = action.payload;
      }) // Lock Perticular payment masters ------------------------------------------------>
      .addCase(lockMilkPaydata.pending, (state) => {
        state.lockPaytstatus = "loading";
        state.error = null;
      })
      .addCase(lockMilkPaydata.fulfilled, (state, action) => {
        state.lockPaytstatus = "succeeded";
        state.paymasters = action.payload;
      })
      .addCase(lockMilkPaydata.rejected, (state, action) => {
        state.lockPaytstatus = "failed";
        state.error = action.payload;
      }) // delete selected payment ------------------------------------------------>
      .addCase(deleteSelectedBill.pending, (state) => {
        state.delOnestatus = "loading";
        state.error = null;
      })
      .addCase(deleteSelectedBill.fulfilled, (state) => {
        state.delOnestatus = "succeeded";
      })
      .addCase(deleteSelectedBill.rejected, (state, action) => {
        state.delOnestatus = "failed";
        state.error = action.payload;
      }) // delete all payment ------------------------------------------------>
      .addCase(deleteAllPayment.pending, (state) => {
        state.delAllstatus = "loading";
        state.error = null;
      })
      .addCase(deleteAllPayment.fulfilled, (state) => {
        state.delAllstatus = "succeeded";
      })
      .addCase(deleteAllPayment.rejected, (state, action) => {
        state.delAllstatus = "failed";
        state.error = action.payload;
      }) // get payment summary ------------------------------------------------>
      .addCase(getPaymentSummary.pending, (state) => {
        state.psstatus = "loading";
        state.error = null;
      })
      .addCase(getPaymentSummary.fulfilled, (state, action) => {
        state.psstatus = "succeeded";
        state.paySummary = action.payload;
      })
      .addCase(getPaymentSummary.rejected, (state, action) => {
        state.psstatus = "failed";
        state.error = action.payload;
      });
  },
});

export const { reset: resetPayment } = paymentSlice.actions; // Export the reset action
export default paymentSlice.reducer;
