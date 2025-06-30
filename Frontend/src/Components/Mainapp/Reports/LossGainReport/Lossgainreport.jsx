import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { dairydailyLossGain } from "../../../../App/Features/Mainapp/Dairyinfo/milkCollectionSlice";
import "../../../../Styles/Mainapp/Reports/LossGainReport/LossGainReport.css";
const Lossgainreport = () => {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [showTable, setShowTable] = useState(false);
  const dispatch = useDispatch();
  const dairyColl = useSelector((state) => state.custinfo.dairyColl); // sangha Sales
  const dairyname = useSelector(
    (state) =>
      state.dairy.dairyData.SocietyName || state.dairy.dairyData.center_name
  );
  const CityName = useSelector((state) => state.dairy.dairyData.city);

  const handleShowbtn = async (e) => {
    e.preventDefault();
    setShowTable(false);

    if (!fromDate || !toDate) {
      alert("Please select From and To dates");
      return;
    }

    try {
      const result = await dispatch(dairydailyLossGain({ fromDate, toDate }));
      console.log("Fetched Data:", result.payload); // Debug
      setShowTable(true);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };



  //..
  const printDairyLossGainReport = (dairyColl = []) => {
    const format = (v, d = 2) =>
      v === null || v === undefined || isNaN(v) ? "-" : Number(v).toFixed(d);

    const formatDate = (date) => new Date(date).toISOString().split("T")[0];
    const displayDate = (date) => new Date(date).toLocaleDateString("en-GB");

    const groupedByDate = {};

    dairyColl.forEach((entry) => {
      const date = formatDate(entry.colldate);
      if (!groupedByDate[date]) groupedByDate[date] = {};
      if (entry.type === "dairy") groupedByDate[date].dairy = entry;
      else if (entry.type === "sangh") groupedByDate[date].sangh = entry;
    });

    const printWindow = window.open("", "_blank");

    let content = `
      <html>
        <head>
          <title>Dairy Loss/Gain Report</title>
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
              width: 95%;
              margin: auto;
              border-collapse: collapse;
              font-size: 13px;
              margin-top: 20px;
            }
            th, td {
              border: 1px solid #000;
              padding: 6px;
              text-align: center;
            }
            th {
              background-color: #f0f0f0;
            }
            .split-cell {
              display: flex;
              flex-direction: column;
            }
            .divider {
              border-top: 1px solid #000;
              margin: 2px 0;
            }
          </style>
        </head>
        <body>
          <h2>${dairyname}</h2>
          <h3>${CityName}</h3>
          <h4>दूध संकलन तुलना अहवाल</h4>
          <h4>(${displayDate(fromDate)} ते ${displayDate(toDate)})</h4>
  
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Litres<br/>(Dairy / Sangh)</th>
                <th>FAT<br/>(Dairy / Sangh)</th>
                <th>SNF<br/>(Dairy / Sangh)</th>
                <th>Rate<br/>(Dairy / Sangh)</th>
                <th>Amount<br/>(Dairy / Sangh)</th>
                <th>Difference<br/>(Dairy - Sangh)</th>
              </tr>
            </thead>
            <tbody>
    `;

    Object.entries(groupedByDate).forEach(([date, data]) => {
      const dairy = data.dairy || {};
      const sangh = data.sangh || {};
      const diffAmt = (dairy.totalAmt || 0) - (sangh.totalAmt || 0);

      const splitCell = (val1, val2, digits = 2) => `
        <div class="split-cell">
          <div>${format(val1, digits)}</div>
          <div class="divider"></div>
          <div>${format(val2, digits)}</div>
        </div>`;

      content += `
        <tr>
          <td>${displayDate(date)}</td>
          <td>${splitCell(dairy.totalLitres, sangh.totalLitres, 0)}</td>
          <td>${splitCell(dairy.avgFat, sangh.avgFat, 1)}</td>
          <td>${splitCell(dairy.avgSnf, sangh.avgSnf, 1)}</td>
          <td>${splitCell(dairy.avgRate, sangh.avgRate, 2)}</td>
          <td>${splitCell(dairy.totalAmt, sangh.totalAmt, 0)}</td>
          <td>${format(diffAmt, 0)}</td>
        </tr>
      `;
    });

    content += `
            </tbody>
          </table>
          <script>
            window.onload = function () { window.print(); };
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(content);
    printWindow.document.close();
  };

  return (
    <div className="loss-gain-report-outer-container w100 h1 d-flex center">
      <div className="loss-gain-report-container w60 h1 d-flex-col center">
        <span className="heading px10">Loss gain Report</span>
        <div className="first-loss-gain-report-div w100 h40 d-flex-col bg center ">
          <div className="loss-gain-report-from-to-date-div w90 h30 d-flex    ">
            <div className="loss-gain-from-date-div w50  d-flex a-center ">
              <span className="label-text px10"> From:</span>
              <input
                className="data w50"
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
            </div>
            <div className="loss-gain-to-date-div w50  d-flex a-center ">
              <span className="label-text px10">To:</span>
              <input
                className="data w50"
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />
            </div>
          </div>
          <div className="button-loss-gain-div w90 d-flex a-center sa ">
            <button className="w-btn" onClick={handleShowbtn}>
              Show
            </button>
            <button
              className="w-btn"
              onClick={() => printDairyLossGainReport(dairyColl)}
            >
              Print
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Lossgainreport;
