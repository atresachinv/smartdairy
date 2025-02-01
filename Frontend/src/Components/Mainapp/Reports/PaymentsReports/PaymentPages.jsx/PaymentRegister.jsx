import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
// import "../../../../Styles/MachineSettings/MachineSettings.css";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { toast } from "react-toastify";
import Spinner from "../../../../Home/Spinner/Spinner";
import { getPaymentsDeductionInfo } from "../../../../../App/Features/Deduction/deductionSlice";
import "../../../../../Styles/Mainapp/Reports/PaymentReports/PaymentRegister.css";

const PaymentRegister = () => {
  const dispatch = useDispatch();
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [deductionData, setDeductionData] = useState({});
  const tableRefs = useRef([]); // Array of refs for multiple tables
  const deduction = useSelector((state) => state.deduction.alldeductionInfo);
  const status = useSelector((state) => state.deduction.deductionstatus);
  const dairyname = useSelector(
    (state) =>
      state.dairy.dairyData.SocietyName || state.dairy.dairyData.center_name
  );
  const CityName = useSelector((state) => state.dairy.dairyData.city);

  // ---------------------------------------------------------------------->
  // Calculate totals ----------------------------------------------------->
  // ---------------------------------------------------------------------->
  const calculateTotals = () => {
    const totals = {
      tliters: 0,
      pamt: 0,
      damt: 0,
      namt: 0,
    };
    deduction.forEach((data) => {
      totals.tliters += data.tliters || 0;
      totals.pamt += data.pamt || 0;
      totals.damt += data.damt || 0;
      totals.namt += data.namt || 0;
    });

    return totals;
  };
  const totals = calculateTotals();

  // ----------------------------------------------------------------------->
  // Fetch Data Handler ---------------------------------------------------->
  // ----------------------------------------------------------------------->
  const handlefetchData = (e) => {
    e.preventDefault();
    if (fromDate && toDate) {
      dispatch(getPaymentsDeductionInfo({ fromDate, toDate }));
    } else {
      toast.error("Please select a valid date range.");
    }
  };

  useEffect(() => {
    const groupedDeductions = deduction.reduce((acc, item) => {
      if (item.dname) {
        // Ensure dname is not empty
        acc[item.dname] = (acc[item.dname] || 0) + item.AMT;
      }
      return acc;
    }, {});
    setDeductionData(groupedDeductions);
  }, [deduction]);

  // ---------------------------------------------------------------------->
  // Generate PDF --------------------------------------------------------->
  // ---------------------------------------------------------------------->
  const generatePDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth(); // Get page width
    let startY = 20;

    // Function to format date as dd-mm-yyyy
    const formatDate = (dateString) => {
      if (!dateString) return "N/A";
      const date = new Date(dateString);
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    };

    // Format the dates
    const formattedFromDate = formatDate(fromDate);
    const formattedToDate = formatDate(toDate);

    // Function to center text
    const centerText = (text, y, fontSize = 14) => {
      doc.setFontSize(fontSize);
      const textWidth = doc.getTextWidth(text);
      doc.text(text, (pageWidth - textWidth) / 2, y);
    };
    // Add header information
    centerText(`${dairyname} , ${CityName} ` || "", startY, 16);
    startY += 10;
    centerText("Payment Register Summary", startY, 12);
    startY += 10;
    centerText(
      `Date: From ${formattedFromDate} To ${formattedToDate}`,
      startY,
      12
    );
    startY += 20;

    // Add the summary table
    doc.autoTable({
      startY,
      head: [
        ["Total Liters", "Total Payment", "Total Deductions", "Net Payment"],
      ],
      body: [
        [
          totals.tliters.toFixed(2),
          totals.pamt.toFixed(2),
          totals.damt.toFixed(2),
          totals.namt.toFixed(2),
        ],
      ],
      theme: "grid",
    });

    // Add the detailed table (Deduction Details)
    startY = doc.lastAutoTable.finalY + 10;
    const deductionRows = Object.entries(deductionData).map(
      ([name, amount]) => [
        { content: name, styles: { halign: "left" } },
        { content: amount.toFixed(2), styles: { halign: "right" } },
      ]
    );

    // Add totals row
    deductionRows.push([
      { content: "Total", styles: { fontStyle: "bold", halign: "left" } },
      {
        content: totals.damt.toFixed(2),
        styles: { fontStyle: "bold", halign: "right" },
      },
    ]);

    doc.autoTable({
      startY,
      head: [
        [
          { content: "Deduction Name", styles: { halign: "left" } },
          { content: "Deduction Amount", styles: { halign: "right" } },
        ],
      ],
      body: deductionRows,
      theme: "grid",
    });

    // Save the PDF with formatted date
    doc.save(`Payment_Summary_${formattedFromDate}_to_${formattedToDate}.pdf`);
  };

  // ---------------------------------------------------------------------->
  // Print Report --------------------------------------------------------->
  // ---------------------------------------------------------------------->
  const handlePrint = () => {
    const printWindow = window.open("", "_blank");

    if (printWindow) {
      printWindow.document.write(`
      <html>
        <head>
          <title>Print Report</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .header { text-align: center; margin-bottom: 20px; }
            .header h1, .header h2, .header h3, .header h4 { margin: 0; padding: 5px; }
            .header h1 { font-size: 24px; font-weight: bold; }
            .header h2 { font-size: 20px; }
            .header h3 { font-size: 16px; }
            .header h4 { font-size: 14px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid black; padding: 8px; }
            th { background-color: #f2f2f2; text-align: center; }
            td:first-child { text-align: left; }
            td:last-child { text-align: right; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${dairyname || "Dairy Name"}</h1>
            <h2>City: ${CityName || "City Name"}</h2>
            <h3>Payment Register Summary</h3>
            <h4>Date: From ${fromDate || "N/A"} To ${toDate || "N/A"}</h4>
          </div>

          <table>
            <thead>
              <tr>
                <th>Total Liters</th>
                <th>Total Payment</th>
                <th>Total Deductions</th>
                <th>Net Payment</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="font-weight: bold; text-align: center;">${totals.tliters.toFixed(
                  2
                )}</td>
                <td style="font-weight: bold; text-align: center;">${totals.pamt.toFixed(
                  2
                )}</td>
                <td style="font-weight: bold; text-align: center;">${totals.damt.toFixed(
                  2
                )}</td>
                <td style="font-weight: bold; text-align: center;">${totals.namt.toFixed(
                  2
                )}</td>
              </tr>
            </tbody>
          </table>

          <h3>Deduction Details</h3>
          <table>
            <thead>
              <tr>
                <th>Deduction Name</th>
                <th>Deduction Amount</th>
              </tr>
            </thead>
            <tbody>
              ${Object.entries(deductionData)
                .map(
                  ([name, total]) => `
                  <tr>
                    <td>${name}</td>
                    <td>${total.toFixed(2)}</td>
                  </tr>
                `
                )
                .join("")}
              <tr style="font-weight: bold;">
                <td>Total</td>
                <td>${totals.damt.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </body>
      </html>
    `);

      printWindow.document.close();
      printWindow.print();
    } else {
      console.error("Failed to open print window.");
    }
  };

  return (
    <div className="payment-register-container w100 h1 d-flex-col p10">
      <span className="heading">Payment summary</span>
      <form
        onSubmit={handlefetchData}
        className="from-to-date-button-container w100 h20 d-flex">
        <div className="date-from-to-div w40 d-flex h50 ">
          <div className="from-div-container w50 d-flex h1 a-center sa">
            <span className="label-text w20">From:</span>
            <input
              className="data  w70"
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              placeholder="From Date"
            />
          </div>
          <div className="from-div-container w50 d-flex h1 a-center sa">
            <span className="label-text w20">To: </span>
            <input
              type="date"
              className="data w70 "
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              placeholder="To Date"
              min={fromDate}
            />
          </div>
        </div>
        <div className="button-print-export-div w40 h50 a-center sa d-flex">
          <button type="submit" className="w-btn">
            show
          </button>
          <button type="button" className="w-btn" onClick={handlePrint}>
            Print
          </button>
          <button type="button" className="w-btn" onClick={generatePDF}>
            PDF
          </button>
        </div>
      </form>
      <div className="payment-register-outer-container d-flex-col w100 h80 bg">
        {status === "loading" ? (
          <div className="box d-flex center">
            <Spinner />
          </div>
        ) : deduction.length > 0 ? (
          <div className="payment-register-details-container w100 h1">
            <div className="payment-register-total-details-container w100 h20 d-flex t-center sa">
              <div className="headings-pay-register-totals-container w20 h1 d-flex-col a-center sa bg1">
                <span className="w100 h50 d-flex center f-label-text">
                  Total Liters
                </span>
                <span
                  className="w100 h50 d-flex center label-text"
                  style={{ backgroundColor: "#faefe3" }}>
                  {totals.tliters.toFixed(2)}
                </span>
              </div>
              <div className="headings-pay-register-totals-container w20 h1 d-flex-col a-center sa bg1">
                <span className="w100 h50 d-flex center f-label-text">
                  Total Payment{" "}
                </span>
                <span
                  className="w100 h50 d-flex center label-text"
                  style={{ backgroundColor: "#faefe3" }}>
                  {totals.pamt.toFixed(2)}
                </span>
              </div>
              <div className="headings-pay-register-totals-container w20 h1 d-flex-col a-center sa bg1">
                <span className="w100 h50 d-flex center f-label-text">
                  Total Deductions{" "}
                </span>
                <span
                  className="w100 h50 d-flex center label-text"
                  style={{ backgroundColor: "#faefe3" }}>
                  {totals.damt.toFixed(2)}
                </span>
              </div>
              <div className="headings-pay-register-totals-container w20 h1 d-flex-col a-center sa bg1">
                <span className="w100 h50 d-flex center f-label-text">
                  Net Payment
                </span>
                <span
                  className="w100 h50 d-flex center label-text"
                  style={{ backgroundColor: "#faefe3" }}>
                  {totals.pamt.toFixed(2) - totals.damt.toFixed(2)}
                </span>
              </div>

              {/* <div className="headings-pay-register-totals-container w100 h50 py10 d-flex a-center sa bg1">
                <span className="w20 f-label-text">Total Liters</span>
                <span className="w20 f-label-text">Total Payment </span>
                <span className="w20 f-label-text">Total Deductions </span>
                <span className="w20 f-label-text">Net Payment</span>
              </div> 
              <div
                className="headings-pay-register-totals-container w100 h50 d-flex a-center sa"
                style={{ backgroundColor: "#faefe3" }}>
                <span className="w20 label-text">{totals.tliters.toFixed(2)}</span>
                <span className="w20 label-text">{totals.pamt.toFixed(2)}</span>
                <span className="w20 label-text">{totals.damt.toFixed(2)}</span>
                <span className="w20 label-text">{totals.pamt.toFixed(2) - totals.damt.toFixed(2)}</span>
              </div> */}
            </div>
            <div className="payment-deduction-info-container w100 h80 mh80 hidescrollbar d-flex-col center">
              <div className="headings-pay-register-totals-container w50 p10 d-flex t-center sticky-top sb bg1">
                <span className="w50 f-label-text">Deduction Name</span>
                <span className="w50 f-label-text">Deduction Amount</span>
              </div>
              {Object.entries(deductionData).map(([name, total], index) => (
                <div
                  key={index}
                  style={{
                    backgroundColor: index % 2 === 0 ? "#faefe3" : "#fff",
                  }}
                  className="headings-pay-register-totals-container w50 h10 d-flex a-center sb">
                  <span className="w50 label-text px10">{name}</span>
                  <span className="w50 label-text t-end px10">
                    {total.toFixed(2)}
                  </span>
                </div>
              ))}
              <div className="headings-pay-register-totals-container w50 h10 d-flex a-center sb bg1">
                <span className="w50 f-label-text px10">Total : </span>
                <span className="w50 f-label-text t-end px10">
                  {totals.damt.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="box d-flex center">
            <span className="label-text">No records Found!</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentRegister;
