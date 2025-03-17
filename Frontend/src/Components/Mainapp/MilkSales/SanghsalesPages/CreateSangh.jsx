import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Spinner from "../../../Home/Spinner/Spinner";
import { MdDeleteForever } from "react-icons/md";
import "../../../../Styles/Mainapp/MilkSales/MilkSales.css";
import {
  addSangha,
  updateSangha,
} from "../../../../App/Features/Mainapp/Sangha/sanghaSlice";
const CreateSangh = () => {
  const dispatch = useDispatch();
  const toDate = useSelector((state) => state.date.toDate);
  const createStatus = useSelector((state) => state.sangha.cresanghastatus);
  const updateStatus = useSelector((state) => state.sangha.upsanghastatus);
  const listStatus = useSelector((state) => state.sangha.sanghaliststatus);
  const deleteStatus = useSelector((state) => state.sangha.delsanghastatus);
  const SanghaList = useSelector((state) => state.sangha.sanghaList);
  const sanghData = useSelector((state) => state.emp.employee);
  const [code, setCode] = useState(() => {
    const storedCode = localStorage.getItem("sanghacode");
    return storedCode ? parseInt(storedCode, 10) : 1;
  });

  // ---------------------------------------------------------------->
  console.log("SanghaList", SanghaList);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    date: toDate,
    scode: "",
    marathi_name: "",
    eng_name: "",
  });

  useEffect(() => {
    setFormData((prevData) => ({
      ...prevData,
      scode: code,
    }));
  }, [code]);

  // Sangha List ----------------------------------------------------->

  useEffect(() => {
    setFormData((prevData) => ({
      ...prevData,
      scode: code,
    }));
  }, [code]);

  const validateField = (name, value) => {
    let error = {};

    switch (name) {
      case "scode":
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
    const fieldsToValidate = ["sCode", "marathi_name", "eng_name"];
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
        scode: "",
      }));
    } else {
      resetForm();
    }
  };

  const resetForm = () => {
    setFormData({
      date: toDate,
      scode: "",
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
        if (formData.scode && formData.scode.length > 0) {
          // Adjust length as necessary
          dispatch(findEmp({ scode: formData.scode }));
        }
      }, 500);

      return () => clearTimeout(handler); // Clear timeout on cleanup
    }
  }, [formData.scode, isEditing]);

  // handling sangha delete function -------------------------------------------------------------->

  // handle create and update sangha function ----------------------------------------------------->

  const handleCreateSangha = async (e) => {
    e.preventDefault();

    const validationErrors = validateFields();
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);

    if (isEditing) {
      const result = await dispatch(
        updateSangha({
          sanghaname: formData.eng_name,
          marathiname: formData.marathi_name,
        })
      ).unwrap();
      if (result.status === 200) {
        setIsEditing((prev) => !prev);
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } else {
      const result = await dispatch(
        addSangha({
          code: formData.scode,
          sanghaname: formData.eng_name,
          marathiname: formData.marathi_name,
        })
      ).unwrap();
      if (result.status === 200) {
        localStorage.setItem("sanghacode", code + 1);
        setFormData((prevData) => ({
          ...prevData,
          marathi_name: "",
          eng_name: "",
        }));
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    }

    setIsLoading(false);
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
              className={`data w100 ${errors.scode ? "input-error" : ""}`}
              type="number"
              name="scode"
              id="ecode"
              onChange={handleInputChange}
              value={formData.scode || ""}
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
            <button
              type="submit"
              className="btn mx10"
              disabled={
                createStatus === "loading" || updateStatus === "loading"
              }
            >
              {isEditing
                ? updateStatus === "loading"
                  ? "Updating..."
                  : "Update Details"
                : createStatus === "loading"
                ? " Creating..."
                : "Create Sangha"}
            </button>
          </div>
        </div>
      </form>
      <div
        onSubmit={handleCreateSangha}
        className={`sangha-list-container w100 h70 d-flex-col se`}
      >
        <span className="heading p10">Sangha List :</span>

        <div className="sangha-list-inner-container w100 h90 d-flex-col a-center bg">
          <div className="sangha-heading-container w100 p10 d-flex sb sticky-top bg7 br6">
            <span className="f-label-text t-center w10">Code</span>
            <span className="f-label-text t-center w40">English Name</span>
            <span className="f-label-text t-center w40">Marathi Name</span>
            <span className="f-label-text t-center w40">Action</span>
          </div>
          <div className="sangha-data-heading-container w100 p10 d-flex sb">
            <span className="label-text t-center w10">Code</span>
            <span className="label-text t-center w40">English Name</span>
            <span className="label-text t-center w40">Marathi Name</span>
            <span className="label-text t-center w40">
              <MdDeleteForever className="req icons" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateSangh;
