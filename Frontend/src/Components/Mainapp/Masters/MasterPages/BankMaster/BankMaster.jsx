import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { FaEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import Swal from "sweetalert2";
import {
  createBank,
  fetchMaxCode,
  getBankList,
  deleteBank,
  updateBankDetails,
} from "../../../../../App/Features/Mainapp/Masters/bankSlice";
import "../../../../../Styles/Mainapp/Masters/BankMaster.css";

const BankMaster = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation(["milkcollection", "common"]);
  const tDate = useSelector((state) => state.date.toDate);
  const maxCode = useSelector((state) => state.bank.maxCode);
  const bankList = useSelector((state) => state.bank.banksList);
  const createStatus = useSelector((state) => state.bank.creStatus);
  const updateStatus = useSelector((state) => state.bank.upStatus);
  const listStatus = useSelector((state) => state.bank.listStatus);
  const [errors, setErrors] = useState({});
  const [isEditMode, setIsEditMode] = useState(false);

  const codeRef = useRef(null);
  const nameRef = useRef(null);
  const branchRef = useRef(null);
  const ifscRef = useRef(null);
  const addbuttonRef = useRef(null);

  const initialValues = {
    id: "",
    date: "",
    code: "",
    bankname: "",
    branch: "",
    ifsc: "",
  };

  const [values, setValues] = useState(initialValues);

  useEffect(() => {
    dispatch(fetchMaxCode());
    dispatch(getBankList());
  }, []);

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
      case "code":
        if (!/^\d+$/.test(value.toString())) {
          error[name] = "Invalid Bank Code.";
        }
        break;
      case "bankname":
      case "branch":
        if (!/^[a-zA-Z\s]+$/.test(value) || value.length < 3) {
          error[name] = `Invalid ${
            name === "bankname" ? "Bank" : "Branch"
          } Name.`;
        }
        break;
      case "ifsc":
        if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(value)) {
          error[name] = "Invalid IFSC Code.";
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

  const handleAddBank = async (e) => {
    e.preventDefault();

    const validationErrors = validateFields();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    if (!values.code || !values.bankname || !values.ifsc || !values.branch) {
      toast.info("Please add bank details!");
      return;
    }

    if (isEditMode) {
      // UPDATE Bank
      const res = await dispatch(updateBankDetails({ values })).unwrap();
      if (res.status === 200) {
        toast.success("Bank updated successfully!");
      } else {
        toast.error("Failed to update bank!");
      }
    } else {
      // ADD Bank
      const res = await dispatch(createBank({ values })).unwrap();
      if (res.status === 200) {
        toast.success("New Bank Added Successfully!");
      } else {
        toast.error("Failed to add new bank!");
      }
    }

    dispatch(fetchMaxCode());
    dispatch(getBankList());
    setValues(initialValues);
    setIsEditMode(false);
  };

  const handleEditBank = (bank) => {
    setValues({
      id: bank.id,
      date: tDate,
      code: bank.code,
      bankname: bank.name,
      branch: bank.branch,
      ifsc: bank.ifsc,
    });
    setIsEditMode(true);
  };

  //its to delete  invoice based on id
  const handleDeleteBank = async (id) => {
    const result = await Swal.fire({
      title: "Confirm Deletion?",
      text: "Are you sure you want to delete bank?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        const res = await dispatch(deleteBank({ id })).unwrap();
        if (res.status === 200) {
          toast.success("Bank deleted successfully!");
          dispatch(getBankList());
        } else {
          toast.error("Failed to delete bank!");
        }
      } catch (error) {
        toast.error("Server failed to delete the bank!");
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
    <div className="bank-master-container w100 h1 d-flex-col sb p10">
      <span className="heading p10">
        {" "}
        {isEditMode ? "Edit Bank" : "Add New Bank"}
      </span>
      <form
        onSubmit={handleAddBank}
        className="bank-master-form-container w100 h20 d-flex-col a-center sb"
      >
        <div className="bank-info-details-code w100 h50 d-flex a-center sb">
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
        </div>
        <div className="form-btn-container w100 h50 d-flex a-center j-end">
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
      </form>
      <div className="bank-details-container w100 h70 mh70 hidescrollbar d-flex-col bg">
        <div className="bank-details-headings w100 p10 d-flex a-center t-center sticky-top bg7 sa">
          <span className="f-label-text w10">No.</span>
          <span className="f-label-text w30">Name</span>
          <span className="f-label-text w20">Address</span>
          <span className="f-label-text w20">IFSC</span>
          <span className="f-label-text w15">Action</span>
        </div>
        {listStatus === "loading" ? (
          <Spinner />
        ) : bankList.length > 0 ? (
          bankList.map((bank, index) => (
            <div
              key={index}
              className="bank-details-headings w100 p10 d-flex a-center sa"
              style={{
                backgroundColor: index % 2 === 0 ? "#faefe3" : "#fff",
              }}
            >
              <span className="label-text w10">{bank.code}</span>
              <span className="label-text w30 t-start">{bank.name}</span>
              <span className="label-text w20">{bank.branch}</span>
              <span className="label-text w20">{bank.ifsc}</span>
              <span className="label-text w15 d-flex sa t-center">
                <FaEdit type="button" onClick={() => handleEditBank(bank)} />
                <MdDeleteForever
                  type="button"
                  onClick={() => handleDeleteBank(bank.id)}
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

export default BankMaster;
