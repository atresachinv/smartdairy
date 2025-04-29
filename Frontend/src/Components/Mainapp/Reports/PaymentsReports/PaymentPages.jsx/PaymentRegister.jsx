import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "../../../../../Styles/Mainapp/Reports/PaymentReports/PaymentSummary.css";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx"; // Library for Excel export
import { getPaymentsDeductionInfo } from "../../../../../App/Features/Deduction/deductionSlice";
// import { getPaymentsDeductionInfo } from "../../../../App/Features/Deduction/deductionSlice";
/// PAYMENT Register
const PaymentRegister = () => {
  const dispatch = useDispatch();

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [filter, setFilter] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [dnames, setDnames] = useState([]);
  const [groupedData, setGroupedData] = useState([]);
  const [mergedData, setMergedData] = useState([]);
  const tableRef = useRef(null);
  const deduction = useSelector((state) => state.deduction.alldeductionInfo);
  const customerlist = useSelector((state) => state.customer.customerlist);
  const [showCustomerwiseDateFilter, setShowCustomerwiseDateFilter] =
    useState(true);
  const [showAllCustomers, setShowAllCustomers] = useState(false);
  const [fromCode, setFromCode] = useState("");
  const [toCode, setToCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [dataAvailable, setDataAvailable] = useState(true);
  const [customerName, setCustomerName] = useState("");
  const [isCNameWiseChecked, setIsCNameWiseChecked] = useState(false);
  const [filterType, setFilterType] = useState("code"); // 'code' or 'name'
  const [isCodewiseChecked, setIsCodewiseChecked] = useState(false);
  const manualMaster = useSelector((state) => state.manualMasters.masterlist);

  //......   Dairy name And City name   for PDf heading
  const dairyname = useSelector(
    (state) =>
      state.dairy.dairyData.SocietyName || state.dairy.dairyData.center_name
  );
  const CityName = useSelector((state) => state.dairy.dairyData.city);

  //...

  const handleSelectChange = async (e) => {
    const selectedIndex = e.target.value;
    if (selectedIndex !== "") {
      const selectedDates = manualMaster[selectedIndex];
      setSelectedMaster(selectedDates);

      // Store selected master in localStorage
      localStorage.setItem("selectedMaster", JSON.stringify(selectedDates));
      console.log(" Manual MAster", manualMaster);
      dispatch(
        getPaymentsDeductionInfo({
          fromDate: selectedDates.start,
          toDate: selectedDates.end,
        })
      );
    }
  };

  // Fetch data on date change
  useEffect(() => {
    if (fromDate && toDate) {
      dispatch(getPaymentsDeductionInfo({ fromDate, toDate }));
    }
  }, [dispatch, fromDate, toDate]);

  // Merge customer names into deduction records
  useEffect(() => {
    if (deduction.length > 0 && customerlist.length > 0) {
      const updatedData = deduction.map((deductionItem) => {
        const matchingCustomer = customerlist.find(
          (customer) => String(customer.cid) === String(deductionItem.AccCode)
        );
        return {
          ...deductionItem,
          customerName: matchingCustomer?.cname || "Unknown",
          Code: matchingCustomer?.srno || "Unknown",
          Arate: matchingCustomer?.arate || "Unknown",
        };
      });
      setMergedData(updatedData);
    }
  }, [deduction, customerlist]);

  // Group and summarize data
  useEffect(() => {
    if (mergedData.length > 0) {
      const grouped = mergedData.reduce((acc, item) => {
        const {
          AMT,
          dname,
          DeductionId,
          tliters,
          pamt,
          damt,
          namt,
          Code,
          customerName,
        } = item;

        if (!acc[Code]) {
          acc[Code] = {
            Code,
            customerName,
            tliters: 0,
            pamt: 0,
            damt: 0,
            namt: 0,
            additionalDeductions: {},
          };
        }

        acc[Code].tliters += tliters || 0;
        acc[Code].pamt += pamt || 0;
        acc[Code].damt += damt || 0;
        acc[Code].namt += namt || 0;

        if (DeductionId !== 0) {
          if (!acc[Code].additionalDeductions[dname]) {
            acc[Code].additionalDeductions[dname] = 0;
          }
          acc[Code].additionalDeductions[dname] += AMT || 0;
        }

        return acc;
      }, {});

      const groupedArray = Object.values(grouped);
      setGroupedData(groupedArray);

      const allDnames = new Set();
      groupedArray.forEach((item) =>
        Object.keys(item.additionalDeductions).forEach((dname) =>
          allDnames.add(dname)
        )
      );
      setDnames([...allDnames]);
    }
  }, [mergedData]);

  // Filter data by code (with the 'Codewise' filter)
  useEffect(() => {
    const filtered = groupedData.filter((data) => {
      // Apply the code filter only if the "showCustomerwiseDateFilter" is true
      const isCodeInRange =
        (fromCode === "" || data.Code >= fromCode) &&
        (toCode === "" || data.Code <= toCode);

      return showCustomerwiseDateFilter ? isCodeInRange : true; // Only filter by code if enabled
    });
    setFilteredData(filtered);
  }, [fromCode, toCode, groupedData, showCustomerwiseDateFilter]);
  // filter data by customerwise

  useEffect(() => {
    const filtered = groupedData.filter((data) => {
      // Apply the code range filter only if showCustomerwiseDateFilter is true
      const isCodeInRange =
        (fromCode === "" || data.Code >= fromCode) &&
        (toCode === "" || data.Code <= toCode);

      // Apply the customer name filter (if customerName is provided)
      const isCustomerNameMatch =
        customerName === "" ||
        (data.customerName &&
          data.customerName.toLowerCase().includes(customerName.toLowerCase()));

      // Combine the filters
      return (
        (showCustomerwiseDateFilter ? isCodeInRange : true) &&
        isCustomerNameMatch
      );
    });

    // Set the filtered data
    setFilteredData(filtered);
  }, [fromCode, toCode, groupedData, showCustomerwiseDateFilter, customerName]);

  // Calculate totals
  const calculateTotals = () => {
    const totals = {
      tliters: 0,
      pamt: 0,
      damt: 0,
      namt: 0,
      ...Object.fromEntries(dnames.map((name) => [name, 0])),
    };

    filteredData.forEach((data) => {
      totals.tliters += data.tliters || 0;
      totals.pamt += data.pamt || 0;
      totals.damt += data.damt || 0;
      totals.namt += data.namt || 0;

      dnames.forEach((name) => {
        totals[name] += data.additionalDeductions[name] || 0;
      });
    });

    return totals;
  };

  const totals = calculateTotals();

  // Export data to Excel
  const exportToExcel = () => {
    const flattenedData = filteredData.map((data) => {
      const baseData = {
        Code: data.Code,
        CustomerName: data.customerName,
        TotalLiters: data.tliters,
        Pamt: data.pamt,
        Damt: data.damt,
        Namt: data.namt,
      };

      dnames.forEach((dname) => {
        baseData[dname] = data.additionalDeductions[dname] || 0;
      });

      return baseData;
    });

    const worksheet = XLSX.utils.json_to_sheet(flattenedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Payment Data");
    XLSX.writeFile(workbook, "PaymentData.xlsx");
  };

  // Fetch Data Handler
  const fetchData = () => {
    if (fromDate && toDate) {
      dispatch(getPaymentsDeductionInfo({ fromDate, toDate }));
    } else {
      alert("Please select a valid date range.");
    }
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
    if (!mergedData || mergedData.length === 0) {
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
    if (filteredData.length === 0) {
      alert("No data available to export.");
      return;
    }

    const doc = new jsPDF("p", "mm", "a4"); // Portrait orientation, millimeters, A4 size

    // Helper function to format dates
    const formatDate = (date) => (date ? date.split("T")[0] : "N/A");

    // // Format the date range
    // const selectedFromDate = formatDate(fromDate);
    // const selectedToDate = formatDate(toDate);

    // Page width for centering text
    const pageWidth = doc.internal.pageSize.getWidth();

    // Add header with dairy name
    doc.setFontSize(12); // Reduced font size
    doc.setFont("helvetica", "bold");
    const dairyTextWidth = doc.getTextWidth(dairyname);
    doc.text(dairyname, (pageWidth - dairyTextWidth) / 2, 10);

    // Add city name below the heading
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    // const cityTextWidth = doc.getTextWidth(City: ${CityName});
    // doc.text(City: ${CityName}, (pageWidth - cityTextWidth) / 2, 15);

    // Add report title
    const reportTitle = "Deduction Report";
    const titleTextWidth = doc.getTextWidth(reportTitle);
    doc.text(reportTitle, (pageWidth - titleTextWidth) / 2, 20);

    // Add date range below the title
    // const dateText = From: ${selectedFromDate}  To: ${selectedToDate};
    doc.setFontSize(8);
    const dateTextWidth = doc.getTextWidth(dateText);
    doc.text(dateText, (pageWidth - dateTextWidth) / 2, 25);

    // Define columns dynamically with smaller font sizes and tighter spacing
    const columns = [
      { header: "Code", dataKey: "Code" },
      { header: "Customer Name", dataKey: "customerName" },
      { header: "TLiters", dataKey: "tliters" },
      { header: "Pamt", dataKey: "pamt" },
      { header: "Damt", dataKey: "damt" },
      { header: "Namt", dataKey: "namt" },
      ...dnames.map((name) => ({ header: name, dataKey: name })),
    ];

    // Prepare rows with rounded values
    const rows = filteredData.map((data) => {
      const row = {
        Code: data.Code,
        customerName: data.customerName,
        tliters: Math.round(data.tliters || 0),
        pamt: Math.round(data.pamt || 0),
        damt: Math.round(data.damt || 0),
        namt: Math.round(data.namt || 0),
      };
      dnames.forEach((name) => {
        row[name] = Math.round(data.additionalDeductions[name] || 0);
      });
      return row;
    });

    // Calculate totals with rounded values
    const totals = {
      Code: "Total",
      customerName: "",
      tliters: Math.round(
        filteredData.reduce((sum, item) => sum + (item.tliters || 0), 0)
      ),
      pamt: Math.round(
        filteredData.reduce((sum, item) => sum + (item.pamt || 0), 0)
      ),
      damt: Math.round(
        filteredData.reduce((sum, item) => sum + (item.damt || 0), 0)
      ),
      namt: Math.round(
        filteredData.reduce((sum, item) => sum + (item.namt || 0), 0)
      ),
    };
    dnames.forEach((name) => {
      totals[name] = Math.round(
        filteredData.reduce(
          (sum, item) => sum + (item.additionalDeductions[name] || 0),
          0
        )
      );
    });

    // Append totals row
    rows.push(totals);

    // Add table to the PDF with optimized settings
    doc.autoTable({
      columns,
      body: rows,
      startY: 30, // Adjusted starting position to save vertical space
      theme: "grid",
      headStyles: {
        fillColor: [22, 160, 133], // Header color
        textColor: [255, 255, 255], // Header text color
        fontSize: 8, // Smaller font size for headers
      },
      bodyStyles: {
        fontSize: 7, // Smaller font size for body rows
        cellPadding: 1, // Reduce padding to save space
        valign: "middle",
      },
      footStyles: {
        fontStyle: "bold", // Bold totals
        fillColor: [200, 200, 200], // Footer background color
      },
      styles: {
        cellPadding: 1.5,
        overflow: "linebreak", // Wrap text in cells
      },
      columnStyles: {
        customerName: { cellWidth: 40 }, // Adjust specific column widths
        tliters: { halign: "right" },
        pamt: { halign: "right" },
        damt: { halign: "right" },
        namt: { halign: "right" },
        ...Object.fromEntries(
          dnames.map((name) => [name, { halign: "right" }])
        ),
      },
      willDrawCell: (data) => {
        if (data.section === "head") {
          data.cell.styles.minCellHeight = 8; // Maintain height for readability
        }
      },
      didDrawPage: (data) => {
        // Draw header on every page
        const pageWidth = doc.internal.pageSize.getWidth();
        doc.setFontSize(8);
        doc.setTextColor(40);
        doc.text(
          // Page ${doc.internal.getNumberOfPages()},
          pageWidth - 20,
          doc.internal.pageSize.getHeight() - 10
        );
      },
    });

    // Save the PDF
    doc.save("Deduction_Report.pdf");
  };

  const fetchDataa = async () => {
    setIsLoading(true); // Set loading to true when data fetching starts
    setDataAvailable(true); // Assume data is available initially

    try {
      // Simulate data fetch (replace this with actual API call)
      if (fromDate && toDate) {
        await dispatch(getPaymentsDeductionInfo({ fromDate, toDate }));

        // After fetching, check if data exists
        if (!deduction.length) {
          setDataAvailable(false); // Set to false if no data is found
        }
      } else {
        alert("Please select a valid date range.");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setDataAvailable(false); // Set to false if there was an error
    } finally {
      setIsLoading(false); // Set loading to false once the fetch is complete
    }
  };

  return (
    <div className="payment-register-container w100 h1 d-flex-col ">
      <span className="heading">Payment Register</span>
      <div className="filter-container d-flex-col  w100 h30 bg sa">
        <div className="from-too-date-button-container w100 h30  d-flex">
          <div className="date-from-toocontainer w60 d-flex h1 sa ">
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
              <button className="w-btn" onClick={fetchDataa}>
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
            <button className="w-btn" onClick={exportToExcel}>
              Excel
            </button>
            <button className="w-btn" onClick={handlePrint}>
              Print
            </button>
            <button className="w-btn" onClick={exportToPDF}>
              PDF{" "}
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
                <th>AVG Rate</th> {/* New column header */}
                <th>Payment </th>
                <th>Deduction</th>
                <th>NAMT</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((data, index) => (
                <tr key={index}>
                  <td>{data.Code}</td>
                  <td>{data.customerName}</td>
                  {dnames.map((dname) => (
                    <td key={dname}>{data.additionalDeductions[dname] || 0}</td>
                  ))}
                  <td>{data.tliters}</td>
                  <td>
                    {/* Calculate Average Rate */}
                    {data.tliters > 0
                      ? (data.pamt / data.tliters).toFixed(2) // Ensure non-zero denominator
                      : "N/A"}
                  </td>
                  <td>{data.pamt}</td>
                  <td>{data.damt}</td>
                  <td>{data.namt}</td>
                </tr>
              ))}

              {/* Totals row below the data */}
              <tr className="total-row">
                <td>Total</td>
                <td></td> {/* Empty for the "Customer Name" column */}
                <td>{totals.tliters?.toLocaleString()}</td>
                {dnames.map((dname) => (
                  <td key={dname}>{totals[dname]?.toLocaleString()}</td>
                ))}
                <td>
                  {/* Total Average Rate */}
                  {totals.tliters > 0
                    ? (totals.pamt / totals.tliters).toFixed(2)
                    : "N/A"}
                </td>
                <td>{totals.pamt?.toLocaleString()}</td>
                <td>{totals.damt?.toLocaleString()}</td>
                <td>{totals.namt?.toLocaleString()}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PaymentRegister;
