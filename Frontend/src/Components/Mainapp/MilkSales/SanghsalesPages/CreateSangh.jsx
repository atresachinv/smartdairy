import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Spinner from "../../../Home/Spinner/Spinner";
import {
  createEmp,
  updateEmp,
} from "../../../../App/Features/Mainapp/Masters/empMasterSlice";
import "../../../../Styles/Mainapp/MilkSales/MilkSales.css"
const CreateSangh = () => {
  const dispatch = useDispatch();
  const toDate = useSelector((state) => state.date.toDate);
  const sanghData = useSelector((state) => state.emp.employee);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    date: toDate,
    code: "",
    marathi_name: "",
    eng_name: "",
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

      case "eng_name":
        if (!/^[a-zA-Z\s]+$/.test(value)) {
          error[name] = "Invalid English name.";
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
    const fieldsToValidate = ["Code", "marathi_name", "eng_name"];
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
        code: "",
      }));
    } else {
      resetForm();
    }
  };

  const resetForm = () => {
    setFormData({
      date: toDate,
      code: "",
      marathi_name: "",
      eng_name: "",
    });
    setErrors({});
    setIsEditing(false);
  };

  const handleInputChange = (e) => {
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

  // ................................................................................

  useEffect(() => {
    if (isEditing && sanghData) {
      setFormData((prev) => ({
        ...prev,
        marathi_name: sanghData.marathi_name || "",
        emp_name: sanghData.emp_name || "",
      }));
    }
  }, [sanghData]);

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

  // .................................................................................

  const handleCreateSangha = (e) => {
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
    <div className="create-sangh-container w100 h1 d-flex-col sb p10">
      <form
        onSubmit={handleCreateSangha}
        className={`create-sangha-form-container w100 h25 d-flex-col se ${
          isEditing ? "edit-bg" : "bg"
        }`}
      >
        <span className="heading p10">
          {isEditing ? "Update Sangha Details" : "Create Sangha"}
        </span>

        <div className="sangha-details-form-inner-container w100 h90 d-flex a-center se">
          <div className="details-div w10 d-flex-col px10">
            <label htmlFor="ecode" className="info-text w100">
              Code<span className="req">*</span>
            </label>
            <input
              required
              className={`data w100 ${errors.code ? "input-error" : ""}`}
              type="number"
              name="code"
              id="ecode"
              onChange={handleInputChange}
              value={formData.code || ""}
            />
          </div>
          <div className="sangha-details-div w40 d-flex-col a-center px10">
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
            />
          </div>
          <div className="sangha-details-div w40 d-flex-col a-center px10">
            <label htmlFor="engname" className="info-text w100">
              English Name<span className="req">*</span>
            </label>
            <input
              required
              className={`data w100 ${errors.eng_name ? "input-error" : ""}`}
              type="text"
              name="eng_name"
              id="engname"
              value={formData.eng_name || ""}
              onChange={handleInputChange}
            />
          </div>
          <div className="button-container w25 h1 d-flex a-center j-end p10">
            <button type="button" className="w-btn" onClick={handleEditClick}>
              {isEditing ? "Cancel" : "Edit"}
            </button>
            <button type="submit" className="btn mx10" disabled={isLoading}>
              {isLoading ? (
                <Spinner />
              ) : isEditing ? (
                "Update Details"
              ) : (
                "Create Sangha"
              )}
            </button>
          </div>
        </div>
      </form>
      <div
        onSubmit={handleCreateSangha}
        className={`sangha-list-container w100 h70 d-flex-col se`}
      >
        <span className="heading p10">
          {isEditing ? "Update Sangha Details" : "Create Sangha"}
        </span>

        <div className="sangha-list-inner-container w100 h90 d-flex-col a-center bg">
          <div className="sangha-heading-container w100 p10 d-flex sb sticky-top bg7 br6">
            <span className="f-label-text t-center w10">Code</span>
            <span className="f-label-text t-center w40">English Name</span>
            <span className="f-label-text t-center w40">Marathi Name</span>
          </div>
          <div className="sangha-data-heading-container w100 p10 d-flex sb">
            <span className="label-text t-center w10">Code</span>
            <span className="label-text t-center w40">English Name</span>
            <span className="label-text t-center w40">Marathi Name</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateSangh;
