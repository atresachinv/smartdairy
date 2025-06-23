import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { FaEdit } from "react-icons/fa";
import Spinner from "../../../Home/Spinner/Spinner";
import { MdDeleteForever } from "react-icons/md";
import Swal from "sweetalert2";
import {
  createTanker,
  fetchMaxCode,
  getTankerList,
  updateTankerDetails,
} from "../../../../App/Features/Mainapp/Masters/tankerMasterSlice";
import "../../../../Styles/Mainapp/Masters/TankerMaster.css";

const TanckerMaster = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation(["milkcollection", "common"]);
  const tDate = useSelector((state) => state.date.toDate);
  const maxCode = useSelector((state) => state.tanker.maxCode);
  const tankerList = useSelector((state) => state.tanker.tankersList || []);
  const createStatus = useSelector((state) => state.tanker.crestatus);
  const updateStatus = useSelector((state) => state.tanker.upstatus);
  const listStatus = useSelector((state) => state.tanker.liststatus);
  const [errors, setErrors] = useState({});
  const [isEditMode, setIsEditMode] = useState(false);

  const tnoRef = useRef(null);
  const onameRef = useRef(null);
  const contnoRef = useRef(null);
  const tanknoRef = useRef(null);
  const rltrRef = useRef(null);
  const submitbtnRef = useRef(null);

  const initialValues = {
    id: "",
    tno: "",
    ownername: "",
    tankerno: "",
    contactno: "",
    rateltr: "",
  };

  const [values, setValues] = useState(initialValues);

  useEffect(() => {
    dispatch(fetchMaxCode());
    if (tankerList.length === 0) {
      dispatch(getTankerList());
    }
  }, [dispatch]);

  useEffect(() => {
    if (!isEditMode) {
      setValues((prevData) => ({
        ...prevData,
        date: tDate,
        tno: maxCode,
      }));
    }
  }, [maxCode, isEditMode]);

  // Handle input changes
  const handleInputs = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));

    const fieldError = validateField(name, value);

    setErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      if (fieldError[name]) {
        updatedErrors[name] = fieldError[name];
      } else {
        delete updatedErrors[name];
      }
      return updatedErrors;
    });
  };

  const validateField = (name, value) => {
    let error = {};
    switch (name) {
      case "tno":
        if (!/^\d+$/.test(value.toString())) {
          error[name] = "Invalid Bank Code.";
        }
        break;
      case "contactno":
        if (!/^\d{10}$/.test(value.toString())) {
          error[name] = "Invalid Contact Number.";
        }
        break;
      case "ownername":
        if (!/^[a-zA-Z\s]+$/.test(value)) {
          error[name] = `Invalid Doctor Name.`;
        }
        break;
      default:
        break;
    }
    return error;
  };

  const validateFields = () => {
    const fieldsToValidate = ["tno", "ownername", "contactno"];
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

  const handleAddorUpdateTanker = async (e) => {
    e.preventDefault();

    const validationErrors = validateFields();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    if (!values.tno) {
      toast.info("Please add tanker details!");
      return;
    }

    if (isEditMode) {
      // UPDATE Tanker
      const res = await dispatch(updateTankerDetails({ values })).unwrap();
      if (res.status === 200) {
        toast.success("Tanker details updated successfully!");
      } else {
        toast.error("Failed to update tanker!");
      }
    } else {
      // ADD Tanker
      const res = await dispatch(createTanker({ values })).unwrap();
      if (res.status === 200) {
        toast.success("New Tanker Added Successfully!");
      } else {
        toast.error("Failed to add new tanker!");
      }
    }

    dispatch(fetchMaxCode());
    dispatch(getTankerList());
    setValues(initialValues);
    setIsEditMode(false);
  };

  const handleEditTanker = (tanker) => {
    setValues({
      id: tanker?.id,
      tno: tanker?.tno,
      ownername: tanker?.ownername,
      tankerno: tanker?.tankerno,
      conatctno: tanker?.contactno,
      rateltr: tanker?.rateltr,
    });
    setIsEditMode(true);
  };

  const handleDeleteTanker = async (id) => {
    const result = await Swal.fire({
      title: "Confirm Deletion?",
      text: "Are you sure you want to delete tanker details?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        const res = await dispatch(deleteTanker({ id })).unwrap();
        if (res.status === 200) {
          toast.success("Tanker details deleted successfully!");
          dispatch(getTankerList());
        } else {
          toast.error("Failed to delete tanker details!");
        }
      } catch (error) {
        toast.error("Server failed to delete the tanker details!");
      }
    }
  };

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
      <form
        onSubmit={handleAddorUpdateTanker}
        className="tanker-master-form-container w100 h30 d-flex-col a-center sb bg-light-green br9 p10"
      >
        <span className="w100 heading">
          {isEditMode ? "Edit Tanker" : "Add New Tanker"}
        </span>
        <div className="tanker-info-details w100 h30 d-flex a-center sb">
          <div className="tanker-details-code w15 d-flex a-center sb">
            <label htmlFor="tno" className="label-text w100">
              No<span className="req">*</span> :
            </label>
            <input
              type="text"
              className={`data ${errors.tno ? "input-error" : ""}`}
              id="tno"
              name="tno"
              value={values.tno}
              ref={tnoRef}
              readOnly
              onKeyDown={(e) => handleKeyDown(e, onameRef)}
              onChange={handleInputs}
            />
          </div>
          <div className="tanker-details-ownername w50 d-flex a-center sa">
            <label htmlFor="ownername" className="w35 label-text">
              Owner/Driver Name:
            </label>
            <input
              type="text"
              className={`data w60 ${errors.ownername ? "input-error" : ""}`}
              id="ownername"
              name="ownername"
              value={values.ownername}
              ref={onameRef}
              disabled={!values.tno}
              onKeyDown={(e) => handleKeyDown(e, contnoRef)}
              onChange={handleInputs}
            />
          </div>
          <div className="tanker-details-contact w30 d-flex a-center sb">
            <label htmlFor="contactno" className="w50 label-text">
              Contact No. :
            </label>
            <input
              type="number"
              className={`data w50 ${errors.contactno ? "input-error" : ""}`}
              id="contactno"
              name="contactno"
              value={values.contactno}
              ref={contnoRef}
              disabled={!values.tno}
              placeholder="99XXXXXXXXX"
              onKeyDown={(e) => handleKeyDown(e, tanknoRef)}
              onChange={handleInputs}
            />
          </div>
        </div>
        <div className="tanker-info-details2 w100 h30 d-flex a-center sb">
          <div className="tanker-details w50 d-flex a-center sb">
            <div className="tanker-details-tno w50 d-flex a-center sb">
              <label htmlFor="tankerno" className="label-text w100">
                Tanker No. :
              </label>
              <input
                type="text"
                className={`data ${errors.tankerno ? "input-error" : ""}`}
                id="tankerno"
                name="tankerno"
                value={values.tankerno}
                ref={tanknoRef}
                placeholder="MH00MH0000"
                disabled={!values.tno}
                onKeyDown={(e) => handleKeyDown(e, rltrRef)}
                onChange={handleInputs}
              />
            </div>

            <div className="tanker-details-rltr w35 d-flex a-center sb">
              <label htmlFor="rltr" className="label-text w50">
                Rate/Ltr :
              </label>
              <input
                type="text"
                className={`data w50 ${errors.rateltr ? "input-error" : ""}`}
                id="rltr"
                name="rateltr"
                step="any"
                value={values.rateltr}
                ref={rltrRef}
                disabled={!values.tno}
                placeholder="0.00"
                onKeyDown={(e) => handleKeyDown(e, submitbtnRef)}
                onChange={handleInputs}
              />
            </div>
          </div>
          <div className="form-btn-container w20 h1 d-flex a-center sb">
            <button type="reset" className="w-btn mx10" onClick={handleReset}>
              reset
            </button>
            {isEditMode ? (
              <button type="submit" className="w-btn" ref={submitbtnRef}>
                {updateStatus === "loading" ? "Updating..." : "Update"}
              </button>
            ) : (
              <button type="submit" className="w-btn" ref={submitbtnRef}>
                {createStatus === "loading" ? "Creating..." : "Create"}
              </button>
            )}
          </div>
        </div>
      </form>
      <div className="tanker-details-container w100 h70 mh70 hidescrollbar d-flex-col bg">
        <div className="tanker-details-headings w100 p10 d-flex a-center t-center sticky-top bg7 sa">
          <span className="f-label-text w5">No.</span>
          <span className="f-label-text w30">Owener Name</span>
          <span className="f-label-text w15">Conatct No.</span>
          <span className="f-label-text w15">Tanker No.</span>
          <span className="f-label-text w10">Rate/Ltr</span>
          <span className="f-label-text w15">Action</span>
        </div>
        {listStatus === "loading" ? (
          <Spinner />
        ) : tankerList.length > 0 ? (
          tankerList.map((tanker, index) => (
            <div
              key={index}
              className="tanker-details-headings w100 p10 d-flex a-center sa"
              style={{
                backgroundColor: index % 2 === 0 ? "#faefe3" : "#fff",
              }}
            >
              <span className="label-text w5">{tanker?.tno}</span>
              <span className="label-text w30 t-start">
                {tanker?.ownername}
              </span>
              <span className="label-text w15">{tanker?.contactno}</span>
              <span className="label-text w15 t-center">
                {tanker?.tankerno}
              </span>
              <span className="label-text w10 t-end">{tanker?.rateltr}</span>
              <span className="label-text w15 d-flex sa t-center">
                <FaEdit
                  type="button"
                  className="color-icon"
                  onClick={() => handleEditTanker(tanker)}
                />
                <MdDeleteForever
                  type="button"
                  className="req"
                  onClick={() => handleDeleteTanker(tanker?.id)}
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
  );
};

export default TanckerMaster;
