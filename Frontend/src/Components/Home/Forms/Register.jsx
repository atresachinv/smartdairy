import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "../../../Styles/Home/Forms.css";
import { toast } from "react-toastify";
import { registerUser, reset } from "../../../App/Features/Dairy/registerSlice";
import {
  checkdairyName,
  checkuserName,
} from "../../../App/Features/Users/authSlice";

const Register = ({ switchToLogin }) => {
  const dispatch = useDispatch();

  const { status, error } = useSelector((state) => state.register);
  const tDate = useSelector((state) => state.date.toDate); // Assuming you have a date slice
  const [dairyName, setDairyName] = useState(true); // if dairyname found update true
  const [userName, setUserName] = useState(true); // if username found update true
  const [errors, setErrors] = useState({});
  const [prefixString, setPrefixString] = useState("");
  const [endDate, setEndDate] = useState("");
  // Local state for form values and errors

  const initialstate = {
    dairy_name: "",
    marathi_name: "",
    user_name: "",
    user_phone: "",
    user_city: "",
    user_pincode: "",
    user_password: "",
    confirm_password: "",
    terms: false,
  };
  const [values, setValues] = useState(initialstate);

  // --------------------------------------------------------------------------------------------->
  // Generate prefix string on component mount
  useEffect(() => {
    const generatePrefix = () => {
      const alphabets = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      let prefix = "";
      for (let i = 0; i < 3; i++) {
        const randomIndex = Math.floor(Math.random() * alphabets.length);
        prefix += alphabets[randomIndex];
      }
      setPrefixString(prefix);
    };

    generatePrefix();
  }, []);

  // --------------------------------------------------------------------------------------------->
  // Generate end date 365 days from tDate
  useEffect(() => {
    const generateEndDate = (date) => {
      if (!date) {
        date = new Date().toISOString().split("T")[0]; // Use current date if tDate is not provided
      }
      const currentDate = new Date(date);
      currentDate.setDate(currentDate.getDate() + 365);
      const formattedDate = currentDate.toISOString().split("T")[0];
      setEndDate(formattedDate);
    };
    generateEndDate(tDate);
  }, [tDate]);

  // --------------------------------------------------------------------------------------------->
  // Handle input changes and validation
  const handleInputs = (e) => {
    const { name, value, type, checked } = e.target;
    const updatedValues = {
      ...values,
      [name]: type === "checkbox" ? checked : value,
    };
    setValues(updatedValues);

    // Validate the field in real-time
    const newErrors = validateField(name, updatedValues[name]);
    setErrors((prevErrors) => ({ ...prevErrors, ...newErrors }));
  };

  // --------------------------------------------------------------------------------------------->
  // cheking dairyname or username is exit or not -------------------------------------------->
  useEffect(() => {
    if (values.dairy_name.length > 2) {
      console.log("heloo from dairy name");
      const delay = setTimeout(checkDairyName, 500); // Delay API call
      return () => clearTimeout(delay);
    }
  }, [values.dairy_name]);

  useEffect(() => {
    if (values.user_name.length > 2) {
      console.log("heloo from user name");
      const delay = setTimeout(checkUserName, 1500); // Delay API call
      return () => clearTimeout(delay);
    }
  }, [values.user_name]);

  const checkDairyName = async () => {
    const result = await dispatch(
      checkdairyName({ dairyname: values.dairy_name })
    ).unwrap();
    setDairyName(result.available);
  };

  const checkUserName = async () => {
    const result = await dispatch(
      checkuserName({ username: values.user_name })
    ).unwrap();
    setUserName(result.available);
  };

  // --------------------------------------------------------------------------------------------->
  // Field validation function
  const validateField = (name, value) => {
    const error = {};
    switch (name) {
      case "dairy_name":
        if (!/^[a-zA-Z0-9\s]+$/.test(value)) {
          error.dairy_name = "Invalid dairy name.";
        } else {
          delete errors[name];
        }
        break;
      case "marathi_name":
        if (!/^[\u0900-\u097Fa-zA-Z0-9\s]+$/.test(value)) {
          error.marathi_name = "Invalid dairy name.";
        } else {
          delete errors[name];
        }
        break;
      case "user_name":
        if (!/^[a-zA-Z\s]+$/.test(value)) {
          error.user_name = "Invalid username.";
        } else {
          delete errors[name];
        }
        break;
      case "user_phone":
        if (!/^\d{10}$/.test(value)) {
          error.user_phone = "Invalid phone number.";
        } else {
          delete errors[name];
        }
        break;
      case "user_city":
        if (!/^[a-zA-Z\s]+$/.test(value)) {
          error.user_city = "Invalid city name.";
        } else {
          delete errors[name];
        }
        break;
      case "user_pincode":
        if (!/^\d{6}$/.test(value)) {
          error.user_pincode = "Invalid pincode.";
        } else {
          delete errors[name];
        }
        break;
      case "user_password":
        if (value.length < 5) {
          error.user_password = "Password must be at least 5 characters.";
        } else {
          delete errors[name];
        }
        break;
      case "confirm_password":
        if (value !== values.user_password) {
          error.confirm_password = "Passwords do not match.";
        } else {
          delete errors[name];
        }
        break;
      case "terms":
        if (!value) {
          error.terms = "You must accept the terms.";
        } else {
          delete errors[name];
        }
        break;
      default:
        break;
    }
    return error;
  };

  // Validate all fields before submission
  const validateFields = () => {
    const fieldsToValidate = [
      "dairy_name",
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

    const validationErrors = {};
    fieldsToValidate.forEach((field) => {
      const fieldError = validateField(field, values[field]);
      if (Object.keys(fieldError).length > 0) {
        validationErrors[field] = fieldError[field];
      }
    });
    setErrors(validationErrors);
    return errors;
  };

  // Handle form registration
  const handleRegister = async (e) => {
    e.preventDefault(); // Prevent default form submission

    // Validate fields before submission
    const validationErrors = validateFields();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    if (!dairyName) {
      toast.error("Same dairyname not allowed!");
      return;
    }
    if (!userName) {
      toast.error("Same username not allowed!");
      return;
    }

    const requestData = {
      dairy_name: values.dairy_name,
      user_name: values.user_name,
      user_phone: values.user_phone,
      user_city: values.user_city,
      user_pincode: values.user_pincode,
      user_password: values.user_password,
      terms: values.terms ? 1 : 0, // Mapping: true -> 1, false -> 0
      prefix: prefixString,
      date: tDate,
      endDate: endDate,
    };
    const result = await dispatch(registerUser(requestData)).unwrap();

    if (result.status === 200) {
      setValues(initialstate);
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
  };

  // Handle toast notifications based on Redux state
  useEffect(() => {
    if (status === "succeeded") {
      toast.success("Registration successful! Please login.");
      dispatch(reset());

      // Reset form fields
      setValues({
        dairy_name: "",
        marathi_name: "",
        user_name: "",
        user_phone: "",
        user_city: "",
        user_pincode: "",
        user_password: "",
        confirm_password: "",
        terms: false,
      });

      // Optionally switch to login form
      switchToLogin();
    } else if (status === "failed") {
      toast.error(error || "Registration failed. Please try again.");
      dispatch(reset());
    }
  }, [status, error, dispatch, switchToLogin]);

  return (
    <div className="form-container w70 h1 d-flex-col">
      <form
        onSubmit={handleRegister}
        className="signup-form w100 d-flex-col align-center p10"
      >
        <span className="title t-center">Register Now</span>
        <div className="data-div w100">
          <label htmlFor="dairy_name" className="text">
            Enter Dairy Name <span className="req">*</span>{" "}
          </label>
          <input
            id="dairy_name"
            className={`data ${
              errors.dairy_name || dairyName === false ? "input-error" : ""
            }`}
            type="text"
            name="dairy_name"
            required
            placeholder="smart dairy 2.0"
            value={values.dairy_name}
            onChange={handleInputs}
          />
          {errors.dairy_name && (
            <span className="error-message">Invalid dairy name.</span>
          )}
          {dairyName === false && (
            <span className="error-message">
              Duplicate dairyname, try different.
            </span>
          )}
        </div>
        <div className="data-div w100">
          <label htmlFor="m-name" className="text">
            Marathi Dairy Name <span className="req">*</span>
          </label>
          <input
            id="m-name"
            className={`data ${errors.marathi_name ? "input-error" : ""}`}
            type="text"
            name="marathi_name"
            required
            placeholder="स्मार्ट डेअरी २.०"
            value={values.marathi_name}
            onChange={handleInputs}
          />
          {errors.marathi_name && (
            <span className="error-message">Invalid marathi name.</span>
          )}
        </div>
        <div className="data-outer w100 d-flex sb">
          <div className="data-div-2">
            <label htmlFor="user_name" className="text">
              Enter Username <span className="req">*</span>
            </label>
            <input
              id="user_name"
              className={`data ${
                errors.user_name || userName === false ? "input-error" : ""
              }`}
              type="text"
              name="user_name"
              required
              placeholder="smart dairy"
              value={values.user_name}
              onChange={handleInputs}
            />
            {errors.user_name && (
              <span className="error-message">Invalid username.</span>
            )}
            {userName === false && (
              <span className="error-message">
                Duplicate username, try different.
              </span>
            )}
          </div>

          {/* Phone Number */}
          <div className="data-div-2">
            <label htmlFor="user_phone" className="text">
              Enter Phone Number <span className="req">*</span>
            </label>
            <input
              id="user_phone"
              className={`data ${errors.user_phone ? "input-error" : ""}`}
              type="tel"
              name="user_phone"
              required
              placeholder="99XXXXXXXX"
              value={values.user_phone}
              onChange={handleInputs}
            />
            {errors.user_phone && (
              <span className="error-message">Invalid phone number.</span>
            )}
          </div>
        </div>

        {/* City and Pincode */}
        <div className="data-outer w100 d-flex sb">
          {/* City */}
          <div className="data-div-2">
            <label htmlFor="user_city" className="text">
              Enter City <span className="req">*</span>
            </label>
            <input
              id="user_city"
              className={`data ${errors.user_city ? "input-error" : ""}`}
              type="text"
              name="user_city"
              required
              placeholder="city"
              value={values.user_city}
              onChange={handleInputs}
            />
            {errors.user_city && (
              <span className="error-message">Invalid city name.</span>
            )}
          </div>

          {/* Pincode */}
          <div className="data-div-2">
            <label htmlFor="user_pincode" className="text">
              Enter Pincode <span className="req">*</span>
            </label>
            <input
              id="user_pincode"
              className={`data ${errors.user_pincode ? "input-error" : ""}`}
              type="number"
              name="user_pincode"
              required
              placeholder="Pincode"
              value={values.user_pincode}
              onChange={handleInputs}
            />
            {errors.user_pincode && (
              <span className="error-message">Invalid pincode.</span>
            )}
          </div>
        </div>

        {/* Password and Confirm Password */}
        <div className="data-outer w100 d-flex sb">
          {/* Password */}
          <div className="data-div-2">
            <label htmlFor="user_password" className="text">
              Enter Password <span className="req">*</span>
            </label>
            <input
              id="user_password"
              className={`data ${errors.user_password ? "input-error" : ""}`}
              type="password"
              name="user_password"
              required
              placeholder="Password"
              value={values.user_password}
              onChange={handleInputs}
            />
            {errors.user_password && (
              <span className="error-message">
                Password must be at least 5 characters.
              </span>
            )}
          </div>

          {/* Confirm Password */}
          <div className="data-div-2">
            <label htmlFor="confirm_password" className="text">
              Confirm Password <span className="req">*</span>
            </label>
            <input
              id="confirm_password"
              className={`data ${errors.confirm_password ? "input-error" : ""}`}
              type="password"
              name="confirm_password"
              required
              placeholder="Confirm Password"
              value={values.confirm_password}
              onChange={handleInputs}
            />
            {errors.confirm_password && (
              <span className="error-message">Passwords do not match.</span>
            )}
          </div>
        </div>

        {/* Terms and Conditions */}
        <div className="terms-conditions h10 d-flex center">
          <span className="w100 d-flex text center p10">
            <input
              className={`checkboxx ${errors.terms ? "input-error" : ""}`}
              type="checkbox"
              name="terms"
              checked={values.terms}
              onChange={handleInputs}
            />
            I agree to all terms and conditions.<span className="req">*</span>
          </span>
          {errors.terms && (
            <span className="error-message">You must accept the terms.</span>
          )}
        </div>

        {/* Register Button */}
        <button
          type="submit"
          className="btn w100"
          disabled={status === "loading"}
        >
          {status === "loading" ? "Registering..." : "Register"}
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
