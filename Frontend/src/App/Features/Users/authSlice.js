import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../axiosInstance";
import { toast } from "react-toastify";
// --------------------------------------------------------------->
// login function ------------------------------------------------>
export const checkdairyName = createAsyncThunk(
  "auth/checkdairyName",
  async (dairyname, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/check/dairyname", dairyname);
      return response.data; // Contains user_role
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Login failed";
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);
// --------------------------------------------------------------->
// login function ------------------------------------------------>
export const checkuserName = createAsyncThunk(
  "auth/checkuserName",
  async (username, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/check/username", username);
      return response.data; // Contains user_role
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Login failed";
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

// --------------------------------------------------------------->
// login function ------------------------------------------------>
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (values, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/login", values);
      return response.data.user_role; // Contains user_role
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Login failed";
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);
// --------------------------------------------------------------->
// logout function ----------------------------------------------->
export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (values, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/logout", values);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Login failed";
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

export const userDesignation = createAsyncThunk(
  "auth/designation",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/login", credentials);
      return response.data; // Contains user_role
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Login failed";
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

export const checkCurrentSession = createAsyncThunk(
  "auth/checkCurrentSession",
  async (sessionToken, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/verify-session", {
        sessionToken,
      });
      return response.data;
    } catch (error) {
      const errorMessage = error.response
        ? error.response.data.message || "Failed to check current session."
        : "Failed to check current session.";
      return rejectWithValue(errorMessage);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    userRole: "",
    user: {},
    username: "",
    dairyname: "",
    token: null,
    isAuthenticated: false,
    loading: false,
    status: "idle",
    error: null,
  },
  reducers: {
    setLogin: (state, action) => {
      state.isAuthenticated = true;
      state.userRole = action.payload.userRole; // Save userRole to state
    },
    // logout: (state) => {
    //   state.userRole = null;
    //   state.isAuthenticated = false;
    //   localStorage.removeItem("user_id");
    //   localStorage.removeItem("user_password");
    //   localStorage.removeItem("rememberMe");
    // },
    setUser: (state, action) => {
      state.user = action.payload.user || {};
      state.token = action.payload.token || null;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
    },
  },
  extraReducers: (builder) => {
    builder // check dairyname exist or not ------------------------------------>
      .addCase(checkdairyName.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(checkdairyName.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.dairyname = action.payload;
      })
      .addCase(checkdairyName.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      }) //check username exist or not------------------------------------>
      .addCase(checkuserName.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(checkuserName.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.username = action.payload;
      })
      .addCase(checkuserName.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      }) //login user ------------------------------------>
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.userRole = action.payload;
        state.isAuthenticated = true;
        state.loading = false;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      }) // check current session ------------------------------------>
      .addCase(checkCurrentSession.pending, (state) => {
        state.status = "loading";
        state.loading = true;
        state.error = null;
      })
      .addCase(checkCurrentSession.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.userRole = action.payload;
        state.isAuthenticated = true;
        state.loading = false;
      })
      .addCase(checkCurrentSession.rejected, (state, action) => {
        state.status = "failed";
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setUser, setLogin, logout } = authSlice.actions;
export default authSlice.reducer;
