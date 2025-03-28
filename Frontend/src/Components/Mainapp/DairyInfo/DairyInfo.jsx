import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  resetUpdateState,
  updateDairyDetails,
} from "../../../App/Features/Dairy/registerSlice";
import { toast } from "react-toastify";
import { fetchDairyInfo } from "../../../App/Features/Admin/Dairyinfo/dairySlice";
import "../../../Styles/Mainapp/Dairy/Dairy.css";

const DairyInfo = () => {
  const dispatch = useDispatch();
  const dairyInfo = useSelector((state) => state.dairy.dairyData);
  const status = useSelector((state) => state.register.dairyinfostatus);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    marathiName: "",
    SocietyName: "",
    RegNo: "",
    RegDate: "",
    gstno: "",
    AuditClass: "",
    PhoneNo: "",
    email: "",
    City: "",
    tel: "",
    dist: "",
    PinCode: "",
  });

  useEffect(() => {
    if (dairyInfo) {
      setFormData(dairyInfo);
    }
  }, [dairyInfo]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const validateField = (name, value) => {
    const errors = {};
    switch (name) {
      case "marathi_name":
        if (!/^[\u0900-\u097Fa-zA-Z0-9\s]+$/.test(value)) {
          errors[name] = "Invalid name.";
        } else {
          delete errors.marathi_name;
        }
        break;
      case "center_name":
        if (!/^[a-zA-Z0-9\s]+$/.test(value)) {
          errors[name] = "Invalid name.";
        } else {
          delete errors.center_name;
        }
        break;
      case "auditclass":
        if (!/^[\u0900-\u097Fa-zA-Z\s]+$/.test(value)) {
          errors[name] = "Invalid Audit class.";
        } else {
          delete errors[name];
        }
        break;
      case "gstno":
        if (!/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[A-Z0-9]{3}$/.test(value)) {
          errors[name] =
            "Invalid GST number. It should follow the format: 15 alphanumeric characters.";
        } else {
          delete errors.gstNumber;
        }
        break;
      case "reg_no":
        if (!/^[a-zA-Z0-9\s]{0,19}$/.test(value)) {
          errors.reg_no = "Invalid Register number.";
        } else {
          delete errors.reg_no;
        }
        break;
      case "mobile":
        if (!/^\d{10}$/.test(value)) {
          errors.mobile = "Invalid Mobile number.";
        } else {
          delete errors.mobile;
        }
        break;
      case "email":
        if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value)) {
          errors.email = "Invalid email format.";
        } else {
          delete errors.email;
        }
        break;
      case "city":
      case "tehsil":
      case "district":
        if (!/^[a-zA-Z\s]+$/.test(value)) {
          errors[name] = `Invalid ${name}.`;
        } else {
          delete errors[name];
        }
        break;
      case "pincode":
        if (!/^\d{6}$/.test(value)) {
          errors.pincode = "Invalid pincode.";
        } else {
          delete errors.pincode;
        }
        break;
      default:
        break;
    }
    return errors;
  };

  const validateFields = () => {
    const fieldsToValidate = [
      "marathiName",
      "SocietyName",
      "City",
      "tel",
      "dist",
      "PinCode",
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateFields();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    try {
      const result = await dispatch(updateDairyDetails(formData)).unwrap();
      if (result.status === 200) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch {
      toast.error(`Failed to update dairy information`);
    }
  };

  return (
    <div className="dairy-main-container w100 h1 d-flex-col center sb">
      <span className="heading-text w100 heading t-center py10">
        Dairy Information
      </span>
      <form
        className="dairy-information-div w50 h90 d-flex-col bg p10"
        onSubmit={handleSubmit}
      >
        <div className="dairy-name-div w100 h15 d-flex-col sa">
          <span className="info-text w100 ">Marathi Name : </span>
          <input
            className={`data w100 ${errors.date ? "input-error" : ""}`}
            type="text"
            name="marathiName"
            id="marathiName"
            placeholder="डेरीचे नाव"
            maxlength="150"
            value={formData.marathiName} // Use formData here
            required
            onChange={handleChange}
          />
        </div>
        <div className="dairy-name-div w100 h15 d-flex-col sa">
          <span className="info-text w100 ">English Name :</span>
          <input
            className={`data w100 ${errors.date ? "input-error" : ""}`}
            type="text"
            name="SocietyName"
            placeholder="Dairy Name"
            maxlength="150"
            id="SocietyName"
            value={formData.SocietyName} // Use formData here
            required
            onChange={handleChange}
          />
        </div>
        <div className="dairy-div w100 h15 d-flex sb">
          <div className="regi-no-div w45 h1 d-flex-col sa">
            <span className="info-text w100 ">Register Number :</span>
            <input
              className="data w100"
              type="text"
              name="RegNo"
              id="RegNo"
              maxlength="19"
              value={formData.RegNo}
              onChange={handleChange}
            />
          </div>
          <div className="regi-no-div w45 h1 d-flex-col sb">
            <span className="info-text w100 ">Register Date :</span>
            <input
              className="data w100"
              type="date"
              name="RegDate"
              id="RegDate"
              value={formData.RegDate}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="dairy-div w100 h15 d-flex sb">
          <div className="gst-div w45 h1 d-flex-col sb">
            <span className="info-text w100 ">GST Number :</span>
            <input
              className={`data w100 ${errors.date ? "input-error" : ""}`}
              type="text"
              name="gstno"
              id="gstno"
              maxlength="15"
              value={formData.gstno}
              onChange={handleChange}
            />
          </div>
          <div className="gst-div w45 h1 d-flex-col sb">
            <span className="info-text w100 ">Audit Class :</span>
            <input
              className={`data w100 ${errors.date ? "input-error" : ""}`}
              type="text"
              name="AuditClass"
              id="AuditClass"
              maxlength="2"
              value={formData.AuditClass}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="dairy-div w100 h15 d-flex sb">
          <div className="add-div w45 h1 d-flex-col sb">
            <span className="info-text w100 ">Mobile Number :</span>
            <input
              className={`data w100 ${errors.date ? "input-error" : ""}`}
              type="tel"
              name="PhoneNo"
              id="PhoneNo"
              maxlength="11"
              value={formData.PhoneNo}
              onChange={handleChange}
            />
          </div>
          <div className="gst-div w45 h1 d-flex-col sb">
            <span className="info-text w100 ">Email :</span>
            <input
              className={`data w100 ${errors.date ? "input-error" : ""}`}
              type="email"
              name="email"
              id="email"
              maxlength="30"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="dairy-div w100 h15 d-flex sb">
          <div className="add-div w45 h1 d-flex-col sb ">
            <span className="info-text w100 ">City :</span>
            <input
              className="data w100"
              type="text"
              name="City" // Updated name for this input
              id="city"
              maxlength="15"
              value={formData.City}
              onChange={handleChange}
            />
          </div>
          <div className="add-div w45 h1 d-flex-col sb">
            <span className="info-text w100 ">Tehsil :</span>
            <input
              className={`data w100 ${errors.date ? "input-error" : ""}`}
              type="text"
              name="tel" // Updated name for this input
              maxlength="15"
              value={formData.tel}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="dairy-div w100 h15 d-flex sb">
          <div className="add-div w45 h1 d-flex-col sa">
            <span className="info-text w100 ">District :</span>
            <input
              className="data w100"
              type="text"
              name="dist"
              id="dist"
              maxlength="15"
              value={formData.dist}
              onChange={handleChange}
            />
          </div>
          <div className="add-div w45 h1 d-flex-col sb">
            <span className="info-text w100 ">Pincode :</span>
            <input
              className={`data w100 ${errors.date ? "input-error" : ""}`}
              type="text"
              name="PinCode"
              id="PinCode"
              maxlength="6"
              value={formData.PinCode}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="button-container d-flex w100 h10 my10 center">
          <button
            className="btn w50 h1"
            type="submit"
            disabled={status === "loading"}
          >
            {status === "loading" ? "Updating..." : "Update Dairy Info"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DairyInfo;
