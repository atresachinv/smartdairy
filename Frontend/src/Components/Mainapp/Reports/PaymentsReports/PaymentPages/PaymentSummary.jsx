import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { toast } from "react-toastify";
import Spinner from "../../../../Home/Spinner/Spinner";
import { getPaymentsDeductionInfo } from "../../../../../App/Features/Deduction/deductionSlice";
import "../../../../../Styles/Mainapp/Reports/PaymentReports/PaymentSummary.css";
import { getPaymentSummary } from "../../../../../App/Features/Payments/paymentSlice";

const PaymentSummary = ({ showbtn, setCurrentPage }) => {
  const dispatch = useDispatch();
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [deductionData, setDeductionData] = useState({});
  const paysummaryData = useSelector((state) => state.payment?.paySummary);
  const tableRefs = useRef([]); // Array of refs  mn for multiple tables
  const fromdate = useRef([]); // Array of refs  mn for multiple tables
  const toDates = useRef([]); // Array of refs  mn for multiple tables
  
  const deduction = useSelector((state) => state.deduction.alldeductionInfo);
  const status = useSelector((state) => state.deduction.deductionstatus);
  const dairyname = useSelector(
    (state) =>
      state.dairy.dairyData?.SocietyName || state.dairy.dairyData?.center_name
  );
  const CityName = useSelector((state) => state.dairy.dairyData?.city);

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
  // Handle show payment summary ------------------------------------------->
  // ----------------------------------------------------------------------->
  const handlefetchData = (e) => {
    e.preventDefault();
    if (fromDate && toDate) {
      dispatch(getPaymentsDeductionInfo({ fromDate, toDate }));
      dispatch(getPaymentSummary({ FromDate: fromDate, ToDate: toDate }));
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
  const handleKeyDown = (e, nextRef) => {
    if (e.key === "Enter" && nextRef.current) {
      e.preventDefault();
      nextRef.current.focus();
    }
  };

  // Print Report --------------------------------------------------------->

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
  // Date holding
  useEffect(() => {
    const savedFromDate = localStorage.getItem("fromDate");
    const savedToDate = localStorage.getItem("toDate");

    if (savedFromDate) setFromDate(savedFromDate);
    if (savedToDate) setToDate(savedToDate);
  }, []);

  // Save dates to localStorage on change
  useEffect(() => {
    localStorage.setItem("fromDate", fromDate);
  }, [fromDate]);

  useEffect(() => {
    localStorage.setItem("toDate", toDate);
  }, [toDate]);

  return (
    <div className="payment-summary-container w100 h1 d-flex-col sb">
      <div className="title-back-btn-container w100 h10 d-flex a-center sb">
        <span className="heading">पेमेंट समरी :</span>
        {showbtn ? (
          <button
            className="btn-danger mx10"
            onClick={() => setCurrentPage("main")}
          >
            बाहेर पडा
          </button>
        ) : (
          ""
        )}
      </div>
      <form
        onSubmit={handlefetchData}
        className="from-to-date-button-container w100 h10 d-flex a-center sa"
      >
        <div className="date-from-to-div w60 d-flex">
          <div className="from-div-container w45 d-flex h1 a-center sa">
            <label className="label-text w30">पासुन :</label>
            <input
              className="data w60"
              type="date"
              value={fromDate}
              ref={fromdate}
              onKeyDown={(e) => handleKeyDown(e, toDates)}
              onChange={(e) => setFromDate(e.target.value)}
              placeholder="From Date"
            />
          </div>
          <div className="from-div-container w45 d-flex h1 a-center sa">
            <label className="label-text w20">पर्यंत: </label>
            <input
              type="date"
              className="data w60"
              value={toDate}
              ref={toDates}
              onChange={(e) => setToDate(e.target.value)}
              placeholder="To Date"
              min={fromDate}
            />
          </div>
        </div>
        <div className="button-print-export-div w40 a-center sa d-flex">
          <button type="submit" className="w-btn">
            दाखवा
          </button>
          <button type="button" className="w-btn" onClick={handlePrint}>
            प्रिंट
          </button>
          <button type="button" className="w-btn" onClick={generatePDF}>
            PDF
          </button>
        </div>
      </form>
      <div className="payment-summary-outer-container d-flex-col w100 h80 p10">
        {status === "loading" ? (
          <div className="box d-flex center">
            <Spinner />
          </div>
        ) : deduction.length > 0 ? (
          <div className="payment-summary-details-container w100 h1 d-flex-col sb">
            <div className="payment-summary-total-details-container w100 h25 d-flex t-center sa">
              <div className="headings-pay-summary-totals-container w20 d-flex-col a-center sa bg7 br9">
                <span className="w100 h50 d-flex center f-label-text">
                  एकूण लिटर
                </span>
                <span
                  className="w100 h50 d-flex center label-text br-bottom"
                  style={{ backgroundColor: "#faefe3" }}
                >
                  {paysummaryData?.totalLiters?.toFixed(2) || 0}
                </span>
              </div>
              <div className="headings-pay-summary-totals-container w20 d-flex-col a-center sa bg7 br9">
                <span className="w100 h50 d-flex center f-label-text">
                  एकूण पेमेंट
                </span>
                <span
                  className="w100 h50 d-flex center label-text br-bottom"
                  style={{ backgroundColor: "#faefe3" }}
                >
                  {paysummaryData?.totalPayment?.toFixed(2) || 0}
                </span>
              </div>
              <div className="headings-pay-summary-totals-container w20 d-flex-col a-center sa bg7 br9">
                <span className="w100 h50 d-flex center f-label-text">
                  एकूण कपात
                </span>
                <span
                  className="w100 h50 d-flex center label-text br-bottom"
                  style={{ backgroundColor: "#faefe3" }}
                >
                  {paysummaryData?.totalDeduction?.toFixed(2) || 0}
                </span>
              </div>
              <div className="headings-pay-summary-totals-container w20 d-flex-col a-center sa bg7 br9">
                <span className="w100 h50 d-flex center f-label-text">
                  निव्वळ पेमेंट
                </span>
                <span
                  className="w100 h50 d-flex center label-text br-bottom"
                  style={{ backgroundColor: "#faefe3" }}
                >
                  {paysummaryData?.totalNetPay?.toFixed(2) || 0}
                </span>
              </div>
            </div>
            <div className="payment-deduction-info-outer-container w100 h70 d-flex-col center">
              <div className="payment-summary-info-container w50 h1 mh100 hidescrollbar d-flex-col center sb">
                <div className="headings-pay-summary-totals-container w100 p10 d-flex t-center sticky-top sb bg7 br-top">
                  <span className="w50 f-label-text">कपातीचे नाव</span>
                  <span className="w50 f-label-text">कपात रक्कम</span>
                </div>
                {Object.entries(deductionData).map(([name, total], index) => (
                  <div
                    key={index}
                    style={{
                      backgroundColor: index % 2 === 0 ? "#faefe3" : "#fff",
                    }}
                    className="headings-pay-summary-totals-container w100 p10 d-flex a-center sb"
                  >
                    <span className="w50 label-text px10">{name}</span>
                    <span className="w50 label-text t-end px10">
                      {total.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="headings-pay-summary-totals-container w50 p10 d-flex a-center sb bg1 br-bottom">
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

export default PaymentSummary;
