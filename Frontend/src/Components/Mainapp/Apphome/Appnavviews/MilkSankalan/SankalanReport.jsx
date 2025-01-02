import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaDownload } from "react-icons/fa6";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import { mobileMilkCollReport } from "../../../../../App/Features/Mainapp/Milk/MilkCollectionSlice";
import "../../../../../Styles/Mainapp/Apphome/Appnavview/Milkcollection.css";
import { useTranslation } from "react-i18next";

const SankalanReport = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation(["common", "milkcollection"]);
  const [period, setPeriod] = useState("2");
  const [filteredData, setFilteredData] = useState([]);
  // const tDate = useSelector((state) => state.date.toDate);
  const mobileMilkReport = useSelector(
    (state) => state.milkCollection.mobileColl
  );

  useEffect(() => {
    setFilteredData(mobileMilkReport);
  }, []);

  const calculateTotalLiters = (data) => {
    return data.reduce((total, item) => total + parseFloat(item.Litres), 0);
  };

  const records = filteredData.length;
  const totalLiters = calculateTotalLiters(filteredData);

  // Function to download Excel file
  const downloadExcel = () => {
    if (filteredData.length === 0) {
      alert("No data available to export.");
      return;
    }

    // Prepare data for Excel (excluding automatic headers)
    const excelData = filteredData.map((collection) => [
      collection.rno,
      collection.cname,
      collection.Litres,
      collection.SampleNo,
    ]);

    // Add headings manually
    const worksheet = XLSX.utils.aoa_to_sheet([
      ["Code", "Customer Name", "Liters", "Sample No.", "FAT", "SNF"],
      ...excelData,
      [],
      ["Total Liters", "=", totalLiters.toFixed(2)],
    ]);

    // Get current date and time for the file name
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(
      now.getMonth() + 1
    ).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

    const fileName = `Mobile_Milk_Collection_${formattedDate}.xlsx`;

    // Create a workbook and export it
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Report");
    XLSX.writeFile(workbook, fileName);
  };

  // Function to download PDF file
  const downloadPDF = () => {
    if (filteredData.length === 0) {
      alert("No data available to export.");
      return;
    }

    // Create a new PDF instance
    const doc = new jsPDF();

    // Add title and metadata
    doc.setFontSize(14);
    doc.text("Mobile Milk Collection Report", 14, 20);

    // Prepare data for the table
    const tableData = filteredData.map((collection) => [
      collection.rno,
      collection.cname,
      collection.Litres.toFixed(2),
      collection.SampleNo,
    ]);

    // Table headers
    const tableHeaders = [
      "Code",
      "Customer Name",
      "Liters",
      "Sample No.",
      "FAT",
      "SNF",
    ];

    // Add table to the PDF
    doc.autoTable({
      head: [tableHeaders],
      body: tableData,
      startY: 30,
    });

    // Calculate totals and add a summary row
    const totalLiters = filteredData.reduce(
      (sum, item) => sum + item.Litres,
      0
    );
    doc.text(
      `Total Sample: ${records} , Total Liters: ${totalLiters.toFixed(2)}`,
      14,
      doc.lastAutoTable.finalY + 10
    );

    // Get current date for the file name
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(
      now.getMonth() + 1
    ).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

    const fileName = `Mobile_Milk_Collection_${formattedDate}.pdf`;

    // Save the PDF
    doc.save(fileName);
  };

  const initialValues = {
    date: "",
  };

  const [values, setValues] = useState(initialValues);

  const handleInputs = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });

    // // Validate field and update errors state
    // const fieldError = validateField(name, value);
    // setErrors((prevErrors) => ({
    //   ...prevErrors,
    //   ...fieldError,
    // }));
  };

  const handleMilkColletorData = (e) => {
    e.preventDefault();
    console.log("exicuted", values);
    dispatch(mobileMilkCollReport({ date: values.date }));
  };

  useEffect(() => {
    if (period === "0") {
      setFilteredData(mobileMilkReport.filter((item) => item.ME === 0));
    } else if (period === "1") {
      setFilteredData(mobileMilkReport.filter((item) => item.ME === 1));
    } else {
      setFilteredData(mobileMilkReport);
    }
  }, [period, mobileMilkReport]);

  return (
    <div className="mobile-milk-collection-report w100 h1 d-flex-col center sa">
      <div className="page-title-button-div w70 h10 d-flex a-center sb">
        <label className="heading w60">
          {t("milkcollection:m-milk-coll-report")}
          {/* <span className="label-text px10">{tDate}</span> */}
        </label>
        <button className="btn" onClick={downloadPDF}>
          <span className="f-heading px10">PDF</span>
          <FaDownload className="d-icons" />
        </button>
        <button className="btn" onClick={downloadExcel}>
          <span className="f-heading px10">
            {t("milkcollection:m-d-excel")}
          </span>
          <FaDownload className="d-icons" />
        </button>
      </div>
      <form
        onSubmit={handleMilkColletorData}
        className="fetch-sankalan-div w70 h10 d-flex a-center sb">
        <div className="input-date-div w65 d-flex a-center sb">
          <label htmlFor="date" className="label-text w30">
            {t("milkcollection:m-s-date")}
          </label>
          <input
            className="w40 data"
            type="date"
            name="date"
            id="date"
            onChange={handleInputs}
          />
          <button className="heading btn ">
            {t("milkcollection:m-d-show")}
          </button>
        </div>
        <div className="input-date-div w40 d-flex a-center">
          <label htmlFor="period" className="label-text w40">
            {t("milkcollection:m-s-shift")}
          </label>
          <select
            className="w60 data"
            id="period"
            value={period}
            onChange={(e) => setPeriod(e.target.value)}>
            <option value="2">All</option>
            <option value="0">Morning</option>
            <option value="1">Evening</option>
          </select>
        </div>
      </form>
      <div className="milk-collection-info-div w70 h70 d-flex-col sa bg">
        <div className="collection-info-heading w100 h10 d-flex a-center t-center sa bg1">
          <span className="f-label-text w10">
            {t("milkcollection:m-cust-code")}
          </span>
          <span className="f-label-text w40">
            {t("milkcollection:m-cust-name")}
          </span>
          <span className="f-label-text w10">{t("c-liters")}</span>
          <span className="f-label-text w20">
            {" "}
            {t("milkcollection:m-sample-no")}
          </span>
        </div>
        <div className="milk-collection-data-div w100 d-flex-col h90 mh90 hidescrollbar">
          {filteredData.length > 0 ? (
            filteredData.map((collection, index) => (
              <div
                key={index}
                className={`collection-info-heading w100 h10 d-flex a-center t-center sa ${
                  index % 2 === 0 ? "bg-light" : "bg-dark"
                }`}
                style={{
                  backgroundColor: index % 2 === 0 ? "#faefe3" : "#fff",
                }}>
                <span className="text w10">{collection.rno}</span>
                <span className="text w40 t-center">{collection.cname}</span>
                <span className="text w10">{collection.Litres}</span>
                <span className="text w20">{collection.SampleNo}</span>
              </div>
            ))
          ) : (
            <div className="w100 h1 d-flex center">
              <span className="label-text">{t("c-no-data-avai")}</span>
            </div>
          )}
        </div>
      </div>
      <div className="mobile-milk-btns w100 h10 d-flex a-center j-center sa">
        <span className="heading py10">
          {t("milkcollection:m-count")} : {records}
        </span>
        <span className="heading py10">
          {t("milkcollection:m-t-liters")} : {totalLiters.toFixed(2)}
        </span>
      </div>
    </div>
  );
};

export default SankalanReport;
