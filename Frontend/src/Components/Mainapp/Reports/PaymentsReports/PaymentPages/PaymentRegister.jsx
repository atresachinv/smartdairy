import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "../../../../../Styles/Mainapp/Reports/PaymentReports/PaymentSummary.css";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx"; // Library for Excel export
import { getPaymentsDeductionInfo } from "../../../../../App/Features/Deduction/deductionSlice";
/// PAYMENT Register
const PaymentRegister = ({ showbtn, setCurrentPage }) => {
  const dispatch = useDispatch();
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [dnames, setDnames] = useState([]);
  const [processedDeductions, setProcessedDeductions] = useState([]);
  const [mergedData, setMergedData] = useState([]);
  const tableRef = useRef(null);
  const allDeductions = useSelector(
    (state) => state.deduction.alldeductionInfo
  );
  const customerlist = useSelector((state) => state.customer.customerlist);
  const [showCustomerwiseDateFilter, setShowCustomerwiseDateFilter] =
    useState(true);
  const [fromCode, setFromCode] = useState("");
  const [toCode, setToCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [dataAvailable, setDataAvailable] = useState(true);
  const [customerName, setCustomerName] = useState("");
  const [isCNameWiseChecked, setIsCNameWiseChecked] = useState(false);
  const [isCodewiseChecked, setIsCodewiseChecked] = useState(false);
  const manualMaster = useSelector((state) => state.manualMasters.masterlist);
  const [filteredDeductions, setFilteredDeductions] = useState([]);

  //......   Dairy name And City name   for PDf heading
  const dairyname = useSelector(
    (state) =>
      state.dairy.dairyData.SocietyName || state.dairy.dairyData.center_name
  );
  const CityName = useSelector((state) => state.dairy.dairyData.city);

 console.log(processedDeductions);

  // Export data to Excel


const exportToExcel = () => {
  if (!processedDeductions || processedDeductions.length === 0) {
    alert("No data available to export.");
    return;
  }

  const flattenedData = processedDeductions.map((data) => {
    const baseData = {
      Code: data.Code || "",
      CustomerName: data.customerName || "",
      TotalLiters: Number(data.tliters) || 0,
      Pamt: Number(data.pamt) || 0,
      Damt: Number(data.damt) || 0,
      Namt: Number(data.namt) || 0,M 
    };

    const deductions = data.additionalDeductions || {}; // fallback to empty object
    dnames.forEach((dname) => {
      baseData[dname] = Number(deductions[dname]) || 0;
      
    });

    return baseData;
  });

  const worksheet = XLSX.utils.json_to_sheet(flattenedData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Payment Data");

  // Save the file
  XLSX.writeFile(workbook, "PaymentData.xlsx");
};



  const handlePrint = () => {
    if (!tableRef.current) {
      console.error("Table element not found.");
      return;
    }

    // Helper function to format dates
    const formatDate = (date) => {
      return date instanceof Date ? date.toISOString().split("T")[0] : "N/A"; // Format to YYYY-MM-DD
    };

    // Get the selected From and To Dates (assuming these are in state)
    const formattedFromDate = formatDate(fromDate); // From Date
    const formattedToDate = formatDate(toDate); // To Date

    // Ensure mergedData is available
    if (!processedDeductions || processedDeductions.length === 0) {
      console.error("No merged data found.");
      return;
    }

    const dairyName = dairyname; // Replace with the actual dairy name
    const cityName = CityName; // Replace with the actual city name
    const reportTitle = "Customer Report";

    // // Get the createdBy field (assuming it's present in mergedData)
    // const createdBy = mergedData[0]?.createdby || "Unknown"; // Default to "Unknown" if not available

    // Build the print content with the heading and table
    const printContents = tableRef.current.outerHTML;

    // Create the print window
    const printWindow = window.open("", "_blank");

    if (printWindow) {
      // Adding custom heading with dairy name, city, and date range
      printWindow.document.write(`
      <html>
        <head>
          <title>Print</title>
          <style>
            table { border-collapse: collapse; width: 100%; }
            th, td { border: 1px solid black; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            .heading { text-align: center; font-size: 16px; font-weight: bold; }
            .subheading { text-align: center; font-size: 12px; }
          </style>
        </head>
        <body>
         
          <div class="subheading">
            Dairy Name: ${dairyName} <br>
            City: ${cityName} <br>
            City: ${reportTitle} <br>
            Date Range: From ${fromDate} To ${toDate} <br>
            
          </div>
          <br>
          ${printContents}
        </body>
      </html>
    `);
      printWindow.document.close(); // Close the document to allow it to be rendered
      printWindow.print(); // Trigger print
    } else {
      console.error("Failed to open print window.");
    }
  };

  //.. Pdf
const exportToPDF = () => {
  if (processedDeductions.length === 0) {
    alert("No data available to export.");
    return;
  }

  const doc = new jsPDF("p", "mm", "a4"); // Portrait, mm, A4

  // Format date function
  const formatDate = (date) => {
    if (!date) return "N/A";
    const d = new Date(date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(d.getDate()).padStart(2, "0")}`;
  };

  const selectedFromDate = formatDate(fromDate);
  const selectedToDate = formatDate(toDate);
  const dateText = `From ${selectedFromDate} To ${selectedToDate}`;
  const pageWidth = doc.internal.pageSize.getWidth();

  // Dairy name
  const dairyTitle = dairyname || "Dairy Name";
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  const dairyTextWidth = doc.getTextWidth(dairyTitle);
  doc.text(dairyTitle, (pageWidth - dairyTextWidth) / 2, 10);

  // Report title
  const reportTitle = "Deduction Report";
  doc.setFontSize(10);
  const titleTextWidth = doc.getTextWidth(reportTitle);
  doc.text(reportTitle, (pageWidth - titleTextWidth) / 2, 16);

  // Date range text
  doc.setFontSize(8);
  const dateTextWidth = doc.getTextWidth(dateText);
  doc.text(dateText, (pageWidth - dateTextWidth) / 2, 21);

  // Table columns (dynamic)
  const columns = [
    { header: "Code", dataKey: "Code" },
    { header: "Customer Name", dataKey: "customerName" },
    { header: "TLiters", dataKey: "tliters" },

    ...dnames.map((name) => ({ header: name, dataKey: name })),
    { header: "Pamt", dataKey: "pamt" },
    { header: "Damt", dataKey: "damt" },
    { header: "Namt", dataKey: "namt" },
  ];

  // Table rows
  const rows = processedDeductions.map((data) => {
    const row = {
      Code: data.Code,
      customerName: data.customerName,
      tliters: Math.round(data.tliters || 0),
      pamt: Math.round(data.pamt || 0),
      damt: Math.round(data.damt || 0),
      namt: Math.round(data.namt || 0),
    };

      const deductions = data.additionalDeductions || {};

      dnames.forEach((name) => {
        row[name] = Math.round(Number(deductions[name]) || 0);
      });

    return row;
  });

  // Totals row
  const totals = {
    Code: "Total",
    customerName: "",
    tliters: Math.round(
      processedDeductions.reduce((sum, item) => sum + (item.tliters || 0), 0)
    ),
    pamt: Math.round(
      processedDeductions.reduce((sum, item) => sum + (item.pamt || 0), 0)
    ),
    damt: Math.round(
      processedDeductions.reduce((sum, item) => sum + (item.damt || 0), 0)
    ),
    namt: Math.round(
      processedDeductions.reduce((sum, item) => sum + (item.namt || 0), 0)
    ),
  };

  dnames.forEach((name) => {
    totals[name] = Math.round(
      processedDeductions.reduce(
        (sum, item) => sum + (item.additionalDeductions?.[name] || 0),
        0
      )
    );
  });

  rows.push(totals); // Add totals row

  // Generate table
  doc.autoTable({
    columns,
    body: rows,
    startY: 28,
    theme: "grid",
    headStyles: {
      fillColor: [22, 160, 133],
      textColor: [255, 255, 255],
      fontSize: 8,
    },
    bodyStyles: {
      fontSize: 7,
      cellPadding: 1,
      valign: "middle",
    },
    footStyles: {
      fontStyle: "bold",
      fillColor: [230, 230, 230],
    },
    styles: {
      cellPadding: 1.5,
      overflow: "linebreak",
    },
    columnStyles: {
      customerName: { cellWidth: 40 },
      tliters: { halign: "right" },
      pamt: { halign: "right" },
      damt: { halign: "right" },
      namt: { halign: "right" },
      ...Object.fromEntries(dnames.map((name) => [name, { halign: "right" }])),
    },
    willDrawCell: (data) => {
      if (data.section === "head") {
        data.cell.styles.minCellHeight = 8;
      }
    },
    didDrawPage: () => {
      doc.setFontSize(8);
      doc.setTextColor(40);
      doc.text(
        `Page ${doc.internal.getNumberOfPages()}`,
        pageWidth - 30,
        doc.internal.pageSize.getHeight() - 10
      );
    },
  });

  doc.save("Deduction_Report.pdf");
};


  const fetchData = async () => {
    setIsLoading(true); // Start loading
    setDataAvailable(true); // Assume data is available initially

    try {
      if (fromDate && toDate) {
        const result = await dispatch(
          getPaymentsDeductionInfo({ fromDate, toDate })
        ).unwrap();

        if (!result || result.length === 0) {
          setDataAvailable(false); // No data found
        }
      } else {
        alert("Please select a valid date range.");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setDataAvailable(false); // Error occurred
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

useEffect(() => {
  if (allDeductions.length > 0 && customerlist.length > 0) {
    const grouped = {};
    const dnameSet = new Set(); // To store unique dnames

    allDeductions.forEach((item) => {
      const code = item.Code;

      if (item.DeductionId === 0) {
        const customer = customerlist.find((cust) => cust.srno === code);
        grouped[code] = {
          ...item,
          customerName: customer ? customer.cname : "",
        };
      } else {
        if (item.dname && item.AMT !== undefined) {
          const cleanDname = item.dname.replace(/\s+/g, "_"); // Replace spaces with underscores
          dnameSet.add(cleanDname); // collect sanitized dnames

          if (!grouped[code]) {
            grouped[code] = {};
          }

          grouped[code][cleanDname] = item.AMT; // Add sanitized key
        }
      }
    });

    const finalData = Object.values(grouped);
    setProcessedDeductions(finalData);

    // Set unique cleaned dnames
    setDnames(Array.from(dnameSet));
  }
}, [allDeductions, customerlist]);


//Code Wise And Cnamewise Filter
useEffect(() => {
  let filtered = [...processedDeductions];

  // Apply Codewise filtering
  if (isCodewiseChecked && fromCode && toCode) {
    filtered = filtered.filter((item) => {
      const code = parseInt(item.Code, 10);
      return code >= parseInt(fromCode, 10) && code <= parseInt(toCode, 10);
    });
  }

  // Apply Customer Name filtering (case-insensitive)
  if (isCNameWiseChecked && customerName.trim() !== "") {
    filtered = filtered.filter((item) =>
      item.customerName
        .toLowerCase()
        .includes(customerName.trim().toLowerCase())
    );
  }

  setFilteredDeductions(filtered);
}, [
  isCodewiseChecked,
  fromCode,
  toCode,
  isCNameWiseChecked,
  customerName,
  processedDeductions,
]);



  return (
    <div className="payment-register-container w100 h1 d-flex-col ">
      <div className="title-back-btn-container w100 h10 d-flex a-center sb">
        <span className="heading py10">Payment Register :</span>
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
      <div className="filter-container d-flex-col  w100 h30 sa">
        <div className="from-too-date-button-container w100 h30  d-flex">
          <div className="date-from-toocontainer w60 h50 d-flex sa ">
            <div className="from-date-div-container w30 d-flex h1 a-center ">
              <span className="info-text w40">From:</span>
              <input
                className="data w90"
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                placeholder="From Date"
              />
            </div>
            <div className="to-date-div-container w30 h1 a-center d-flex">
              <span className="info-text w40">TO:</span>
              <input
                type="date"
                className="data w90 "
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                placeholder="To Date"
              />
            </div>

            <div className="report-show-button-div w20 d-flex h1 a-center">
              <button className="w-btn" onClick={fetchData}>
                Show
              </button>
            </div>
          </div>

          <div className="combined-filter-div w40 h1 d-flex  a-center">
            {/* Codewise Checkbox */}
            <div className="filter-option w50 h1 d-flex a-center">
              <input
                type="checkbox"
                className="w10"
                id="codeFilter"
                checked={isCodewiseChecked}
                onChange={(e) => setIsCodewiseChecked(e.target.checked)}
              />
              <label htmlFor="codeFilter" className="info-text w30">
                Codewise
              </label>
            </div>

            {/* CNameWise Checkbox */}
            <div className="filter-option w50 h1 d-flex a-center">
              <input
                type="checkbox"
                className="w10"
                id="nameFilter"
                checked={isCNameWiseChecked}
                onChange={(e) => setIsCNameWiseChecked(e.target.checked)}
              />
              <label htmlFor="nameFilter" className="info-text w30">
                CNameWise
              </label>
            </div>

            {/* Conditional Rendering for Codewise */}
            {isCodewiseChecked && (
              <div className="codewise-filter w100 h50 d-flex">
                <div className="from-date-bank-div w50 d-flex h1 a-center">
                  <span className="info-text w30">From:</span>
                  <input
                    type="number"
                    className="data w60"
                    value={fromCode}
                    onChange={(e) => setFromCode(e.target.value)}
                    placeholder="001"
                  />
                </div>
                <div className="to-date-bank-div w50 d-flex h1 a-center">
                  <span className="info-text w30">To:</span>
                  <input
                    type="number"
                    className="data w60"
                    value={toCode}
                    onChange={(e) => setToCode(e.target.value)}
                    placeholder="002"
                  />
                </div>
              </div>
            )}

            {/* Conditional Rendering for CNameWise */}
            {isCNameWiseChecked && (
              <div className="customername-wise-filter-div w50 h40 a-center j-center">
                <input
                  className="data w60"
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="CName"
                />
              </div>
            )}
          </div>
        </div>
        <div className="button-and-customer-name-wise-div w100 h60 d-flex a-center">
          <div className="button-print-export-div w40 h1 a-center d-flex sa j-end ">
            <button type="button" className="w-btn" onClick={exportToExcel}>
              Excel
            </button>
            <button type="button" className="w-btn" onClick={handlePrint}>
              Print
            </button>
            <button type="button" className="w-btn" onClick={exportToPDF}>
              PDF
            </button>
          </div>
        </div>
      </div>
      {/* Display filtered data */}

      <div className="table-side-container-div w100 h80 d-flex-col">
        <div
          className="table-container"
          style={{ overflowX: "auto", whiteSpace: "nowrap" }}
        >
          <table
            className="table"
            ref={tableRef}
            style={{
              width: "100%",
              minWidth: "max-content",
              borderCollapse: "collapse",
            }}
          >
            <thead>
              <tr>
                <th>Code</th>
                <th>Customer Name</th>
                {dnames.map((dname) => (
                  <th key={dname}>{dname}</th>
                ))}
                <th>Liters</th>
                <th>AVG Rate</th>
                <th>Payment</th>
                <th>Deduction</th>
                <th>NAMT</th>
              </tr>
            </thead>
            <tbody>
              {processedDeductions.map((data, index) => (
                <tr key={index}>
                  <td>{data.Code}</td>
                  <td>{data.customerName}</td>

                  {dnames.map((dname) => (
                    <td key={dname}>{data[dname] || 0}</td>
                  ))}

                  <td>{data.tliters}</td>
                  <td>
                    {data.tliters > 0
                      ? (data.pamt / data.tliters).toFixed(2)
                      : "N/A"}
                  </td>
                  <td>{data.pamt}</td>
                  <td>{data.damt}</td>
                  <td>{(data.pamt - data.damt).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>

            <tfoot>
              <tr>
                <td colSpan={2}>
                  <strong>Total</strong>
                </td>
                {/* Totals for dynamic columns */}
                {dnames.map((dname) => {
                  const total = processedDeductions.reduce(
                    (sum, item) => sum + (parseFloat(item[dname]) || 0),
                    0
                  );
                  return (
                    <td key={dname}>
                      <strong>{total.toFixed(2)}</strong>
                    </td>
                  );
                })}
                {/* Static totals */}
                <td>
                  <strong>
                    {processedDeductions
                      .reduce((sum, item) => sum + (item.tliters || 0), 0)
                      .toFixed(2)}
                  </strong>
                </td>
                <td>-</td> {/* AVG Rate column doesn't need a total */}
                <td>
                  <strong>
                    {processedDeductions
                      .reduce((sum, item) => sum + (item.pamt || 0), 0)
                      .toFixed(2)}
                  </strong>
                </td>
                <td>
                  <strong>
                    {processedDeductions
                      .reduce((sum, item) => sum + (item.damt || 0), 0)
                      .toFixed(2)}
                  </strong>
                </td>
                <td>
                  <strong>
                    {processedDeductions
                      .reduce(
                        (sum, item) =>
                          sum + ((item.pamt || 0) - (item.damt || 0)),
                        0
                      )
                      .toFixed(2)}
                  </strong>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PaymentRegister;
