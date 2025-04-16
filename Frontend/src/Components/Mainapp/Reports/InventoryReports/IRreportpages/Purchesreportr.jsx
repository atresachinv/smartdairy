import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import jsPDF from "jspdf";
import "jspdf-autotable";
import "../../../../../Styles/InventoryReports/Purchesreport.css";
import axiosInstance from "../../../../../App/axiosInstance";
import { toast } from "react-toastify";

const Purchesreportr = () => {
  const [fromdate, setFromDate] = useState("");
  const [todate, setToDate] = useState("");
  const [sales, SetSales] = useState([]); //... Purches data
  const [showTable, setShowTable] = useState(false);
  const [dealerCode, setDealerCode] = useState("");
  const [selectedDealer, setSelectedDealer] = useState("");
  const [dealerName, setDealerName] = useState("");
  const [dealer, SetDealer] = useState([]); //....    delare Name data
  const [allSales, setAllSales] = useState([]); // Store all data initially
  const [filteredSales, setFilteredSales] = useState([]); // Store filtered data
  const [selectedReport, setSelectedReport] = useState("");
  const [columns, setColumns] = useState([]);
  const [isClearEnabled, setIsClearEnabled] = useState(false);
  const toDates = useRef(null);
  const [isChecked, setIsChecked] = useState(false);

  const dairyname = useSelector(
    (state) =>
      state.dairy.dairyData.SocietyName || state.dairy.dairyData.center_name
  );
  const CityName = useSelector((state) => state.dairy.dairyData.city);

  // ......  purches APi Calling
  // useEffect(() => {
  //   const fetchData = async () => {
  //     if (!fromdate || !todate) {
  //       return;
  //     }
  //     try {
  //  const response = await axiosInstance.get("/stock/purchase/all", {
  //    params: { fromdate, todate },
  //  });

  //       SetSales(response.data.purchaseData);
  //       setShowTable(true); // Show table after fetching data
  //     } catch (error) {
  //       console.error(
  //         "Error Handling:",
  //         error.response ? error.response.data : error.message
  //       );
  //     }
  //   };

  //   fetchData();
  // }, [fromdate, todate]); // Run useEffect when fromDate or toDate changes

  useEffect(() => {
    console.log("fromdate:", fromdate, "todate:", todate); // Check their values
    const fetchData = async () => {
      if (!fromdate || !todate) {
        return;
      }
      try {
        const response = await axiosInstance.get("/stock/purchase/all", {
          params: { fromdate, todate },
        });
        console.log("Response:", response); // Check what the API returns
        SetSales(response.data.purchaseData);
        setShowTable(true); // Show table after fetching data
      } catch (error) {
        console.error(
          "Error Handling:",
          error.response ? error.response.data : error.message
        );
      }
    };

    fetchData();
  }, [fromdate, todate]); // Run useEffect when fromDate or toDate changes

  console.log("Sales", sales);
  //---------------------------DealerWise Report --------------------------------------->>
  useEffect(() => {
    const fetchData = async () => {
      try {
        const responce = await axiosInstance.post("/dealer");
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

  //... Dealer Pdf
  useEffect(() => {
    const fetchAllData = async () => {
      // Only fetch data if both fromdate and todate are available
      if (fromdate && todate) {
        try {
          const response = await axiosInstance.get("/stock/purchase/all", {
            params: { fromdate, todate },
          });
          setAllSales(response.data.purchaseData);
        } catch (error) {
          toast.error("Failed to fetch purchase data.");
        }
      }
    };

    fetchAllData();
  }, [fromdate, todate]);

  // Chatgpt
  // useEffect(() => {
  //   const fetchAllData = async () => {
  //     if (!fromdate || !todate) {
  //       console.warn("Missing fromdate or todate");
  //       return;
  //     }

  //     try {
  //       console.log("Fetching data from:", fromdate, "to:", todate);

  //       const response = await axiosInstance.get("/stock/purchase/all", {
  //         params: { fromdate, todate },
  //       });

  //       console.log("Fetched data:", response.data);

  //       if (response.data && response.data.purchaseData) {
  //         setAllSales(response.data.purchaseData);
  //       } else {
  //         toast.warning("No data received.");
  //         setAllSales([]);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //       toast.error("Failed to fetch purchase data.");
  //     }
  //   };

  //   fetchAllData();
  // }, [fromdate, todate]);

  //... handle report change

  const handleReportChange = (event) => {
    const selectedType = event.target.value;
    setSelectedReport(selectedType);

    let filteredData = [];
    if (selectedType === "Purches Register") {
      filteredData = allSales;
    } else if (selectedType === "Distrubuted Purches") {
      filteredData = allSales.filter(
        (sale) => sale.soldqty > 0 && sale.soldqty < sale.qty
      );
    } else if (selectedType === "Dealername Wise") {
      // 'dealerName' वरून विक्री अल्फाबेटिकल क्रमाने सॉर्ट करा
      filteredData = [...allSales].sort((a, b) =>
        (a.dealerName || "").localeCompare(b.dealerName || "")
      );
    } else if (selectedType === "Peroid Wise") {
      filteredData = [...allSales].sort(
        (a, b) => new Date(a.purchasedate) - new Date(b.purchasedate)
      );
    }

    setFilteredSales(filteredData);
    setColumns(reportColumns[selectedType] || []);
  };
  //.... Handle Print and cleare

  const handleClear = () => {
    console.log("Clear button clicked"); // Debugging log
    setSelectedReport(""); // Reset report selection
    setFilteredSales([]); // Clear sales data
    setShowTable(false); // Hide the table
    setIsClearEnabled(false); // Disable the Clear button
  };

  ///....
  // handle enter press move cursor to next refrence Input -------------------------------->
  const handleKeyDown = (e, nextRef) => {
    if (e.key === "Enter" && nextRef.current) {
      e.preventDefault();
      nextRef.current.focus();
    }
  };

  //.. Purches Register
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
      item.receiptno,
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
      const billNo = (item.receiptno || "").toString().padEnd(10, " ");
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
  //..   //.. Print Distrubuted purches
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
      const billNo = (item.receiptno || "").toString().padEnd(6, " ");
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
      item.receiptno || "N/A",
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
    doc.save(" Distrubuted_Purchase_Report.pdf");
  };
  //.. Print Distrubuted purches

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

  const printPeriodwiseReport = () => {
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
    const city = CityName || "City Name";
    const reportName = "Purchase Report";
    const reportFromDate = fromdate || "N/A";
    const reportToDate = todate || "N/A";

    // Header
    let receiptContent = `
    <div style="text-align: center; font-size: 10px; font-family: monospace;">
      <strong>${dairyName}</strong><br/>
      City: ${city}<br/>
      ${reportName}<br/>
      From: ${reportFromDate}  To: ${reportToDate}<br/>
      --------------------------------
    </div>
    <pre style="font-size: 8px; font-family: monospace;">
ITEM NAME       QTY    SALE RATE    AMOUNT
--------------------------------`;

    // Populate Table Data
    sales.forEach((item) => {
      const itemName = (item.itemname || "N/A")
        .substring(0, 12)
        .padEnd(12, " ");
      const qty = (item.qty || 0).toString().padStart(4, " ");
      const saleRate = item.salerate
        ? item.salerate.toFixed(2).padStart(8, " ")
        : "0.00";
      const amount = item.amount
        ? item.amount.toFixed(2).padStart(8, " ")
        : "0.00";

      receiptContent += `\n${itemName}  ${qty}   ${saleRate}   ${amount}`;
    });

    // Calculate Total Amount
    const totalAmount = sales.reduce(
      (sum, item) => sum + (item.amount || 0),
      0
    );
    receiptContent += `
--------------------------------
Total Amount:        ${totalAmount.toFixed(2)}
--------------------------------
  </pre>`;

    // Print Window Content
    printWindow.document.write(`
    <html>
      <head>
        <title>Print Report</title>
        <style>
          body { font-family: monospace; width: 58mm; text-align: center; margin: 0; padding: 0; }
          pre { white-space: pre-wrap; font-size: 8px; text-align: left; }
          hr { border-top: 1px dashed black; margin: 5px 0; }
        </style>
      </head>
      <body onload="window.print(); window.close();">
        ${receiptContent}
      </body>
    </html>
  `);

    printWindow.document.close();
  };

  //... Dealer Pdf

  const generateDealerrPDF = () => {
    const doc = new jsPDF();

    // Define header details
    const dairyName = dairyname; // Ensure dairyname is defined in your component state or props
    const cityName = CityName; // Ensure CityName is defined in your component state or props
    const reportTitle = "Supplierwise Purchase Report";
    const fromDate = fromdate; // Example start date
    const toDate = todate; // Example end date

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
          sale.receiptno,
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

  const printDealerwiseReport = (data) => {
    if (!sales || sales.length === 0) {
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
    sales.forEach((item) => {
      const date = item.purchasedate ? item.purchasedate.slice(2, 10) : "N/A";
      const dealer = (item.dealerName || "").substring(0, 6).padEnd(7, " ");
      const qty = (item.qty || 0).toString().padStart(3, " ");
      const rate = (item.rate || 0).toFixed(2).padStart(5, " ");
      const amount = (item.amount || 0).toFixed(2).padStart(6, " ");

      receiptContent += `\n${date}  ${dealer} ${qty} ${rate} ${amount}`;
    });

    // Total Amount
    const totalAmount = sales.reduce(
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

  // Dealer name wise
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
      item.receiptno || "N/A",
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
        return [
          row.itemname,
          row.qty,
          row.receiptno,
          row.rate,
          amount.toFixed(2),
        ];
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
  //......................pdfGenerators......................................>
  const pdfGenerators = {
    "Purches Register": generatePDF,
    "Distrubuted Purches": DisturbedPurches,
    "Dealername Wise": generateDealerrPDF,
    "Peroid Wise": generatePeroidwisePDF,
  };
  //----------------Pdf download object ----------------------->
  const handlePDFDownload = () => {
    if (selectedReport && pdfGenerators[selectedReport]) {
      pdfGenerators[selectedReport](); // Call the relevant PDF function
    } else {
      alert("Please select a valid report to generate a PDF.");
    }
  };

  // ///........  Print function
  const printGenerators = {
    "Purches Register": printReport,
    "Distrubuted Purches": DisturbedPurchesprintReport,
    "Dealername Wise": printDealerwiseReport,
    "Period wise": printPeriodwiseReport,
  };

  const handlePrintt = (e) => {
    e.preventDefault();
    console.log("Selected Report:", selectedReport); // Debugging log

    if (
      selectedReport &&
      typeof printGenerators[selectedReport] === "function"
    ) {
      printGenerators[selectedReport](); // Call the relevant print function
    } else {
      alert("Please select a valid report to print.");
    }
  };

  const reportColumns = {
    "Purches Register": [
      { header: "Purchase Date", accessor: "purchasedate" },
      { header: "Item Name", accessor: "itemname" },
      { header: "Dealer Name", accessor: "dealerName" },
      { header: "Quantity", accessor: "qty" },
      { header: "Bill No", accessor: "receiptno" },
      { header: "Rate", accessor: "rate" },

      { header: "Amount", accessor: "amount" },
    ],
    "Distrubuted Purches": [
      { header: "Dealer Code", accessor: "dealerCode" },
      { header: "Item Name", accessor: "itemname" },
      { header: "Qty", accessor: "qty" },
      { header: "Rate", accessor: "rate" },
      { header: "GST", accessor: "gst" },
      { header: "GST Amount", accessor: "gstamt" },
      { header: "SGST", accessor: "sgst" },
      { header: "SGST Amount", accessor: "sgstamt" },
      { header: "Discount Amount", accessor: "discamt" },
      { header: "Amount", accessor: "amount" },
    ],
    "Dealername Wise": [
      { header: "Dealer Name", accessor: "dealerName" },
      { header: "Bill No", accessor: "receiptno" },
      { header: "Date", accessor: "purchasedate" },
      { header: "Total Amount", accessor: "amount" },
    ],
    "Peroid Wise": [
      { header: "Date", accessor: "purchasedate" },
      { header: "Bill No", accessor: "receiptno" },
      { header: "Dealer Name", accessor: "dealerName" },
      { header: "Total Amount", accessor: "amount" },
    ],
  };

  //.... Filter checkbox  COde  ANd  Name

  const handleCheckboxChange = () => {
    setIsChecked((prevState) => !prevState); // Toggle checkbox state
  };

  const handleDealerCodeeChange = (e) => {
    setDealerCode(e.target.value);
  };

  const handleDealerNameeChange = (e) => {
    setDealerName(e.target.value);
  };

  return (
    <div className=" purches-report-container  w100 h1 d-flex-col bg ">
      <span className="heading">Purches Report</span>
      <div className="purches-report-section w100 h40   d-flex">
        <div className="reports-print-buttondiv w100 h1 d-flex-col">
          <div className="fromto-date-sale-report w100 h50 d-flex a-center ">
            <div className="from-to-date-purches-conta d-flex w50  h1">
              <div className="from-salee-div w60 h1 a-center d-flex  ">
                <span className=" w20 info-text ">From:</span>
                <input
                  className="w60 data"
                  type="date"
                  onKeyDown={(e) => handleKeyDown(e, toDates)}
                  value={fromdate}
                  onChange={(e) => setFromDate(e.target.value)}
                />
              </div>

              <div className="from-salee-div w60 h1 a-center d-flex  ">
                <span className=" w20 info-text ">To:</span>
                <input
                  className="w60 data"
                  type="date"
                  ref={toDates}
                  value={todate}
                  onChange={(e) => setToDate(e.target.value)}
                />
              </div>
            </div>
            <div className="purches-register-report w50 h60 d-flex a-center justify-between p-4 bg-gray-200 rounded-lg">
              <span className="w40 info-text">Purches Report:</span>
              <select
                className="data w40"
                value={selectedReport}
                onChange={handleReportChange}
              >
                <option value="">Select Report</option>
                <option value="Purches Register">Purches Register</option>
                <option value="Distrubuted Purches">
                  {" "}
                  Distributed Purches
                </option>
                <option value="Dealername Wise">Dealername Wise</option>
                <option value="Peroid Wise">Peroid Wise</option>
              </select>
            </div>
          </div>

          <div className="purches-report-container w100 h80 d-flex a-center">
            <div className="checkbox-for-a-filter-div w70 h40  d-flex a-center">
              {/* Checkbox for toggling the display */}
              <div className="item-name-code-checkbox w20 h1 d-flex">
                <input
                  className="w30 "
                  type="checkbox"
                  checked={isChecked}
                  onChange={handleCheckboxChange}
                />
                <span>CodeWise</span>
              </div>

              {/* Conditionally render the input fields if the checkbox is checked */}
              {isChecked && (
                <div className="codewise-filter-div d-flex a-center w60">
                  <div className="filter-code-div w40 d-flex a-center ">
                    <span className="w50 info-text">Code: </span>
                    <input
                      className="w60 data"
                      type="text"
                      value={dealerCode}
                      onChange={handleDealerCodeChange}
                      placeholder="Code"
                    />
                  </div>
                  <div className="filter-name-wise-div a-center d-flex w60 a-center sa">
                    <span className="w30 info-text"> Name: </span>
                    <input
                      className="w70 data"
                      type="text"
                      value={dealerName}
                      onChange={handleDealerNameChange}
                      placeholder=" Name"
                    />
                  </div>
                  <div className="button-for-pdf d-flex a-center h50 w20">
                    <button className="w-btn" onClick={DealergeneratePDF}>
                      PDF
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="purches-buttons-div w30 h60  d-flex sa">
              <button
                className="w-btn"
                onClick={handlePDFDownload}
                disabled={!showTable}
              >
                PDF
              </button>
              <button
                className="w-btn"
                type="button"
                onClick={handlePrintt}
                disabled={!showTable}
              >
                Print
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* <div className="container mx-auto p-4 h60 w100">
        {filteredSales.length > 0 && (
          <div className="table-container mt-4 overflow-y-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {columns.map((col) => (
                    <th
                      key={col.accessor}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {col.header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredSales.map((sale, index) => (
                  <tr key={index} className="hover:bg-gray-100">
                    {columns.map((col) => (
                      <td
                        key={col.accessor}
                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-700"
                      >
                        {col.accessor === "purchasedate"
                          ? sale[col.accessor]?.slice(0, 10) // Formats date
                          : sale[col.accessor]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-100 font-bold">
                <tr>
                  {columns.map((col, index) => (
                    <td
                      key={col.accessor}
                      className="px-6 py-4 text-sm text-gray-700"
                    >
                      {col.accessor === "quantity"
                        ? filteredSales.reduce(
                            (sum, sale) => sum + (sale.quantity || 0),
                            0
                          ) // Sum up all quantities
                        : col.accessor === "amount"
                        ? filteredSales.reduce(
                            (sum, sale) => sum + (sale.amount || 0),
                            0
                          ) // Sum up all amounts
                        : index === 0
                        ? "Total"
                        : ""}
                    </td>
                  ))}
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div> */}
      <div className="container mx-auto p-4 h60 w100">
        <div className="table-container mt-4 overflow-y-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {columns.map((col) => (
                  <th
                    key={col.accessor}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSales.length > 0 ? (
                filteredSales.map((sale, index) => (
                  <tr key={index} className="hover:bg-gray-100">
                    {columns.map((col) => (
                      <td
                        key={col.accessor}
                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-700"
                      >
                        {col.accessor === "purchasedate"
                          ? sale[col.accessor]?.slice(0, 10)
                          : sale[col.accessor]}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="text-center py-6 text-gray-500 text-lg"
                  >
                    Data not available
                  </td>
                </tr>
              )}
            </tbody>
            {filteredSales.length > 0 && (
              <tfoot className="bg-gray-100 font-bold">
                <tr>
                  {columns.map((col, index) => (
                    <td
                      key={col.accessor}
                      className="px-6 py-4 text-sm text-gray-700"
                    >
                      {col.accessor === "quantity"
                        ? filteredSales.reduce(
                            (sum, sale) => sum + (sale.quantity || 0),
                            0
                          )
                        : col.accessor === "amount"
                        ? filteredSales.reduce(
                            (sum, sale) => sum + (sale.amount || 0),
                            0
                          )
                        : index === 0
                        ? "Total"
                        : ""}
                    </td>
                  ))}
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>
    </div>
  );
};

export default Purchesreportr;
