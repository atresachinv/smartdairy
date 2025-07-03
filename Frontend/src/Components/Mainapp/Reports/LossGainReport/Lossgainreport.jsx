import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { dairydailyLossGain } from "../../../../App/Features/Mainapp/Dairyinfo/milkCollectionSlice";
import "../../../../Styles/Mainapp/Reports/LossGainReport/LossGainReport.css";
import { toast } from "react-toastify";
const Lossgainreport = () => {
  const dispatch = useDispatch();
  const tDate = useSelector((state) => state.date.toDate);
  const dairyColl = useSelector((state) => state.custinfo.dairyColl); // sangha Sales
  const dairyname = useSelector(
    (state) =>
      state.dairy.dairyData.SocietyName || state.dairy.dairyData.center_name
  );
  const CityName = useSelector((state) => state.dairy.dairyData.city);
  const [fromDate, setFromDate] = useState(tDate);
  const [toDate, setToDate] = useState(tDate);
  const [showTable, setShowTable] = useState(false);
  const todateRef = useRef(null);
  const showbtnRef = useRef(null);

  // handle enter press move cursor to next refrence Input -------------------------------->
  const handleKeyDown = (e, nextRef) => {
    if (e.key === "Enter" && nextRef.current) {
      e.preventDefault();
      nextRef.current.focus();
    }
  };

  const handleShowbtn = async (e) => {
    e.preventDefault();
    setShowTable(false);

    if (!fromDate || !toDate) {
      return toast.error("Please select From and To dates");
    }

    try {
      const result = await dispatch(dairydailyLossGain({ fromDate, toDate }));
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
        <span className="heading px10">नफा-तोटा रिपोर्ट :</span>
        <div className="first-loss-gain-report-div w100 h40 d-flex-col bg center ">
          <div className="loss-gain-report-from-to-date-div w90 h30 d-flex    ">
            <div className="loss-gain-from-date-div w50  d-flex a-center ">
              <span className="label-text px10"> पासुन :</span>
              <input
                className="data w60"
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, todateRef)}
              />
            </div>
            <div className="loss-gain-from-date-div w50  d-flex a-center ">
              <span className="label-text px10">पर्यंत :</span>
              <input
                className="data w60"
                type="date"
                value={toDate}
                ref={todateRef}
                onChange={(e) => setToDate(e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, showbtnRef)}
              />
            </div>
          </div>
          <div className="button-loss-gain-div w90 d-flex a-center sa">
            <button className="w-btn" ref={showbtnRef} onClick={handleShowbtn}>
              दाखवा
            </button>
            <button
              className="w-btn"
              onClick={() => printDairyLossGainReport(dairyColl)}
            >
              प्रिंट
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Lossgainreport;
