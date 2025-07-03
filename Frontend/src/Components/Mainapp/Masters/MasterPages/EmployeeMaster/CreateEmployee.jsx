import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Spinner from "../../../../Home/Spinner/Spinner";
import {
  createEmp,
  findEmp,
  updateEmp,
} from "../../../../../App/Features/Mainapp/Masters/empMasterSlice";
import "../../../../../Styles/Mainapp/Masters/EmpMaster.css";
import { useTranslation } from "react-i18next";
import { checkuserName } from "../../../../../App/Features/Users/authSlice";

const CreateEmployee = () => {
  const { t } = useTranslation(["master", "common"]);
  const dispatch = useDispatch();
  const toDate = useSelector((state) => state.date.toDate);
  const updateStatus = useSelector((state) => state.emp.updateStatus);
  const createStatus = useSelector((state) => state.emp.createStatus);
  const empData = useSelector((state) => state.emp.employee);
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({});
  const [isAvailable, setIsAvailable] = useState(false);
  const codeRef = useRef(null);
  const mnameRef = useRef(null);
  const enameRef = useRef(null);
  const mobileRef = useRef(null);
  const designationRef = useRef(null);
  const salRef = useRef(null);
  const cityRef = useRef(null);
  const telRef = useRef(null);
  const stateRef = useRef(null);
  const pinRef = useRef(null);
  const bankRef = useRef(null);
  const bankacRef = useRef(null);
  const bankifscRef = useRef(null);
  const passRef = useRef(null);
  const cpassRef = useRef(null);
  const submitbtn = useRef(null);

  const [formData, setFormData] = useState({
    date: toDate,
    code: "",
    marathi_name: "",
    emp_name: "",
    mobile: "",
    designation: "",
    salary: "",
    city: "",
    tehsil: "",
    district: "",
    pincode: "",
    bankName: "",
    bank_ac: "",
    bankIFSC: "",
    password: "",
  });

  const validateField = (name, value) => {
    let error = {};

    switch (name) {
      case "code":
      case "salary":
        if (!/^\d+$/.test(value.toString())) {
          error[name] = "Invalid Cust number.";
        } else {
          delete errors[name];
        }
        break;

      case "marathi_name":
        if (!/^[\u0900-\u097F\sA-Za-z]+$/.test(value)) {
          error[name] = "Invalid Marathi name.";
        } else {
          delete errors[name];
        }
        break;

      case "cust_name":
        if (!/^[a-zA-Z\s]+$/.test(value)) {
          error[name] = "Invalid English name.";
        } else {
          delete errors[name];
        }
        break;

      case "mobile":
        if (!/^\d{10}$/.test(value.toString())) {
          error[name] = "Invalid Mobile number.";
        } else {
          delete errors[name];
        }
        break;

      case "city":
      case "tehsil":
      case "district":
      case "bankName":
        if (!/^[a-zA-Z\s]+$/.test(value)) {
          error[name] = "Invalid name.";
        } else {
          delete errors[name];
        }
        break;

      case "pincode":
        if (!/^\d{6}$/.test(value.toString())) {
          error[name] = "Invalid Pincode.";
        } else {
          delete errors[name];
        }
        break;

      case "bank_ac":
        if (!/^\d+$/.test(value.toString())) {
          error[name] = "Invalid Bank Account.";
        } else {
          delete errors[name];
        }
        break;

      case "bankIFSC":
        if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(value)) {
          error[name] = "Invalid IFSC code.";
        } else {
          delete errors[name];
        }
        break;
      case "password":
        if (value.length < 6) {
          errors[name] = "Password must be at least 6 characters long.";
        } else {
          delete errors[name];
        }
        break;

      case "confirm_pass":
        if (value !== formData.password) {
          errors[name] = "Passwords do not match.";
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
    const fieldsToValidate = isEditing
      ? [
          "marathi_name",
          "emp_name",
          "designation",
          "city",
          "tehsil",
          "district",
          "pincode",
          "salary",
        ]
      : [
          "marathi_name",
          "emp_name",
          "mobile",
          "designation",
          "city",
          "tehsil",
          "district",
          "pincode",
          "salary",
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

  const handleEditClick = () => {
    setIsEditing((prev) => !prev);
    if (!isEditing) {
      setFormData((prevData) => ({
        ...prevData,
        cust_no: "",
      }));
    } else {
      resetForm();
    }
  };

  const resetForm = () => {
    setFormData({
      date: toDate,
      cust_no: "",
      marathi_name: "",
      cust_name: "",
      mobile: "",
      aadhaar_no: "",
      gender: 1,
      city: "",
      tehsil: "",
      district: "",
      pincode: "",
      bankName: "",
      bank_ac: "",
      bankIFSC: "",
      password: "",
    });
    setErrors({});
    setIsEditing(false);
  };

  const handleInputChange = (e) => {
    const { name, type, checked, value } = e.target;

    if (type === "checkbox") {
      setFormData((prevData) => ({
        ...prevData,
        [name]: checked ? 1 : 0, // For checkboxes, set 1 for true, 0 for false
      }));
    } else {
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
    }
  };

  // handle enter press move cursor to next refrence Input -------------------------------->
  const handleKeyDown = (e, nextRef) => {
    if (e.key === "Enter" && nextRef.current) {
      e.preventDefault();
      nextRef.current.focus();
    }
  };
  // ................................................................................

  useEffect(() => {
    if (isEditing && empData) {
      setFormData((prev) => ({
        ...prev,
        marathi_name: empData.marathi_name || "",
        emp_name: empData.emp_name || "",
        designation: empData.designation || "",
        salary: empData.salary || "",
        city: empData.emp_city || "",
        tehsil: empData.emp_tal || "",
        district: empData.emp_dist || "",
        pincode: empData.pincode || "",
        bankName: empData.emp_bankname || "",
        bank_ac: empData.emp_accno || "",
        bankIFSC: empData.emp_ifsc || "",
      }));
    }
  }, [isEditing, empData]);

  useEffect(() => {
    if (isEditing) {
      // Only search in editing mode
      const handler = setTimeout(() => {
        if (formData.code && formData.code.length > 0) {
          // Adjust length as necessary
          dispatch(findEmp({ code: formData.code }));
        }
      }, 500);

      return () => clearTimeout(handler); // Clear timeout on cleanup
    }
  }, [formData.code, isEditing]);

  // checking mobile number is available or not ------------------------------------------->
  //--------------------------------------------------------------------------------------->
  useEffect(() => {
    const check = async () => {
      if (formData.mobile.length === 10) {
        const result = await dispatch(
          checkuserName({ username: formData.mobile })
        ).unwrap();
        setIsAvailable(result.available);
        if (result.available === true) {
          toast.error(
            "मोबाईल नंबर अगोदर वापरलेला आहे, कृपया दुसऱ्या नंबर सह प्रयत्न करा!"
          );
        }
      }
    };

    check();
  }, [formData.mobile]);

  //--------------------------------------------------------------------------------------->
  //  handle employee create and update --------------------------------------------------->
  
  const handleEmployee = async (e) => {
    e.preventDefault();
    // Validate fields before submission
    const validationErrors = validateFields();
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }
    if (isAvailable) {
      return toast.error(
        "मोबाईल नंबर अगोदर वापरलेला आहे, कृपया दुसऱ्या नंबर सह पुन्हा प्रयत्न करा!"
      );
    }

    if (isEditing) {
      const response = await dispatch(updateEmp(formData)).unwrap();

      if (response?.status === 200) {
        toast.success("Employee Updated Successfully!");
      } else {
        toast.error("Failed to update employee!");
      }
    } else {
      const response = await dispatch(createEmp(formData)).unwrap();
      if (response?.status === 200) {
        toast.success("Employee Created Successfully!");
      } else {
        toast.error("Failed to create employee!");
      }
    }
  };

  return (
    <div className="emp-create-update-container w100 h1 d-flex-col center">
      <form
        onSubmit={handleEmployee}
        className={`create-emp-container w60 h1 d-flex sa ${
          isEditing ? "edit-bg" : "bg"
        }`}
      >
        <div className="emp-details-container w100 h1 d-flex-col sb">
          <div className="tilte-container w100 d-flex a-center sb p10">
            <span className="heading">
              {isEditing ? "Update Employee" : "Create Employee"}
            </span>
          </div>

          {isEditing ? (
            <div className="emp-div emp-details-div w100 d-flex sb">
              <div className="details-div w30 d-flex-col px10">
                <label htmlFor="ecode" className="info-text w100">
                  Employee Code<span className="req">*</span>
                </label>
                <input
                  required
                  className={`data w100 ${errors.code ? "input-error" : ""}`}
                  type="number"
                  name="code"
                  id="ecode"
                  onChange={handleInputChange}
                  value={formData.code || ""}
                  onKeyDown={(e) => handleKeyDown(e, mnameRef)}
                  ref={codeRef}
                />
              </div>
            </div>
          ) : (
            ""
          )}
          <div className="emp-name-details-div w100 d-flex sa">
            <div className="details-div w50 d-flex-col a-center px10">
              <label htmlFor="mname" className="info-text w100">
                Marathi Name<span className="req">*</span>{" "}
              </label>
              <input
                required
                className={`data w100 ${
                  errors.marathi_name ? "input-error" : ""
                }`}
                type="text"
                name="marathi_name"
                id="mname"
                onChange={handleInputChange}
                value={formData.marathi_name || ""}
                onKeyDown={(e) => handleKeyDown(e, enameRef)}
                ref={mnameRef}
              />
            </div>
            <div className="details-div w50 d-flex-col a-center px10">
              <label htmlFor="engname" className="info-text w100">
                English Name<span className="req">*</span>
              </label>
              <input
                required
                className={`data w100 ${errors.emp_name ? "input-error" : ""}`}
                type="text"
                name="emp_name"
                id="engname"
                value={formData.emp_name || ""}
                onChange={handleInputChange}
                onKeyDown={(e) => handleKeyDown(e, mobileRef)}
                ref={enameRef}
              />
            </div>
          </div>

          <div className="emp-mds-details-div w100 d-flex sb">
            {isEditing ? (
              ""
            ) : (
              <div className="mobile-details-div w25 d-flex-col a-center px10">
                <label htmlFor="mobile" className="info-text w100">
                  Mobile<span className="req">*</span>
                </label>
                <input
                  required
                  className={`data w100 ${
                    errors.mobile
                      ? "input-error"
                      : isAvailable
                      ? "input-error"
                      : ""
                  }`}
                  type="number"
                  name="mobile"
                  id="mobile"
                  onChange={handleInputChange}
                  value={formData.mobile || ""}
                  onKeyDown={(e) => handleKeyDown(e, designationRef)}
                  ref={mobileRef}
                />
              </div>
            )}

            <div className="desig-details-div w40 d-flex-col a-center px10">
              <label htmlFor="designation" className="info-text w100">
                Designation<span className="req">*</span>{" "}
              </label>
              <select
                className="data w100 "
                name="designation"
                id="designation"
                onChange={handleInputChange}
                value={formData.designation || ""}
                onKeyDown={(e) => handleKeyDown(e, salRef)}
                ref={designationRef}
              >
                <option value="manager">Manager</option>
                <option value="milkcollector">Milk Collector</option>
                <option value="mobilecollector">Mobile Milk Collector</option>
                <option value="salesman">Stock Keeper</option>
              </select>
            </div>
            <div className="sal-details-div w30 d-flex-col a-center px10">
              <label htmlFor="salary" className="info-text w100 ">
                Salary<span className="req">*</span>
              </label>
              <input
                required
                className={`data w100 ${errors.salary ? "input-error" : ""}`}
                type="number"
                name="salary"
                id="salary"
                onChange={handleInputChange}
                value={formData.salary || ""}
                onKeyDown={(e) => handleKeyDown(e, cityRef)}
                ref={salRef}
              />
            </div>
          </div>
          <div className="address-details-div w100 d-flex-col sb">
            <span className="label-text px10">Address Details :</span>
            <div className="Address-details w100 h1 d-flex sb">
              <div className="details-div w25 d-flex-col a-center px10">
                <label htmlFor="city" className="info-text w100 ">
                  City<span className="req">*</span>
                </label>
                <input
                  required
                  className={`data w100 ${errors.city ? "input-error" : ""}`}
                  type="text"
                  name="city"
                  id="city"
                  onChange={handleInputChange}
                  value={formData.city || ""}
                  onKeyDown={(e) => handleKeyDown(e, telRef)}
                  ref={cityRef}
                />
              </div>
              <div className="details-div w30 d-flex-col a-center px10">
                <label htmlFor="tehsil" className="info-text w100">
                  Tehsil<span className="req">*</span>{" "}
                </label>
                <input
                  required
                  className={`data w100 ${errors.tehsil ? "input-error" : ""}`}
                  type="text"
                  name="tehsil"
                  id="tehsil"
                  onChange={handleInputChange}
                  value={formData.tehsil || ""}
                  onKeyDown={(e) => handleKeyDown(e, stateRef)}
                  ref={telRef}
                />
              </div>
              <div className="details-div w30 d-flex-col a-center px10">
                <label htmlFor="dist" className="info-text w100">
                  District<span className="req">*</span>{" "}
                </label>
                <input
                  required
                  className={`data w100 ${
                    errors.district ? "input-error" : ""
                  }`}
                  type="text"
                  name="district"
                  id="disttehsil"
                  onChange={handleInputChange}
                  value={formData.district || ""}
                  onKeyDown={(e) => handleKeyDown(e, pinRef)}
                  ref={stateRef}
                />
              </div>
              <div className="details-div w20 d-flex-col a-center px10">
                <label htmlFor="pincode" className="info-text w100">
                  Pincode<span className="req">*</span>{" "}
                </label>
                <input
                  required
                  className={`data w100 ${errors.pincode ? "input-error" : ""}`}
                  type="text"
                  name="pincode"
                  id="pincode"
                  onChange={handleInputChange}
                  value={formData.pincode || ""}
                  onKeyDown={(e) => handleKeyDown(e, bankRef)}
                  ref={pinRef}
                />
              </div>
            </div>
          </div>

          <div className="Bank-details-div w100 d-flex-col sb">
            <span className="label-text px10">Bank Details :</span>
            <div className="Bank-details w100 h1 d-flex sb">
              <div className="details-div w40 d-flex-col a-center px10">
                <label htmlFor="bank" className="info-text w100 ">
                  Bank Name
                </label>{" "}
                <input
                  className={`data w100 ${
                    errors.bankName ? "input-error" : ""
                  }`}
                  type="text"
                  name="bankName"
                  id="bank"
                  onChange={handleInputChange}
                  value={formData.bankName || ""}
                  onKeyDown={(e) => handleKeyDown(e, bankacRef)}
                  ref={bankRef}
                />
              </div>
              <div className="details-div w30 d-flex-col a-center px10">
                <label htmlFor="acc" className="info-text w100">
                  Bank A/C
                </label>{" "}
                <input
                  className={`data w100 ${errors.bank_ac ? "input-error" : ""}`}
                  type="number"
                  name="bank_ac"
                  id="acc"
                  onChange={handleInputChange}
                  value={formData.bank_ac || ""}
                  onKeyDown={(e) => handleKeyDown(e, bankifscRef)}
                  ref={bankacRef}
                />
              </div>
              <div className="details-div w30 d-flex-col a-center px10">
                <label htmlFor="ifsc" className="info-text w100">
                  Bank IFSC
                </label>{" "}
                <input
                  className={`data w100 ${
                    errors.bankIFSC ? "input-error" : ""
                  }`}
                  type="text"
                  name="bankIFSC"
                  id="ifsc"
                  onChange={handleInputChange}
                  value={formData.bankIFSC || ""}
                  onKeyDown={(e) => handleKeyDown(e, passRef)}
                  ref={bankifscRef}
                />
              </div>
            </div>
          </div>

          {isEditing ? (
            ""
          ) : (
            <div className="emp-pass-details-div w100 d-flex py10 sb">
              <div className="details-div w50 d-flex-col a-center px10">
                <label htmlFor="pass" className="info-text w100">
                  Enter Password<span className="req">*</span>
                </label>
                <input
                  required
                  className={`data w100 ${
                    errors.password ? "input-error" : ""
                  }`}
                  type="password"
                  name="password"
                  id="pass"
                  onChange={handleInputChange}
                  value={formData.password || ""}
                  onKeyDown={(e) => handleKeyDown(e, cpassRef)}
                  ref={passRef}
                />
              </div>
              <div className="details-div w50 d-flex-col a-center px10">
                <label htmlFor="cpass" className="info-text w100">
                  Confirm Password<span className="req">*</span>
                </label>
                <input
                  required
                  className={`data w100 ${
                    errors.confirm_pass ? "input-error" : ""
                  }`}
                  type="password"
                  name="confirm_pass"
                  id="cpass"
                  value={formData.confirm_pass || ""}
                  onChange={handleInputChange}
                  onKeyDown={(e) => handleKeyDown(e, submitbtn)}
                  ref={cpassRef}
                />
              </div>
            </div>
          )}

          <div className="button-container w100 d-flex j-end p10">
            <button
              type="button"
              className="w-btn mx10"
              onClick={handleEditClick}
            >
              {isEditing ? "Cancel" : "Edit"}
            </button>
            {isEditing ? (
              <button
                className="w-btn"
                type="submit"
                disabled={updateStatus === "loading"}
                ref={submitbtn}
              >
                {updateStatus === "loading"
                  ? `${t("m-updating")}`
                  : `${t("m-update")}`}
              </button>
            ) : (
              <button
                className="w-btn"
                type="submit"
                disabled={createStatus === "loading"}
                ref={submitbtn}
              >
                {createStatus === "loading"
                  ? `${t("m-creating")}`
                  : `${t("m-create")}`}
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateEmployee;
