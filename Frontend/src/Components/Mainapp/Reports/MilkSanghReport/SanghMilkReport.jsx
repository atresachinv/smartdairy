// import React, { useEffect, useState } from "react";
// import jsPDF from "jspdf";
// import "jspdf-autotable";
// import "../../../../Styles/SanghMilkReport/SanghMilkReport.css";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   fetchsanghaLedger,
//   fetchsanghaMilkColl,
//   fetchsanghaMilkDetails,
// } from "../../../../App/Features/Mainapp/Sangha/sanghaSlice";

// import { getAllMilkCollReport } from "../../../../App/Features/Mainapp/Milk/MilkCollectionSlice";
// import { getPayMasters } from "../../../../App/Features/Payments/paymentSlice";
// import { getDairyCollection } from "../../../../App/Features/Mainapp/Milksales/milkSalesSlice";
// const SanghMilkReport = () => {
//   const [fromDate, setFromDate] = useState("");
//   const [toDate, setToDate] = useState("");
//   const [showTable, setShowTable] = useState(false);
//   const dispatch = useDispatch();
//   const sanghaMilkColl = useSelector((state) => state.sangha.sanghamilkColl);
//   const data = useSelector((state) => state.milkCollection.allMilkColl);
//   const payMasters = useSelector((state) => state.payment.paymasters || []);
//   const dairymilk = useSelector((state) => state.milksales.dairyMilk); // sangha Sales

//   const dairyname = useSelector(
//     (state) =>
//       state.dairy.dairyData.SocietyName || state.dairy.dairyData.center_name
//   );
//   const CityName = useSelector((state) => state.dairy.dairyData.city);

//   const [isMasterwise, setIsMasterwise] = useState(false);
//   const [isParticularDay, setIsParticularDay] = useState(false);

//   const handleShowbtn = async (e) => {
//     e.preventDefault();
//     setShowTable(false);
//     dispatch(fetchsanghaMilkColl({ fromDate, toDate }));
//     dispatch(fetchsanghaMilkDetails({ fromDate, toDate }));
//     dispatch(getAllMilkCollReport({ fromDate, toDate }));
//     dispatch(getDairyCollection({ fromDate, toDate }));

//     dispatch(fetchsanghaLedger({ fromDate, toDate }));
//     setShowTable(true);
//   };

//   ///.......
//   useEffect(() => {
//     if (payMasters.length === 0) {
//       dispatch(getPayMasters());
//     }
//   }, []);
//   console.log("sanghaMilkColl", sanghaMilkColl);
//   // console.log("sanghaSales", sanghaSales);
//   console.log("Dairymilk", dairymilk);
//   console.log("payMasters", payMasters);
//   // Calculate values
//   const totalDairyMilk = data?.reduce(
//     (sum, item) => sum + Number(item.Litres || 0),
//     0
//   );
//   const totalGoodMilk = sanghaMilkColl?.reduce(
//     (sum, item) =>
//       sum + Number(item.liter || 0) + Number(item.evening_ltr || 0),
//     0
//   );
//   const totalRejectedMilk = sanghaMilkColl?.reduce(
//     (sum, item) => sum + Number(item.nash_ltr || 0),
//     0
//   );
//   const ghatRaw = totalDairyMilk - totalGoodMilk;
//   const vaadhRaw = totalGoodMilk - totalDairyMilk;

//   const ghat = ghatRaw < 0 ? "0.00" : ghatRaw.toFixed(2);
//   const vaadh = vaadhRaw < 0 ? "0.00" : vaadhRaw.toFixed(2);

//   //....PDF
//   const generateSanghMilkReportPDF = () => {
//     const doc = new jsPDF();

//     // Heading
//     doc.setFontSize(14);
//     doc.text(`${dairyname || ""}, ${CityName || ""}`, 105, 15, {
//       align: "center",
//     });

//     doc.setFontSize(12);
//     doc.text("milk Collection Report", 105, 25, { align: "center" });
//     doc.text(`Date: ${fromDate} ते ${toDate}`, 105, 33, { align: "center" });

//     // Table data
//     const tableColumnHeaders = [
//       "Date",
//       "Dairy Milk collection",
//       "Sangh Milk Collection",
//       "Low Qauality",
//       "Rejected",
//       "Retail milk sales",
//       "decline",
//       "growth",
//     ];

//     const tableRow = [
//       `${fromDate} TO ${toDate}`,
//       totalDairyMilk,
//       totalGoodMilk,
//       "0",
//       totalRejectedMilk,
//       "0.00",
//       ghat,
//       vaadh,
//     ];

//     doc.autoTable({
//       head: [tableColumnHeaders],
//       body: [tableRow],
//       startY: 40,
//       styles: {
//         halign: "center",
//         fontSize: 10,
//       },
//       headStyles: {
//         fillColor: [204, 229, 255],
//         textColor: [0, 0, 0],
//         fontStyle: "bold",
//       },
//     });

//     doc.save(`Sangh_Milk_Report_${fromDate}_to_${toDate}.pdf`);
//   };

//   const printSanghMilkReport = () => {
//     const printWindow = window.open("", "_blank");
//     if (!printWindow) return;

//     const htmlContent = `
//       <html>
//         <head>
//           <title>दूध संघ रिपोर्ट</title>
//           <style>
//             body {
//               font-family: Arial, sans-serif;
//               padding: 20px;
//               text-align: center;
//             }
//             h2, h4 {
//               margin: 5px 0;
//             }
//             table {
//               width: 100%;
//               border-collapse: collapse;
//               margin-top: 20px;
//               font-size: 14px;
//             }
//             th, td {
//               border: 1px solid #000;
//               padding: 8px;
//               text-align: center;
//             }
//             th {
//               background-color: #e0f0ff;
//             }
//           </style>
//         </head>
//         <body>
//           <h2>${dairyname || ""}, ${CityName || ""}</h2>
//           <h4>दूध संकलन विवरण अहवाल</h4>
//           <h4>दिनांक: ${fromDate} ते ${toDate}</h4>

//           <table>
//             <thead>
//               <tr>
//                 <th>Date</th>
//                 <th>डेअरी दुध</th>
//                 <th>चांगली प्रत</th>
//                 <th>कमी प्रत</th>
//                 <th>नाकारलेले</th>
//                 <th>किरकोळ दुध विक्री</th>
//                 <th>घट</th>
//                 <th>वाढ</th>
//               </tr>
//             </thead>
//             <tbody>
//               <tr>
//                 <td>${fromDate} ते ${toDate}</td>
//                 <td>${totalDairyMilk.toFixed(2)}</td>
//                 <td>${totalGoodMilk.toFixed(2)}</td>
//                 <td>0</td>
//                 <td>${totalRejectedMilk.toFixed(2)}</td>
//                 <td>0.00</td>
//                 <td>${ghat}</td>
//                 <td>${vaadh}</td>
//               </tr>
//             </tbody>
//           </table>

//           <script>
//             window.onload = function () {
//               window.print();
//               setTimeout(() => window.close(), 1000);
//             };
//           </script>
//         </body>
//       </html>
//     `;

//     printWindow.document.open();
//     printWindow.document.write(htmlContent);
//     printWindow.document.close();
//   };

//   const printDairyMilkData = (dairymilk, sanghaMilkColl) => {
//     const format = (val, digits = 2) =>
//       val === null || val === undefined || isNaN(val)
//         ? "-"
//         : Number(val).toFixed(digits);

//     const formatDate = (date) => new Date(date).toISOString().split("T")[0];
//     const formatDisplayDate = (date) =>
//       new Date(date).toLocaleDateString("en-GB");

//     const getSanghData = (date, shift) => {
//       const targetDate = formatDate(date);
//       return sanghaMilkColl.find(
//         (s) =>
//           formatDate(s.colldate) === targetDate &&
//           Number(s.shift) === Number(shift)
//       );
//     };

//     const filteredDairyMilk = dairymilk.filter((entry) => {
//       const entryDate = new Date(entry.ReceiptDate);
//       return entryDate >= new Date(fromDate) && entryDate <= new Date(toDate);
//     });

//     let totalDairyLtr = 0;
//     let totalDairyAmt = 0;
//     let totalSanghLtr = 0;
//     let totalVadh = 0;
//     let totalGhat = 0;

//     const printWindow = window.open("", "_blank");

//     let content = `
//       <html>
//         <head>
//           <title>Dairy & Sangh Milk Report</title>
//           <style>
//             body { font-family: Arial; padding: 20px; }
//             h2, h3, h4 { text-align: center; margin: 4px 0; }
//             table { width: 100%; border-collapse: collapse; font-size: 12px; margin-top: 15px; }
//             th, td { border: 1px solid #000; padding: 6px; text-align: center; vertical-align: middle; }
//             th { background-color: #f0f0f0; }
//             tfoot tr { font-weight: bold; background: #f9f9f9; }
//           </style>
//         </head>
//         <body>
//           <h2>${dairyname || ""}</h2>
//           <h3>${CityName || ""}</h3>
//           <h4>Sangh Milk Report (${formatDisplayDate(
//             fromDate
//           )} to ${formatDisplayDate(toDate)})</h4>

//           <table>
//             <thead>
//               <tr>
//                 <th>तारीख</th>
//                 <th>FAT</th>
//                 <th>SNF</th>
//                 <th>डेअरी लिटर/रक्कम</th>
//                 <th>संघ लिटर</th>
//                 <th>संघ Fat</th>
//                 <th>संघ SNF</th>
//                 <th>नाश लिटर</th>
//                 <th>किरकोळ विक्री</th>
//                 <th>वाढ</th>
//                 <th>घट</th>
//               </tr>
//             </thead>
//             <tbody>
//     `;

//     filteredDairyMilk.forEach((entry) => {
//       const {
//         ReceiptDate,
//         mrgTotalLitres = 0,
//         mrgAvgFat = 0,
//         mrgAvgSnf = 0,
//         mrgTotalAmt = 0,
//         eveTotalLitres = 0,
//         eveAvgFat = 0,
//         eveAvgSnf = 0,
//         eveTotalAmt = 0,
//       } = entry;

//       const dateStr = formatDisplayDate(ReceiptDate);

//       [
//         {
//           shiftName: "सकाळ",
//           shift: 0,
//           litres: mrgTotalLitres,
//           fat: mrgAvgFat,
//           snf: mrgAvgSnf,
//           amt: mrgTotalAmt,
//         },
//         {
//           shiftName: "सायंकाळ",
//           shift: 1,
//           litres: eveTotalLitres,
//           fat: eveAvgFat,
//           snf: eveAvgSnf,
//           amt: eveTotalAmt,
//         },
//       ].forEach(({ shiftName, shift, litres, fat, snf, amt }) => {
//         const sangh = getSanghData(ReceiptDate, shift);
//         const sanghLtr = sangh?.liter || 0;
//         const sanghFat = sangh?.fat || 0;
//         const sanghSnf = sangh?.snf || 0;
//         const nashLtr = sangh?.nash_ltr || 0;
//         const kirkolSale = sangh?.kirkol_sale || 0;

//         const vadh = sanghLtr > litres ? sanghLtr - litres : 0;
//         const ghat = litres > sanghLtr ? litres - sanghLtr : 0;

//         totalDairyLtr += litres;
//         totalDairyAmt += amt;
//         totalSanghLtr += sanghLtr;
//         totalVadh += vadh;
//         totalGhat += ghat;

//         content += `
//           <tr>
//             <td>
//               <div style="display: flex; flex-direction: column;">
//                 <div>${dateStr}</div>
//                 <div style="font-size: 11px; font-weight: normal;">${shiftName}</div>
//               </div>
//             </td>
//             <td>${format(fat, 1)}</td>
//             <td>${format(snf, 1)}</td>
//             <td>
//               <div style="display: flex; flex-direction: column;">
//                 <div>${format(litres, 0)}</div>
//                 <div style="border-top: 1px solid #000; margin: 2px 0;"></div>
//                 <div>${format(amt, 0)}</div>
//               </div>
//             </td>
//             <td>${format(sanghLtr)}</td>
//             <td>${format(sanghFat, 1)}</td>
//             <td>${format(sanghSnf, 1)}</td>
//             <td>${format(nashLtr)}</td>
//             <td>${format(kirkolSale)}</td>
//             <td>${format(vadh)}</td>
//             <td>${format(ghat)}</td>
//           </tr>
//         `;
//       });
//     });

//     content += `
//             </tbody>
//             <tfoot>
//               <tr>
//                 <td colspan="3">Total</td>
//                 <td>
//                   <div style="display: flex; flex-direction: column;">
//                     <div>${format(totalDairyLtr, 0)}</div>
//                     <div style="border-top: 1px solid #000; margin: 2px 0;"></div>
//                     <div>${format(totalDairyAmt, 0)}</div>
//                   </div>
//                 </td>
//                 <td>${format(totalSanghLtr)}</td>
//                 <td colspan="4"></td>
//                 <td>${format(totalVadh)}</td>
//                 <td>${format(totalGhat)}</td>
//               </tr>
//             </tfoot>
//           </table>
//           <script>
//             window.onload = function () {
//               window.print();
//             };
//           </script>
//         </body>
//       </html>
//     `;

//     printWindow.document.write(content);
//     printWindow.document.close();
//   };

//   const handleMasterwiseChange = (e) => {
//     const checked = e.target.checked;
//     setIsMasterwise(checked);
//     if (checked) setIsParticularDay(false);
//   };

//   const handleParticularDayChange = (e) => {
//     const checked = e.target.checked;
//     setIsParticularDay(checked);
//     if (checked) setIsMasterwise(false);
//   };

//   // Print handler
//   const handlePrint = () => {
//     if (isMasterwise) {
//       printSanghMilkReport(); // ✅ Masterwise Print
//     } else if (isParticularDay) {
//       printDairyMilkData(dairymilk, sanghaMilkColl); // ✅ Particular Day Print
//     } else {
//       alert("Please select Masterwise or Particular day");
//     }
//   };

//   // PDF handler
//   const handlePDF = () => {
//     if (isMasterwise) {
//       generateSanghMilkReportPDF(); // ✅ Masterwise PDF
//     } else if (isParticularDay) {
//       generateDairyMilkPDF(
//         dairymilk,
//         sanghaMilkColl,
//         dairyname,
//         CityName,
//         fromDate,
//         toDate
//       ); // ✅ Particular Day PDF
//     } else {
//       alert("Please select Masterwise or Particular day");
//     }
//   };

//   // Utility to format safely
//   const format = (val, digits = 2) =>
//     val === null || val === undefined || isNaN(val)
//       ? "0.00"
//       : Number(val).toFixed(digits);

//   // Group by PayMaster (e.g., Member ID or Name)
//   const groupedMasterwiseData = payMasters?.map((master) => {
//     const masterId = master._id; // or use member_code or pay_id
//     const name = master.name || master.member_name || master.member_code;

//     const sanghMilk =
//       sanghaMilkColl?.filter((item) => item.pay_id === masterId) || [];

//     const dairyMilk = data?.filter((item) => item.pay_id === masterId) || [];

//     const totalDairyMilk = dairyMilk?.reduce(
//       (sum, item) => sum + Number(item.Litres || 0),
//       0
//     );

//     const totalGoodMilk = sanghMilk?.reduce(
//       (sum, item) =>
//         sum + Number(item.liter || 0) + Number(item.evening_ltr || 0),
//       0
//     );

//     const totalRejectedMilk = sanghMilk?.reduce(
//       (sum, item) => sum + Number(item.nash_ltr || 0),
//       0
//     );

//     const ghat =
//       totalDairyMilk > totalGoodMilk ? totalDairyMilk - totalGoodMilk : 0;
//     const vaadh =
//       totalGoodMilk > totalDairyMilk ? totalGoodMilk - totalDairyMilk : 0;

//     return {
//       name,
//       totalDairyMilk: format(totalDairyMilk),
//       totalGoodMilk: format(totalGoodMilk),
//       totalRejectedMilk: format(totalRejectedMilk),
//       ghat: format(ghat),
//       vaadh: format(vaadh),
//     };
//   });

//   return (
//     <div className="milk-sangha-report-container w100 h1 d-flex-col  ">
//       <span className="heading px10">दुध संघ रिपोर्ट</span>

//       <div className="sangh-milk-report-dates-button w100 h30 d-flex-col sa bg ">
//         <div className="sangh-milk-report-dates w100 h40 d-flex ">
//           <div className="fromdate-sangh-milk w50 h40 d-flex a-center">
//             <span className="w30 px10 label-text">From:</span>
//             <input
//               className="data w50"
//               type="date"
//               value={fromDate}
//               onChange={(e) => setFromDate(e.target.value)}
//             />
//           </div>
//           <div className="todate-sangh-milk w50 h40 d-flex a-center">
//             <span className="w30 px10 label-text">To:</span>
//             <input
//               className="data w50"
//               type="date"
//               value={toDate}
//               onChange={(e) => setToDate(e.target.value)}
//             />
//           </div>
//         </div>
//         <div className="select-15days-and-single-day-report w100 h20 d-flex px10 a-center">
//           <div className="select-15days-and-single-day-report w50 h20 d-flex px10 a-center">
//             <div className="as-per-master w50 h20 d-flex px10 a-center">
//               <input
//                 className="w30"
//                 type="checkbox"
//                 checked={isMasterwise}
//                 onChange={handleMasterwiseChange}
//               />
//               <span className="label-text w30">Masterwise</span>
//             </div>
//             <div className="as-per-master w50 h20 d-flex px10 a-center">
//               <input
//                 className="w30"
//                 type="checkbox"
//                 checked={isParticularDay}
//                 onChange={handleParticularDayChange}
//               />
//               <span className="label-text w80">Particular day</span>
//             </div>
//           </div>

//           {/* Conditionally render masterwise table only */}
//           {isMasterwise && (
//             <div className="milksangh-report-contianer">
//               {/* Render masterwise table here */}
//             </div>
//           )}
//         </div>
//         <div className="sangh-milk-report-button w50 d-flex a-center sa">
//           <button className="w-btn" onClick={handleShowbtn}>
//             Show
//           </button>

//           <button className="w-btn" onClick={handlePrint}>
//             Print
//           </button>

//           <button className="w-btn" onClick={handlePDF}>
//             PDF
//           </button>
//         </div>
//       </div>
//       {showTable && !isParticularDay && (
//         <div className="milksangh-report-contianer w100 h70 d-flex-col ">
//           <div className="milk-sangh-report-table-heading w100 h10 d-flex sa bg7">
//             <span className="label-text w20">Date</span>
//             <span className="label-text w10">डेअरी दुध</span>
//             <span className="label-text w10">चांगली प्रत</span>
//             <span className="label-text w10">कमी प्रत</span>
//             <span className="label-text w10">नाकारलेले</span>
//             <span className="label-text w10">किरकोळ दुध विक्री</span>
//             <span className="label-text w10">घट</span>
//             <span className="label-text w10">वाढ</span>
//           </div>

//           <div className="milk-sangh-report-table-data w100 h60 d-flex sa bg">
//             <span className="label-text w20">
//               {fromDate} TO {toDate}
//             </span>
//             <span className="label-text w10">{totalDairyMilk.toFixed(2)}</span>
//             <span className="label-text w10">{totalGoodMilk.toFixed(2)}</span>
//             <span className="label-text w10">0</span>
//             <span className="label-text w10">
//               {totalRejectedMilk.toFixed(2)}
//             </span>
//             <span className="label-text w10">0.00</span>
//             <span className="label-text w10">{ghat}</span>
//             <span className="label-text w10">{vaadh}</span>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default SanghMilkReport;
// Updated SanghMilkReport component with PayMaster-wise total data based on their FromDate and ToDate
// All original functionality is preserved.

import React, { useEffect, useState } from "react";
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
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [showTable, setShowTable] = useState(false);
  const [isMasterwise, setIsMasterwise] = useState(false);
  const [isParticularDay, setIsParticularDay] = useState(false);
  const [masterData, setMasterData] = useState([]);

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
    if (!payMasters.length || !sanghaMilkColl.length || !data.length) return;

    const result = payMasters.map((master) => {
      const masterId = master._id;

      const masterFrom = new Date(master.FromDate);
      masterFrom.setHours(0, 0, 0, 0);
      const masterTo = new Date(master.ToDate);
      masterTo.setHours(23, 59, 59, 999);

      const sanghMilk = sanghaMilkColl.filter((item) => {
        const d = new Date(item.colldate);
        return item.pay_id === masterId && d >= masterFrom && d <= masterTo;
      });

      const dairyMilk = data.filter((item) => {
        const d = new Date(item.ReceiptDate);
        return item.pay_id === masterId && d >= masterFrom && d <= masterTo;
      });

      const dairyLtr = dairyMilk.reduce(
        (sum, d) => sum + Number(d.Litres || 0),
        0
      );
      const goodMilk = sanghMilk.reduce(
        (sum, s) => sum + Number(s.liter || 0) + Number(s.evening_ltr || 0),
        0
      );
      const rejected = sanghMilk.reduce(
        (sum, s) => sum + Number(s.nash_ltr || 0),
        0
      );
      const ghat = dairyLtr > goodMilk ? dairyLtr - goodMilk : 0;
      const vaadh = goodMilk > dairyLtr ? goodMilk - dairyLtr : 0;

      return {
        name: master.name || master.member_name || master.member_code,
        masterFrom,
        masterTo,
        dairyLtr: format(dairyLtr),
        goodMilk: format(goodMilk),
        rejected: format(rejected),
        ghat: format(ghat),
        vaadh: format(vaadh),
      };
    });

    setMasterData(result);
  }, [payMasters, sanghaMilkColl, data]);

  // console.log("sanghaMilkColl", sanghaMilkColl);
  console.log("dairymilk", dairymilk);
  //.................................................................................>

  const generateSanghMilkReportPDF = () => {
    const doc = new jsPDF();

    // Heading
    doc.setFontSize(14);
    doc.text(`${dairyname || ""}, ${CityName || ""}`, 105, 15, {
      align: "center",
    });

    doc.setFontSize(12);
    doc.text("milk Collection Report", 105, 25, { align: "center" });
    doc.text(`Date: ${fromDate} ते ${toDate}`, 105, 33, { align: "center" });

    // Table data
    const tableColumnHeaders = [
      "Date",
      "Dairy Milk collection",
      "Sangh Milk Collection",
      "Low Qauality",
      "Rejected",
      "Retail milk sales",
      "decline",
      "growth",
    ];

    const tableRow = [
      `${fromDate} TO ${toDate}`,
      totalDairyMilk,
      totalGoodMilk,
      "0",
      totalRejectedMilk,
      "0.00",
      ghat,
      vaadh,
    ];

    doc.autoTable({
      head: [tableColumnHeaders],
      body: [tableRow],
      startY: 40,
      styles: {
        halign: "center",
        fontSize: 10,
      },
      headStyles: {
        fillColor: [204, 229, 255],
        textColor: [0, 0, 0],
        fontStyle: "bold",
      },
    });

    doc.save(`Sangh_Milk_Report_${fromDate}_to_${toDate}.pdf`);
  };

  const printSanghMilkReport = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const htmlContent = `
        <html>
          <head>
            <title>दूध संघ रिपोर्ट</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                padding: 20px;
                text-align: center;
              }
              h2, h4 {
                margin: 5px 0;
              }
              table {
                width: 100%;
                border-collapse: collapse;
                margin-top: 20px;
                font-size: 14px;
              }
              th, td {
                border: 1px solid #000;
                padding: 8px;
                text-align: center;
              }
              th {
                background-color: #e0f0ff;
              }
            </style>
          </head>
          <body>
            <h2>${dairyname || ""}, ${CityName || ""}</h2>
            <h4>दूध संकलन विवरण अहवाल</h4>
            <h4>दिनांक: ${fromDate} ते ${toDate}</h4>
  
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>डेअरी दुध</th>
                  <th>चांगली प्रत</th>
                  <th>कमी प्रत</th>
                  <th>नाकारलेले</th>
                  <th>किरकोळ दुध विक्री</th>
                  <th>घट</th>
                  <th>वाढ</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>${fromDate} ते ${toDate}</td>
                  <td>${totalDairyMilk.toFixed(2)}</td>
                  <td>${totalGoodMilk.toFixed(2)}</td>
                  <td>0</td>
                  <td>${totalRejectedMilk.toFixed(2)}</td>
                  <td>0.00</td>
                  <td>${ghat}</td>
                  <td>${vaadh}</td>
                </tr>
              </tbody>
            </table>
  
            <script>
              window.onload = function () {
                window.print();
                setTimeout(() => window.close(), 1000);
              };
            </script>
          </body>
        </html>
      `;

    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

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

    let totalDairyLtr = 0;
    let totalDairyAmt = 0;
    let totalSanghLtr = 0;
    let totalVadh = 0;
    let totalGhat = 0;

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
            <h4>Sangh Milk Report (${formatDisplayDate(
              fromDate
            )} to ${formatDisplayDate(toDate)})</h4>
  
            <table>
              <thead>
                <tr>
                  <th>तारीख</th>
                  <th>FAT</th>
                  <th>SNF</th>
                  <th>डेअरी लिटर/रक्कम</th>
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
        const sanghLtr = sangh?.liter || 0;
        const sanghFat = sangh?.fat || 0;
        const sanghSnf = sangh?.snf || 0;
        const nashLtr = sangh?.nash_ltr || 0;
        const kirkolSale = sangh?.kirkol_sale || 0;

        const vadh = sanghLtr > litres ? sanghLtr - litres : 0;
        const ghat = litres > sanghLtr ? litres - sanghLtr : 0;

        totalDairyLtr += litres;
        totalDairyAmt += amt;
        totalSanghLtr += sanghLtr;
        totalVadh += vadh;
        totalGhat += ghat;

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
                  <td colspan="3">Total</td>
                  <td>
                    <div style="display: flex; flex-direction: column;">
                      <div>${format(totalDairyLtr, 0)}</div>
                      <div style="border-top: 1px solid #000; margin: 2px 0;"></div>
                      <div>${format(totalDairyAmt, 0)}</div>
                    </div>
                  </td>
                  <td>${format(totalSanghLtr)}</td>
                  <td colspan="4"></td>
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

  const handleMasterwiseChange = (e) => {
    const checked = e.target.checked;
    setIsMasterwise(checked);
    if (checked) setIsParticularDay(false);
  };

  const handleParticularDayChange = (e) => {
    const checked = e.target.checked;
    setIsParticularDay(checked);
    if (checked) setIsMasterwise(false);
  };

  // Print handler
  const handlePrint = () => {
    if (isMasterwise) {
      printSanghMilkReport(); // ✅ Masterwise Print
    } else if (isParticularDay) {
      printDairyMilkData(dairymilk, sanghaMilkColl); // ✅ Particular Day Print
    } else {
      alert("Please select Masterwise or Particular day");
    }
  };

  // PDF handler
  const handlePDF = () => {
    if (isMasterwise) {
      generateSanghMilkReportPDF(); // ✅ Masterwise PDF
    } else if (isParticularDay) {
    } else {
      alert("Please select Masterwise or Particular day");
    }
  };
  return (
    <div className="milk-sangha-report-container w100 h1 d-flex-col">
      <span className="heading px10">दुध संघ रिपोर्ट</span>

      <div className="sangh-milk-report-dates-button w100 h30 d-flex-col sa bg ">
        <div className="sangh-milk-report-dates w100 h40 d-flex ">
          <div className="fromdate-sangh-milk w50 h40 d-flex a-center">
            <span className="w30 px10 label-text">From:</span>
            <input
              className="data w50"
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
          </div>
          <div className="todate-sangh-milk w50 h40 d-flex a-center">
            <span className="w30 px10 label-text">To:</span>
            <input
              className="data w50"
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
          </div>
        </div>
        <div className="select-15days-and-single-day-report w100 h20 d-flex px10 a-center">
          <div className="select-15days-and-single-day-report w50 h20 d-flex px10 a-center">
            <div className="as-per-master w50 h20 d-flex px10 a-center">
              <input
                className="w30"
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
        </div>
        <div className="sangh-milk-report-button w50 d-flex a-center sa">
          <button className="w-btn" onClick={handleShowbtn}>
            Show
          </button>
          <button className="w-btn" onClick={handlePrint}>
            Print
          </button>
          <button className="w-btn" onClick={handlePDF}>
            PDF
          </button>
        </div>
      </div>

      {showTable && isMasterwise && (
        <div className="milksangh-report-contianer w100 h70 d-flex-col">
          <div className="milk-sangh-report-table-heading w100 h10 d-flex sa bg7">
            <span className="label-text w20">Date</span>
            <span className="label-text w15">डेअरी दुध</span>
            <span className="label-text w15">चांगली प्रत</span>
            <span className="label-text w15">नाकारलेले</span>
            <span className="label-text w15">घट</span>
            <span className="label-text w15">वाढ</span>
          </div>
          {masterData.map((m, i) => (
            <div
              className="milk-sangh-report-table-data w100 h10 d-flex sa bg"
              key={i}
            >
              <span className="label-text w20">
                {new Date(m.masterFrom).toISOString().slice(0, 10)} ते{" "}
                {new Date(m.masterTo).toISOString().slice(0, 10)}
              </span>
              <span className="label-text w15">{m.dairyLtr}</span>
              <span className="label-text w15">{m.goodMilk}</span>
              <span className="label-text w15">{m.rejected}</span>
              <span className="label-text w15">{m.ghat}</span>
              <span className="label-text w15">{m.vaadh}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SanghMilkReport;
