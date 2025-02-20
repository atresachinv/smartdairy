/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from "react";
import { BsGearFill } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { IoPersonAddSharp } from "react-icons/io5";
import CreateCustomers from "./CreateCustomers";

const Milksales = ({ switchToSettings }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation(["milkcollection", "common"]);

  const tDate = useSelector((state) => state.date.toDate);
  const token = useSelector((state) => state.notify.fcmToken);
  const [customerList, setCustomerList] = useState([]);
  const [custList, setCustList] = useState({});
  const [milkRateChart, setMilkRatechart] = useState([]);
  const [time, setTime] = useState(true);
  const [errors, setErrors] = useState({});
  const [changedDate, setChangedDate] = useState(tDate);
  const [isModalOpen, setModalOpen] = useState(false);
  const codeInputRef = useRef(null);
  const litersRef = useRef(null);
  const paymodeRef = useRef(null);
  const paidamtRef = useRef(null);
  const submitbtnRef = useRef(null);

  const initialValues = {
    date: tDate || changedDate,
    code: "",
    cname: "",
    time: 0,
    liters: "",
    rate: "",
    amt: "",
    paymode: "",
    paidamt: "",
  };

  const [values, setValues] = useState(initialValues);

  const handleInputs = (e) => {
    const { name, value } = e.target;
    setChangedDate(value);
    setValues({ ...values, [name]: value });
  };

  // used for decimal input correction
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

  // morning evening ----------------------------------------------------------->
  const handleTime = () => {
    setTime((prev) => !prev);
    setValues((prevData) => ({
      ...prevData,
      time: !time ? 0 : 1,
    }));
  };

  // calculating milk amount -------------------------------------------------->

  const calculateMilkAmount = async () => {
    try {
      const { liters } = values;
      const parsedLiters = parseFloat(liters);
      const amount = parsedLiters * 40;
      setValues((prev) => ({
        ...prev,
        rate: 40,
        amt: amount.toFixed(2),
      }));
    } catch (error) {
      console.error("Error in milk amount calculation :", error);
    }
  };

  // Trigger calculation whenever liters change ---------------------------------->
  useEffect(() => {
    if (values.liters) {
      calculateMilkAmount();
    }
  }, [values.liters]);

  // const getToken = () => {
  //   dispatch(fetchFCMTokens({ cust_no: values.code }));
  // };

  // Effect to search for customer when code changes ---------------------------->
  useEffect(() => {
    if (values.code.trim().length > 0) {
      const handler = setTimeout(() => {
        // Ensure `code` has valid content before making API calls
        findCustomerByCode(values.code.trim());
        // getToken();
      }, 500);

      return () => clearTimeout(handler);
    }
  }, [values.code, dispatch]);

  //finding customer name
  const findCustomerByCode = (code) => {
    if (!code) {
      setValues((prev) => ({ ...prev, cname: "" }));
      return;
    }
    // Ensure the code is a string for comparison
    const customer = customerList.find(
      (customer) => customer.srno.toString() === code
    );

    if (customer) {
      setValues((prev) => ({
        ...prev,
        cname: customer.cname,
        acccode: customer.cid,
        rcName: customer.rcName,
      }));
    } else {
      setValues((prev) => ({ ...prev, cname: "" })); // Clear cname if not found
    }
  };

  const handleResetButton = (e) => {
    e.preventDefault();
    setValues(initialValues);
  };

  // Select all the text when input is focused ------------------------------------->
  const handleFocus = (e) => {
    e.target.select();
  };

  // Handle Enter key press to move to the next field ---------------------------------->
  const handleKeyPress = (e, nextField) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (nextField) {
        nextField.focus();
      }
    }
  };

  //Handling Milk Sales --------------------------------------------------------->

  const handleMilksales = async (e) => {
    e.preventDefault();
    try {
      toast.success(`Milk Collection of ${values.cname} saved successfully!`);
      setValues(initialValues);
      codeInputRef.current.focus();
    } catch (error) {
      console.error("Error in saving Milk Sales:", error);
      toast.error(`Error in saving Milk Sales!`);
    }
  };

  return (
    <div className="retail-milk-sales-form-container w100 h1 d-flex center">
      <form
        onSubmit={handleMilksales}
        className="milk-col-form w60 h90 d-flex-col bg p10"
      >
        <span className="heading w100 t-center py10">
          {!time ? `${t("common:c-eve")}` : `${t("common:c-mrg")}`} Milk Sale
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
              // onChange={(e) => setChangedDate(e.target.value)}
              value={values.date || ""}
              max={tDate}
            />
          </div>
          <div className="setting-btn-switch w20 j-center d-flex">
            {/* <span className="text">Morning</span> */}
            <button
              type="button"
              onClick={handleTime}
              className={`sakalan-time text ${time ? "on" : "off"}`}
              aria-pressed={time}
            >
              {time ? `${t("common:c-mrg")}` : `${t("common:c-eve")}`}
            </button>
            {/* <span className="text">Evening</span> */}
          </div>
          <IoPersonAddSharp
            className="color-icon w10"
            onClick={() => setModalOpen(true)}
          />

          {isModalOpen && (
            <div className="model-container w100 d-flex center">
              <CreateCustomers clsebtn={setModalOpen} />
            </div>
          )}
        </div>
        <div className="user-details w100 h20 d-flex">
          <div className="form-div w50 px10">
            <label htmlFor="code" className="info-text">
              {t("m-cust-code")} <span className="req">*</span>{" "}
            </label>
            <input
              className={`data ${errors.code ? "input-error" : ""}`}
              type="number"
              required
              placeholder="0000"
              name="code"
              id="code"
              value={values.code}
              onChange={handleInputs}
            />
          </div>
          <div className="form-div w50 px10">
            <label htmlFor="cname" className="info-text">
              {t("m-cust-name")} <span className="req">*</span>{" "}
            </label>
            <input
              className={`data ${errors.cname ? "input-error" : ""}`}
              type="text"
              required
              placeholder={`${t("m-cust-name")}`}
              name="cname"
              id="cname"
              value={values.cname || ""}
              onChange={handleInputs}
            />
          </div>
        </div>
        <div className="milk-details-div w100 h70 d-flex">
          {/* <span className="label-text">Milk Details : </span> */}
          {/* <div className="milk-details w100 h90 d-flex"> */}
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
                value={values.liters}
                onKeyDown={(e) =>
                  handleKeyPress(e, document.getElementById("paymode"))
                }
                ref={litersRef}
              />
            </div>
            {/* <div className="form-div  px10">
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
                disabled={!values.liters || !values.code}
                onKeyDown={(e) => handleKeyDown(e, snfRef)}
                ref={fatRef}
              />
            </div> */}
            <div className="form-div px10">
              <label htmlFor="paymode" className="info-text">
                Select Payment Mode
              </label>
              <select
                className="data"
                name="paymode"
                id="paymode"
                onKeyDown={(e) =>
                  handleKeyPress(e, document.getElementById("paidamt"))
                }
                onChange={handleInputs}
              >
                <option name="paymode" value="0">
                  Credit
                </option>
                <option name="paymode" value="1">
                  Cash
                </option>
                <option name="paymode" value="2">
                  Online
                </option>
              </select>
            </div>
            <div className="form-div px10">
              <label htmlFor="paidamt" className="info-text">
                paid {t("common:c-amt")} <span className="req">*</span>{" "}
              </label>
              <input
                className={`data ${errors.amt ? "input-error" : ""}`}
                type="number"
                required
                placeholder="00.0"
                name="paidamt"
                id="paidamt"
                step="any"
                onFocus={handleFocus}
                onKeyDown={(e) =>
                  handleKeyPress(e, document.getElementById("submitbtn"))
                }
                ref={paidamtRef}
              />
            </div>
            {/* <div className="form-div px10">
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
                disabled={!values.fat || !values.liters || !values.code}
                ref={snfRef}
              />
            </div> */}
          </div>
          <div className="milk-info w50 h1 d-flex-col">
            {/* <div className="form-div px10">
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
            </div> */}
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
                step="any"
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
            id="submitbtn"
            ref={submitbtnRef}
          >
            {t("m-btn-save")}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Milksales;
