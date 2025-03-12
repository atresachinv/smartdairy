import React, { useEffect, useState } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import axiosInstance from "../../../../../App/axiosInstance";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import "../../../../../Styles/InventoryReports/stockk.css";

const Stocksreport = () => {
  const [fromdate, setFromDate] = useState("");
  const [todate, setToDate] = useState("");
  const [sales, SetSales] = useState([]); // Purchase data
  const [saledata, SetSaleData] = useState([]); // Sale Data
  const [selectedStock, setSelectedStock] = useState(""); // Selected stock type
  const [allStockData, setAllStockData] = useState([]); // All stock data
  const [filteredStock, setFilteredStock] = useState([]); // Filtered stock based on selected stock type

  const dairyname = useSelector(
    (state) =>
      state.dairy.dairyData.SocietyName || state.dairy.dairyData.center_name
  );
  const CityName = useSelector((state) => state.dairy.dairyData.city);
  const itemGroupMapping = {
    1: "Cattle Feed",
    2: "Medicine",
    3: "Grocery",
    4: "Dairy Goods",
    all: "All Stock Report", // New entry for the combined report
  };

  // Fetch Purchase Data
  useEffect(() => {
    const fetchData = async () => {
      if (!fromdate || !todate) {
        return;
      }
      try {
        const response = await axiosInstance.get("/stock/purchase/all", {
          params: { fromdate, todate },
        });
        SetSales(response.data.purchaseData);
      } catch (error) {
        console.error("Error fetching purchase data:", error);
      }
    };
    fetchData();
  }, [fromdate, todate]);

  // Fetch Sale Data
  useEffect(() => {
    const salefetchData = async () => {
      if (!fromdate || !todate) {
        return;
      }
      try {
        const response = await axiosInstance.get("/stock/sale/all", {
          params: { fromdate, todate },
        });
        SetSaleData(response.data.salesData);
      } catch (error) {
        console.error("Error fetching sale data:", error);
      }
    };
    salefetchData();
  }, [fromdate, todate]);

  // Process the purchase and sale data to create all stock data
  useEffect(() => {
    const processedData = sales.map((purchase) => {
      const matchingSale = saledata.find(
        (sale) => sale.itemcode === purchase.itemcode
      );
      return {
        itemcode: purchase.itemcode,
        itemname: purchase.itemname,
        purchasedQty: purchase.qty,
        soldQty: matchingSale ? matchingSale.qty : 0,
        remainingquantity: purchase.qty - (matchingSale ? matchingSale.qty : 0),
        rate: purchase.rate,
        amount:
          (purchase.qty - (matchingSale ? matchingSale.qty : 0)) *
          purchase.rate,
        itemgroupcode: purchase.itemgroupcode,
      };
    });

    // If "All Stock Report" is selected, show all stock data combined
    if (selectedStock === "all") {
      setAllStockData(processedData); // Use the combined all stock data
      setFilteredStock([]); // Clear filtered stock when "All Stock Report" is selected
    } else if (selectedStock === "") {
      setAllStockData(processedData);
      setFilteredStock([]); // Clear filtered stock when "All Stock" is selected
    } else {
      // Filter data based on selected stock type (by itemgroupcode)
      const filteredData = processedData.filter(
        (item) => item.itemgroupcode === parseInt(selectedStock)
      );
      setFilteredStock(filteredData);
      setAllStockData([]); // Clear all stock data when specific stock type is selected
    }
  }, [selectedStock, sales, saledata]);

  // Handle stock type selection
  const handleStockChange = (event) => {
    const selectedStockType = event.target.value;
    setSelectedStock(selectedStockType);
  };

  // Generate PDF report
const generateStockReportPDF = () => {
  if (
    !dairyname ||
    !CityName ||
    (selectedStock !== "all" && filteredStock.length === 0) || // Ensure there's data for filtered stock
    (selectedStock === "all" && allStockData.length === 0) // Ensure there's data for all stock report
  )
    return;

  const doc = new jsPDF();

  // Set up the document font and header information
  doc.setFontSize(14);
  doc.text(dairyname, 14, 10); // Add dairy name at position (14, 10)
  doc.text(CityName, 14, 18); // Add city name at position (14, 18)

  doc.setFontSize(16);
  doc.text(`${itemGroupMapping[selectedStock] || "All Stock"} Report`, 60, 28);
  doc.setFontSize(12);
  doc.text(`From: ${fromdate} To: ${todate}`, 14, 36);

  // Define the columns for the table
  const columns = [
    { header: "Item Code", accessor: "itemcode" },
    { header: "Item Name", accessor: "itemname" },
    { header: "Purchased Qty", accessor: "purchasedQty" },
    { header: "Sold Qty", accessor: "soldQty" },
    { header: "Remaining Qty", accessor: "remainingquantity" },
    { header: "Rate", accessor: "rate" },
    { header: "Amount", accessor: "amount" },
  ];

  // Choose data for the table (all or filtered stock)
  const tableData = selectedStock === "all" ? allStockData : filteredStock;

  // Map the data to the table rows
  const tableRows = tableData.map((item) =>
    columns.map((col) => item[col.accessor])
  );

  // Calculate total for Purchased Qty, Sold Qty, Remaining Qty, and Amount
  const totalPurchasedQty = tableData.reduce(
    (sum, item) => sum + item.purchasedQty,
    0
  );
  const totalSoldQty = tableData.reduce((sum, item) => sum + item.soldQty, 0);
  const totalRemainingQty = tableData.reduce(
    (sum, item) => sum + item.remainingquantity,
    0
  );
  const totalAmount = tableData.reduce((sum, item) => sum + item.amount, 0);

  // Add the table to the PDF
  doc.autoTable({
    head: [columns.map((col) => col.header)],
    body: [
      ...tableRows,
      [
        "",
        "Total",
        totalPurchasedQty,
        totalSoldQty,
        totalRemainingQty,
        "",
        `₹ ${totalAmount.toFixed(2)}`,
      ],
    ],
    startY: 45,
  });

  // Save the PDF with a dynamic file name
  doc.save(
    `${itemGroupMapping[selectedStock] || "All Stock"}_Stock_Report.pdf`
  );
};




  // Print function
 const handlePrint = () => {
   // Check if we have the necessary data
   if (
     !dairyname ||
     !CityName ||
     (!selectedStock && allStockData.length === 0) ||
     (filteredStock.length === 0 && selectedStock !== "all")
   )
     return;

   // Create a print-friendly document content
   const printWindow = window.open("", "", "height=800,width=1000");

   // Select the data to print: use allStockData if "All Stock Report" is selected, otherwise use filteredStock
   const dataToPrint = selectedStock === "all" ? allStockData : filteredStock;

   // Calculate totals for Purchased Qty, Sold Qty, Remaining Qty
   const totalPurchasedQty = dataToPrint.reduce(
     (sum, item) => sum + item.purchasedQty,
     0
   );
   const totalSoldQty = dataToPrint.reduce(
     (sum, item) => sum + item.soldQty,
     0
   );
   const totalRemainingQty = dataToPrint.reduce(
     (sum, item) => sum + item.remainingquantity,
     0
   );
   const totalAmount = dataToPrint.reduce((sum, item) => sum + item.amount, 0);

   const printContent = `
    <html>
      <head>
        <style>
          body {
            font-family: monospace; /* Changed to monospace for better alignment */
            font-size: 12px; /* Font size adjusted for clarity */
            line-height: 1.5;
            margin: 0;
            padding: 5px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
          }
          th, td {
            border: 1px solid #000;
            padding: 4px;  /* Adjusted padding for better fit */
            text-align: left;
            font-size: 12px;  /* Consistent font size for table */
          }
          th {
            background-color: #f2f2f2;
          }
          .report-header {
            text-align: center;
            font-size: 14px; /* Adjusted header font size for better visibility */
            margin-bottom: 10px;
          }
          .report-details {
            margin-bottom: 10px;
          }
          .total-amount {
            font-size: 14px;  /* Total amount font size adjusted for clarity */
            font-weight: bold;
            margin-top: 15px;
          }
          .receipt-container {
            width: 100%;
            max-width: 100mm; /* Adjusted width to fit more content */
          }
        </style>
      </head>
      <body>
        <div class="report-header">
          <h1>${dairyname}</h1>
          <h2>${CityName}</h2>
          <h3>${itemGroupMapping[selectedStock] || "All Stock Report"} </h3>
          <p>From: ${fromdate} To: ${todate}</p>
        </div>

        <div class="report-details">
          <table>
            <thead>
              <tr>
                <th>Item Code</th>
                <th>Item Name</th>
                <th>Purchased Qty</th>
                <th>Sold Qty</th>
                <th>Remaining Qty</th>
                <th>Rate</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              ${dataToPrint
                .map(
                  (item) => `
                    <tr>
                      <td>${item.itemcode}</td>
                      <td>${item.itemname}</td>
                      <td>${item.purchasedQty}</td>
                      <td>${item.soldQty}</td>
                      <td>${item.remainingquantity}</td>
                      <td>${item.rate}</td>
                      <td>${item.amount}</td>
                    </tr>`
                )
                .join("")}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="2" style="text-align:right; font-weight: bold;">Total</td>
                <td>${totalPurchasedQty}</td>
                <td>${totalSoldQty}</td>
                <td>${totalRemainingQty}</td>
                <td></td> <!-- Empty cell for the "Rate" column -->
                <td>₹ ${totalAmount.toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </body>
    </html>`;

   // Write the content to the print window
   printWindow.document.write(printContent);
   printWindow.document.close();
   printWindow.print();
 };



  return (
    <div className="Stocks-reports-container w100 h1 d-flex-col bg">
      <span className="heading">Stock Report</span>
      <div className="first-half-span-input-div w100 h25 d-flex">
        <div className="stocks-from-todate-reports-div d-flex-col w100 h60">
          <div className="fromto-date-Stock-report w50 h70 d-flex">
            <div className="fromdate-sale-stock-div w100 h1 d-flex a-center">
              <span className="w20 info-text p30">From:</span>
              <input
                className="w70 data"
                type="date"
                value={fromdate}
                onChange={(e) => setFromDate(e.target.value)}
              />
            </div>
            <div className="to-date-sale-stock-div w100 h1 a-center d-flex">
              <span className="w20 info-text p30">To:</span>
              <input
                className="w70 data"
                type="date"
                value={todate}
                onChange={(e) => setToDate(e.target.value)}
              />
            </div>
          </div>
          <div className="select-report-div w100 h90 d-flex a-center">
            <div className="stocks-report-selact-div d-flex a-center p10 w50 ">
              <span className="info-text w30">Select Report:</span>
              <select className="w60 data" onChange={handleStockChange}>
                <option value="">Select Stock Type</option>
                <option value="1">Cattle Feed</option>
                <option value="3">Grocery</option>
                <option value="2">Medicine</option>
                <option value="4">Dairy Goods</option>
                <option value="all">All Stock Report</option>{" "}
                {/* New option for all items */}
              </select>
            </div>
            <div className="stoks-button-div w50 h60 d-flex sa">
              <button onClick={generateStockReportPDF} className="btn">
                Generate PDF
              </button>
              <button onClick={handlePrint} className="btn">
                Print Report
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Table for displaying all or filtered stock */}
      <div className="Stock-table-container w100 h70 d-flex-col">
        <div className="table-wrapper w100 h1">
          <table className="stock-table w100 h90">
            <thead>
              <tr>
                <th>Item Code</th>
                <th>Item Name</th>
                <th>Purchased Qty</th>
                <th>Sold Qty</th>
                <th>Remaining Qty</th>
                <th>Rate</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {(selectedStock === "all" ? allStockData : filteredStock).map(
                (item, index) => (
                  <tr key={index}>
                    <td>{item.itemcode}</td>
                    <td>{item.itemname}</td>
                    <td>{item.purchasedQty}</td>
                    <td>{item.soldQty}</td>
                    <td>{item.remainingquantity}</td>
                    <td>{item.rate}</td>
                    <td>{item.amount}</td>
                  </tr>
                )
              )}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="2" style={{ textAlign: "right" }}>
                  Total
                </td>

                <td>
                  {(selectedStock === "all"
                    ? allStockData
                    : filteredStock
                  ).reduce((sum, item) => sum + item.purchasedQty, 0)}
                </td>
                <td>
                  {(selectedStock === "all"
                    ? allStockData
                    : filteredStock
                  ).reduce((sum, item) => sum + item.soldQty, 0)}
                </td>
                <td>
                  {(selectedStock === "all"
                    ? allStockData
                    : filteredStock
                  ).reduce((sum, item) => sum + item.remainingquantity, 0)}
                </td>
                <td></td>

                {/* No value for Rate in the footer */}
                <td>
                  ₹
                  {(selectedStock === "all" ? allStockData : filteredStock)
                    .reduce((sum, item) => sum + item.amount, 0)
                    .toFixed(2)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Stocksreport;
