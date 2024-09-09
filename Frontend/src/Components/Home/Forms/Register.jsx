import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../../Styles/Home/Forms.css";

const Register = ({ switchToLogin }) => {
  const navigate = useNavigate();
  const [values, setValues] = useState({
    dairyname: "",
    user_name: "",
    user_phone: "",
    user_city: "",
    user_pincode: "",
    user_password: "",
    confirm_password: "",
    terms: false,
  });

  const [errors, setErrors] = useState({});

  const handleInputs = (e) => {
    const { name, value, type, checked } = e.target;
    const updatedValues = {
      ...values,
      [name]: type === "checkbox" ? checked : value,
    };
    setValues(updatedValues);

    // Validate the field in real-time
    const newErrors = validateField(name, updatedValues[name]);
    setErrors({ ...errors, ...newErrors });
  };

  const validateField = (name, value) => {
    const error = {};

    switch (name) {
      case "dairyname":
        error.dairyname = !/^[a-zA-Z0-9\s]+$/.test(value);
        break;

      case "user_name":
        error.user_name = !/^[a-zA-Z\s]+$/.test(value);
        break;

      case "user_phone":
        error.user_phone = !/^\d{10}$/.test(value);
        break;

      case "user_city":
        error.user_city = !/^[a-zA-Z\s]+$/.test(value);
        break;

      case "user_pincode":
        error.user_pincode = !/^\d{6}$/.test(value);
        break;

      case "user_password":
        error.user_password = value.length < 5;
        break;

      case "confirm_password":
        error.confirm_password = value !== values.user_password;
        break;

      case "terms":
        error.terms = !value;
        break;

      default:
        break;
    }

    return error;
  };

  const validateFields = () => {
    const fieldsToValidate = [
      "dairy_name",
      "user_name",
      "user_phone",
      "user_city",
      "user_pincode",
      "user_password",
      "confirm_password",
      "terms",
    ];
    const errors = {};

    fieldsToValidate.forEach((field) => {
      const fieldError = validateField(field, values[field]);
      Object.assign(errors, fieldError);
    });

    return errors;
  };

  axios.defaults.baseURL = import.meta.env.VITE_BASE_URI;
  axios.defaults.withCredentials = true;

  const handleRegister = (e) => {
    e.preventDefault();

    const validationErrors = validateFields();

    if (Object.values(validationErrors).every((error) => !error)) {
      axios
        .post("/register", values)
        .then((res) => {
          console.log("Registered Successfully", res);
          toast.success("Registered Successfully");
          switchToLogin();
        })
        .catch((err) => {
          if (err.response) {
            toast.error(
              `Error during registration: ${err.response.data.message}`
            );
          } else {
            toast.error(`Error during registration: ${err.message}`);
          }
        });
    } else {
      setErrors(validationErrors);
    }
  };

  return (
    <div className="form-container w70 h1 d-flex-col">
      <form
        onSubmit={handleRegister}
        className="signup-form w100 d-flex-col align-center p10">
        <span className="title t-center">Register Now</span>

        <div className="data-div w100">
          <label className="text">
            Enter Dairyname <span className="req">*</span>
          </label>
          <input
            className={`data ${errors.dair_yname ? "error-border" : ""}`}
            type="text"
            name="dairy_name"
            placeholder="smart dairy 2.0"
            onChange={handleInputs}
          />
        </div>

        <div className="data-outer w100 d-flex sb">
          <div className="data-div-2">
            <label className="text">
              Enter Username <span className="req">*</span>
            </label>
            <input
              className={`data ${errors.user_name ? "error-border" : ""}`}
              type="text"
              name="user_name"
              placeholder="smart dairy"
              onChange={handleInputs}
            />
          </div>

          <div className="data-div-2">
            <label className="text">
              Enter Phone Number <span className="req">*</span>
            </label>
            <input
              className={`data ${errors.user_phone ? "error-border" : ""}`}
              type="tel"
              name="user_phone"
              placeholder="Mobile Number"
              onChange={handleInputs}
            />
          </div>
        </div>

        <div className="data-outer w100 d-flex sb">
          <div className="data-div-2">
            <label className="text">
              Enter City <span className="req">*</span>
            </label>
            <input
              className={`data ${errors.user_city ? "error-border" : ""}`}
              type="text"
              name="user_city"
              placeholder="Location"
              onChange={handleInputs}
            />
          </div>

          <div className="data-div-2">
            <label className="text">
              Enter Pincode <span className="req">*</span>
            </label>
            <input
              className={`data ${errors.user_pincode ? "error-border" : ""}`}
              type="text"
              name="user_pincode"
              placeholder="Pincode"
              onChange={handleInputs}
            />
          </div>
        </div>

        <div className="data-outer w100 d-flex sb">
          <div className="data-div-2">
            <label className="text">
              Enter Password <span className="req">*</span>
            </label>
            <input
              className={`data ${errors.user_password ? "error-border" : ""}`}
              type="password"
              name="user_password"
              placeholder="Password"
              onChange={handleInputs}
            />
          </div>

          <div className="data-div-2">
            <label className="text">
              Confirm Password <span className="req">*</span>
            </label>
            <input
              className={`data ${
                errors.confirm_password ? "error-border" : ""
              }`}
              type="password"
              name="confirm_password"
              placeholder="Confirm Password"
              onChange={handleInputs}
            />
          </div>
        </div>

        <div className="terms-conditions h10 d-flex center">
          <span className="w100 d-flex text center p10">
            <input
              className={`checkboxx ${errors.terms ? "error-border" : ""}`}
              type="checkbox"
              name="terms"
              onChange={handleInputs}
            />{" "}
            I agree to all terms and conditions.<span className="req">*</span>
          </span>
        </div>

        <button className="form-btn inputs" type="submit">
          Register
        </button>

        <div className="account-check-div">
          <h2 className="text">
            I already have an account?{" "}
            <button onClick={switchToLogin} className="swith-form-button">
              Login
            </button>{" "}
            Now!
          </h2>
        </div>
      </form>
    </div>
  );
};

export default Register;
