import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchsanghaLedger,
  fetchsanghaMilkColl,
  fetchsanghaMilkDetails,
} from "../../../../App/Features/Mainapp/Sangha/sanghaSlice";
import { getAllMilkCollReport } from "../../../../App/Features/Mainapp/Milk/MilkCollectionSlice";


const Lossgainreport = () => {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [showTable, setShowTable] = useState(false);
  const dispatch = useDispatch();
  const sanghaMilkColl = useSelector((state) => state.sangha.sanghamilkColl);
  const data = useSelector((state) => state.milkCollection.allMilkColl);
  const tDate = useSelector((state) => state.date.toDate);
  const sanghaSales = useSelector((state) => state.sangha.sanghaSales); // sangha Sales

  const dairymilk = useSelector((state) => state.milksales.dairyMilk); // sangha Sales
  const sanghaLedger = useSelector((state) => state.sangha.sanghaLedger); // sangha Ledger
  const dairyname = useSelector(
    (state) =>
      state.dairy.dairyData.SocietyName || state.dairy.dairyData.center_name
  );
  const CityName = useSelector((state) => state.dairy.dairyData.city);

  const handleShowbtn = async (e) => {
    e.preventDefault();
    setShowTable(false);
    dispatch(fetchsanghaMilkColl({ fromDate, toDate }));
    dispatch(fetchsanghaMilkDetails({ fromDate, toDate }));
    dispatch(getAllMilkCollReport({ fromDate, toDate }));
    dispatch(getDairyCollection({ fromDate, toDate }));
    dispatch(fetchsanghaLedger({ fromDate, toDate }));
    setShowTable(true);
  };

  console.log("sanghaMilkColl", sanghaMilkColl);
  console.log("dairymilk", dairymilk);

  //..

  const printDairyMilkData = (dairymilk, sanghaMilkColl) => {
    const format = (val, digits = 2) =>
      val === null || val === undefined || isNaN(val)
        ? "-"
        : Number(val).toFixed(digits);

    const formatDate = (date) => new Date(date).toISOString().split("T")[0];
    const formatDisplayDate = (date) =>
      new Date(date).toLocaleDateString("en-GB");

    const getSanghDataForDate = (date) => {
      const targetDate = formatDate(date);
      return sanghaMilkColl.filter(
        (s) => formatDate(s.colldate) === targetDate
      );
    };

    const printWindow = window.open("", "_blank");

    let content = `
    <html>
      <head>
        <title>Dairy & Sangh Milk Report</title>
        <style>
          body { font-family: Arial; padding: 20px; }
          h2, h3, h4 { text-align: center; margin: 4px 0; }
          table { width: 100%; border-collapse: collapse; font-size: 12px; margin-top: 15px; }
          th, td { border: 1px solid #000; padding: 6px; text-align: center; vertical-align: middle; }
          th { background-color: #f0f0f0; }
          tfoot tr { font-weight: bold; background: #f9f9f9; }
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
        <h2>${dairyname || ""}</h2>
        <h3>${CityName || ""}</h3>
        <h4>Sangh Milk Report (${formatDisplayDate(
          fromDate
        )} to ${formatDisplayDate(toDate)})</h4>

        <table>
          <thead>
            <tr>
              <th>तारीख</th>
              <th>डेअरी<br/>संघ लिटर</th>
              <th>FAT<br/>डेअरी / संघ</th>
              <th>SNF<br/>डेअरी / संघ</th>
              <th>Rate<br/>डेअरी / संघ</th>
              <th>Amount<br/>डेअरी / संघ</th>
              <th>किरकोळ विक्री<br/>(लिटर / रक्कम)</th>
              <th>घट / वाढ</th>
              <th>तफावत</th>
            </tr>
          </thead>
          <tbody>
  `;

    dairymilk.forEach((entry) => {
      const {
        ReceiptDate,
        mrgTotalLitres = 0,
        mrgAvgFat = 0,
        mrgAvgSnf = 0,
        mrgTotalAmt = 0,
        eveTotalLitres = 0,
        eveAvgFat = 0,
        eveAvgSnf = 0,
        eveTotalAmt = 0,
      } = entry;

      const dateStr = formatDisplayDate(ReceiptDate);

      // Dairy data
      const dairyLitre = mrgTotalLitres + eveTotalLitres;
      const dairyFat = dairyLitre
        ? (mrgAvgFat * mrgTotalLitres + eveAvgFat * eveTotalLitres) / dairyLitre
        : 0;
      const dairySnf = dairyLitre
        ? (mrgAvgSnf * mrgTotalLitres + eveAvgSnf * eveTotalLitres) / dairyLitre
        : 0;
      const dairyAmt = mrgTotalAmt + eveTotalAmt;
      const dairyRate = dairyLitre ? dairyAmt / dairyLitre : 0;

      // Sangh data
      const sanghEntries = getSanghDataForDate(ReceiptDate);
      const sanghLitre = sanghEntries.reduce(
        (sum, e) => sum + (e?.liter || 0),
        0
      );
      const sanghFat = sanghLitre
        ? sanghEntries.reduce(
            (sum, e) => sum + (e.fat || 0) * (e.liter || 0),
            0
          ) / sanghLitre
        : 0;
      const sanghSnf = sanghLitre
        ? sanghEntries.reduce(
            (sum, e) => sum + (e.snf || 0) * (e.liter || 0),
            0
          ) / sanghLitre
        : 0;
      const sanghAmt = sanghEntries.reduce((sum, e) => sum + (e.amt || 0), 0);
      const sanghRate = sanghLitre ? sanghAmt / sanghLitre : 0;

      const kirkolSaleLitre = sanghEntries.reduce(
        (sum, e) => sum + (e.kirkol_sale || 0),
        0
      );
      const kirkolSaleAmt = kirkolSaleLitre * sanghRate;

      const vadh = sanghLitre > dairyLitre ? sanghLitre - dairyLitre : 0;
      const ghat = dairyLitre > sanghLitre ? dairyLitre - sanghLitre : 0;

      const differance = dairyAmt - sanghAmt;

      const splitCell = (val1, val2, digits = 2) => `
      <div class="split-cell">
        <div>${format(val1, digits)}</div>
        <div class="divider"></div>
        <div>${format(val2, digits)}</div>
      </div>`;

      content += `
      <tr>
        <td>${dateStr}</td>
        <td>${splitCell(dairyLitre, sanghLitre, 0)}</td>
        <td>${splitCell(dairyFat, sanghFat, 1)}</td>
        <td>${splitCell(dairySnf, sanghSnf, 1)}</td>
        <td>${splitCell(dairyRate, sanghRate, 2)}</td>
        <td>${splitCell(dairyAmt, sanghAmt, 0)}</td>
        <td>${splitCell(kirkolSaleLitre, kirkolSaleAmt, 0)}</td>
        <td>${splitCell(ghat, vadh, 0)}</td>
        <td>${format(differance, 0)}</td>
      </tr>
    `;
    });

    content += `
          </tbody>
        </table>
        <script>
          window.onload = function () {
            window.print();
          };
        </script>
      </body>
    </html>
  `;

    printWindow.document.write(content);
    printWindow.document.close();
  };
  //.....
  const printMorningEveningMilkData = (dairymilk, sanghaMilkColl) => {
    const format = (val, digits = 2) =>
      val === null || val === undefined || isNaN(val)
        ? "-"
        : Number(val).toFixed(digits);

    const formatDate = (date) => new Date(date).toISOString().split("T")[0];
    const formatDisplayDate = (date) =>
      new Date(date).toLocaleDateString("en-GB");

    const getSanghDataByShift = (date, shift) => {
      const targetDate = formatDate(date);
      return sanghaMilkColl.filter(
        (e) => formatDate(e.colldate) === targetDate && e.shift === shift
      );
    };

    const printWindow = window.open("", "_blank");

    let content = `
      <html>
        <head>
          <title>Morning & Evening Milk Report</title>
          <style>
            body { font-family: Arial; padding: 20px; }
            h2, h3, h4 { text-align: center; margin: 4px 0; }
            table { width: 100%; border-collapse: collapse; font-size: 12px; margin-top: 15px; }
            th, td { border: 1px solid #000; padding: 6px; text-align: center; vertical-align: middle; }
            th { background-color: #f0f0f0; }
          </style>
        </head>
        <body>
          <h2>${dairyname || ""}</h2>
          <h3>${CityName || ""}</h3>
          <h4>Morning & Evening Milk Report (${formatDisplayDate(
            fromDate
          )} to ${formatDisplayDate(toDate)})</h4>
  
          <table>
            <thead>
              <tr>
                <th>तारीख</th>
                <th>पाळी</th>
                <th>डेअरी लिटर</th>
                <th>संघ लिटर</th>
                <th>FAT डेअरी / संघ</th>
                <th>SNF डेअरी / संघ</th>
                <th>Rate डेअरी / संघ</th>
                <th>Amount डेअरी / संघ</th>
                <th>किरकोळ विक्री (लि/₹)</th>
                <th>घट / वाढ</th>
                <th>तफावत ₹</th>
              </tr>
            </thead>
            <tbody>
    `;

    dairymilk.forEach((entry) => {
      const { ReceiptDate } = entry;
      const dateStr = formatDisplayDate(ReceiptDate);

      ["Morning", "Evening"].forEach((shift) => {
        const isMorning = shift === "Morning";
        const dairyLitres = isMorning
          ? entry.mrgTotalLitres
          : entry.eveTotalLitres;
        const dairyFat = isMorning ? entry.mrgAvgFat : entry.eveAvgFat;
        const dairySnf = isMorning ? entry.mrgAvgSnf : entry.eveAvgSnf;
        const dairyAmt = isMorning ? entry.mrgTotalAmt : entry.eveTotalAmt;
        const dairyRate = dairyLitres ? dairyAmt / dairyLitres : 0;

        const sanghEntries = getSanghDataByShift(
          ReceiptDate,
          isMorning ? "Morning" : "Evening"
        );
        const sanghLitres = sanghEntries.reduce(
          (sum, e) => sum + (e.liter || 0),
          0
        );
        const sanghAmt = sanghEntries.reduce((sum, e) => sum + (e.amt || 0), 0);
        const sanghFat = sanghLitres
          ? sanghEntries.reduce(
              (sum, e) => sum + (e.fat || 0) * (e.liter || 0),
              0
            ) / sanghLitres
          : 0;
        const sanghSnf = sanghLitres
          ? sanghEntries.reduce(
              (sum, e) => sum + (e.snf || 0) * (e.liter || 0),
              0
            ) / sanghLitres
          : 0;
        const sanghRate = sanghLitres ? sanghAmt / sanghLitres : 0;

        const kirkolSaleLitre = sanghEntries.reduce(
          (sum, e) => sum + (e.kirkol_sale || 0),
          0
        );
        const kirkolSaleAmt = kirkolSaleLitre * sanghRate;

        const vadh = sanghLitres > dairyLitres ? sanghLitres - dairyLitres : 0;
        const ghat = dairyLitres > sanghLitres ? dairyLitres - sanghLitres : 0;

        const difference = dairyAmt - sanghAmt;

        content += `
          <tr>
            <td>${dateStr}</td>
            <td>${shift === "Morning" ? "सकाळ" : "संध्याकाळ"}</td>
            <td>${format(dairyLitres, 0)}</td>
            <td>${format(sanghLitres, 0)}</td>
            <td>${format(dairyFat, 1)} / ${format(sanghFat, 1)}</td>
            <td>${format(dairySnf, 1)} / ${format(sanghSnf, 1)}</td>
            <td>${format(dairyRate, 2)} / ${format(sanghRate, 2)}</td>
            <td>${format(dairyAmt, 0)} / ${format(sanghAmt, 0)}</td>
            <td>${format(kirkolSaleLitre, 0)} / ${format(kirkolSaleAmt, 0)}</td>
            <td>${format(ghat, 0)} / ${format(vadh, 0)}</td>
            <td>${format(difference, 0)}</td>
          </tr>
        `;
      });
    });

    content += `
          </tbody>
        </table>
        <script>
          window.onload = function () {
            window.print();
          };
        </script>
      </body>
    </html>`;

    printWindow.document.write(content);
    printWindow.document.close();
  };

  return (
    <>
      <div className="loss-gain-report-container w100 h1 d-flex-col center">
        <span className="heading px10">Loss gain Report</span>
        <div className="first-loss-gain-report-div w100 h40 d-flex-col bg">
          <div className="loss-gain-report-from-to-date-div w70 h30 d-flex ">
            <div className="loss-gain-from-date-div w50  d-flex a-center ">
              <span className="label-text px10"> From:</span>
              <input
                className="data w50"
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
            </div>
            <div className="loss-gain-from-date-div w50  d-flex a-center ">
              <span className="label-text px10">To:</span>
              <input
                className="data w50"
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />
            </div>
            <div className="button-loss-gain-div w50  d-flex a-center ">
              <button className="w-btn" onClick={handleShowbtn}>
                Show
              </button>
            </div>
          </div>
          <div className="loss-gain-checkbox-div w100 h30 d-flex a-center ">
            <div className="checkbox-tanker-time w100 d-flex ">
              <div className="morning-evening-report-checkbox w30 d-flex a-center ">
                <input className="w10" type="checkbox" />
                <span className="label-text"> आजचे( सकाळ+सायंकाळ )</span>
              </div>
              <div className="morning-evening-report-checkbox w30 d-flex a-center ">
                <input className="w10" type="checkbox" />
                <span className="label-text"> कालचे (सायंकाळ+ आजचे सकाळ) </span>
              </div>
              <div className="morning-evening-report-checkbox w30 d-flex a-center ">
                <input className="w10" type="checkbox" />
                <span className="label-text">आजचे चालू संकलन </span>
              </div>
              <div className="morning-evening-report-checkbox w30 d-flex  ">
                <button
                  className="w-btn"
                  onClick={() => printDairyMilkData(dairymilk, sanghaMilkColl)}
                >
                  Download Report
                </button>
              </div>
              <div className="morning-evening-report-checkbox w30 d-flex  ">
                <button
                  className="w-btn"
                  onClick={() =>
                    printMorningEveningMilkData(dairymilk, sanghaMilkColl)
                  }
                >
                  Download Report
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Lossgainreport;
