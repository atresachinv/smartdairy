import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { toast } from "react-toastify";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUserMobile,
  setLogin,
} from "../../../App/Features/Users/authSlice";
import Spinner from "../Spinner/Spinner";
import axiosInstance from "../../../App/axiosInstance";
import CowImage from "../CowImage";
import "../../../Styles/Home/Forms.css";

const Login = ({ switchToRegister, switchToOptSend }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // const user_role = useSelector((state) => state.users.userRole);
  const mobile = useSelector((state) => state.users.mobile);

  const [values, setValues] = useState({
    user_id: "",
    user_password: "",
  });

  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // State for password visibility
  const [isSaving, setIsSaving] = useState(false);

  // Check if login details are stored in localStorage when the component mounts
  useEffect(() => {
    const storedUserId = localStorage.getItem("user_id");
    const storedPassword = localStorage.getItem("user_password");
    const storedRememberMe = localStorage.getItem("rememberMe");

    if (storedUserId && storedPassword && storedRememberMe === "true") {
      setValues({
        user_id: storedUserId,
        user_password: storedPassword,
      });
      setRememberMe(true); // Set the checkbox to checked if credentials were stored
    }
  }, []);

  const handleInputs = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

  const handleRememberMeChange = (e) => {
    setRememberMe(e.target.checked);
  };

  axios.defaults.baseURL = import.meta.env.VITE_BASE_URI;
  axios.defaults.withCredentials = true;

  const handleLogin = (e) => {
    e.preventDefault();
    setIsSaving(true);
    axiosInstance
      .post("/login", values)
      .then((res) => {
        const { user_role, sessionToken, token } = res.data;

        if (sessionToken) {
          localStorage.setItem("sessionToken", sessionToken);
        }
        // Handle Remember Me
        if (rememberMe) {
          localStorage.setItem("user_id", values.user_id);
          localStorage.setItem("user_password", values.user_password);
          localStorage.setItem("rememberMe", "true");
        } else {
          localStorage.removeItem("user_id");
          localStorage.removeItem("user_password");
          localStorage.removeItem("rememberMe");
        }

        const userRole = user_role.toLowerCase();
        localStorage.setItem("userRole", userRole);
        const user = { role: user_role };

        // Save in Redux & LocalStorage
        dispatch(setLogin({ user, token }));

        // Redirect based on role
        switch (userRole) {
          case "customer":
            navigate("/customer/dashboard");
            break;
          case "admin":
          case "manager":
          case "milkcollector":
          case "mobilecollector":
          case "salesman":
            navigate("/mainapp/dashboard");
            break;
          case "super_admin":
            navigate("/adminpanel");
            break;
          default:
            toast.error("Unexpected user type!");
            return;
        }

        toast.success("Login Successful");
      })
      .catch((err) => {
        if (err.response) {
          toast.error(err.response.data.message);
        } else {
          toast.error("An error occurred during login.");
        }
      })
      .finally(() => {
        setIsSaving(false);
      });
  };

  const checkUserDetails = async (e) => {
    e.preventDefault();
    if (!values.user_id || values.user_id === "") {
      toast.error("Plaese Enter Username!");
      return;
    }
    setIsSaving(true);
    const res = await dispatch(fetchUserMobile(values.user_id)).unwrap();
    setIsSaving(false);
    if (res?.status === 200) {
      switchToOptSend();
    } else {
      toast.error("Your Mobile Number not available!");
    }
  };

  return (
    <div className="form-container w100 h1 d-flex sa">
      <div className="cow-image-container w50 h1 d-flex center">
        <CowImage />
      </div>
      <div className="login-form-container w30 h1 d-flex-col p10">
        <div className="form-title w100 h10 d-flex-col t-center">
          <span className="title">Login Now</span>
        </div>
        <form onSubmit={handleLogin} className="login-form w100 h1 d-flex-col">
          <div className="data-div w100">
            <span className="text">Enter User ID</span>
            <input
              type="text"
              name="user_id"
              className="data password-input-container pass"
              required
              value={values.user_id}
              onChange={handleInputs}
            />
          </div>
          <div className="data-div w100">
            <span className="text">Enter Password</span>
            <div className="password-input-container d-flex a-center">
              <input
                type={showPassword ? "text" : "password"}
                name="user_password"
                className="pass w90"
                required
                value={values.user_password}
                onChange={handleInputs}
              />
              <span
                className="eye-icon w10 d-flex a-center"
                onClick={() => setShowPassword(!showPassword)} // Toggle password visibility
              >
                {showPassword ? (
                  <IoMdEyeOff className="pss-eye" />
                ) : (
                  <IoMdEye className="pss-eye" />
                )}
              </span>
            </div>
          </div>
          <div className="remember-me-div w100 d-flex j-start a-center py10">
            <input
              className="checkbx"
              type="checkbox"
              checked={rememberMe}
              onChange={handleRememberMeChange}
            />
            <span className="px10 heading">Remember me!</span>
          </div>
          <button className="form-btn" type="submit" disabled={isSaving}>
            {isSaving ? "Loging..." : "Login"}
          </button>
          {isSaving ? (
            <div className="loaging-spinner w100 d-flex center">
              <Spinner />
            </div>
          ) : (
            ""
          )}
          <div className="account-check-div my10">
            <button
              onClick={checkUserDetails}
              className="info-text swith-form-button"
            >
              Forget Password?
            </button>
          </div>
          <div className="account-check-div">
            <h2 className="text">
              I don't have an account{" "}
              <button onClick={switchToRegister} className="swith-form-button">
                Register
              </button>{" "}
              Now!
            </h2>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
