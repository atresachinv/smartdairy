import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../../axiosInstance";

const initialState = {
  ratechartList: [],
  rateChart: [], //used for milk collection
  RCTypeList: [], //ratechart type list
  selectedRateChart: [], // selected for operations
  maxRcCode: "",
  maxRcType: "",
  excelRatechart: [],
  latestrChart: [], // center milk collection ratechart
  status: "idle",
  AddRCstatus: "idle",
  RCTliststatus: "idle",
  updatestatus: "idle",
  savercstatus: "idle",
  deletercstatus: "idle",
  applyrcstatus: "idle",
  supdatedrcstatus: "idle",
  error: null,
  progress: 0,
};

//fetch current Number of ratechart
export const fetchMaxRcCode = createAsyncThunk(
  "ratechart/fetchMaxRcCode",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/ratechart/maxrccode");
      return response.data.maxRcCode; // Ensure this exists
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch maxRcCode.";
      return rejectWithValue(errorMessage);
    }
  }
);
//fetch max Number of ratechart type -------------------------------------------------->
export const fetchMaxRctype = createAsyncThunk(
  "ratechart/fetchMaxRctype",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/ratechart/maxrctype");
      return response.data.maxRcType;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch maxRcCode.";
      return rejectWithValue(errorMessage);
    }
  }
);

//add new ratechart type --------------------------------------------------------->
export const addRcType = createAsyncThunk(
  "ratechart/addRcType",
  async ({ rccode, rctype }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/ratechart/save/rc-type", {
        rccode,
        rctype,
      });
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Failed to save Ratechart information.";
      return rejectWithValue(errorMessage);
    }
  }
);

//List of ratechart types --------------------------------------------------------->
export const listRcType = createAsyncThunk(
  "ratechart/listRcType",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/ratechart/type-list");
      return response.data.ratechartTypes;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Failed to save Ratechart information.";
      return rejectWithValue(errorMessage);
    }
  }
);

//save new ratechart ------------------------------------------------------------->

// export const saveRateChart = createAsyncThunk(
//   "ratechart/saveRateChart",
//   async (
//     { rccode, rctype, rcdate, time, animal, ratechart },
//     { rejectWithValue, signal, dispatch }
//   ) => {
//     try {
//       const response = await axiosInstance.post(
//         "/upload/ratechart",
//         {
//           rccode,
//           rctype,
//           rcdate,
//           time,
//           animal,
//           ratechart,
//         },
//         {
//           headers: { "Content-Type": "application/json" },
//           onUploadProgress: (progressEvent) => {
//             const percentCompleted = Math.round(
//               (progressEvent.loaded * 100) / progressEvent.total
//             );
//             dispatch(updateProgress(percentCompleted));
//           },
//           signal, // Attach the signal for cancellation
//         }
//       );
//       return response.data;
//     } catch (error) {
//       const errorMessage =
//         error.response?.data?.message ||
//         "Failed to save Ratechart information.";
//       return rejectWithValue(errorMessage);
//     }
//   }
// );
export const saveRateChart = createAsyncThunk(
  "ratechart/saveRateChart",
  async (
    { rccode, rctype, rcdate, time, animal, ratechart },
    { rejectWithValue, signal }
  ) => {
    try {
      const response = await axiosInstance.post(
        "/upload/ratechart",
        {
          rccode,
          rctype,
          rcdate,
          time,
          animal,
          ratechart,
        },
        {
          headers: { "Content-Type": "application/json" },
          signal, // Attach the signal for cancellation
        }
      );

      // Ensure response contains success status
      if (response.status !== 200) {
        throw new Error(response.data.message || "Error saving Ratechart");
      }

      return response.data; // Return only valid data
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to save Ratechart information.";
      return rejectWithValue(errorMessage);
    }
  }
);

//fetch used ratecharts   ------------------------------------------------------------->
export const getRateCharts = createAsyncThunk(
  "ratechart/getRateCharts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/sankalan/ratechart");
      return response.data.usedRateChart;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Failed to fetch ratechart used by this dairy.";
      return rejectWithValue(errorMessage);
    }
  }
);

//fetch used ratecharts   ------------------------------------------------------------->
export const getLatestRateChart = createAsyncThunk(
  "ratechart/getLatestRateChart",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/center/sankalan/ratechart");
      return response.data.latestRC;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Failed to fetch ratechart used by this dairy.";
      return rejectWithValue(errorMessage);
    }
  }
);

// fetch selected ratechart  ------------------------------------------------------------->

export const fetchRateChart = createAsyncThunk(
  "ratechart/fetchRateChart",
  async ({ rccode, rcdate, rctype }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/selected/ratechart", {
        params: { rccode, rcdate, rctype },
      });
      return response.data.selectedRChart;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch ratechart.";
      return rejectWithValue(errorMessage);
    }
  }
);

// Delete selected ratechart  ------------------------------------------------------------->

export const deleteRatechart = createAsyncThunk(
  "ratechart/deleteRatechart",
  async ({ rccode, rcdate }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/delete/ratechart", {
        rccode,
        rcdate,
      });
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to delete ratechart.";
      return rejectWithValue(errorMessage);
    }
  }
);

//list all ratecharts  ------------------------------------------------------------->

export const listRateCharts = createAsyncThunk(
  "ratechart/listRateCharts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/ratechart/list");
      return response.data.ratecharts;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch ratechart list!";
      return rejectWithValue(errorMessage);
    }
  }
);

//Fetch Selected rate chart  ------------------------------------------------------------->

export const fetchselectedRateChart = createAsyncThunk(
  "ratechart/fetchselectedRateChart",
  async ({ selectedRateChart }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/selected/ratechart", {
        selectedRateChart,
      });
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to get selected ratechart!.";
      return rejectWithValue(errorMessage);
    }
  }
);

//apply rate chart imcomplete  ------------------------------------------------------------->

// export const applyRateChart = createAsyncThunk(
//   "ratechart/applyRateChart",
//   async ({ applydate, custFrom, custTo, ratechart }, { rejectWithValue }) => {
//     try {
//       const response = await axiosInstance.post("/apply/ratechart", {
//         applydate,
//         custFrom,
//         custTo,
//         ratechart,
//       });
//       return response.data;
//     } catch (error) {
//       const errorMessage =
//         error.response?.data?.message || "Failed to apply ratechart!.";
//       return rejectWithValue(errorMessage);
//     }
//   }
// );

export const applyRateChart = createAsyncThunk(
  "ratechart/applyRateChart",
  async ({ rcfromdate, rctodate, custFrom, custTo }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/apply/ratechart", {
        rcfromdate,
        rctodate,
        custFrom,
        custTo,
      });
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to apply ratechart!.";
      return rejectWithValue(errorMessage);
    }
  }
);

// Update rate chart  ------------------------------------------------------------->
export const updateRatechart = createAsyncThunk(
  "ratechart/updateRatechart",
  async ({ amt, rccode, rcdate, rctype, rate }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/update/ratechart", {
        amt,
        rccode,
        rcdate,
        rctype,
        rate,
      });
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Failed to fetch milk collection ratechart!.";
      return rejectWithValue(errorMessage);
    }
  }
);

// Save Updated ratechart  ------------------------------------------------------------->
export const saveUpdatedRC = createAsyncThunk(
  "ratechart/saveUpdatedRC",
  async ({ ratechart, rccode, rctype, animal, time }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/save/updated/ratechart", {
        ratechart,
        rccode,
        rctype,
        animal,
        time,
      });
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Failed to fetch milk collection ratechart!.";
      return rejectWithValue(errorMessage);
    }
  }
);

// Slice
const rateChartSlice = createSlice({
  name: "ratechart",
  initialState,
  reducers: {
    updateProgress(state, action) {
      state.progress = action.payload;
    },
    resetProgress(state) {
      state.progress = 0;
    },
    setData: (state, action) => {
      state.excelRatechart = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMaxRcCode.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchMaxRcCode.fulfilled, (state, action) => {
        state.maxRcCode = action.payload;
        state.status = "succeeded";
      })
      .addCase(fetchMaxRcCode.rejected, (state, action) => {
        state.error = action.payload;
        state.status = "failed";
      }) // fetch new ratechart type ------------------------------------------------>
      .addCase(fetchMaxRctype.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchMaxRctype.fulfilled, (state, action) => {
        state.maxRcType = action.payload;
        state.status = "succeeded";
      })
      .addCase(fetchMaxRctype.rejected, (state, action) => {
        state.error = action.payload;
        state.status = "failed";
      }) // Add new ratechart ------------------------------------------------------->
      .addCase(addRcType.pending, (state) => {
        state.AddRCstatus = "loading";
        state.error = null;
      })
      .addCase(addRcType.fulfilled, (state) => {
        state.AddRCstatus = "succeeded";
      })
      .addCase(addRcType.rejected, (state, action) => {
        state.AddRCstatus = "failed";
        state.error = action.payload;
      }) // List of Ratechart types ------------------------------------------------->
      .addCase(listRcType.pending, (state) => {
        state.RCTliststatus = "loading";
        state.error = null;
      })
      .addCase(listRcType.fulfilled, (state, action) => {
        state.RCTliststatus = "succeeded";
        state.RCTypeList = action.payload;
      })
      .addCase(listRcType.rejected, (state, action) => {
        state.RCTliststatus = "failed";
        state.error = action.payload;
      }) // Save Ratechart used for milk Collection --------------------------------->
      .addCase(saveRateChart.pending, (state) => {
        state.savercstatus = "loading";
        state.error = null;
        state.progress = 0;
      })
      .addCase(saveRateChart.fulfilled, (state) => {
        state.savercstatus = "succeeded";
        state.progress = 100;
      })
      .addCase(saveRateChart.rejected, (state, action) => {
        state.savercstatus = "failed";
        state.error = action.payload;
        state.progress = 0;
      }) // Rate chart used for milk Collection ------------------------------------>
      .addCase(getRateCharts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getRateCharts.fulfilled, (state, action) => {
        state.rateChart = action.payload;
        state.status = "succeeded";
      })
      .addCase(getRateCharts.rejected, (state, action) => {
        state.error = action.payload;
        state.status = "failed";
      }) // ratechart for center milk collection --------------------------------->
      .addCase(getLatestRateChart.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getLatestRateChart.fulfilled, (state, action) => {
        state.latestrChart = action.payload;
        state.status = "succeeded";
      })
      .addCase(getLatestRateChart.rejected, (state, action) => {
        state.error = action.payload;
        state.status = "failed";
      })
      .addCase(fetchRateChart.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchRateChart.fulfilled, (state, action) => {
        state.selectedRateChart = action.payload;
        state.status = "succeeded";
      })
      .addCase(fetchRateChart.rejected, (state, action) => {
        state.error = action.payload;
        state.status = "failed";
      })
      .addCase(deleteRatechart.pending, (state) => {
        state.deletercstatus = "loading";
      })
      .addCase(deleteRatechart.fulfilled, (state) => {
        state.deletercstatus = "succeeded";
      })
      .addCase(deleteRatechart.rejected, (state, action) => {
        state.error = action.payload;
        state.deletercstatus = "failed";
      })
      .addCase(listRateCharts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(listRateCharts.fulfilled, (state, action) => {
        state.ratechartList = action.payload;
        state.status = "succeeded";
      })
      .addCase(listRateCharts.rejected, (state, action) => {
        state.error = action.payload;
        state.status = "failed";
      })
      .addCase(applyRateChart.pending, (state) => {
        state.applyrcstatus = "loading";
      })
      .addCase(applyRateChart.fulfilled, (state) => {
        state.applyrcstatus = "succeeded";
      })
      .addCase(applyRateChart.rejected, (state, action) => {
        state.error = action.payload;
        state.applyrcstatus = "failed";
      })
      .addCase(saveUpdatedRC.pending, (state) => {
        state.supdatedrcstatus = "loading";
      })
      .addCase(saveUpdatedRC.fulfilled, (state) => {
        state.supdatedrcstatus = "succeeded";
      })
      .addCase(saveUpdatedRC.rejected, (state, action) => {
        state.error = action.payload;
        state.supdatedrcstatus = "failed";
      })
      .addCase(fetchselectedRateChart.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchselectedRateChart.fulfilled, (state, action) => {
        state.selectedRateChart = action.payload;
        state.status = "succeeded";
      })
      .addCase(fetchselectedRateChart.rejected, (state, action) => {
        state.error = action.payload;
        state.status = "failed";
      })
      .addCase(updateRatechart.pending, (state) => {
        state.updatestatus = "loading";
      })
      .addCase(updateRatechart.fulfilled, (state, action) => {
        state.selectedRateChart = action.payload;
        state.updatestatus = "succeeded";
      })
      .addCase(updateRatechart.rejected, (state, action) => {
        state.error = action.payload;
        state.updatestatus = "failed";
      });
  },
});

export const { updateProgress, resetProgress, setData } =
  rateChartSlice.actions;

export default rateChartSlice.reducer;
