// MilkRateMaster.jsx

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as xlsx from "xlsx";
import {
  saveRateChart,
  resetProgress,
} from "../../../../App/Features/Mainapp/Masters/rateChartSlice";

const MilkRateMaster = () => {
  const dispatch = useDispatch();
  const { status, error, progress } = useSelector((state) => state.ratechart);

  const [rate, setRate] = useState([]);
  const [formData, setFormData] = useState({
    rccode: "",
    rctype: "",
    time: "",
    animalType: "",
    rcdate: "",
  });

  console.log(formData);

  const [localError, setLocalError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === "succeeded") {
      alert("Rate chart saved successfully!");
      setLoading(false);
      dispatch(resetProgress());
      // Optionally, reset formData and rate
      setFormData({
        rccode: "",
        rctype: "",
        time: "",
        animalType: "",
        rcdate: "",
      });
      setRate([]);
    } else if (status === "failed") {
      alert(`Error: ${error}`);
      setLoading(false);
      dispatch(resetProgress());
    }
  }, [status, error, dispatch]);

  const handleExcel = async (e) => {
    const file = e.target.files[0];

    const fileExtension = file.name.split(".").pop().toLowerCase();
    if (fileExtension !== "xlsx" && fileExtension !== "xls") {
      setLocalError(
        "Please upload a valid Excel file with .xlsx or .xls extension."
      );
      return;
    }

    try {
      setLoading(true); // Start loading
      const data = await file.arrayBuffer();
      const excelFile = xlsx.read(data);
      const excelSheet = excelFile.Sheets[excelFile.SheetNames[0]];
      const excelJson = xlsx.utils.sheet_to_json(excelSheet, { defval: "" });

      // Transform the data
      const transformedData = transformExcelData(excelJson);
      setRate(transformedData);
      setLocalError("");
    } catch (err) {
      console.error("Error reading Excel file:", err);
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
          FAT: commonFAT,
          SNF: snf,
          Rate: Math.round(rate * 100) / 100, // Round to two decimal places
        });
      });
    });

    return transformed;
  };

  const handleInput = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (
      !formData.rccode ||
      !formData.rctype ||
      !formData.rcdate ||
      !formData.time ||
      !formData.animalType ||
      rate.length === 0
    ) {
      setLocalError(
        "Please fill out all required fields and upload a valid Excel file."
      );
      return;
    }

    // Ensure numerical fields are numbers
    const numericRccode = parseInt(formData.rccode, 10);
    const numericRctype = parseInt(formData.rctype, 10);
    const numericTime = parseInt(formData.time, 10);

    if (isNaN(numericRccode) || isNaN(numericRctype) || isNaN(numericTime)) {
      setLocalError("RCCODE, RCTYPE, and Time must be valid numbers.");
      return;
    }

    // Optionally, validate rate array entries
    for (let i = 0; i < rate.length; i++) {
      const entry = rate[i];
      if (
        typeof entry.FAT !== "number" ||
        typeof entry.SNF !== "number" ||
        typeof entry.Rate !== "number"
      ) {
        setLocalError(`Invalid rate data at row ${i + 1}.`);
        return;
      }
    }

    // Dispatch with validated and parsed data
    dispatch(
      saveRateChart({
        rccode: numericRccode,
        rctype: numericRctype,
        rcdate: formData.rcdate,
        time: numericTime,
        animal: formData.animalType,
        rate,
      })
    );

    setLocalError("");
  };

  return (
    <>
      <div className="rate-chart-master-container w100 h1 d-flex sb">
        <div className="select-ratechart-container w40 h1 d-flex-col sa p10">
          <div className="select-excel-container w100 h10 d-flex a-center my10 sb">
            <span className="label-text w40">Select Excel File</span>
            <input
              className=" data w60"
              type="file"
              accept=".xlsx, .xls"
              onChange={handleExcel}
            />
            {/* <button className="btn">Choose File</button> */}
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
          {/* Progress Bar */}
          {status === "loading" && (
            <div className="progress-bar-container w100 my10">
              <div
                className="progress-bar"
                style={{
                  width: `${progress}%`,
                  height: "20px",
                  backgroundColor: "#4caf50",
                  transition: "width 0.5s",
                }}></div>
              <span>{progress}%</span>
            </div>
          )}
          <div className="rate-chart-container w100 h90 d-flex-col bg">
            <span className="heading p10">
              Selected Rate Chart from Excel :{" "}
            </span>
            <div className="rate-chart-col-title w100 d-flex a-center t-center sa py10 bg1">
              <span className="info-text w5">No.</span>
              <span className="info-text w15">FAT</span>
              <span className="info-text w10">SNF</span>
              <span className="info-text w15">Rate</span>
            </div>
            <div className="rate-chart-div w100 h90 mh90 d-flex-col hidescrollbar">
              {rate.length > 0 ? (
                rate.map((item, index) => (
                  <div
                    key={`${item.FAT}-${item.SNF}-${index}`}
                    className="rate-chart-row-value w100 h10 d-flex a-center t-center sa ">
                    <span className="info-text w5">{index + 1}</span>
                    <span className="info-text w15">
                      {item.FAT !== undefined ? item.FAT.toFixed(1) : "N/A"}
                    </span>
                    <span className="info-text w10">
                      {item.SNF !== undefined ? item.SNF.toFixed(1) : "N/A"}
                    </span>
                    <span className="info-text w15">
                      {item.Rate !== undefined ? item.Rate.toFixed(2) : "N/A"}
                    </span>
                  </div>
                ))
              ) : (
                <div>Select a Rate Chart to display.</div>
              )}
            </div>
          </div>
        </div>
        <div className="save-ratechart-container w45 h1 d-flex-col p10">
          <div className="previous-rate-chart-container w100 h40 d-flex-col bg my10">
            <span className="heading p10">Previous Rate Charts : </span>
            <div className="rate-chart-col-title w100 d-flex a-center t-center sa py10 bg1">
              <span className="info-text w10">No.</span>
              <span className="info-text w20">Date</span>
              <span className="info-text w15">Time</span>
              <span className="info-text w15">Animal</span>
              <span className="info-text w15">Option</span>
            </div>
            <div className="rate-chart-div w100 h90 mh90 d-flex-col hidescrollbar">
              {/* Replace with dynamic data as needed */}
              <div className="rate-chart-row-value w100 h10 d-flex a-center t-center sa py10">
                <span className="info-text w10">1</span>
                <span className="info-text w20">2024/01/01</span>
                <span className="info-text w15">AM</span>
                <span className="info-text w15">Cow</span>
                <span className="info-text w15">Edit</span>
              </div>
            </div>
          </div>
          <form
            className="rate-chart-setting div w100 h40 d-flex-col sa my10 px10"
            onSubmit={handleSubmit}>
            <div className="select-time-animal-type w100 h25 d-flex sb">
              <div className="select-time w45 h1 a-center d-flex ">
                <label htmlFor="time" className="label-text w60">
                  Ratechart No :
                </label>
                <input
                  className="data w40"
                  type="number"
                  name="rccode"
                  id=""
                  value={formData.rccode}
                  onChange={handleInput}
                />
              </div>
              <div className="select-animal-type w45 h1 a-center d-flex">
                <label htmlFor="animalType" className="label-text w60">
                  Ratechart Type:
                </label>
                <input
                  className="data w40"
                  type="number"
                  name="rctype"
                  id=""
                  value={formData.rctype}
                  onChange={handleInput}
                />
              </div>
            </div>
            <div className="select-time-animal-type w100 h25 d-flex sb">
              {/* <div className="select-time w45 h1 a-center d-flex">
                <label htmlFor="time" className="label-text w40">
                  Time:
                </label>
                <select
                  className="data w60 "
                  name="time"
                  id="time"
                  required
                  value={formData.time}
                  onChange={handleInput}>
                  <option className="info-text" value="">
                    --Select--
                  </option>
                  <option className="info-text" value="0">
                    Morning
                  </option>
                  <option className="info-text" value="1">
                    Evening
                  </option>
                  <option className="info-text" value="2">
                    Both
                  </option>
                </select>
              </div> */}
              <div className="select-animal-type w50 h1 a-center d-flex">
                <label htmlFor="time" className="label-text w50">
                  Time:
                </label>
                <select
                  className="data w45 "
                  name="time"
                  id="time"
                  required
                  value={formData.time}
                  onChange={handleInput}>
                  <option className="info-text" value="">
                    --Select--
                  </option>
                  <option className="info-text" value="0">
                    Mornning
                  </option>
                  <option className="info-text" value="1">
                    Evenning
                  </option>
                  <option className="info-text" value="2">
                    Both
                  </option>
                </select>
              </div>
              <div className="select-animal-type w50 h1 a-center d-flex">
                <label htmlFor="animalType" className="label-text w50">
                  Animal Type:
                </label>
                <select
                  className="data w50 "
                  name="animalType"
                  id="animalType"
                  required
                  value={formData.animalType}
                  onChange={handleInput}>
                  <option className="info-text" value="">
                    --Select--
                  </option>
                  <option className="info-text" value="0">
                    Cow
                  </option>
                  <option className="info-text" value="1">
                    Buffalo
                  </option>
                  <option className="info-text" value="2">
                    Other
                  </option>
                </select>
              </div>
            </div>
            <div className="rate-chart-date w100 h25 d-flex sb">
              <label htmlFor="implementationDate" className="label-text w60">
                Rate Chart Implementation Date:
              </label>
              <input
                className="data w30 h50"
                required
                type="date"
                name="rcdate"
                id="implementationDate"
                value={formData.rcdate}
                onChange={handleInput}
              />
            </div>
            <div className="button-div w100 h25 d-flex j-end">
              <button
                type="submit"
                className="btn mx10"
                disabled={status === "loading"}>
                Save Rate Chart
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default MilkRateMaster;
