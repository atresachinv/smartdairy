import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaFilePdf } from "react-icons/fa6";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { mobileMilkCollReport } from "../../../../../App/Features/Mainapp/Milk/MilkCollectionSlice";
import { useTranslation } from "react-i18next";
import { listEmployee } from "../../../../../App/Features/Mainapp/Masters/empMasterSlice";
import { RiFileExcel2Fill } from "react-icons/ri";
import "../../../../../Styles/Mainapp/Apphome/Appnavview/Milkcollection.css";
import Spinner from "../../../../Home/Spinner/Spinner";
import { getAllSale } from "../../../../../App/Features/Sales/salesSlice";
import {
  getCenterMilkReport,
  getretailCustomer,
} from "../../../../../App/Features/Mainapp/Milksales/milkSalesSlice";

const MilksalesReport = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation(["common", "milkcollection", "msales"]);
  const dairy_name = useSelector(
    (state) =>
      state.dairy.dairyData.SocietyName || state.dairy.dairyData.center_name
  );
  const center_id = useSelector((state) => state.dairy.dairyData.center_id);
  // State selectors
  const tDate = useSelector((state) => state.date.toDate);
  // -------------------------------------------------------------------------------------------->
  const AllSales = useSelector((state) => state.milksales.centerrecords);
  const salesStatus = useSelector((state) => state.milksales.centersalestatus);
  // -------------------------------------------------------------------------------------------->
  const centerList = useSelector(
    (state) => state.center.centersList || []
  );

  // const Emplist = useSelector((state) => state.emp.emplist || []);

  // Local states ----------------------------------------------------------->
  const [errors, setErrors] = useState({});
  const [selectedCenterId, setSelectedCenterId] = useState("0");
  const [filteredSaleData, setFilteredSaleData] = useState([]);
  const initialValues = {
    fromdate: tDate || "",
    todate: tDate || "",
  };

  const [values, setValues] = useState(initialValues);

  // calculate amount -------------------------------------------------->
  const calculateTotalAmount = (data) => {
    return data.reduce((total, item) => total + parseFloat(item.amt), 0);
  };

  const calculateTotalQty = (data) => {
    return data.reduce((sum, item) => sum + parseInt(item.Qty), 0);
  };
  //--------------------------------------------------------------------------------------->
  useEffect(() => {
    dispatch(getretailCustomer());
  }, [dispatch]);

  // adding All center Data in  FilteredSaleData state ------------------------------------>
  useEffect(() => {
    setFilteredSaleData(AllSales);
  }, [AllSales]);

  const handleretailCenterChange = (event) => {
    const selectedCenterId = event.target.value;
    if (selectedCenterId) {
      const filteredData = AllSales.filter(
        (data) => data.center_id.toString() === selectedCenterId.toString()
      );
      setFilteredSaleData(filteredData);
    }
  };

  const validateField = (name, value) => {
    let error = {};
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      error[name] = "Invalid date format.";
    } else {
      delete errors[name];
    }
    return error;
  };
  console.log(AllSales);
  const validateFields = () => {
    const fieldsToValidate = ["fromdate", "todate"];
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

  const handleInputs = (e) => {
    const { name, value } = e.target;
    setValues((prevValues) => ({ ...prevValues, [name]: value }));
    const fieldError = validateField(name, value);
    setErrors((prevErrors) => ({ ...prevErrors, ...fieldError }));
  };

  const handleShowData = (e) => {
    e.preventDefault();
    if (Object.keys(validateFields()).length === 0) {
      console.log("done", values);

      dispatch(
        getCenterMilkReport({
          fromdate: values.fromdate,
          todate: values.todate,
        })
      );
    }
  };

  // -------------------------------------------------------------------->
  // Function to download Excel file ------------------------------------>
  const downloadExcel = () => {
    if (AllSales.length === 0) {
      toast.error("No data available to export.");
      return;
    }

    // Function to format date as dd/mm/yyyy
    const formatDate = (date) => {
      if (!date) return "";
      const d = new Date(date);
      return `${String(d.getDate()).padStart(2, "0")}/${String(
        d.getMonth() + 1
      ).padStart(2, "0")}/${d.getFullYear()}`;
    };

    // Prepare data for Excel
    const excelData = AllSales.map((sales) => [
      sales.code ?? 0,
      sales.cust_name ?? "--",
      formatDate(sales.saledate),
      sales.liters ?? 0,
      sales.rate ?? 0,
      sales.amt ?? 0,
      sales.paidamt ?? 0,
      sales.paymode === 0 ? "Credit" : sales.paymode === 1 ? "Cash" : "Online",
    ]);

    // Define headers
    const headers = [
      "Code",
      "Name",
      "Bill Date",
      "Liters",
      "Rate",
      "Amount",
      "Paid Amt.",
      "Pay Mode",
    ];

    // Create worksheet
    const worksheet = XLSX.utils.aoa_to_sheet([headers, ...excelData]);

    // Generate file name with timestamp
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(
      now.getMonth() + 1
    ).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
    const formattedTime = `${String(now.getHours()).padStart(2, "0")}${String(
      now.getMinutes()
    ).padStart(2, "0")}${String(now.getSeconds()).padStart(2, "0")}`;
    const fileName = `Retail_Sales_Report_${formattedDate}_${formattedTime}.xlsx`;

    // Create workbook and save file
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Retail Sales");
    XLSX.writeFile(workbook, fileName);
  };

  // -------------------------------------------------------------------->
  // Function to download PDF file ------------------------------------>

  const downloadPDF = () => {
    if (AllSales.length === 0) {
      toast.error("No data available to export.");
      return;
    }

    // Create a new PDF instance
    const doc = new jsPDF();

    // Define page width for horizontal centering
    const pageWidth = doc.internal.pageSize.getWidth();

    // Dairy name, report name, date, and shift
    const dairyName = dairy_name; // Replace with actual dairy name
    const reportName = "Mobile Milk Collection Report";
    const Dates = tDate;
    // const milkcollector = collectorname;

    // Add title and metadata to the PDF
    doc.setFontSize(14);
    doc.text(reportName, pageWidth / 2, 10, { align: "center" }); // Report name

    doc.setFontSize(12);
    doc.text(dairyName, pageWidth / 2, 16, { align: "center" }); // Dairy name
    // if (collectorname) {
    //   doc.setFontSize(12);
    //   doc.text(milkcollector, pageWidth / 2, 24, { align: "center" }); // Collector name
    // }
    doc.setFontSize(10);
    doc.text(`Date: ${Dates}`, 15, 24, { align: "left" }); // Date on left side

    // Calculate pay mode wise totals
    let totalCredit = 0;
    let totalCash = 0;
    let totalOnline = 0;

    // Prepare data for the table
    const tableData = AllSales.map((sales, index) => {
      const payModeText =
        sales.paymode === 0
          ? "Credit"
          : sales.paymode === 1
          ? "Cash"
          : "Online";

      const amount = Number(sales.amt) || 0;

      // Sum amounts based on pay mode
      if (sales.paymode === 0) totalCredit += amount;
      else if (sales.paymode === 1) totalCash += amount;
      else totalOnline += amount;

      return [
        index + 1, // Sr. No.
        sales.code || 0, // Code
        sales.cust_name || "-", // Name
        sales.liters || 0, // Liters (left-aligned)
        sales.rate || 0, // Rate (right-aligned)
        sales.amt || 0, // Amount (right-aligned)
        sales.paidamt || 0, // Paid Amt. (right-aligned)
        payModeText, // Payment mode
      ];
    });

    // Table headers
    const tableHeaders = [
      "Sr. No.",
      "Code",
      "Name",
      "Liters",
      "Rate",
      "Amount",
      "Paid Amt.",
      "Pay Mode",
    ];

    // Add table to the PDF
    doc.setFontSize(10);
    doc.autoTable({
      head: [tableHeaders],
      body: tableData,
      startY: 30,
      styles: { fontSize: 10 },
    });

    // Calculate total amount & quantity
    const totalAmount = AllSales.reduce(
      (sum, item) => sum + Number(item.amt || 0),
      0
    );
    const totalQty = AllSales.reduce(
      (sum, item) => sum + Number(item.liters || 0),
      0
    );

    // Add total summary (left-aligned)
    const finalY = doc.lastAutoTable.finalY + 10;
    doc.text(
      `Total Liters: ${totalQty}, Total Amount: ₹${totalAmount}`,
      15,
      finalY
    );

    // Add pay mode wise totals (left-aligned)
    doc.text(
      `Credit: ₹${totalCredit} | Cash: ₹${totalCash} | Online: ₹${totalOnline}`,
      15,
      finalY + 6
    );

    const fileName = `Vehicle_Sales_Report.pdf`;

    // Save the PDF
    doc.save(fileName);
  };

  return (
    <div className="milk-collector-reports w100 h1 d-flex-col sb p10">
      <label htmlFor="" className="heading">
        {t("milkcollection:m-retail-ms-report")} :
      </label>
      <div className="select-milk-collector-conatiner w100 h20 d-flex a-center sb px10">
        <form
          onSubmit={handleShowData}
          className="form-label-select-div w50 d-flex-col a-center j-start"
        >
          <label htmlFor="date" className="label-text w100">
            {t("common:c-date")} :
          </label>
          <div className="dates-btn-container w100 h1 d-flex a-center sb">
            <div className="dates-container w80 h1 d-flex a-center sb">
              <input
                className={`data w45 ${errors.fromdate ? "input-error" : ""}`}
                type="date"
                name="fromdate"
                id="fromDate"
                onChange={handleInputs}
                required
                max={tDate}
              />
              <label htmlFor="toDate" className="label-text px10">
                To
              </label>
              <input
                className={`data w45 ${errors.todate ? "input-error" : ""}`}
                type="date"
                name="todate"
                id="toDate"
                onChange={handleInputs}
                required
                max={tDate}
              />
            </div>
            <button
              type="submit"
              className="btn"
              disabled={!values.fromdate || !values.todate}
            >
              {t("milkcollection:m-d-show")}
            </button>
          </div>
        </form>
        <div className="selectand-btn-div w50 h1 d-flex a-center j-start sa">
          {center_id === "0" ? (
            <div className="label-select-div w60 d-flex-col a-center j-start sa">
              <select
                className="data w100 h50 my5"
                id="center"
                value={selectedCenterId}
                onChange={handleretailCenterChange}
              >
                {centerList.map((center, i) => (
                  <option key={i} value={center.center_id}>
                    {center.center_name}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className="w60 d-flex-col a-center j-start sa"></div>
          )}

          <div className="collection-download-btn w30 h1 d-flex-col sa">
            <button className="btn" onClick={downloadPDF}>
              <span className="f-heading px10">PDF</span>
              <FaFilePdf />
            </button>
            <button className="btn" onClick={downloadExcel}>
              <span className="f-heading px10">
                {t("milkcollection:m-d-excel")}
              </span>
              <RiFileExcel2Fill />
            </button>
          </div>
        </div>
      </div>
      <div className="milk-sales-data-div w100 d-flex-col h90 mh90 hidescrollbar bg">
        <div className="sales-info-heading w100 h10 d-flex a-center t-center sticky-top py10 sa bg7">
          <span className="f-label-text w10">{t("Bill Date")}</span>
          <span className="f-label-text w10">
            {t("milkcollection:m-cust-code")}
          </span>
          <span className="f-label-text w30">
            {t("milkcollection:m-cust-name")}
          </span>
          <span className="f-label-text w10">{t("c-liters")}</span>
          <span className="f-label-text w10">{t("c-rate")}</span>
          <span className="f-label-text w10">{t("c-amt")}</span>
          <span className="f-label-text w10">{t("msales:m-s-pay-mode")}</span>
          <span className="f-label-text w10">{t("msales:m-s-paid-amt")}</span>
          <span className="f-label-text w10">{t("msales:m-s-cre-amt")}</span>
        </div>
        {salesStatus === "loading" ? (
          <div className="w100 h80 d-flex center">
            <Spinner />
          </div>
        ) : filteredSaleData.length > 0 ? (
          filteredSaleData.map((sales, index) => (
            <div
              key={index}
              className={`sales-info-data w100 h10 d-flex a-center t-center sa ${
                index % 2 === 0 ? "bg-light" : "bg-dark"
              }`}
              style={{
                backgroundColor: index % 2 === 0 ? "#faefe3" : "#fff",
              }}
            >
              <span className="info-text w10">{sales.saledate}</span>
              <span className="info-text w10">{sales.code}</span>
              <span className="info-text w30">{sales.cust_name || "--"}</span>
              <span className="info-text w10">{sales.liters}</span>
              <span className="info-text w10">{sales.rate}</span>
              <span className="info-text w10">{sales.amt}</span>
              <span className="info-text w10">
                {sales.paymode === 0
                  ? `${t("msales:m-s-cre")}`
                  : sales.paymode === 1
                  ? `${t("msales:m-s-cash")}`
                  : `${t("msales:m-s-online")}`}
              </span>
              <span className="info-text w10">{sales.paidamt}</span>
              <span className="info-text w10">{sales.credit_amt || 0}</span>
            </div>
          ))
        ) : (
          <div className="w100 h1 d-flex center">
            <span className="label-text">{t("c-no-data-avai")}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default MilksalesReport;
