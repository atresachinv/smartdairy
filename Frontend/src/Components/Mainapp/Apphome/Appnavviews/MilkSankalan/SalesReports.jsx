import React, { useEffect, useState } from "react";
// import agra from "../../../../../assets/agra.ttf";
import { useDispatch, useSelector } from "react-redux";
import { FaFilePdf } from "react-icons/fa6";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { RiFileExcel2Fill } from "react-icons/ri";
import Spinner from "../../../../Home/Spinner/Spinner";
import "../../../../../Styles/Mainapp/Apphome/Appnavview/Reports.css";
import { getvehicleSale } from "../../../../../App/Features/Sales/salesSlice";

const SalesReports = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation(["common", "milkcollection"]);
  //redux states
  const collectorname = useSelector((state) => state.userinfo.profile.emp_name);
  const tDate = useSelector((state) => state.date.toDate);
  const dairyname = useSelector(
    (state) =>
      state.dairy.dairyData.SocietyName || state.dairy.dairyData.center_name
  );
  const centerid = useSelector(
    (state) =>
      state.dairy.dairyData.center_id || state.dairy.dairyData.center_id
  );
  // const tDate = useSelector((state) => state.date.toDate);
  const mobileMilkReport = useSelector(
    (state) => state.milkCollection.mobileColl
  );
  const AllSales = useSelector((state) => state.sales.vehiclesales);
  const salesStatus = useSelector((state) => state.sales.salesstatus);
  const [filteredData, setFilteredData] = useState([]);
  const initialValues = {
    fromdate: tDate || "",
    todate: tDate || "",
  };

  const [values, setValues] = useState(initialValues);
  console.log(values.date);

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

  useEffect(() => {
    setFilteredData(mobileMilkReport);
  }, []);

  const calculateTotalAmount = (data) => {
    return data.reduce((total, item) => total + parseFloat(item.Amount), 0);
  };

  const calculateTotalQty = (data) => {
    return data.reduce((sum, item) => sum + parseInt(item.Qty), 0);
  };

  const Qty = calculateTotalQty(AllSales);
  const totalAmount = calculateTotalAmount(AllSales);
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

    // Prepare data for Excel (excluding automatic headers)
    const excelData = AllSales.map((sales) => [
      formatDate(sales.BillDate),
      sales.BillNo,
      sales.CustCode,
      sales.cust_name,
      sales.ItemCode,
      sales.ItemName,
      sales.Qty,
      sales.rate,
      sales.Amount,
      sales.cgst || 0,
      sales.sgst || 0,
      sales.cn || 0,
    ]);

    // Add headings manually
    const worksheet = XLSX.utils.aoa_to_sheet([
      [
        "Bill Date",
        "Bill No.",
        "Code",
        "Name",
        "Product Code",
        "Product",
        "Qty",
        "Rate",
        "Amount",
        "cgst %",
        "sgst %",
        "cn",
      ],
      ...excelData,
    ]);

    // Get current date for the file name
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(
      now.getMonth() + 1
    ).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

    const fileName = `Vehicle_Sales_Report_${formattedDate}.xlsx`;

    // Create a workbook and export it
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "sheet1");
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
    const dairyName = dairyname; // Replace with actual dairy name
    const reportName = "Mobile Milk Collection Report";
    const Dates = values.date;
    const milkcollector = collectorname;

    // Add title and metadata to the PDF
    doc.setFontSize(14);
    doc.text(reportName, pageWidth / 2, 10, { align: "center" }); // Report name

    doc.setFontSize(12);
    doc.text(dairyName, pageWidth / 2, 16, { align: "center" }); // Dairy name
    if (collectorname) {
      doc.setFontSize(12);
      doc.text(milkcollector, pageWidth / 2, 24, { align: "center" }); // Collector name
    }
    doc.setFontSize(10);
    doc.text(`Date: ${Dates}`, 15, 24, { align: "left" }); // Date on left side

    // Function to format date as dd/mm/yyyy
    const formatDate = (date) => {
      if (!date) return "";
      const d = new Date(date);
      return `${String(d.getDate()).padStart(2, "0")}/${String(
        d.getMonth() + 1
      ).padStart(2, "0")}/${d.getFullYear()}`;
    };

    // Prepare data for the table
    const tableData = AllSales.map((sales) => [
      formatDate(sales.BillDate),
      sales.BillNo,
      sales.CustCode,
      sales.cust_name,
      sales.ItemCode,
      sales.ItemName,
      sales.Qty,
      sales.rate,
      sales.Amount,
      sales.cgst,
      sales.sgst,
      sales.cn,
    ]);

    // Table headers
    const tableHeaders = [
      "Bill Date",
      "Bill No.",
      "Code",
      "Name",
      "Product Code",
      "Product",
      "Qty",
      "Rate",
      "Amount",
      "cgst %",
      "sgst %",
      "cn",
    ];

    // Add table to the PDF
    doc.setFontSize(10);
    doc.autoTable({
      head: [tableHeaders],
      body: tableData,
      startY: 30,
      styles: { fontSize: 10 },
    });

    // Calculate totals
    const totalAmount = AllSales.reduce(
      (sum, item) => sum + Number(item.Amount),
      0
    );
    const totalQty = AllSales.reduce((sum, item) => sum + Number(item.Qty), 0);

    // Add total summary below the table
    const finalY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(11);
    doc.text(
      `Total Quantity: ${totalQty}, Total Amount: ${totalAmount.toFixed(2)}`,
      pageWidth / 2,
      finalY,
      {
        align: "center",
      }
    );

    // Get current date for the file name
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(
      now.getMonth() + 1
    ).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

    const fileName = `Vehicle_Sales_Report_${formattedDate}.pdf`;

    // Save the PDF
    doc.save(fileName);
  };

  // handle show sales reports ------------------------------------------------->
  const handleVehicleSales = (e) => {
    e.preventDefault();
    dispatch(
      getvehicleSale({ fromdate: values.fromdate, todate: values.todate })
    );
  };

  // useEffect(() => {
  //   dispatch(getvehicleSale(values.date));
  // }, [dispatch, values.date]);

  return (
    <div className="mobile-milk-collection-report w100 h1 d-flex-col center sa">
      <div className="page-title-button-div w90 h10 d-flex a-center sb">
        <label className="heading w60">Sales Report</label>
        <button className="btn" onClick={downloadPDF}>
          <span className="f-heading px10">PDF</span>
          <FaFilePdf className="d-icons" />
        </button>
        <button className="btn" onClick={downloadExcel}>
          <span className="f-heading px10">
            {t("milkcollection:m-d-excel")}
          </span>
          <RiFileExcel2Fill className="d-icons" />
        </button>
      </div>
      <form
        onSubmit={handleVehicleSales}
        className="fetch-sankalan-div w90 h10 d-flex a-center j-start my5">
        <label
          htmlFor="fromdate"
          className="label-text start-date-text w10 t-center">
          {t("milkcollection:m-s-date")}
        </label>
        <input
          className="w20 data"
          type="date"
          name="fromdate"
          id="fromdate"
          value={values.fromdate || ""}
          onChange={handleInputs}
          max={values.todate}
        />
        <label htmlFor="todate" className="label-text px10 t-center">
          To
        </label>
        <input
          className="w20 data"
          type="date"
          name="todate"
          id="todate"
          min={values.fromdate}
          max={tDate}
          value={values.todate || ""}
          onChange={handleInputs}
        />
        <button type="submit" className="heading btn mx10">
          {t("milkcollection:m-d-show")}
        </button>
      </form>
      <div className="milk-sales-data-div w100 d-flex-col h90 mh90 hidescrollbar bg">
        <div className="sales-info-heading w100 h10 d-flex a-center t-center sa bg7">
          <span className="f-label-text w10">Sr.no</span>
          <span className="f-label-text w10">Re. No.</span>
          <span className="f-label-text w10">Code</span>
          <span className="f-label-text w30">Customer Name</span>
          <span className="f-label-text w30">Product</span>
          <span className="f-label-text w10">Qty</span>
          <span className="f-label-text w10">Rate</span>
          <span className="f-label-text w10">Amount</span>
        </div>
        {salesStatus === "loading" ? (
          <div className="w100 h80 d-flex center">
            <Spinner />
          </div>
        ) : AllSales.length > 0 ? (
          AllSales.map((sales, index) => (
            <div
              key={index}
              className={`sales-info-data w100 h10 d-flex a-center t-center sa ${
                index % 2 === 0 ? "bg-light" : "bg-dark"
              }`}
              style={{
                backgroundColor: index % 2 === 0 ? "#faefe3" : "#fff",
              }}>
              <span className="label-text w10">{index + 1}</span>
              <span className="label-text w10">{sales.ReceiptNo}</span>
              <span className="label-text w10">{sales.CustCode}</span>
              <span className="label-text w30">{sales.cust_name}</span>
              <span className="label-text w30">{sales.ItemName}</span>
              <span className="label-text w10">{sales.Qty}</span>
              <span className="label-text w10">{sales.rate}</span>
              <span className="label-text w10">{sales.Amount}</span>
            </div>
          ))
        ) : (
          <div className="w100 h1 d-flex center">
            <span className="label-text">{t("c-no-data-avai")}</span>
          </div>
        )}
      </div>
      <div className="mobile-milk-btns w100 h10 d-flex a-center j-center sa">
        <span className="heading py10">total Qunty: {Qty}</span>
        <span className="heading py10">
          Total Amount : {totalAmount.toFixed(2)}
        </span>
      </div>
    </div>
  );
};

export default SalesReports;
