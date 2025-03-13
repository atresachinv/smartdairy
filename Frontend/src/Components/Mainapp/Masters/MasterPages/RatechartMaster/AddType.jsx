import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addRcType,
  fetchMaxRctype,
} from "../../../../../App/Features/Mainapp/Masters/rateChartSlice";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

const AddType = () => {
  const { t } = useTranslation("ratechart");
  const dispatch = useDispatch();
  const tDate = useSelector((state) => state.date.toDate);
  const status = useSelector((state) => state.ratechart.savercstatus);
  const maxRct = useSelector((state) => state.ratechart.maxRcType);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    rccode: "",
    rctype: "",
  });

  // Update rccode when maxRct changes
  useEffect(() => {
    dispatch(fetchMaxRctype());
  }, [dispatch]);

  useEffect(() => {
    if (maxRct) {
      setFormData((prevData) => ({ ...prevData, rccode: maxRct }));
    }
  }, [maxRct]);

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
      case "rctype":
        if (!/^[a-zA-Z0-9\s]+$/.test(value)) {
          error[name] = "Invalid Ratechart Type.";
        } else {
          delete errors[name];
        }
        break;

      case "rccode":
        if (!/^\d$/.test(value.toString())) {
          errors[name] = `Invalid value of ${name}`;
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
    const fieldsToValidate = ["rccode", "rctype"];
    const validationErrors = {};
    fieldsToValidate.forEach((field) => {
      const fieldError = validateField(field, formData[field]);
      Object.assign(validationErrors, fieldError);
    });
    return validationErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate fields before submission
    const validationErrors = validateFields();
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }
    // Dispatch and wait for response
    const result = await dispatch(
      addRcType({
        rccode: parseInt(formData.rccode, 10),
        rctype: formData.rctype,
      })
    ).unwrap(); // Ensure it returns success/failure properly

    if (result.status === 200) {
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
    // Fetch updated data
    dispatch(fetchMaxRctype());
    // Reset form
    setFormData({
      rccode: maxRct,
      rctype: "",
      time: "",
      animalType: "",
    });
    setRate([]);
  };

  return (
    <div className="add-milk-type w100 h1 d-flex-col">
      <span className="heading">{t("rc-add-n-type")} : </span>
      <form
        onSubmit={handleSubmit}
        className="add-type-form-container w100 90 d-flex-col"
      >
        <div className="select-time-animal-type w100 my10 d-flex sb">
          <div className="select-time w25 h1 a-center d-flex ">
            <label htmlFor="rccode" className="info-text w100">
              {t("rc-no")} :
            </label>
            <input
              className="data w100 t-center"
              type="number"
              name="rccode"
              id="rccode"
              value={formData.rccode}
              onChange={handleInput}
              readOnly
            />
          </div>
          <div className="select-animal-type w70 h1 a-center d-flex">
            <label htmlFor="rctype" className="info-text w35">
              {t("rc-type")} :
            </label>
            <input
              className={`data w55 ${errors.rctype ? "input-error" : ""}`}
              type="text"
              name="rctype"
              id="rctype"
              value={formData.rctype}
              onChange={handleInput}
            />
          </div>
        </div>
        <div className="button-div w100 h20 d-flex j-end">
          <button
            type="submit"
            className="btn mx10"
            disabled={status === "loading"}
          >
            {status === "loading" ? `${t("rc-adding")}` : `${t("rc-add-type")}`}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddType;
