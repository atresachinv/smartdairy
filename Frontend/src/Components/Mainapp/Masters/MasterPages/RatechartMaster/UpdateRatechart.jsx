import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const UpdateRatechart = ({ isSet }) => {
  const tDate = useSelector((state) => state.date.toDate);
  const [errors, setErrors] = useState({});
console.log("alla na data",isSet);

  const [formData, setFormData] = useState({
    amount: "",
    rctype: "",
    time: "",
    animalType: "",
    rcdate: "",
  });

  const handleInput = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

    const validateField = (name, value) => {
      let error = {};

      switch (name) {
        case "amount":
          if (!/^[-+]?[0-9]{1,2}$/.test(value)) {
            error[name] = `Invalid value of ${name}.`;
          } else {
            delete errors[name];
          }
          break;

        case "rcdate":
          // Check if the value is in YYYY-MM-DD format
          if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
            errors[name] = `Invalid value of ${name}.`;
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
        "amount",
        "rcdate",
      ];
      const validationErrors = {};
      fieldsToValidate.forEach((field) => {
        const fieldError = validateField(field, formData[field]);
        Object.assign(validationErrors, fieldError);
      });
      return validationErrors;
    };

  const handleRatechartUpdate = async (e) => {
    e.preventDefault();
    if (!isSet) {
      toast.error("no is set");
    }else{
      toast.success(" isset");
    }
  };

  return (
    <>
      <form
        className="rate-chart-setting-div w100 h1 d-flex-col sa my10"
        onSubmit={handleRatechartUpdate}>
        <span className="heading">Update Selected Ratechart</span>
        <div className="select-time-animal-type w100 h25 d-flex sb">
          <div className="select-time w100 h1 a-center d-flex sb">
            <label htmlFor="amount" className="info-text w70">
              Increase or decrease a specific amount from the selected rate
              chart :
            </label>
            <input
              className="data w20"
              type="text"
              name="amount"
              id="amount"
              value={formData.amount}
              onChange={handleInput}
            />
          </div>
        </div>
        <div className="select-animal-type w100 h1 a-center d-flex j-start">
          <label htmlFor="newdate" className="info-text w40">
            New Ratechart Date:
          </label>
          <input className="data w30 " type="date" name="" id="newdate" />
        </div>
        <div className="button-div w100 h25 d-flex j-end my10">
          <button
            type="submit"
            className="btn mx10"
            disabled={status === "loading"}>
            Update Ratechart
          </button>
        </div>
      </form>
    </>
  );
};

export default UpdateRatechart;
