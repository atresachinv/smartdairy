import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { dairydailyLossGain } from "../../../../App/Features/Mainapp/Dairyinfo/milkCollectionSlice";
import "../../../../Styles/Mainapp/Reports/LossGainReport/LossGainReport.css";

const Lossgainreport = () => {
  const today = new Date().toISOString().split("T")[0];
  const [fromDate, setFromDate] = useState(today);
  const [toDate, setToDate] = useState(today);
  const toDates = useRef(null);
  const fromdate = useRef(null);
  const centerList = useSelector((state) => state.center.centersList || []);
  const dairyinfo = useSelector((state) => state.dairy.dairyData);
  const [selectedCenterId, setSelectedCenterId] = useState("");
  const [showTable, setShowTable] = useState(false);
  const dispatch = useDispatch();
  const dairyColl = useSelector((state) => state.custinfo.dairyColl); // sangha Sales
  const dairyname = dairyinfo.SocietyName || dairyinfo.center_name;
  const CityName = dairyinfo.city;

  const handleShowbtn = async (e) => {
    e.preventDefault();
    setShowTable(false);

    if (!fromDate || !toDate) {
      alert("Please select From and To dates");
      return;
    }

    try {
      const result = await dispatch(dairydailyLossGain({ fromDate, toDate }));
      const fullData = result.payload || [];

      const filteredByCenter = selectedCenterId
        ? fullData.filter((item) => item.center_id === selectedCenterId)
        : fullData;

      dispatch({
        type: "custinfo/setDairyColl",
        payload: filteredByCenter,
      });

      setShowTable(true);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  const printDairyLossGainReport = (dairyColl = []) => {
    const format = (v, d = 2) =>
      v === null || v === undefined || isNaN(v) ? "-" : Number(v).toFixed(d);

    const formatDate = (date) => new Date(date).toISOString().split("T")[0];
    const displayDate = (date) => new Date(date).toLocaleDateString("en-GB");

    const groupedByDate = {};
    const filteredData = selectedCenterId
      ? dairyColl.filter((entry) => entry.center_id === selectedCenterId)
      : dairyColl;

    filteredData.forEach((entry) => {
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

  const handleKeyDown = (e, nextRef) => {
    if (e.key === "Enter" && nextRef.current) {
      e.preventDefault();
      nextRef.current.focus();
    }
  };

  const handleCenterChange = (e) => {
    setSelectedCenterId(e.target.value);
  };

  return (
    <div className="loss-gain-report-outer-container w100 h1 d-flex center">
      <div className="loss-gain-report-container w70 h1 d-flex-col center">
        <span className="heading px10">Loss gain Report</span>
        <div className="first-loss-gain-report-div w100 h40 d-flex-col bg center ">
          <div className="loss-gain-report-from-to-date-div w90 h30 d-flex">
            <div className="loss-gain-from-date-div w30 d-flex a-center">
              <span className="label-text px10"> From:</span>
              <input
                className="data w70"
                type="date"
                onKeyDown={(e) => handleKeyDown(e, toDates)}
                value={fromDate}
                ref={fromdate}
                onChange={(e) => setFromDate(e.target.value)}
              />
            </div>
            <div className="loss-gain-to-date-div w30 d-flex a-center">
              <span className="label-text px10">To:</span>
              <input
                className="data w70"
                type="date"
                value={toDate}
                ref={toDates}
                onChange={(e) => setToDate(e.target.value)}
              />
            </div>
            <div className="center-selection-loss-gain-div w40 d-flex a-center">
              <span className="label-text w60">Center</span>
              <select
                className="data w90"
                onChange={handleCenterChange}
                value={selectedCenterId}
              >
                <option value="">Select Center</option>
                {centerList.map((center) => (
                  <option key={center.center_id} value={center.center_id}>
                    {center.name || center.center_name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="button-loss-gain-div w90 d-flex a-center sa">
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
