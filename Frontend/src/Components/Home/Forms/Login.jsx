import React, { useState } from "react";
import axios from "axios";

import { useNavigate } from "react-router-dom";
// css
import "../../../Styles/Home/Forms.css";
const Login = () => {
  const navigate = useNavigate();
  const [values, setValues] = useState({
    user_id: "",
    user_password: "",
  });

  const handleInputs = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

  axios.defaults.baseURL = import.meta.env.VITE_BASE_URI;
  axios.defaults.withCredentials = true;

  const handleLogin = (e) => {
    e.preventDefault();
    axios
      .post("/smartdairy/api/login", values)
      .then((res) => {
        localStorage.setItem("token", res.data.token);
        // toast.success("Login Successful");
        console.log("Login Successful!");
        navigate("/mainapp/home"); // Redirect to Main App
      })
      .catch((err) => {
        if (err.response) {
          console.error(`Error during login: ${err.response.data.message}`);
        } else {
          console.error(`Error during login1: ${err.message}`);
        }
      });
  };

  return (
    <div className="login-form-container w50 h1 d-flex-col">
      <div className="form-title w100 h10 d-flex-col">
        <span className="title">Login Now</span>
      </div>
      <form onSubmit={handleLogin} className="login-form w100 h50 d-flex-col">
        <div className="data-div w100">
          <span className="text">Enter Userid</span>
          <input
            type="text"
            name="user_id"
            className="data"
            required
            onChange={handleInputs}
          />
        </div>
        <div className="data-div w100">
          <span className="text">Enter Password</span>
          <input
            type="password"
            name="user_password"
            className="data"
            required
            onChange={handleInputs}
          />
        </div>
        <button className="form-btn" type="submit">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
