import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "../../../../../Styles/Mainapp/Reports/PaymentReports/PaymentSummary.css";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import { getPaymentsDeductionInfo } from "../../../../../App/Features/Deduction/deductionSlice";

const PaymentRegister = ({ showbtn, setCurrentPage }) => {
  const dispatch = useDispatch();
  const today = new Date().toISOString().split("T")[0];
  const [fromDate, setFromDate] = useState(today);
  const [toDate, setToDate] = useState(today);
  const [filterCode, setFilterCode] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [selectedCenterId, setSelectedCenterId] = useState("");
  const [processedDeductions, setProcessedDeductions] = useState([]);
  const [dnames, setDnames] = useState([]);

  const tableRef = useRef(null);
  const fromdate = useRef(null);
  const toDates = useRef(null);

  const allDeductions = useSelector(
    (state) => state.deduction.alldeductionInfo
  );
  const customerlist = useSelector((state) => state.customer.customerlist);
  const centerList = useSelector((state) => state.center.centersList || []);
  const dairyname = useSelector(
    (state) =>
      state.dairy.dairyData.SocietyName || state.dairy.dairyData.center_name
  );
  const CityName = useSelector((state) => state.dairy.dairyData.city);

  const handleCenterChange = (event) => {
    setSelectedCenterId(event.target.value);
  };

  const handleKeyDown = (e, nextRef) => {
    if (e.key === "Enter" && nextRef.current) {
      e.preventDefault();
      nextRef.current.focus();
    }
  };

  const fetchData = async () => {
    if (!fromDate || !toDate) return alert("Please select valid date range.");
    try {
      await dispatch(getPaymentsDeductionInfo({ fromDate, toDate })).unwrap();
    } catch (err) {
      console.error("Failed to fetch data", err);
    }
  };

  useEffect(() => {
    if (allDeductions.length > 0 && customerlist.length > 0) {
      const grouped = {};
      const dnameSet = new Set();

      allDeductions.forEach((item) => {
        const code = item.Code;
        const customer = customerlist.find((cust) => cust.srno === code);

        if (item.DeductionId === 0) {
          grouped[code] = {
            ...item,
            customerName: customer ? customer.cname : "",
            center_id: customer ? customer.centerid : "",
          };
        } else {
          if (item.dname && item.AMT !== undefined) {
            const cleanDname = item.dname.replace(/\s+/g, "_");
            dnameSet.add(cleanDname);
            if (!grouped[code]) grouped[code] = {};
            grouped[code][cleanDname] = item.AMT;
          }
        }
      });

      const finalData = Object.values(grouped);
      setProcessedDeductions(finalData);
      setDnames(Array.from(dnameSet));
    }
  }, [allDeductions, customerlist]);

  const filteredDeductions = processedDeductions.filter((item) => {
    const matchesCenter =
      selectedCenterId === "" ||
      item.center_id?.toString() === selectedCenterId;
    const matchesCode =
      !filterCode ||
      item.Code?.toString().toLowerCase().includes(filterCode.toLowerCase());
    const matchesName =
      !customerName ||
      item.customerName?.toLowerCase().includes(customerName.toLowerCase());
    return matchesCenter && matchesCode && matchesName;
  });

  const handlePrint = () => {
    if (!tableRef.current) return;
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    const printContents = tableRef.current.outerHTML;
    printWindow.document.write(`
      <html><head><title>Print</title>
      <style>
      table { border-collapse: collapse; width: 100%; }
      th, td { border: 1px solid black; padding: 8px; text-align: left; }
      th { background-color: #f2f2f2; }
      </style>
      </head><body>
      <h2 style="text-align: center">${dairyname} (${CityName})</h2>
      <h3 style="text-align: center">Payment Register from ${fromDate} to ${toDate}</h3>
      ${printContents}
      </body></html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const handleExportExcel = () => {
    if (!tableRef.current) return;
    const worksheet = XLSX.utils.table_to_sheet(tableRef.current);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "PaymentRegister");
    XLSX.writeFile(workbook, `PaymentRegister_${fromDate}_to_${toDate}.xlsx`);
  };

  const handlePDF = () => {
    if (!tableRef.current) {
      alert("Table not found!");
      return;
    }

    const doc = new jsPDF("p", "mm", "a4");

    // Header
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(`${dairyname} (${CityName})`, 105, 15, { align: "center" });

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Payment Register`, 105, 22, { align: "center" });
    doc.text(`From ${fromDate} To ${toDate}`, 105, 28, { align: "center" });

    const table = tableRef.current;

    // Extract headers
    const headers = Array.from(table.querySelectorAll("thead th")).map((th) =>
      th.innerText.trim()
    );

    // Extract rows
    const rows = Array.from(table.querySelectorAll("tbody tr")).map((tr) =>
      Array.from(tr.querySelectorAll("td")).map((td) => td.innerText.trim())
    );

    // Optional: Create total row (uncomment if needed)
    // const totalRow = headers.map((_, colIndex) => {
    //   const isNumericColumn = rows.every((row) =>
    //     !isNaN(parseFloat(row[colIndex]))
    //   );
    //   if (colIndex === 0) return "Total";
    //   if (isNumericColumn) {
    //     const total = rows.reduce((sum, row) => {
    //       const val = parseFloat(row[colIndex]);
    //       return sum + (isNaN(val) ? 0 : val);
    //     }, 0);
    //     return total.toFixed(2);
    //   }
    //   return "";
    // });

    // Draw table
    doc.autoTable({
      head: [headers],
      body: rows,
      startY: 32,
      styles: {
        fontSize: 8,
        cellPadding: 2,
      },
      headStyles: {
        fillColor: [60, 100, 255],
        textColor: 255,
        fontStyle: "bold",
        halign: "center",
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
      margin: { top: 10, left: 5, right: 5 },
      tableWidth: "auto",
      // foot: [totalRow], // Uncomment if totals are needed
    });

    doc.save(`PaymentRegister_${fromDate}_to_${toDate}.pdf`);
  };

  return (
    <div className="payment-register-container w100 h1 d-flex-col">
      <span className="heading">Payment Register</span>

      <div className=" filter-container d-flex-col  w100 h30 sa bg">
        <div className="from-too-date-button-container w100 h30 d-flex a-center">
          <div className="date-from-toocontainer w80 h50 d-flex sa a-center ">
            <div className="from-date-payment-regssiter w50 a-center  d-flex">
              <span className="info-text w30">From</span>
              <input
                className="data w50"
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                ref={fromdate}
                onKeyDown={(e) => handleKeyDown(e, toDates)}
              />
            </div>
            <div className="to-date-payment-regsiter w50 d-flex a-center  ">
              <span className="info-text w30">To</span>
              <input
                className=" data w50"
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                ref={toDates}
              />
            </div>
          </div>
          <div className="paymnet-register-show-button w20 d-flex">
            <button className="w-btn" onClick={fetchData}>
              Show
            </button>
          </div>
        </div>
        <div className="select-center-cust-code-cust-name w100 d-flex a-center sa">
          <div className="center-selection-payment-div w40 d-flex a-center">
            <span className="label-text w30">Select Center</span>
            <select
              className="data w50"
              onChange={handleCenterChange}
              value={selectedCenterId}
            >
              <option value="">Select Center</option>
              {centerList.map((center) => (
                <option key={center.center_id} value={center.center_id}>
                  {center.name || center.center_name}
                </option>
              ))}
            </select>
          </div>
          <div className="customer-name-code-selection-div w60 d-flex sa  a-center">
            <span className="w30">Code/Name</span>
            <input
              className="data w30"
              type="text"
              placeholder="Cust Code"
              value={filterCode}
              onChange={(e) => setFilterCode(e.target.value)}
            />
            <input
              type="text"
              className="data w30"
              placeholder="Cust Name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
            />
          </div>
        </div>
        <div className="pdf-print-excel-payment-button-div w100 d-flex sa ">
          <button className="w-btn" onClick={handleExportExcel}>
            Excel
          </button>
          <button className="w-btn" onClick={handlePrint}>
            Print
          </button>
          <button className="w-btn" onClick={handlePDF}>
            PDF
          </button>
        </div>
      </div>

      <div className="payment-table-div h70" style={{ overflowX: "auto" }}>
        <table ref={tableRef} className="table">
          <thead>
            <tr>
              <th>Code</th>
              <th>CustName</th>
              <th>Liters</th>
              <th>Payment</th>
              <th>AVGRate</th>
              {dnames.map((dname) => (
                <th key={dname}>{dname}</th>
              ))}
              <th>Deduction</th>
              <th>NAMT</th>
            </tr>
          </thead>

          <tbody>
            {filteredDeductions.length > 0 ? (
              filteredDeductions.map((data, index) => (
                <tr
                  key={index}
                  style={{
                    backgroundColor: index % 2 === 0 ? "#faefe3" : "#fff",
                  }}
                >
                  <td>{data.Code}</td>
                  <td>{data.customerName}</td>
                  <td>{data.tliters}</td>
                  <td>{data.pamt}</td>
                  <td>
                    {data.tliters > 0
                      ? (data.pamt / data.tliters).toFixed(2)
                      : "N/A"}
                  </td>
                  {dnames.map((dname) => (
                    <td key={dname}>{data[dname] || 0}</td>
                  ))}
                  <td>{data.damt}</td>
                  <td>{(data.pamt - data.damt).toFixed(2)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={dnames.length + 6}>No data available</td>
              </tr>
            )}
          </tbody>

          {/* Totals Row */}
          {filteredDeductions.length > 0 && (
            <tfoot>
              <tr style={{ backgroundColor: "#dcdcdc", fontWeight: "bold" }}>
                <td colSpan={2}>Total</td>
                <td>
                  {filteredDeductions
                    .reduce((sum, d) => sum + parseFloat(d.tliters || 0), 0)
                    .toFixed(1)}
                </td>
                <td>
                  {filteredDeductions
                    .reduce((sum, d) => sum + parseFloat(d.pamt || 0), 0)
                    .toFixed(2)}
                </td>
                <td></td>
                {dnames.map((dname) => (
                  <td key={dname}>
                    {filteredDeductions
                      .reduce((sum, d) => sum + parseFloat(d[dname] || 0), 0)
                      .toFixed(2)}
                  </td>
                ))}
                <td>
                  {filteredDeductions
                    .reduce((sum, d) => sum + parseFloat(d.damt || 0), 0)
                    .toFixed(2)}
                </td>
                <td>
                  {filteredDeductions
                    .reduce(
                      (sum, d) =>
                        sum +
                        (parseFloat(d.pamt || 0) - parseFloat(d.damt || 0)),
                      0
                    )
                    .toFixed(2)}
                </td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  );
};

export default PaymentRegister;
