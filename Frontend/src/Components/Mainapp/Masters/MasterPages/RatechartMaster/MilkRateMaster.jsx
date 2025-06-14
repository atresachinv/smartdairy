import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as xlsx from "xlsx";
import {
  fetchMaxRcCode,
  listRateCharts,
  fetchRateChart,
  setData,
  deleteRatechart,
  fetchMaxRctype,
} from "../../../../../App/Features/Mainapp/Masters/rateChartSlice";
import { toast } from "react-toastify";
import "../../../../../Styles/Mainapp/Masters/MilkRateMaster.css";
import RateChartOptions from "./RateChartOptions";
import { useTranslation } from "react-i18next";

const MilkRateMaster = () => {
  const { t } = useTranslation("ratechart");
  const dispatch = useDispatch();
  const tDate = useSelector((state) => state.date.toDate);
  const { status, progress } = useSelector((state) => state.ratechart);
  const maxRcCode = useSelector((state) => state.ratechart.maxRcCode);
  const deletercstatus = useSelector((state) => state.ratechart.deletercstatus);
  const ratechartlist = useSelector(
    (state) => state.ratechart.ratechartList || []
  );
  const Selectedrc = useSelector((state) => state.ratechart.selectedRateChart);

  const fileInputRef = React.useRef(null);
  const [selectedRateChart, setSelectedRateChart] = useState(null);
  const [rate, setRate] = useState([]);
  const [localError, setLocalError] = useState("");
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState("");

  const [formData, setFormData] = useState({
    rccode: maxRcCode,
    rctype: "",
    time: "",
    animalType: 0,
    rcdate: "",
  });

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

  // Handle show Ratechart button
  const ShowRatechart = async () => {
    if (!selectedRateChart) {
      toast.error("Please select a rate chart to Show.");
      return;
    } else {
      await setRate(Selectedrc);
    }
  };

  const deleteSelectedRateChart = async (e) => {
    e.preventDefault();
    if (!selectedRateChart) {
      toast.error("Please select a rate chart to delete.");
      return;
    }
    const ratechartDate = selectedRateChart.rcdate.slice(0, 10);
    const result = await dispatch(
      deleteRatechart({
        rccode: selectedRateChart.rccode,
        rcdate: ratechartDate,
      })
    ).unwrap();
    if (result.status === 200) {
      toast.success(result.message);
      dispatch(fetchMaxRcCode());
      dispatch(listRateCharts());
      setSelectedRateChart(null);
    } else {
      toast.error(result.message);
    }
  };

  const downloadRateChart = async () => {
    if (!selectedRateChart) {
      toast.error("Please select a rate chart to download.");
      return;
    } else {
      // Convert data to worksheet
      const worksheet = xlsx.utils.json_to_sheet(Selectedrc);

      // Create a new workbook and append the worksheet
      const workbook = xlsx.utils.book_new();
      xlsx.utils.book_append_sheet(workbook, worksheet, "Rate Chart");

      // Generate a Blob for the Excel file
      const excelBuffer = xlsx.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });
      const blob = new Blob([excelBuffer], {
        type: "application/octet-stream",
      });

      // Trigger the download
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "rate_chart.xlsx"; // Specify the file name
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <>
      <div className="rate-chart-master-container w100 h1 d-flex p10 sb">
        <div className="select-ratechart-container w40 h1 d-flex-col sa p10">
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
        <div className="save-ratechart-container w45 h1 d-flex-col">
          <span className="heading">{t("rc-prev-rc")} : </span>
          <div className="previous-rate-chart-container w100 h40 d-flex-col bg mh100 hidescrollbar">
            <div className="rate-chart-col-title w100 d-flex a-center t-center sa py10 bg1 sticky-top">
              <span className="f-info-text w10">{t("rc-no")}</span>
              <span className="f-info-text w20">{t("rc-date")}</span>
              <span className="f-info-text w25">{t("rc-type")}</span>
            </div>
            {ratechartlist
              .slice() // Create a shallow copy to avoid mutating original state
              .sort((a, b) => a.rccode - b.rccode) // Sort numerically
              .map((ratechart, index) => (
                <div
                  onClick={() => handleRowClick(ratechart)}
                  key={index}
                  className="rate-chart-row-value w100 d-flex a-center t-center py10 sa"
                  style={{
                    backgroundColor:
                      selectedRateChart === ratechart
                        ? "#d1e7dd"
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
              ))}
          </div>
          <div className="button-div w100 h10 d-flex a-center j-end">
            <button
              type="button"
              className="btn mx10"
              disabled={deletercstatus === "loading"}
              onClick={deleteSelectedRateChart}
            >
              {deletercstatus === "loading"
                ? `${t("rc-deleting-btn")}`
                : `${t("rc-del-btn")}`}
            </button>
            <button
              type="button"
              className="btn mx10"
              disabled={status === "loading"}
              onClick={downloadRateChart}
            >
              {t("rc-download-btn")}
            </button>
            <button
              type="button"
              className="btn mx10"
              disabled={status === "loading"}
              onClick={ShowRatechart}
            >
              {t("rc-show-btn")}
            </button>
          </div>
          <div className="rate-chart-options-container w100 h50 d-flex-col sa my10">
            <RateChartOptions
              isSet={selectedRateChart}
              ratechart={Selectedrc}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default MilkRateMaster;
