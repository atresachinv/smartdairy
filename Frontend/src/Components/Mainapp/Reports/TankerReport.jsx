import React, { useEffect, useState } from "react";
import { getTankerList } from "../../../App/Features/Mainapp/Masters/tankerMasterSlice";
import { useDispatch, useSelector } from "react-redux";
import { fetchsanghaMilkColl } from "../../../App/Features/Mainapp/Sangha/sanghaSlice";
import jsPDF from "jspdf";
import "jspdf-autotable";
import "../../../Styles/TankarReport/Tankarreport.css";
const TankerReport = () => {
  const dispatch = useDispatch();
  const tankerList = useSelector((state) => state.tanker.tankersList || []);
  const sanghaMilkColl = useSelector((state) => state.sangha.sanghamilkColl);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [mergedData, setMergedData] = useState([]);
  const [selectedTanker, setSelectedTanker] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [showClicked, setShowClicked] = useState(false);

  const dairyname = useSelector(
    (state) =>
      state.dairy.dairyData.SocietyName || state.dairy.dairyData.center_name
  );
  const CityName = useSelector((state) => state.dairy.dairyData.city);

  const handleShowbtn = (e) => {
    e.preventDefault();
    setShowClicked(true); // Set flag to true
    dispatch(getTankerList({ fromDate, toDate }));
    dispatch(fetchsanghaMilkColl({ fromDate, toDate }));
  };

  useEffect(() => {
    if (sanghaMilkColl.length && tankerList.length) {
      const merged = sanghaMilkColl.map((entry) => {
        const tanker = tankerList.find((t) => t.tno === entry.tankerno);
        return {
          ...entry,
          tno: tanker?.tankerno || "",
          ownername: tanker?.ownername || "",
          contactno: tanker?.contactno || "",
          rate: tanker?.rateltr || "",
        };
      });
      setMergedData(merged);
    }
  }, [sanghaMilkColl, tankerList]);

  useEffect(() => {
    if (showClicked && mergedData.length && fromDate && toDate) {
      const filtered = mergedData.filter((item) => {
        const inDateRange =
          new Date(item.colldate) >= new Date(fromDate) &&
          new Date(item.colldate) <= new Date(toDate);

        if (selectedTanker) {
          return item.tno === selectedTanker && inDateRange;
        } else {
          return inDateRange; // show all if no tanker selected
        }
      });

      setFilteredData(filtered);
      setShowClicked(false);
    }
  }, [mergedData, selectedTanker, fromDate, toDate, showClicked]);

  const uniqueTankerNumbers = [
    ...new Set(mergedData.map((item) => item.tno).filter(Boolean)),
  ];

  const generateMergedDataPDF = (
    data,
    dairyname = "Siddhivinayak Dairy",
    CityName = "Ahmednagar",
    fromDate = "",
    toDate = ""
  ) => {
    const doc = new jsPDF();

    // Header
    doc.setFontSize(16);
    doc.text(dairyname, 105, 10, { align: "center" });

    doc.setFontSize(12);
    doc.text(CityName, 105, 18, { align: "center" });

    doc.setFontSize(14);
    doc.text("Tanker Report", 105, 26, { align: "center" });

    doc.setFontSize(11);
    doc.text(`From: ${fromDate}   To: ${toDate}`, 105, 34, { align: "center" });

    // Table columns
    const tableColumn = [
      "No",
      "Date",
      "Shift",
      "FAT",
      "SNF",
      "Liter",
      "Amount",
      "Tanker No",
      "Rate",
    ];

    // Table rows
    const tableRows = data.map((row, index) => [
      index + 1,
      new Date(row.colldate).toISOString().slice(0, 10),
      row.shift === "0" || row.shift === 0 ? "Mrg" : "Eve",
      row.fat,
      row.snf,
      Number(row.liter).toFixed(1),
      (row.liter * row.rate).toFixed(1),
      row.tno,
      Number(row.rate).toFixed(2),
    ]);

    // Totals
    const totalLiter = data
      .reduce((sum, r) => sum + Number(r.liter), 0)
      .toFixed(1);
    const totalAmount = data
      .reduce((sum, r) => sum + Number(r.liter) * Number(r.rate), 0)
      .toFixed(1);
    const totalRounds = data.length;

    // Add properly aligned total row
    tableRows.push([
      "", // No
      "", // Date
      "", // Shift
      "", // FAT
      "Total Round: " + totalRounds, // SNF
      totalLiter, // Liter
      totalAmount, // Amount
      "", // Tanker No
      "", // Rate
    ]);

    // Draw table with alternating row color and colorful header
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 40,
      styles: {
        fontSize: 10,
        halign: "center",
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [0, 102, 204], // Blue header
        textColor: 255,
        fontStyle: "bold",
      },
      alternateRowStyles: {
        fillColor: [250, 239, 227], // Light peach for alternating rows
      },
      rowStyles: {
        fillColor: [255, 255, 255], // Default white
      },
    });

    doc.save("Tanker_Report.pdf");
  };
  
  

  const printMergedData = (data) => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    // Totals
    const totalLiter = data
      .reduce((sum, row) => sum + Number(row.liter), 0)
      .toFixed(1);

    const totalAmount = data
      .reduce((sum, row) => sum + Number(row.liter) * Number(row.rate), 0)
      .toFixed(1);

    const printContent = `
      <html>
        <head>
          <title>Tanker Report</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 20px;
            }
            h2, h3, h4 {
              text-align: center;
              margin: 4px 0;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 20px;
            }
            th, td {
              border: 1px solid #000;
              padding: 6px;
              text-align: center;
            }
            tfoot td {
              font-weight: bold;
            }
          </style>
        </head>
        <body>
          <h2>${dairyname}</h2>
          <h3>Tanker Report</h3>
          <h4>From: ${fromDate} To: ${toDate}</h4>
  
          <table>
            <thead>
              <tr>
                <th>No</th>
                <th>Date</th>
                <th>Shift</th>
                <th>FAT</th>
                 <th>SNF</th>
                <th>Liter</th>
                <th>Amount</th>
                <th>Tanker No</th>
                <th>Rate</th>
               
              </tr>
            </thead>
            <tbody>
              ${data
                .map(
                  (row, index) => `
                <tr>
                  <td>${index + 1}</td>
                  <td>${new Date(row.colldate).toISOString().slice(0, 10)}</td>
                  <td>${
                    row.shift === "0" || row.shift === 0 ? "Mrg" : "Eve"
                  }</td>
                  <td>${row.fat}</td>
                     <td>${row.snf}</td>
                  <td>${Number(row.liter).toFixed(1)}</td>
                  <td>${(row.liter * row.rate).toFixed(1)}</td>
                  <td>${row.tno}</td>
                  <td>${Number(row.rate).toFixed(2)}</td>
       
                </tr>
              `
                )
                .join("")}
            </tbody>
         <tfoot>
  <tr>
    <td colspan="5">Total Round: ${data.length}</td>
    <td>${totalLiter}</td>
    <td>${totalAmount}</td>
    <td colspan="2"></td>
  </tr>
</tfoot>

          </table>
        </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  const totalLiter = filteredData.reduce(
    (sum, row) => sum + Number(row.liter),
    0
  );
  const totalAmount = filteredData.reduce(
    (sum, row) => sum + Number(row.liter) * Number(row.rate),
    0
  );
  console.log("filteredData", filteredData);
  return (
    <div className="tankar-Report-outer-container w100 h1 d-flex-col">
      <span className="heading px10">Tanker Report</span>
      <div className="tankar-report-form-div w100 h30 d-flex-col sa bg ">
        <div className="tankar-report-from-to-date-div w100  d-flex a-center">
          <div className="tankar-from-div w30 d-flex a-center">
            <span className="label-text px10 w50">From</span>
            <input
              className="data w90"
              value={fromDate}
              type="date"
              onChange={(e) => setFromDate(e.target.value)}
            />
          </div>
          <div className="tankar-to-div w30 d-flex px10 a-center">
            <span className="label-text w30">To</span>
            <input
              className="data w90"
              value={toDate}
              type="date"
              onChange={(e) => setToDate(e.target.value)}
            />
          </div>
          <div className="show-button-div-tankar"></div>
        </div>
        <div className="select-tankers-button-div w100 h30 d-flex a-center ">
          <div className="select-master-div w50 d-flex a-center">
            <span className="label-text w50 px10">Select Tankar No</span>
            <select
              className="data w40"
              value={selectedTanker}
              onChange={(e) => setSelectedTanker(e.target.value)}
            >
              <option value="">-- Select --</option>
              {uniqueTankerNumbers.map((tno, index) => (
                <option key={index} value={tno}>
                  {tno}
                </option>
              ))}
            </select>
          </div>
          <div className="tankers-button-div d-flex w50 sa">
            <div className="tankar-number-show-button w20 ">
              <button className="w-btn" onClick={handleShowbtn}>
                Show
              </button>
            </div>
            <div className="tabkar-number-show-button w20">
              <button
                className="w-btn"
                onClick={() => generateMergedDataPDF(filteredData)}
              >
                Pdf
              </button>
            </div>
            <div className="tabkar-number-show-button w20">
              <button
                className="w-btn"
                onClick={() => printMergedData(filteredData)}
              >
                Print
              </button>
            </div>
          </div>
        </div>
      </div>

      {filteredData.length > 0 && (
        <div className="Tankerreport-milk-table w100 h60 d-flex-col mt10">
          {/* Table Header */}
          <div className="Tanker-report-table-header w100 d-flex bg7">
            <span className="label-text w5">No</span>
            <span className="label-text w15">Date</span>
            <span className="label-text w5">Shift</span>
            <span className="label-text w15">FAT</span>
            <span className="label-text w15">Tanker No</span>
            <span className="label-text w15">SNF</span>
            <span className="label-text w10">Liter</span>
            <span className="label-text w10">Rate/Ltr</span>
            <span className="label-text w10">Amount</span>
          </div>

          {/* Table Rows */}
          {filteredData.map((row, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: idx % 2 === 0 ? "#faefe3" : "#fff",
              }}
              className="Tanker-report-data-table-row w100 mx90 hidescrollbar d-flex "
            >
              <span className="label-text w5">{idx + 1}</span>
              <span className="label-text w15">
                {new Date(row.colldate).toISOString().slice(0, 10)}
              </span>
              <span className="label-text w5">
                {row.shift === "0" || row.shift === 0 ? "Mrg" : "Eve"}
              </span>
              <span className="label-text w15">{row.fat}</span>
              <span className="label-text w15">{row.tno}</span>
              <span className="label-text w15">{row.snf}</span>
              <span className="label-text w10">
                {Number(row.liter).toFixed(1)}
              </span>
              <span className="label-text w10">
                {Number(row.rate).toFixed(2)}
              </span>
              <span className="label-text w10">
                {(row.liter * row.rate).toFixed(1)}
              </span>

              {/* Round cell for each row */}
            </div>
          ))}

          {/* Summary / Total Row */}
          <div className="tanker-report-total-row w100 d-flex bg summary-row">
            <span className="label-text w10">Round</span>
            <span className="label-text w10">{filteredData.length}</span>
            <span className="label-text w5"></span>

            <span className="label-text w15"></span>
            <span className="label-text w5"></span>
            <span className="label-text w15"></span>
            <span className="label-text w15"></span>
            <span className="label-text w5">Total:</span>
            <span className="label-text w10">
              {filteredData
                .reduce((sum, r) => sum + Number(r.liter), 0)
                .toFixed(1)}
            </span>
            <span className="label-text w10"></span>
            <span className="label-text w15">
              {filteredData
                .reduce((sum, r) => sum + Number(r.liter) * Number(r.rate), 0)
                .toFixed(1)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default TankerReport;
