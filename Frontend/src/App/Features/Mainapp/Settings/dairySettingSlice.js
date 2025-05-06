import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../../axiosInstance";
import { toast } from "react-toastify";

const initialState = {
  dairySettings: null,
  centerSetting: {},
  status: "idle",
  updateStatus: "idle",
  centerStatus: "idle",
  cupdateStatus: "idle",
  error: null,
};

// Fetch dairy center settings
export const getDairySettings = createAsyncThunk(
  "dairySettings/getDairySettings",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/center/setting");
      return response.data.data;
    } catch (error) {
      const errorMessage = error.response
        ? error.response.data
        : "Failed to fetch dairy settings.";
      return rejectWithValue(errorMessage);
    }
  }
);

// Update dairy center settings
export const updateDairySettings = createAsyncThunk(
  "dairySettings/updateDairySettings",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/center/update-setting", data);
      if (response.data.success) {
        toast.success("Update SuccessFully");
      }
      return response.data;
    } catch (error) {
      const errorMessage = error.response
        ? error.response.data
        : "Failed to update dairy settings.";
      return rejectWithValue(errorMessage);
    }
  }
);

// Update dairy center settings
export const updateDairySetup = createAsyncThunk(
  "dairySettings/updateDairySetup",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        "/center/update/setting",
        formData
      );
      if (response.data.success) {
        toast.success("Dairy setting update SuccessFully");
      }
      return response.data;
    } catch (error) {
      const errorMessage = error.response
        ? error.response.data
        : "Failed to update dairy settings.";
      return rejectWithValue(errorMessage);
    }
  }
);

// get a center setting
export const getCenterSetting = createAsyncThunk(
  "dairySettings/getCenterSetting",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/center/setting/one");
      return response.data.data;
    } catch (error) {
      const errorMessage = error.response
        ? error.response.data
        : "Failed to fetch center setting.";
      return rejectWithValue(errorMessage);
    }
  }
);

const dairySettingSlice = createSlice({
  name: "dairySettings",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getDairySettings.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(getDairySettings.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.dairySettings = action.payload;
      })
      .addCase(getDairySettings.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(updateDairySettings.pending, (state) => {
        state.updateStatus = "loading";
        state.error = null;
      })
      .addCase(updateDairySettings.fulfilled, (state) => {
        state.updateStatus = "succeeded";
      })
      .addCase(updateDairySettings.rejected, (state, action) => {
        state.updateStatus = "failed";
        state.error = action.payload;
      })
      .addCase(getCenterSetting.pending, (state) => {
        state.centerStatus = "loading";
        state.error = null;
      })
      .addCase(getCenterSetting.fulfilled, (state, action) => {
        state.centerStatus = "succeeded";
        state.centerSetting = action.payload;
      })
      .addCase(getCenterSetting.rejected, (state, action) => {
        state.centerStatus = "failed";
        state.error = action.payload;
      })
      .addCase(updateDairySetup.pending, (state) => {
        state.cupdateStatus = "loading";
        state.error = null;
      })
      .addCase(updateDairySetup.fulfilled, (state, action) => {
        state.cupdateStatus = "succeeded";
        state.centerSetting = action.payload;
      })
      .addCase(updateDairySetup.rejected, (state, action) => {
        state.cupdateStatus = "failed";
        state.error = action.payload;
      });
  },
});

export default dairySettingSlice.reducer;
