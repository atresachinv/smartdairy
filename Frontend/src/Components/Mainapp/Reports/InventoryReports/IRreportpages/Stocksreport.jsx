import React, { useEffect, useState } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import axios, { all } from "axios";
import { useSelector } from "react-redux";
import "../../../../../Styles/InventoryReports/stockk.css";

const Stocksreport = () => {
  const [fromdate, setFromDate] = useState("");
  const [todate, setToDate] = useState("");
  const [sales, SetSales] = useState([]); //... Purches data
  const [purchaseData, SetPurchaseData] = useState([]);
  const [saledata, SetSaleData] = useState([]); //.. sale Data
  const [selectedStock, setSelectedStock] = useState([]); //..
  const [FilteredSales, setFilteredSales] = useState([]); //..

  const { customerlist, loading } = useSelector((state) => state.customer);
  const [dealer, SetDealer] = useState([]); //....    delare Name data
  const [selectedReport, setSelectedReport] = useState(""); // State for report selection
  const [filteredStock, setFilteredStock] = useState([]); // State to store stock data

  //..... Dairy name
  const dairyname = useSelector(
    (state) =>
      state.dairy.dairyData.SocietyName || state.dairy.dairyData.center_name
  );
  const CityName = useSelector((state) => state.dairy.dairyData.city);

  //...seprate item group code
  const itemGroupMapping = {
    1: "Cattle Feed",
    2: "Medicine",
    3: "Grocery",
    4: "Other",
  };

  //... Purches Data APi calling
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

  console.log(" purchess data ", sales);

  //...  Sales Report
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

  const calculateRemainingStock = () => {
    const stockMap = {};

    // Add purchased quantity
    sales.forEach((item) => {
      stockMap[item.itemcode] = {
        itemcode: item.itemcode,
        itemname: item.itemname,
        unit: item.unit,
        purchasedQty: item.qty,
        soldQty: 0,
        rate: item.rate,
        amount: item.amount,
      };
    });

    // Subtract sold quantity
    saledata.forEach((sale) => {
      if (stockMap[sale.itemcode]) {
        stockMap[sale.itemcode].soldQty += sale.qty;
      }
    });

    // Compute remaining quantity
    return Object.values(stockMap).map((item) => ({
      ...item,
      remainingquantity: item.purchasedQty - item.soldQty,
    }));
  };

  // Call this function when stock type changes
  useEffect(() => {
    if (selectedStock) {
      setFilteredSales(calculateRemainingStock());
    }
  }, [selectedStock, sales, saledata]);

  //..Filter Stocks

  useEffect(() => {
    const stockData = calculateRemainingStock(sales, saledata);
    console.log("Calculated stockData:", stockData);

    if (selectedReport) {
      console.log("Filtering for report (itemgroupcode):", selectedReport);
      const filtered = stockData.filter((item) => {
        console.log("Item group code:", item.itemgroupcode);
        // Assuming itemgroupcode is a string and should exactly match selectedReport.
        return item.itemgroupcode === selectedReport;
      });
      setFilteredStock(filtered);
    } else {
      setFilteredStock(stockData); // Show all stock if no filter is applied
    }
  }, [selectedReport, sales, saledata]);

  ///.........pdf show
  const handleGenerateStockReport = () => {
    let selectedStockData = [];
    let stockType = "";

    if (selectedStock === "Cattle Feed") {
      selectedStockData = sales.filter((item) => item.itemgroupcode === 1);
      stockType = "Cattle Feed";
    } else if (selectedStock === "Grocery") {
      selectedStockData = sales.filter((item) => item.itemgroupcode === 3);
      stockType = "Grocery";
    } else if (selectedStock === "Medicine") {
      selectedStockData = sales.filter((item) => item.itemgroupcode === 2);
      stockType = "Medicine";
    } else if (selectedStock === "Dairy Goods") {
      selectedStockData = sales.filter((item) => item.itemgroupcode === 4);
      stockType = "Dairy Goods";
    } else {
      // If "All Stock" is selected, include everything
      selectedStockData = sales;
      stockType = "All Stock";
    }

    generateStockReportPDF(stockType, selectedStockData);
  };

  ///.... Print SHow
  const handleGeneratePrintReport = () => {
    let selectedStockData = [];
    let stockType = "";

    // Handle different stock selections
    if (selectedStock === "Cattle Feed") {
      selectedStockData = sales.filter((item) => item.itemgroupcode === 1);
      stockType = "Cattle Feed";
    } else if (selectedStock === "Grocery") {
      selectedStockData = sales.filter((item) => item.itemgroupcode === 3);
      stockType = "Grocery";
    } else if (selectedStock === "Medicine") {
      selectedStockData = sales.filter((item) => item.itemgroupcode === 2);
      stockType = "Medicine";
    } else if (selectedStock === "Dairy Goods") {
      selectedStockData = sales.filter((item) => item.itemgroupcode === 4);
      stockType = "Dairy Goods";
    } else {
      // If "All Stock" is selected, include everything
      selectedStockData = sales;
      stockType = "All Stock";
    }

    if (!selectedStockData.length) {
      alert("No data available for the selected stock type.");
      return;
    }

    // Calculate totals
    const totalRemainingQty = selectedStockData.reduce(
      (sum, item) => sum + (item.RemainingStock || 0),
      0
    );
    const totalAmount = selectedStockData.reduce(
      (sum, item) => sum + (item.amount || 0),
      0
    );

    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
    <html>
      <head>
        <title>${stockType} Stock Report</title>
        <style>
          @page {
            size: 58mm auto;
            margin: 0;
          }
          body {
            font-family: Arial, sans-serif;
            font-size: 10px;
            width: 58mm;
            margin: 0;
            padding: 0;
          }
          .report-container {
            width: 100%;
            padding: 10px;
          }
          h2, h3 {
            text-align: center;
            margin: 0;
          }
          p {
            font-size: 9px;
            text-align: center;
            margin: 5px 0;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
            font-size: 8px;
          }
          th, td {
            border: 1px solid black;
            padding: 4px;
            text-align: center;
          }
        </style>
      </head>
      <body>
        <div class="report-container">
          <h2>${dairyname}</h2>
          <h3>${CityName}</h3>
          <h3>${stockType} Stock Report</h3>
          <p>From: ${fromdate} | To: ${todate}</p>
          <table>
            <thead>
              <tr>
                ${reportColumns[selectedStock]
                  .map((col) => `<th>${col.header}</th>`)
                  .join("")}
              </tr>
            </thead>
            <tbody>
              ${selectedStockData
                .map(
                  (row) => `
                <tr>
                  ${reportColumns[selectedStock]
                    .map((col) => `<td>${row[col.accessor] ?? "N/A"}</td>`)
                    .join("")}
                </tr>
              `
                )
                .join("")}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="${
                  reportColumns[selectedStock].length - 2
                }" style="text-align: right;">Total</td>
                <td>${totalRemainingQty}</td>
                <td>₹${totalAmount.toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
        <script>
          window.print();
          window.onafterprint = function() { window.close(); };
        </script>
      </body>
    </html>
  `);
    printWindow.document.close();
  };

 
  

  //... Report Table heading
  const reportColumns = {
    "All Stock Summary": [
      { header: "Item Code", accessor: "itemcode" },
      { header: "Item Name", accessor: "itemname" },
      { header: "Purchased Qty", accessor: "purchasedQty" },
      { header: "Sold Qty", accessor: "soldQty" },
      { header: "Remaining Qty", accessor: "remainingquantity" },
      { header: "Rate", accessor: "rate" },
      { header: "Amount", accessor: "amount" },
    ],
    "Cattle Feed": [
      { header: "Item Code", accessor: "itemcode" },
      { header: "Item Name", accessor: "itemname" },
      { header: "Remaining Qty", accessor: "remainingquantity" },
      { header: "Rate", accessor: "rate" },
      { header: "Amount", accessor: "amount" },
    ],
    Grocery: [
      { header: "Item Code", accessor: "itemcode" },
      { header: "Item Name", accessor: "itemname" },
      { header: "Remaining Qty", accessor: "remainingquantity" },
      { header: "Rate", accessor: "rate" },
      { header: "Amount", accessor: "amount" },
    ],
    Medicine: [
      { header: "Item Code", accessor: "itemcode" },
      { header: "Item Name", accessor: "itemname" },
      { header: "Remaining Qty", accessor: "remainingquantity" },
      { header: "Rate", accessor: "rate" },
      { header: "Amount", accessor: "amount" },
    ],
    "Dairy Goods": [
      { header: "Item Code", accessor: "itemcode" },
      { header: "Item Name", accessor: "itemname" },
      { header: "Remaining Qty", accessor: "remainingquantity" },
      { header: "Rate", accessor: "rate" },
      { header: "Amount", accessor: "amount" },
    ],
  };
const handleStockChange = (event) => {
  const selectedStockType = event.target.value;
  setSelectedStock(selectedStockType);

  let itemGroupCode = null;
  let stockType = "";

  if (selectedStockType === "Cattle Feed") {
    itemGroupCode = 1;
    stockType = "Cattle Feed";
  } else if (selectedStockType === "Grocery") {
    itemGroupCode = 3;
    stockType = "Grocery";
  } else if (selectedStockType === "Medicine") {
    itemGroupCode = 2;
    stockType = "Medicine";
  } else if (selectedStockType === "Dairy Goods") {
    itemGroupCode = 4;
    stockType = "Dairy Goods";
  }

  if (itemGroupCode === null) return;

  // Filter purchases and sales based on itemGroupCode
  const filteredPurchases = sales.filter(
    (item) => item.itemgroupcode === itemGroupCode
  );
  const filteredSales = saledata.filter(
    (item) => item.ItemGroupCode === itemGroupCode
  );

  // Map for grouping stock by ItemCode
  const stockMap = {};

  // Process purchases
  filteredPurchases.forEach((purchase) => {
    if (!stockMap[purchase.ItemCode]) {
      stockMap[purchase.ItemCode] = {
        ItemCode: purchase.ItemCode,
        ItemName: purchase.ItemName,
        Unit: purchase.Unit,
        PurchaseQty: 0,
        SaleQty: 0,
        Rate: purchase.Rate || 0, // Ensure rate is captured from purchases
        Amount: 0,
      };
    }
    stockMap[purchase.ItemCode].PurchaseQty += purchase.Quantity || 0;
  });

  // Process sales
  filteredSales.forEach((sale) => {
    if (!stockMap[sale.ItemCode]) {
      stockMap[sale.ItemCode] = {
        ItemCode: sale.ItemCode,
        ItemName: sale.ItemName,
        Unit: sale.Unit,
        PurchaseQty: 0,
        SaleQty: 0,
        Rate: 0, // Default rate if no purchase data
        Amount: 0,
      };
    }
    stockMap[sale.ItemCode].SaleQty += sale.Quantity || 0;
  });

  // Convert stockMap to array and calculate remaining stock & amount
  const groupedStock = Object.values(stockMap).map((stock) => ({
    ...stock,
    RemainingStock: stock.PurchaseQty - stock.SaleQty,
    Amount: (stock.PurchaseQty - stock.SaleQty) * stock.Rate, // Calculate amount
  }));

  setFilteredSales(groupedStock);
};


  // const handleStockChange = (event) => {
  //   const selectedStockType = event.target.value;
  //   setSelectedStock(selectedStockType);

  //   let stockType = "";
  //   let itemGroupCode = null;

  //   // Define stock type mapping
  //   const stockMapping = {
  //     "Cattle Feed": 1,
  //     "  Grocery": 3,
  //     Medicine: 2,
  //     "Dairy Goods": 4,
  //   };

  //   itemGroupCode = stockMapping[selectedStockType];

  //   if (itemGroupCode !== null) {
  //     // Filter purchase data
  //     const filteredPurchases = sales.filter(
  //       (item) => item.ItemgroupCode === itemGroupCode
  //     );

  //     // Filter sale data
  //     const filteredSales = saledata.filter(
  //       (item) => item.ItemgroupCode === itemGroupCode
  //     );

  //     // Group by ItemGroupCode and calculate remaining stock
  //     const groupedStock = filteredPurchases.map((purchase) => {
  //       const totalPurchaseQty = purchase.Quantity || 0;
  //       const totalSaleQty = filteredSales
  //         .filter((sale) => sale.ItemCode === purchase.ItemCode)
  //         .reduce((sum, sale) => sum + (sale.Quantity || 0), 0);

  //       return {
  //         ItemCode: purchase.ItemCode,
  //         ItemName: purchase.ItemName,
  //         Unit: purchase.Unit,
  //         PurchaseQty: totalPurchaseQty,
  //         SaleQty: totalSaleQty,
  //         RemainingStock: totalPurchaseQty - totalSaleQty,
  //       };
  //     });

  //     setFilteredSales(groupedStock);
  //   }
  // };
  // const handleStockChange = (event) => {
  //   const selectedStockType = event.target.value;
  //   setSelectedStock(selectedStockType);

  //   let filteredStock = [];
  //   let stockType = "";
  //   if (selectedStock === "Cattle Feed") {
  //     filteredStock = sales.filter((item) => item.ItemGroupCode === 1);
  //     stockType = "Cattle Feed";
  //   } else if (selectedStock === "Grocery") {
  //     filteredStock = sales.filter((item) => item.ItemGroupCode === 3);
  //     stockType = "Grocery";
  //   } else if (selectedStock === "Medicine") {
  //     filteredStock = sales.filter((item) => item.ItemGroupCode === 2);
  //     stockType = "Medicine";
  //   } else if (selectedStock === "Dairy Goods") {
  //     filteredStock = sales.filter((item) => item.ItemGroupCode === 4);
  //     stockType = "Dairy Goods";
  //   }
  //   setFilteredSales(filteredStock);
  // };

  //... Genrate Pdf
  const generateStockReportPDF = () => {
    if (!selectedStock || !FilteredSales.length) return;

    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text(dairyname, 14, 10);
    doc.text(CityName, 14, 18);

    doc.setFontSize(16);
    doc.text(`${selectedStock} Stock Report`, 60, 28);
    doc.setFontSize(12);
    doc.text(`From: ${fromdate}   To: ${todate}`, 14, 36);

    const tableColumns = reportColumns[selectedStock].map((col) => col.header);
    const tableRows = FilteredSales.map((item) =>
      reportColumns[selectedStock].map((col) => item[col.accessor])
    );

    const totalAmount = FilteredSales.reduce(
      (sum, item) => sum + item.amount,
      0
    );

    doc.autoTable({ head: [tableColumns], body: tableRows, startY: 45 });
    const finalY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(14);
    doc.text(`Total Amount: ₹ ${totalAmount}`, 14, finalY);
    doc.save(`${selectedStock}_Stock_Report.pdf`);
  };

  const groupedSales = sales.reduce((acc, item) => {
    if (!acc[item.dealerCode]) {
      // Ensure this matches the correct identifier
      acc[item.dealerCode] = [];
    }
    acc[item.dealerCode].push(item);
    return acc;
  }, {});

  return (
    <div className="Stocks-reports-container w100 h1 d-flex-col bg ">
      <span className="heading">Stock Report</span>
      <div className="first-half-span-input-div w100 h30  d-flex ">
        <div className="stocks-from-todate-reports-div d-flex-col   w100 h60">
          <div className="fromto-date-Stock-report w50 h70 d-flex  ">
            <div className="from-sale-stock-div w100  h1  d-flex a-center ">
              <span className=" w20 info-text p30">From:</span>
              <input
                className="w70 data"
                type="date"
                value={fromdate}
                onChange={(e) => setFromDate(e.target.value)}
              />
            </div>

            <div className="from-sale-stock-div w100 h1 a-center d-flex ">
              <span className=" w20 info-text p30">To:</span>
              <input
                className="w70 data"
                type="date"
                value={todate}
                onChange={(e) => setToDate(e.target.value)}
              />
            </div>
          </div>

          <div className="select-report-div w100 h60 d-flex a-center ">
            <div className="stocks-report-selact-div d-flexa-center p10 w50">
              <span className="info-text w30"> Select Report:</span>
              <select className="w60 data " onChange={handleStockChange}>
                <option value="">Select Stock Type</option>
                <option value="All Stock Summary">All Stock Summary</option>
                <option value="Cattle Feed">Cattle Feed</option>
                <option value="Grocery">Grocery</option>
                <option value="Medicine">Medicine</option>
                <option value="Dairy Goods">Dairy Goods</option>
              </select>
            </div>
            <div className="stoks-button-div w50 h1 d-flex sa ">
              <button onClick={handleGeneratePrintReport} className="btn">
                Print
              </button>
              <button onClick={handleGenerateStockReport} className="btn">
                PDF
              </button>
              <button className="btn">Reset</button>
            </div>
          </div>
        </div>
      </div>
      <div className="table-container w100">
        {selectedStock &&
          reportColumns[selectedStock] &&
          FilteredSales.length > 0 && (
            <div className="table-wrapper">
              <table className="stock-table">
                <thead>
                  <tr>
                    {reportColumns[selectedStock].map((col) => (
                      <th key={col.header}>{col.header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {FilteredSales.map((row, index) => (
                    <tr key={index}>
                      {reportColumns[selectedStock].map((col) => (
                        <td key={col.accessor}>{row[col.accessor] ?? "N/A"}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td
                      colSpan={reportColumns[selectedStock].length - 2}
                      className="total-label"
                    >
                      Total
                    </td>
                    <td>
                      {FilteredSales.reduce(
                        (sum, item) => sum + (item.remainingquantity || 0),
                        0
                      )}
                    </td>
                    <td>
                      ₹
                      {FilteredSales.reduce(
                        (sum, item) => sum + (item.amount || 0),
                        0
                      ).toFixed(2)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
      </div>
    
    </div>
  );
};

export default Stocksreport;
