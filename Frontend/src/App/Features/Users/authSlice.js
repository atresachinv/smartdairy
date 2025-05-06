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
// fetch User Mobile to send otp------------------------------------------------------------>

export const fetchUserMobile = createAsyncThunk(
  "auth/fetchUserMobile",
  async (user_id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/get/user/mobile", {
        user_id,
      });
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response.data.message || "Failed to fetch user mobile!";
      return rejectWithValue(errorMessage);
    }
  }
);

// save otp to users table ------------------------------------------------------------>
export const saveOtptext = createAsyncThunk(
  "auth/saveOtptext",
  async ({ otp, username, mobile }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put("/save-otp", {
        otp,
        username,
        mobile,
      });
      return response.data;
    } catch (error) {
      const errorMessage = error.response.data.message || "Failed to save otp!";
      return rejectWithValue(errorMessage);
    }
  }
);

// confirm otp------------------------------------------------------------>
export const confirmOtptext = createAsyncThunk(
  "auth/confirmOtptext",
  async ({ otp, username, mobile }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/verify-otp", {
        otp,
        username,
        mobile,
      });
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response.data.message || "Failed to fetch user mobile!";
      return rejectWithValue(errorMessage);
    }
  }
);

// update user password ------------------------------------------------------------>
export const uUserPassword = createAsyncThunk(
  "auth/uUserPassword",
  async ({ password, username, mobile }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put("/update/user/password", {
        password,
        username,
        mobile,
      });
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response.data.message || "Failed to update user password!";
      return rejectWithValue(errorMessage);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    confirmOtp: "",
    userRole: "",
    userInfo: [],
    username: "",
    dairyname: "",
    // token: null,
    // isAuthenticated: false,
    user: JSON.parse(localStorage.getItem("user")) || null,
    token: localStorage.getItem("token") || null,
    isAuthenticated: !!localStorage.getItem("token"),
    loading: false,
    status: "idle",
    upassstatus: "idle",
    otpstatus: "idle",
    sotpstatus: "idle",
    cotpstatus: "idle",
    error: null,
  },
  reducers: {
    setLogin: (state, action) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      state.isAuthenticated = true;
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);
    },
    setUser: (state, action) => {
      state.user = action.payload.user;
      localStorage.setItem("user", JSON.stringify(action.payload.user));
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      localStorage.removeItem("sessionToken");
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
      }) // fetch user mobile to send otp ------------------------------------>
      .addCase(fetchUserMobile.pending, (state) => {
        state.otpstatus = "loading";
      })
      .addCase(fetchUserMobile.fulfilled, (state, action) => {
        state.otpstatus = "succeeded";
        state.userInfo = action.payload;
      })
      .addCase(fetchUserMobile.rejected, (state, action) => {
        state.otpstatus = "failed";
        state.error = action.payload;
      }) // save otp ------------------------------------>
      .addCase(saveOtptext.pending, (state) => {
        state.sotpstatus = "loading";
      })
      .addCase(saveOtptext.fulfilled, (state) => {
        state.sotpstatus = "succeeded";
      })
      .addCase(saveOtptext.rejected, (state, action) => {
        state.sotpstatus = "failed";
        state.error = action.payload;
      }) // confirm otp ------------------------------------>
      .addCase(confirmOtptext.pending, (state) => {
        state.cotpstatus = "loading";
      })
      .addCase(confirmOtptext.fulfilled, (state, action) => {
        state.cotpstatus = "succeeded";
        state.confirmOtp = action.payload;
      })
      .addCase(confirmOtptext.rejected, (state, action) => {
        state.cotpstatus = "failed";
        state.error = action.payload;
      }) // confirm otp ------------------------------------>
      .addCase(uUserPassword.pending, (state) => {
        state.upassstatus = "loading";
      })
      .addCase(uUserPassword.fulfilled, (state) => {
        state.upassstatus = "succeeded";
      })
      .addCase(uUserPassword.rejected, (state, action) => {
        state.upassstatus = "failed";
        state.error = action.payload;
      });
  },
});

export const { setLogin, setUser, logout } = authSlice.actions;
export default authSlice.reducer;
