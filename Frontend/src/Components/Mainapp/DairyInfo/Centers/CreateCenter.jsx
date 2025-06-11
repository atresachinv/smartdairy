import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  centersLists,
  createCenter,
  maxCenterId,
} from "../../../../App/Features/Dairy/Center/centerSlice";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { toast } from "react-toastify";
import "../../../../Styles/Mainapp/Dairy/Center.css";

const CreateCenter = () => {
  const dispatch = useDispatch();
  const dairy_id = useSelector((state) => state.dairy.dairyData.SocietyCode);
  const centerId = useSelector((state) => state.center.maxId.centerId);
  const status = useSelector((state) => state.center.createcstatus);
  const date = useSelector((state) => state.date.toDate);

  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [prefixString, setPrefixString] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showCPassword, setShowCPassword] = useState(false);

  //   // Generate prefix string on component mount
  //   useEffect(() => {
  //     const generatePrefix = () => {
  //       const alphabets = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  //       let prefix = "C";
  //       for (let i = 0; i < 2; i++) {
  //         const randomIndex = Math.floor(Math.random() * alphabets.length);
  //         prefix += alphabets[randomIndex];
  //       }
  //       setPrefixString(prefix);
  //     };
  //
  //     generatePrefix();
  //   }, []);
  
  const initialValues = {
    marathi_name: "",
    center_name: "",
    reg_no: "",
    reg_date: "",
    center_id: centerId || "",
    auditclass: "",
    mobile: "",
    email: "",
    city: "",
    tehsil: "",
    district: "",
    pincode: "",
    password: "",
    confirm_pass: "",
    date: date,
    prefix: prefixString,
  };
  const [formData, setFormData] = useState(initialValues);

  useEffect(() => {
    const generatePrefix = () => {
      const alphabets = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      let prefix = "C";
      for (let i = 0; i < 3; i++) {
        const randomIndex = Math.floor(Math.random() * alphabets.length);
        prefix += alphabets[randomIndex];
      }
      setPrefixString(prefix);
    };
    generatePrefix();
  }, []);

  // Fetch maxCenterId on mount
  useEffect(() => {
    dispatch(maxCenterId(dairy_id)).then(() => setLoading(false));
  }, [dispatch, dairy_id]);

  // Update center_id when loading is complete
  useEffect(() => {
    if (!loading) {
      setFormData((prevData) => ({
        ...prevData,
        center_id: centerId || "",
        prefix: prefixString || "",
      }));
    }
  }, [centerId, loading]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
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
      case "marathi_name":
        if (!/^[\u0900-\u097Fa-zA-Z0-9\s]+$/.test(value)) {
          error[name] = "Invalid name.";
        } else {
          delete errors[name];
        }
        break;
      case "center_name":
        if (!/^[a-zA-Z0-9\s]+$/.test(value)) {
          error[name] = "Invalid name.";
        } else {
          delete errors[name];
        }
        break;
      case "auditclass":
        if (!/^[a-zA-Z\s]+$/.test(value)) {
          error.auditclass = "Invalid Audit class.";
        } else {
          delete errors[name];
        }
        break;
      case "reg_no":
        if (!/^\d{0,19}$/.test(value)) {
          error.reg_no = "Invalid Register number.";
        } else {
          delete errors[name];
        }
        break;
      case "mobile":
        if (!/^\d{10}$/.test(value)) {
          error.mobile = "Invalid Mobile number.";
        } else {
          delete errors[name];
        }
        break;
      case "email":
        if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value)) {
          error.email = "Invalid email format.";
        } else {
          delete errors[name];
        }
        break;
      case "city":
      case "tehsil":
      case "district":
        if (!/^[a-zA-Z\s]+$/.test(value)) {
          error[name] = `Invalid ${name}.`;
        } else {
          delete errors[name];
        }
        break;
      case "password":
        if (value.length < 5) {
          error.password = "Password must be at least 5 characters.";
        } else {
          delete errors[name];
        }
        break;
      case "confirm_pass":
        if (value !== formData.password) {
          error.confirm_pass = "Passwords do not match.";
        } else {
          delete errors[name];
        }
        break;
      case "pincode":
        if (!/^\d{6}$/.test(value)) {
          error.pincode = "Invalid pincode.";
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
    const fieldsToValidate = [
      "marathi_name",
      "center_name",
      "city",
      "tehsil",
      "district",
      "pincode",
      "password",
      "confirm_pass",
    ];

    const validationErrors = {};
    fieldsToValidate.forEach((field) => {
      const fieldError = validateField(field, formData[field]);
      if (Object.keys(fieldError).length > 0) {
        validationErrors[field] = fieldError[field];
      }
    });

    setErrors(validationErrors);
    return validationErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateFields();
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }

    try {
      dispatch(createCenter(formData));
      dispatch(maxCenterId(dairy_id)); // Refresh max center ID
      dispatch(centersLists()); // Refresh list of centers
      setFormData(initialValues);
      toast.success("Center created successfully!");
    } catch (error) {
      toast.error("Failed to create center. Please try again.");
    }
  };

  return (
    <div className="center-main-container w100 h1 d-flex center">
      <form
        className="center-information-div w50 h1 d-flex-col sa bg p10"
        onSubmit={handleSubmit}
      >
        {/* <span className="heading">Create New Dairy Center</span> */}
        <div className="center-name-div w100 h15 d-flex-col sa">
          <label htmlFor="marathi_name" className="info-text w100">
            Marathi Name
          </label>
          <input
            className={`data w100 ${errors.marathi_name ? "input-error" : ""}`}
            type="text"
            name="marathi_name"
            id="marathi_name"
            placeholder="सेंटरचे नाव"
            value={formData.marathi_name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="center-name-div w100 h15 d-flex-col sa">
          <label htmlFor="center_name" className="info-text w100">
            English Name
          </label>
          <input
            className={`data w100 ${errors.center_name ? "input-error" : ""}`}
            type="text"
            name="center_name"
            id="center_name"
            placeholder="Center Name"
            value={formData.center_name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="center-add-data-div w100 h15 d-flex a-center sb">
          <div className="center-details-div center-data w20 d-flex-col sa">
            <label htmlFor="center_id" className="info-text w100">
              Center No.
            </label>
            <input
              className={`data w100 ${errors.center_id ? "input-error" : ""}`}
              type="number"
              name="center_id"
              id="center_id"
              value={formData.center_id}
              onChange={handleChange}
              disabled
              required
            />
          </div>
          <div className="center-details-div center-data w20 d-flex-col sa">
            <label htmlFor="auditclass" className="info-text w100">
              Audit Class
            </label>
            <input
              className={`data w100 ${errors.auditclass ? "input-error" : ""}`}
              type="text"
              name="auditclass"
              id="auditclass"
              value={formData.auditclass}
              onChange={handleChange}
            />
          </div>
          <div className="center-details-div center-data w20 d-flex-col sa">
            <label htmlFor="reg_no" className="info-text w100">
              Register No.
            </label>
            <input
              className={`data w100 ${errors.reg_no ? "input-error" : ""}`}
              type="number"
              name="reg_no"
              id="reg_no"
              value={formData.reg_no}
              onChange={handleChange}
            />
          </div>
          <div className="center-details-div center-data w30 d-flex-col sa">
            <label htmlFor="reg_date" className="info-text w100">
              Register Date
            </label>
            <input
              className={`data w100 ${errors.reg_date ? "input-error" : ""}`}
              type="date"
              name="reg_date"
              id="reg_date"
              value={formData.reg_date}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="center-add-data-div w100 h15 d-flex a-center sb">
          <div className="center-details-div w30 d-flex-col sa">
            <label htmlFor="mobile" className="info-text">
              Mobile
            </label>
            <input
              className={`data w100 ${errors.mobile ? "input-error" : ""}`}
              type="text"
              name="mobile"
              id="mobile"
              value={formData.mobile}
              onChange={handleChange}
            />
          </div>
          <div className="center-details-div w60 d-flex-col sa">
            <label htmlFor="email" className="info-text">
              Email
            </label>
            <input
              className={`data w100 ${errors.email ? "input-error" : ""}`}
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="center-add-data-div w100 h15 d-flex a-center sb">
          <div className="center-details-div center-data w20 d-flex-col sa">
            <label htmlFor="city" className="info-text w100">
              City
            </label>
            <input
              className={`data w100 ${errors.city ? "input-error" : ""}`}
              type="text"
              name="city"
              id="city"
              value={formData.city}
              onChange={handleChange}
            />
          </div>
          <div className="center-details-div center-data w25 d-flex-col sa">
            <label htmlFor="tehsil" className="info-text w100">
              Tehsil
            </label>
            <input
              className={`data w100 ${errors.tehsil ? "input-error" : ""}`}
              type="text"
              name="tehsil"
              id="tehsil"
              value={formData.tehsil}
              onChange={handleChange}
            />
          </div>
          <div className="center-details-div center-data w25 d-flex-col sa">
            <label htmlFor="district" className="info-text w100">
              District
            </label>
            <input
              className={`data w100 ${errors.district ? "input-error" : ""}`}
              type="text"
              name="district"
              id="district"
              value={formData.district}
              onChange={handleChange}
            />
          </div>
          <div className="center-details-div center-data w20 d-flex-col sa">
            <label htmlFor="picode" className="info-text w100">
              Pincode
            </label>
            <input
              className={`data w100 ${errors.pincode ? "input-error" : ""}`}
              type="text"
              name="pincode"
              id="pincode"
              value={formData.pincode}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="add-data-div w100 h10 d-flex a-center my10 sb">
          <div className="center-pass-details-div w45">
            <label htmlFor="pass" className="text w100">
              Password
            </label>
            <div
              className={`password-input-container w100 d-flex a-center ${
                errors.password ? "input-error" : ""
              }`}
            >
              <input
                id="pass"
                className={`pass w90 `}
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
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
          <div className="center-pass-details-div w45">
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
                value={formData.confirm_pass}
                onChange={handleChange}
              />
              <span
                className="eye-icon w10 d-flex a-center"
                onClick={() => setShowCPassword(!showCPassword)} // Toggle password visibility
              >
                {showCPassword ? (
                  <IoMdEyeOff className="pss-eye" />
                ) : (
                  <IoMdEye className="pss-eye" />
                )}
              </span>
            </div>
          </div>
        </div>
        <button
          type="submit"
          className="btn my5"
          disabled={status === "loading"}
        >
          {status === "loading" ? "creating..." : "CREATE"}
        </button>
      </form>
    </div>
  );
};

export default CreateCenter;
