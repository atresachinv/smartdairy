import React, { useEffect, useRef, useState } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
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

const SanghMilkReport = () => {
  const today = new Date().toISOString().split("T")[0];
  const [fromDate, setFromDate] = useState(today);
  const [toDate, setToDate] = useState(today);
  const [showTable, setShowTable] = useState(false);
  const [isMasterwise, setIsMasterwise] = useState(false);
  const [isParticularDay, setIsParticularDay] = useState(false);
  const [masterData, setMasterData] = useState([]);
  const toDates = useRef(null);
  const fromdate = useRef(null);
  const dispatch = useDispatch();
  const sanghaMilkColl = useSelector((state) => state.sangha.sanghamilkColl);
  const data = useSelector((state) => state.milkCollection.allMilkColl);
  const payMasters = useSelector((state) => state.payment.paymasters || []);
  const dairymilk = useSelector((state) => state.milksales.dairyMilk);

  const centerList = useSelector((state) => state.center.centersList || []);
  const [selectedCenterId, setSelectedCenterId] = useState("");
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
  // useEffect(() => {
  //   if (!payMasters.length || !sanghaMilkColl.length || !dairymilk.length)
  //     return;

  //   const result = payMasters.map((master) => {
  //     const masterId = master._id;
  //     const masterFrom = master.FromDate;
  //     const masterTo = master.ToDate;
  //     const sanghMilk = sanghaMilkColl.filter((item) => {
  //       const d = new Date(item.colldate);
  //       return item.pay_id === masterId && d >= masterFrom && d <= masterTo;
  //     });

  //     const dairyMilk = dairymilk.filter((item) => {
  //       const d = new Date(item.ReceiptDate);
  //       return item.pay_id === masterId && d >= masterFrom && d <= masterTo;
  //     });

  //     const dairyLtr = dairyMilk.reduce(
  //       (sum, d) => sum + Number(d.Litres || 0),
  //       0
  //     );
  //     const goodMilk = sanghMilk.reduce(
  //       (sum, s) => sum + Number(s.liter || 0) + Number(s.evening_liter || 0),
  //       0
  //     );
  //     const rejected = sanghMilk.reduce(
  //       (sum, s) => sum + Number(s.nash_ltr || 0),
  //       0
  //     );
  //     const ghat = dairyLtr > goodMilk ? dairyLtr - goodMilk : 0;
  //     const vaadh = goodMilk > dairyLtr ? goodMilk - dairyLtr : 0;

  //     return {
  //       name: master.name || master.member_name || master.member_code,
  //       masterFrom,
  //       masterTo,
  //       dairyLtr: format(dairyLtr),
  //       goodMilk: format(goodMilk),
  //       rejected: format(rejected),
  //       ghat: format(ghat),
  //       vaadh: format(vaadh),
  //     };
  //   });

  //   setMasterData(result);
  // }, [payMasters, sanghaMilkColl, dairymilk]);

  // useEffect(() => {
  //   if (!payMasters.length || !sanghaMilkColl.length || !dairymilk.length)
  //     return;

  //   const result = payMasters.map((master) => {
  //     const masterId = master._id;
  //     const masterFrom = new Date(master.FromDate);
  //     const masterTo = new Date(master.ToDate);

  //     const sanghMilk = sanghaMilkColl.filter((item) => {
  //       const d = new Date(item.colldate);
  //       return item.pay_id === masterId && d >= masterFrom && d <= masterTo;
  //     });

  //     const dairyMilk = dairymilk.filter((item) => {
  //       const d = new Date(item.ReceiptDate);
  //       return item.pay_id === masterId && d >= masterFrom && d <= masterTo;
  //     });

  //     // ✅ Total dairy litres = Litres (morning) + eveTotalLitres (evening)
  //     const dairyLtr = dairyMilk.reduce(
  //       (sum, d) =>
  //         sum + Number(d.mrgTotalLitres || 0) + Number(d.eveTotalLitres || 0),
  //       0
  //     );

  //     // ✅ Total sangh litres = liter (morning) + evening_liter (evening)
  //     const sanghMilkLtr = sanghMilk.reduce(
  //       (sum, s) => sum + Number(s.liter || 0) + Number(s.liter || 0),
  //       0
  //     );

  //     const rejected = sanghMilk.reduce(
  //       (sum, s) => sum + Number(s.nash_ltr || 0),
  //       0
  //     );

  //     const ghat = dairyLtr > sanghMilkLtr ? dairyLtr - sanghMilkLtr : 0;
  //     const vaadh = sanghMilkLtr > dairyLtr ? sanghMilkLtr - dairyLtr : 0;

  //     return {
  //       name: master.name || master.member_name || master.member_code,
  //       masterFrom,
  //       masterTo,
  //       dairyLtr: format(dairyLtr),
  //       sanghMilkLtr: format(sanghMilkLtr),
  //       rejected: format(rejected),
  //       ghat: format(ghat),
  //       vaadh: format(vaadh),
  //     };
  //   });

  //   setMasterData(result);
  // }, [payMasters, sanghaMilkColl, dairymilk]);

  //..............................PrintMasterwise...................................>
  const printMasterwiseMilkReport = (masterData = []) => {
    const formatDate = (date) => new Date(date).toISOString().split("T")[0];
    const formatDisplayDate = (date) =>
      new Date(date).toLocaleDateString("en-GB");

    // ✅ Calculate Totals
    const totalDairy = masterData.reduce(
      (sum, m) => sum + Number(m.dairyLtr || 0),
      0
    );
    const totalSangh = masterData.reduce(
      (sum, m) => sum + Number(m.sanghMilkLtr || 0),
      0
    );
    const totalRejected = masterData.reduce(
      (sum, m) => sum + Number(m.rejected || 0),
      0
    );
    const totalGhat = masterData.reduce(
      (sum, m) => sum + Number(m.ghat || 0),
      0
    );
    const totalVaadh = masterData.reduce(
      (sum, m) => sum + Number(m.vaadh || 0),
      0
    );

    const htmlContent = `
      <html>
        <head>
          <title>Masterwise Milk Report</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h2, h3, h4 { text-align: center; margin: 5px 0; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td {
              border: 1px solid #000;
              padding: 8px;
              text-align: center;
            }
            th { background-color: #eee; }
            tfoot td {
              font-weight: bold;
              background-color: #f0f0f0;
            }
          </style>
        </head>
        <body>
          <h2>${dairyname || ""}</h2>
          <h3>${CityName || ""}</h3>
          <h4>Master Report</h4>
          <h4>(${formatDisplayDate(fromDate)} ते ${formatDisplayDate(
      toDate
    )})</h4>
  
          <table>
            <thead>
              <tr>
                <th>दिनांक </th>
                <th>डेअरी दूध .लि</th>
                <th>चांगली प्रत .लि</th>
                <th>नाकारलेले .लि</th>
                <th>घट .लि</th>
                <th>वाढ .लि</th>
              </tr>
            </thead>
            <tbody>
              ${masterData
                .map(
                  (m) => `
                <tr>
                  <td>${formatDate(m.masterFrom)} ते ${formatDate(
                    m.masterTo
                  )}</td>
                  <td>${m.dairyLtr}</td>
                  <td>${m.sanghMilkLtr}</td>
                  <td>${m.rejected}</td>
                  <td>${m.ghat}</td>
                  <td>${m.vaadh}</td>
                </tr>
              `
                )
                .join("")}
            </tbody>
            <tfoot>
              <tr>
                <td>एकूण</td>
                <td>${totalDairy.toFixed(2)} .लि</td>
                <td>${totalSangh.toFixed(2)} .लि</td>
                <td>${totalRejected.toFixed(2)} .लि</td>
                <td>${totalGhat.toFixed(2)} .लि</td>
                <td>${totalVaadh.toFixed(2)} .लि</td>
              </tr>
            </tfoot>
          </table>
        </body>
      </html>
    `;

    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
    }
  };

  //-------------------- Particuler Days------------------------------------------->
  const printDairyMilkData = (dairymilk, sanghaMilkColl) => {
    const format = (val, digits = 2) =>
      val === null || val === undefined || isNaN(val)
        ? "-"
        : Number(val).toFixed(digits);

    const formatDate = (date) => new Date(date).toISOString().split("T")[0];
    const formatDisplayDate = (date) =>
      new Date(date).toLocaleDateString("en-GB");

    const getSanghData = (date, shift) => {
      const targetDate = formatDate(date);
      return sanghaMilkColl.find(
        (s) =>
          formatDate(s.colldate) === targetDate &&
          Number(s.shift) === Number(shift)
      );
    };

    const filteredDairyMilk = dairymilk.filter((entry) => {
      const entryDate = new Date(entry.ReceiptDate);
      return entryDate >= new Date(fromDate) && entryDate <= new Date(toDate);
    });

    // ✅ Total variables
    let totalDairyLtr = 0;
    let totalDairyAmt = 0;
    let totalSanghLtr = 0;
    let totalVadh = 0;
    let totalGhat = 0;
    let totalFat = 0;
    let totalSnf = 0;
    let totalSanghFat = 0;
    let totalSanghSnf = 0;
    let totalNashLtr = 0;
    let totalKirkolSale = 0;
    let count = 0;

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
          </style>
        </head>
        <body>
          <h2>${dairyname || ""}</h2>
          <h3>${CityName || ""}</h3>
          <h4>Sangh Milk Report</h4>
          <h4>(${formatDisplayDate(fromDate)} to ${formatDisplayDate(
      toDate
    )})</h4>
  
          <table>
            <thead>
              <tr>
                <th>तारीख</th>
                <th>FAT</th>
                <th>SNF</th>
                <th>डेअरी लिटर</th>
                <th>संघ लिटर</th>
                <th>संघ Fat</th>
                <th>संघ SNF</th>
                <th>नाश लिटर</th>
                <th>किरकोळ विक्री</th>
                <th>वाढ</th>
                <th>घट</th>
              </tr>
            </thead>
            <tbody>
    `;

    filteredDairyMilk.forEach((entry) => {
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

      [
        {
          shiftName: "सकाळ",
          shift: 0,
          litres: mrgTotalLitres,
          fat: mrgAvgFat,
          snf: mrgAvgSnf,
          amt: mrgTotalAmt,
        },
        {
          shiftName: "सायंकाळ",
          shift: 1,
          litres: eveTotalLitres,
          fat: eveAvgFat,
          snf: eveAvgSnf,
          amt: eveTotalAmt,
        },
      ].forEach(({ shiftName, shift, litres, fat, snf, amt }) => {
        const sangh = getSanghData(ReceiptDate, shift);
        const sanghLtr = Number(sangh?.liter || 0);
        const sanghFat = Number(sangh?.fat || 0);
        const sanghSnf = Number(sangh?.snf || 0);
        const nashLtr = Number(sangh?.nash_ltr || 0);
        const kirkolSale = Number(sangh?.kirkol_sale || 0);

        const vadh = sanghLtr > litres ? sanghLtr - litres : 0;
        const ghat = litres > sanghLtr ? litres - sanghLtr : 0;

        // ✅ Accumulate totals
        totalDairyLtr += litres;
        totalDairyAmt += amt;
        totalSanghLtr += sanghLtr;
        totalVadh += vadh;
        totalGhat += ghat;
        totalFat += fat;
        totalSnf += snf;
        totalSanghFat += sanghFat;
        totalSanghSnf += sanghSnf;
        totalNashLtr += nashLtr;
        totalKirkolSale += kirkolSale;
        count++;

        content += `
          <tr>
            <td>
              <div style="display: flex; flex-direction: column;">
                <div>${dateStr}</div>
                <div style="font-size: 11px; font-weight: normal;">${shiftName}</div>
              </div>
            </td>
            <td>${format(fat, 1)}</td>
            <td>${format(snf, 1)}</td>
            <td>
              <div style="display: flex; flex-direction: column;">
                <div>${format(litres, 0)}</div>
                <div style="border-top: 1px solid #000; margin: 2px 0;"></div>
                <div>${format(amt, 0)}</div>
              </div>
            </td>
            <td>${format(sanghLtr)}</td>
            <td>${format(sanghFat, 1)}</td>
            <td>${format(sanghSnf, 1)}</td>
            <td>${format(nashLtr)}</td>
            <td>${format(kirkolSale)}</td>
            <td>${format(vadh)}</td>
            <td>${format(ghat)}</td>
          </tr>
        `;
      });
    });

    content += `
            </tbody>
            <tfoot>
              <tr>
                <td>एकूण</td>
                <td>${format(totalFat / count, 1)}</td>
                <td>${format(totalSnf / count, 1)}</td>
                <td>
                  <div style="display: flex; flex-direction: column;">
                    <div>${format(totalDairyLtr, 0)}</div>
                    <div style="border-top: 1px solid #000; margin: 2px 0;"></div>
                    <div>${format(totalDairyAmt, 0)}</div>
                  </div>
                </td>
                <td>${format(totalSanghLtr)}</td>
                <td>${format(totalSanghFat / count, 1)}</td>
                <td>${format(totalSanghSnf / count, 1)}</td>
                <td>${format(totalNashLtr)}</td>
                <td>${format(totalKirkolSale)}</td>
                <td>${format(totalVadh)}</td>
                <td>${format(totalGhat)}</td>
              </tr>
            </tfoot>
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
  //-------------------------------Filter Masterwise------------------------------------------------>
  const handleMasterwiseChange = (e) => {
    const checked = e.target.checked;
    setIsMasterwise(checked);
    if (checked) setIsParticularDay(false);
  };
const handleParticularDayChange = (e) => {
  setIsParticularDay(e.target.checked);
};

  // Print handler
  const handlePrint = () => {
    if (isMasterwise) {
      printMasterwiseMilkReport(masterData); // ✅ Masterwise Print
    } else if (isParticularDay) {
      printDairyMilkData(dairymilk, sanghaMilkColl); // ✅ Particular Day Print
    } else {
      alert("Please select Masterwise or Particular day");
    }
  };

  // PDF handler
  const handlePDF = () => {
    if (isMasterwise) {
      generateMasterwiseMilkReportPDF(masterData); // ✅ Masterwise PDF
    } else if (isParticularDay) {
    } else {
      alert("Please select Masterwise or Particular day");
    }
  };

  const handleKeyDown = (e, nextRef) => {
    if (e.key === "Enter" && nextRef.current) {
      e.preventDefault();
      nextRef.current.focus();
    }
  };

//   const handleCenterChange = (event) => {
//     setSelectedCenterId(event.target.value);
//   };

// useEffect(() => {
//   if (!payMasters.length || !sanghaMilkColl.length || !dairymilk.length) return;

//   const result = payMasters.map((master) => {
//     const masterId = master._id;
//     const masterFrom = new Date(master.FromDate);
//     const masterTo = new Date(master.ToDate);

//     const sanghMilk = sanghaMilkColl.filter((item) => {
//       const d = new Date(item.colldate);
//       return (
//         item.pay_id === masterId &&
//         d >= masterFrom &&
//         d <= masterTo &&
//         (!selectedCenterId ||
//           String(item.center_id) === String(selectedCenterId))
//       );
//     });

//     const dairyMilk = dairymilk.filter((item) => {
//       const d = new Date(item.ReceiptDate);
//       return (
//         item.pay_id === masterId &&
//         d >= masterFrom &&
//         d <= masterTo &&
//         (!selectedCenterId ||
//           String(item.center_id) === String(selectedCenterId))
//       );
//     });

//     const dairyLtr = dairyMilk.reduce(
//       (sum, d) =>
//         sum + Number(d.mrgTotalLitres || 0) + Number(d.eveTotalLitres || 0),
//       0
//     );
//     const sanghMilkLtr = sanghMilk.reduce(
//       (sum, s) => sum + Number(s.liter || 0) + Number(s.evening_liter || 0),
//       0
//     );
//     const rejected = sanghMilk.reduce(
//       (sum, s) => sum + Number(s.nash_ltr || 0),
//       0
//     );

//     const ghat = dairyLtr > sanghMilkLtr ? dairyLtr - sanghMilkLtr : 0;
//     const vaadh = sanghMilkLtr > dairyLtr ? sanghMilkLtr - dairyLtr : 0;

//     return {
//       name: master.name || master.member_name || master.member_code,
//       masterFrom,
//       masterTo,
//       dairyLtr: dairyLtr.toFixed(1),
//       sanghMilkLtr: sanghMilkLtr.toFixed(1),
//       rejected: rejected.toFixed(1),
//       ghat: ghat.toFixed(1),
//       vaadh: vaadh.toFixed(1),
//     };
//   });

//   setMasterData(result);
// }, [payMasters, sanghaMilkColl, dairymilk, selectedCenterId]);


const handleCenterChange = (event) => {
  setSelectedCenterId(event.target.value);
};




useEffect(() => {
  if (!payMasters.length || !sanghaMilkColl.length || !dairymilk.length) return;

  let result = [];

  if (isParticularDay) {
    // Flatten based on date directly, NOT pay_id
    const dateWiseMap = {};

    const allDates = new Set([
      ...sanghaMilkColl.map((item) => item.colldate),
      ...dairymilk.map((item) => item.ReceiptDate),
    ]);

    allDates.forEach((dateStr) => {
      const date = new Date(dateStr);

      const dairyFiltered = dairymilk.filter(
        (d) =>
          new Date(d.ReceiptDate).toISOString().slice(0, 10) ===
            date.toISOString().slice(0, 10) &&
          (!selectedCenterId ||
            String(d.center_id) === String(selectedCenterId))
      );

      const sanghFiltered = sanghaMilkColl.filter(
        (s) =>
          new Date(s.colldate).toISOString().slice(0, 10) ===
            date.toISOString().slice(0, 10) &&
          (!selectedCenterId ||
            String(s.center_id) === String(selectedCenterId))
      );

      const dairyLtr = dairyFiltered.reduce(
        (sum, d) =>
          sum +
          parseFloat(d.mrgTotalLitres || 0) +
          parseFloat(d.eveTotalLitres || 0),
        0
      );

      const sanghLtr = sanghFiltered.reduce(
        (sum, s) =>
          sum + parseFloat(s.liter || 0) + parseFloat(s.evening_liter || 0),
        0
      );

      const rejected = sanghFiltered.reduce(
        (sum, s) => sum + parseFloat(s.nash_ltr || 0),
        0
      );

      const ghat = dairyLtr > sanghLtr ? dairyLtr - sanghLtr : 0;
      const vaadh = sanghLtr > dairyLtr ? sanghLtr - dairyLtr : 0;

      result.push({
        masterFrom: date,
        masterTo: date,
        dairyLtr: format(dairyLtr),
        sanghMilkLtr: format(sanghLtr),
        rejected: format(rejected),
        ghat: format(ghat),
        vaadh: format(vaadh),
      });
    });
  } else {
    // Masterwise view
    result = payMasters.map((master) => {
      const masterId = master._id;
      const masterFrom = new Date(master.FromDate);
      const masterTo = new Date(master.ToDate);

      const sanghMilk = sanghaMilkColl.filter((item) => {
        const d = new Date(item.colldate);
        return (
          item.pay_id === masterId &&
          d >= masterFrom &&
          d <= masterTo &&
          (!selectedCenterId ||
            String(item.center_id) === String(selectedCenterId))
        );
      });

      const dairyMilk = dairymilk.filter((item) => {
        const d = new Date(item.ReceiptDate);
        return (
          item.pay_id === masterId &&
          d >= masterFrom &&
          d <= masterTo &&
          (!selectedCenterId ||
            String(item.center_id) === String(selectedCenterId))
        );
      });

      const dairyLtr = dairyMilk.reduce(
        (sum, d) =>
          sum +
          parseFloat(d.mrgTotalLitres || 0) +
          parseFloat(d.eveTotalLitres || 0),
        0
      );

      const sanghMilkLtr = sanghMilk.reduce(
        (sum, s) =>
          sum + parseFloat(s.liter || 0) + parseFloat(s.evening_liter || 0),
        0
      );

      const rejected = sanghMilk.reduce(
        (sum, s) => sum + parseFloat(s.nash_ltr || 0),
        0
      );

      const ghat = dairyLtr > sanghMilkLtr ? dairyLtr - sanghMilkLtr : 0;
      const vaadh = sanghMilkLtr > dairyLtr ? sanghMilkLtr - dairyLtr : 0;

      return {
        name: master.name || master.member_name || master.member_code,
        masterFrom,
        masterTo,
        dairyLtr: format(dairyLtr),
        sanghMilkLtr: format(sanghMilkLtr),
        rejected: format(rejected),
        ghat: format(ghat),
        vaadh: format(vaadh),
      };
    });
  }

  setMasterData(result);
}, [payMasters, sanghaMilkColl, dairymilk, selectedCenterId, isParticularDay]);

  return (
    <div className="milk-sangha-report-container w100 h1 d-flex-col bg">
      <span className="heading px10 bg3">दुध संघ रिपोर्ट</span>

      <div className="sangh-milk-report-dates-button w100 h30 d-flex-col sa bg3 ">
        <div className="sangh-milk-report-dates w100 h20 d-flex ">
          <div className="fromdate-sangh-milk w50 h40 d-flex a-center">
            <span className="w30 px10 label-text">From:</span>
            <input
              className="data w50"
              type="date"
              onKeyDown={(e) => handleKeyDown(e, toDates)}
              value={fromDate}
              ref={fromdate}
              onChange={(e) => setFromDate(e.target.value)}
            />
          </div>
          <div className="todate-sangh-milk w50 h40 d-flex a-center">
            <span className="w30 px10 label-text">To:</span>
            <input
              className="data w50 "
              type="date"
              value={toDate}
              ref={toDates}
              onChange={(e) => setToDate(e.target.value)}
            />
          </div>
        </div>
        <div className="select-15days-and-single-day-report w100  h30 d-flex px10 a-center">
          <div className="select-15days-and-single-day-report w100  d-flex px10 a-center">
            <div className="masterwise-perticuler-checks-div w70 d-flex a-center h25 ">
              <div className="as-per-master w50  d-flex px10 a-center">
                <input
                  className="w40"
                  type="checkbox"
                  checked={isMasterwise}
                  onChange={handleMasterwiseChange}
                />
                <span className="label-text w30">Masterwise</span>
              </div>
              <div className="as-per-master w50 h20 d-flex px10 a-center">
                <input
                  className="w30"
                  type="checkbox"
                  checked={isParticularDay}
                  onChange={handleParticularDayChange}
                />
                <span className="label-text w80">Particular day</span>
              </div>
            </div>
            <div className="center-selection-payment-div w30 d-flex a-center">
              <span className="label-text w50">Center</span>
           <select
  className="data w80"
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
        </div>
        <div className="sangh-milk-report-button w50 d-flex a-center sa">
          <button className="w-btn" onClick={handleShowbtn}>
            Show
          </button>
          <button className="w-btn" onClick={handlePrint}>
            Print
          </button>
        </div>
      </div>
      {showTable && isMasterwise && (
        <div className="milksangh-report-contianer w100 h70 d-flex-col">
          <div className="milk-sangh-report-table-heading w100 h10 d-flex sa bg7">
            <span className="label-text w25">Date</span>
            <span className="label-text w15">डेअरी दुध.ltr</span>
            <span className="label-text w15">चांगली प्रत.ltr</span>
            <span className="label-text w15">नाकारलेले.ltr</span>
            <span className="label-text w15">घट.ltr</span>
            <span className="label-text w15">वाढ.ltr</span>
          </div>

          {masterData.length === 0 ? (
            <div className="no-data-msg w100 d-flex j-center mt20">
              No data available for selected center.
            </div>
          ) : (
            masterData.map((m, idx) => (
              <div
                key={idx}
                className="milk-sangh-report-table-data w100 h10 d-flex sa"
                style={{ backgroundColor: idx % 2 === 0 ? "#faefe3" : "#fff" }}
              >
                <span className="label-text w25">
                  {new Date(m.masterFrom).toISOString().slice(0, 10)} ते{" "}
                  {new Date(m.masterTo).toISOString().slice(0, 10)}
                </span>
                <span className="label-text w15">{m.dairyLtr}</span>
                <span className="label-text w15">{m.sanghMilkLtr}</span>
                <span className="label-text w15">{m.rejected}</span>
                <span className="label-text w15">{m.ghat}</span>
                <span className="label-text w15">{m.vaadh}</span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default SanghMilkReport;
