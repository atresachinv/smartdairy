import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { FaEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import Swal from "sweetalert2";
import "../../../../Styles/Mainapp/Masters/DoctorMaster.css";
import {
  addDoctor,
  fetchMaxCode,
  getDoctorList,
  updateDoctorDetails,
} from "../../../../App/Features/Mainapp/Masters/doctorSlice";

const TanckerMaster = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation(["milkcollection", "common"]);
  const tDate = useSelector((state) => state.date.toDate);
  const maxCode = useSelector((state) => state.doctor.maxDrCode);
  const doctorList = useSelector((state) => state.doctor.drList || []);
  const createStatus = useSelector((state) => state.doctor.creStatus);
  const updateStatus = useSelector((state) => state.doctor.upStatus);
  const listStatus = useSelector((state) => state.doctor.listStatus);
  const [errors, setErrors] = useState({});
  const [isEditMode, setIsEditMode] = useState(false);

  const codeRef = useRef(null);
  const nameRef = useRef(null);
  const snameRef = useRef(null);
  const addbuttonRef = useRef(null);

  const initialValues = {
    id: "",
    no: "",
    ownername: "",
    tancker_no: "",
    contact_no: "",
    rate_ltr: "",
  };

  const [values, setValues] = useState(initialValues);

  useEffect(() => {
    dispatch(fetchMaxCode());
    dispatch(getDoctorList());
  }, [dispatch]);

  useEffect(() => {
    if (!isEditMode) {
      setValues((prevData) => ({
        ...prevData,
        date: tDate,
        code: maxCode,
      }));
    }
  }, [maxCode, isEditMode]);

  // Handle input changes
  const handleInputs = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });

    const fieldError = validateField(name, value);
    setErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors, ...fieldError };
      if (!value) delete updatedErrors[name];
      return updatedErrors;
    });
  };

  const validateField = (name, value) => {
    let error = {};
    switch (name) {
      case "no":
        if (!/^\d+$/.test(value.toString())) {
          error[name] = "Invalid Bank Code.";
        } else {
          delete errors[name];
        }
        break;
      case "ownername":
        if (!/^[a-zA-Z\s]+$/.test(value)) {
          error[name] = `Invalid Doctor Name.`;
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

  const handleKeyDown = (e, nextRef) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (nextRef && nextRef.current) {
        nextRef.current.focus();
      }
    }
  };

  const handleAddorUpdateDr = async (e) => {
    e.preventDefault();

    const validationErrors = validateFields();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    if (!values.code || !values.drname) {
      toast.info("Please add tanker details!");
      return;
    }

    if (isEditMode) {
      // UPDATE Bank
      const res = await dispatch(updateDoctorDetails({ values })).unwrap();
      if (res.status === 200) {
        toast.success("Doctor updated successfully!");
      } else {
        toast.error("Failed to update tanker!");
      }
    } else {
      // ADD Bank
      const res = await dispatch(addDoctor({ values })).unwrap();
      if (res.status === 200) {
        toast.success("New Doctor Added Successfully!");
      } else {
        toast.error("Failed to add new tanker!");
      }
    }

    dispatch(fetchMaxCode());
    dispatch(getDoctorList());
    setValues(initialValues);
    setIsEditMode(false);
  };

  const handleEditDoctor = (tanker) => {
    setValues({
      id: tanker.id,
      date: tDate,
      code: tanker.drcode,
      drname: tanker.drname,
      short_name: tanker.short_name,
    });
    setIsEditMode(true);
  };

  //its to delete  invoice based on id
  // const handleDeleteDoctor = async (id) => {
  //   const result = await Swal.fire({
  //     title: "Confirm Deletion?",
  //     text: "Are you sure you want to delete bank?",
  //     icon: "warning",
  //     showCancelButton: true,
  //     confirmButtonColor: "#3085d6",
  //     cancelButtonColor: "#d33",
  //     confirmButtonText: "Yes, delete it!",
  //   });

  //   if (result.isConfirmed) {
  //     try {
  //       const res = await dispatch(deleteBank({ id })).unwrap();
  //       if (res.status === 200) {
  //         toast.success("Bank deleted successfully!");
  //         dispatch(getDoctorList());
  //       } else {
  //         toast.error("Failed to delete bank!");
  //       }
  //     } catch (error) {
  //       toast.error("Server failed to delete the bank!");
  //     }
  //   }
  // };

  const handleReset = () => {
    setValues({
      id: "",
      date: tDate,
      code: maxCode,
      bankname: "",
      branch: "",
      ifsc: "",
    });
    setIsEditMode(false);
  };

  return (
    <div className="tanker-master-container w100 h1 d-flex-col sb p10">
      <span className="heading p10">
        {isEditMode ? "Edit Doctor" : "Add New Doctor"}
      </span>
      <form
        onSubmit={handleAddorUpdateDr}
        className="tanker-master-form-container w100 h15 d-flex a-center sb"
      >
        <div className="tanker-info-details-code w100 h1 d-flex a-center sb">
          <div className="tanker-details-code w10 d-flex-col sb">
            <label htmlFor="code" className="label-text w100">
              No<span className="req">*</span> :
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
          <div className="tanker-details-drname w20 d-flex-col sb">
            <label htmlFor="drname" className="w100 label-text">
              Tancker No.:
            </label>
            <input
              type="text"
              className={`data ${errors.drname ? "input-error" : ""}`}
              id="drname"
              name="drname"
              value={values.drname}
              ref={nameRef}
              disabled={!values.code}
              onKeyDown={(e) => handleKeyDown(e, snameRef)}
              onChange={handleInputs}
            />
          </div>
          <div className="tanker-details-drname w20 d-flex-col sb">
            <label htmlFor="drname" className="w100 label-text">
              Contact No.<span className="req">*</span> :
            </label>
            <input
              type="text"
              className={`data ${errors.drname ? "input-error" : ""}`}
              id="drname"
              name="drname"
              value={values.drname}
              ref={nameRef}
              disabled={!values.code}
              onKeyDown={(e) => handleKeyDown(e, snameRef)}
              onChange={handleInputs}
            />
          </div>
          <div className="tanker-details-drname w15 d-flex-col sb">
            <label htmlFor="rltr" className="label-text w">
              Rate/Ltr :
            </label>
            <input
              type="text"
              className={`data ${errors.short_name ? "input-error" : ""}`}
              id="rltr"
              name="short_name"
              value={values.short_name}
              ref={snameRef}
              disabled={!values.code}
              onKeyDown={(e) => handleKeyDown(e, addbuttonRef)}
              onChange={handleInputs}
            />
          </div>
          <div className="form-btn-container w20 h1 d-flex a-center sb">
            <button type="reset" className="w-btn mx10" onClick={handleReset}>
              reset
            </button>
            {isEditMode ? (
              <button type="submit" className="w-btn" ref={addbuttonRef}>
                {updateStatus === "loading" ? "Updating..." : "Update"}
              </button>
            ) : (
              <button type="submit" className="w-btn" ref={addbuttonRef}>
                {createStatus === "loading" ? "Adding..." : "Add"}
              </button>
            )}
          </div>
        </div>
      </form>
      <div className="tanker-details-container w100 h80 mh80 hidescrollbar d-flex-col bg">
        <div className="tanker-details-headings w100 p10 d-flex a-center t-center sticky-top bg7 sa">
          <span className="f-label-text w10">No.</span>
          <span className="f-label-text w40">Doctor Name</span>
          <span className="f-label-text w20">Short Name</span>
          <span className="f-label-text w15">Action</span>
        </div>
        {listStatus === "loading" ? (
          <Spinner />
        ) : doctorList.length > 0 ? (
          doctorList.map((tanker, index) => (
            <div
              key={index}
              className="tanker-details-headings w100 p10 d-flex a-center sa"
              style={{
                backgroundColor: index % 2 === 0 ? "#faefe3" : "#fff",
              }}
            >
              <span className="label-text w10">{tanker.drcode}</span>
              <span className="label-text w40 t-start">{tanker.drname}</span>
              <span className="label-text w20">{tanker.short_name}</span>
              <span className="label-text w15 d-flex sa t-center">
                <FaEdit
                  type="button"
                  onClick={() => handleEditDoctor(tanker)}
                />
                {/* <MdDeleteForever
                  type="button"
                  onClick={() => handleDeleteDoctor(bank.id)}
                /> */}
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
  );
};

export default TanckerMaster;
