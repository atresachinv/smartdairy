import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../../axiosInstance";

const initialState = {
  records: [],
  collectionReport: [],
  allMilkColl: [],
  mobileColl: [],
  mobileCollection: [], //update mobile milk collection
  status: "idle",
  error: null,
};

export const saveMilkCollSetting = createAsyncThunk(
  "milkreport/saveMilkCollSetting",
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
  "milkreport/saveMilkCollection",
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
  "milkreport/saveMilkOneEntry",
  async (values, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/save/milk/one", values);
      return response.data;
    } catch (error) {
      const errorMessage = error.response
        ? error.response.data
        : "Failed to store milk collection.";
      return rejectWithValue(errorMessage);
    }
  }
);

//Mobile Milk Collection
export const mobileMilkCollection = createAsyncThunk(
  "milkreport/mobileMilkCollection",
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
  "milkreport/mobileMilkCollReport",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/mobile/milkreport");
      return response.data.mobileMilk;
    } catch (error) {
      const errorMessage = error.response
        ? error.response.data
        : "Failed to store Mobile milk collection.";
      return rejectWithValue(errorMessage);
    }
  }
);

// fetch Mobile milk collection report
export const getMilkCollReport = createAsyncThunk(
  "milkreport/getMilkCollReport",
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
  "milkreport/fetchMobileColl",
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
  "milkreport/getMilkCollReport",
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
  "milkreport/getAllMilkCollReport",
  async ({ fromDate, toDate }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/milk/coll/report", {
        params: { fromDate, toDate }, // Use the `params` key for query parameters
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
      .addCase(saveMilkOneEntry.fulfilled, (state) => {
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
      })
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
        state.status = "loading";
        state.error = null;
      })
      .addCase(mobileMilkCollReport.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.mobileColl = action.payload;
      })
      .addCase(mobileMilkCollReport.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(getAllMilkCollReport.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(getAllMilkCollReport.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.allMilkColl = action.payload;
      })
      .addCase(getAllMilkCollReport.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { setEntries, addEntry } = milkCollectionSlice.actions;

export const fetchEntries = () => (dispatch) => {
  const allEntries = JSON.parse(localStorage.getItem("milkentries")) || [];
  dispatch(setEntries(allEntries));
};

export default milkCollectionSlice.reducer;