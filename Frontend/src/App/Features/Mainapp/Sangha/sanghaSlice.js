import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../../axiosInstance";

const initialState = {
  sanghaList: [],
  sanghamilkColl: [],
  cresanghastatus: "idle",
  upsanghastatus: "idle",
  sanghaliststatus: "idle",
  delsanghastatus: "idle",
  addsmstatus: "idle",
  fetchsmstatus: "idle",
  updatesmstatus: "idle",
  delsmstatus: "idle",
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

// add milk collection to sangha
export const addsanghaMilkColl = createAsyncThunk(
  "sangha/addsanghaMilkColl",
  async (values, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        "/add/sangha/milk-coll",
        values
      );
      return response.data;
    } catch (error) {
      const errorMessage = error.response
        ? error.response.data
        : "Failed to delete sangha.";
      return rejectWithValue(errorMessage);
    }
  }
);

// fetch sangh milk collection
export const fetchsanghaMilkColl = createAsyncThunk(
  "sangha/fetchsanghaMilkColl",
  async ({ fromDate, toDate }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/fetch/sangha/milk-coll", {
        params: { fromDate, toDate },
      });
      return response.data.sanghaMilkSales;
    } catch (error) {
      const errorMessage = error.response
        ? error.response.data
        : "Failed to delete sangha.";
      return rejectWithValue(errorMessage);
    }
  }
);

// update sangha milk collection
export const updatesanghaMilkColl = createAsyncThunk(
  "sangha/updatesanghaMilkColl",
  async ({ values }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(
        "/update/sangha/milk-coll",
        values
      );
      return response.data;
    } catch (error) {
      const errorMessage = error.response
        ? error.response.data
        : "Failed to delete sangha.";
      return rejectWithValue(errorMessage);
    }
  }
);

// delete sangha milk collection
export const deletesanghaMilkColl = createAsyncThunk(
  "sangha/deletesanghaMilkColl",
  async ({ id }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete("/delete/sangha/milk-coll", {
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
      }) // add sangha milk sales
      .addCase(addsanghaMilkColl.pending, (state) => {
        state.addsmstatus = "loading";
        state.error = null;
      })
      .addCase(addsanghaMilkColl.fulfilled, (state, action) => {
        state.addsmstatus = "succeeded";
      })
      .addCase(addsanghaMilkColl.rejected, (state, action) => {
        state.addsmstatus = "failed";
        state.error = action.payload;
      }) // fetch sangha milk sales
      .addCase(fetchsanghaMilkColl.pending, (state) => {
        state.fetchsmstatus = "loading";
        state.error = null;
      })
      .addCase(fetchsanghaMilkColl.fulfilled, (state, action) => {
        state.fetchsmstatus = "succeeded";
        state.sanghamilkColl = action.payload;
      })
      .addCase(fetchsanghaMilkColl.rejected, (state, action) => {
        state.fetchsmstatus = "failed";
        state.error = action.payload;
      }) // update sangha milk collection
      .addCase(updatesanghaMilkColl.pending, (state) => {
        state.updatesmstatus = "loading";
        state.error = null;
      })
      .addCase(updatesanghaMilkColl.fulfilled, (state, action) => {
        state.updatesmstatus = "succeeded";
      })
      .addCase(updatesanghaMilkColl.rejected, (state, action) => {
        state.updatesmstatus = "failed";
        state.error = action.payload;
      }) // delete sangha milk collection
      .addCase(deletesanghaMilkColl.pending, (state) => {
        state.delsmstatus = "loading";
        state.error = null;
      })
      .addCase(deletesanghaMilkColl.fulfilled, (state, action) => {
        state.delsmstatus = "succeeded";
      })
      .addCase(deletesanghaMilkColl.rejected, (state, action) => {
        state.delsmstatus = "failed";
        state.error = action.payload;
      }); //
  },
});

export default sanghaSlice.reducer;
