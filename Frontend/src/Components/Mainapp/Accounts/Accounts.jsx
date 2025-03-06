import React, { useEffect, useState } from "react";
import "../../../Styles/Accoundcss/Accound.css";
import jsPDF from "jspdf";
import "jspdf-autotable";
import axios, { all } from "axios";
import { useSelector } from "react-redux";

const Accounts = () => {
  const [fromdate, setFromDate] = useState("");
  const [todate, setToDate] = useState("");
  const [sales, SetSales] = useState([]); //... Purches data
  const [purchaseData, SetPurchaseData] = useState([]);
  const [saledata, SetSaleData] = useState([]); //.. sale Data
  const [item, SetItem] = useState([]); //... Item Data
  const { customerlist, loading } = useSelector((state) => state.customer);
  const [dealer, SetDealer] = useState([]); //....    delare Name data
  const [groupedItems, setGroupedItems] = useState({});
  const [stockReport, setStockReport] = useState([]);

  const [showPopup, setShowPopup] = useState(false);
  const [selectedOption, setSelectedOption] = useState("All");
  const [supplierNumber, setSupplierNumber] = useState("");
  const [selectedDropdown, setSelectedDropdown] = useState("");
  const [selectedDealer, setSelectedDealer] = useState("");
  const [dealerCode, setDealerCode] = useState("");
  const [dropdownOptions, setDropdownOptions] = useState([sales]); // Dummy data
  const [filteredData, setFilteredData] = useState([]);

  const [selectedGoods, setSelectedGoods] = useState("");

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [showPpopup, setShowPpopup] = useState(false);
  const [purchaseType, setPurchaseType] = useState("All");
  const [specificDetails, setSpecificDetails] = useState("");
  const [dropdownValue, setDropdownValue] = useState("");
  const [dealerName, setDealerName] = useState("");

  const [inputGroupCode, setInputGroupCode] = useState(""); // Stores user input
  const [filteredItems, setFilteredItems] = useState([]); // Stores items for entered group code
  const [selectedItem, setSelectedItem] = useState(""); // Select ItemName for itemwise pdf

  const [selectedItemCode, setSelectedItemCode] = useState("");
  const [frommDate, setFrommDate] = useState("");
  const [toDate, setTooDate] = useState("");

  const [selectedItemName, setSelectedItemName] = useState("");

  //......   Dairy name And City name   for PDf heading

  const dairyname = useSelector(
    (state) =>
      state.dairy.dairyData.SocietyName || state.dairy.dairyData.center_name
  );
  const CityName = useSelector((state) => state.dairy.dairyData.city);

  //...seprate item group code
  const itemGroupMapping = {
    1: " Feed",
    2: "Medicine",
    3: "Grocery",
    4: "Other",
  };

  const [selectedGroup, setSelectedGroup] = useState(null);

  //......  purches APi Calling
  useEffect(() => {
    const fetchData = async () => {
      // if (!fromdate || !todate) {
      //   alert("Please select both From and To dates.");
      //   return;
      // }
      try {
        const response = await axios.get(
          "http://localhost:4040/smartdairy/api/stock/purchase/all"
          // { fromdate, todate }
        );
        console.log("API Response:", response.data.purchaseData);
        SetSales(response.data.purchaseData);
      } catch (error) {
        console.error(
          "Error Handling:",
          error.response ? error.response.data : error.message
        );
      }
    };

    fetchData();
  }, []); // Run useEffect when fromDate or toDate changes

  //... purches  register  Pdf genrating
  const generatePDF = () => {
    const doc = new jsPDF();

    // Report Header
    const dairyName = dairyname;
    const city = CityName;
    const reportName = "Purchase Report";
    doc.setFontSize(16);
    doc.text(dairyName, 15, 15);
    doc.setFontSize(12);
    doc.text(`City: ${city}`, 15, 25);
    doc.text(`Report: ${reportName}`, 15, 35);
    doc.text(`From: ${fromdate}  To: ${todate}`, 15, 45);

    // Table Data Formatting
    const tableColumn = [
      "Date",
      "Bill No",
      "Dealer Code",
      "Dealer Name",
      "Amount",
    ];

    const tableRows = sales.map((item) => [
      item.purchasedate ? item.purchasedate.slice(0, 10) : "", // Extract YYYY-MM-DD
      item.billno,
      item.dealerCode,
      item.dealerName,
      item.amount,
    ]);

    // Calculate Total Amount
    const totalAmount = sales.reduce((sum, item) => sum + item.amount, 0);
    tableRows.push(["", "", "", "Total Amount", totalAmount]);

    // AutoTable for PDF
    doc.autoTable({
      startY: 55,
      head: [tableColumn],
      body: tableRows,
      theme: "grid",
      styles: { fontSize: 10 },
      headStyles: { fillColor: [0, 0, 0] },
      foot: [["", "", "", "Total", totalAmount]],
    });

    // Save PDF
    doc.save("Purchase_Report.pdf");
  };
  //.... Print For Purches Register
  //  const printReport = () => {
  //    if (!sales || sales.length === 0) {
  //      alert("No data available for printing!");
  //      return;
  //    }

  //    console.log("Printing Sales Data:", sales); // Debugging

  //    let printWindow = window.open("", "", "width=300,height=600");

  //    if (
  //      !printWindow ||
  //      printWindow.closed ||
  //      typeof printWindow.closed === "undefined"
  //    ) {
  //      alert("Pop-up blocked! Please allow pop-ups for this site.");
  //      return;
  //    }

  //    const dairyName = dairyname || "Dairy Name";
  //    const city = CityName || "City";
  //    const reportName = "Purchase Report";
  //    const dateRange = `From: ${fromdate || "N/A"}  To: ${todate || "N/A"}`;

  //    // Define receipt format
  //    let receiptContent = `
  //     <div style="text-align: center; font-size: 10px; font-family: monospace;">
  //       <strong>${dairyName}</strong><br/>
  //       City: ${city}<br/>
  //       Report: ${reportName}<br/>
  //       ${dateRange}<br/>
  //       ------------------------------
  //     </div>
  //     <pre style="font-size: 8px; font-family: monospace;">
  // DATE       BILL   DEALER   AMOUNT
  // ------------------------------`;

  //    // Add Table Data
  //    sales.forEach((item) => {
  //      const date = item.purchasedate ? item.purchasedate.slice(2, 10) : "N/A";
  //      const billNo = (item.billno || "").toString().padEnd(6, " ");
  //      const dealer = (item.dealerName || "").substring(0, 6).padEnd(7, " ");
  //      const amount = (item.amount || 0).toFixed(2).padStart(6, " ");

  //      receiptContent += `\n${date}  ${billNo} ${dealer} ${amount}`;
  //    });

  //    // Total Amount
  //    const totalAmount = sales.reduce((sum, item) => sum + (item.amount || 0), 0);
  //    receiptContent += `
  // ------------------------------
  // Total Amount:      ${totalAmount.toFixed(2)}
  // ------------------------------
  //   </pre>`;

  //    // Write to print window
  //    printWindow.document.write(`
  //     <html>
  //       <head>
  //         <title>Print Report</title>
  //         <style>
  //           body { font-family: monospace; width: 58mm; }
  //           pre { white-space: pre-wrap; font-size: 8px; }
  //         </style>
  //       </head>
  //       <body onload="window.print(); window.close();">
  //         ${receiptContent}
  //       </body>
  //     </html>
  //   `);

  //    printWindow.document.close();
  //  };
  const printReport = () => {
    if (!sales || sales.length === 0) {
      alert("No data available for printing!");
      return;
    }

    console.log("Printing Sales Data:", sales); // Debugging

    let printWindow = window.open("", "", "width=500,height=300");

    if (
      !printWindow ||
      printWindow.closed ||
      typeof printWindow.closed === "undefined"
    ) {
      alert("Pop-up blocked! Please allow pop-ups for this site.");
      return;
    }

    const dairyName = dairyname || "Dairy Name";
    const city = CityName || "City";
    const reportName = "Purchase Report";
    const dateRange = `From: ${fromdate || "N/A"}  To: ${todate || "N/A"}`;

    // Define receipt format with increased width and improved layout
    let receiptContent = `
    <div style="text-align: center; font-size: 14px; font-family: monospace;">
      <strong>${dairyName}</strong><br/>
      <span style="font-size: 12px;">${city}</span><br/>
      <span style="font-size: 12px;"><strong>${reportName}</strong></span><br/>
      <span style="font-size: 12px;">${dateRange}</span><br/>
      ======================================================
    </div>
    <pre style="font-size: 12px; font-family: monospace; margin: 5px;">
DATE        BILL NO     DEALER        AMOUNT  
-----------------------------------------------------`;

    // Add Table Data with optimized spacing
    sales.forEach((item) => {
      const date = item.purchasedate ? item.purchasedate.slice(2, 10) : "N/A";
      const billNo = (item.billno || "").toString().padEnd(10, " ");
      const dealer = (item.dealerName || "").substring(0, 12).padEnd(14, " ");
      const amount = (item.amount || 0).toFixed(2).padStart(8, " ");

      receiptContent += `\n${date}  ${billNo} ${dealer} ${amount}`;
    });

    // Total Amount
    const totalAmount = sales.reduce(
      (sum, item) => sum + (item.amount || 0),
      0
    );
    receiptContent += `
-----------------------------------------------------
TOTAL AMOUNT:                ${totalAmount.toFixed(2)}
=====================================================
  </pre>`;

    // Write to print window with improved styling for better print alignment
    printWindow.document.write(`
    <html>
      <head>
        <title>Print Report</title>
        <style>
          body { 
            font-family: monospace; 
            width: 100mm;  /* Increased width for better layout */
            text-align: center;
            margin: 0;
            padding: 5px;
          }
          pre { 
            white-space: pre-wrap; 
            font-size: 12px; 
            text-align: left;
            margin: 5px;
          }
          .receipt-container {
            width: 100%;
            max-width: 100mm; /* Adjusted width to fit more content */
          }
        </style>
      </head>
      <body onload="window.print(); window.close();">
        <div class="receipt-container">
          ${receiptContent}
        </div>
      </body>
    </html>
  `);

    printWindow.document.close();
  };

  //.. genrate Disturbed Pdf
  const DisturbedPurches = () => {
    const doc = new jsPDF();

    // Report Header
    const dairyName = dairyname || "Dairy Name";
    const city = CityName || "City Name";
    const reportName = "Disturbed Purchase Report";

    doc.setFontSize(16);
    doc.text(dairyName, 15, 15);
    doc.setFontSize(12);
    doc.text(`City: ${city}`, 15, 25);
    doc.text(`Report: ${reportName}`, 15, 35);
    doc.text(`From: ${fromdate || "N/A"}  To: ${todate || "N/A"}`, 15, 45);

    // ************** First Table: Bill Summary **************
    const summaryColumn = [
      "Bill No",
      "Date",
      "Dealer Code",
      "Dealer Name",
      "Total Amount",
    ];

    const summaryRows = (sales || []).map((item) => [
      item.billno || "N/A",
      item.purchasedate ? item.purchasedate.slice(0, 10) : "N/A",
      item.dealerCode || "N/A",
      item.dealerName || "N/A",
      item.amount ? item.amount.toFixed(2) : "0.00",
    ]);

    // Calculate Total Amount
    const totalAmount = (sales || []).reduce(
      (sum, item) => sum + (item.amount || 0),
      0
    );
    summaryRows.push(["", "", "", "Total Amount", totalAmount.toFixed(2)]);

    // First Table (Summary Table)
    doc.autoTable({
      startY: 55,
      head: [summaryColumn],
      body: summaryRows,
      theme: "grid",
      styles: { fontSize: 10 },
      headStyles: { fillColor: [0, 0, 0] },
    });

    // ************** Second Table: Detailed Purchase Items **************
    let nextTableStartY = doc.autoTable.previous.finalY + 10; // Position below the first table
    doc.text("Purchase Item Details", 15, nextTableStartY - 5);

    const detailColumn = [
      "Dealer Code",
      "Item Name",
      "Qty",
      "Rate",
      "GST",
      "GST Amount",
      "SGST",
      "SGST Amount",
      "Discount Amount",
      "Amount",
    ];

    const detailRows = (sales || []).flatMap((item) =>
      (item.items || [sales]).map((detail) => [
        item.dealerCode || "N/A",
        item.itemname || "N/A",
        item.qty || 0,
        item.rate ? item.rate.toFixed(2) : "0.00",
        item.gst ? item.gst + "%" : "0%",
        item.gstamt ? item.gstamt.toFixed(2) : "0.00",
        item.sgst ? item.sgst + "%" : "0%",
        item.sgstamt ? item.sgstamt.toFixed(2) : "0.00",
        item.discamt ? item.discamt.toFixed(2) : "0.00",
        item.amount ? item.amount.toFixed(2) : "0.00",
      ])
    );

    // Calculate Grand Total
    const grandTotal = (sales || []).reduce(
      (sum, item) =>
        sum +
        (item.items || []).reduce(
          (subSum, item) => subSum + (item.amount || 0),
          0
        ),
      0
    );

    detailRows.push([
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "Total Amount",
      grandTotal.toFixed(2),
    ]);

    // Second Table (Details Table)
    doc.autoTable({
      startY: nextTableStartY,
      head: [detailColumn],
      body: detailRows,
      theme: "grid",
      styles: { fontSize: 10 },
      headStyles: { fillColor: [0, 0, 0] },
    });

    // Save PDF
    doc.save("Purchase_Report.pdf");
  };
  //.. Print Distrubuted purches
  const DisturbedPurchesprintReport = () => {
    if (!sales || sales.length === 0) {
      alert("No data available for printing!");
      return;
    }

    console.log("Printing Sales Data:", sales); // Debugging

    let printWindow = window.open("", "", "width=500,height=400");

    if (
      !printWindow ||
      printWindow.closed ||
      typeof printWindow.closed === "undefined"
    ) {
      alert("Pop-up blocked! Please allow pop-ups for this site.");
      return;
    }

    const dairyName = dairyname || "Dairy Name";
    const city = CityName || "City";
    const reportName = "Disturbed Purchase Report";
    const dateRange = `From: ${fromdate || "N/A"}  To: ${todate || "N/A"}`;

    // Define receipt format
    let receiptContent = `
    <div style="text-align: center; font-size: 10px; font-family: monospace;">
      <strong>${dairyName}</strong><br/>
      City: ${city}<br/>
      ${reportName}<br/>
      ${dateRange}<br/>
      --------------------------------
    </div>
    <pre style="font-size: 8px; font-family: monospace;">
DATE       BILL   DEALER   AMOUNT
--------------------------------`;

    // Add Summary Table Data
    sales.forEach((item) => {
      const date = item.purchasedate ? item.purchasedate.slice(2, 10) : "N/A";
      const billNo = (item.billno || "").toString().padEnd(6, " ");
      const dealer = (item.dealerName || "").substring(0, 6).padEnd(7, " ");
      const amount = (item.amount || 0).toFixed(2).padStart(6, " ");

      receiptContent += `\n${date}  ${billNo} ${dealer} ${amount}`;
    });

    // Total Amount
    const totalAmount = sales.reduce(
      (sum, item) => sum + (item.amount || 0),
      0
    );
    receiptContent += `
--------------------------------
Total Amount:      ${totalAmount.toFixed(2)}
--------------------------------
  </pre>`;

    // Add Detailed Purchase Items Table
    receiptContent += `
  <pre style="font-size: 8px; font-family: monospace;">
Dealer  Item    Qty  Rate  Amount
--------------------------------`;

    sales.forEach((item) => {
      (item.items || []).forEach((detail) => {
        const dealer = (item.dealerCode || "").padEnd(5, " ");
        const itemName = (detail.itemname || "").substring(0, 6).padEnd(6, " ");
        const qty = detail.qty.toString().padStart(3, " ");
        const rate = detail.rate
          ? detail.rate.toFixed(2).padStart(5, " ")
          : "0.00";
        const amount = detail.amount
          ? detail.amount.toFixed(2).padStart(6, " ")
          : "0.00";

        receiptContent += `\n${dealer} ${itemName} ${qty} ${rate} ${amount}`;
      });
    });

    // Grand Total
    const grandTotal = sales.reduce(
      (sum, item) =>
        sum +
        (item.items || []).reduce(
          (subSum, item) => subSum + (item.amount || 0),
          0
        ),
      0
    );

    receiptContent += `
--------------------------------
Grand Total:      ${grandTotal.toFixed(2)}
--------------------------------
  </pre>`;

    // Write to print window
    printWindow.document.write(`
    <html>
      <head>
        <title>Print Report</title>
        <style>
          body { font-family: monospace; width: 58mm; text-align: center; }
          pre { white-space: pre-wrap; font-size: 8px; text-align: left; }
        </style>
      </head>
      <body onload="window.print(); window.close();">
        ${receiptContent}
      </body>
    </html>
  `);

    printWindow.document.close();
  };

  //.. Peroid wise pdf
  const generatePeroidwisePDF = () => {
    const doc = new jsPDF();

    // Report Header
    const dairyName = dairyname || "Dairy Name";
    const city = CityName || "City Name";
    const reportName = "Purchase Report";
    const reportFromDate = fromdate || "N/A";
    const reportToDate = todate || "N/A";

    doc.setFontSize(16);
    doc.text(dairyName, 15, 15);
    doc.setFontSize(12);
    doc.text(`City: ${city}`, 15, 25);
    doc.text(`Report: ${reportName}`, 15, 35);
    doc.text(`From: ${reportFromDate}  To: ${reportToDate}`, 15, 45);

    // ************** Table Headers **************
    const tableColumn = ["Item Name", "Qty", "Sale Rate", "Amount"];

    // Ensure 'sales' is an array
    const salesData = Array.isArray(sales) ? sales : [];

    // Populate table data
    const tableRows = salesData.map((item) => [
      item.itemname || "N/A",
      item.qty || 0,
      item.salerate ? item.salerate.toFixed(2) : "0.00",
      item.amount ? item.amount.toFixed(2) : "0.00",
    ]);

    // Calculate Total Amount
    const totalAmount = salesData.reduce(
      (sum, item) => sum + (item.amount || 0),
      0
    );

    // Add total row at the end
    tableRows.push(["", "", "Total Amount", totalAmount.toFixed(2)]);

    // Generate Table
    doc.autoTable({
      startY: 55,
      head: [tableColumn],
      body: tableRows,
      theme: "grid",
      styles: { fontSize: 10 },
      headStyles: { fillColor: [0, 0, 0], textColor: [255, 255, 255] }, // White text on black header
    });

    // Save PDF
    doc.save("Purchase_Report.pdf");
  };
 
const printPeroidReport = () => {
  if (!sales || sales.length === 0) {
    alert("No data available for printing!");
    return;
  }

  // Open a new window for the print content
  const printWindow = window.open("", "", "width=500,height=600");

  if (!printWindow) {
    alert("Unable to open print window. Please check your browser settings.");
    return;
  }

  // Define the report content
  const dairyName = dairyname || "Dairy Name";
  const city = CityName || "City";
  const reportName = "Purchase Report";
  const dateRange = `From: ${fromdate || "N/A"} To: ${todate || "N/A"}`;

  // Start building the HTML content
  let receiptContent = `
    <div style="text-align: center; font-size: 12px; font-family: monospace;">
      <strong>${dairyName}</strong><br/>
      ${city}<br/>
      <strong>${reportName}</strong><br/>
      ${dateRange}<br/>
      ==============================<br/>
    </div>
    <div style="font-size: 12px; font-family: monospace; margin-top: 10px;">
      <div style="display: flex; justify-content: space-between;">
        <span>Date</span><span>Bill No</span><span>Dealer</span><span>Amount</span>
      </div>
      --------------------------------
  `;

  // Add each sale item to the receipt content
  sales.forEach((item) => {
    const date = item.purchasedate ? item.purchasedate.slice(2, 10) : "N/A";
    const billNo = item.billno || "";
    const dealer = item.dealerName || "";
    const amount = (item.amount || 0).toFixed(2);

    receiptContent += `
      <div style="display: flex; justify-content: space-between;">
        <span>${date}</span><span>${billNo}</span><span>${dealer}</span><span>${amount}</span>
      </div>
    `;
  });

  // Calculate and display the total amount
  const totalAmount = sales
    .reduce((sum, item) => sum + (item.amount || 0), 0)
    .toFixed(2);
  receiptContent += `
      --------------------------------
      <div style="display: flex; justify-content: space-between;">
        <strong>Total</strong><span>${totalAmount}</span>
      </div>
    </div>
  `;

  // Write the content to the print window
  printWindow.document.write(`
    <html>
      <head>
        <title>Print Report</title>
        <style>
          body {
            width: 58mm;
            margin: 0;
            padding: 0;
            font-family: monospace;
            text-align: center;
          }
          div {
            margin: 0;
            padding: 0;
          }
        </style>
      </head>
      <body onload="window.print(); window.close();">
        ${receiptContent}
      </body>
    </html>
  `);

  printWindow.document.close();
};




  const printDealerwiseReport = (data) => {
    if (!data || data.length === 0) {
      alert("No data available for printing!");
      return;
    }

    let printWindow = window.open("", "", "width=300,height=600");

    if (
      !printWindow ||
      printWindow.closed ||
      typeof printWindow.closed === "undefined"
    ) {
      alert("Pop-up blocked! Please allow pop-ups for this site.");
      return;
    }

    const dairyName = "Dairy Name";
    const city = "City Name";
    const reportTitle = "Dealerwise Purchase Report";
    const dateRange = `From: [Start Date] To: [End Date]`;

    // Define receipt format
    let receiptContent = `
    <div style="text-align: center; font-size: 10px; font-family: monospace;">
      <strong>${dairyName}</strong><br/>
      City: ${city}<br/>
      ${reportTitle}<br/>
      ${dateRange}<br/>
      --------------------------------
    </div>
    <pre style="font-size: 8px; font-family: monospace;">
DATE       DEALER   QTY   RATE   AMOUNT
--------------------------------`;

    // Add Table Data
    data.forEach((item) => {
      const date = item.purchaseDate ? item.purchaseDate.slice(2, 10) : "N/A";
      const dealer = (item.dealerName || "").substring(0, 6).padEnd(7, " ");
      const qty = (item.qty || 0).toString().padStart(3, " ");
      const rate = (item.rate || 0).toFixed(2).padStart(5, " ");
      const amount = (item.amount || 0).toFixed(2).padStart(6, " ");

      receiptContent += `\n${date}  ${dealer} ${qty} ${rate} ${amount}`;
    });

    // Total Amount
    const totalAmount = data.reduce(
      (sum, item) => sum + parseFloat(item.amount || 0),
      0
    );
    receiptContent += `
--------------------------------
Total Amount:      ${totalAmount.toFixed(2)}
--------------------------------
  </pre>`;

    // Write to print window
    printWindow.document.write(`
    <html>
      <head>
        <title>Print Report</title>
        <style>
          body { font-family: monospace; width: 58mm; text-align: center; }
          pre { white-space: pre-wrap; font-size: 8px; text-align: left; }
        </style>
      </head>
      <body onload="window.print(); window.close();">
        ${receiptContent}
      </body>
    </html>
  `);

    printWindow.document.close();
  };

  //...  Saledata Api calling
  useEffect(() => {
    const salefetchData = async () => {
      // if (!fromdate || !toDate) {
      //   alert("Please select both From and To dates.");
      //   return;
      // }
      try {
        const response = await axios.get(
          "http://localhost:4040/smartdairy/api/stock/sale/all",
          { fromdate, todate }
        );
        console.log("API Response:", response.data.salesData);
        SetSaleData(response.data.salesData);
      } catch (error) {
        console.log(
          "Error Handling:",
          error.response ? error.response.data : error.message
        );
      }
    };
    console.log(" saleing data ", saledata);

    salefetchData();
  }, []); // Run useEffect when fromDate or toDate changes-

  console.log(" hallo salesdata ", saledata);

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

  //.... Api calling for delare

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responce = await axios.post(
          "http://localhost:4040/smartdairy/api/dealer"
        );
        console.log("Dealer", responce.data.customerList);
        SetDealer(responce.data.customerList);
      } catch (error) {
        console.log(
          "Error handaling",
          error.responce ? error.responce.data : error.message
        );
      }
    };
    fetchData();
  }, []);

  console.log(" Dealer Name ", dealer);

  //... Dealer Pdf

  const generateDealerrPDF = () => {
    const doc = new jsPDF();

    // Define header details
    const dairyName = dairyname; // Ensure dairyname is defined in your component state or props
    const cityName = CityName; // Ensure CityName is defined in your component state or props
    const reportTitle = "Supplierwise Purchase Report";
    const fromDate = "01-01-2024"; // Example start date
    const toDate = "10-02-2024"; // Example end date

    // Set header
    doc.setFontSize(14);
    doc.text(dairyName, 14, 10);
    doc.text(cityName, 160, 10);
    doc.setFontSize(12);
    doc.text(reportTitle, 80, 20);
    doc.text(`From: ${fromDate}  To: ${toDate}`, 75, 30);

    // Group data by purchase date
    const groupedData = {};
    sales.forEach((sale) => {
      const purchaseDate = sale.purchasedate.slice(0, 10); // Extract YYYY-MM-DD
      if (!groupedData[purchaseDate]) {
        groupedData[purchaseDate] = { sales: [], totalAmount: 0 };
      }
      groupedData[purchaseDate].sales.push(sale);
      groupedData[purchaseDate].totalAmount += parseFloat(sale.amount); // Sum amount
    });

    let yPos = 40; // Adjusted position after header
    let grandTotal = 0; // Variable to store grand total

    Object.keys(groupedData).forEach((date) => {
      doc.setFontSize(10);
      doc.text(`Purchase Date: ${date}`, 14, yPos);
      yPos += 5;

      // Add table
      const tableStartY = yPos;
      doc.autoTable({
        startY: yPos,
        head: [
          ["Item Name", "Dealer Name", "Qty", "Bill No", "Rate", "Amount"],
        ],
        body: groupedData[date].sales.map((sale) => [
          sale.itemname,
          sale.dealerName,
          sale.qty,
          sale.billno,
          sale.rate,
          sale.amount,
        ]),
        theme: "grid",
        styles: { fontSize: 10 },
        columnStyles: {
          5: { halign: "right" }, // Align "Amount" column to the right
        },
      });

      yPos = doc.autoTable.previous.finalY + 5; // Move below the table

      // Display total amount for this date properly aligned under "Amount" column
      doc.setFontSize(10);
      doc.text("Total Amount:", 130, yPos);
      doc.text(`₹${groupedData[date].totalAmount.toFixed(2)}`, 180, yPos, {
        align: "right",
      });
      yPos += 10; // Space after total

      // Add to grand total
      grandTotal += groupedData[date].totalAmount;
    });

    // Display Grand Total at the end of the PDF properly aligned
    doc.setFontSize(12);
    doc.text("Grand Total:", 130, yPos + 10);
    doc.text(`₹${grandTotal.toFixed(2)}`, 180, yPos + 10, { align: "right" });

    doc.save("Supplierwise_Purchase_Report.pdf");
  };

  //... Dealer name wise

  useEffect(() => {
    if (selectedDealer && Array.isArray(sales)) {
      const data = sales.filter(
        (item) =>
          String(item.dealerCode).trim() === String(selectedDealer).trim()
      );

      console.log("Filtered Data:", data);

      if (Array.isArray(data)) {
        setFilteredData(data); // Ensure data is an array
      } else {
        setFilteredData([]); // Set an empty array if something is wrong
      }

      if (data.length > 0) {
        generateDealerNamePDF(data);
      } else {
        console.warn("No data found for dealer:", selectedDealer);
      }
    }
  }, [selectedDealer, sales]);

  //.....   Dealer name pdf
  const generateDealerNamePDF = (data) => {
    const doc = new jsPDF();

    // Add Report Heading
    doc.setFontSize(16);
    doc.text("Dairy Name", 15, 10);
    doc.text("City Name", 150, 10);
    doc.setFontSize(12);
    doc.text("Dealerwise Purchase Report", 80, 20);
    doc.text("From: [Start Date] To: [End Date]", 15, 30);

    // Table headers
    const tableColumn = [
      "Item Name",
      "Purchase Date",
      "Dealer Name",
      "Quantity",
      "Bill No",
      "Rate",
      "Amount",
    ];

    // Table rows
    const tableRows = data.map((item) => [
      item.itemName || "N/A",
      item.purchaseDate || "N/A",
      item.dealerName || "N/A",
      item.qty || 0,
      item.billNo || "N/A",
      item.rate || 0,
      item.amount || 0,
    ]);

    // Calculate Total Amount
    const totalAmount = data.reduce(
      (sum, item) => sum + parseFloat(item.amount || 0),
      0
    );

    // Add table to PDF
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 40,
    });

    // Add Total Amount at the end
    doc.text(
      `Total Amount: ${totalAmount}`,
      15,
      doc.autoTable.previous.finalY + 10
    );

    // Save PDF
    doc.save(`Dealerwise_Report_${selectedDealer}.pdf`);
  };

  const calculateRemainingStock = (sales, saledata) => {
    // Group purchases by itemcode
    const groupedSales = sales.reduce((acc, item) => {
      const { itemcode, itemname, qty, rate } = item;

      if (!acc[itemcode]) {
        acc[itemcode] = {
          itemcode,
          itemname,
          totalquantity: 0,
          totalrate: 0,
        };
      }

      acc[itemcode].totalquantity += qty;
      acc[itemcode].totalrate = rate; // Latest rate

      return acc;
    }, {});

    // Group sales by itemcode
    const groupedSaleData = saledata.reduce((acc, item) => {
      const { ItemCode, Qty } = item;

      if (!acc[ItemCode]) {
        acc[ItemCode] = {
          itemcode: ItemCode,
          totalquantity: 0,
        };
      }

      acc[ItemCode].totalquantity += Qty;
      return acc;
    }, {});

    // Calculate remaining stock
    const remainingStock = Object.values(groupedSales).map((item) => {
      const soldQty = groupedSaleData[item.itemcode]?.totalquantity || 0;
      const remainingQty = item.totalquantity - soldQty;

      return {
        itemcode: item.itemcode,
        itemname: item.itemname,
        remainingquantity: remainingQty,
        rate: item.totalrate,
        amount: remainingQty * item.totalrate,
      };
    });

    return remainingStock;
  };

  //... All Stocks
  const generateStockReportPDF = () => {
    const stockData = calculateRemainingStock(sales, saledata);
    const doc = new jsPDF();

    // Set Report Title & Dairy Info
    doc.setFontSize(14);
    doc.text(dairyname, 14, 10); // Dairy Name
    doc.text(CityName, 14, 18); // City Name

    doc.setFontSize(16);
    doc.text("Stock Report", 80, 28); // Report Title (centered)

    doc.setFontSize(12);
    doc.text(`From: ${fromdate}   To: ${todate}`, 14, 36); // Date Range

    // Table Headers
    const tableColumn = [
      "Item Code",
      "Item Name",
      "Remaining Qty",
      "Rate",
      "Amount",
    ];
    const tableRows = stockData.map((item) => [
      item.itemcode,
      item.itemname,
      item.remainingquantity,
      item.rate,
      item.amount,
    ]);

    // Calculate Total Amount
    const totalAmount = stockData.reduce((sum, item) => sum + item.amount, 0);

    // Generate Table
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 45, // Start below the date
    });

    // Get Last Table Position
    const finalY = doc.lastAutoTable.finalY + 10;

    // Display Total Amount
    doc.setFontSize(14);
    doc.text(`Total Amount: ₹ ${totalAmount}`, 14, finalY);

    // Save PDF
    doc.save("Stock_Report.pdf");
  };

  //.... CattelFeed Stock report
  const generateCattleStockReportPDF = () => {
    // Step 1: Filter Only `itemgroupcode === 1`
    const filteredSales = sales.filter((item) => item.itemgroupcode === 1);

    // Step 2: Group Purchases & Sales and Calculate Remaining Stock
    const calculateRemainingStock = (sales, saledata) => {
      const groupedSales = sales.reduce((acc, item) => {
        const { itemcode, itemname, qty, rate } = item;

        if (!acc[itemcode]) {
          acc[itemcode] = {
            itemcode,
            itemname,
            totalquantity: 0,
            totalrate: 0,
          };
        }

        acc[itemcode].totalquantity += qty;
        acc[itemcode].totalrate = rate; // Last rate
        return acc;
      }, {});

      const groupedSaleData = saledata.reduce((acc, item) => {
        const { ItemCode, Qty } = item;

        if (!acc[ItemCode]) {
          acc[ItemCode] = { itemcode: ItemCode, totalquantity: 0 };
        }

        acc[ItemCode].totalquantity += Qty;
        return acc;
      }, {});

      return Object.values(groupedSales).map((item) => {
        const soldQty = groupedSaleData[item.itemcode]?.totalquantity || 0;
        const remainingQty = item.totalquantity - soldQty;

        return {
          itemcode: item.itemcode,
          itemname: item.itemname,
          remainingquantity: remainingQty,
          rate: item.totalrate,
          amount: remainingQty * item.totalrate,
        };
      });
    };

    const stockData = calculateRemainingStock(filteredSales, saledata);

    const doc = new jsPDF();

    // Header Section
    doc.setFontSize(14);
    doc.text(dairyname, 14, 10);
    doc.text(CityName, 14, 18);

    doc.setFontSize(16);
    doc.text("Cattle Feed Stock Report", 60, 28); // Report Title

    doc.setFontSize(12);
    doc.text(`From: ${fromdate}   To: ${todate}`, 14, 36);

    // Table Headers
    const tableColumn = [
      "Item Code",
      "Item Name",
      "Remaining Qty",
      "Rate",
      "Amount",
    ];
    const tableRows = stockData.map((item) => [
      item.itemcode,
      item.itemname,
      item.remainingquantity,
      item.rate,
      item.amount,
    ]);

    // Calculate Total Amount
    const totalAmount = stockData.reduce((sum, item) => sum + item.amount, 0);

    // Generate Table
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 45,
    });

    // Display Total Amount
    const finalY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(14);
    doc.text(`Total Amount: ₹ ${totalAmount}`, 14, finalY);

    // Save PDF
    doc.save("Cattle_Feed_Stock_Report.pdf");
  };
  //..... Grocary  Stock report
  const generateGrocaryStockReportPDF = () => {
    // Step 1: Filter Only `itemgroupcode === 1`
    const filteredSales = sales.filter((item) => item.itemgroupcode === 3);

    // Step 2: Group Purchases & Sales and Calculate Remaining Stock
    const calculateRemainingStock = (sales, saledata) => {
      const groupedSales = sales.reduce((acc, item) => {
        const { itemcode, itemname, qty, rate } = item;

        if (!acc[itemcode]) {
          acc[itemcode] = {
            itemcode,
            itemname,
            totalquantity: 0,
            totalrate: 0,
          };
        }

        acc[itemcode].totalquantity += qty;
        acc[itemcode].totalrate = rate; // Last rate
        return acc;
      }, {});

      const groupedSaleData = saledata.reduce((acc, item) => {
        const { ItemCode, Qty } = item;

        if (!acc[ItemCode]) {
          acc[ItemCode] = { itemcode: ItemCode, totalquantity: 0 };
        }

        acc[ItemCode].totalquantity += Qty;
        return acc;
      }, {});

      return Object.values(groupedSales).map((item) => {
        const soldQty = groupedSaleData[item.itemcode]?.totalquantity || 0;
        const remainingQty = item.totalquantity - soldQty;

        return {
          itemcode: item.itemcode,
          itemname: item.itemname,
          remainingquantity: remainingQty,
          rate: item.totalrate,
          amount: remainingQty * item.totalrate,
        };
      });
    };

    const stockData = calculateRemainingStock(filteredSales, saledata);

    const doc = new jsPDF();

    // Header Section
    doc.setFontSize(14);
    doc.text(dairyname, 14, 10);
    doc.text(CityName, 14, 18);

    doc.setFontSize(16);
    doc.text("Grocary-Stock-Report ", 60, 28); // Report Title

    doc.setFontSize(12);
    doc.text(`From: ${fromdate}   To: ${todate}`, 14, 36);

    // Table Headers
    const tableColumn = [
      "Item Code",
      "Item Name",
      "Remaining Qty",
      "Rate",
      "Amount",
    ];
    const tableRows = stockData.map((item) => [
      item.itemcode,
      item.itemname,
      item.remainingquantity,
      item.rate,
      item.amount,
    ]);

    // Calculate Total Amount
    const totalAmount = stockData.reduce((sum, item) => sum + item.amount, 0);

    // Generate Table
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 45,
    });

    // Display Total Amount
    const finalY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(14);
    doc.text(`Total Amount: ₹ ${totalAmount}`, 14, finalY);

    // Save PDF
    doc.save("Grocary_Stock_Report.pdf");
  };
  //... Medicine Stock
  const generateMedicineStockReportPDF = () => {
    // Step 1: Filter Only `itemgroupcode === 1`
    const filteredSales = sales.filter((item) => item.itemgroupcode === 2);

    // Step 2: Group Purchases & Sales and Calculate Remaining Stock
    const calculateRemainingStock = (sales, saledata) => {
      const groupedSales = sales.reduce((acc, item) => {
        const { itemcode, itemname, qty, rate } = item;

        if (!acc[itemcode]) {
          acc[itemcode] = {
            itemcode,
            itemname,
            totalquantity: 0,
            totalrate: 0,
          };
        }

        acc[itemcode].totalquantity += qty;
        acc[itemcode].totalrate = rate; // Last rate
        return acc;
      }, {});

      const groupedSaleData = saledata.reduce((acc, item) => {
        const { ItemCode, Qty } = item;

        if (!acc[ItemCode]) {
          acc[ItemCode] = { itemcode: ItemCode, totalquantity: 0 };
        }

        acc[ItemCode].totalquantity += Qty;
        return acc;
      }, {});

      return Object.values(groupedSales).map((item) => {
        const soldQty = groupedSaleData[item.itemcode]?.totalquantity || 0;
        const remainingQty = item.totalquantity - soldQty;

        return {
          itemcode: item.itemcode,
          itemname: item.itemname,
          remainingquantity: remainingQty,
          rate: item.totalrate,
          amount: remainingQty * item.totalrate,
        };
      });
    };

    const stockData = calculateRemainingStock(filteredSales, saledata);

    const doc = new jsPDF();

    // Header Section
    doc.setFontSize(14);
    doc.text(dairyname, 14, 10);
    doc.text(CityName, 14, 18);

    doc.setFontSize(16);
    doc.text("Medicine_Stock_Report", 60, 28); // Report Title

    doc.setFontSize(12);
    doc.text(`From: ${fromDate}   To: ${toDate}`, 14, 36);

    // Table Headers
    const tableColumn = [
      "Item Code",
      "Item Name",
      "Remaining Qty",
      "Rate",
      "Amount",
    ];
    const tableRows = stockData.map((item) => [
      item.itemcode,
      item.itemname,
      item.remainingquantity,
      item.rate,
      item.amount,
    ]);

    // Calculate Total Amount
    const totalAmount = stockData.reduce((sum, item) => sum + item.amount, 0);

    // Generate Table
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 45,
    });

    // Display Total Amount
    const finalY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(14);
    doc.text(`Total Amount: ₹ ${totalAmount}`, 14, finalY);

    // Save PDF
    doc.save("Medicine_Stock_Report.pdf");
  };
  //... Dairy Goods
  const generateDairyGoodsStockReportPDF = () => {
    // Step 1: Filter Only `itemgroupcode === 1`
    const filteredSales = sales.filter((item) => item.itemgroupcode === 4);

    // Step 2: Group Purchases & Sales and Calculate Remaining Stock
    const calculateRemainingStock = (sales, saledata) => {
      const groupedSales = sales.reduce((acc, item) => {
        const { itemcode, itemname, qty, rate } = item;

        if (!acc[itemcode]) {
          acc[itemcode] = {
            itemcode,
            itemname,
            totalquantity: 0,
            totalrate: 0,
          };
        }

        acc[itemcode].totalquantity += qty;
        acc[itemcode].totalrate = rate; // Last rate
        return acc;
      }, {});

      const groupedSaleData = saledata.reduce((acc, item) => {
        const { ItemCode, Qty } = item;

        if (!acc[ItemCode]) {
          acc[ItemCode] = { itemcode: ItemCode, totalquantity: 0 };
        }

        acc[ItemCode].totalquantity += Qty;
        return acc;
      }, {});

      return Object.values(groupedSales).map((item) => {
        const soldQty = groupedSaleData[item.itemcode]?.totalquantity || 0;
        const remainingQty = item.totalquantity - soldQty;

        return {
          itemcode: item.itemcode,
          itemname: item.itemname,
          remainingquantity: remainingQty,
          rate: item.totalrate,
          amount: remainingQty * item.totalrate,
        };
      });
    };

    const stockData = calculateRemainingStock(filteredSales, saledata);

    const doc = new jsPDF();

    // Header Section
    doc.setFontSize(14);
    doc.text(dairyname, 14, 10);
    doc.text(CityName, 14, 18);

    doc.setFontSize(16);
    doc.text(" DairyGoodsStock ", 60, 28); // Report Title

    doc.setFontSize(12);
    doc.text(`From: ${fromdate}   To: ${todate}`, 14, 36);

    // Table Headers
    const tableColumn = [
      "Item Code",
      "Item Name",
      "Remaining Qty",
      "Rate",
      "Amount",
    ];
    const tableRows = stockData.map((item) => [
      item.itemcode,
      item.itemname,
      item.remainingquantity,
      item.rate,
      item.amount,
    ]);

    // Calculate Total Amount
    const totalAmount = stockData.reduce((sum, item) => sum + item.amount, 0);

    // Generate Table
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 45,
    });

    // Display Total Amount
    const finalY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(14);
    doc.text(`Total Amount: ₹ ${totalAmount}`, 14, finalY);

    // Save PDF
    doc.save("Dairy_Goods_Stock_Report.pdf");
  };

  const generatyearkReportPDF = () => {
    // Step 1: Filter Only `itemgroupcode === 1`
    const filteredSales = sales.filter((item) => item.itemgroupcode === 1);

    // Step 2: Group Purchases & Sales and Calculate Remaining Stock
    const calculateRemainingStock = (sales, saledata) => {
      const groupedSales = sales.reduce((acc, item) => {
        const { itemcode, itemname, qty, rate } = item;

        if (!acc[itemcode]) {
          acc[itemcode] = {
            itemcode,
            itemname,
            initialStock: 0, // Opening Stock
            purchaseQty: 0,
            purchaseRate: 0,
            totalSalesQty: 0,
            totalSalesAmount: 0,
            debitNote: 0,
            creditNote: 0,
            saleLoss: 0,
          };
        }

        acc[itemcode].purchaseQty += qty;
        acc[itemcode].purchaseRate = rate; // Last purchase rate
        return acc;
      }, {});

      const groupedSaleData = saledata.reduce((acc, item) => {
        const { ItemCode, Qty, Amount } = item;

        if (!acc[ItemCode]) {
          acc[ItemCode] = {
            itemcode: ItemCode,
            totalquantity: 0,
            totalAmount: 0,
          };
        }

        acc[ItemCode].totalquantity += Qty;
        acc[ItemCode].totalAmount += Amount;
        return acc;
      }, {});

      return Object.values(groupedSales).map((item) => {
        const soldQty = groupedSaleData[item.itemcode]?.totalquantity || 0;
        const soldAmount = groupedSaleData[item.itemcode]?.totalAmount || 0;
        const remainingQty = item.purchaseQty - soldQty;

        return {
          itemcode: item.itemcode,
          itemname: item.itemname,
          initialStock: item.initialStock,
          purchaseQty: item.purchaseQty,
          purchaseRate: item.purchaseRate,
          debitNote: item.debitNote,
          salesQty: soldQty,
          salesAmount: soldAmount,
          creditNote: item.creditNote,
          saleLoss: item.saleLoss,
          remainingStock: remainingQty,
          stockValue: remainingQty * item.purchaseRate,
          profit: soldAmount - item.purchaseQty * item.purchaseRate,
        };
      });
    };

    const stockData = calculateRemainingStock(filteredSales, saledata);

    const doc = new jsPDF("l"); // Landscape for better visibility

    // Header Section
    doc.setFontSize(14);
    doc.text(dairyname, 14, 10);
    doc.text(CityName, 14, 18);

    doc.setFontSize(16);
    doc.text("  CattelFeed  Report (Yearly)", 60, 28);

    doc.setFontSize(12);
    doc.text(`From: ${fromdate}   To: ${todate}`, 14, 36);

    // Table Headers
    const tableColumn = [
      "Item Code",
      "Item Name",
      "Initial Stock",
      { content: "Purchases", colSpan: 2 },
      "Debit Note",
      { content: "Sales", colSpan: 2 },
      "Credit Note",
      "Sale Loss",
      { content: "Stock", colSpan: 2 },
      "Profit",
    ];

    const tableRows = stockData.map((item) => [
      item.itemcode,
      item.itemname,
      item.initialStock,
      item.purchaseQty,
      item.purchaseRate,
      item.debitNote,
      item.salesQty,
      item.salesAmount,
      item.creditNote,
      item.saleLoss,
      item.remainingStock,
      item.stockValue,
      item.profit,
    ]);

    // Step 3: Calculate Totals for Each Column
    const totals = {
      initialStock: 0,
      purchaseQty: 0,
      purchaseRate: 0, // No total needed for rate, keeping last value
      debitNote: 0,
      salesQty: 0,
      salesAmount: 0,
      creditNote: 0,
      saleLoss: 0,
      remainingStock: 0,
      stockValue: 0,
      profit: 0,
    };

    stockData.forEach((item) => {
      totals.initialStock += item.initialStock;
      totals.purchaseQty += item.purchaseQty;
      totals.debitNote += item.debitNote;
      totals.salesQty += item.salesQty;
      totals.salesAmount += item.salesAmount;
      totals.creditNote += item.creditNote;
      totals.saleLoss += item.saleLoss;
      totals.remainingStock += item.remainingStock;
      totals.stockValue += item.stockValue;
      totals.profit += item.profit;
    });

    // Add Totals Row to Table
    tableRows.push([
      "TOTAL",
      "",
      totals.initialStock,
      totals.purchaseQty,
      "-", // Purchase rate does not need a total
      totals.debitNote,
      totals.salesQty,
      totals.salesAmount,
      totals.creditNote,
      totals.saleLoss,
      totals.remainingStock,
      totals.stockValue,
      totals.profit,
    ]);

    // Generate Table
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 45,
      theme: "striped",
      styles: { fontSize: 10 },
      columnStyles: {
        2: { halign: "right" },
        3: { halign: "right" },
        4: { halign: "right" },
        5: { halign: "right" },
        6: { halign: "right" },
        7: { halign: "right" },
        8: { halign: "right" },
        9: { halign: "right" },
        10: { halign: "right" },
        11: { halign: "right" },
        12: { halign: "right" },
      },
    });

    // Display Total Profit
    const finalY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(14);
    doc.text(`Total Profit: ₹ ${totals.profit.toFixed(2)}`, 14, finalY);

    // Save PDF
    doc.save("yearwise_Feed_Stock_Report.pdf");
  };

  // Open popup
  const openPopup = () => {
    setIsPopupOpen(true);
  };

  // Close popup
  const closePopup = () => {
    setIsPopupOpen(false);
  };

  // Handle radio button selection
  const handleRadioChange = (event) => {
    setPurchaseType(event.target.value);
  };

  // Handle show button click
  const handleShowClick = () => {
    if (purchaseType === "Particular") {
      alert(
        `Selected Purchase Type: ${purchaseType}\nSpecific Details: ${specificDetails}\nDropdown Option: ${dropdownValue}`
      );
    } else {
      alert(`Selected Purchase Type: ${purchaseType}`);
    }
  };

  //...  Dealer code changes

  const handleDealerCodeChange = (e) => {
    const code = e.target.value;
    setDealerCode(code);

    // Find dealer by code
    const dealerData = dealer.find((d) => d.srno.toString() === code);
    if (dealerData) {
      setDealerName(dealerData.cname); // Auto-fill name
    } else {
      setDealerName(""); // Reset if not found
    }
  };

  // Handle Dealer Name input change
  const handleDealerNameChange = (e) => {
    const name = e.target.value;
    setDealerName(name);

    // Find dealer by name (partial match)
    const dealerData = dealer.find((d) =>
      d.cname.toLowerCase().includes(name.toLowerCase())
    );
    if (dealerData) {
      setDealerCode(dealerData.srno); // Auto-fill code
    } else {
      setDealerCode(""); // Reset if not found
    }
  };

  //...const handleDealerCodeChange = (e) => setDealerCode(e.target.value);
  const handleeDealerCodeChange = (e) => setDealerCode(e.target.value);
  const handleDeealerNameChange = (e) => setDealerName(e.target.value);
  const DealergeneratePDF = () => {
    if (!dealerCode || dealerCode.toString().trim() === "") {
      alert("Please enter Dealer Code");
      return;
    }

    const formattedDealerCode = dealerCode.toString().trim().toLowerCase();

    // Filter sales data based on dealerCode
    const filteredData = sales.filter(
      (sale) =>
        String(sale.dealerCode).trim().toLowerCase() === formattedDealerCode
    );

    if (filteredData.length === 0) {
      alert("No data found for this dealer.");
      return;
    }

    // Group data by purchase date
    const groupedByDate = filteredData.reduce((acc, sale) => {
      const purchaseDate = sale.purchasedate
        ? sale.purchasedate.slice(0, 10)
        : "Unknown Date";
      if (!acc[purchaseDate]) {
        acc[purchaseDate] = [];
      }
      acc[purchaseDate].push(sale);
      return acc;
    }, {});

    const doc = new jsPDF();
    doc.text(`Dealer Purchase Report`, 14, 10);
    doc.text(`Dealer Code: ${dealerCode}`, 14, 20);

    let startY = 30;
    let grandTotal = 0;

    Object.keys(groupedByDate).forEach((date) => {
      const salesData = groupedByDate[date];

      // Display Purchase Date
      doc.text(`Purchase Date: ${date}`, 14, startY);
      startY += 10;

      const tableColumn = [
        "Item Name",
        "Quantity",
        "Bill No",
        "Rate",
        "Amount",
      ];
      let totalAmountPerDate = 0;

      const tableRows = salesData.map((row) => {
        const amount = parseFloat(row.amount) || 0;
        totalAmountPerDate += amount;
        return [row.itemname, row.qty, row.billno, row.rate, amount.toFixed(2)];
      });

      // Add subtotal row for this date
      tableRows.push(["", "", "", "Subtotal", totalAmountPerDate.toFixed(2)]);

      // Update grand total
      grandTotal += totalAmountPerDate;

      doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: startY,
        theme: "grid",
      });

      startY = doc.lastAutoTable.finalY + 10; // Adjust for next table
    });

    // Grand Total at the end
    doc.text(`Grand Total: ${grandTotal.toFixed(2)}`, 14, startY + 10);

    doc.save(`Dealer_Purchase_Report_${dealerCode}.pdf`);
  };

  const handleItemCodeChange = (e) => {
    const code = e.target.value;
    setItemCode(code);

    // Find item by code
    const itemData = item.find((item) => item.itemCode.toString() === code);
    if (itemData) {
      setItemDesc(itemData.itemDesc); // Auto-fill description
    } else {
      setItemDesc(""); // Reset if not found
    }
  };
  ///..............    Itemwise APi ----------------------->
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

  // Handle ItemGroupCode selection
  const handleInputChange = (e) => {
    const enteredCode = e.target.value;
    setSelectedGroup(enteredCode);

    if (groupedItems[enteredCode]) {
      setFilteredItems(groupedItems[enteredCode]);
      setSelectedItem(""); // Reset item selection
    } else {
      setFilteredItems([]);
      console.warn("No items found for:", enteredCode);
    }
  };
  //... Select Items  for genrate  item-wise  pdf ---------------------------------------------------------->
  const handleSelectChange = (event) => {
    setSelectedItem(event.target.value);
  };

  // Handle Item selection (Set ItemCode instead of ItemName)
  const handleItemChange = (e) => {
    console.log("Selected Item Code:", e.target.value); // Debug log
    setSelectedItem(e.target.value);
  };

  const groupedSales = sales.reduce((acc, item) => {
    if (!acc[item.dealerCode]) {
      // Ensure this matches the correct identifier
      acc[item.dealerCode] = [];
    }
    acc[item.dealerCode].push(item);
    return acc;
  }, {});

  // Fetch purchase data and generate PDF
  const generateitemwisePDF = async () => {
    if (!selectedItem) {
      alert("Please select an item.");
      return;
    }

    try {
      console.log("Fetching purchase data for:", selectedItem);

      // Fetch purchase data based on selected item
      const response = await axios.get(
        `http://localhost:4040/smartdairy/api/purchase/all=${selectedItem}`
      );
      SetSales(response.data);
      console.log("purchess data", sales);
      // Generate PDF
      const doc = new jsPDF();
      doc.text("Item Purchase Report", 14, 10);
      doc.text(`Item Code: ${selectedItem}`, 14, 20);

      // Table Headers
      const tableColumn = [
        "Date",
        "Dealer",
        "Quantity",
        "Bill No",
        "Rate",
        "Amount",
      ];
      const tableRows = [];

      let totalAmount = 0;

      response.data.forEach((row) => {
        const formattedDate = row.purchasedate
          ? row.purchasedate.slice(0, 10)
          : "N/A";
        const amount = parseFloat(row.amount) || 0;
        totalAmount += amount;

        tableRows.push([
          formattedDate,
          row.dealerName,
          row.qty,
          row.billno,
          row.rate,
          amount.toFixed(2),
        ]);
      });

      // Add total row
      tableRows.push(["", "", "", "", "Total", totalAmount.toFixed(2)]);

      // Generate Table
      doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 30,
        theme: "grid",
      });

      // Save PDF
      doc.save(`Item_Purchase_Report_${selectedItem}.pdf`);
    } catch (error) {
      console.error("Error fetching purchase data:", error);
    }
  };

  //.. Stock Register report -------------------------------------------->
  const calculateQRemainingStock = (sales, saledata) => {
    const stockMap = {};

    // Process purchase data (sales)
    sales.forEach((purchase) => {
      const { purchasedate, itemcode, itemname, qty } = purchase;
      const dateKey = purchasedate.slice(0, 10); // Extract YYYY-MM-DD

      if (!stockMap[dateKey]) stockMap[dateKey] = {};
      if (!stockMap[dateKey][itemcode]) {
        stockMap[dateKey][itemcode] = {
          date: dateKey,
          itemcode,
          itemname,
          purchaseQty: 0,
          saleQty: 0,
          remainingStock: 0,
        };
      }

      stockMap[dateKey][itemcode].purchaseQty += qty;
    });

    // Process sale data (saledata)
    saledata.forEach((sale) => {
      const { saledate, ItemCode, itemname, Qty } = sale;
      const dateKey = saledate;
      if (!stockMap[dateKey]) stockMap[dateKey] = {};
      if (!stockMap[dateKey][ItemCode]) {
        stockMap[dateKey][ItemCode] = {
          date: dateKey,
          itemcode: ItemCode,
          itemname,
          purchaseQty: 0,
          saleQty: 0,
          remainingStock: 0,
        };
      }

      stockMap[dateKey][ItemCode].saleQty += Qty;
    });

    // Calculate remaining stock
    const reportData = Object.values(stockMap)
      .flatMap((items) => Object.values(items))
      .map((item) => ({
        date: item.date,
        itemcode: item.itemcode,
        itemname: item.itemname,
        purchaseQty: item.purchaseQty,
        saleQty: item.saleQty,
        remainingStock: item.purchaseQty - item.saleQty, // Remaining Stock Calculation
      }));

    return reportData;
  };

  const StockReportPDF = () => {
    const stockData = calculateQRemainingStock(sales, saledata);
    const doc = new jsPDF();

    // Set Report Title & Dairy Info
    doc.setFontSize(14);
    doc.text(dairyname, 14, 10); // Dairy Name
    doc.text(CityName, 14, 18); // City Name

    doc.setFontSize(16);
    doc.text("Stock Report", 80, 28); // Report Title (centered)

    doc.setFontSize(12);
    doc.text(`From: ${fromdate}   To: ${todate}`, 14, 36); // Date Range

    // Table Headers
    const tableColumn = [
      "Date",
      "Item Name",
      "Purchase Qty",
      "Sale Qty",
      "Remaining Stock",
    ];

    // Filter & Group Data by Date (Only Available Data)
    const groupedData = stockData.reduce((acc, item) => {
      if (!item.date || !item.itemname) return acc; // Skip if data is incomplete

      if (!acc[item.date]) {
        acc[item.date] = {
          items: [],
          totalPurchaseQty: 0,
          totalSaleQty: 0,
          totalRemainingStock: 0,
        };
      }

      acc[item.date].items.push(item);
      acc[item.date].totalPurchaseQty += item.purchaseQty || 0;
      acc[item.date].totalSaleQty += item.saleQty || 0;
      acc[item.date].totalRemainingStock += item.remainingStock || 0;

      return acc;
    }, {});

    let startY = 45;

    // Loop through grouped data and add date-wise stock details
    Object.entries(groupedData).forEach(([date, data]) => {
      if (data.items.length === 0) return; // Skip empty date entries

      // Add Date Header
      doc.setFontSize(12);
      doc.text(`Date: ${date}`, 14, startY);
      startY += 6; // Move cursor down

      // Generate Table for that date
      const tableRows = data.items.map((item) => [
        item.date,
        item.itemname,
        item.purchaseQty || 0,
        item.saleQty || 0,
        item.remainingStock || 0,
      ]);

      doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: startY,
        theme: "grid",
      });

      // Get last position after table
      startY = doc.lastAutoTable.finalY + 5;

      // Display Total Row for this Date
      doc.setFontSize(12);
      doc.text("Total", 14, startY);
      doc.text(`${data.totalPurchaseQty}`, 120, startY);
      doc.text(`${data.totalSaleQty}`, 150, startY);
      doc.text(`${data.totalRemainingStock}`, 180, startY);

      startY += 10; // Move cursor down for the next date
    });

    // Save PDF
    doc.save("Stock_Report.pdf");
  };

  //.... 15 days pdf  ----------------------------------------------->
  const StockSummaryReportPDF = () => {
    const stockData = calculateQRemainingStock(sales, saledata);
    const doc = new jsPDF();

    // Set Report Title & Dairy Info
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text(dairyname, 105, 15, { align: "center" }); // Dairy Name
    doc.setFontSize(12);
    doc.text(CityName, 105, 22, { align: "center" }); // City Name

    doc.setFontSize(14);
    doc.text("Stock Report", 105, 30, { align: "center" }); // Centered Report Title

    doc.setFontSize(12);
    doc.text(`From: ${fromdate}   To: ${todate}`, 14, 40); // Date Range

    // Define Table Columns
    const tableColumn = [
      "Date",
      "Item Name",
      "Purchase Qty",
      "Sale Qty",
      "Remaining Stock",
    ];

    // Group Data by Date (Separating 1st-15th and 16th-End)
    const groupedData = { firstHalf: {}, secondHalf: {} };

    stockData.forEach((item) => {
      if (!item.date || !item.itemname) return; // Skip incomplete data

      const day = parseInt(item.date.split("-")[2]); // Extract day from YYYY-MM-DD
      const targetGroup =
        day <= 15 ? groupedData.firstHalf : groupedData.secondHalf;

      if (!targetGroup[item.date]) {
        targetGroup[item.date] = {
          items: [],
          totalPurchaseQty: 0,
          totalSaleQty: 0,
          totalRemainingStock: 0,
        };
      }

      targetGroup[item.date].items.push(item);
      targetGroup[item.date].totalPurchaseQty += item.purchaseQty || 0;
      targetGroup[item.date].totalSaleQty += item.saleQty || 0;
      targetGroup[item.date].totalRemainingStock += item.remainingStock || 0;
    });

    let startY = 50;

    // Function to Generate Report for a Specific Half (1st-15th or 16th-End)
    const generateSection = (title, data) => {
      if (startY > 250) {
        doc.addPage();
        startY = 20;
      }

      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);
      doc.text(title, 14, startY);
      startY += 8;

      let sectionTotal = { purchaseQty: 0, saleQty: 0, remainingStock: 0 };
      const tableBody = [];

      Object.entries(data).forEach(([date, details]) => {
        if (details.items.length === 0) return;

        details.items.forEach((item) => {
          tableBody.push([
            item.date,
            item.itemname,
            item.purchaseQty || 0,
            item.saleQty || 0,
            item.remainingStock || 0,
          ]);
        });

        // Accumulate totals for the whole section
        sectionTotal.purchaseQty += details.totalPurchaseQty;
        sectionTotal.saleQty += details.totalSaleQty;
        sectionTotal.remainingStock += details.totalRemainingStock;
      });

      // Generate Table for the Section
      doc.autoTable({
        head: [tableColumn],
        body: tableBody,
        startY: startY,
        theme: "grid",
        styles: { fontSize: 10, cellPadding: 2 },
        headStyles: {
          fillColor: [41, 128, 185],
          textColor: 255,
          fontStyle: "bold",
        },
        foot: [
          [
            "",
            "Total",
            sectionTotal.purchaseQty,
            sectionTotal.saleQty,
            sectionTotal.remainingStock,
          ],
        ], // Footer row for totals
        footStyles: {
          fillColor: [52, 73, 94],
          textColor: 255,
          fontStyle: "bold",
        },
      });

      startY = doc.lastAutoTable.finalY + 10; // Move cursor below the table
    };

    // Generate 1st to 15th Section
    generateSection("Stock Report (1st to 15th)", groupedData.firstHalf);

    startY += 10; // Space before next section

    // Generate 16th to End Section
    generateSection(
      "Stock Report (16th to End of Month)",
      groupedData.secondHalf
    );

    // Save PDF
    doc.save("Stock_Report.pdf");
  };

  ///..........  Distrubuted sale  Report ------------------------------------->

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4040/smartdairy/api/item/all"
        );
        if (response.data) {
          SetItem(response.data.itemsData);
          groupItemssByCode(response.data.itemsData);
        }
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    };

    fetchItems();
  }, []);

  // Function to group items by itemcode---------------------------------------------------->
  const groupItemssByCode = (itemsData) => {
    const grouped = itemsData.reduce((acc, item) => {
      if (!acc[item.itemcode]) {
        acc[item.itemcode] = [];
      }
      acc[item.itemcode].push(item);
      return acc;
    }, {});
    setGroupedItems(grouped);
  };

  const handleGenerateReport = () => {
    console.log(
      "Item Code:",
      selectedItemCode,
      "From:",
      fromdate,
      "To:",
      toDate
    );
    // Add report generation logic here
  };

  return (
    <div className=" enventory-container w100 h1 d-flex-col  ">
      <span className="heading"> Inventory Report</span>

      <div className="enventory-container-repots d-flex w100 h1 ">
        <div className="enventory-reports-first-half-part w60   bg h1 d-flex-col ">
          <div className="radio-buttons-for-cattlefeed w100 h10 d-flex bg2">
            {Object.entries(itemGroupMapping).map(([key, label]) => (
              <div
                key={key}
                className="pashukhandya-radio-button w20 h1 d-flex a-center"
              >
                <input
                  className="w30"
                  type="radio"
                  name="itemGroup"
                  value={key}
                  checked={selectedGroup === key}
                  onChange={() => setSelectedGroup(key)}
                />
                <span className="w30 info-text">{label}</span>
              </div>
            ))}
          </div>

          <div className="register-sale-and-purches-div w100 h30 d-flex p10">
            <div className="salea-register-div d-flex-col w50 h1">
              <div className="   Purches Register-sale-register-div w50 h1  d-flex ">
                <span onClick={generatePDF} className="heading  info-text">
                  Purches Register
                </span>
                {/* <button className="btn my10" onClick={printReport}>
                  Print
                </button> */}
              </div>
              <div className="  Disturbed-Purches-sale-register-div w80 h1 d-flex ">
                <span onClick={DisturbedPurches} className="heading info-text">
                  {" "}
                  Disturbed Purches
                </span>
                <button className="btn  " onClick={DisturbedPurchesprintReport}>
                  {" "}
                  Print{" "}
                </button>
              </div>
              <div className="  Disturbed-Purches-sale-register-div w80 h1 d-flex ">
                <span
                  onClick={generateDealerNamePDF}
                  className="heading info-text"
                >
                  {" "}
                  DealerName Wise
                </span>
                <button className="btn" onClick={printDealerwiseReport}>
                  {" "}
                  print{" "}
                </button>
              </div>

              <div className="periodwise-purched w80 h1 d-flex ">
                <span
                  onClick={generatePeroidwisePDF}
                  className="heading info-text"
                >
                  periodwise purched
                </span>
                <button className="btn" onClick={printPeroidReport}>
                  Print
                </button>
              </div>
              {/* <div className="sale-register-div w80 h1 d-flex">
                {/* Clickable text to open popup
                <span
                  className="heading info-text"
                  onClick={openPopup}
                  style={{ cursor: "pointer" }}
                >
                  Goodswise Purchase
                </span>

                {/* Popup Modal */}
              {isPopupOpen && (
                <div className="popup-overlay">
                  <div className="popup-content">
                    <span className="close-btn" onClick={closePopup}>
                      &times;
                    </span>
                    <span className="info-text">Goodswise Purchase</span>

                    {/* Radio buttons */}
                    <label>
                      <input
                        type="radio"
                        name="purchaseType"
                        value="All"
                        checked={purchaseType === "All"}
                        onChange={handleRadioChange}
                      />
                      All
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="purchaseType"
                        value="Particular"
                        checked={purchaseType === "Particular"}
                        onChange={handleRadioChange}
                      />
                      Particular
                    </label>

                    {/* Show extra fields if 'Particular' is selected */}
                    {purchaseType === "Particular" && (
                      <div id="particularFields">
                        <input
                          className="data w30"
                          type="text"
                          value={specificDetails}
                          onChange={(e) => setSpecificDetails(e.target.value)}
                          placeholder=""
                        />
                        <select
                          className="data"
                          value={dropdownValue}
                          onChange={(e) => setDropdownValue(e.target.value)}
                        >
                          <option value="">Select Option</option>
                          <option value="option1">Option 1</option>
                          <option value="option2">Option 2</option>
                        </select>
                      </div>
                    )}

                    {/* Show and Close Buttons */}
                    <div className="button-goodwise-div d-flex sa my10">
                      <button className="btn" onClick={handleShowClick}>
                        Show
                      </button>
                      <button className="btn" onClick={closePopup}>
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              )}
              {/* </div> */}
            </div>

            <div className="salea-register-div d-flex-col w50 h1 ">
              <div className="sale-register-div w50 h1 d-flex ">
                <span
                  onClick={generateSalesReport}
                  className="heading info-text"
                >
                  Sale Register
                </span>
              </div>
              <div className="sale-register-div w80 h1 d-flex ">
                <span
                  onClick={generateDisturbedSalesReport}
                  className="heading info-text"
                >
                  Disturbed Register list
                </span>
              </div>
              {/* <div className="sale-register-div w80 h1 d-flex ">
                <span className="heading info-text">
                  Disturbed sale Register
                </span>
              </div> */}
              {/* <div className="sale-register-container w80 a-center d-flex h1">
                {/* Clickable Text */}
              {/* <div
                  className="sale-register-div d-flex-col"
                  onClick={() => setShowPpopup(true)}
                >
                  <span className="heading info-text">
                    Disturbed Sale Register
                  </span>
                </div> */}

              {/* Popup Modal */}
              {showPpopup && (
                <div className="popup-overlay  w50 h50 a-center  d-flex-col ">
                  <div className="popup d-flex-col ">
                    <h3>Select Filters</h3>

                    {/* Filter Fields */}
                    <div className="filter-container d-flex w100 ">
                      {/* Item Code Dropdown */}
                      <div className="item-name-code-div d-flex">
                        <div className="select-item d-flex">
                          <label className="info-text">Item Code:</label>
                          <select
                            value={selectedItemCode}
                            onChange={(e) =>
                              setSelectedItemCode(e.target.value)
                            }
                          >
                            <option value="">Select Item Code</option>
                            {Object.keys(groupedItems).map((code) => (
                              <option key={code} value={code}>
                                {code}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Item Name Dropdown (Filtered by Selected Item Code) */}
                        {selectedItemCode && (
                          <div className="itemname d-flex">
                            <label>Item Name:</label>
                            <select>
                              <option value="">Select Item</option>
                              {groupedItems[selectedItemCode].map((item) => (
                                <option key={item.id} value={item.id}>
                                  {item.itemname}
                                </option>
                              ))}
                            </select>
                          </div>
                        )}
                      </div>
                      {/* Date Fields */}

                      <div className="from-to-div-conatainer-section d-flex a-center">
                        <div className="from-to-date-div d-flex ">
                          <label>From Date:</label>
                          <input
                            type="date"
                            value={fromdate}
                            onChange={(e) => setFromDate(e.target.value)}
                          />
                        </div>

                        <div className="d-flex ">
                          <label>To Date:</label>
                          <input
                            type="date"
                            value={todate}
                            onChange={(e) => setToDate(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Buttons */}
                    <div className="button-group">
                      <button onClick={handleGenerateReport}>Report</button>
                      <button onClick={() => setShowPpopup(false)}>Exit</button>
                    </div>
                  </div>
                </div>
              )}
              {/* </div>  */}

              {/* <div className="sale-register-div w50 h1 d-flex ">
                <span className="heading info-text">Loss Register</span>
              </div>
              <div className="sale-register-div w90 h1 d-flex ">
                <span className="heading info-text">
                  Back Goods(Manufacture){" "}
                </span>
              </div>
              <div className="sale-register-div w90 h1 d-flex ">
                <span className="heading info-text">Back Goods (Delar )</span>
              </div> */}
            </div>
          </div>
          <div className="span-input-yapari-mandal-conatainer w100 d-flex-col h40  ">
            <div className="span-input-yapari-mandal-div w100 d-flex-col h40  ">
              <div className="businessman-repoer-div w100 h20 d-flex a-center">
                <div className="filter-code-div w40 d-flex a-center">
                  <span className="w30 heading info-text">Code: </span>
                  <input
                    className="w30 data"
                    type="text"
                    value={dealerCode}
                    onChange={handleDealerCodeChange}
                    placeholder="Code"
                  />
                </div>
                <div className="filter-name-wise-div a-center d-flex w50 a-center">
                  <span className="w10 heading info-text"> Name: </span>
                  <input
                    className="w70 data"
                    type="text"
                    value={dealerName}
                    onChange={handleDealerNameChange}
                    placeholder=" Name"
                  />
                </div>
                <div className="button-for-pdf d-flex a-center  w20">
                  <button
                    className="info-text heading btn"
                    onClick={DealergeneratePDF}
                    style={{
                      cursor: "pointer",
                      color: "blue",
                      textDecoration: "underline",
                    }}
                  >
                    PDF
                  </button>
                </div>
              </div>
            </div>
            {/* <div className="businessman-repoer-div w100 h20  d-flex a-center ">
              <span className="w20 info-text heading"> Customer: </span>
              <input className="w20 data" type="text" />
              <select className=" inputtag data w30" name="" id=""></select>
              <span className="w40 heading  info-text">Delar Purches</span>
            </div> */}
            {/* <div className="businessman-repoer-div w100 h25 d-flex a-center">
              <span className="w20 info-text heading">Item code: </span>
              <input
                className="w20 data"
                type="text"
                value={selectedGroup}
                onChange={handleInputChange}
                placeholder="Enter ItemGroupCode"
              />

              <select
                className="data"
                name="itemDropdown"
                id="ede"
                onChange={handleSelectChange}
              >
                <option value="">Select Item</option>
                {filteredItems.length > 0 ? (
                  filteredItems.map((item) => (
                    <option
                      name="itemDropdown"
                      key={item.ItemCode}
                      value={item.ItemCode}
                    >
                      {item.ItemName}
                    </option>
                  ))
                ) : (
                  <option disabled>No Items Found</option>
                )}
              </select>

              <button className="btn btn-primary" onClick={generateitemwisePDF}>
                {" "}
                Generate PDF
              </button>
            </div> */}
            <div className="goodswise-reports-div w100 h25 d-flex a-center">
              {/* <div className="all-goods-div d-flex-col w50 h1">
                <div className="goodswise-avak-javak-div w100 h50 d-flex">
                  <span className="heading info-text">
                    1. GoodsWise Bying Saleing
                  </span>
                </div>
                <div className="goodswise-avak-javak-div w100 h50 d-flex">
                  <span onClick={StockReportPDF} className="heading info-text">
                    2. Stock Register
                  </span>
                </div>
              </div> */}
              <div className="all-goods-div d-flex-col w50 h1">
                <div className="goodswise-avak-javak-div w100 h50 d-flex">
                  <span onClick={StockReportPDF} className="heading info-text">
                    1. Stock Register
                  </span>
                </div>
                <div className="15days-avak-javak-div w100 h50 d-flex">
                  <span
                    onClick={StockSummaryReportPDF}
                    className="heading info-text info-text"
                  >
                    2. 15 Dayes Stock Summary
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* <div className="end-half-radio-buttons w100 d-flex-col h20 ">
            <div className="date-radio-button-div w100 d-flex h50">
              <div className="datess-div w40 h1 d-flex a-center ">
                <span className="w20 info-text">Date :</span>
                <input className="data" type="date" />
              </div>
              <div className="datessradio-div w30 h1 d-flex a-center p10">
                <input className="data w20" type="radio" />
                <span className="w60 info-text"> Sale Ratewise </span>
              </div>
              <div className="datessradio-div w30 h1 d-flex a-center p10">
                <input className="data w20" type="radio" />
                <span className="w60 info-text">Bay Rate wise</span>
              </div>
            </div>
            <div className="starting-goods-goods-storage-div w100 h50 d-flex">
              <div className="starting-ggods-div w50 h1  d-flex ">
                <span className="heading info-text">Intial Stoarge</span>
              </div>
              <div className="starting-ggods-div w50 h1  d-flex ">
                <span className="heading info-text"> Stock Storage</span>
              </div>
            </div>
          </div> */}
        </div>
        <div className="second-half-div w40 h1 d-flex-col bg">
          <div className="fromto-date-sale-report w100 h10 bg2  d-flex ">
            <div className="from-sale-div w60 h1 a-center  p10">
              <span className=" w20 info-text p10">From:</span>
              <input
                className="w60 data"
                type="date"
                value={fromdate}
                onChange={(e) => setFromDate(e.target.value)}
              />
            </div>
            <div className="from-sale-div w60 h1 a-center  p10">
              <span className=" w20 info-text p10">To:</span>
              <input
                className="w60 data"
                type="date"
                value={todate}
                onChange={(e) => setToDate(e.target.value)}
              />
            </div>
          </div>
          <div className="salewise-and-customewise w100 h90 d-flex">
            <div className="other-customer-saling-report w100 h1 d-flex-col">
              <div className="span-input-summary-report-register-report d-flex h10 w100 ">
                <span
                  onClick={generateCustomersalingReport}
                  className="heading info-text"
                >
                  Customer Saleing Balance
                </span>
              </div>
              <div className="span-input-summary-report-register-report d-flex h10 w100 ">
                <span
                  onClick={generatefeedqtmReport}
                  className="heading info-text"
                >
                  Customer Saleing Qtm Report
                </span>
              </div>
              <div className="span-input-summary-report-register-report d-flex h10 w100 ">
                <span
                  onClick={generateStockReportPDF}
                  className="heading info-text"
                >
                  All Stock Summary
                </span>
              </div>
              <div className="span-input-summary-report-register-report d-flex h10 w100 ">
                <span
                  onClick={generateCattleStockReportPDF}
                  className="heading info-text"
                >
                  Feed Stock Summary
                </span>
              </div>
              <div className="span-input-summary-report-register-report d-flex h10 w100 ">
                <span
                  onClick={generateGrocaryStockReportPDF}
                  className="heading info-text"
                >
                  Grocary Stock Summary
                </span>
              </div>
              <div className="span-input-summary-report-register-report d-flex h10 w100 ">
                <span
                  onClick={generateMedicineStockReportPDF}
                  className="heading info-text"
                >
                  Medicine Stock Summary
                </span>
              </div>
              <div className="span-input-summary-report-register-report d-flex h10 w100 ">
                <span
                  onClick={generateDairyGoodsStockReportPDF}
                  className="heading info-text"
                >
                  Goods Saleing Balance
                </span>
              </div>
              <div className="span-input-summary-report-register-report d-flex h10 w100 ">
                <span className="heading info-text">
                  Baying-Saleing Profit Summary
                </span>
              </div>
              <div className="span-input-summary-report-register-report d-flex h10 w100 ">
                <span className="heading info-text">Goods List Typewise</span>
              </div>
              <div className="span-input-summary-report-register-report d-flex h10 w100 ">
                <span className="heading info-text">Saleing Summary</span>
              </div>
              <div className="span-input-summary-report-register-report d-flex h10 w100 ">
                <span className="heading info-text">Purches Summary</span>
              </div>
              <div className="rootwise-saleing-div w100 h20">
                <span
                  onClick={generatyearkReportPDF}
                  className="w100 heading info-text"
                >
                  Year Stock Goods Register
                </span>
              </div>
              <div className="rootwise-saleing-div w100 h20">
                <span className="w100 heading info-text">
                  Monthwise Saleing Summary
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Accounts;
