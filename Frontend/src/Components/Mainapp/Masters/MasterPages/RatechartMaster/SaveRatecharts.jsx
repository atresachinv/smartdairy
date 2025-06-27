import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  fetchMaxRcCode,
  fetchMaxRctype,
  listRateCharts,
  listRcType,
  saveRateChart,
  setData,
} from "../../../../../App/Features/Mainapp/Masters/rateChartSlice";
import Spinner from "../../../../Home/Spinner/Spinner";
import { useTranslation } from "react-i18next";
import * as xlsx from "xlsx";

const SaveRatecharts = () => {
  const { t } = useTranslation("ratechart");
  const dispatch = useDispatch();
  const tDate = useSelector((state) => state.date.toDate);
  const status = useSelector((state) => state.ratechart.savercstatus);
  const maxRcCode = useSelector((state) => state.ratechart.maxRcCode);
  const ratechart = useSelector((state) => state.ratechart.excelRatechart);
  const rcTypes = useSelector((state) => state.ratechart.RCTypeList);
  const rcStatus = useSelector((state) => state.ratechart.RCTliststatus);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    rccode: "",
    rctype: "",
    rcdate: "",
  });

  useEffect(() => {
    dispatch(fetchMaxRcCode());
    dispatch(fetchMaxRctype());
    dispatch(listRcType());
  }, [dispatch]);

  // Update rccode when maxRcCode changes
  useEffect(() => {
    if (maxRcCode) {
      setFormData((prevData) => ({ ...prevData, rccode: maxRcCode }));
    }
  }, [maxRcCode]);

  const handleInput = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const fileInputRef = React.useRef(null);
  const [rate, setRate] = useState([]);
  const [localError, setLocalError] = useState("");
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState("");

  useEffect(() => {
    dispatch(fetchMaxRcCode());
    dispatch(fetchMaxRctype());
    dispatch(listRateCharts());
    if (!fileName) {
      dispatch(setData([]));
      return;
    }
  }, [dispatch]);

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleExcel = async (e) => {
    const file = e.target.files[0];

    const fileExtension = file.name.split(".").pop().toLowerCase();

    if (fileExtension !== "xlsx" && fileExtension !== "xls") {
      setLocalError(
        "Please upload a valid Excel file with .xlsx or .xls extension."
      );
      return;
    }
    setFileName(file.name);
    try {
      setLoading(true); // Start loading
      const data = await file.arrayBuffer();
      const excelFile = xlsx.read(data);
      const excelSheet = excelFile.Sheets[excelFile.SheetNames[0]];
      const excelJson = xlsx.utils.sheet_to_json(excelSheet, { defval: "" });

      // Transform the data
      const transformedData = transformExcelData(excelJson);
      setRate(transformedData);
      dispatch(setData(transformedData));
      setLocalError("");
    } catch (err) {
      dispatch(setData([]));
      console.error("Error reading Excel file:", err);
      toast.error("Selected excel file is not valid ratechart excel!");
      setLocalError(
        "Failed to read the Excel file. Please ensure it is properly formatted."
      );
    } finally {
      setLoading(false); // End loading
    }
  };

  // Transformation Function
  const transformExcelData = (data) => {
    const transformed = [];

    data.forEach((row, rowIndex) => {
      const fatSnfKey = "fat/snf";
      const commonFAT = parseFloat(row[fatSnfKey]);

      if (isNaN(commonFAT)) {
        console.warn(
          `Row ${rowIndex + 1}: Invalid or missing '${fatSnfKey}' value.`
        );
        return; // Skip this row if FAT is invalid
      }

      // Iterate over each key-value pair in the row
      Object.entries(row).forEach(([key, value]) => {
        if (key.toLowerCase() === fatSnfKey.toLowerCase()) {
          return; // Skip the 'fat/snf' entry
        }

        const snf = parseFloat(key);
        const rate = parseFloat(value);

        if (isNaN(snf) || isNaN(rate)) {
          console.warn(
            `Row ${
              rowIndex + 1
            }: Invalid SNF or Rate. SNF: ${key}, Rate: ${value}`
          );
          return; // Skip invalid entries
        }

        transformed.push({
          fat: commonFAT,
          snf: snf,
          rate: Math.round(rate * 100) / 100, // Round to two decimal places
        });
      });
    });

    return transformed;
  };

  const validateField = (name, value) => {
    let error = {};

    switch (name) {
      case "rccode":
        if (!/^\d$/.test(value.toString())) {
          errors[name] = `Invalid value of ${name}`;
        } else {
          delete errors[name];
        }
        break;
      case "rcdate":
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
    const fieldsToValidate = ["rccode", "rcdate"];
    const validationErrors = {};
    fieldsToValidate.forEach((field) => {
      const fieldError = validateField(field, formData[field]);
      Object.assign(validationErrors, fieldError);
    });
    return validationErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!ratechart) {
      toast.error(`${t("rc-not-available")}`);
      return;
    }

    // Validate fields before submission
    const validationErrors = validateFields();
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }

    const result = await dispatch(
      saveRateChart({
        rccode: parseInt(formData.rccode, 10),
        rctype: formData.rctype,
        rcdate: formData.rcdate,
        ratechart,
      })
    ).unwrap();
    // Show success message
    if (result.status === 200) {
      toast.success(result.message);

      // Fetch updated data
      dispatch(fetchMaxRcCode());
      dispatch(listRateCharts());

      // Reset form
      setFormData({
        rccode: maxRcCode,
        rctype: "",
        time: "",
        animalType: "",
        rcdate: "",
      });
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className="save-ratechart-container w100 h1 d-flex sb p10">
      <div className="select-ratechart-container w40 h1 d-flex-col sa ">
        <div className="select-excel-container w100 h10 d-flex a-center py10 sb">
          <span className="label-text w40">
            {!fileName ? `${t("rc-s-excel")}` : `${fileName}`}
          </span>
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx, .xls"
            style={{ display: "none" }}
            onChange={handleExcel}
          />
          <button className="btn" onClick={handleButtonClick}>
            {t("rc-choose-file")}
          </button>
        </div>
        {localError && (
          <div className="error-message" style={{ color: "red" }}>
            {localError}
          </div>
        )}
        {loading && (
          <div className="loading-spinner" style={{ color: "blue" }}>
            Loading...
          </div>
        )}
        <div className="rate-chart-container w100 h90 d-flex-col bg">
          <span className="heading p10">{t("rc-s-rc-excel")} : </span>
          <div className="rate-chart-div w100 h1 mh100 d-flex-col hidescrollbar">
            <div className="rate-chart-col-title w100 d-flex a-center t-center sa py10 sticky-top bg7">
              <span className="f-info-text w15">{t("rc-fat")}</span>
              <span className="f-info-text w10">{t("rc-snf")}</span>
              <span className="f-info-text w15">{t("rc-rate")}</span>
            </div>
            {rate.length > 0 ? (
              rate.map((item, index) => (
                <div
                  key={`${item.fat}-${item.snf}-${index}`}
                  className={`rate-chart-row-value w100 h10 d-flex a-center t-center sa ${
                    index % 2 === 0 ? "bg-light" : "bg-dark"
                  }`}
                  style={{
                    backgroundColor: index % 2 === 0 ? "#faefe3" : "#fff",
                  }}
                >
                  {/* <span className="info-text w5">{index + 1}</span> */}
                  <span className="info-text w15">
                    {item.fat !== undefined ? item.fat.toFixed(1) : "N/A"}
                  </span>
                  <span className="info-text w10">
                    {item.snf !== undefined ? item.snf.toFixed(1) : "N/A"}
                  </span>
                  <span className="info-text w15">
                    {item.rate !== undefined ? item.rate.toFixed(2) : "N/A"}
                  </span>
                </div>
              ))
            ) : fileName === "" || null ? (
              <div className="box d-flex center label-text">
                {t("rc-rc-msg1")}
              </div>
            ) : rate.length === 0 ? (
              <div className="box d-flex center label-text">
                {t("rc-rc-msg2")}
              </div>
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
      <form
        className="rate-chart-setting-div w45 h60 d-flex-col bg-light-green br9 sa p10"
        onSubmit={handleSubmit}
      >
        <span className="heading">{t("rc-save-s-rc")} :</span>
        {status === "loading" ? (
          <div className="loading-ToastContainer w100 h25 d-flex center">
            <Spinner />
          </div>
        ) : (
          <div className="save-ratechart-contaner w100 h60 d-flex-col">
            <div className="select-time-animal-type w100 h30 d-flex sb">
              <div className="select-time w25 h1 a-center d-flex ">
                <label htmlFor="rccode" className="info-text w45">
                  {t("rc-no")} :
                </label>
                <input
                  className="data w50 t-center"
                  type="number"
                  name="rccode"
                  id="rccode"
                  value={formData.rccode}
                  onChange={handleInput}
                  readOnly
                />
              </div>
              <div className="select-animal-type w70 h1 a-center d-flex sb">
                <label htmlFor="rctype" className="info-text w35">
                  {t("rc-type")} :
                </label>
                <select
                  id="rctype"
                  className={`data w65`}
                  name="rctype"
                  onChange={handleInput}
                >
                  <option value="">-- {t("rc-select-rctype")} --</option>
                  {rcStatus === "loading" ? (
                    <option value="">Loading...</option>
                  ) : (
                    <>
                      {rcTypes.length > 0 ? (
                        rcTypes.map((types) => (
                          <option key={types.id} value={types.rctypename}>
                            {types.rctypename}
                          </option>
                        ))
                      ) : (
                        <option value="">{t("rc-no-type-avai")}</option>
                      )}
                    </>
                  )}
                </select>
              </div>
            </div>
            <div className="select-time-animal-type w100 my10 d-flex a-center sb">
              <label htmlFor="rcdate" className="info-text w50">
                {t("rc-rc-date")} :{" "}
              </label>
              <input
                className={`data w40 ${errors.rcdate ? "input-error" : ""}`}
                type="date"
                name="rcdate"
                id="rcdate"
                max={tDate}
                value={formData.rcdate}
                onChange={handleInput}
              />
            </div>
          </div>
        )}
        <div className="button-div w100 h20 d-flex j-end">
          <button
            type="submit"
            className="w40 btn"
            disabled={status === "loading"}
          >
            {status === "loading" ? `${t("rc-saving")}` : `${t("rc-save-rc")}`}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SaveRatecharts;
