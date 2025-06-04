import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import * as XLSX from "xlsx";
import { toast } from "react-toastify";
import { FaFileExcel } from "react-icons/fa";
import { uploadMilkCollection } from "../../../../../App/Features/Mainapp/Milk/UploadMilkSlice";
import { useDispatch, useSelector } from "react-redux";

const UploadMilkColl = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation(["master", "common"]);
  const status = useSelector((state) => state.milkUpload.status);
  const [fileName, setFileName] = useState("");
  const [excelData, setExcelData] = useState("");
  const fileInputRef = useRef(null);
  //----------------------------------------------------------------------------------->
  // select excel file and upload

  const handleButtonClick = () => {
    fileInputRef.current.click(); // Trigger the file input click
  };

  function convertExcelDate(value) {
    if (!value) return "";

    // If value is a number, treat it as Excel serial date
    if (!isNaN(value)) {
      const excelEpoch = new Date(1899, 11, 30);
      const convertedDate = new Date(excelEpoch.getTime() + value * 86400000);
      return convertedDate.toISOString().split("T")[0]; // "YYYY-MM-DD"
    }

    // If it's a string like "01/04/2025"
    if (typeof value === "string" && value.includes("/")) {
      const [day, month, year] = value.split("/");
      const isoDate = new Date(`${year}-${month}-${day}`);
      if (!isNaN(isoDate)) {
        return isoDate.toISOString().split("T")[0];
      }
    }

    return "";
  }
  
  

  const handleExcelChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        const binaryStr = event.target.result;
        const workbook = XLSX.read(binaryStr, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const rawData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

        // Convert serial date to actual date format
        const formattedData = rawData.map((row) => ({
          ...row,
          दिनांक: convertExcelDate(row["दिनांक"]),
        }));

        setExcelData(formattedData);
      };
      reader.readAsArrayBuffer(file);
    }
  };
  

  const handleClear = () => {
    setFileName("");
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Reset file input
    }
  };

  const handleMilkUpload = async (e) => {
    e.preventDefault();

    const res = await dispatch(
      uploadMilkCollection({ milkData: excelData })
    ).unwrap();

    if (res.status === 201) {
      fileInputRef.current.value = "";
      toast.success("Milk collection uploaded successfully!");
    } else {
      toast.error("Failed to upload milk collection!");
    }
  };

  return (
    <div className="upload milk collection form w100 h1 d-flex-col a-center">
      <span className="heading my10">उपलोड दुध संकलन : </span>
      <form
        onSubmit={handleMilkUpload}
        className="excel-format-container w40 h40 d-flex-col a-center sb bg-light-green br9 p10"
      >
        <label htmlFor="selectExcel" className="label-text">
          {t("m-excel")}
        </label>
        {!fileName ? (
          <>
            <button
              id="selectExcel"
              className="choose-excel-btn"
              type="button"
              onClick={handleButtonClick}
            >
              {t("m-c-file")}
            </button>
          </>
        ) : (
          <div className="selected-file d-flex a-center">
            <FaFileExcel
              className="file-icon"
              style={{ color: "green", fontSize: "20px" }}
            />
            <span className="file-name px10">{fileName.slice(0,25)}...</span>
            <span onClick={handleClear} className="btn">
              X
            </span>
          </div>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx, .xls"
          style={{ display: "none" }}
          onChange={handleExcelChange}
        />
        <button
          className="w-btn "
          type="submit"
          disabled={status === "loading"}
        >
          {status === "loading" ? `${t("m-uploading")}` : `${t("m-upload")}`}
        </button>
      </form>
    </div>
  );
};

export default UploadMilkColl;
