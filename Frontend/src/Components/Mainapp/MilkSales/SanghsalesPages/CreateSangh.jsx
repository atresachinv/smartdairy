import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Spinner from "../../../Home/Spinner/Spinner";
import { FaEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import Swal from "sweetalert2";
import {
  addSangha,
  updateSangha,
  fetchSanghaList,
  deleteSangha,
} from "../../../../App/Features/Mainapp/Sangha/sanghaSlice";
import "../../../../Styles/Mainapp/MilkSales/MilkSales.css";
const CreateSangh = () => {
  const dispatch = useDispatch();
  const toDate = useSelector((state) => state.date.toDate);
  const createStatus = useSelector((state) => state.sangha.cresanghastatus);
  const updateStatus = useSelector((state) => state.sangha.upsanghastatus);
  const listStatus = useSelector((state) => state.sangha.sanghaliststatus);
  const deleteStatus = useSelector((state) => state.sangha.delsanghastatus);
  const sanghaList = useSelector((state) => state.sangha.sanghaList);
  const sanghData = useSelector((state) => state.emp.employee);
  const [code, setCode] = useState(() => {
    const storedCode = localStorage.getItem("sanghacode");
    return storedCode ? parseInt(storedCode, 10) : 1;
  });

  // ---------------------------------------------------------------->
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    id: "",
    date: toDate,
    scode: "",
    marathi_name: "",
    eng_name: "",
  });

  useEffect(() => {
    if (sanghaList.length === 0) {
      dispatch(fetchSanghaList());
    }
  }, []);

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
        if (!/^[\u0900-\u097F\sA-Za-z,]+$/.test(value)) {
          error[name] = "Invalid Marathi name.";
        } else {
          delete errors[name];
        }
        break;

      case "eng_name":
        if (!/^[a-zA-Z\s,]+$/.test(value)) {
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

  const resetForm = () => {
    setFormData((prevdata) => ({
      ...prevdata,
      date: toDate,
      scode: code,
      marathi_name: "",
      eng_name: "",
    }));
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
          id: formData.id,
          sanghaname: formData.eng_name,
          marathiname: formData.marathi_name,
        })
      ).unwrap();
      if (result.status === 200) {
        setIsEditing((prev) => !prev);
        setFormData((prevData) => ({
          ...prevData,
          id: "",
          date: toDate,
          scode: code,
          marathi_name: "",
          eng_name: "",
        }));
        dispatch(fetchSanghaList());
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
          id: "",
          date: toDate,
          scode: code,
          marathi_name: "",
          eng_name: "",
        }));
        dispatch(fetchSanghaList());
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    }

    setIsLoading(false);
  };

  const handleEditSangha = (sangha) => {
    setFormData({
      id: sangha.id,
      date: toDate,
      scode: sangha.code,
      marathi_name: sangha.marathi_name,
      eng_name: sangha.sangha_name,
    });
    setIsEditing(true);
  };

  //its to delete  invoice based on id
  const handleDeleteSangha = async (id) => {
    const result = await Swal.fire({
      title: "Confirm Deletion?",
      text: "Are you sure you want to delete sangha?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        const res = await dispatch(deleteSangha({ id })).unwrap();
        if (res.status === 200) {
          toast.success("Sangha deleted successfully!");
          dispatch(fetchSanghaList());
        } else {
          toast.error("Failed to delete sangha!");
        }
      } catch (error) {
        toast.error("Server failed to delete the sangha!");
      }
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
          {isEditing ? "संघ माहितीत बदल करा" : "नवीन संघ तयार करा"}
        </span>

        <div className="sangha-details-form-inner-container w100 h90 d-flex a-center se">
          <div className="details-div w10 d-flex-col px10">
            <label htmlFor="ecode" className="info-text w100">
              कोड<span className="req">*</span>
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
              मराठी नाव<span className="req">*</span>
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
              इंग्लिश नाव<span className="req">*</span>
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
            <button type="reset" className="btn mx10" onClick={resetForm}>
              रद्द करा
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
                  ? "बदल करत आहोत..."
                  : "बदल करा"
                : createStatus === "loading"
                ? "सेव्ह करत आहोत..."
                : "सेव्ह करा"}
            </button>
          </div>
        </div>
      </form>
      <div
        onSubmit={handleCreateSangha}
        className={`sangha-list-container w100 h70 d-flex-col se bg`}
      >
        <span className="heading p10">संघ यादी :</span>

        <div className="sangha-list-inner-container w100 h90 mh90 hidescrollbar d-flex-col a-center">
          <div className="sangha-data-container w100 p10 d-flex a-center t-center sb sticky-top bg7">
            <span className="f-label-text w10">कोड</span>
            <span className="f-label-text w40">इंग्लिश नाव</span>
            <span className="f-label-text w40">मराठी नाव</span>
            <span className="f-label-text w40">Action</span>
          </div>

          {listStatus === "loading" ? (
            <Spinner />
          ) : sanghaList.length > 0 ? (
            sanghaList.map((sangha, index) => (
              <div
                key={index}
                className="sangha-data-container w100 p10 d-flex a-center sa"
                style={{
                  backgroundColor: index % 2 === 0 ? "#faefe3" : "#fff",
                }}
              >
                <span className="label-text w10">{sangha.code}</span>
                <span className="label-text w35 t-start">
                  {sangha.sangha_name}
                </span>
                <span className="label-text w35">{sangha.marathi_name}</span>
                <span className="label-text w15 d-flex sa t-center">
                  <FaEdit
                    type="button"
                    onClick={() => handleEditSangha(sangha)}
                  />
                  <MdDeleteForever
                    type="button"
                    className="req"
                    onClick={() => handleDeleteSangha(sangha.id)}
                  />
                </span>
              </div>
            ))
          ) : (
            <div className="box d-flex center">
              <span className="label-text">No records Forund</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateSangh;
