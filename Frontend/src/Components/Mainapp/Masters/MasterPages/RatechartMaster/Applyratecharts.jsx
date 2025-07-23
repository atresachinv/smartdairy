import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { getMaxCustNo } from "../../../../../App/Features/Customers/customerSlice";
import Spinner from "../../../../Home/Spinner/Spinner";
import {
  applyRateChart,
  fetchRateChart,
} from "../../../../../App/Features/Mainapp/Masters/rateChartSlice";
import { useTranslation } from "react-i18next";

const Applyratecharts = ({ isSet, ratechart, setIsSelected }) => {
  const { t } = useTranslation("ratechart");
  const dispatch = useDispatch();
  const tDate = useSelector((state) => state.date.toDate);
  const status = useSelector((state) => state.ratechart.applyrcstatus);
  const custno = useSelector((state) => state.customer.maxCustNo);
  const ratechartlist = useSelector(
    (state) => state.ratechart.ratechartList || []
  );
  const [errors, setErrors] = useState({});
  const [selectedRateChart, setSelectedRateChart] = useState(null);
  const [formData, setFormData] = useState({
    rcfromdate: "",
    rctodate: "",
    fromCust: 1,
    toCust: "",
  });

  // set active tab --------------------------------->
  useEffect(() => {
    setIsSelected(4);
    dispatch(getMaxCustNo());
  }, []);

  useEffect(() => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      toCust: `${custno - 1}`,
      rctodate: tDate,
    }));
  }, [custno, tDate]);

  const validateField = (name, value) => {
    let error = {};

    switch (name) {
      case "fromCust":
      case "toCust":
        if (!/^[0-9]+$/.test(value)) {
          error[name] = `Invalid value of ${name}`;
        } else {
          delete errors[name];
        }
        break;

      case "rcfromdate":
      case "rctodate":
        if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
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
    const fieldsToValidate = ["rcfromdate", "rctodate", "fromCust", "toCust"];
    const validationErrors = {};

    fieldsToValidate.forEach((field) => {
      const fieldError = validateField(field, formData[field]);
      Object.assign(validationErrors, fieldError);
    });
    return validationErrors;
  };

  // Function to handle row click
  const handleRowClick = (ratechart) => {
    // If the clicked rate chart is already selected, deselect it
    if (selectedRateChart === ratechart) {
      setSelectedRateChart(null);
    } else {
      setSelectedRateChart(ratechart);
      dispatch(
        fetchRateChart({
          rccode: ratechart.rccode,
          rcdate: ratechart.rcdate,
          rctype: ratechart.rctypename,
        })
      );
    }
  };

  const handleInput = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // updated function -------------------------------------------------------------->
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validate fields before submission
    const validationErrors = validateFields();
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }
    try {
      const result = await dispatch(
        applyRateChart({
          rcfromdate: formData.rcfromdate,
          rctodate: formData.rctodate,
          custFrom: formData.fromCust,
          custTo: formData.toCust,
          ratechart: ratechart,
        })
      ).unwrap();
      if (result.status === 200) {
        toast.success(result.message);
        setErrors({});
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("An error occurred while applying the rate chart.");
      console.error(error);
    }
  };

  return (
    <div className="apply-ratechart-container w100 h1 d-flex sb p10">
      <div className="previous-rate-chart-container w45 h1 d-flex-col bg">
        <span className="heading m10">{t("दरपत्रक")} : </span>
        <span className="tip-text">
          ( दरपत्रक निवडण्यासाठी खाली दिलेल्या योग्य दरपत्रकावर क्लिक करा )
        </span>
        <div className="previous-ratechart-container w100 h1 d-flex-col mh100 hidescrollbar mt-10">
          <div className="rate-chart-col-title w100 d-flex a-center t-center sa py10 bg1 sticky-top">
            <span className="f-info-text w10">{t("rc-no")}</span>
            <span className="f-info-text w20">{t("rc-date")}</span>
            <span className="f-info-text w25">{t("rc-type")}</span>
          </div>
          {ratechartlist.length > 0 ? (
            ratechartlist
              .slice()
              .sort((a, b) => a.rccode - b.rccode)
              .map((ratechart, index) => (
                <div
                  onClick={() => handleRowClick(ratechart)}
                  key={index}
                  className="rate-chart-row-value w100 d-flex a-center t-center py10 sa"
                  style={{
                    backgroundColor:
                      selectedRateChart === ratechart
                        ? "#ffc46bff"
                        : index % 2 === 0
                        ? "#faefe3"
                        : "#fff",
                    cursor: "pointer",
                  }}
                >
                  <span className="info-text w10">{ratechart.rccode}</span>
                  <span className="info-text w20">
                    {new Date(ratechart.rcdate).toLocaleDateString("en-GB", {
                      year: "2-digit",
                      month: "2-digit",
                      day: "2-digit",
                    })}
                  </span>
                  <span className="info-text w25">{ratechart.rctypename}</span>
                </div>
              ))
          ) : (
            <div className="box d-flex center">
              <span className="label-text">No Record Found!</span>
            </div>
          )}
        </div>
      </div>
      <form
        className="rate-chart-setting-div w45 h60 d-flex-col bg-light-green br9 p10 sa"
        onSubmit={handleSubmit}
      >
        <span className="heading p10">{t("rc-apply-s-rc")} :</span>
        <div className="select-date-outer w100 h30 d-flex-col sb">
          <label htmlFor="implementationDate" className="info-text w100">
            {t("rc-apply-text")} :
          </label>
          <div className="date-container w100 h1 d-flex sb">
            <div className="select-time w50 h1 a-center d-flex a-center sa">
              <label htmlFor="FromDate" className="info-text w30">
                {t("rc-from")}:
              </label>
              <input
                className={`data w65 ${errors.rcfromdate ? "input-error" : ""}`}
                type="date"
                name="rcfromdate"
                id="FromDate"
                required
                value={formData.rcfromdate}
                onChange={handleInput}
                max={formData.rctodate}
              />
            </div>
            <div className="select-time w50 h1 a-center d-flex a-center sa">
              <label htmlFor="toDate" className="info-text w30">
                {t("rc-to")}:
              </label>
              <input
                className={`data w65 ${errors.rctodate ? "input-error" : ""}`}
                type="date"
                name="rctodate"
                id="toDate"
                required
                value={formData.rctodate || " "}
                onChange={handleInput}
                max={tDate}
              />
            </div>
          </div>
        </div>
        {status === "loading" ? (
          <div className="loading-ToastContainer w100 h25 d-flex center">
            <Spinner />
          </div>
        ) : (
          <div className="customer-count-outer w100 h30 d-flex-col">
            <span className="info-text">{t("rc-s-cust")} :</span>
            <div className="customer-count w100 h1 d-flex">
              <div className="select-animal-type w40 h1 a-center d-flex">
                <label htmlFor="fromCust" className="info-text w40">
                  {t("rc-from")} :
                </label>
                <input
                  type="number"
                  className={`data w60 ${errors.fromCust ? "input-error" : ""}`}
                  name="fromCust"
                  id="fromCust"
                  required
                  value={formData.fromCust.toString() || ""}
                  onChange={handleInput}
                />
              </div>
              <div className="select-animal-type w40 h1 a-center d-flex mx10">
                <label htmlFor="toCust" className="info-text w40">
                  {t("rc-to")} :
                </label>
                <input
                  type="number"
                  className={`data w60 ${errors.toCust ? "input-error" : ""}`}
                  name="toCust"
                  id="toCust"
                  required
                  value={formData.toCust.toString() || ""}
                  onChange={handleInput}
                />
              </div>
            </div>
          </div>
        )}
        <div className="button-div w100 h15 d-flex j-end">
          <button
            type="submit"
            className="btn mx10"
            disabled={status === "loading"}
          >
            {status === "loading"
              ? `${t("rc-appling")}`
              : `${t("rc-apply-rc")}`}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Applyratecharts;
