import React, { useEffect, useMemo, useRef, useState } from "react";
import { BsGearFill } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import "../../../Styles/Mainapp/Apphome/Appnavview/Milkcollection.css";
import { useTranslation } from "react-i18next";
import { centersLists } from "../../../App/Features/Dairy/Center/centerSlice";
import { listEmployee } from "../../../App/Features/Mainapp/Masters/empMasterSlice";
import { getLatestRateChart } from "../../../App/Features/Mainapp/Masters/rateChartSlice";
import { getCenterMSales } from "../../../App/Features/Mainapp/Milk/DairyMilkSalesSlice";
const CenterCollection = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation(["milkcollection", "common", "master"]);
  const tDate = useSelector((state) => state.date.toDate);
  const centerList = useSelector((state) => state.center.centersList);
  const Emplist = useSelector((state) => state.emp.emplist || []);
  const milkcollRatechart = useSelector(
    (state) => state.ratechart.latestrChart
  ); // latest rate chart for center milk collection
  const centerRef = useRef(null);
  const collRef = useRef(null);
  const litersRef = useRef(null);
  const fatRef = useRef(null);
  const snfRef = useRef(null);
  const submitbtn = useRef(null);

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [changedDate, setChangedDate] = useState("");

  const initialValues = {
    date: changedDate || tDate,
    centerid: "",
    collectedBy: "",
    shift: "",
    animal: 0,
    liters: "",
    fat: "",
    snf: "",
    degree: 0,
    mobile: "",
    allow: false,
  };

  const [values, setValues] = useState(initialValues);
  //------------------------------------------------------------------------------------------------>
  //------------------------------------------------------------------------------------------------>
  useEffect(() => {
    dispatch(centersLists());
    dispatch(listEmployee());
    dispatch(getLatestRateChart());
  }, []);

  useEffect(() => {
    dispatch(
      getCenterMSales({
        date: values.date,
        centerid: values.centerid,
        collectedBy: values.collectedBy,
        shift: values.shift,
      })
    );
  }, []);

  const handleResetButton = (e) => {
    e.preventDefault();
    setValues(initialValues);
  };

  const validateField = (name, value) => {
    let error = {};
    switch (name) {
      case "liters":
        if (!/^\d+(\.\d{1,2})?$/.test(value.toString())) {
          error[name] = "Invalid liters.";
        } else {
          delete errors[name];
        }
        break;

      case "fat":
      case "snf":
        if (!/^\d+(\.\d{1,1})?$/.test(value.toString())) {
          error[name] = `Invalid ${[name]}.`;
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
      "code",
      "cname",
      "liters",
      "fat",
      "snf",
      "rate",
      "amt",
    ];

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

  //  handle input fields ------------------------------------------------------------------------>
  const handleInputs = (e) => {
    const { name, value } = e.target;

    // Special case: handle date field validation
    if (name === "date") {
      setChangedDate(value);

      // Check if selected date is greater than today's date (tDate)
      if (value > tDate) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          date: "Future dates are not allowed", // You can customize this message
        }));
        return; // Stop here if invalid date
      } else {
        // Clear the date error if it's valid
        setErrors((prevErrors) => {
          const { date, ...rest } = prevErrors;
          return rest;
        });
      }
    }

    // Update values state
    setValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));

    // Validate the field and update error state
    const fieldError = validateField(name, value);
    setErrors((prevErrors) => ({
      ...prevErrors,
      ...fieldError,
    }));
  };

  // used for decimal input correction ---------------------------------------------------------->
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Validate and allow only numeric input with an optional single decimal point
    if (value === "" || /^[0-9]*\.?[0-9]*$/.test(value)) {
      setValues((prev) => ({
        ...prev,
        [name]: value,
      }));

      // Clear previous errors if the input is valid
      setErrors((prevErrors) => {
        const { [name]: removedError, ...rest } = prevErrors;
        return rest; // Remove the specific error for this field
      });
    } else {
      // Set an error for invalid input
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]:
          "Invalid input. Only numbers and one decimal point are allowed.",
      }));
      return; // Stop further processing if input is invalid
    }

    // Normalize the value only when it's a valid integer and greater than 9
    if (/^\d+$/.test(value) && value.length > 1) {
      const normalizedValue = (parseInt(value, 10) / 10).toFixed(1);
      setValues((prev) => ({
        ...prev,
        [name]: normalizedValue,
      }));
    }
  };

  const milkCollectors = useMemo(() => {
    return Emplist.filter(
      (emp) =>
        emp.center_id.toString() === values.centerid &&
        emp.designation === "milkcollector"
    );
  }, [values.centerid, Emplist]);

  // handle enter press move cursor to next refrence Input -------------------------------->
  const handleKeyDown = (e, nextRef) => {
    if (e.key === "Enter" && nextRef.current) {
      e.preventDefault();
      nextRef.current.focus();
    }
  };

  const calculateRateAndAmount = async () => {
    try {
      const { fat, snf, liters, rcName } = values;

      const parsedFat = parseFloat(fat);
      const parsedSnf = parseFloat(snf);
      const parsedLiters = parseFloat(liters);
      const degree = (parsedFat * parsedSnf).toFixed(2);
      const rateEntry = milkcollRatechart.find(
        (entry) => entry.fat === parsedFat && entry.snf === parsedSnf
        // entry.rctypename === rcName
      );

      if (rateEntry) {
        const rate = parseFloat(rateEntry.rate);
        const amount = rate * parsedLiters;

        setValues((prev) => ({
          ...prev,
          rate: rate.toFixed(2),
          amt: amount.toFixed(2),
          degree: 0,
        }));
      } else {
        setValues((prev) => ({
          ...prev,
          rate: 0,
          amt: 0,
          degree: 0,
        }));
      }
    } catch (error) {
      console.error("Error calculating rate and amount:", error);
    }
  };

  // Trigger calculation whenever liters, fat, or snf change
  useEffect(() => {
    if (values.liters && values.fat && values.snf) {
      calculateRateAndAmount();
    }
  }, [values.liters, values.fat, values.snf]);

  const handleCollection = async (e) => {
    e.preventDefault();
    // Validate fields before submission
    const validationErrors = validateFields();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
  };
  // console.log(milkCollectors);

  return (
    <div className="milk-collection-outer-main-container w100 h1 d-flex sb p10">
      <form
        onSubmit={handleCollection}
        className="milk-col-form w60 h1 d-flex-col bg p10"
      >
        <span className="heading w100 t-center py10">
          {values.shift === 0 ? `${t("common:c-mrg")}` : `${t("common:c-eve")}`}{" "}
          {t("m-milkcoll")}
        </span>
        <div className="form-setting w100 h10 d-flex a-center sb ">
          <div className="w60 d-flex a-center px10">
            <label htmlFor="date" className="info-text w30">
              {t("common:c-date")} <span className="req">*</span>{" "}
            </label>
            <input
              className={`data w50 ${errors.date ? "input-error" : ""}`}
              type="date"
              required
              placeholder="0000"
              name="date"
              id="date"
              onChange={handleInputs}
              value={values.date || ""}
              max={tDate}
            />
          </div>
          <div className="setting-btn-switch w20 j-center d-flex">
            <button
              type="button"
              className={`sakalan-time text ${
                values.shift === 0 ? "on" : "off"
              }`}
              name="shift"
              onClick={() =>
                setValues((prev) => ({
                  ...prev,
                  shift: prev.shift === 0 ? 1 : 0,
                }))
              }
            >
              {values.shift === 0 ? t("common:c-mrg") : t("common:c-eve")}
            </button>
          </div>
        </div>
        <div className="user-details w100 h20 d-flex">
          <div className="form-div w50 px10">
            <label htmlFor="centerid" className="info-text">
              सेंटर निवडा : <span className="req">*</span>{" "}
            </label>
            <select
              className={`data`}
              name="centerid"
              id="centerid"
              value={values.centerid}
              onChange={handleInputs}
              ref={centerRef}
              onKeyDown={(e) => handleKeyDown(e, collRef)}
            >
              <option value="">-- select center --</option>
              {centerList.length > 0 ? (
                centerList.map((center, i) => (
                  <option key={i} value={center.center_id}>
                    {center.center_name}
                  </option>
                ))
              ) : (
                <></>
              )}
            </select>
          </div>
          <div className="form-div w50 px10">
            <label htmlFor="collectedBy" className="info-text">
              संकलक निवडा : <span className="req">*</span>{" "}
            </label>
            <select
              className="data"
              name="collectedBy"
              id="collectedBy"
              value={values.collectedBy}
              onChange={handleInputs}
              disabled={!values.centerid}
              ref={collRef}
              onKeyDown={(e) => handleKeyDown(e, litersRef)}
            >
              <option value="">-- select collector--</option>
              {milkCollectors.map((emp, i) => (
                <option key={i} value={emp.emp_mobile}>
                  {emp.emp_name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="milk-details-div w100 h70 d-flex">
          <div className="milk-info w50 h1 d-flex-col">
            <div className="form-div px10">
              <label htmlFor="liters" className="info-text">
                {t("common:c-liters")} <span className="req">*</span>{" "}
              </label>
              <input
                className={`data ${errors.liters ? "input-error" : ""}`}
                type="number"
                required
                placeholder="00.0"
                name="liters"
                id="liters"
                step="any"
                onChange={handleInputs}
                // disabled={!values.collectedBy || !values.centerid}
                value={values.liters}
                onKeyDown={(e) => handleKeyDown(e, fatRef)}
                ref={litersRef}
              />
            </div>
            <div className="form-div  px10">
              <label htmlFor="fat" className="info-text">
                {t("common:c-fat")} <span className="req">*</span>{" "}
              </label>
              <input
                className={`data ${errors.fat ? "input-error" : ""}`}
                type="number"
                required
                placeholder="0.0"
                name="fat"
                id="fat"
                step="any"
                onChange={handleInputChange}
                value={values.fat}
                disabled={!values.liters}
                onKeyDown={(e) => handleKeyDown(e, snfRef)}
                ref={fatRef}
              />
            </div>
            <div className="form-div px10">
              <label htmlFor="snf" className="info-text">
                {t("common:c-snf")} <span className="req">*</span>{" "}
              </label>
              <input
                className={`data ${errors.snf ? "input-error" : ""}`}
                type="number"
                required
                placeholder="00.0"
                name="snf"
                id="snf"
                step="any"
                onChange={handleInputChange}
                value={values.snf}
                disabled={!values.fat || !values.liters}
                onKeyDown={(e) => handleKeyDown(e, submitbtn)}
                ref={snfRef}
              />
            </div>
          </div>
          <div className="milk-info w50 h1 d-flex-col">
            <div className="form-div px10">
              <label htmlFor="degree" className="info-text">
                {t("common:c-deg")} <span className="req">*</span>{" "}
              </label>
              <input
                className={`data ${errors.degree ? "input-error" : ""}`}
                type="number"
                required
                disabled
                placeholder="00.0"
                name="degree"
                id="degree"
                value={values.degree}
                onChange={handleInputs}
              />
            </div>
            <div className="form-div px10">
              <label htmlFor="rate" className="info-text">
                {t("common:c-rate")} <span className="req">*</span>{" "}
              </label>
              <input
                className={`data ${errors.rate ? "input-error" : ""}`}
                type="number"
                required
                readOnly
                placeholder="00.0"
                name="rate"
                id="rate"
                value={values.rate}
              />
            </div>
            <div className="form-div px10">
              <label htmlFor="amt" className="info-text">
                {t("common:c-amt")} <span className="req">*</span>{" "}
              </label>
              <input
                className={`data ${errors.amt ? "input-error" : ""}`}
                type="number"
                required
                readOnly
                placeholder="00.0"
                name="amt"
                id="amt"
                value={values.amt}
              />
            </div>
          </div>
          {/* </div> */}
        </div>
        <div className="form-btns w100 h10 d-flex a-center j-end">
          <button
            className="w-btn label-text"
            type="reset"
            onClick={handleResetButton}
          >
            {t("m-btn-cancel")}
          </button>
          <button
            className="w-btn label-text mx10"
            type="submit"
            ref={submitbtn}
            disabled={loading}
          >
            {loading ? "saving..." : `check`}
          </button>
        </div>
      </form>

      {/* ------------------------------------------------------------------------------------------------------------------ */}
      {/* ------------------------------------------------------------------------------------------------------------------ */}

      <div className="milk-collection-list w38 h1 d-flex-col bg">
        <div className="title-container w100 h10 d-flex a-center sb p10">
          <h2 className="heading">दुध संकलन तफावत:</h2>
        </div>

        <div className="collection-list-container w100 h90 d-flex-col hidescrollbar p10">
          {/* {milkData.length > 0 ? ( */}
          {/* milkData.map((entry, i) => ( */}
          <div
            // key={i}
            className="collection-details w100 h50 d-flex-col bg-light-green br6"
          >
            <div className="coll-user-info w100 h20 d-flex a-center sa p10">
              <span className="text w20">code</span>
              <span className="text w70">cname</span>
            </div>
            <div className="line"></div>
            <div className="coll-milk-info w100 h60 d-flex-col sb">
              <div className="info-title w100 h25 d-flex sa bg1">
                <span className="f-label-text w15 d-flex center">
                  {t("common:c-liters")}
                </span>
                <span className="f-label-text w15 d-flex center">
                  {t("common:c-fat")}
                </span>
                <span className="f-label-text w15 d-flex center">
                  {t("common:c-snf")}
                </span>
                <span className="f-label-text w20 d-flex center">
                  {t("common:c-rate")}
                </span>
                <span className="f-label-text w20 d-flex center">
                  {t("common:c-amt")}
                </span>
              </div>
              <div className="info-value w100 h25 d-flex sa">
                <span className="text w15 d-flex center">liters</span>
                <span className="text w15 d-flex center">fat</span>
                <span className="text w15 d-flex center">snf</span>
                <span className="text w20 d-flex center">rate</span>
                <span className="text w20 d-flex center">amt</span>
              </div>
              <div className="info-value w100 h25 d-flex sa ">
                <span className="text w15 d-flex center">liters</span>
                <span className="text w15 d-flex center">fat</span>
                <span className="text w15 d-flex center">snf</span>
                <span className="text w20 d-flex center">rate</span>
                <span className="text w20 d-flex center">amt</span>
              </div>
              <div className="line"></div>
              <div className="info-value w100 h25 d-flex sa bg7">
                <span className="f-label-text w15 d-flex center">liters</span>
                <span className="f-label-text w15 d-flex center">fat</span>
                <span className="f-label-text w15 d-flex center">snf</span>
                <span className="f-label-text w20 d-flex center">rate</span>
                <span className="f-label-text w20 d-flex center">amt</span>
              </div>
            </div>
          </div>
          {/* )) */}
          {/* ) : ( */}
          <div className="no-records w100 h1 d-flex center">
            <span className="label-text">{t("common:c-no-data-avai")}</span>
          </div>
          {/* )} */}
        </div>
      </div>
    </div>
  );
};

export default CenterCollection;
