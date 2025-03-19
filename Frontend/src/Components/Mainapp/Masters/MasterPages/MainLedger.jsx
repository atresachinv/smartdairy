import React, { useState } from "react";
import "../../../../Styles/Mainapp/Masters/Mainledger.css";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
const MainLedger = () => {
  const dispatch = useDispatch();
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    code: "",
    eng_name: "",
    marathi_name: "",
    category: "",
  });

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
  // console.log(formData);
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
    toast.success("saved");
    console.log(formData);
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
              className="w60 data"
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
              className="data"
              value={formData.category}
              required
              onChange={handleSelectChange}
            >
              <option value="">-- Select Category --</option>
              <option value="business-ledger">व्यापारी पत्रक</option>
              <option value="loss-gain">नफा - तोटा</option>
              <option value="balance-sheet">ताळेबंद</option>
            </select>
          </div>
        </div>
        <div className="ledger-name-container w100 h30 d-flex sb">
          <div className="ledger-name-div w50 d-flex a-center se">
            <span className="w35 label-text">English Name:</span>
            <input
              className="w60 data"
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
              className="w60 data"
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
          <button type="submit" className="w-btn">
            Save
          </button>
        </div>
      </form>

      <div className="ledger-group-table-conatiner w70 h1 mh100 hidescrollbar d-flex-col bg">
        <div className="ledger-headers-div  w100 h10 d-flex a-center t-center sa bg7 sticky-top br6">
          <span className="f-label-text w10">No.</span>
          <span className="f-label-text w30">Ledger Name</span>
          <span className="f-label-text w30">Marathi Name</span>
          <span className="f-label-text w20">Category</span>
          <span className="f-label-text w15">Type</span>
        </div>
        <div className="ledger-data-div  w100 h10 d-flex a-center t-center sa">
          <span className="info-text w10">No.</span>
          <span className="info-text w30">Ledger Name</span>
          <span className="info-text w30">Marathi Name</span>
          <span className="info-text w20">Category</span>
          <span className="info-text w15">Type</span>
        </div>
      </div>
    </div>
  );
};

export default MainLedger;
