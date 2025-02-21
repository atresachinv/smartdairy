/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useRef, useState } from "react";
import { toast } from "react-toastify";
import "../../../../../Styles/Mainapp/MilkSales/MilkSales.css";
import { useDispatch } from "react-redux";
import { createRetailCustomer } from "../../../../../App/Features/Mainapp/Milksales/milkSalesSlice";

const CreateCustomers = ({ clsebtn }) => {
  const dispatch = useDispatch();

  const [errors, setErrors] = useState({});
  const [custno, setCustno] = useState(() => {
    return localStorage.getItem("custno") || 2;
  });

  const initialValues = {
    code: custno || "",
    cname: "",
    mobile: "",
    advance: 0,
  };

  const [values, setValues] = useState(initialValues);

  const validateField = (name, value) => {
    let error = {};

    switch (name) {
      case "code":
        if (!/^\d+$/.test(value.toString())) {
          error[name] = "Invalid Customer code.";
        } else {
          delete errors[name];
        }
        break;

      case "cname":
        if (!/^[a-zA-Z\s]+$/.test(value)) {
          error[name] = "Invalid Customer Name.";
        } else {
          delete errors[name];
        }
        break;

      case "mobile":
        if (!/^\d{10}$/.test(value.toString())) {
          error[name] = "Invalid Mobile Number (10 digits required).";
        } else {
          delete errors[name];
        }
        break;

      case "advance":
        if (value && isNaN(value)) {
          error[name] = "Advance must be a number.";
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
    const fieldsToValidate = ["code", "cname", "mobile", "advance"];
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

  const handleInputs = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });

    // Validate field and update errors state
    const fieldError = validateField(name, value);
    setErrors((prevErrors) => ({
      ...prevErrors,
      ...fieldError,
    }));
  };

  const handlecreateCustomer = (e) => {
    e.preventDefault();

    // Validate fields before submission
    const validationErrors = validateFields();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error("Please fix validation errors before submitting.");
      return;
    }

    dispatch(createRetailCustomer(values));
    setValues(initialValues);
    localStorage.setItem("custno", custno + 1);
    toast.success("Customer Created Successfully!");
    clsebtn(false);
  };

  // Move cursor to the next field on Enter key press
  const handleKeyPress = (e, nextField) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (nextField) {
        nextField.focus();
      }
    }
  };

  return (
    <div className="create-reatil-milksale-customer-container d-flex-col sb center p10 bg">
      <div className="heading-and-close-btn-container w100 d-flex sb px10">
        <span>Create Customer : </span>
        <span
          type="button"
          className="heading span-btn"
          onClick={() => clsebtn(false)}
        >
          X
        </span>
      </div>
      <form className="create-customer-form-container w100 h1 d-flex-col">
        <div className="input-data-container w100 d-flex my10 sb">
          <div className="input-container-col w15 d-flex-col">
            <label htmlFor="code">Code</label>
            <input
              type="number"
              name="code"
              id="code"
              className={`data  ${errors.code ? "input-error" : ""}`}
              value={custno || ""}
              onChange={handleInputs}
              onKeyDown={(e) =>
                handleKeyPress(e, document.getElementById("code"))
              }
            />
          </div>
          <div className="input-container-col w80 d-flex-col">
            <label htmlFor="cname">Customer Name</label>
            <input
              type="text"
              name="cname"
              id="cname"
              className={`data  ${errors.cname ? "input-error" : ""}`}
              required
              onChange={handleInputs}
              onKeyDown={(e) =>
                handleKeyPress(e, document.getElementById("cname"))
              }
            />
          </div>
        </div>
        <div className="input-data-container w100 d-flex my10 sb">
          <div className="input-container-col w45 d-flex-col">
            <label htmlFor="mobile">Mobile</label>
            <input
              type="number"
              name="mobile"
              id="mobile"
              className={`data  ${errors.mobile ? "input-error" : ""}`}
              required
              onChange={handleInputs}
              onKeyDown={(e) =>
                handleKeyPress(e, document.getElementById("mobile"))
              }
            />
          </div>
          <div className="input-container-col w45 d-flex-col">
            <label htmlFor="advance">Advance</label>
            <input
              type="number"
              name="advance"
              id="advance"
              className={`data  ${errors.advance ? "input-error" : ""}`}
              onChange={handleInputs}
              onKeyDown={(e) =>
                handleKeyPress(e, document.getElementById("advance"))
              }
            />
          </div>
        </div>
        <div className="create-reatil-milksale-btn-container w100 h10 py10 d-flex j-end">
          <button type="reset" className="w-btn mx10">
            Reset
          </button>
          <button
            type="submit"
            className="w-btn"
            onClick={handlecreateCustomer}
          >
            Add
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateCustomers;
