import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../../axiosInstance";

const initialState = {
  mledgerlist: [],
  sledgerlist: [],
  maxcodeml: "",
  maxcodesl: "",
  maxcodeStatus: "idle",
  cmlStatus: "idle",
  listmlStatus: "idle",
  Status: "idle",
  cslStatus: "idle",
  updatecslStatus: "idle",
  listcslStatus: "idle",
  delcslStatus: "idle",
  error: null,
};

// get max main ledger code
export const getMaxMLCode = createAsyncThunk(
  "ledgers/getMaxMLCode",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/main/ledger/maxcode");
      return response.data.maxMainGLCode;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Create new main ledger
export const createMainLedger = createAsyncThunk(
  "ledgers/createMainLedger",
  async (
    { date, code, eng_name, marathi_name, category },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.post("/create/main/ledger", {
        date,
        code,
        eng_name,
        marathi_name,
        category,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// list main ledger
export const listMainLedger = createAsyncThunk(
  "ledgers/listMainLedger",
  async (code, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/list/main/ledger", code);
      return response.data.mainGLedger;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// get max sub gl code
export const getMaxSLCode = createAsyncThunk(
  "ledgers/getMaxSLCode",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/sub/ledger/maxcode");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// create new sub ledger
export const createSubLedger = createAsyncThunk(
  "ledgers/createSubLedger",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/create/sub/ledger", formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Update sub ledger details
export const updateSubLedger = createAsyncThunk(
  "ledgers/updateSubLedger",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/update/sub/ledger", formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// list sub ledgers
export const listSubLedger = createAsyncThunk(
  "ledgers/listSubLedger",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/list/sub/ledger", formData);
      return response.data.subLedgerList;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// delete sub ledger
export const deleteSubLedger = createAsyncThunk(
  "ledgers/deleteSubLedger",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/delete/sub/ledger", formData);
      return response.data.empList;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const ledgerSlice = createSlice({
  name: "ledgers",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder // get max main ledger code---------------------------------------->
      .addCase(getMaxMLCode.pending, (state) => {
        state.maxcodeStatus = "loading";
      })
      .addCase(getMaxMLCode.fulfilled, (state, action) => {
        state.maxcodeStatus = "succeeded";
        state.maxcodeml = action.payload;
      })
      .addCase(getMaxMLCode.rejected, (state, action) => {
        state.maxcodeStatus = "failed";
        state.error = action.payload;
      }) // list of main ledger ------------------------------------------>
      .addCase(createMainLedger.pending, (state) => {
        state.cmlStatus = "loading";
      })
      .addCase(createMainLedger.fulfilled, (state, action) => {
        state.cmlStatus = "succeeded";
        state.mledgerlist.push(action.payload);
      })
      .addCase(createMainLedger.rejected, (state, action) => {
        state.cmlStatus = "failed";
        state.error = action.payload;
      }) // list of main ledger ------------------------------------------>
      .addCase(listMainLedger.pending, (state) => {
        state.listmlStatus = "loading";
      })
      .addCase(listMainLedger.fulfilled, (state, action) => {
        state.listmlStatus = "succeeded";
        state.mledgerlist = action.payload;
      })
      .addCase(listMainLedger.rejected, (state, action) => {
        state.listmlStatus = "failed";
        state.error = action.payload;
      }) // get max sub ledger code -------------------------------------->
      .addCase(getMaxSLCode.pending, (state) => {
        state.Status = "loading";
      })
      .addCase(getMaxSLCode.fulfilled, (state, action) => {
        state.Status = "succeeded";
        state.maxcodesl = action.payload;
      })
      .addCase(getMaxSLCode.rejected, (state, action) => {
        state.Status = "failed";
        state.error = action.payload;
      }) // create sub ledger -------------------------------------------->
      .addCase(createSubLedger.pending, (state) => {
        state.cslStatus = "loading";
      })
      .addCase(createSubLedger.fulfilled, (state, action) => {
        state.cslStatus = "succeeded";
      })
      .addCase(createSubLedger.rejected, (state, action) => {
        state.cslStatus = "failed";
        state.error = action.payload;
      }) // update sub ledger -------------------------------------------->
      .addCase(updateSubLedger.pending, (state) => {
        state.updatecslStatus = "loading";
      })
      .addCase(updateSubLedger.fulfilled, (state) => {
        state.updatecslStatus = "succeeded";
      })
      .addCase(updateSubLedger.rejected, (state, action) => {
        state.updatecslStatus = "failed";
        state.error = action.payload;
      }) // list all sub ledgers ---------------------------------------->
      .addCase(listSubLedger.pending, (state) => {
        state.listcslStatus = "loading";
      })
      .addCase(listSubLedger.fulfilled, (state, action) => {
        state.listcslStatus = "succeeded";
        state.sledgerlist = action.payload;
      })
      .addCase(listSubLedger.rejected, (state, action) => {
        state.listcslStatus = "failed";
        state.error = action.payload;
      }) // delete sub ledger ------------------------------------------->
      .addCase(deleteSubLedger.pending, (state) => {
        state.delcslStatus = "loading";
      })
      .addCase(deleteSubLedger.fulfilled, (state) => {
        state.delcslStatus = "succeeded";
      })
      .addCase(deleteSubLedger.rejected, (state, action) => {
        state.delcslStatus = "failed";
        state.error = action.payload;
      });
  },
});

export default ledgerSlice.reducer;
