import React, { useEffect, useRef, useState } from "react";
import "../../../../Styles/SanghMilkReport/SanghMilkReport.css";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchsanghaLedger,
  fetchsanghaMilkColl,
  fetchsanghaMilkDetails,
} from "../../../../App/Features/Mainapp/Sangha/sanghaSlice";
import { getAllMilkCollReport } from "../../../../App/Features/Mainapp/Milk/MilkCollectionSlice";
import { getPayMasters } from "../../../../App/Features/Payments/paymentSlice";
import { getDairyCollection } from "../../../../App/Features/Mainapp/Milksales/milkSalesSlice";

const MilkBuySale = () => {
  const today = new Date().toISOString().split("T")[0];
  const [fromDate, setFromDate] = useState(today);
  const [toDate, setToDate] = useState(today);
  const [showTable, setShowTable] = useState(false);
  const [masterData, setMasterData] = useState([]);

  const toDates = useRef(null);
  const fromdate = useRef(null);
  const dispatch = useDispatch();

  const sanghaMilkColl = useSelector((state) => state.sangha.sanghamilkColl);
  const data = useSelector((state) => state.milkCollection.allMilkColl);
  const payMasters = useSelector((state) => state.payment.paymasters || []);
  const dairymilk = useSelector((state) => state.milksales.dairyMilk);

  const dairyname = useSelector(
    (state) =>
      state.dairy.dairyData.SocietyName || state.dairy.dairyData.center_name
  );
  const CityName = useSelector((state) => state.dairy.dairyData.city);

  const handleShowbtn = async (e) => {
    e.preventDefault();
    setShowTable(false);

    await Promise.all([
      dispatch(fetchsanghaMilkColl({ fromDate, toDate })),
      dispatch(fetchsanghaMilkDetails({ fromDate, toDate })),
      dispatch(getAllMilkCollReport({ fromDate, toDate })),
      dispatch(getDairyCollection({ fromDate, toDate })),
      dispatch(fetchsanghaLedger({ fromDate, toDate })),
    ]);
    setShowTable(true);
  };

  useEffect(() => {
    if (payMasters.length === 0) {
      dispatch(getPayMasters());
    }
  }, [dispatch, payMasters.length]);

  const format = (val, digits = 2) =>
    val === null || val === undefined || isNaN(val)
      ? "0.00"
      : Number(val).toFixed(digits);

  useEffect(() => {
    if (!payMasters.length || !sanghaMilkColl.length || !dairymilk.length)
      return;

    const result = payMasters.map((master) => {
      const masterId = master._id;
      const masterFrom = new Date(master.FromDate);
      const masterTo = new Date(master.ToDate);

      const sanghMilk = sanghaMilkColl.filter((item) => {
        const d = new Date(item.colldate);
        return item.pay_id === masterId && d >= masterFrom && d <= masterTo;
      });

      const dairyMilk = dairymilk.filter((item) => {
        const d = new Date(item.ReceiptDate);
        return item.pay_id === masterId && d >= masterFrom && d <= masterTo;
      });

      const dairyLtr = dairyMilk.reduce(
        (sum, d) =>
          sum + Number(d.mrgTotalLitres || 0) + Number(d.eveTotalLitres || 0),
        0
      );
      const DairytotalAmt = dairyMilk.reduce(
        (sum, d) =>
          sum + Number(d.mrgTotalAmt || 0) + Number(d.eveTotalAmt || 0),
        0
      );

      const sanghMilkLtr = sanghMilk.reduce(
        (sum, s) =>
          sum + Number(s.liter_mrng || s.liter || 0) + Number(s.liter_eve || 0),
        0
      );
      const sanghAmt = sanghMilk.reduce(
        (sum, s) => sum + Number(s.amt || 0),
        0
      );

      return {
        masterFrom,
        masterTo,
        dairyLtr: format(dairyLtr),
        DairytotalAmt: format(DairytotalAmt),
        sanghMilkLtr: format(sanghMilkLtr),
        sanghAmt: format(sanghAmt),
      };
    });

    setMasterData(result);
  }, [payMasters, sanghaMilkColl, dairymilk]);

  const printMasterwiseMilkReport = (masterData = []) => {
    if (!Array.isArray(masterData) || masterData.length === 0) {
      alert("No data available to print.");
      return;
    }

    const formatDate = (date) => new Date(date).toISOString().slice(0, 10);
    const formatDisplayDate = (date) =>
      new Date(date).toLocaleDateString("en-GB");

    const totalDairyAmt = masterData.reduce(
      (sum, m) => sum + Number(m.DairytotalAmt || 0),
      0
    );
    const totalSanghAmt = masterData.reduce(
      (sum, m) => sum + Number(m.sanghAmt || 0),
      0
    );
    const totalProfitLoss = masterData.reduce(
      (sum, m) =>
        sum + (Number(m.sanghAmt || 0) - Number(m.DairytotalAmt || 0)),
      0
    );
    const totalDairyLtr = masterData.reduce(
      (sum, m) => sum + Number(m.dairyLtr || 0),
      0
    );
    const totalSanghLtr = masterData.reduce(
      (sum, m) => sum + Number(m.sanghMilkLtr || 0),
      0
    );

    const htmlContent = `
      <html>
        <head>
          <title>Milk Profit & Loss Report</title>
          <style>
            body { font-family: Arial; padding: 20px; }
            h2, h3, h4 { text-align: center; margin: 4px 0; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 14px; }
            th, td { border: 1px solid #000; padding: 6px 10px; text-align: center; }
            th { background-color: #eee; }
            tr:nth-child(even) { background-color: #faefe3; }
            tfoot td { font-weight: bold; background-color: #f0f0f0; }
          </style>
        </head>
        <body>
          <h2>${dairyname}</h2>
          <h3>${CityName}</h3>
          <h4>Milk Profit & Loss Report</h4>
          <h4>(${formatDisplayDate(fromDate)} ते ${formatDisplayDate(
      toDate
    )})</h4>

          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>डेअरी दुध.ltr</th>
                <th>चांगली प्रत.ltr</th>
                <th>DairyAmt</th>
                <th>SanghAmt</th>
                <th>Profit/Loss</th>
              </tr>
            </thead>
            <tbody>
              ${masterData
                .map((m) => {
                  const profitLoss =
                    Number(m.sanghAmt || 0) - Number(m.DairytotalAmt || 0);
                  return `
                    <tr>
                      <td>${formatDate(m.masterFrom)} ते ${formatDate(
                    m.masterTo
                  )}</td>
                      <td>${m.dairyLtr}</td>
                      <td>${m.sanghMilkLtr}</td>
                      <td>${m.DairytotalAmt}</td>
                      <td>${m.sanghAmt}</td>
                      <td>${profitLoss.toFixed(2)}</td>
                    </tr>`;
                })
                .join("")}
            </tbody>
            <tfoot>
              <tr>
                <td>एकूण</td>
                <td>${totalDairyLtr.toFixed(2)}</td>
                <td>${totalSanghLtr.toFixed(2)}</td>
                <td>${totalDairyAmt.toFixed(2)}</td>
                <td>${totalSanghAmt.toFixed(2)}</td>
                <td>${totalProfitLoss.toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>
        </body>
      </html>`;

    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    }
  };

  return (
    <div className="milk-sangha-report-container w100 h1 d-flex-col bg">
      <span className="heading px10 bg3">Milk Profit & Loss</span>

      <div className="sangh-milk-report-dates-button w100 h30 d-flex-col sa bg3">
        <div className="sangh-milk-report-dates w100 h40 d-flex">
          <div className="fromdate-sangh-milk w50 h40 d-flex a-center">
            <span className="w30 px10 label-text">From:</span>
            <input
              className="data w50"
              type="date"
              value={fromDate}
              ref={fromdate}
              onChange={(e) => setFromDate(e.target.value)}
            />
          </div>
          <div className="todate-sangh-milk w50 h40 d-flex a-center">
            <span className="w20 px10 label-text">To:</span>
            <input
              className="data w50"
              type="date"
              value={toDate}
              ref={toDates}
              onChange={(e) => setToDate(e.target.value)}
            />
          </div>
        </div>

        <div className="sangh-milk-report-button w50 d-flex a-center sa">
          <button className="w-btn" onClick={handleShowbtn}>
            Show
          </button>
          <button
            className="w-btn"
            onClick={() => printMasterwiseMilkReport(masterData)}
          >
            Print
          </button>
        </div>
      </div>

      {showTable && (
        <div className="milksangh-report-contianer w100 h70 d-flex-col">
          {/* Header Row */}
          <div className="milk-sangh-report-table-heading w100 h10 d-flex sa bg7">
            <div className="label-text w25 a-center d-flex">Date</div>
            <div className="label-text w15 a-center d-flex">डेअरी दुध.ltr</div>
            <div className="label-text w15 a-center d-flex">
              चांगली प्रत.ltr
            </div>
            <div className="label-text w15 a-center d-flex">DairyAmt</div>
            <div className="label-text w15 a-center d-flex">SanghAmt</div>
            <div className="label-text w15 a-center d-flex">Profit/Loss</div>
          </div>

          {/* Data Rows */}
          {masterData.map((m, idx) => (
            <div
              key={idx}
              className="milk-sangh-report-table-data w100 h10 d-flex sa"
              style={{
                backgroundColor: idx % 2 === 0 ? "#faefe3" : "#fff",
              }}
            >
              <div className="label-text w25 a-center d-flex">
                {new Date(m.masterFrom).toISOString().slice(0, 10)} ते{" "}
                {new Date(m.masterTo).toISOString().slice(0, 10)}
              </div>
              <div className="label-text w15 a-center d-flex">{m.dairyLtr}</div>
              <div className="label-text w15 a-center d-flex">
                {m.sanghMilkLtr}
              </div>
              <div className="label-text w15 a-center d-flex">
                {m.DairytotalAmt}
              </div>
              <div className="label-text w15 a-center d-flex">{m.sanghAmt}</div>
              <div className="label-text w15 a-center d-flex">
                {(Number(m.sanghAmt) - Number(m.DairytotalAmt)).toFixed(2)}
              </div>
            </div>
          ))}

          {/* Total Row */}
          <div
            className="milk-sangh-report-table-total d-flex bg4"
            style={{
              fontWeight: "bold",
              width: "100%",
              minWidth: "1000px", // Optional if needed
            }}
          >
            <div className="label-text w25 a-center d-flex">Total</div>
            <div className="label-text w15 a-center d-flex">
              {masterData
                .reduce((sum, m) => sum + Number(m.dairyLtr || 0), 0)
                .toFixed(2)}
            </div>
            <div className="label-text w15 a-center d-flex">
              {masterData
                .reduce((sum, m) => sum + Number(m.sanghMilkLtr || 0), 0)
                .toFixed(2)}
            </div>
            <div className="label-text w20 a-center d-flex">
              {masterData
                .reduce((sum, m) => sum + Number(m.DairytotalAmt || 0), 0)
                .toFixed(2)}
            </div>
            <div className="label-text w25 a-center d-flex">
              {masterData
                .reduce((sum, m) => sum + Number(m.sanghAmt || 0), 0)
                .toFixed(2)}
            </div>
            <div className="label-text w20 a-center d-flex">
              {masterData
                .reduce(
                  (sum, m) =>
                    sum +
                    (Number(m.sanghAmt || 0) - Number(m.DairytotalAmt || 0)),
                  0
                )
                .toFixed(2)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MilkBuySale;
