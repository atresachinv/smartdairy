import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../../axiosInstance";

const initialState = {
  maxCode: "",
  animalList: [],
  status: "idle",
  addstatus: "idle",
  upadatestatus: "idle",
  liststatus: "idle",
  delstatus: "idle",
  error: null,
};

// Add new animal for perticular customer
export const addAnimal = createAsyncThunk(
  "animal/addAnimal",
  async ({ values }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/animal/create", { values });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// update animal information
export const updateAnimal = createAsyncThunk(
  "animal/updateAnimal",
  async ({ values }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put("/animal/update", { values });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// fetch max animal no for perticular customer

export const fetchMaxCode = createAsyncThunk(
  "animal/fetchMaxCode",
  async (cust_code, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/animal/maxno", {
        params: { cust_code },
      });
      return response.data.maxAnimalCode;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// fetch animal for perticular customer
export const fetchCustAnimals = createAsyncThunk(
  "animal/fetchCustAnimals",
  async (cust_code, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/animal/list", {
        params: { cust_code },
      });
      // console.log(animalList);
      return response.data.animalList;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Delete animal
export const deleteAnimal = createAsyncThunk(
  "animal/deleteAnimal",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete("/animal/delete", {
        params: { id },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const bankSlice = createSlice({
  name: "animal",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder // add new animal ------------------------------------------->
      .addCase(addAnimal.pending, (state) => {
        state.addstatus = "loading";
      })
      .addCase(addAnimal.fulfilled, (state, action) => {
        state.addstatus = "succeeded";
        state.maxCode = action.payload;
      })
      .addCase(addAnimal.rejected, (state, action) => {
        state.addstatus = "failed";
        state.error = action.payload;
      }) //  update animal info  ----------------------------------------->
      .addCase(updateAnimal.pending, (state) => {
        state.upadatestatus = "loading";
      })
      .addCase(updateAnimal.fulfilled, (state) => {
        state.upadatestatus = "succeeded";
      })
      .addCase(updateAnimal.rejected, (state, action) => {
        state.upadatestatus = "failed";
        state.error = action.payload;
      }) // fetch max animal number of customer ----------------------------->
      .addCase(fetchMaxCode.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchMaxCode.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.maxCode = action.payload;
      })
      .addCase(fetchMaxCode.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      }) // get all animal of customer -------------------------------------->
      .addCase(fetchCustAnimals.pending, (state) => {
        state.liststatus = "loading";
      })
      .addCase(fetchCustAnimals.fulfilled, (state, action) => {
        state.liststatus = "succeeded";
        state.animalList = action.payload || [];
      })
      .addCase(fetchCustAnimals.rejected, (state, action) => {
        state.liststatus = "failed";
        state.error = action.payload;
      }) // delete animal -------------------------------------------------->
      .addCase(deleteAnimal.pending, (state) => {
        state.delstatus = "loading";
      })
      .addCase(deleteAnimal.fulfilled, (state) => {
        state.delstatus = "succeeded";
      })
      .addCase(deleteAnimal.rejected, (state, action) => {
        state.delstatus = "failed";
        state.error = action.payload;
      });
  },
});
export default bankSlice.reducer;
