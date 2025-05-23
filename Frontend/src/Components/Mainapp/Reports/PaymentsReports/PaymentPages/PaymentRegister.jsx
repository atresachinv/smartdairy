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

  const tableRef = useRef(null);
  const allDeductions = useSelector(
    (state) => state.deduction.alldeductionInfo
  );
  const customerlist = useSelector((state) => state.customer.customerlist);
  const [showCustomerwiseDateFilter, setShowCustomerwiseDateFilter] =
    useState(true);
  const [fromCode, setFromCode] = useState("");
  const [filterCode, setFilterCode] = useState("");
  const [isloading, setIsLoading] = useState("");
  const [dataavailable, setDataAvailable] = useState("");
  const [customerName, setCustomerName] = useState("");
  const centerList = useSelector(
    (state) => state.center.centersList.centersDetails
  );
  const dairyinfo = useSelector((state) => state.dairy.dairyData);
  const [selectedCenterId, setSelectedCenterId] = useState("");

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
        Namt: Number(data.namt) || 0,
        M,
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
  const handlePDF = () => {
    if (!tableRef.current) {
      console.error("Table element not found.");
      return;
    }

    const formatDate = (date) => {
      if (!date) return "N/A";
      const d = new Date(date);
      return !isNaN(d.getTime()) ? d.toISOString().split("T")[0] : "N/A";
    };

    const formattedFromDate = formatDate(fromDate);
    const formattedToDate = formatDate(toDate);

    if (!processedDeductions || processedDeductions.length === 0) {
      console.error("No data found.");
      return;
    }

    const doc = new jsPDF("p", "mm", "a4");
    const dairyName = dairyname || "Dairy Name";
    const cityName = CityName || "City";
    const reportTitle = "Payment Register";

    // Background banner for heading
    doc.setFillColor(200, 220, 255);
    doc.rect(0, 10, 210, 30, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text(dairyName, 105, 18, { align: "center" });

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`City: ${cityName}`, 105, 24, { align: "center" });
    doc.text(`${reportTitle}`, 105, 30, { align: "center" });
    doc.text(
      `Date Range: ${formattedFromDate} to ${formattedToDate}`,
      105,
      36,
      {
        align: "center",
      }
    );

    // Extract table data
    const table = tableRef.current;
    const headers = Array.from(table.querySelectorAll("thead th")).map((th) =>
      th.innerText.trim()
    );
    const rows = Array.from(table.querySelectorAll("tbody tr")).map((tr) =>
      Array.from(tr.querySelectorAll("td")).map((td) => td.innerText.trim())
    );

    // Compute totals for numeric columns
    const totalRow = headers.map((_, colIndex) => {
      const isNumericColumn = rows.every(
        (row) => !isNaN(parseFloat(row[colIndex])) && row[colIndex] !== ""
      );
      if (colIndex === 0) return "Total"; // First column label
      if (isNumericColumn) {
        const total = rows.reduce((sum, row) => {
          const val = parseFloat(row[colIndex]);
          return sum + (isNaN(val) ? 0 : val);
        }, 0);
        return total.toFixed(2); // Two decimals
      }
      return ""; // Leave non-numeric columns blank
    });

    // Render the table
    doc.autoTable({
      startY: 42,
      head: [headers],
      body: rows,
      foot: [totalRow], // ✅ Add total row
      styles: {
        fontSize: 8.5,
        cellPadding: 2,
        overflow: "linebreak",
        valign: "middle",
      },
      headStyles: {
        fillColor: [60, 100, 255],
        textColor: 255,
        fontStyle: "bold",
        halign: "center",
      },
      footStyles: {
        fillColor: [240, 240, 240],
        fontStyle: "bold",
        textColor: [0, 0, 0],
        halign: "right",
      },
      bodyStyles: {
        halign: "left",
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
      tableWidth: "auto",
      margin: { top: 10, left: 5, right: 5 },
      didDrawCell: (data) => {
        const textWidth =
          (doc.getStringUnitWidth(data.cell.text[0]) *
            data.cell.styles.fontSize) /
          doc.internal.scaleFactor;
        if (textWidth > data.cell.width) {
          data.cell.styles.fontSize -= 0.5;
        }
      },
    });

    // Save the PDF
    doc.save(
      `${reportTitle.replace(
        /\s+/g,
        "_"
      )}_${formattedFromDate}_to_${formattedToDate}.pdf`
    );
  };

  const handleExportExcel = () => {
    if (!tableRef.current) {
      console.error("Table element not found.");
      return;
    }

    const table = tableRef.current;

    // Convert the HTML table to a worksheet
    const worksheet = XLSX.utils.table_to_sheet(table);

    // Add metadata
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "CustomerReport");

    // Format filename with date range
    const formatDate = (date) => {
      if (!date) return "N/A";
      const d = new Date(date);
      return !isNaN(d.getTime()) ? d.toISOString().split("T")[0] : "N/A";
    };
    const formattedFromDate = formatDate(fromDate);
    const formattedToDate = formatDate(toDate);
    const fileName = `Customer_Report_${formattedFromDate}_to_${formattedToDate}.xlsx`;

    // Save the Excel file
    XLSX.writeFile(workbook, fileName);
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

  //..
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

  // Function to handle selection Centerchange
  const handleCenterChange = (event) => {
    setSelectedCenterId(event.target.value);
  };
  const filteredCenterCustomer = customerlist?.filter(
    (row) => String(row.centerid) === String(selectedCenterId) // Ensure type match
  );
  //.........
  const displayedData = selectedCenterId
    ? filteredCenterCustomer
    : filteredData;

  useEffect(() => {
    const savedFrom = localStorage.getItem("fromDate");
    const savedTo = localStorage.getItem("toDate");
    if (savedFrom) setFromDate(savedFrom);
    if (savedTo) setToDate(savedTo);
  }, []);

  // Save to localStorage when values change
  useEffect(() => {
    localStorage.setItem("fromDate", fromDate);
  }, [fromDate]);

  useEffect(() => {
    localStorage.setItem("toDate", toDate);
  }, [toDate]);

  // Your fetchData and component JSX...
  /// Handlekey move to next
  const handleKeyDown = (e, nextRef) => {
    if (e.key === "Enter" && nextRef.current) {
      e.preventDefault();
      nextRef.current.focus();
    }
  };

  console.log("centerList", centerList);

  return (
    <div className="payment-register-container w100 h1 d-flex-col bg ">
      <span className="heading h10 ">Payment Register :</span>
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
          <div className="filter-cname-andcust-name-div w50 d-flex">
            {/* Filter Inputs */}

            {/* Filtered Result Display */}
            <div className="filtered-results">
              {filteredDeductions.length > 0 &&
                filteredDeductions.map((item, index) => (
                  <div
                    key={index}
                    className="filtered-item border p10 my5"
                  ></div>
                ))}
            </div>

            <div className="payment-register-filter-customer-name-code-wise w100 h50 d-flex a-center px10 sb">
              <label htmlFor="code" className="info-text w30">
                Customer :
              </label>
              <div className="payment-customer-name-customer-number-div w70 d-flex j-end sb">
                <input
                  type="text"
                  className="w25 data"
                  name="code"
                  id="code"
                  placeholder="Code"
                  value={filterCode}
                  onChange={(e) => setFilterCode(e.target.value)}
                />
                <input
                  type="text"
                  className="w70 data"
                  name="name"
                  id="name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Customer Name"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="button-and-customer-name-wise-div w100 h60 d-flex a-center">
          <div className="button-print-export-div w40 h1 a-center d-flex sa j-end ">
            <button type="button" className="w-btn" onClick={handleExportExcel}>
              Excel
            </button>
            <button type="button" className="w-btn" onClick={handlePrint}>
              Print
            </button>
            <button type="button" className="w-btn" onClick={handlePDF}>
              PDF
            </button>
          </div>
          <div className="payment-register-centerwisee-data-show w40 h1 d-flex a-center">
            <span className="info-text w20">Center:</span>
            <select
              className="data w60 my10"
              name="selection"
              id="001"
              onChange={handleCenterChange}
            >
              <option value="">Select Center</option>
              {centerList && centerList.length > 0 ? (
                centerList.map((center, index) => (
                  <option key={index} value={center.center_id}>
                    {center.name || center.center_name}
                  </option>
                ))
              ) : (
                <option value="" disabled>
                  No Centers Available
                </option>
              )}
            </select>
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
              {filteredDeductions.map((data, index) => (
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
                {dnames.map((dname) => {
                  const total = filteredDeductions.reduce(
                    (sum, item) => sum + (parseFloat(item[dname]) || 0),
                    0
                  );
                  return (
                    <td key={dname}>
                      <strong>{total.toFixed(2)}</strong>
                    </td>
                  );
                })}
                <td>
                  <strong>
                    {filteredDeductions
                      .reduce((sum, item) => sum + (item.tliters || 0), 0)
                      .toFixed(2)}
                  </strong>
                </td>
                <td>-</td>
                <td>
                  <strong>
                    {filteredDeductions
                      .reduce((sum, item) => sum + (item.pamt || 0), 0)
                      .toFixed(2)}
                  </strong>
                </td>
                <td>
                  <strong>
                    {filteredDeductions
                      .reduce((sum, item) => sum + (item.damt || 0), 0)
                      .toFixed(2)}
                  </strong>
                </td>
                <td>
                  <strong>
                    {filteredDeductions
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
