import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import "../../../../../Styles/Mainapp/Masters/BankMaster.css";
import { createBank } from "../../../../../App/Features/Mainapp/Masters/bankSlice";

const BankMaster = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation(["milkcollection", "common"]);
  const tDate = useSelector((state) => state.date.toDate);
  const [errors, setErrors] = useState({});
  const [bankCode, setBankCode] = useState({});
  const [changedDate, setChangedDate] = useState("");
  const codeRef = useRef(null);
  const nameRef = useRef(null);
  const branchRef = useRef(null);
  const ifscRef = useRef(null);
  const addbuttonRef = useRef(null);

  const initialValues = {
    date: changedDate || tDate,
    code: "",
    bankname: "",
    branch: "",
    ifsc: "",
  };
  const [values, setValues] = useState(initialValues);

  // --------------------------------------------------------------------------------->
  // handle input values ------------------------------------------------------------->

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

      case "bankname":
        if (!/^[a-zA-Z\s]+$/.test(value) || value.length < 3) {
          error[name] = "Invalid Customer Name.";
        } else {
          delete errors[name];
        }
        break;

      case "branch":
        if (!/^[a-zA-Z\s]+$/.test(value) || value.length < 3) {
          error[name] = "Invalid Customer Name.";
        } else {
          delete errors[name];
        }
        break;

      case "ifsc":
        if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(value)) {
          error[name] = "Invalid IFSC code.";
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
    const fieldsToValidate = ["code", "bankname", "branch", "ifsc"];

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

  // ---------------------------------------------------------------------------------->
  // handle form submit --------------------------------------------------------------->

  const handleKeyDown = (e, nextRef) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent form submission
      if (nextRef && nextRef.current) {
        nextRef.current.focus();
      }
    }
  };

  const handleAddBank = (e) => {
    e.preventDefault();

    // Validate fields before submission
    const validationErrors = validateFields();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    if (!values.code || !values.bankname || !values.ifsc || !values.branch) {
      toast.info("Please add bank details!");
      return;
    }

    dispatch(createBank(values));
    console.log(values);
    setValues(initialValues);
    toast.success("New Bank Added Successfully!");
  };

  return (
    <div className="bank-master-container w100 h1 d-flex-col p10">
      <span className="heading p10">Add New Bank</span>
      <form
        onSubmit={handleAddBank}
        className="bank-master-form-container w100 h15 d-flex a-center sa">
        <div className="bank-details-code w10 d-flex-col sb">
          <label htmlFor="code" className="label-text w100">
            Code :
          </label>
          <input
            type="text"
            className={`data ${errors.code ? "input-error" : ""}`}
            id="code"
            name="code"
            value={values.code}
            ref={codeRef}
            onKeyDown={(e) => handleKeyDown(e, nameRef)}
            onChange={handleInputs}
          />
        </div>
        <div className="bank-details-bankname w30 d-flex-col sb">
          <label htmlFor="bankname" className="label-text w">
            Bank Name :
          </label>
          <input
            type="text"
            className={`data ${errors.bankname ? "input-error" : ""}`}
            id="bankname"
            name="bankname"
            value={values.bankname}
            ref={nameRef}
            disabled={!values.code}
            onKeyDown={(e) => handleKeyDown(e, branchRef)}
            onChange={handleInputs}
          />
        </div>
        <div className="bank-details-branch w25 d-flex-col sb">
          <label htmlFor="branch" className="label-text">
            Branch Name :
          </label>
          <input
            type="text"
            className={`data ${errors.branch ? "input-error" : ""}`}
            id="branch"
            name="branch"
            value={values.branch}
            ref={branchRef}
            disabled={!values.bankname}
            onKeyDown={(e) => handleKeyDown(e, ifscRef)}
            onChange={handleInputs}
          />
        </div>
        <div className="bank-details-ifsc w15 d-flex-col sb">
          <label htmlFor="ifsc" className="label-text">
            Bank IFSC :
          </label>
          <input
            type="text"
            className={`data ${errors.ifsc ? "input-error" : ""}`}
            id="ifsc"
            name="ifsc"
            value={values.ifsc}
            ref={ifscRef}
            disabled={!values.branch}
            onKeyDown={(e) => handleKeyDown(e, addbuttonRef)}
            onChange={handleInputs}
          />
        </div>
        <button type="submit" className="add-bank-btn w-btn" ref={addbuttonRef}>
          ADD Bank
        </button>
      </form>
      <div className="bank-details-container w100 h80 mh80 hidescrollbar d-flex-col bg">
        <div className="bank-details-headings w100 h10 d-flex a-center t-center sticky-top bg7 sa">
          <span className="f-label-text w10">No.</span>
          <span className="f-label-text w30">Name</span>
          <span className="f-label-text w20">Address</span>
          <span className="f-label-text w15">IFSC</span>
          <span className="f-label-text w10">Action</span>
        </div>
        <div className="bank-details-headings w100 h10 d-flex a-center sa">
          <span className="label-text w10">1</span>
          <span className="label-text w30 t-start">Bank Of Maharastra</span>
          <span className="label-text w20">Sangamner</span>
          <span className="label-text w15">MAHB0000209</span>
          <span className="label-text w10 t-center">Edit</span>
        </div>
      </div>
    </div>
  );
};

export default BankMaster;
