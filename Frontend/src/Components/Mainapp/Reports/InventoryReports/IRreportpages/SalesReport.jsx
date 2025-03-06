import React, { useEffect, useState } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import axios, { all } from "axios";
import { useSelector } from "react-redux";
import "../../../../../Styles/InventoryReports/salesreport.css";

const SalesReport = () => {
  const [saledata, SetSaleData] = useState([]); //.. sale Data
  const [fromdate, setFromDate] = useState("");
  const [todate, setToDate] = useState("");
  const [item, SetItem] = useState([]); //... Item Data
  const [selectedReport, setSelectedReport] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [itemNo, setItemNo] = useState("");

  const dairyname = useSelector(
    (state) =>
      state.dairy.dairyData.SocietyName || state.dairy.dairyData.center_name
  );
  const CityName = useSelector((state) => state.dairy.dairyData.city);

  //...  Saledata Api calling
  useEffect(() => {
    const salefetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4040/smartdairy/api/stock/sale/all",
          { fromdate, todate }
        );

        SetSaleData(response.data.salesData);
      } catch (error) {
        console.log(
          "Error Handling:",
          error.response ? error.response.data : error.message
        );
      }
    };

    salefetchData();
  }, []); // Run useEffect when fromDate or toDate changes-

  //.... GenratePdf

  //....    Sale Register PDf
  const generateSalesReport = () => {
    const doc = new jsPDF();

    // Ensure variables exist before using them
    const dairyName =
      typeof dairyname !== "undefined" ? dairyname : "Dairy Name";
    const city = typeof CityName !== "undefined" ? CityName : "City Name";
    const reportName = "Sales Report";

    // Ensure fromDate and toDate are properly declared
    const reportFromDate = typeof fromDate !== "undefined" ? fromDate : "N/A";
    const reportToDate = typeof toDate !== "undefined" ? toDate : "N/A";

    doc.setFontSize(16);
    doc.text(dairyName, 15, 15);
    doc.setFontSize(12);
    doc.text(`City: ${city}`, 15, 25);
    doc.text(`Report: ${reportName}`, 15, 35);
    doc.text(`From: ${reportFromDate}  To: ${reportToDate}`, 15, 45);

    // ************** Sales Data Table **************
    const tableColumn = [
      "Bill Date",
      "Bill No",
      "Customer Code",
      "Customer Name",
      "Amount",
    ];

    // Ensure 'saledata' is an array
    const tableRows = (Array.isArray(saledata) ? saledata : []).map((item) => [
      item.BillDate ? item.BillDate.slice(0, 10) : "N/A", // Format date (YYYY-MM-DD)
      item.BillNo || "N/A",
      item.CustCode || "N/A",
      item.CustName || "N/A",
      item.Amount ? item.Amount.toFixed(2) : "0.00",
    ]);

    // Calculate Total Amount
    const totalAmount = (Array.isArray(saledata) ? saledata : []).reduce(
      (sum, item) => sum + (item.Amount || 0),
      0
    );

    // Add total row at the end
    tableRows.push(["", "", "", "Total Amount", totalAmount.toFixed(2)]);

    // Generate Sales Table
    doc.autoTable({
      startY: 55,
      head: [tableColumn],
      body: tableRows,
      theme: "grid",
      styles: { fontSize: 10 },
      headStyles: { fillColor: [0, 0, 0] },
    });

    // Save PDF
    doc.save("Sales_Report.pdf");
  };
  // Sale Register  print
  const printSalesReport = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    // Ensure variables exist before using them
    const dairyName =
      typeof dairyname !== "undefined" ? dairyname : "Dairy Name";
    const city = typeof CityName !== "undefined" ? CityName : "City Name";
    const reportName = "Sales Report";

    // Ensure fromDate and toDate are properly declared
    const reportFromDate = typeof fromDate !== "undefined" ? fromDate : "N/A";
    const reportToDate = typeof toDate !== "undefined" ? toDate : "N/A";

    // Ensure 'saledata' is an array
    const tableRows = (Array.isArray(saledata) ? saledata : []).map(
      (item) => `
      <tr>
        <td>${item.BillDate ? item.BillDate.slice(5, 10) : "N/A"}</td>
        <td>${item.BillNo || "N/A"}</td>
        <td>${item.CustCode || "N/A"}</td>
        <td>${item.Amount ? item.Amount.toFixed(2) : "0.00"}</td>
      </tr>`
    );

    // Calculate Total Amount
    const totalAmount = (Array.isArray(saledata) ? saledata : []).reduce(
      (sum, item) => sum + (item.Amount || 0),
      0
    );

    // HTML for the print window
    const printContent = `
    <html>
      <head>
        <style>
          @media print {
            body {
              font-family: Arial, sans-serif;
              font-size: 6px; /* Smaller font for 36mm receipt */
              text-align: center;
              margin: 0;
              padding: 0;
            }
            .container {
              width: 36mm;
              padding: 2px;
            }
            h2 {
              font-size: 8px;
              margin: 1px 0;
            }
            p {
              font-size: 6px;
              margin: 1px 0;
            }
            hr {
              border: 0.5px dashed black;
            }
            table {
              width: 100%;
              border-collapse: collapse;
            }
            th, td {
              font-size: 6px;
              padding: 1px;
              text-align: left;
              border-bottom: 0.5px solid black;
            }
            th {
              background-color: #f1f1f1;
            }
            .total {
              font-weight: bold;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h2>${dairyName}</h2>
          <p>${city}</p>
          <p>${reportName}</p>
          <p>${reportFromDate} - ${reportToDate}</p>
          <hr/>

          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Bill#</th>
                <th>Code</th>
                <th>Amt</th>
              </tr>
            </thead>
            <tbody>
              ${tableRows.join("")}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="3" class="total">Total</td>
                <td class="total">${totalAmount.toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>
          <hr/>
          <p>Thank You!</p>
        </div>
      </body>
    </html>
  `;

    // Write content and print
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
  };

  //.... Disturbed Register list
  const generateDisturbedSalesReport = () => {
    const doc = new jsPDF();

    // Ensure variables exist before using them
    const dairyName =
      typeof dairyname !== "undefined" ? dairyname : "Dairy Name";
    const city = typeof CityName !== "undefined" ? CityName : "City Name";
    const reportName = "Disturbed Register list";

    // Ensure fromDate and toDate are properly declared
    const reportFromDate = typeof fromDate !== "undefined" ? fromDate : "N/A";
    const reportToDate = typeof toDate !== "undefined" ? toDate : "N/A";

    doc.setFontSize(16);
    doc.text(dairyName, 15, 15);
    doc.setFontSize(12);
    doc.text(`City: ${city}`, 15, 25);
    doc.text(`Report: ${reportName}`, 15, 35);
    doc.text(`From: ${reportFromDate}  To: ${reportToDate}`, 15, 45);

    // ************** Sales Data Table **************
    const tableColumn = [
      "Bill Date",
      "Bill No",
      "Customer Code",
      "Item Name",
      "Qty",
      "Rate",
      "Amount",
    ];

    // Ensure 'saledata' is an array
    const sales = Array.isArray(saledata) ? saledata : [];

    // Group data by date
    const groupedData = {};
    sales.forEach((item) => {
      const billDate = item.BillDate ? item.BillDate.slice(0, 10) : "N/A";
      if (!groupedData[billDate]) {
        groupedData[billDate] = [];
      }
      groupedData[billDate].push(item);
    });

    const tableRows = [];
    let grandTotal = 0;

    // Process grouped data
    Object.keys(groupedData).forEach((date) => {
      let dailyTotal = 0;

      groupedData[date].forEach((item) => {
        const row = [
          date,
          item.BillNo || "N/A",
          item.CustCode || "N/A",
          item.ItemName || "N/A",
          item.Qty || 0,
          item.Rate ? item.Rate.toFixed(2) : "0.00",
          item.Amount ? item.Amount.toFixed(2) : "0.00",
        ];
        tableRows.push(row);
        dailyTotal += item.Amount || 0;
      });

      // Add Daily Total Row
      tableRows.push(["", "", "", "Date Total", "", "", dailyTotal.toFixed(2)]);
      grandTotal += dailyTotal;
    });

    // Add Grand Total Row
    tableRows.push(["", "", "", "Grand Total", "", "", grandTotal.toFixed(2)]);

    // Generate Sales Table
    doc.autoTable({
      startY: 55,
      head: [tableColumn],
      body: tableRows,
      theme: "grid",
      styles: { fontSize: 10 },
      headStyles: { fillColor: [0, 0, 0] },
    });

    // Save PDF
    doc.save("Disturbed SalesReport");
  };
  //.....  Distrubuted Register Print
  const printDisturbedSalesReport = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    // Ensure variables exist before using them
    const dairyName =
      typeof dairyname !== "undefined" ? dairyname : "Dairy Name";
    const city = typeof CityName !== "undefined" ? CityName : "City Name";
    const reportName = "Disturbed Register List";

    // Ensure fromDate and toDate are properly declared
    const reportFromDate = typeof fromDate !== "undefined" ? fromDate : "N/A";
    const reportToDate = typeof toDate !== "undefined" ? toDate : "N/A";

    // Ensure 'saledata' is an array
    const sales = Array.isArray(saledata) ? saledata : [];

    // Group data by date
    const groupedData = {};
    sales.forEach((item) => {
      const billDate = item.BillDate ? item.BillDate.slice(5, 10) : "N/A";
      if (!groupedData[billDate]) {
        groupedData[billDate] = [];
      }
      groupedData[billDate].push(item);
    });

    let tableRows = "";
    let grandTotal = 0;

    // Process grouped data
    Object.keys(groupedData).forEach((date) => {
      let dailyTotal = 0;

      groupedData[date].forEach((item) => {
        tableRows += `
      <tr>
        <td>${date}</td>
        <td>${item.BillNo || "N/A"}</td>
        <td>${item.CustCode || "N/A"}</td>
        <td>${item.ItemName || "N/A"}</td>
        <td>${item.Qty || 0}</td>
        <td>${item.Rate ? item.Rate.toFixed(2) : "0.00"}</td>
        <td>${item.Amount ? item.Amount.toFixed(2) : "0.00"}</td>
      </tr>`;

        dailyTotal += item.Amount || 0;
      });

      // Add Daily Total Row
      tableRows += `
    <tr>
      <td colspan="6"><strong>Date Total</strong></td>
      <td><strong>${dailyTotal.toFixed(2)}</strong></td>
    </tr>`;
      grandTotal += dailyTotal;
    });

    // Add Grand Total Row
    tableRows += `
  <tr>
    <td colspan="6"><strong>Grand Total</strong></td>
    <td><strong>${grandTotal.toFixed(2)}</strong></td>
  </tr>`;

    // HTML for print window
    const printContent = `
    <html>
      <head>
        <style>
          @media print {
            body {
              font-family: Arial, sans-serif;
              font-size: 8px; /* Optimized for 58mm */
              text-align: center;
              margin: 0;
              padding: 0;
            }
            .container {
              width: 58mm;
              padding: 5px;
            }
            h2 {
              font-size: 10px;
              margin: 3px 0;
            }
            p {
              font-size: 8px;
              margin: 2px 0;
            }
            hr {
              border: 0.5px dashed black;
            }
            table {
              width: 100%;
              border-collapse: collapse;
            }
            th, td {
              font-size: 7px;
              padding: 2px;
              text-align: left;
              border-bottom: 0.5px solid black;
            }
            th {
              background-color: #f1f1f1;
            }
            .total {
              font-weight: bold;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h2>${dairyName}</h2>
          <p>${city}</p>
          <p>${reportName}</p>
          <p>${reportFromDate} - ${reportToDate}</p>
          <hr/>

          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Bill#</th>
                <th>Code</th>
                <th>Item</th>
                <th>Qty</th>
                <th>Rate</th>
                <th>Amt</th>
              </tr>
            </thead>
            <tbody>
              ${tableRows}
            </tbody>
          </table>
          <hr/>
          <p>Thank You!</p>
        </div>
      </body>
    </html>
  `;

    // Write content and print
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
  };

  //...  Customer Saleing Balance
  const generateCustomersalingReport = () => {
    const doc = new jsPDF();

    // Ensure variables exist before using them
    const dairyName =
      typeof dairyname !== "undefined" ? dairyname : "Dairy Name";
    const city = typeof CityName !== "undefined" ? CityName : "City Name";
    const reportTitle = "Customer Sales Report";

    // Report Header
    doc.setFontSize(16);
    doc.text(dairyName, 15, 15); // Dairy Name
    doc.setFontSize(12);
    doc.text(`City: ${city}`, 15, 25); // City Name
    doc.text(reportTitle, 15, 35); // Report Title
    doc.text(`From: ${fromdate}  To: ${todate}`, 15, 45); // Date Range

    // ************** Table Headers **************
    const tableColumn = ["CN", "Customer Name", "Amount"];

    // Ensure 'saledata' is an array
    const sales = Array.isArray(saledata) ? saledata : [];
    const tableRows = [];

    let grandTotal = 0;

    // Process sales data
    sales.forEach((item) => {
      const row = [
        item.cn || "N/A",
        item.cust_name || "N/A",
        item.Amount ? item.Amount.toFixed(2) : "0.00",
      ];
      tableRows.push(row);
      grandTotal += item.Amount || 0;
    });

    // Add Grand Total Row
    tableRows.push(["", "Grand Total", grandTotal.toFixed(2)]);

    // Generate Sales Table
    doc.autoTable({
      startY: 55, // Adjusted to avoid overlapping with headers
      head: [tableColumn],
      body: tableRows,
      theme: "grid",
      styles: { fontSize: 10 },
      headStyles: { fillColor: [0, 0, 0] },
    });

    // Save PDF
    doc.save("Customer_Sales-Balance_Report.pdf");
  };

  const printCustomerSalesReport = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    // Ensure variables exist before using them
    const dairyName =
      typeof dairyname !== "undefined" ? dairyname : "Dairy Name";
    const city = typeof CityName !== "undefined" ? CityName : "City Name";
    const reportTitle = "Customer Sales Report";
    const reportFromDate = typeof fromdate !== "undefined" ? fromdate : "N/A";
    const reportToDate = typeof todate !== "undefined" ? todate : "N/A";

    // Ensure 'saledata' is an array
    const sales = Array.isArray(saledata) ? saledata : [];

    let tableRows = "";
    let grandTotal = 0;

    // Process sales data
    sales.forEach((item) => {
      tableRows += `
    <tr>
      <td>${item.cn || "N/A"}</td>
      <td>${item.cust_name || "N/A"}</td>
      <td>${item.Amount ? item.Amount.toFixed(2) : "0.00"}</td>
    </tr>`;
      grandTotal += item.Amount || 0;
    });

    // Add Grand Total Row
    tableRows += `
  <tr>
    <td colspan="2"><strong>Grand Total</strong></td>
    <td><strong>${grandTotal.toFixed(2)}</strong></td>
  </tr>`;

    // HTML for print window
    const printContent = `
    <html>
      <head>
        <style>
          @media print {
            body {
              font-family: Arial, sans-serif;
              font-size: 8px; /* Optimized for 58mm */
              text-align: center;
              margin: 0;
              padding: 0;
            }
            .container {
              width: 58mm;
              padding: 5px;
            }
            h2 {
              font-size: 10px;
              margin: 3px 0;
            }
            p {
              font-size: 8px;
              margin: 2px 0;
            }
            hr {
              border: 0.5px dashed black;
            }
            table {
              width: 100%;
              border-collapse: collapse;
            }
            th, td {
              font-size: 7px;
              padding: 2px;
              text-align: left;
              border-bottom: 0.5px solid black;
            }
            th {
              background-color: #f1f1f1;
            }
            .total {
              font-weight: bold;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h2>${dairyName}</h2>
          <p>${city}</p>
          <p>${reportTitle}</p>
          <p>${reportFromDate} - ${reportToDate}</p>
          <hr/>

          <table>
            <thead>
              <tr>
                <th>CN</th>
                <th>Customer</th>
                <th>Amt</th>
              </tr>
            </thead>
            <tbody>
              ${tableRows}
            </tbody>
          </table>
          <hr/>
          <p>Thank You!</p>
        </div>
      </body>
    </html>
  `;

    // Write content and print
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
  };

  //.. Customer Saleing Qtm Report
  const generatefeedqtmReport = () => {
    const doc = new jsPDF();

    // Ensure variables exist before using them
    const dairyName =
      typeof dairyname !== "undefined" ? dairyname : "Dairy Name";
    const city = typeof CityName !== "undefined" ? CityName : "City Name";
    const reportTitle = "Customer Sales Report";

    // Report Header
    doc.setFontSize(16);
    doc.text(dairyName, 15, 15); // Dairy Name
    doc.setFontSize(12);
    doc.text(`City: ${city}`, 15, 25); // City Name
    doc.text(reportTitle, 15, 35); // Report Title
    doc.text(`From: ${fromdate}  To: ${todate}`, 15, 45); // Date Range

    // ************** Table Headers **************
    const tableColumn = ["CN", "Customer Name", "Amount"];

    // Ensure 'saledata' is an array
    const sales = Array.isArray(saledata) ? saledata : [];
    const tableRows = [];

    let grandTotal = 0;

    // Process sales data
    sales.forEach((item) => {
      const row = [
        item.cn || "N/A",
        item.cust_name || "N/A",
        item.Amount ? item.Amount.toFixed(2) : "0.00",
      ];
      tableRows.push(row);
      grandTotal += item.Amount || 0;
    });

    // Add Grand Total Row
    tableRows.push(["", "Grand Total", grandTotal.toFixed(2)]);

    // Generate Sales Table
    doc.autoTable({
      startY: 55, // Adjusted to avoid overlapping with headers
      head: [tableColumn],
      body: tableRows,
      theme: "grid",
      styles: { fontSize: 10 },
      headStyles: { fillColor: [0, 0, 0] },
    });

    // Save PDF
    doc.save("Cow_Feed_Qtm_Report.pdf");
  };

  ///...... Customer Saleing Print

  const printFeedQtmReport = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    // Ensure variables exist before using them
    const dairyName =
      typeof dairyname !== "undefined" ? dairyname : "Dairy Name";
    const city = typeof CityName !== "undefined" ? CityName : "City Name";
    const reportTitle = "Cow Feed Qtm Report";
    const reportFromDate = typeof fromdate !== "undefined" ? fromdate : "N/A";
    const reportToDate = typeof todate !== "undefined" ? todate : "N/A";

    // Ensure 'saledata' is an array
    const sales = Array.isArray(saledata) ? saledata : [];

    let tableRows = "";
    let grandTotal = 0;

    // Process sales data
    sales.forEach((item) => {
      tableRows += `
    <tr>
      <td>${item.CustCode || "N/A"}</td>
      <td>${item.cust_name || "N/A"}</td>
      <td>${item.Amount ? item.Amount.toFixed(2) : "0.00"}</td>
    </tr>`;
      grandTotal += item.Amount || 0;
    });

    // Add Grand Total Row
    tableRows += `
  <tr>
    <td colspan="2"><strong>Grand Total</strong></td>
    <td><strong>${grandTotal.toFixed(2)}</strong></td>
  </tr>`;

    // HTML for print window
    const printContent = `
    <html>
      <head>
        <style>
          @media print {
            body {
              font-family: Arial, sans-serif;
              font-size: 9px; /* Optimized for readability */
              margin: 0;
              padding: 0;
            }
            .container {
              width: 100%;
              max-width: 58mm; /* Ensures it fully fits 58mm width */
              margin: 0 auto;
            }
            h2 {
              font-size: 10px;
              margin: 2px 0;
              text-align: center;
            }
            p {
              font-size: 9px;
              margin: 2px 0;
              text-align: center;
            }
            hr {
              border: 0.5px dashed black;
              margin: 2px 0;
            }
            table {
              width: 100%;
              border-collapse: collapse;
            }
            th, td {
              font-size: 9px;
              padding: 2px;
              text-align: left;
              border-bottom: 0.5px solid black;
            }
            th {
              background-color: #f1f1f1;
            }
            .total {
              font-weight: bold;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h2>${dairyName}</h2>
          <p>${city}</p>
          <p>${reportTitle}</p>
          <p>${reportFromDate} - ${reportToDate}</p>
          <hr/>

          <table>
            <thead>
              <tr>
                <th>CN</th>
                <th>Customer</th>
                <th>Amt</th>
              </tr>
            </thead>
            <tbody>
              ${tableRows}
            </tbody>
          </table>
          <hr/>
          <p>Thank You!</p>
        </div>
      </body>
    </html>
  `;

    // Write content and print
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
  };
  //....   itemwise data
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4040/smartdairy/api/item/all"
        );
        if (response.data) {
          SetItem(response.data.itemsData);
          groupItemsByCode(response.data.itemsData);
        }
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    };

    fetchItems();
  }, []);

  console.log("itemwise data", item);
  // Group items by ItemGroupCode
  const groupItemsByCode = (data) => {
    const groupedData = data.reduce((acc, item) => {
      const groupCode = item.ItemCode?.toString().trim();
      if (!groupCode) return acc; // Skip if no group code

      if (!acc[groupCode]) {
        acc[groupCode] = [];
      }
      acc[groupCode].push(item);
      return acc;
    }, {});

    setGroupedItems(groupedData);
  };

  //.... Handle Print FUnction
  const handlePrintReport = () => {
    switch (selectedReport) {
      case "Sale Register":
        printSalesReport();
        break;
      case "Disturbed Register list":
        printDisturbedSalesReport();
        break;
      case "Customer Saleing Balance":
        printCustomerSalesReport();
        break;
      case "Customer Saleing Qtm Report":
        printFeedQtmReport();
        break;
      default:
        alert("Please select a valid report.");
    }
  };

  ///........... handle Pdf Functionn

  const handleDownloadReport = () => {
    switch (selectedReport) {
      case "Sale Register":
        generateSalesReport();
        break;
      case "Disturbed Register list":
        generateDisturbedSalesReport();
        break;
      case "Customer Saleing Balance":
        generateCustomersalingReport();
        break;
      case "Customer Saleing Qtm Report":
        generatefeedqtmReport();
        break;
      default:
        alert("Please select a valid report.");
    }
  };

  const renderTable = () => {
    if (!selectedReport) return <p>Please select a report to display.</p>;

    // Calculate total amount
    const totalAmount = saledata.reduce(
      (sum, item) => sum + (item.Amount || 0),
      0
    );

    switch (selectedReport) {
      case "Sale Register":
        return (
          <table border="1">
            <thead>
              <tr>
                <th>Bill Date</th>
                <th>Bill No</th>
                <th>Customer Code</th>
                <th>Customer Name</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {saledata.map((item, index) => (
                <tr key={index}>
                  <td>{item.BillDate?.slice(0, 10) || "N/A"}</td>
                  <td>{item.BillNo || "N/A"}</td>
                  <td>{item.CustCode || "N/A"}</td>
                  <td>{item.CustName || "N/A"}</td>
                  <td>{item.Amount ? item.Amount.toFixed(2) : "0.00"}</td>
                </tr>
              ))}
              <tr>
                <td
                  colSpan="4"
                  style={{ textAlign: "right", fontWeight: "bold" }}
                >
                  Total:
                </td>
                <td style={{ fontWeight: "bold" }}>{totalAmount.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        );

      case "Disturbed Register list":
        return (
          <table border="1">
            <thead>
              <tr>
                <th>Bill Date</th>
                <th>Bill No</th>
                <th>Customer Code</th>
                <th>Item Name</th>
                <th>Qty</th>
                <th>Rate</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {saledata.map((item, index) => (
                <tr key={index}>
                  <td>{item.BillDate?.slice(0, 10) || "N/A"}</td>
                  <td>{item.BillNo || "N/A"}</td>
                  <td>{item.CustCode || "N/A"}</td>
                  <td>{item.ItemName || "N/A"}</td>
                  <td>{item.Qty || 0}</td>
                  <td>{item.Rate ? item.Rate.toFixed(2) : "0.00"}</td>
                  <td>{item.Amount ? item.Amount.toFixed(2) : "0.00"}</td>
                </tr>
              ))}
              <tr>
                <td
                  colSpan="6"
                  style={{ textAlign: "right", fontWeight: "bold" }}
                >
                  Total:
                </td>
                <td style={{ fontWeight: "bold" }}>{totalAmount.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        );

      case "Customer Saleing Balance":
      case "Customer Saleing Qtm Report":
        return (
          <table border="1">
            <thead>
              <tr>
                <th>CN</th>
                <th>Customer Name</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {saledata.map((item, index) => (
                <tr key={index}>
                  <td>{item.CustCode || "N/A"}</td>
                  <td>{item.cust_name || "N/A"}</td>
                  <td>{item.Amount ? item.Amount.toFixed(2) : "0.00"}</td>
                </tr>
              ))}
              <tr>
                <td
                  colSpan="2"
                  style={{ textAlign: "right", fontWeight: "bold" }}
                >
                  Total:
                </td>
                <td style={{ fontWeight: "bold" }}>{totalAmount.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        );

      default:
        return null;
    }
  };
  //.......  POpup
  const handleOpenPopup = () => setShowPopup(true);
  // const handleClosePopup = () => setShowPopup(false);
  //..... itemgroup  and

  const handleItemChange = (e) => {
    // const selectedItem = item.find((item) => item.ItemDesc === e.target.value);
    // setItemName(selectedItem ? selectedItem.ItemDesc : "");
    // setItemNo(selectedItem ? selectedItem.ItemCode : "");
    setItemNo(e.target.value);
  };
  const handleClosePopup = () => {
    setShowPopup(false);
    setItemNo("");
    setItemName("");
    setFromDate("");
    setToDate("");
  };

  useEffect(() => {
    if (saledata.length === 0) return; // Prevent unnecessary re-renders

    const grouped = saledata.reduce((acc, item) => {
      if (!acc[item.ItemCode]) {
        acc[item.ItemCode] = {
          ItemCode: item.ItemCode,
          ItemDesc: item.ItemName,
          TotalQty: 0,
          Rate: item.Rate,
          TotalAmount: 0,
        };
      }
      acc[item.ItemCode].TotalQty += item.Qty;
      acc[item.ItemCode].TotalAmount += item.Amount;
      return acc;
    }, {});
  }, [saledata]);
  console.log(itemNo);
  // ✅ Apply filter for selected ItemCode
  const filteredDataa =
    setItemNo === ""
      ? saledata
      : saledata.filter(
          (item) => item.ItemCode.toString() === itemNo.toString()
        );

  const generateItemWisePDF = () => {
    const doc = new jsPDF();

    // Dairy details
    const dairyName = dairyname; // Replace with actual dairy name
    const cityName = CityName; // Replace with actual city name
    const reportTitle = "Item-wise Sales Report";
    const fromDate = fromdate; // Replace with dynamic from date
    const toDate = todate; // Replace with dynamic to date

    // Add dairy name and city at the top
    doc.setFontSize(14);
    doc.text(dairyName, 14, 10);
    doc.setFontSize(12);
    doc.text(cityName, 14, 16);

    // Add report title
    doc.setFontSize(16);
    doc.text(reportTitle, 80, 22); // Centered title

    // Add date range
    doc.setFontSize(12);
    doc.text(`From: ${fromDate}  To: ${toDate}`, 14, 30);

    // Table headers
    const tableColumn = [
      "Item Code",
      "Item Name",
      "Total Quantity",
      "Rate",
      "Total Amount",
    ];

    // Table data
    const tableRows = filteredDataa.map((item) => [
      item.ItemCode,
      item.ItemName,
      item.Qty,
      item.Rate,
      item.Amount,
    ]);

    // Calculate total amount
    const totalAmount = filteredDataa.reduce(
      (sum, item) => sum + (item.Amount || 0),
      0
    );

    // Add total row
    const totalRow = ["", "Total", "", "", totalAmount.toFixed(2)];
    tableRows.push(totalRow); // Append to the table

    // Add table
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 40, // Adjusted position
      theme: "grid", // Optional styling
      styles: { fontSize: 10 },
      foot: [["", "Total", "", "", totalAmount.toFixed(2)]], // Optional footer
    });

    // Save the PDF
    doc.save("ItemWiseReport.pdf");
  };


  return (
    <>
      <div className="sales-report-conatiner w100 h1 d-flex-col bg ">
        <span className="heading">Sales Reports</span>
        <div className="first-half-container-sales-report w100 h40 d-flex-col">
          <div className="sale-regsiter-reports w100 h50 d-flex a-center  ">
            <div className="sale-register-distrubuted-reports w40 h40 a-center d-flex">
              <span className="info-text w30">Sale Report:</span>
              <select
                className="data"
                name="sale-report"
                id="001"
                onChange={(e) => setSelectedReport(e.target.value)}
              >
                <option value="">Select Report</option>
                <option value="Sale Register">Sale Register</option>
                <option value="Disturbed Register list">
                  Disturbed Register
                </option>
                <option value="Customer Saleing Balance">
                  Cust Saleing Balance
                </option>
                <option value="Customer Saleing Qtm Report">Qtm Report</option>
              </select>
            </div>
            <div className="print-button-div w30 h20 d-flex sa ">
              {" "}
              {selectedReport && (
                <button className="btn " onClick={handleDownloadReport}>
                  PDF
                </button>
              )}
              <button className="btn" onClick={handlePrintReport}>
                print
              </button>
            </div>
          </div>
          <div className="distributed-sale-register w100 h20 d-flex">
            {/* Button to Open Popup */}
            <span className="btn" onClick={handleOpenPopup}>
              Distributed Sale Register
            </span>

            {showPopup && (
              <div className="popup-overlay">
                <div className="popup-content w60 h1 d-flex-col">
                  <span className="sub-heading">Distributed Purchase</span>

                  {/* Item Selection */}
                  <div className="item-name-item-no-container w100 h20 d-flex my10">
                    <div className="item-no-div w30 h60 d-flex a-center">
                      <label className="info-text w50">Item No:</label>
                      <input
                        className="w60 data"
                        type="text"
                        value={itemNo}
                        readOnly
                      />
                    </div>
                    <div className="item-name-div w70 h50 d-flex a-center">
                      <label className="info-text w60">Item Name:</label>
                      <select className="w90 data" onChange={handleItemChange}>
                        <option value="">Select Item</option>
                        {item.map((item, i) => (
                          <option key={i} value={item.ItemCode}>
                            {item.ItemName}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Date Selection */}
                  <div className="from-to-div-sales-report w100 h30 d-flex">
                    <div className="from-date-sales w50 h1 d-flex a-center">
                      <label className="info-text w30">From: </label>
                      <input
                        className="data w70"
                        type="date"
                        value={fromdate}
                        onChange={(e) => setFromDate(e.target.value)}
                      />
                    </div>
                    <div className="to-dates-sales w50 h1 d-flex a-center">
                      <label className="info-text w30">To:</label>
                      <input
                        className="data w70"
                        type="date"
                        value={todate}
                        onChange={(e) => setToDate(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="popup-buttons w50 d-flex sa">
                    <button
                      onClick={generateItemWisePDF}
                      className="btn report-btn"
                    >
                      Report
                    </button>
                    <button className="btn exit-btn" onClick={handleClosePopup}>
                      Exit
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="report-table w100 h60 d-flex">{renderTable()}</div>
      </div>
    </>
  );
};

export default SalesReport;
