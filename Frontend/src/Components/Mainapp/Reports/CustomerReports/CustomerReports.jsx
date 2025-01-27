import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { useDispatch, useSelector } from "react-redux";
import { listCustomer } from "../../../../App/Features/Mainapp/Masters/custMasterSlice";
import "../../../../Styles/Mainapp/Reports/ReportPages/CustomerReports.css";
// import { listCustomer } from "../../../../App/Features/Customers/customerSlice";
// import "../../../../../Styles/Report/CustomerReport.css";
// import { listCustomer } from "../../../../../App/Features/Customers/customerSlice";

const CustomerReports = () => {
  const dispatch = useDispatch();
  const customerlist = useSelector((state) => state.customer.customerlist);
  const [filteredData, setFilteredData] = useState([]);
  const [numberOfColumns, setNumberOfColumns] = useState(1);
  const [selectedColumns, setSelectedColumns] = useState({});
  const [dropdownValue, setDropdownValue] = useState("1"); // Default to "All"
  const [milkTypeFilter, setMilkTypeFilter] = useState("All");
  const [commissionFilter, setCommissionFilter] = useState(false); // Changed to boolean for clarity
  const [depositFilter, setDepositFilter] = useState(false); // Changed to boolean for clarity
  const [isSabhasadFilter, setIsSabhasadFilter] = useState("All");

  const dairyname = useSelector(
    (state) =>
      state.dairy.dairyData.SocietyName || state.dairy.dairyData.center_name
  );
  const CityName = useSelector((state) => state.dairy.dairyData.city);

  const columnOptions = {
    Empaty: "index+1",
    Code: "cid",
    Customer_Name: "cname",
    English_Name: "engName",
    Gender: "gender",
    city: "City",
    Tashil: "tal",
    Distric: "dist",
    Pincode: "cust_pincode",
    phone: "phone",
    Mobile: "mobile",
    AddharNo: "cust_addhar",

    Cust_Farmerid: "cust_farmerid",

    MilkType: "milktype",
    caste: "Caste",
    createDate: "createdon",
    Center_No: "centerid",
    custBankName: "cust_bankname",
    Bank_Ac_No: "cust_accno",
    Bank_Ifsc: "cust_ifsc",
    commission: "commission",
    Rebet: "rebet",
    CreatedBy: "createdby",
    Deposit_AMount: "deposit",
    Active_NonACtive: "isActive",
    orgnaiztion_ID: "orgid",
    Rate_ChartNo: "rateChartNo",
    Login_ID: "rno",
  };

  useEffect(() => {
    dispatch(listCustomer());
  }, [dispatch]);

  // Update filtered data whenever filters or customerlist changes
  useEffect(() => {
    const applyFilters = () => {
      if (!customerlist || !Array.isArray(customerlist)) return;

      let filtered = [...customerlist];

      // Filter by dropdown value
      switch (dropdownValue) {
        case "2": // Active
          filtered = filtered.filter((row) => row.isActive === 1);
          break;
        case "3": // Non-active
          filtered = filtered.filter((row) => row.isActive === 0);
          break;
        default: // All
          break;
      }

      // Filter by milk type
      if (milkTypeFilter !== "All") {
        filtered = filtered.filter((row) => {
          if (milkTypeFilter === "Cow") return row.milktype === 0;
          if (milkTypeFilter === "Buffalo") return row.milktype === 1;
          return true;
        });
      }

      // Filter by commission
      if (commissionFilter) {
        filtered = filtered.filter((row) => row.commission > 0);
      }

      // Filter by deposit
      if (depositFilter) {
        filtered = filtered.filter((row) => row.deposit > 0);
      }

      if (isSabhasadFilter !== "All") {
        filtered = filtered.filter((row) => {
          // Assuming the Buffer data contains the actual value you want to check (e.g., 1 or 0)
          const isSabhasadValue = row.isSabhasad.data[0]; // Access the value inside the Buffer

          return isSabhasadFilter === "Member"
            ? isSabhasadValue === 1
            : isSabhasadValue === 0;
        });
      }

      setFilteredData(filtered);
    };

    applyFilters();
  }, [
    customerlist,
    dropdownValue,
    milkTypeFilter,
    commissionFilter,
    depositFilter,
    isSabhasadFilter, // Include the new filter
  ]);

  const handleColumnCountChange = (e) => {
    const newColumnCount = parseInt(e.target.value, 10);
    if (newColumnCount <= 6) {
      setNumberOfColumns(newColumnCount);
    } else {
      alert("You cannot select more than 6 columns.");
    }
  };

  const handleColumnSelection = (e, index) => {
    if (Object.keys(selectedColumns).length < 6 || selectedColumns[index]) {
      const updatedColumns = { ...selectedColumns, [index]: e.target.value };
      setSelectedColumns(updatedColumns);
    } else {
      alert("You cannot select more than 6 columns.");
    }
  };

  const handleClear = () => {
    setNumberOfColumns(0);
    setSelectedColumns({});
    setDropdownValue("1");
    setMilkTypeFilter("All");
    setCommissionFilter(false);
    setDepositFilter(false);
    setFilteredData(customerlist);
  };

  const exportToExcel = () => {
    if (filteredData.length === 0) {
      alert("No data available to export.");
      return;
    }
    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Customer List");
    XLSX.writeFile(workbook, "Customer_Master_List.xlsx");
  };

  const exportToPDF = () => {
    if (filteredData.length === 0) {
      alert("No data available to export.");
      return;
    }

    const doc = new jsPDF();

    // Helper function to format dates
    const formatDate = (date) => {
      return date ? date.split("T")[0] : "N/A";
    };

    // Calculate From and To Dates
    const fromDate = formatDate(filteredData[0]?.createdon);
    const toDate = formatDate(filteredData[filteredData.length - 1]?.createdon);

    // Get unique city names from the data
    const uniqueCities = [
      ...new Set(filteredData.map((item) => item.city || "Unknown City")),
    ];
    const cityName = uniqueCities.join(", "); // Combine multiple cities if available

    // Define columns and rows
    const columns = Object.values(selectedColumns).filter(Boolean);
    const rows = filteredData.map((row) =>
      columns.map((col) => row[col] || "N/A")
    );

    // Page width for centering text
    const pageWidth = doc.internal.pageSize.getWidth();

    // Add dairy name as heading
    const dairyName = dairyname; // Replace this with the actual dairy name
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    const dairyTextWidth = doc.getTextWidth(dairyName);
    doc.text(dairyName, (pageWidth - dairyTextWidth) / 2, 15);

    // Add city name(s) below the heading
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    const cityText = `City: ${CityName}`;
    const cityTextWidth = doc.getTextWidth(cityText);
    doc.text(cityText, (pageWidth - cityTextWidth) / 2, 25);

    // Add report title below the city name
    const reportTitle = "Milk Collection Report";
    const titleTextWidth = doc.getTextWidth(reportTitle);
    doc.text(reportTitle, (pageWidth - titleTextWidth) / 2, 35);

    // Add date range below the title
    const dateText = ` From: ${fromDate}  To: ${toDate}`;
    doc.setFontSize(8);
    const dateTextWidth = doc.getTextWidth(dateText);
    doc.text(dateText, (pageWidth - dateTextWidth) / 2, 45);

    // Add table
    doc.autoTable({
      head: [columns],
      body: rows,
      startY: 55, // Start position for the table
    });

    // Save the PDF
    doc.save("Milk_Collection_Report.pdf");
  };

  const handlePrint = () => {
    const dairyName = dairyname; // Replace with the actual dairy name
    const cityName = CityName; // Replace with the actual city name
    const reportTitle = "Customer Report";

    // Example dates - replace with dynamic values
    const fromDate = "2025-01-01"; // Replace with actual from date
    const toDate = "2025-01-31"; // Replace with actual to date

    // Fetch the customer table content
    const printContents = document.getElementById("customer-table").outerHTML;

    // Construct the full HTML for printing
    const fullHTML = `
    <html>
      <head>
        <title>Print</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 20px;
          }
          h1, h2, h3 {
            text-align: center;
            margin: 5px 0;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
          }
          th, td {
            border: 1px solid #000;
            text-align: left;
            padding: 8px;
          }
          th {
            background-color: #f2f2f2;
          }
        </style>
      </head>
      <body>
        <h1>${dairyName}</h1>
        <h2>City: ${cityName}</h2>
        <h3>${reportTitle}</h3>
        <h4>From: ${fromDate} To: ${toDate}</h4>
        ${printContents}
      </body>
    </html>
  `;

    // Open a new window for printing
    const newWindow = window.open("", "_blank");
    newWindow.document.write(fullHTML);
    newWindow.document.close();
    newWindow.print();
  };
  // Map the keys as options
  const dropdown = Object.keys(columnOptions).map((key, idx) => (
    <option key={idx} value={columnOptions[key]}>
      {key} {/* This will display the column names */}
    </option>
  ));

  return (
    <div className="customer-master-container w100 h1 d-flex-col">
      <span className="heading p10">Customer Report</span>
      {/* <div className="select-column-button w100 h30 d-flex-col h40"> */}
      <div className="middel-filter-applay-div w100 h20 d-flex-col">
        <div className="dropdown-filter-checkbox-div w100 h50 d-flex ">
          <div className="dropdown-filter-div w70 h1 d-flex sa">
            <div className="active-not-active-data w30 h90 d-flex j-center a-center ">
              <span className="info-text w80">Active :</span>
              <select
                className="w80 data"
                value={dropdownValue}
                onChange={(e) => setDropdownValue(e.target.value)}>
                <option value="1">All</option>
                <option value="2">Active</option>
                <option value="3">Non Active</option>
              </select>
            </div>
            <div className="active-not-active-data w30 h90 d-flex j-center a-center">
              <span className="info-text w80">Memeber :</span>
              <select
                value={isSabhasadFilter}
                onChange={(e) => setIsSabhasadFilter(e.target.value)}
                className="w80 data"
                name="Member"
                id="001">
                <option value="001">All</option>
                <option value="001">Member</option>
                <option value="001">Non-Member</option>
              </select>
            </div>
          </div>
          <div className="dropdown-filter-div w70 h1 d-flex sa">
            <div className="active-not-active-data w30 h90 d-flex j-center a-center">
              <span className="info-text w80">Milk Type:</span>
              <select
                className="w80 data"
                value={milkTypeFilter}
                onChange={(e) => setMilkTypeFilter(e.target.value)}>
                <option value="All">All</option>
                <option value="Cow">Cow</option>
                <option value="Buffalo">Buffalo</option>
              </select>
            </div>
          </div>
          <div className="centerwise-data-show w30 h60 d-flex sa a-center ">
            <span className="info-text w20">Centerwise</span>
            <select className="data w60" name="selection" id="001">
              <option value=""></option>
            </select>
          </div>
          <div className="checkboxcommission-Deposite w40 h1 d-flex ">
            <div className="commission-checkbox w50 h70 d-flex sa a-center ">
              <input
                type="checkbox"
                checked={commissionFilter}
                onChange={(e) => setCommissionFilter(e.target.checked)}
              />
              <span className="info-text w50">Commission</span>
            </div>
            <div className="commission-checkbox w50 h70 d-flex sa a-center">
              <input
                type="checkbox"
                checked={depositFilter}
                onChange={(e) => setDepositFilter(e.target.checked)}
              />
              <span className="info-text w50">Deposit</span>
            </div>
          </div>
        </div>

        <div className="centerwise-and-button-div w100 h50 d-flex">
          {/* <div className="centerwise-data-show w30 h60 d-flex sa a-center ">
              <span className="info-text w20">Centerwise</span>
              <select className="data w60" name="selection" id="001">
                <option value=""></option>
              </select>
            </div> */}
          <div className="data-show-buttons d-flex w50 h40 sa a-center">
            <button className="w-btn" onClick={handleClear}>
              Reset
            </button>
            <button className="w-btn" onClick={exportToExcel}>
              Excel
            </button>
            <button className="w-btn" onClick={exportToPDF}>
              PDF
            </button>
            <button className="w-btn" onClick={handlePrint}>
              Print
            </button>
          </div>
        </div>
      </div>
      <div className="select-column-div w100 h10 d-flex-col  ">
        <div className="select-column-div w10 d-flex ">
          <span className="info-text w100 h1 d-flex ">Select Column</span>
        </div>

        <div className="hide-selection-selection-bar d-flex w90 h70 bg">
          <select className="w15 data" onChange={handleColumnCountChange}>
            {[...Array(6).keys()].map((num) => (
              <option key={num + 1} value={num + 1}>
                {num + 1}
              </option>
            ))}
          </select>

          {[...Array(numberOfColumns)].map((_, i) => (
            <select
              className="w30 data"
              key={i}
              onChange={(e) => handleColumnSelection(e, i)}
              value={selectedColumns[i] || ""}>
              <option value="">Select Column</option>
              {dropdown}
            </select>
          ))}
        </div>
      </div>
      {/* </div> */}

      {/* <table
        className="customer-table mh60 w100 hidescrollbar bg"
        id="customer-table"
      >
        <thead>
          <tr>
            {Object.values(selectedColumns)
              .filter(Boolean)
              .map((col, idx) => {
                const subName = Object.keys(columnOptions).find(
                  (key) => columnOptions[key] === col
                );
                return <th key={idx}>{subName}</th>; // Display the sub-name
              })}
          </tr>
        </thead>
        <tbody>
          {filteredData.length === 0 ||
          Object.values(selectedColumns).filter(Boolean).length === 0 ? (
            <tr className="w100 h1 d-flex center">
              <td colSpan="6" className="no-data-message">
                Please select Table columns
              </td>
            </tr>
          ) : (
            filteredData.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {Object.values(selectedColumns)
                  .filter(Boolean)
                  .map((col, colIndex) => (
                    <td key={colIndex}>
                      {col === "createdon"
                        ? row[col]?.slice(0, 10) || "0"
                        : row[col] || "0"}
                    </td>
                  ))}
              </tr>
            ))
          )}
        </tbody>
      </table> */}
      <div className="table-container hidescrollbar">
        <table className="customer-table mh60 w100 bg" id="customer-table">
          <thead>
            <tr>
              {Object.values(selectedColumns)
                .filter(Boolean)
                .map((col, idx) => {
                  const subName = Object.keys(columnOptions).find(
                    (key) => columnOptions[key] === col
                  );
                  return <th key={idx}>{subName}</th>;
                })}
            </tr>
          </thead>
          <tbody>
            {filteredData.length === 0 ||
            Object.values(selectedColumns).filter(Boolean).length === 0 ? (
              <tr className="w100 h1 d-flex center">
                <td colSpan="6" className="no-data-message">
                  Please select Table columns
                </td>
              </tr>
            ) : (
              filteredData.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {Object.values(selectedColumns)
                    .filter(Boolean)
                    .map((col, colIndex) => (
                      <td key={colIndex}>
                        {col === "createdon"
                          ? row[col]?.slice(0, 10) || "0"
                          : row[col] || "0"}
                      </td>
                    ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CustomerReports;
