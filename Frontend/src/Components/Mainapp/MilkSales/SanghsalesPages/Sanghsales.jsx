import { useEffect, useMemo, useRef, useState } from "react";
import "../../../../Styles/Sanghsales/Sanghsales.css";
import { useDispatch, useSelector } from "react-redux";
import {
  addsanghaMilkColl,
  fetchSanghaList,
  updatesanghaMilkColl,
} from "../../../../App/Features/Mainapp/Sangha/sanghaSlice";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import "../../../../Styles/Mainapp/Apphome/Appnavview/Milkcollection.css";
import "../../../../Styles/Mainapp/MilkSales/SanghMilkColl.css";
import { getCenterMSales } from "../../../../App/Features/Mainapp/Milk/DairyMilkSalesSlice";
import { getTankerList } from "../../../../App/Features/Mainapp/Masters/tankerMasterSlice";
import { dairydailyLossGain } from "../../../../App/Features/Mainapp/Dairyinfo/milkCollectionSlice";

const Sanghsales = ({ clsebtn, isModalOpen, editData }) => {
  const { t } = useTranslation(["milkcollection", "common", "master"]);
  const dispatch = useDispatch();
  const tDate = useSelector((state) => state.date?.toDate);
  const sanghaList = useSelector((state) => state.sangha?.sanghaList || []);
  const tankerList = useSelector((state) => state.tanker?.tankersList || []);
  const status = useSelector((state) => state.sangha?.addsmstatus);
  const updateStatus = useSelector((state) => state.sangha?.updatesmstatus);
  const sanghaRef = useRef(null);
  const timeRef = useRef(null);
  const fdateRef = useRef(null);
  const tdateRef = useRef(null);
  const litersRef = useRef(null);
  const kplitersRef = useRef(null);
  const nashlitersRef = useRef(null);
  const fatRef = useRef(null);
  const snfRef = useRef(null);
  const rateRef = useRef(null);
  const amtRef = useRef(null);
  const otherChargesRef = useRef(null);
  const submitbtn = useRef(null);
  const [errors, setErrors] = useState({});
  const [changedDate, setChangedDate] = useState("");
  const [tchangedDate, setTChangedDate] = useState("");
  const [sanghaid, setSanghaid] = useState("");

  const initialValues = {
    id: "",
    date: changedDate || tDate,
    todate: tchangedDate || tDate,
    sanghid: "",
    tankerno: "",
    shift: 0,
    liters: "",
    kpliters: "",
    nashliters: "",
    otherCharges: "",
    chilling: "",
    fat: "",
    snf: "",
    rate: "",
    amt: "",
  };

  const [values, setValues] = useState(initialValues);

  //------------------------------------------------------------------------------------------------>
  //------------------------------------------------------------------------------------------------>

  useEffect(() => {
    setValues((prev) => ({
      ...prev,
      sanghid: sanghaid,
    }));
  }, [sanghaid]);

  useEffect(() => {
    dispatch(fetchSanghaList());
    // dispatch(
    //   dairydailyLossGain({ fromDate: "2025-05-01", toDate: "2025-05-01" })
    // );
    if (tankerList.length === 0) {
      dispatch(getTankerList());
    }
  }, []);

  // set data to edit information ------------------------->
  useEffect(() => {
    if (editData) {
      setValues({
        id: editData?.id,
        shift: editData?.shift,
        date: editData?.colldate?.slice(0, 10) || "",
        todate: editData?.tocolldate?.slice(0, 10) || "",
        sanghid: editData?.sanghid,
        liters: editData?.liter,
        kpliters: editData?.kamiprat_ltr,
        nashliters: editData?.nash_ltr,
        otherCharges: editData?.otherCharges,
        chilling: editData?.chilling,
        fat: editData?.fat,
        snf: editData?.snf,
        rate: editData?.rate,
        amt: editData?.amt,
      });
    }
  }, [editData]);

  const handleResetButton = (e) => {
    e.preventDefault();
    setValues((prev) => ({
      ...prev,
      id: "",
      liters: "",
      kpliters: "",
      nashliters: "",
      otherCharges: "",
      chilling: "",
      fat: "",
      snf: "",
      rate: "",
      amt: "",
    }));
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
    } else if (name === "todate") {
      setTChangedDate(value);
    }

    // Update values state
    setValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));

    // Validate the field and update error state
    const fieldError = validateField(name, value);
    setErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors, ...fieldError };
      if (!value) delete updatedErrors[name];
      return updatedErrors;
    });
  };

  // used for decimal input correction ----------------------------------------------------------->
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

  // handle enter press move cursor to next refrence Input -------------------------------------->
  const handleKeyDown = (e, nextRef) => {
    if (e.key === "Enter" && nextRef.current) {
      e.preventDefault();
      nextRef.current.focus();
    }
  };

  // const calculateRateAndAmount = async () => {
  //   try {
  //     const { fat, snf, liters, rcName } = values;

  //     const parsedFat = parseFloat(fat);
  //     const parsedSnf = parseFloat(snf);
  //     const parsedLiters = parseFloat(liters);
  //     const degree = (parsedFat * parsedSnf).toFixed(2);
  //     const rateEntry = milkcollRatechart.find(
  //       (entry) => entry.fat === parsedFat && entry.snf === parsedSnf
  //       // entry.rctypename === rcName
  //     );

  //     if (rateEntry) {
  //       const rate = parseFloat(rateEntry.rate);
  //       const amount = rate * parsedLiters;

  //       setValues((prev) => ({
  //         ...prev,
  //         rate: rate.toFixed(2),
  //         amt: amount.toFixed(2),
  //         degree: 0,
  //       }));
  //     } else {
  //       setValues((prev) => ({
  //         ...prev,
  //         rate: 0,
  //         amt: 0,
  //         degree: 0,
  //       }));
  //     }
  //   } catch (error) {
  //     console.error("Error calculating rate and amount:", error);
  //   }
  // };
  const calculateRateAndAmount = async () => {
    try {
      const { liters, rate } = values;

      const parsedRate = parseFloat(rate);
      const parsedLiters = parseFloat(liters);
      const Amount = (parsedLiters * parsedRate).toFixed(2);

      setValues((prev) => ({
        ...prev,
        amt: Amount,
      }));
    } catch (error) {
      console.error("Error calculating rate and amount:", error);
    }
  };

  // Trigger calculation whenever liters, fat, or snf change
  useEffect(() => {
    if (values.liters && values.rate) {
      calculateRateAndAmount();
    }
  }, [values.liters, values.rate]);

  const handleSanghaSales = async (e) => {
    e.preventDefault();

    const validationErrors = validateFields();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const res = await dispatch(addsanghaMilkColl(values)).unwrap();

      if (res.status === 200) {
        toast.success("संघ दुध संकलन यशस्वीरित्या सेव्ह झाले आहे.");

        setValues((prev) => ({
          ...prev,
          id: "",
          liters: "",
          kpliters: "",
          nashliters: "",
          otherCharges: "",
          chilling: "",
          fat: "",
          snf: "",
          rate: "",
          amt: "",
        }));

        setChangedDate("");
        setErrors({});
      } else {
        toast.error("संघ दुध संकलन सेव्ह करण्यात अयशस्वी.");
      }
    } catch (err) {
      if (err?.status === 400) {
        toast.error(
          "डुप्लिकेट संघ दुध संकलन मिळाले, संकलन सेव्ह करण्यात अयशस्वी."
        );
      } else {
        toast.error("संघ दुध संकलन सेव्ह करण्यात अयशस्वी.");
      }
    }
  };

  // handle milk collection edit ---------------------------------------------------------------->
  const handleSanghaMilkEdit = async (e) => {
    e.preventDefault();

    const validationErrors = validateFields();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const res = await dispatch(updatesanghaMilkColl(values)).unwrap();

      if (res.status === 200) {
        toast.success("संघ दुध संकलनातील बदल सेव्ह केले आहेत.");

        setValues({
          id: "",
          date: changedDate,
          todate: tchangedDate,
          sanghid: sanghaid,
          shift: 0,
          liters: "",
          kpliters: "",
          nashliters: "",
          otherCharges: "",
          chilling: "",
          fat: "",
          snf: "",
          rate: "",
          amt: "",
        });

        setChangedDate("");
        setErrors({});
      } else {
        toast.error("संघ दुध संकलन बदल करण्यात अयशस्वी.");
      }
    } catch (err) {
      toast.error("संघ दुध संकलन बदल करण्यात अयशस्वी.");
    }
  };

  return (
    <div
      id="sanghasles"
      className="sangh-milk-sales-container w100 h1 d-flex-col a-center p10"
    >
      <form className="milk-col-form w65 h1 d-flex-col bg p10">
        {isModalOpen ? (
          <div className="heading-and-close-btn-container w100 d-flex sb p10">
            {editData ? (
              <span className="heading w100 t-center">
                संघ दुध विक्री पावतीत बदल करा
              </span>
            ) : (
              <span className="heading w100 t-center">
                संघ दुध विक्री पावती
              </span>
            )}

            <span
              type="button"
              className="heading span-btn"
              onClick={() => clsebtn(false)}
            >
              X
            </span>
          </div>
        ) : (
          <span className="heading w100 t-center">संघ दुध विक्री पावती</span>
        )}
        <div className="form-setting w100 h10 d-flex a-center sb ">
          <div className="select-sangh-div w70 d-flex a-center px10">
            <label htmlFor="sanghid" className="info-text w30">
              संघ निवडा : <span className="req">*</span>
            </label>
            <select
              className="data w70"
              name="sanghid"
              id="sanghid"
              value={values.sanghid}
              onChange={(e) => setSanghaid(e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, timeRef)}
              ref={sanghaRef}
            >
              <option value="">-- संघ निवडा --</option>
              {sanghaList.length > 0 ? (
                sanghaList.map((sangha, i) => (
                  <option key={i} value={sangha.code}>
                    {sangha.sangha_name}
                  </option>
                ))
              ) : (
                <option value="">-- संघ निवडा --</option>
              )}
            </select>
          </div>
          <div className="shift-selection-div w30 h1 d-flex a-center sa mx10">
            <label htmlFor="shift" className="info-text w30">
              वेळ : <span className="req">*</span>{" "}
            </label>
            <select
              name="shift"
              id="shift"
              className="data w65"
              onChange={handleInputs}
              value={values.shift}
              onKeyDown={(e) => handleKeyDown(e, fdateRef)}
              ref={timeRef}
            >
              <option value="0">सकाळ</option>
              <option value="1">सायंकाळ</option>
              <option value="2">सकाळ + सायंकाळ</option>
              <option value="3">काल साय + आज सकाळ</option>
              <option value="4">एकत्रीत</option>
            </select>
          </div>
        </div>
        <div className="date-details w100 h20 d-flex sb a-center">
          <div className="form-div w30 px10">
            <label htmlFor="date" className="info-text w100">
              {t("common:c-date")} {values.shift === "4" ? "पासून" : ""}{" "}
              <span className="req">*</span>{" "}
            </label>
            <input
              className={`data w100 ${errors.date ? "input-error" : ""}`}
              type="date"
              required
              placeholder="0000"
              name="date"
              id="date"
              onChange={handleInputs}
              value={values.date || ""}
              max={tDate}
              onKeyDown={(e) => handleKeyDown(e, tdateRef)}
              ref={fdateRef}
            />
          </div>
          {values.shift === "4" ? (
            <div className="form-div w30 px10">
              <label htmlFor="todate" className="info-text w100">
                {t("common:c-date")} पर्यत
              </label>
              <input
                className={`data w100 ${errors.date ? "input-error" : ""}`}
                type="date"
                required
                placeholder="0000"
                name="date"
                id="todate"
                onChange={handleInputs}
                value={values.todate || ""}
                max={tDate}
                onKeyDown={(e) => handleKeyDown(e, litersRef)}
                ref={tdateRef}
              />
            </div>
          ) : (
            <></>
          )}
          <div className="form-div w30 px10">
            <label htmlFor="tankerno" className="info-text w100">
              टँकर नंबर : <span className="req">*</span>{" "}
            </label>
            <select
              name="tankerno"
              id="tankerno"
              className="data w100"
              onChange={handleInputs}
              value={values.tankerno}
              onKeyDown={(e) => handleKeyDown(e, fdateRef)}
              ref={timeRef}
            >
              <option value="">-- निवडा --</option>
              {tankerList.length > 0 &&
                tankerList.map((tanker, i) => (
                  <option key={i} value={tanker.tno}>
                    {tanker?.tankerno}
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
                value={values.liters}
                onKeyDown={(e) => handleKeyDown(e, kplitersRef)}
                ref={litersRef}
              />
            </div>
            <div className="form-div px10">
              <label htmlFor="nashliters" className="info-text">
                नाश लिटर
              </label>
              <input
                className={`data ${errors.nashliters ? "input-error" : ""}`}
                type="number"
                placeholder="00.0"
                name="nashliters"
                id="nashliters"
                step="any"
                value={values.nashliters}
                onChange={handleInputs}
                onKeyDown={(e) => handleKeyDown(e, fatRef)}
                ref={nashlitersRef}
              />
            </div>
            {values.shift !== "4" ? (
              <>
                <div className="form-div  px10">
                  <label htmlFor="fat" className="info-text">
                    {t("common:c-fat")}
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
                    onKeyDown={(e) => handleKeyDown(e, snfRef)}
                    ref={fatRef}
                  />
                </div>
                <div className="form-div px10">
                  <label htmlFor="snf" className="info-text">
                    {t("common:c-snf")}
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
                    onKeyDown={(e) => handleKeyDown(e, rateRef)}
                    ref={snfRef}
                  />
                </div>
              </>
            ) : (
              <div className="form-div  px10">
                <label htmlFor="fat" className="info-text">
                  प्रशासकीय व इतर अनुदान :
                </label>
                <input
                  className={`data ${errors.fat ? "input-error" : ""}`}
                  type="number"
                  placeholder="0.0"
                  name="otherCharges"
                  id="otherCharges"
                  step="any"
                  onChange={handleInputs}
                  value={values.otherCharges}
                  onKeyDown={(e) => handleKeyDown(e, snfRef)}
                  ref={otherChargesRef}
                />
              </div>
            )}
          </div>
          <div className="milk-info w50 h1 d-flex-col">
            <div className="form-div px10">
              <label htmlFor="kpliters" className="info-text">
                कमिप्रत लिटर
              </label>
              <input
                className={`data ${errors.degree ? "input-error" : ""}`}
                type="number"
                placeholder="00.0"
                name="kpliters"
                id="kpliters"
                step="any"
                value={values.kpliters}
                onChange={handleInputs}
                onKeyDown={(e) => handleKeyDown(e, nashlitersRef)}
                ref={kplitersRef}
              />
            </div>
            {values.shift !== "4" ? (
              <div className="form-div px10">
                <label htmlFor="rate" className="info-text">
                  {t("common:c-rate")}
                </label>
                <input
                  className={`data ${errors.rate ? "input-error" : ""}`}
                  type="number"
                  required
                  placeholder="00.0"
                  name="rate"
                  id="rate"
                  step="any"
                  value={values.rate}
                  onChange={handleInputs}
                  onKeyDown={(e) => handleKeyDown(e, submitbtn)}
                  ref={rateRef}
                />
              </div>
            ) : (
              <div className="form-div px10">
                <label htmlFor="snf" className="info-text">
                  शीतकरण :
                </label>
                <input
                  className={`data ${errors.snf ? "input-error" : ""}`}
                  type="number"
                  placeholder="00.0"
                  name="chilling"
                  id="chilling"
                  step="any"
                  onChange={handleInputs}
                  value={values.chilling}
                  onKeyDown={(e) => handleKeyDown(e, otherChargesRef)}
                  ref={rateRef}
                />
              </div>
            )}

            <div className="form-div px10">
              <label htmlFor="amt" className="info-text">
                {t("common:c-amt")} <span className="req">*</span>{" "}
              </label>
              <input
                className={`data ${errors.amt ? "input-error" : ""}`}
                type="number"
                required
                placeholder="00.0"
                name="amt"
                id="amt"
                ref={amtRef}
                value={values.amt}
              />
            </div>
            <div className="button-container w100 h20 d-flex j-center my10">
              <button
                className="w-btn label-text"
                type="reset"
                onClick={handleResetButton}
              >
                {t("m-btn-cancel")}
              </button>
              {editData ? (
                <button
                  className="btn label-text mx10"
                  type="submit"
                  ref={submitbtn}
                  disabled={updateStatus === "loading"}
                  onClick={handleSanghaMilkEdit}
                >
                  {updateStatus === "loading" ? "बदल करत आहोत..." : `बदल करा`}
                </button>
              ) : (
                <button
                  className="btn label-text mx10"
                  type="submit"
                  ref={submitbtn}
                  disabled={status === "loading"}
                  onClick={handleSanghaSales}
                >
                  {status === "loading" ? "सेव्ह करत आहोत..." : `सेव्ह करा`}
                </button>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Sanghsales;
