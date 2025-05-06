import React, { useState } from "react";
import "../../../Styles/Home/Forms.css";
import { useDispatch, useSelector } from "react-redux";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { toast } from "react-toastify";
import { uUserPassword } from "../../../App/Features/Users/authSlice";

const UpdatePassword = ({switchToLogin }) => {
  const dispatch = useDispatch();
  const userMobile = useSelector((state) => state.users.userInfo.userMobile);
  const status = useSelector((state) => state.users.upassstatus);
  const [showPassword, setShowPassword] = useState(false);
  const [showCPassword, setShowCPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [values, setValue] = useState({
    password: "",
    confirm_pass: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValue((prev) => ({
      ...prev,
      [name]: value,
    }));

    const fieldError = validateField(name, value);
    setErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors, ...fieldError };
      if (!value) delete updatedErrors[name]; // Clear error if field is empty
      return updatedErrors;
    });
  };

  const validateField = (name, value) => {
    const error = {};
    switch (name) {
      case "password":
        if (value === "123456") {
          error.password = "123456 is not allowed to use as Password.";
        } else if (!/^.{6,}$/.test(value)) {
          error.password = "Password must be at least 6 characters.";
        } else {
          delete errors[name];
        }
        break;
      case "confirm_pass":
        if (value !== values.password) {
          error.confirm_pass = "Passwords do not match.";
        } else {
          delete errors[name];
        }
        break;
      default:
        break;
    }
    return error;
  };

  const validateFields = () => {
    const fieldsToValidate = ["password", "confirm_pass"];

    const validationErrors = {};
    fieldsToValidate.forEach((field) => {
      const fieldError = validateField(field, values[field]);
      if (Object.keys(fieldError).length > 0) {
        validationErrors[field] = fieldError[field];
      }
    });

    setErrors(validationErrors);
    return validationErrors;
  };

  const updatePassword = async (e) => {
    e.preventDefault();
    const validationErrors = validateFields();
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }
    const res = await dispatch(
      uUserPassword({
        username: userMobile.username,
        mobile: userMobile.mobile,
        password: values.password,
      })
    ).unwrap();
    if (res?.status === 200) {
      dispatch(
        saveOtptext({
          username: userMobile.username,
          mobile: userMobile.mobile,
          otp: 0,
        })
      );
      switchToLogin();
    } else {
      toast.error("Failed to update password, try again!");
    }
  };

  return (
    <div className="update-password w80 h90 d-flex-col">
      <span className="heading t-center">Update New Password</span>
      <form
        className="login-form w100 h50 d-flex-col"
        onSubmit={updatePassword}
      >
        <div className="center-pass-details-div w100">
          <label htmlFor="pass" className="text w100">
            Enter Password
          </label>
          <div
            className={`password-input-container w100 d-flex a-center ${
              errors.password ? "input-error" : ""
            }`}
          >
            <input
              id="pass"
              className={`pass w90`}
              type={showPassword ? "text" : "password"}
              name="password"
              value={values.password}
              onChange={handleChange}
            />
            <span
              className="eye-icon w10 d-flex a-center"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <IoMdEyeOff className="pss-eye" />
              ) : (
                <IoMdEye className="pss-eye" />
              )}
            </span>
          </div>
        </div>
        <div className="center-pass-details-div w100">
          <label htmlFor="cpass" className="text w100">
            Confirm Password
          </label>
          <div
            className={`password-input-container d-flex a-center ${
              errors.confirm_pass ? "input-error" : ""
            }`}
          >
            <input
              id="cpass"
              className={`pass w90`}
              type={showCPassword ? "text" : "password"}
              name="confirm_pass"
              value={values.confirm_pass}
              onChange={handleChange}
            />
            <span
              className="eye-icon w10 d-flex a-center"
              onClick={() => setShowCPassword(!showCPassword)}
            >
              {showCPassword ? (
                <IoMdEyeOff className="pss-eye" />
              ) : (
                <IoMdEye className="pss-eye" />
              )}
            </span>
          </div>
        </div>

        <button
          className="form-btn my10"
          type="submit"
          disabled={status === "loading"}
        >
          {status === "loading" ? "Updating..." : "Update"}
        </button>
      </form>
    </div>
  );
};

export default UpdatePassword;
