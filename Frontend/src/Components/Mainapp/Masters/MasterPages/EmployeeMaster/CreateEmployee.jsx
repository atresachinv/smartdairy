import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Spinner from "../../../../Home/Spinner/Spinner";
import {
  createEmp,
  findEmp,
  listEmployee,
  updateEmp,
} from "../../../../../App/Features/Mainapp/Masters/empMasterSlice";

const CreateEmployee = () => {
  const dispatch = useDispatch();
  const toDate = useSelector((state) => state.date.toDate);
  const empData = useSelector((state) => state.emp.employee);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  console.log("emp", empData);

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
  console.log("form.", formData);

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
        if (!/^[\u0900-\u097F\s]+$/.test(value)) {
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
    const fieldsToValidate = [
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
      Object.assign(validationErrors, fieldError);
    });
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

      // Field-level validation on input change
      const fieldError = validateField(name, value);
      setErrors((prevErrors) => ({
        ...prevErrors,
        ...fieldError,
      }));
    }
  };

  // ................................................................................

  // const setEmpData = async () => {
  //   if (empData && formData.code) {
  //     const updatedData = {
  //       marathi_name: empData.marathi_name || "",
  //       emp_name: empData.emp_name || "",
  //       designation: empData.designation || "",
  //       salary: empData.salary || "",
  //       city: empData.emp_city || "",
  //       tehsil: empData.emp_tel || "",
  //       district: empData.emp_dist || "",
  //       pincode: empData.pincode || "",
  //       bankName: empData.emp_bankname || "",
  //       bank_ac: empData.emp_accno || "",
  //       bankIFSC: empData.emp_ifsc || "",
  //     };
  //     await setFormData((prev) => ({ ...prev, ...updatedData }));
  //   }
  // };

  useEffect(() => {
    if (isEditing && empData) {
      console.log("Populating form with empData:", empData);
      setFormData((prev) => ({
        ...prev,
        marathi_name: empData.marathi_name || "",
        emp_name: empData.emp_name || "",
        designation: empData.designation || "",
        salary: empData.salary || "",
        city: empData.emp_city || "",
        tehsil: empData.emp_tel || "",
        district: empData.emp_dist || "",
        pincode: empData.pincode || "",
        bankName: empData.emp_bankname || "",
        bank_ac: empData.emp_accno || "",
        bankIFSC: empData.emp_ifsc || "",
      }));
    }
  }, [empData]);

  useEffect(() => {
    if (isEditing) {
      // Only search in editing mode
      const handler = setTimeout(() => {
        if (formData.code && formData.code.length >= 1) {
          // Adjust length as necessary
          dispatch(findEmp({ code: formData.code }));
        }
      }, 500);

      return () => clearTimeout(handler); // Clear timeout on cleanup
    }
  }, [formData.code, isEditing]);


  // .................................................................................

  const handleCreateEmployee = (e) => {
    e.preventDefault();

    const validationErrors = validateFields();
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }

    try {
      setIsLoading(true);
      if (isEditing) {
        dispatch(updateEmp(formData));
        toast.success("Employee Updated Successfully!");
      } else {
        dispatch(createEmp(formData));
        toast.success("Employee Created Successfully!");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
      console.error("Error in employee submission:", error);
    } finally {
      // Reset loading state
      setIsLoading(false);
    }
  };

  return (
    <>
      <form
        onSubmit={handleCreateEmployee}
        className={`create-emp-container w60 h90 d-flex sa ${
          isEditing ? "edit-bg" : "bg"
        }`}>
        <div className="emp-details-container w100 h1 d-flex-col sb">
          <div className="tilte-container w100 d-flex a-center sb p10">
            <span className="heading ">
              {isEditing ? "Update Employee" : "Create Employee"}
            </span>
          </div>

          {isEditing ? (
            <div className="emp-div emp-details-div w100 h15 d-flex sb">
              <div className="details-div w25 d-flex-col a-center px10">
                <span className="label-text w100">
                  Employee Code<span className="req">*</span>
                </span>
                <input
                  required
                  className={`data w100 ${errors.code ? "input-error" : ""}`}
                  type="number"
                  name="code"
                  id=""
                  onChange={handleInputChange}
                  value={formData.code || ""}
                />
              </div>
            </div>
          ) : (
            ""
          )}
          <div className="emp-div emp-details-div w100 h15 d-flex sb">
            <div className="details-div w50 d-flex-col a-center px10">
              <span className="label-text w100">
                Employee Marathi Name<span className="req">*</span>{" "}
              </span>
              <input
                required
                className={`data w100 ${
                  errors.marathi_name ? "input-error" : ""
                }`}
                type="text"
                name="marathi_name"
                id=""
                onChange={handleInputChange}
                value={formData.marathi_name || ""}
              />
            </div>
            <div className="details-div w50 d-flex-col a-center px10">
              <span className="label-text w100">
                Employee English Name<span className="req">*</span>
              </span>
              <input
                required
                className={`data w100 ${errors.emp_name ? "input-error" : ""}`}
                type="text"
                name="emp_name"
                id=""
                value={formData.emp_name || ""}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="emp-div emp-details-div w100 h15 d-flex sb">
            {isEditing ? (
              ""
            ) : (
              <div className="details-div w25 d-flex-col a-center px10">
                <span className="label-text w100">
                  Mobile<span className="req">*</span>
                </span>
                <input
                  required
                  className={`data w100 ${errors.mobile ? "input-error" : ""}`}
                  type="number"
                  name="mobile"
                  id=""
                  onChange={handleInputChange}
                  value={formData.mobile || ""}
                />
              </div>
            )}

            <div className="details-div w40 d-flex-col a-center px10">
              <span className="label-text w100">
                Designation<span className="req">*</span>{" "}
              </span>
              <select
                className="data w100"
                name="designation"
                id=""
                onChange={handleInputChange}
                value={formData.designation || ""}>
                <option value="">--Select Designation--</option>
                <option value="manager">Manager</option>
                <option value="milkcollector">Milk Collector</option>
                <option value="mobilecollector">Mobile Milk Collector</option>
                <option value="salesman">Salesman</option>
              </select>
            </div>
            <div className="details-div w30 d-flex-col a-center px10">
              <span className="label-text w100 ">
                Salary<span className="req">*</span>
              </span>
              <input
                required
                className={`data w100 ${errors.salary ? "input-error" : ""}`}
                type="number"
                name="salary"
                id=""
                onChange={handleInputChange}
                value={formData.salary || ""}
              />
            </div>
          </div>
          <div className="emp-div address-details-div w100 h15 d-flex-col sb">
            <span className="label-text px10">Address Details :</span>
            <div className="Address-details w100 h1 d-flex sb">
              <div className="details-div w25 d-flex-col a-center px10">
                <span className="label-text w100 ">
                  City<span className="req">*</span>
                </span>
                <input
                  required
                  className={`data w100 ${errors.city ? "input-error" : ""}`}
                  type="text"
                  name="city"
                  id=""
                  onChange={handleInputChange}
                  value={formData.city || ""}
                />
              </div>
              <div className="details-div w30 d-flex-col a-center px10">
                <span className="label-text w100">
                  Tehsil<span className="req">*</span>{" "}
                </span>
                <input
                  required
                  className={`data w100 ${errors.tehsil ? "input-error" : ""}`}
                  type="text"
                  name="tehsil"
                  id=""
                  onChange={handleInputChange}
                  value={formData.tehsil || ""}
                />
              </div>
              <div className="details-div w30 d-flex-col a-center px10">
                <span className="label-text w100">
                  District<span className="req">*</span>{" "}
                </span>
                <input
                  required
                  className={`data w100 ${
                    errors.district ? "input-error" : ""
                  }`}
                  type="text"
                  name="district"
                  id=""
                  onChange={handleInputChange}
                  value={formData.district || ""}
                />
              </div>
              <div className="details-div w20 d-flex-col a-center px10">
                <span className="label-text w100">
                  Pincode<span className="req">*</span>{" "}
                </span>
                <input
                  required
                  className={`data w100 ${errors.pincode ? "input-error" : ""}`}
                  type="text"
                  name="pincode"
                  onChange={handleInputChange}
                  value={formData.pincode || ""}
                />
              </div>
            </div>
          </div>

          <div className="emp-div Bank-details-div w100 h15 d-flex-col sb">
            <span className="label-text px10">Bank Details :</span>
            <div className="Bank-details w100 h1 d-flex sb">
              <div className="details-div w40 d-flex-col a-center px10">
                <span className="label-text w100 ">Bank Name</span>{" "}
                <input
                  className={`data w100 ${
                    errors.bankName ? "input-error" : ""
                  }`}
                  type="text"
                  name="bankName"
                  id=""
                  onChange={handleInputChange}
                  value={formData.bankName || ""}
                />
              </div>
              <div className="details-div w30 d-flex-col a-center px10">
                <span className="label-text w100">Bank A/C</span>{" "}
                <input
                  className={`data w100 ${errors.bank_ac ? "input-error" : ""}`}
                  type="number"
                  name="bank_ac"
                  id=""
                  onChange={handleInputChange}
                  value={formData.bank_ac || ""}
                />
              </div>
              <div className="details-div w30 d-flex-col a-center px10">
                <span className="label-text w100">Bank IFSC</span>{" "}
                <input
                  className={`data w100 ${
                    errors.bankIFSC ? "input-error" : ""
                  }`}
                  type="text"
                  name="bankIFSC"
                  id=""
                  onChange={handleInputChange}
                  value={formData.bankIFSC || ""}
                />
              </div>
            </div>
          </div>

          {isEditing ? (
            ""
          ) : (
            <div className="emp-div emp-details-div w100 h15 d-flex py10 sb">
              <div className="details-div w50 d-flex-col a-center px10">
                <span className="label-text w100">
                  Enter Password<span className="req">*</span>
                </span>
                <input
                  required
                  className={`data w100 ${
                    errors.password ? "input-error" : ""
                  }`}
                  type="text"
                  name="password"
                  id=""
                  onChange={handleInputChange}
                  value={formData.password || ""}
                />
              </div>
              <div className="details-div w50 d-flex-col a-center px10">
                <span className="label-text w100">
                  Confirm Password<span className="req">*</span>
                </span>
                <input
                  required
                  className={`data w100 ${
                    errors.confirm_pass ? "input-error" : ""
                  }`}
                  type="text"
                  name="confirm_pass"
                  id=""
                  value={formData.confirm_pass || ""}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          )}

          <div className="button-container w50 h15 d-flex  p10  sb">
            <button type="button" className="w-btn" onClick={handleEditClick}>
              {isEditing ? "Cancel" : "Edit"}
            </button>
            <button type="submit" className="btn" disabled={isLoading}>
              {isLoading ? (
                <Spinner />
              ) : isEditing ? (
                "Update Employee"
              ) : (
                "Create Employee"
              )}
            </button>
          </div>
        </div>
      </form>
    </>
  );
};

export default CreateEmployee;