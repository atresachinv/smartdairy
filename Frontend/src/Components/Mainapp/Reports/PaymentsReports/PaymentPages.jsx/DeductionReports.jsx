import React, { useState, useRef, useEffect } from "react";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import { BsCalendar3 } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import Spinner from "../../../../Home/Spinner/Spinner";
import { getPaymentsDeductionInfo } from "../../../../../App/Features/Deduction/deductionSlice";
import "../../../../../Styles/Mainapp/Reports/PaymentReports/PaymentReports.css";

const DeductionReports = () => {
  const { t } = useTranslation(["common", "milkcollection"]);
  const dispatch = useDispatch();
  const manualMaster = useSelector((state) => state.manualMasters.masterlist);

  const customerlist = useSelector((state) => state.customer.customerlist);
  const deduction = useSelector((state) => state.deduction.alldeductionInfo);
  const dairyname = useSelector(
    (state) =>
      state.dairy.dairyData.SocietyName || state.dairy.dairyData.center_name
  );
  const CityName = useSelector((state) => state.dairy.dairyData.city);
  const status = useSelector((state) => state.deduction.deductionstatus);
  const [selectedMaster, setSelectedMaster] = useState("");
  const [selectIndex, setSelectedIndex] = useState([]);
  const [mergedData, setMergedData] = useState([]);
  const [filteredDeduction, setFilteredDeduction] = useState([]);
  const [dnameOptions, setDnameOptions] = useState([]);
  const [selectedDname, setSelectedDname] = useState("");
  console.log(selectedMaster);
  //----------------------------------------------------------------->
  // Handle the date selection --------------------------------------->
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

  // Retrieve selected master from localStorage on component mount
  useEffect(() => {
    const savedMaster = localStorage.getItem("selectedMaster");
    if (savedMaster) {
      setSelectedMaster(JSON.parse(savedMaster));
    }
  }, []);

  //Extract Unique Acc Code and Merge customer names into deduction records ------------->
  useEffect(() => {
    // Extract unique AccCodes from deduction data
    const uniqueAccCodes = [...new Set(deduction.map((item) => item.AccCode))];
    const matchingCustomers = [];
    uniqueAccCodes.forEach((accCode) => {
      const matchingCustomer = customerlist.find(
        (customer) => String(customer.cid) === String(accCode)
      );
      if (matchingCustomer) {
        matchingCustomers.push(matchingCustomer);
      }
    });
    // Merge customer names into deduction records
    const updatedDeduction = deduction.map((deductionItem) => {
      const matchingCustomer = matchingCustomers.find(
        (customer) => String(customer.cid) === String(deductionItem.AccCode)
      );
      return {
        ...deductionItem,
        customerName: matchingCustomer?.cname ?? "-",
        Code: matchingCustomer?.srno ?? "0",
      };
    });

    // Update state with the merged data
    setMergedData(updatedDeduction);
  }, [deduction, customerlist]);

  //Extracting unique danmes ------------------------------------------------------------>
  useEffect(() => {
    if (mergedData.length > 0) {
      // Filter out empty dname values and get unique dnames
      const uniqueDnames = [
        ...new Set(
          mergedData
            .filter((item) => item.dname && item.dname.trim() !== "") // Exclude empty or whitespace-only dnames
            .map((item) => item.dname)
        ),
      ];
      setDnameOptions(uniqueDnames); // Set the deduction types (dname) in the state
    }
  }, [mergedData]);

  // Filter data based on selected dname ------------------------------------------------>
  useEffect(() => {
    if (selectedDname) {
      const filteredData = mergedData.filter(
        (item) => item.dname === selectedDname
      );
      setFilteredDeduction(filteredData); // Set filtered data
    } else {
      // If no deduction type is selected, show all data
      setFilteredDeduction(mergedData);
    }
  }, [selectedDname, mergedData]);

  // >>>>>>>>>> Export data to Excel -------------->

  const exportToExcel = () => {
    if (filteredDeduction.length === 0) {
      toast.error("No data available to export.");
      return;
    }
    // Map the filteredDeduction data to include only the desired columns
    const exportData = filteredDeduction.map((item) => ({
      Code: item.Code,
      customerName: item.customerName,
      Amt: item.AMT,
      Deduction: item.dname,
    }));

    // Create the worksheet from the filtered data
    const worksheet = XLSX.utils.json_to_sheet(exportData);

    // Create a new workbook
    const workbook = XLSX.utils.book_new();

    // Append the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "sheet1");

    // Export the Excel file
    XLSX.writeFile(workbook, "Deduction_Report.xlsx");
  };

  // >>>>>>>>>> Export data to PDF ---------------->
  const exportToPDF = () => {
    if (filteredDeduction.length === 0) {
      toast.error("No data available to export.");
      return;
    }
    const doc = new jsPDF();

    // Define the columns (adjust as per your data structure)
    const columns = [
      { header: "Code", dataKey: "index" },
      { header: "Customer Name", dataKey: "customerName" },
      { header: "Deduction", dataKey: "dname" },
      { header: "Bill No", dataKey: "BillNo" },
      { header: "Amount", dataKey: "Amt" },
    ];

    // Prepare the rows (map the filteredDeduction data)
    const rows = filteredDeduction.map((item, index) => ({
      index: item.Code || "N/A",
      customerName: item.customerName || "N/A",
      dname: item.dname || "N/A",
      BillNo: item.BillNo || "N/A",
      Amt: item.AMT || "N/A",
    }));

    // Page width for centering text
    const pageWidth = doc.internal.pageSize.getWidth();

    // Add dairy name as heading

    const createdby = dairyname;
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    const dairyTextWidth = doc.getTextWidth(createdby);
    doc.text(createdby, (pageWidth - dairyTextWidth) / 2, 15);

    // Add city name(s) below the heading
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    const City = CityName;
    const cityTextWidth = doc.getTextWidth(`City: ${City}`);
    doc.text(`City: ${City}`, (pageWidth - cityTextWidth) / 2, 25);
    // Add Report title
    const reportTitle = "Deduction Report";
    const titleTextWidth = doc.getTextWidth(reportTitle);
    doc.text(reportTitle, (pageWidth - titleTextWidth) / 2, 35);

    // Add date range below the title
    const dateText = `From: ${
      selectedMaster.start
    }  To: ${selectedMaster.end.slice(0, 10)}`;
    doc.setFontSize(10);
    const dateTextWidth = doc.getTextWidth(dateText);
    doc.text(dateText, (pageWidth - dateTextWidth) / 2, 45);

    // Add table
    doc.autoTable({
      columns: columns,
      body: rows,
      startY: 55, // Start position for the table
      headStyles: { fillColor: [22, 160, 133] }, // Custom styling for header
      theme: "grid", // Grid theme for table
    });

    // Save the PDF
    doc.save("Deduction_Report.pdf");
  };

  // >>>>>>>>>> PRINT DATA ------------------------>
  const handlePrint = () => {
    if (filteredDeduction.length === 0) {
      toast.error("No data available to print.");
      return;
    }

    // Prepare HTML content for printing
    let printContent = `
    <html>
      <head>
        <title>Deduction Report</title>
        <style>
          table { width: 100%; border-collapse: collapse; }
          th, td { border: 1px solid black; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; }
        </style>
      </head>
      <body>
        <h2 style="text-align: center;">${dairyname},${CityName}</h2>
        <h3 style="text-align: center;">Deduction Report</h3>
        <h4 style="text-align: center;">From: ${
          selectedMaster.start
        } To: ${selectedMaster.end.slice(0, 10)}</h4>
        <table>
          <thead>
            <tr>
              <th>Code</th>
              <th>Customer Name</th>
              <th>Deduction Type</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
  `;

    // Loop through filtered deduction data to generate rows
    filteredDeduction.forEach((item, index) => {
      printContent += `
      <tr>
        <td>${item.Code}</td>
        <td>${item.customerName}</td>
        <td style="text-align: center;">${item.dname}</td>
        <td style="text-align: right;">${item.AMT}</td>
      </tr>
    `;
    });

    printContent += `
          </tbody>
        </table>
      </body>
    </html>
  `;

    // Open a new window for printing
    const printWindow = window.open("", "_blank");
    printWindow.document.write(printContent);
    printWindow.document.close(); // Close the document to trigger rendering
    printWindow.print(); // Trigger the print dialog
  };

  return (
    <div className="deduction-report-container w100 h1 d-flex-col sb">
      <span className="heading  ">Deduction Report</span>
      <div className="deduction-first-filter-container w100 h10 d-flex-col ">
        <div className="filters-from-to-date-button-div w100 h1 d-flex a-center sa">
          <div className="dates-and-filter-deduction-container w65 h1 d-flex a-center sb">
            <div className="custmize-report-div w50 d-flex a-center sb p10">
              <span className="cl-icon w20 h1 d-flex center info-text">
                <BsCalendar3 />
              </span>

              <select
                className="custom-select label-text w80 h1"
                onChange={handleSelectChange}
              >
                <option>
                  {selectedMaster === "" ? (
                    <span>{t("c-select-master")}</span>
                  ) : (
                    <>
                      {new Date(selectedMaster.start).toLocaleDateString(
                        "en-GB",
                        {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        }
                      )}
                      To :
                      {new Date(selectedMaster.end).toLocaleDateString(
                        "en-GB",
                        {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        }
                      )}
                    </>
                  )}
                </option>
                {manualMaster.map((dates, index) => (
                  <option
                    className="label-text w100 d-flex sa"
                    key={index}
                    value={index}
                    selected={
                      selectedMaster &&
                      selectedMaster.start === dates.start &&
                      selectedMaster.end === dates.end
                    }
                  >
                    {new Date(dates.start).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                    To :
                    {new Date(dates.end).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </option>
                ))}
              </select>
            </div>
            <div className="dropdwoun-div w50 h1 d-flex a-center sb mx10">
              <span className="label-text w45">Deduction Type :</span>
              <select
                className="w50 data"
                value={selectedDname}
                onChange={(e) => setSelectedDname(e.target.value)}
              >
                <option value="">-- Select --</option>
                {dnameOptions.map((dname, index) => (
                  <option key={index} value={dname}>
                    {dname}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="action-buttons-div w35 h1 d-flex a-center j-center sb">
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
      <div className="deduction-data-outer-container w100 h80  d-flex-col mh80 hidescrollbar bg">
        <div className="deduction-heading-container w100 p10  d-flex a-center t-center sb sticky-top t-heading-bg">
          <span className="f-label-text w10">Code</span>
          <span className="f-label-text w50">Customer Name</span>
          <span className="f-label-text w20">Deduction</span>
          <span className="f-label-text w20">Amount</span>
        </div>
        {status === "loading" ? (
          <div className="w100 h80 d-flex center">
            <Spinner />
          </div>
        ) : filteredDeduction.length > 0 ? (
          filteredDeduction.map((item, index) => (
            <div
              key={index}
              className="deduction-data-container w100 h10 d-flex a-center sa"
              style={{
                backgroundColor: index % 2 === 0 ? "#faefe3" : "#fff",
              }}
            >
              <span className="info-text w10 t-start">{item.Code}</span>
              <span className="info-text w45 t-start">{item.customerName}</span>
              <span className="text w20 t-start">{item.dname}</span>
              <span className="info-text w20 t-end px10">{item.AMT}</span>
            </div>
          ))
        ) : (
          <div className="w100 h1 d-flex center">
            <span className="label-text">{t("c-no-data-avai")}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeductionReports;
