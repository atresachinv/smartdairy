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
  const dairyInfo = useSelector((state) => state.dairy.dairyData || []);
  const status = useSelector((state) => state.register.dairyinfostatus);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    marathiName: "",
    SocietyName: "",
    SocietyCode: "",
    prefix: "",
    startDate: "",
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

  // set dairy information ------------------------------------------------>
  useEffect(() => {
    if (dairyInfo) {
      setFormData((prevData) => ({
        ...prevData,
        marathiName: dairyInfo.marathiName || dairyInfo.marathi_name,
        SocietyName: dairyInfo.SocietyName || dairyInfo.center_name,
        SocietyCode: dairyInfo.SocietyCode || dairyInfo.orgid,
        prefix: dairyInfo.prefix,
        startDate: dairyInfo.startDate || "",
        RegNo: dairyInfo.RegNo || dairyInfo.reg_no,
        RegDate: dairyInfo.RegDate || dairyInfo.reg_date,
        gstno: dairyInfo.gstno || "",
        AuditClass: dairyInfo.AuditClass,
        PhoneNo: dairyInfo.PhoneNo || dairyInfo.mobile,
        email: dairyInfo.email,
        City: dairyInfo.city,
        tel: dairyInfo.tel || dairyInfo.tehsil,
        dist: dairyInfo.dist || dairyInfo.district,
        PinCode: dairyInfo.pincode,
      }));
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

  // handle form submition -------------------------------------------------->
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
    <div className="dairy-main-container w100 h1 d-flex-col center se">
      <span className="heading-text w100 heading t-center py10">
        Dairy Information
      </span>
      <form
        className="dairy-information-div w70 h80 d-flex-col bg-light-green br9 p10 sb"
        onSubmit={handleSubmit}
      >
        <div className="dairy-div w100 h15 d-flex sb">
          <div className="dairy-info-div w45 h1 d-flex-col sa">
            <span className="label-text w100 ">Marathi Name : </span>
            <input
              className={`data w100 ${errors.date ? "input-error" : ""}`}
              type="text"
              name="marathiName"
              id="marathiName"
              placeholder="डेरीचे नाव"
              maxlength="150"
              value={formData.marathiName}
              required
              onChange={handleChange}
            />
          </div>
          <div className="dairy-info-div w45 h1 d-flex-col sa">
            <span className="label-text w100 ">English Name :</span>
            <input
              className={`data w100 ${errors.date ? "input-error" : ""}`}
              type="text"
              name="SocietyName"
              placeholder="Dairy Name"
              maxlength="150"
              id="SocietyName"
              value={formData.SocietyName}
              required
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="dairy-div w100 h15 d-flex sb">
          <div className="dairy-info-div w30 h1 d-flex-col sa">
            <label htmlFor="scode" className="label-text w100 ">
              Dairy Id :
            </label>
            <input
              className="data w100"
              type="text"
              name="SocietyCode"
              id="scode"
              readOnly
              maxlength="4"
              value={formData.SocietyCode}
              onChange={handleChange}
            />
          </div>
          <div className="dairy-info-div w30 h1 d-flex-col sb">
            <label htmlFor="prefix" className="label-text w100 ">
              Dairy Prefix :
            </label>
            <input
              className="data w100"
              type="text"
              name="prefix"
              id="prefix"
              readOnly
              value={formData.prefix}
              onChange={handleChange}
            />
          </div>
          <div className="dairy-info-div w30 h1 d-flex-col sb">
            <span className="label-text w100 ">Start Date :</span>
            <input
              className="data w100"
              type="date"
              name="startDate"
              id="startDate"
              readOnly
              value={formData.startDate.slice(0, 10) || ""}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="dairy-div w100 h15 d-flex sb">
          <div className="dairy-info-div w30 h1 d-flex-col sa">
            <span className="label-text w100 ">Register Number :</span>
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
          <div className="dairy-info-div w30 h1 d-flex-col sb">
            <span className="label-text w100 ">Register Date :</span>
            <input
              className="data w100"
              type="date"
              name="RegDate"
              id="RegDate"
              value={formData.RegDate}
              onChange={handleChange}
            />
          </div>
          <div className="dairy-info-div w30 h1 d-flex-col sb">
            <span className="label-text w100 ">GST Number :</span>
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
        </div>
        <div className="dairy-div w100 h15 d-flex sb">
          <div className="dairy-info-div w30 h1 d-flex-col sb">
            <span className="label-text w100 ">Audit Class :</span>
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
          <div className="dairy-info-div w30 h1 d-flex-col sb">
            <span className="label-text w100 ">Mobile Number :</span>
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
          <div className="dairy-info-div w30 h1 d-flex-col sb">
            <span className="label-text w100 ">Email :</span>
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
          <div className="dairy-info-div w30 h1 d-flex-col sb ">
            <span className="label-text w100 ">City :</span>
            <input
              className="data w100"
              type="text"
              name="City"
              id="city"
              maxlength="15"
              value={formData.City}
              onChange={handleChange}
            />
          </div>
          <div className="dairy-info-div w30 h1 d-flex-col sb">
            <span className="label-text w100 ">Tehsil :</span>
            <input
              className={`data w100 ${errors.date ? "input-error" : ""}`}
              type="text"
              name="tel"
              maxlength="15"
              value={formData.tel}
              onChange={handleChange}
            />
          </div>
          <div className="dairy-info-div w30 h1 d-flex-col sa">
            <span className="label-text w100 ">District :</span>
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
        </div>
        <div className="button-container d-flex w100 h15 my10 center">
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
