import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Spinner from "../../../Home/Spinner/Spinner";
import {
  createMainLedger,
  getMaxMLCode,
  listMainLedger,
} from "../../../../App/Features/Mainapp/Masters/ledgerSlice";
import "../../../../Styles/Mainapp/Masters/Mainledger.css";
const MainLedger = () => {
  const dispatch = useDispatch();
  const tdate = useSelector((state) => state.date.toDate);
  const maxMlCode = useSelector((state) => state.ledger.maxcodeml);
  const MainLedgers = useSelector((state) => state.ledger.mledgerlist);
  const status = useSelector((state) => state.ledger.cmlStatus);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    date: tdate,
    code: "",
    eng_name: "",
    marathi_name: "",
    category: "",
  });
  useEffect(() => {
    dispatch(getMaxMLCode());
    dispatch(listMainLedger());
  }, [dispatch]);

  useEffect(() => {
    setFormData((prevData) => ({
      ...prevData,
      code: maxMlCode,
      date: tdate,
    }));
  }, [maxMlCode]);

  const validateField = (name, value) => {
    let error = {};

    switch (name) {
      case "code":
        if (!/^\d+$/.test(value.toString())) {
          error[name] = "Invalid ledger code.";
        } else {
          delete errors[name];
        }
        break;

      case "marathi_name":
        if (!/^[\u0900-\u097F\sA-Za-z]+$/.test(value)) {
          error[name] = "Invalid marathi name.";
        } else {
          delete errors[name];
        }
        break;

      case "eng_name":
        if (!/^[a-zA-Z\s]+$/.test(value)) {
          error[name] = "Invalid english name.";
        } else {
          delete errors[name];
        }
        break;

      default:
        break;
    }

    return error;
  };

  const handleSelectChange = (e) => {
    e.preventDefault();
    const category = e.target.value;
    setFormData((prevData) => ({
      ...prevData,
      category: category,
    }));
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

  const validateFields = () => {
    const fieldsToValidate = ["code", "marathi_name", "eng_name", "category"];
    const validationErrors = {};
    fieldsToValidate.forEach((field) => {
      const fieldError = validateField(field, formData[field]);
      Object.assign(validationErrors, fieldError);
    });
    return validationErrors;
  };

  const handleLedgerCreate = async (e) => {
    e.preventDefault();
    // Validate fields before submission
    const validationErrors = validateFields();
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }
    if (!formData.date) {
      toast.error("Please refresh your page!");
    }
    const result = await dispatch(
      createMainLedger({
        date: formData.date,
        code: formData.code,
        eng_name: formData.eng_name,
        marathi_name: formData.marathi_name,
        category: formData.category,
      })
    ).unwrap();
    if (result?.status === 200) {
      const result = await dispatch(getMaxMLCode()).unwrap();
      const res = await dispatch(listMainLedger()).unwrap();
      setFormData({
        eng_name: "",
        marathi_name: "",
        category: "",
      });

      setFormData((prevData) => ({
        ...prevData,
        date: tdate,
      }));

      toast.success("New Main Ledger Created Successfully!");
    } else {
      toast.error("failed to create new ledger!");
    }
  };
  return (
    <div className="main-glmaster-container w100 h1 d-flex-col center p10">
      <span className="heading p10">Add New Ledger Group</span>
      <form
        onSubmit={handleLedgerCreate}
        className="ledger-group-master-div w70 h30 d-flex-col sb bg-light-green br6 my10 p10"
      >
        <div className="gl-master-inside-div w100 h30 d-flex sb px10">
          <div className="first-span-input w15 d-flex a-center sb">
            <span className="w30 label-text">No.</span>
            <input
              className={`w60 data ${errors.code ? "input-error" : ""}`}
              type="text"
              name="code"
              required
              value={formData.code}
              onChange={handleInputChange}
            />
          </div>
          <div className="select-category-container w40 d-flex a-center">
            <select
              name="category"
              id="category"
              className={`data ${errors.category ? "input-error" : ""}`}
              value={formData.category}
              required
              onChange={handleSelectChange}
            >
              <option value="">-- Select Category --</option>
              <option value="1">व्यापारी पत्रक</option>
              <option value="2">नफा - तोटा</option>
              <option value="3">ताळेबंद</option>
              {/* <option value="business-ledger">व्यापारी पत्रक</option>
              <option value="loss-gain">नफा - तोटा</option>
              <option value="balance-sheet">ताळेबंद</option> */}
            </select>
          </div>
        </div>
        <div className="ledger-name-container w100 h30 d-flex sb">
          <div className="ledger-name-div w50 d-flex a-center se">
            <span className="w35 label-text">English Name:</span>
            <input
              className={`w60 data ${errors.eng_name ? "input-error" : ""}`}
              type="text"
              name="eng_name"
              required
              value={formData.eng_name}
              onChange={handleInputChange}
            />
          </div>
          <div className="ledger-name-div w50 d-flex a-center se">
            <span className="w35 label-text">Marathi Name:</span>
            <input
              className={`w60 data ${errors.marathi_name ? "input-error" : ""}`}
              type="text"
              name="marathi_name"
              value={formData.marathi_name}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <div className="input-buttons-div w100 h30 d-flex a-center j-end">
          <button type="reset" className="w-btn mx10">
            Cancel
          </button>
          <button type="submit" className="w-btn" disabled>
            {status === "loading" ? "Saving..." : "Save"}
          </button>
        </div>
      </form>

      <div className="ledger-group-table-conatiner w70 h1 mh100 hidescrollbar d-flex-col bg">
        <div className="ledger-headers-div  w100 p10 d-flex a-center t-center sa bg7 sticky-top br6">
          <span className="f-label-text w10">No.</span>
          <span className="f-label-text w30">Ledger Name</span>
          <span className="f-label-text w30">Marathi Name</span>
          <span className="f-label-text w20">Category</span>
        </div>
        {status === "loading" ? (
          <Spinner />
        ) : MainLedgers.length === 0 ? (
          <div className="box d-flex center">
            <span className="lebel-text">Record not found!</span>
          </div>
        ) : (
          <>
            {MainLedgers.map((ledger, index) => (
              <div
                key={index}
                className="ledger-data-div w100 p10 d-flex a-center t-center sa"
                style={{
                  backgroundColor: index % 2 === 0 ? "#faefe3" : "#fff",
                }}
              >
                <span className="info-text w10">{index + 1}</span>
                <span className="info-text t-start w30">{ledger.gl_name}</span>
                <span className="info-text t-start w30">
                  {ledger.gl_marathi_name}
                </span>
                <span className="info-text t-start w20">
                  {ledger.gl_category === 1
                    ? "व्यापारी पत्रक"
                    : ledger.gl_category === 2
                    ? "नफा - तोटा"
                    : "ताळेबंद"}
                </span>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default MainLedger;
