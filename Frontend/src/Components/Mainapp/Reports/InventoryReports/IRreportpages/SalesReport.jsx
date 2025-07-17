import React, { useEffect, useRef, useState } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import axios, { all } from "axios";
import { useSelector } from "react-redux";
import "../../../../../Styles/InventoryReports/salesreport.css";
import axiosInstance from "../../../../../App/axiosInstance";

const SalesReport = () => {
  const [saledata, SetSaleData] = useState([]); //.. sale Data
  const today = new Date().toISOString().split("T")[0];
  const [fromdate, setFromDate] = useState(today);
  const [todate, setToDate] = useState(today);
  const [item, SetItem] = useState([]); //... Item Data
  const [itemName, setItemName] = useState([]); //... Item Data
  const [selectedReport, setSelectedReport] = useState("");
  const [groupeditems, setGroupedItems] = useState(false);
  const [itemNo, setItemNo] = useState("");
  const [isItemwiseChecked, setIsItemwiseChecked] = useState(false);
  const toDates = useRef(null);
  const dairyname = useSelector(
    (state) =>
      state.dairy.dairyData.SocietyName || state.dairy.dairyData.center_name
  );
  const CityName = useSelector((state) => state.dairy.dairyData.city);

  useEffect(() => {
    const salefetchData = async () => {
      // Only fetch data if both fromdate and todate are available
      if (fromdate && todate) {
        try {
          const response = await axiosInstance.get("/stock/sale/all", {
            params: { fromdate, todate },
          });
          SetSaleData(response.data.salesData); // Set the fetched sales data
        } catch (error) {
          console.log(
            "Error Handling:",
            error.response ? error.response.data : error.message
          );
        }
      }
    };

    // Run API call if both dates are selected, otherwise run other functionality
    if (fromdate && todate) {
      salefetchData();
    } else {
      // Handle other functionality when dates are not selected
      console.log("No date selected yet. Please select a date range.");
    }
  }, [fromdate, todate]); // Depend on both dates to trigger when either changes

  // handle enter press move cursor to next refrence Input -------------------------------->
  const handleKeyDown = (e, nextRef) => {
    if (e.key === "Enter" && nextRef.current) {
      e.preventDefault();
      nextRef.current.focus();
    }
  };

  const generateSalesReport = () => {
    const doc = new jsPDF();

    // Ensure variables exist before using them
    const dairyName =
      typeof dairyname !== "undefined" ? dairyname : "Dairy Name";
    const city = typeof CityName !== "undefined" ? CityName : "City Name";
    const reportName = "Sales Report";

    // Ensure fromDate and toDate are properly declared
    const reportFromDate = typeof fromdate !== "undefined" ? fromdate : "N/A";
    const reportToDate = typeof todate !== "undefined" ? todate : "N/A";

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
      item.receiptno || "N/A",
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
    const reportFromDate = typeof fromdate !== "undefined" ? fromdate : "N/A";
    const reportToDate = typeof todate !== "undefined" ? todate : "N/A";

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
    const tableColumn = ["Code", "Customer Name", "Qty", "Amount"];

    // Ensure 'saledata' is an array
    const sales = Array.isArray(saledata) ? saledata : [];
    const tableRows = [];

    let grandTotal = 0;

    // Process sales data
    sales.forEach((item) => {
      const row = [
        item.CustCode || "N/A",
        item.cust_name || "N/A",
        item.Qty || "N/A",
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
         <td>${item.Qty || "N/A"}</td>
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
                <th>Code</th>
                <th>Customer</th>
                <th>Qty</th>
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
        const response = await axiosInstance.get("/item/all");
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
    // Define table headers based on selected report
    let headers = [];
    switch (selectedReport) {
      case "Sale Register":
        headers = [
          "Bill Date",
          "Bill No",
          "Customer Code",
          "Customer Name",
          "Amount",
        ];
        break;
      case "Disturbed Register list":
        headers = [
          "Bill Date",
          "Bill No",
          "Customer Code",
          "Item Name",
          "Qty",
          "Rate",
          "Amount",
        ];
        break;
      case "Customer Saleing Balance":
        headers = ["CN", "Customer Name", "Amount"];
        break;
      case "Customer Saleing Qtm Report":
        headers = ["CN", "Customer Name", "Qty", "Amount"];
        break;
      default:
        headers = ["Report Table"];
    }

    // Filter data
    const filteredData = saledata.filter((item) => {
      const billDate = new Date(item.BillDate);
      const fromDate = new Date(fromdate);
      const toDate = new Date(todate);
      return billDate >= fromDate && billDate <= toDate;
    });

    const totalAmount = filteredData.reduce(
      (sum, item) => sum + (item.Amount || 0),
      0
    );

    return (
      <table border="1" style={{ width: "100%", textAlign: "center" }}>
        <thead>
          <tr>
            {headers.map((header, index) => (
              <th key={index}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {!selectedReport ? (
            <tr>
              <td colSpan={headers.length} style={{ padding: "20px" }}>
                Data Not Available
              </td>
            </tr>
          ) : filteredData.length === 0 ? (
            <tr>
              <td colSpan={headers.length} style={{ padding: "20px" }}>
                No data available for the selected date range.
              </td>
            </tr>
          ) : (
            filteredData.map((item, index) => {
              const bgColor = index % 2 === 0 ? "#faefe3" : "#fff";

              switch (selectedReport) {
                case "Sale Register":
                  return (
                    <tr key={index} style={{ backgroundColor: bgColor }}>
                      <td>{item.BillDate?.slice(0, 10) || "N/A"}</td>
                      <td>{item.BillNo || "N/A"}</td>
                      <td>{item.CustCode || "N/A"}</td>
                      <td>{item.cust_name || "N/A"}</td>
                      <td>{item.Amount ? item.Amount.toFixed(2) : "0.00"}</td>
                    </tr>
                  );

                case "Disturbed Register list":
                  return (
                    <tr key={index} style={{ backgroundColor: bgColor }}>
                      <td>{item.BillDate?.slice(0, 10) || "N/A"}</td>
                      <td>{item.BillNo || "N/A"}</td>
                      <td>{item.CustCode || "N/A"}</td>
                      <td>{item.ItemName || "N/A"}</td>
                      <td>{item.Qty || 0}</td>
                      <td>{item.Rate ? item.Rate.toFixed(2) : "0.00"}</td>
                      <td>{item.Amount ? item.Amount.toFixed(2) : "0.00"}</td>
                    </tr>
                  );

                case "Customer Saleing Balance":
                  return (
                    <tr key={index} style={{ backgroundColor: bgColor }}>
                      <td>{item.CustCode || "N/A"}</td>
                      <td>{item.cust_name || "N/A"}</td>
                      <td>{item.Amount ? item.Amount.toFixed(2) : "0.00"}</td>
                    </tr>
                  );

                case "Customer Saleing Qtm Report":
                  return (
                    <tr key={index} style={{ backgroundColor: bgColor }}>
                      <td>{item.CustCode || "N/A"}</td>
                      <td>{item.cust_name || "N/A"}</td>
                      <td>{item.Qty || 0}</td>
                      <td>{item.Amount ? item.Amount.toFixed(2) : "0.00"}</td>
                    </tr>
                  );

                default:
                  return null;
              }
            })
          )}
          {selectedReport && filteredData.length > 0 && (
            <tr>
              <td
                colSpan={headers.length - 1}
                style={{ textAlign: "right", fontWeight: "bold" }}
              >
                Total:
              </td>
              <td style={{ fontWeight: "bold" }}>{totalAmount.toFixed(2)}</td>
            </tr>
          )}
        </tbody>
      </table>
    );
    
  };
  
  

  const handleItemChange = (e) => {
    setItemNo(e.target.value);
    setItemName(e.target.value);
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
  // ✅ Apply filter for selected ItemCode
  const filteredDataa =
    setItemNo === ""
      ? saledata
      : saledata.filter(
          (item) => item.ItemCode.toString() === itemNo.toString()
        );

  //... Itemwise PDF  And PRint Function

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

  const printItemWiseReport = () => {
    // Dairy details
    const dairyName = dairyname; // Replace with actual dairy name
    const cityName = CityName; // Replace with actual city name
    const reportTitle = "Item-wise Sales Report";
    const fromDate = fromdate; // Replace with dynamic from date
    const toDate = todate; // Replace with dynamic to date

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
      item.Qty, // Quantity
      item.Rate,
      item.Amount,
    ]);

    // Calculate totals for quantity and amount
    const totalQty = filteredDataa.reduce(
      (sum, item) => sum + (item.Qty || 0),
      0
    );
    const totalAmount = filteredDataa.reduce(
      (sum, item) => sum + (item.Amount || 0),
      0
    );

    // Add total row for quantity and amount
    const totalRow = ["", "Total", totalQty, "", totalAmount.toFixed(2)];
    tableRows.push(totalRow); // Append to the table

    // Create a printable HTML content
    const printContent = `
    <div style="text-align: center;">
      <h2>${dairyName}</h2>
      <h3>${cityName}</h3>
      <h3>${reportTitle}</h3>
      <p>From: ${fromDate} To: ${toDate}</p>
    </div>
    <table border="1" cellpadding="5" cellspacing="0" style="width: 100%; border-collapse: collapse; font-size: 10px;">
      <thead>
        <tr>
          ${tableColumn
            .map(
              (col) =>
                `<th style="text-align: center; font-weight: bold; padding: 10px;">${col}</th>`
            )
            .join("")}
        </tr>
      </thead>
      <tbody>
        ${tableRows
          .map(
            (row) => `
          <tr>
            ${row
              .map(
                (cell) =>
                  `<td style="text-align: center; padding: 8px;">${
                    cell || "N/A"
                  }</td>`
              )
              .join("")}
          </tr>
        `
          )
          .join("")}
      </tbody>
    </table>
  `;

    // Create an iframe for printing
    const iframe = document.createElement("iframe");
    iframe.style.position = "absolute";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "none";
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow.document;
    doc.open();
    doc.write(`
    <html>
      <head>
        <title>Item-wise Sales Report</title>
        <style>
          body { font-family: Arial, sans-serif; }
          table { width: 100%; border-collapse: collapse; font-size: 10px; }
          th, td { padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; font-size: 12px; }
          td { text-align: center; font-size: 10px; }
        </style>
      </head>
      <body>
        ${printContent}
      </body>
    </html>
  `);
    doc.close();

    // Print the content in the iframe
    iframe.contentWindow.focus();
    iframe.contentWindow.print();

    // Remove the iframe after printing
    document.body.removeChild(iframe);
  };

  //......
  // Function to handle checkbox change
  const handleCheckboxChange = (e) => {
    setIsItemwiseChecked(e.target.checked);
  };
  //...
  
  
   
  return (
    <>
      <div className="sales-report-conatiner w100 h1 d-flex-col bg ">
        <span className="heading">Sales Reports</span>
        <div className="first-half-container-sales-report w100 h40 d-flex-col">
          <div className="date-container-sales h50 w100 d-flex a-center">
            <div className="from-and-to-date-both w50 h1 d-flex a-center">
              <div className="from-sales-date-div w50 h1 d-flex a-center p10">
                <span className="info-text w30">From:</span>
                <input
                  className="data w80"
                  type="date"
                  value={fromdate}
                 
                  onChange={(e) => setFromDate(e.target.value)}
                />
              </div>
              <div className="from-sales-date-div w50 h1 d-flex a-center p10">
                <span className="info-text w30">To:</span>
                <input
                  className="data w80"
                  type="date"
         
                  value={todate}
                  onChange={(e) => setToDate(e.target.value)}
                />
              </div>
            </div>

            <div className="sale-regsiter-reports w50 h50 d-flex a-center  ">
              <div className="sale-register-distrubuted-reports w60 h50 a-center d-flex">
                <span className="info-text w30">Report:</span>
                <select
                  className="data"
                  name="sale-report"
                  id="001"
                  onChange={(e) => setSelectedReport(e.target.value)}
                >
                  <option value="">Select Report</option>
                  <option value="Sale Register">Sale Register</option>
                  <option value="Disturbed Register list">
                    Detail Sales Register
                  </option>
                  <option value="Customer Saleing Balance">
                    Cust Saleing Balance
                  </option>
                  <option value="Customer Saleing Qtm Report">
                    Qtm Report
                  </option>
                </select>
              </div>
              <div className="print-button-div w30 h20 d-flex a-center sa ">
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
          </div>

          {/* Checkbox to toggle itemwise data */}
          <div className="itemwise-data-show-checkbox-div w100 h30 d-flex a-center ">
            <div className="checkbox-container-for-sale w30 d-flex">
              <input
                className="w20"
                type="checkbox"
                checked={isItemwiseChecked}
                onChange={handleCheckboxChange}
              />
              <label className="info-text">Itemwise Data</label>
            </div>
            {isItemwiseChecked && (
              <div className="item-no-itemname-div w100 h20 d-flex a-center ">
                <div className="item-no-salesdiv w30 h1 d-flex a-center">
                  <span className="info-text w30"> No</span>
                  <input
                    className="w20 data"
                    type="number"
                    name="itemno"
                    value={itemNo || " "}
                    onChange={handleItemChange}
                  />
                </div>
                <div className="item-name-sale-div w40 h1 d-flex a-center">
                  <span className="info-text w40"> Name </span>
                  <select
                    className="w90 data"
                    value={itemName || ""}
                    onChange={handleItemChange}
                  >
                    <option value="">ItemList</option>
                    {item.map((item, i) => (
                      <option key={i} value={item.ItemCode}>
                        {item.ItemName}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="Report-show-and-Pdf-Print-Function w30 d-flex sa a-center">
                  <button onClick={printItemWiseReport} className="w-btn">
                    Print
                  </button>
                  <button onClick={generateItemWisePDF} className=" w-btn">
                    Pdf
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="report-table w100 h70 d-flex">{renderTable()}</div>
      </div>
    </>
  );
};

export default SalesReport;
