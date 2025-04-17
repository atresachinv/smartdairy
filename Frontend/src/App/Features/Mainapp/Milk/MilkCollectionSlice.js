import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../../axiosInstance";

const initialState = {
  records: [],
  collectionReport: [],
  allMilkColl: [],
  allMilkCollector: [],
  mobileColl: [],
  mobileCollection: [], //update mobile milk collection
  completedColle: [], //completed milk collection
  PrevLiters: [], //Previous liters
  todaysMilk: [],
  regularCustomers: [], // regular customer for milk collection
  status: "idle",
  getRegstatus: "idle",
  milkstatus: "idle",
  allmilkstatus: "idle",
  allmilkcollstatus: "idle",
  compcollstatus: "idle",
  tmstatus: "idle",
  error: null,
};

export const saveMilkCollSetting = createAsyncThunk(
  "milkCollection/saveMilkCollSetting",
  async ({ fromDate, toDate }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/save/Milkcoll/settings", {
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

export const saveMilkCollection = createAsyncThunk(
  "milkCollection/saveMilkCollection",
  async ({ values }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/save/milk/collection", {
        values,
      });
      return response.data;
    } catch (error) {
      const errorMessage = error.response
        ? error.response.data
        : "Failed to store milk collection.";
      return rejectWithValue(errorMessage);
    }
  }
);

export const saveMilkOneEntry = createAsyncThunk(
  "milkCollection/saveMilkOneEntry",
  async (values, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/save/milk/one", values);
      return response.data; // Ensure response contains a message key
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to store milk collection.";
      return rejectWithValue({
        status: error.response?.status || 500,
        message: errorMessage,
      });
    }
  }
);

export const fetchTodaysMilk = createAsyncThunk(
  "milkCollection/fetchTodaysMilk",
  async ({ date }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/fetch/collection", {
        params: { date },
      });
      return response.data.todaysmilk;
    } catch (error) {
      const errorMessage = error.response
        ? error.response.data
        : "Failed to store milk collection.";
      return rejectWithValue(errorMessage);
    }
  }
);

//...............................................................................
//Mobile Milk Collection ........................................................
//...............................................................................

export const mobileMilkCollection = createAsyncThunk(
  "milkCollection/mobileMilkCollection",
  async (values, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        "/save/mobile/milkcollection",
        values
      );
      return response.data;
    } catch (error) {
      const errorMessage = error.response
        ? error.response.data
        : "Failed to store Mobile milk collection.";
      return rejectWithValue(errorMessage);
    }
  }
);

//Mobile Milk Collection Report
export const mobileMilkCollReport = createAsyncThunk(
  "milkCollection/mobileMilkCollReport",
  async ({ date }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/mobile/milkreport", {
        params: { date },
      });
      return response.data.mobileMilk;
    } catch (error) {
      const errorMessage = error.response
        ? error.response.data
        : "Failed to store Mobile milk collection.";
      return rejectWithValue(errorMessage);
    }
  }
);

//Mobile Milk Collection Previous Liters
export const mobilePrevLiters = createAsyncThunk(
  "milkCollection/mobilePrevLiters",
  async ({ date }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/mobile/prevliters", {
        params: { date },
      });
      return response.data.PrevLiters;
    } catch (error) {
      const errorMessage = error.response
        ? error.response.data
        : "Failed to fetch Previous Liters.";
      return rejectWithValue(errorMessage);
    }
  }
);

// fetch Mobile milk collection report
export const getMilkCollReport = createAsyncThunk(
  "milkCollection/getMilkCollReport",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/dairy/Milkcoll/report");
      return response.data;
    } catch (error) {
      const errorMessage = error.response
        ? error.response.data
        : "Failed to fetch milk reports.";
      return rejectWithValue(errorMessage);
    }
  }
);

// fetch mobile milk collection to update
export const fetchMobileColl = createAsyncThunk(
  "milkCollection/fetchMobileColl",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/fetch/mobile/collection");
      return response.data.mobileMilkcoll;
    } catch (error) {
      const errorMessage = error.response
        ? error.response.data
        : "Failed to fetch milk reports.";
      return rejectWithValue(errorMessage);
    }
  }
);

//  Update MObile Milk Collection
export const updateMobileColl = createAsyncThunk(
  "milkCollection/getMilkCollReport",
  async (values, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/update/mobile/coll", values);
      return response.data;
    } catch (error) {
      const errorMessage = error.response
        ? error.response.data
        : "Failed to fetch milk reports.";
      return rejectWithValue(errorMessage);
    }
  }
);

// dairy milk Collection report (fillter)
export const getAllMilkCollReport = createAsyncThunk(
  "milkCollection/getAllMilkCollReport",
  async ({ fromDate, toDate }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/milk/coll/report", {
        params: { fromDate, toDate },
      });
      return response.data.milkcollection;
    } catch (error) {
      const errorMessage = error.response
        ? error.response.data
        : "Failed to fetch milk reports.";
      return rejectWithValue(errorMessage);
    }
  }
);

//milk collector milk collection
export const getAllMilkSankalan = createAsyncThunk(
  "milkCollection/getAllMilkSankalan",
  async ({ fromDate, toDate }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/milk/sankalan", {
        params: { fromDate, toDate }, // Use the `params` key for query parameters
      });
      return response.data.milkCollectorcoll;
    } catch (error) {
      const errorMessage = error.response
        ? error.response.data
        : "Failed to fetch milk reports.";
      return rejectWithValue(errorMessage);
    }
  }
);

//Completed milk collection Report
export const completedMilkSankalan = createAsyncThunk(
  "milkCollection/completedMilkSankalan",
  async ({ date, time }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/completed/collection/report", {
        params: { date, time }, // Use the `params` key for query parameters
      });
      return response.data.compCollection;
    } catch (error) {
      const errorMessage = error.response
        ? error.response.data
        : "Failed to fetch milk reports.";
      return rejectWithValue(errorMessage);
    }
  }
);

//fetch regular customer list
export const getRegCustomers = createAsyncThunk(
  "milkCollection/getRegCustomers",
  async ({ collDate, ME }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/regular/customer/list", {
        params: { collDate, ME },
      });
      return response.data.regularCustomers;
    } catch (error) {
      const errorMessage = error.response
        ? error.response.data
        : "Failed to fetch milk reports.";
      return rejectWithValue(errorMessage);
    }
  }
);

const milkCollectionSlice = createSlice({
  name: "milkCollection",
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
      .addCase(saveMilkCollSetting.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(saveMilkCollSetting.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(saveMilkCollSetting.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(saveMilkCollection.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(saveMilkCollection.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(saveMilkCollection.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(saveMilkOneEntry.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(saveMilkOneEntry.fulfilled, (state, action) => {
        state.status = "succeeded";
      })
      .addCase(saveMilkOneEntry.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(mobileMilkCollection.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(mobileMilkCollection.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(mobileMilkCollection.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      }) // fetch mobile milk collection ------------------------------------------------------------->
      .addCase(fetchMobileColl.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchMobileColl.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.mobileCollection = action.payload;
      })
      .addCase(fetchMobileColl.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(updateMobileColl.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(updateMobileColl.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(updateMobileColl.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(mobileMilkCollReport.pending, (state) => {
        state.milkstatus = "loading";
        state.error = null;
      })
      .addCase(mobileMilkCollReport.fulfilled, (state, action) => {
        state.milkstatus = "succeeded";
        state.mobileColl = action.payload;
      })
      .addCase(mobileMilkCollReport.rejected, (state, action) => {
        state.milkstatus = "failed";
        state.error = action.payload;
      })
      .addCase(mobilePrevLiters.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(mobilePrevLiters.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.PrevLiters = action.payload;
      })
      .addCase(mobilePrevLiters.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(getAllMilkCollReport.pending, (state) => {
        state.allmilkstatus = "loading";
        state.error = null;
      })
      .addCase(getAllMilkCollReport.fulfilled, (state, action) => {
        state.allmilkstatus = "succeeded";
        state.allMilkColl = action.payload;
      })
      .addCase(getAllMilkCollReport.rejected, (state, action) => {
        state.allmilkstatus = "failed";
        state.error = action.payload;
      })
      .addCase(getAllMilkSankalan.pending, (state) => {
        state.allmilkcollstatus = "loading";
        state.error = null;
      })
      .addCase(getAllMilkSankalan.fulfilled, (state, action) => {
        state.allmilkcollstatus = "succeeded";
        state.allMilkCollector = action.payload;
      })
      .addCase(getAllMilkSankalan.rejected, (state, action) => {
        state.allmilkcollstatus = "failed";
        state.error = action.payload;
      })
      .addCase(fetchTodaysMilk.pending, (state) => {
        state.tmstatus = "loading";
        state.error = null;
      })
      .addCase(fetchTodaysMilk.fulfilled, (state, action) => {
        state.tmstatus = "succeeded";
        state.todaysMilk = action.payload;
      })
      .addCase(fetchTodaysMilk.rejected, (state, action) => {
        state.tmstatus = "failed";
        state.error = action.payload;
      })
      .addCase(completedMilkSankalan.pending, (state) => {
        state.compcollstatus = "loading";
        state.error = null;
      })
      .addCase(completedMilkSankalan.fulfilled, (state, action) => {
        state.compcollstatus = "succeeded";
        state.completedColle = action.payload;
      })
      .addCase(completedMilkSankalan.rejected, (state, action) => {
        state.compcollstatus = "failed";
        state.error = action.payload;
      }) // fetch regular customer list ------------------------------------------->
      .addCase(getRegCustomers.pending, (state) => {
        state.getRegstatus = "loading";
        state.error = null;
      })
      .addCase(getRegCustomers.fulfilled, (state, action) => {
        state.getRegstatus = "succeeded";
        state.regularCustomers = action.payload;
      })
      .addCase(getRegCustomers.rejected, (state, action) => {
        state.getRegstatus = "failed";
        state.error = action.payload;
      });
  },
});

export const { setEntries, addEntry } = milkCollectionSlice.actions;

export default milkCollectionSlice.reducer;
