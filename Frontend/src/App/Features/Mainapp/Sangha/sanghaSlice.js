import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../../axiosInstance";

const initialState = {
  sanghaList: [],
  cresanghastatus: "idle",
  upsanghastatus: "idle",
  sanghaliststatus: "idle",
  delsanghastatus: "idle",
  error: null,
};

export const addSangha = createAsyncThunk(
  "sangha/addSangha",
  async ({ code, sanghaname, marathiname }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/create/sangha", {
        code,
        sanghaname,
        marathiname,
      });
      return response.data;
    } catch (error) {
      const errorMessage = error.response
        ? error.response.data
        : "Failed to create sangha.";
      return rejectWithValue(errorMessage);
    }
  }
);
export const updateSangha = createAsyncThunk(
  "sangha/updateSangha",
  async ({ id, sanghaname, marathiname }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/update/sangha", {
        id,
        sanghaname,
        marathiname,
      });
      return response.data;
    } catch (error) {
      const errorMessage = error.response
        ? error.response.data
        : "Failed to update sangha.";
      return rejectWithValue(errorMessage);
    }
  }
);
export const fetchSanghaList = createAsyncThunk(
  "sangha/fetchSanghaList",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/list/sangha");
      return response.data.sanghaList;
    } catch (error) {
      const errorMessage = error.response
        ? error.response.data
        : "Failed to fetch sangha list.";
      return rejectWithValue(errorMessage);
    }
  }
);
export const deleteSangha = createAsyncThunk(
  "sangha/deleteSangha",
  async ({ id }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete("/delete/sangha", {
        params: { id },
      });
      return response.data;
    } catch (error) {
      const errorMessage = error.response
        ? error.response.data
        : "Failed to delete sangha.";
      return rejectWithValue(errorMessage);
    }
  }
);

const sanghaSlice = createSlice({
  name: "sangha",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder // create new sangha ---------------------------------->
      .addCase(addSangha.pending, (state) => {
        state.cresanghastatus = "loading";
        state.error = null;
      })
      .addCase(addSangha.fulfilled, (state) => {
        state.cresanghastatus = "succeeded";
      })
      .addCase(addSangha.rejected, (state, action) => {
        state.cresanghastatus = "failed";
        state.error = action.payload;
      }) // update sangha ---------------------------------------->
      .addCase(updateSangha.pending, (state) => {
        state.upsanghastatus = "loading";
        state.error = null;
      })
      .addCase(updateSangha.fulfilled, (state) => {
        state.upsanghastatus = "succeeded";
      })
      .addCase(updateSangha.rejected, (state, action) => {
        state.upsanghastatus = "failed";
        state.error = action.payload;
      }) // list all sangha ------------------------------------------>
      .addCase(fetchSanghaList.pending, (state) => {
        state.sanghaliststatus = "loading";
        state.error = null;
      })
      .addCase(fetchSanghaList.fulfilled, (state, action) => {
        state.sanghaliststatus = "succeeded";
        state.sanghaList = action.payload;
      })
      .addCase(fetchSanghaList.rejected, (state, action) => {
        state.sanghaliststatus = "failed";
        state.error = action.payload;
      }) // delete selected sangha ---------------------------------->
      .addCase(deleteSangha.pending, (state) => {
        state.delsanghastatus = "loading";
        state.error = null;
      })
      .addCase(deleteSangha.fulfilled, (state, action) => {
        state.delsanghastatus = "succeeded";
      })
      .addCase(deleteSangha.rejected, (state, action) => {
        state.delsanghastatus = "failed";
        state.error = action.payload;
      });
  },
});

export default sanghaSlice.reducer;
