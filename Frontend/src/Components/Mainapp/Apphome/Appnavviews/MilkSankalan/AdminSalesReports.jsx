import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaFilePdf } from "react-icons/fa6";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import {
  getAllMilkSankalan,
  mobileMilkCollReport,
} from "../../../../../App/Features/Mainapp/Milk/MilkCollectionSlice";
import { useTranslation } from "react-i18next";
import { listEmployee } from "../../../../../App/Features/Mainapp/Masters/empMasterSlice";
import { RiFileExcel2Fill } from "react-icons/ri";
import "../../../../../Styles/Mainapp/Apphome/Appnavview/Milkcollection.css";
import Spinner from "../../../../Home/Spinner/Spinner";
import {
  getAllSale,
  getvehicleSale,
} from "../../../../../App/Features/Sales/salesSlice";

const AdminSalesReports = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation(["common", "milkcollection"]);
  const dairy_name = useSelector((state) => state.dairy.dairyData.SocietyName);
  // State selectors
  const tDate = useSelector((state) => state.date.toDate);
  // -------------------------------------------------------------------------------------------->
  const AllSales = useSelector((state) => state.sales.allSales);
  const salesStatus = useSelector((state) => state.sales.allstatus);
  // -------------------------------------------------------------------------------------------->
  const centerList = useSelector(
    (state) => state.center.centersList || []
  );

  const Emplist = useSelector((state) => state.emp.emplist || []);

  // Local states ----------------------------------------------------------->
  const [errors, setErrors] = useState({});
  const [selectedCenterId, setSelectedCenterId] = useState("0");
  const [selectedEmp, setSelectedEmp] = useState("");
  const [filteredSaleData, setFilteredSaleData] = useState([]);
  const [selectedCenterName, setSelectedCenterName] = useState("");
  const initialValues = {
    fromdate: tDate || "",
    todate: tDate || "",
  };

  const [values, setValues] = useState(initialValues);
  // calculate amount -------------------------------------------------->
  const calculateTotalAmount = (data) => {
    return data.reduce((total, item) => total + parseFloat(item.Amount), 0);
  };

  const calculateTotalQty = (data) => {
    return data.reduce((sum, item) => sum + parseInt(item.Qty), 0);
  };

  const Qty = calculateTotalQty(AllSales);
  const totalAmount = calculateTotalAmount(AllSales);
  //--------------------------------------------------------------------------------------->
  useEffect(() => {
    dispatch(listEmployee());
    dispatch(mobileMilkCollReport());
  }, [dispatch]);

  useEffect(() => {
    if (selectedEmp) {
      const filteredData = AllSales.filter(
        (data) => data.createdby === selectedEmp
      );
      setFilteredSaleData(filteredData);
    } else {
      setFilteredSaleData(AllSales);
    }
  }, [selectedEmp]);

  const milkCollectors = useMemo(() => {
    return Emplist.filter(
      (emp) =>
        emp.center_id.toString() === selectedCenterId &&
        emp.designation === "mobilecollector"
    );
  }, [selectedCenterId, Emplist]);

  const handleCenterChange = (event) => {
    const selectedCenterId = event.target.value;
    const selectedCenter = centerList.find(
      (center) => center.center_id.toString() === selectedCenterId
    );
    setSelectedCenterName(selectedCenter ? selectedCenter.center_name : "");
    setSelectedCenterId(selectedCenterId);
  };

  const handleCollectorChange = (event) => {
    const selectedEmp = event.target.value;
    const selectedEmpname = Emplist.find(
      (emp) => emp.emp_mobile.toString() === selectedEmp
    );
    setSelectedEmpName(selectedEmpname ? selectedEmpname.emp_name : "");
    setSelectedEmp(selectedEmp);
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
      console.log("doneeeeeeeeeeeee");

      dispatch(
        getAllSale({ fromdate: values.fromdate, todate: values.todate })
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

  const calculateTotalLiters = (data) =>
    data.reduce((total, item) => total + parseFloat(item.Litres), 0);

  return (
    <div className="milk-collector-reports w100 h1 d-flex-col sb p10">
      <label htmlFor="" className="heading">
        {t("milkcollection:m-sale-report")} :
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
          <div className="label-select-div w60 d-flex-col a-center j-start sa">
            <select
              className="data w100 h50 my5"
              id="center"
              value={selectedCenterId}
              onChange={handleCenterChange}
            >
              {centerList.map((center, i) => (
                <option key={i} value={center.center_id}>
                  {center.center_name}
                </option>
              ))}
            </select>
            <select
              className="data w100 h50"
              id="milk-collector"
              value={selectedEmp}
              onChange={handleCollectorChange}
            >
              <option value="">-{t("milkcollection:m-select-coll")}-</option>
              {milkCollectors.map((emp, i) => (
                <option key={i} value={emp.emp_mobile}>
                  {emp.emp_name}
                </option>
              ))}
            </select>
          </div>
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
    </div>
  );
};

export default AdminSalesReports;
