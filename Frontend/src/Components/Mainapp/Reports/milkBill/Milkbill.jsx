import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPaymentsDeductionInfo } from "../../../../App/Features/Deduction/deductionSlice";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { generateMaster } from "../../../../App/Features/Customers/Date/masterdateSlice";
import { getAllMilkCollReport } from "../../../../App/Features/Mainapp/Milk/MilkCollectionSlice";
import { fetchPaymentDetails } from "../../../../App/Features/Payments/paymentSlice";
import "../../../../Styles/Milkbillreport/Milkbill.css";
import { centersLists } from "../../../../App/Features/Dairy/Center/centerSlice";
const Milkbill = () => {
  const dispatch = useDispatch();
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [dnames, setDnames] = useState([]);
  const date = useSelector((state) => state.date.toDate);
  const payDetails = useSelector((state) => state.payment.paymentDetails);
  const [collectionData, setCollectionData] = useState([]);
  const [processedDeductions, setProcessedDeductions] = useState([]);
  const [deduction, setDeduction] = useState([]);
  const [payment, setPayment] = useState([]);
  const [cmilkdata, setCmilkdata] = useState([]);
  const data = useSelector((state) => state.milkCollection.allMilkColl);
  const tableRef = useRef(null);
  const allDeductions = useSelector(
    (state) => state.deduction.alldeductionInfo
  );
  const customerlist = useSelector((state) => state.customer.customerlist);
  const [filterCode, setFilterCode] = useState("");
  const [isloading, setIsLoading] = useState("");
  const [dataavailable, setDataAvailable] = useState("");
  const [customerName, setCustomerName] = useState("");
  const centerList = useSelector((state) => state.center.centersList || []);
  const dairyinfo = useSelector((state) => state.dairy.dairyData);
  const [selectedCenterId, setSelectedCenterId] = useState("");
  const [fromCode, setFromCode] = React.useState("");
  const [toCode, setToCode] = React.useState("");
  const [centerdata, setCenterData] = React.useState("");
  const profile = useSelector((state) => state.userinfo.profile);
  console.log("payDetails", payDetails);

  useEffect(() => {
    dispatch(centersLists());
  }, [dispatch]);
  //......   Dairy name And City name   for PDf heading
  const dairyname = useSelector(
    (state) =>
      state.dairy.dairyData.SocietyName || state.dairy.dairyData.center_name
  );
  const CityName = useSelector((state) => state.dairy.dairyData.city);

  //.. Pdf
  const handlePDF = () => {
    if (!filteredDeductions || filteredDeductions.length === 0) {
      console.error("No data found.");
      return;
    }

    const formatDate = (date) => {
      if (!date) return "N/A";
      const d = new Date(date);
      return !isNaN(d.getTime()) ? d.toISOString().split("T")[0] : "N/A";
    };

    const formattedFromDate = formatDate(fromDate);
    const formattedToDate = formatDate(toDate);

    const doc = new jsPDF("p", "mm", "a4");
    const dairyName = dairyname || "Dairy Name";

    const reportTitle = "Payment Register";

    // Header banner
    doc.setFillColor(300, 300, 3000);
    doc.rect(0, 10, 210, 30, "F");

    doc.setFont("NotoSansDevanagari");
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text(dairyName, 105, 18, { align: "center" });

    doc.setFontSize(12);

    doc.text(reportTitle, 105, 30, { align: "center" });
    doc.text(`Date: ${formattedFromDate} to ${formattedToDate}`, 105, 36, {
      align: "center",
    });

    // Table headers
    const headers = [
      "Code", // 0
      "CustName", // 1
      "Liters", // 2
      "AVGRate", // 3
      "Commission", // 4
      "Transport", // 5
      "Payment", // 6
      "Deduction", // 7
      "NAMT", // 8
    ];

    // Table body rows
    const rows = filteredDeductions.map((item) => {
      const avgRate =
        item.tliters > 0 ? (item.pamt / item.tliters).toFixed(2) : "N/A";

      return [
        item.Code ?? "",
        item.customerName ?? "",
        item.tliters?.toFixed(2) ?? "0.00",
        avgRate,
        item.Commission?.toFixed(2) ?? "0.00",
        item.transport?.toFixed(2) ?? "0.00",
        item.pamt?.toFixed(2) ?? "0.00",
        item.damt?.toFixed(2) ?? "0.00",
        ((item.pamt ?? 0) - (item.damt ?? 0)).toFixed(2),
      ];
    });

    // Totals row aligned with headers
    const totalRow = [
      "Total", // Code column label
      "", // CustName blank
      filteredDeductions
        .reduce((sum, item) => sum + (item.tliters || 0), 0)
        .toFixed(2),
      "-", // AVGRate total not applicable
      filteredDeductions
        .reduce((sum, item) => sum + (item.Commission || 0), 0)
        .toFixed(2),
      filteredDeductions
        .reduce((sum, item) => sum + (item.transport || 0), 0)
        .toFixed(2),
      filteredDeductions
        .reduce((sum, item) => sum + (item.pamt || 0), 0)
        .toFixed(2),
      filteredDeductions
        .reduce((sum, item) => sum + (item.damt || 0), 0)
        .toFixed(2),
      filteredDeductions
        .reduce((sum, item) => sum + ((item.pamt || 0) - (item.damt || 0)), 0)
        .toFixed(2),
    ];

    // Render the table with jsPDF AutoTable
    doc.autoTable({
      startY: 42,
      head: [headers],
      body: rows,
      foot: [totalRow],
      styles: {
        fontSize: 8.5,
        cellPadding: 2,
        overflow: "linebreak",
        valign: "middle",
      },
      headStyles: {
        fillColor: [60, 100, 255],
        textColor: 255,
        fontStyle: "bold",
        halign: "center",
      },
      footStyles: {
        fillColor: [240, 240, 240],
        fontStyle: "bold",
        textColor: [0, 0, 0],
      },
      bodyStyles: {
        halign: "left",
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
      tableWidth: "auto",
      margin: { top: 10, left: 5, right: 5 },
      didParseCell: function (data) {
        if (data.section === "foot") {
          if (data.column.index === 0 || data.column.index === 1) {
            data.cell.styles.halign = "left"; // Left align "Total" and blank
            if (data.column.index === 0) {
              data.cell.styles.textColor = [0, 0, 150]; // Highlight "Total"
              data.cell.styles.fontStyle = "bold";
            }
          } else {
            data.cell.styles.halign = "right"; // Right align numeric totals
          }
        }
      },
    });

    // Save the PDF
    doc.save(
      `${reportTitle.replace(
        /\s+/g,
        "_"
      )}_${formattedFromDate}_to_${formattedToDate}.pdf`
    );
  };
  //fetchdata
  const fetchData = async () => {
    setIsLoading(true); // Start loading
    setDataAvailable(true); // Assume data is available initially

    if (fromDate && toDate) {
      dispatch(
        getAllMilkCollReport({
          fromDate,
          toDate,
        })
      );
      const fetchres = await dispatch(
        fetchPaymentDetails({
          fromdate: fromDate,
          todate: toDate,
          center_id: selectedCenterId,
        })
      ).unwrap();
    }
    try {
      if (fromDate && toDate) {
        const result = await dispatch(
          getPaymentsDeductionInfo({ fromDate, toDate })
        ).unwrap();

        if (!result || result.length === 0) {
          setDataAvailable(false); // No data found
        }
      } else {
        alert("Please select a valid date range.");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setDataAvailable(false); // Error occurred
    } finally {
      setIsLoading(false); // Stop loading
    }
  };
  useEffect(() => {
    if (allDeductions.length > 0 && customerlist.length > 0) {
      const grouped = {};
      const dnameSet = new Set(); // To store unique dnames

      allDeductions.forEach((item) => {
        const code = item.Code;

        if (item.DeductionId === 0) {
          const customer = customerlist.find((cust) => cust.srno === code);
          grouped[code] = {
            ...item,
            customerName: customer ? customer.cname : "",
          };
        } else {
          if (item.dname && item.AMT !== undefined) {
            const cleanDname = item.dname.replace(/\s+/g, "_"); // Replace spaces with underscores
            dnameSet.add(cleanDname); // collect sanitized dnames

            if (!grouped[code]) {
              grouped[code] = {};
            }

            grouped[code][cleanDname] = item.AMT; // Add sanitized key
          }
        }
      });

      const finalData = Object.values(grouped);
      setProcessedDeductions(finalData);

      // Set unique cleaned dnames
      setDnames(Array.from(dnameSet));
    }
  }, [allDeductions, customerlist]);

  //.. filter  code wise filter
  const filteredDeductions = processedDeductions.filter((item) => {
    const codeNum = parseInt(item.Code, 10);
    const fromCodeNum = fromCode ? parseInt(fromCode, 10) : null;
    const toCodeNum = toCode ? parseInt(toCode, 10) : null;

    const matchesCenter =
      selectedCenterId === "" ||
      item.center_id?.toString() === selectedCenterId;

    const matchesCodeRange =
      (!fromCodeNum || codeNum >= fromCodeNum) &&
      (!toCodeNum || codeNum <= toCodeNum);

    const matchesCode =
      !filterCode ||
      item.Code?.toString().toLowerCase().includes(filterCode.toLowerCase());

    const matchesName =
      !customerName ||
      item.customerName?.toLowerCase().includes(customerName.toLowerCase());

    return matchesCenter && matchesCodeRange && matchesCode && matchesName;
  });

  useEffect(() => {
    const savedFrom = localStorage.getItem("fromDate");
    const savedTo = localStorage.getItem("toDate");
    if (savedFrom) setFromDate(savedFrom);
    if (savedTo) setToDate(savedTo);
  }, []);

  // Save to localStorage when values change
  useEffect(() => {
    localStorage.setItem("fromDate", fromDate);
  }, [fromDate]);

  useEffect(() => {
    localStorage.setItem("toDate", toDate);
  }, [toDate]);

  // ---------------------------------------------------->
  // Generate master dates based on the initial date ------------------------>
  useEffect(() => {
    dispatch(generateMaster(date));
  }, [date, dispatch]);

  //.. Milk COlllection,Deduction , payment summary --------------------------------------->

  useEffect(() => {
    dispatch(generateMaster(date));
  }, [date, dispatch]);

  //filter for seprating   and set data ---------------------------->
  useEffect(() => {
    if (Array.isArray(payDetails)) {
      const deductions = payDetails.filter(
        (entry) =>
          entry.Code >= Number(fromCode) &&
          entry.Code <= Number(toCode) &&
          (entry.dtype === 0 || entry.dtype === 1)
      );

      const payments = payDetails.filter(
        (entry) =>
          entry.Code >= Number(fromCode) &&
          entry.Code <= Number(toCode) &&
          entry.dtype === 2
      );

      setDeduction(deductions);
      setPayment(payments);
    } else {
      setDeduction([]);
      setPayment([]);
    }
  }, [payDetails, fromCode]);

  useEffect(() => {
    if (Array.isArray(data)) {
      const milkData = data.filter(
        (d) =>
          d.rno.toString() >= fromCode.toString() &&
          d.rno.toString() <= toCode.toString()
      );
      setCmilkdata(milkData);
    } else {
      console.warn("Expected 'data' to be an array but got 0000:", data);
      setCmilkdata([]); // fallback to empty array
    }
  }, [data, fromCode, toCode]);

  // ---------------------------------------------------------->
  //... milk collection pdf
  const handleCenterChange = (e) => {
    setSelectedCenterId(e.target.value);
    console.log("Selected Center ID:", e.target.value);
  };
  // Pdf ----------------->
  const exportMilkCollectionPDF = (
    cmilkdata = [],
    cname = cmilkdata[0]?.cname || "",
    billno = payment[0]?.BillNo || "",
    // deduction = [],
    payData = []
  ) => {
    const doc = new jsPDF("portrait");

    // Header
    doc.setFontSize(16);
    doc.text(dairyname, 60, 15);
    doc.setFontSize(10);
    doc.text("Milk Payment Bill", 80, 22);
    doc.setFontSize(11);
    doc.text("Page No.: 1", 15, 30);
    doc.text(`Date: ${new Date().toLocaleDateString("hi-IN")}`, 145, 30);
    doc.text(
      `Master Duration: From ${String(fromDate)} To ${String(toDate)}`,
      15,
      36
    );
    doc.text(`Bill No.: ${billno}`, 140, 42);
    doc.text(`Customer Name: ${cname}`, 15, 48);

    const morningData = cmilkdata.filter((d) => d.ME === 0);
    const eveningData = cmilkdata.filter((d) => d.ME === 1);

    const formatRow = (entry) => [
      new Date(entry.ReceiptDate).toLocaleDateString("hi-IN"),
      entry.Litres,
      entry.fat,
      entry.snf,
      entry.rate.toFixed(2),
      entry.Amt.toFixed(2),
    ];

    const totalSection = (data) => {
      const litres = data.reduce(
        (sum, e) => sum + parseFloat(e.Litres || 0),
        0
      );
      const amount = data.reduce((sum, e) => sum + parseFloat(e.Amt || 0), 0);
      return {
        litres: litres.toFixed(2),
        amount: amount.toFixed(2),
      };
    };

    const morningTotals = totalSection(morningData);
    const eveningTotals = totalSection(eveningData);

    const columns = ["Date", "Liter", "Fat", "SNF", "Rate", "Amount"];

    // Morning Table
    doc.setFontSize(12);
    doc.text("Morning", 15, 58);
    doc.autoTable({
      head: [columns],
      body: [
        ...morningData.map(formatRow),
        ["Total", morningTotals.litres, "", "", "", morningTotals.amount],
      ],
      startY: 60,
      theme: "grid",
      styles: { fontSize: 9 },
      headStyles: {
        fontStyle: "bold",
        fillColor: [255, 255, 255],
        textColor: [0, 0, 0],
      },
      margin: { left: 15 },
    });

    let afterMorning = doc.lastAutoTable.finalY + 5;

    // Evening Table
    doc.setFontSize(12);
    doc.text("Evening", 15, afterMorning);
    doc.autoTable({
      head: [columns],
      body: [
        ...eveningData.map(formatRow),
        ["Total", eveningTotals.litres, "", "", "", eveningTotals.amount],
      ],
      startY: afterMorning + 2,
      theme: "grid",
      styles: { fontSize: 9 },
      headStyles: {
        fontStyle: "bold",
        fillColor: [255, 255, 255],
        textColor: [0, 0, 0],
      },
      margin: { left: 15 },
    });

    let currentY = doc.lastAutoTable.finalY + 8;

    // Deduction Table
    doc.setFontSize(12);
    doc.text("Deduction", 15, currentY);

    const deductionColumns = [
      "Deduction Name",
      "Remaining Deduction(MAMT)",
      "Deduction (DAMT)",
      "Remaining Amt (BAMT)",
    ];
    const deductionRows = deduction.map((item) => [
      item.dname || "",
      parseFloat(item.MAMT || 0).toFixed(2),
      parseFloat(item.Amt || item.damt || 0).toFixed(2),
      parseFloat(item.BAMT || 0).toFixed(2),
    ]);

    doc.autoTable({
      head: [deductionColumns],
      body: deductionRows,
      startY: currentY + 4,
      theme: "grid",
      styles: { fontSize: 9 },
      headStyles: {
        fontStyle: "bold",
        fillColor: [255, 255, 255],
        textColor: [0, 0, 0],
      },
      margin: { left: 15 },
    });

    // Received Amount Table
    currentY = doc.lastAutoTable.finalY + 8;
    doc.setFontSize(12);
    doc.text("Received Amount", 15, currentY);

    const paySummaryHeaders = [
      "Liter",
      "AvgRate",
      "Payment",
      "Deduction",
      "Net payment",
    ];
    const paySummaryRows = payment.map((item) => [
      parseFloat(item.tliters || 0).toFixed(2),
      parseFloat(item.arate || 0).toFixed(2),
      parseFloat(item.pamt || 0).toFixed(2),
      parseFloat(item.damt || 0).toFixed(2),
      parseFloat(item.namt || 0).toFixed(2),
    ]);

    doc.autoTable({
      head: [paySummaryHeaders],
      body: paySummaryRows,
      startY: currentY + 4,
      theme: "grid",
      styles: { fontSize: 9 },
      headStyles: {
        fontStyle: "bold",
        fillColor: [255, 255, 255],
        textColor: [0, 0, 0],
      },
      margin: { left: 15 },
    });

    doc.save("MilkCollectionBill.pdf");
  };

  //First Formatt
  function numberToWords(num) {
    const a = [
      "",
      "One",
      "Two",
      "Three",
      "Four",
      "Five",
      "Six",
      "Seven",
      "Eight",
      "Nine",
      "Ten",
      "Eleven",
      "Twelve",
      "Thirteen",
      "Fourteen",
      "Fifteen",
      "Sixteen",
      "Seventeen",
      "Eighteen",
      "Nineteen",
    ];
    const b = [
      "",
      "",
      "Twenty",
      "Thirty",
      "Forty",
      "Fifty",
      "Sixty",
      "Seventy",
      "Eighty",
      "Ninety",
    ];

    const inWords = (n) => {
      if (n < 20) return a[n];
      if (n < 100)
        return b[Math.floor(n / 10)] + (n % 10 ? " " + a[n % 10] : "");
      if (n < 1000)
        return (
          a[Math.floor(n / 100)] +
          " Hundred" +
          (n % 100 ? " " + inWords(n % 100) : "")
        );
      if (n < 100000)
        return (
          inWords(Math.floor(n / 1000)) +
          " Thousand" +
          (n % 1000 ? " " + inWords(n % 1000) : "")
        );
      if (n < 10000000)
        return (
          inWords(Math.floor(n / 100000)) +
          " Lakh" +
          (n % 100000 ? " " + inWords(n % 100000) : "")
        );
      return (
        inWords(Math.floor(n / 10000000)) +
        " Crore" +
        (n % 10000000 ? " " + inWords(n % 10000000) : "")
      );
    };

    if (num === 0) return "Zero Rupees Only";

    const rupees = Math.floor(num);
    const paise = Math.round((num - rupees) * 100);

    let words = inWords(rupees) + " Rupees";
    if (paise > 0) words += " and " + inWords(paise) + " Paise";

    return words + " Only";
  }
  const printMilkBillPages = ({
    fromCode,
    toCode,
    data,
    allDeductions,
    payDetails,
  }) => {
    const start = fromCode;
    const end = toCode;
    const customerCodes = [];
    for (let code = start; code <= end; code++) {
      customerCodes.push(code.toString());
    }

    const formatDate = (dateStr) =>
      new Date(dateStr).toLocaleDateString("hi-IN");

    const buildCombinedRows = (records, total) =>
      records
        .map((rec) => {
          total.liters +=
            parseFloat(rec.litres || 0) + parseFloat(rec.litres1 || 0);
          total.amount += parseFloat(rec.Amt || 0) + parseFloat(rec.Amt1 || 0);
          return `
          <tr>
            <td>${formatDate(rec.date)}</td>
            <td>${rec.litres}</td><td>${rec.fat}</td><td>${rec.snf}</td><td>${
            rec.rate
          }</td><td>${rec.Amt}</td>
            <td>${rec.litres1}</td><td>${rec.fat1}</td><td>${
            rec.snf1
          }</td><td>${rec.rate1}</td><td>${rec.Amt1}</td>
          </tr>`;
        })
        .join("");

    const deductionRows = (records) =>
      records
        .filter(
          (d) => d.AMT && parseFloat(d.AMT) !== 0 && d.dname?.trim() !== ""
        )
        .map(
          (d) => `
        <tr><td>${d.dname}</td><td style="text-align:right;">${parseFloat(
            d.AMT
          ).toFixed(2)}</td></tr>
      `
        )
        .join("");

    const buildPaymentSummary = (payment) => {
      if (payment.length === 0)
        return "<tr><td colspan='2'>No payment data</td></tr>";
      const pay = payment[0];
      const rows = [
        ["Liter", pay.tliters],
        ["Avg Rate", pay.arate],
        ["Total Payment", pay.pamt],
        ["Total Deduction", pay.damt],
        ["Net Payment", pay.namt],
      ];
      return rows
        .map(
          ([label, val]) => `
          <tr><td>${label}</td><td style="text-align:right;">${parseFloat(
            val || 0
          ).toFixed(2)}</td></tr>
        `
        )
        .join("");
    };

    const allPagesHTML = customerCodes
      .map((code) => {
        const morningData = data.filter(
          (d) => d.rno.toString() === code && d.ME === 0
        );
        const eveningData = data.filter(
          (d) => d.rno.toString() === code && d.ME === 1
        );

        const custMilkData = morningData.map((mData) => {
          const evening = eveningData.find(
            (e) => e.ReceiptDate === mData.ReceiptDate
          );
          return {
            date: mData.ReceiptDate,
            litres: mData.Litres,
            fat: mData.fat,
            snf: mData.snf,
            rate: mData.rate,
            Amt: mData.Amt,
            litres1: evening?.Litres || 0,
            fat1: evening?.fat || 0,
            snf1: evening?.snf || 0,
            rate1: evening?.rate || 0,
            Amt1: evening?.Amt || 0,
          };
        });

        if (custMilkData.length === 0) return "";

        const customerName =
          morningData[0]?.cname || eveningData[0]?.cname || "";

        const deductions = allDeductions.filter(
          (d) => d.Code.toString() === code && parseFloat(d.AMT || 0) !== 0
        );
        const payments = payDetails.filter(
          (p) => p.Code.toString() === code && p.dtype.toString() === "2"
        );

        const total = { liters: 0, amount: 0 };
        const netPaymentAmt =
          payments.length > 0 ? parseFloat(payments[0].namt || 0) : 0;

        return `
        <div class="page">
          <h2>${dairyname}</h2>
          <p><strong>Period:</strong> ${formatDate(fromDate)} to ${formatDate(
          toDate
        )}</p>
          <p><strong>Code:</strong> ${code} | <strong>Name:</strong> ${customerName}</p>
  
          <table class="milk-table">
            <thead>
              <tr>
                <th rowspan="2">Date</th>
                <th colspan="5">Morning</th>
                <th colspan="5">Evening</th>
              </tr>
              <tr>
                <th>Lit</th><th>Fat</th><th>SNF</th><th>Rate</th><th>Amt</th>
                <th>Lit</th><th>Fat</th><th>SNF</th><th>Rate</th><th>Amt</th>
              </tr>
            </thead>
            <tbody>
              ${buildCombinedRows(custMilkData, total)}
              <tr style="font-weight:bold;">
                <td>Total</td>
                <td colspan="5" style="text-align:right;">Litres: ${total.liters.toFixed(
                  2
                )}</td>
                <td colspan="5" style="text-align:right;">Amount: ₹${total.amount.toFixed(
                  2
                )}</td>
              </tr>
            </tbody>
          </table>
  
          <div class="summary-row">
            <div class="summary-box">
              <table>
                <thead><tr><th>Deduction Name</th><th>Amount</th></tr></thead>
                <tbody>${deductionRows(deductions)}</tbody>
              </table>
            </div>
            <div class="summary-box">
              <table>
                <thead><tr><th colspan="2" style="text-align:center;">Payment Summary</th></tr></thead>
                <tbody>${buildPaymentSummary(payments)}</tbody>
              </table>
            </div>
          </div>
  
          <p><strong>Total Payable:</strong> ₹${netPaymentAmt.toFixed(2)}</p>
          <p><strong>In Words:</strong> ${numberToWords(netPaymentAmt)}</p>
        </div>
      `;
      })
      .join("");

    const win = window.open("", "_blank");
    win.document.write(`
      <html>
        <head>
          <title>Milk Bills</title>
          <style>
            @media print {
              .page {
                page-break-after: always;
                padding: 10mm;
                width: 210mm;
                height: 297mm;
                box-sizing: border-box;
              }
            }
            body {
              margin: 0;
              font-family: "Noto Sans Devanagari", sans-serif;
              font-size: 11px;
              line-height: 1.3;
            }
            h2 {
              text-align: center;
              margin: 0 0 5px;
            }
            p {
              margin: 2px 0;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              font-size: 10px;
              margin-top: 5px;
            }
            th, td {
              border: 1px solid #333;
              padding: 2px 4px;
              text-align: center;
            }
            .summary-row {
              display: flex;
              justify-content: space-between;
              gap: 10px;
              margin-top: 10px;
            }
            .summary-box {
              flex: 1;
            }
          </style>
        </head>
        <body>
          ${allPagesHTML}
        </body>
      </html>
    `);
    win.document.close();
    win.focus();
    win.print();
  };

  //. Second Formatt
  const printMilkCollection = (
    cmilkdata = [],
    cname = "",
    billno = "",
    payData = [],
    allDeductions = [],
    payment = [],
    customerCode = "",
    accountDetails = {},
    dairyname = "",
    fromDate = "",
    toDate = ""
  ) => {
    if (!Array.isArray(cmilkdata)) {
      console.error("Invalid cmilkdata");
      return;
    }
    if (!Array.isArray(allDeductions)) {
      console.error("Invalid deduction data");
      allDeductions = [];
    }
    if (!Array.isArray(payment)) {
      console.error("Invalid payment data");
      payment = [];
    }

    if (!cname && cmilkdata.length > 0) {
      cname = cmilkdata[0]?.cname || "";
    }

    if (!customerCode && cmilkdata.length > 0) {
      customerCode = cmilkdata[0]?.ccode || "";
    }

    if (!billno && payment.length > 0) {
      billno = payment[0]?.BillNo || "";
    }

    const morningData = cmilkdata.filter((d) => d.ME === 0);
    const eveningData = cmilkdata.filter((d) => d.ME === 1);

    const calcSummary = (data) => ({
      liters: data.reduce((sum, e) => sum + parseFloat(e.Litres || 0), 0),
      amount: data.reduce((sum, e) => sum + parseFloat(e.Amt || 0), 0),
    });

    const morningSummary = calcSummary(morningData);
    const eveningSummary = calcSummary(eveningData);
    const totalLiters = (morningSummary.liters + eveningSummary.liters).toFixed(
      2
    );
    const totalPayment = (
      morningSummary.amount + eveningSummary.amount
    ).toFixed(2);

    const anamat = payment[0]?.anamat || 0;
    const amt = payment[0]?.namt || 0;
    const accNo = accountDetails?.accno || payment[0]?.accno || "";

    const dateStr = new Date().toLocaleDateString("hi-IN");

    let bodyRows = "";

    if (deduction.length > 0) {
      deduction.forEach((item, index) => {
        bodyRows += `
          <tr>
            ${
              index === 0
                ? `<td rowspan="${deduction.length}">${customerCode}</td>`
                : ""
            }
            ${
              index === 0
                ? `<td rowspan="${deduction.length}">${cname}</td>`
                : ""
            }
            ${
              index === 0
                ? `<td rowspan="${deduction.length}">${totalLiters}</td>`
                : ""
            }
            ${
              index === 0
                ? `<td rowspan="${deduction.length}">${totalPayment}</td>`
                : ""
            }
            <td>${item.dname || ""}</td>
            <td>${parseFloat(item.MAMT || 0).toFixed(2)}</td>
            <td>${parseFloat(item.Amt || item.damt || 0).toFixed(2)}</td>
            <td>${parseFloat(item.BAMT || 0).toFixed(2)}</td>
            ${
              index === 0
                ? `<td rowspan="${deduction.length}">${parseFloat(
                    anamat
                  ).toFixed(2)}</td>`
                : ""
            }
            ${
              index === 0
                ? `<td rowspan="${deduction.length}">${parseFloat(amt).toFixed(
                    2
                  )}</td>`
                : ""
            }
            ${
              index === 0
                ? `<td rowspan="${deduction.length}">${accNo}</td>`
                : ""
            }
          </tr>
        `;
      });
    } else {
      bodyRows += `
        <tr>
          <td>${customerCode}</td>
          <td>${cname}</td>
          <td>${totalLiters}</td>
          <td>${totalPayment}</td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td>${parseFloat(anamat).toFixed(2)}</td>
          <td>${parseFloat(amt).toFixed(2)}</td>
          <td>${accNo}</td>
        </tr>
      `;
    }

    const htmlContent = `
      <html>
        <head>
          <title>Milk Payment Summary</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .container { border: 1px solid #000; padding: 20px; width: 95%; margin: auto; }
            .header { text-align: center; }
            .header h1 { margin: 0; font-size: 20px; }
            .header p { margin: 4px 0; font-size: 12px; }
            .info-table, .summary-table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 12px; }
            .info-table td { padding: 4px; }
            .summary-table th, .summary-table td { border: 1px solid #000; padding: 6px; text-align: center; }
            .summary-table th { background-color: #ddd; }
            @media print { button { display: none; } }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>${dairyname}</h1>
              <p>Milk Payment Summary</p>
              <p>Period: From ${fromDate} To ${toDate}</p>
            </div>

            <table class="info-table">
              <tr>
                <td>Page No.: 1</td>
                <td style="text-align:right;">Date: ${dateStr}</td>
              </tr>
              <tr>
                <td>Bill No.: ${billno}</td>
                <td style="text-align:right;">Customer Name: ${cname}</td>
              </tr>
              <tr>
                <td>Customer Code: ${customerCode}</td>
              </tr>
            </table>

            <h3>Combined Summary</h3>
            <table class="summary-table">
              <thead>
                <tr>
                  <th>Customer Code</th>
                  <th>Customer Name</th>
                  <th>Total Liter</th>
                  <th>Total Payment</th>
                  <th>Deduction Name</th>
                  <th>Remaining</th>
                  <th>Deduction</th>
                  <th>Balance</th>
                  <th>Anamat</th>
                  <th>Amount</th>
                  <th>Account Number</th>
                </tr>
              </thead>
              <tbody>
                ${bodyRows}
              </tbody>
            </table>
          </div>
          <script>
            window.onload = function () {
              window.print();
            };
          </script>
        </body>
      </html>
    `;

    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(htmlContent);
      printWindow.document.close();
    } else {
      console.warn("Unable to open print window. Please check popup blocker.");
    }
  };
  // ---------------------------------------------------------------------------------------------->
  // 3rd Formatt
  const printMilkBillpage3rd = ({
    fromCode,
    toCode,
    data,
    allDeductions,
    payDetails,
  }) => {
    const start = fromCode;
    const end = toCode;
    const customerCodes = [];

    for (let code = start; code <= end; code++) {
      customerCodes.push(code.toString());
    }
    const formatDate = (dateStr) =>
      new Date(dateStr).toLocaleDateString("hi-IN");
    const buildMergedMilkRows = (records, total) => {
      const groupedByDate = {};
      records.forEach((rec) => {
        const date = rec.ReceiptDate;
        if (!groupedByDate[date]) {
          groupedByDate[date] = { morning: null, evening: null };
        }
        if (rec.ME === 0) groupedByDate[date].morning = rec;
        else if (rec.ME === 1) groupedByDate[date].evening = rec;
      });

      return Object.entries(groupedByDate)
        .map(([date, { morning, evening }]) => {
          const litresM = parseFloat(morning?.Litres || 0);
          const litresE = parseFloat(evening?.Litres || 0);
          const totalLitres = litresM + litresE;

          const amtM = parseFloat(morning?.Amt || 0);
          const amtE = parseFloat(evening?.Amt || 0);
          const totalAmt = amtM + amtE;

          const rateM = parseFloat(morning?.rate || 0);
          const rateE = parseFloat(evening?.rate || 0);
          const fatM = parseFloat(morning?.fat || 0);
          const fatE = parseFloat(evening?.fat || 0);
          const snfM = parseFloat(morning?.snf || 0);
          const snfE = parseFloat(evening?.snf || 0);

          const weightedRate = totalLitres
            ? ((rateM * litresM + rateE * litresE) / totalLitres).toFixed(2)
            : "0.00";

          const weightedFat = totalLitres
            ? ((fatM * litresM + fatE * litresE) / totalLitres).toFixed(2)
            : "0.00";

          const weightedSnf = totalLitres
            ? ((snfM * litresM + snfE * litresE) / totalLitres).toFixed(2)
            : "0.00";

          total.liters += totalLitres;
          total.amount += totalAmt;

          return `
            <tr>
              <td>${formatDate(date)}</td>
              <td>${totalLitres.toFixed(2)}</td>
              <td>${weightedRate}</td>
              <td>${weightedFat}</td>
              <td>${weightedSnf}</td>
              <td>${totalAmt.toFixed(2)}</td>
            </tr>
          `;
        })
        .join("");
    };

    const deductionRows = (records) =>
      records
        .filter(
          (d) =>
            d.dname?.trim() &&
            d.AMT &&
            !isNaN(parseFloat(d.AMT)) &&
            parseFloat(d.AMT) !== 0
        )
        .map(
          (d) => `
        <tr>
          <td>${d.dname}</td>
          <td>${parseFloat(d.AMT).toFixed(2)}</td>
        </tr>
      `
        )
        .join("");

    const buildPaymentSummary = (payment) => {
      if (payment.length === 0)
        return "<tr><td colspan='2'>No payment data</td></tr>";

      const pay = payment[0];
      const rows = [
        ["Liter", parseFloat(pay.tliters || 0).toFixed(2)],
        ["Avg Rate", parseFloat(pay.arate || 0).toFixed(2)],
        ["Total Payment", parseFloat(pay.pamt || 0).toFixed(2)],
        ["Total Deduction", parseFloat(pay.damt || 0).toFixed(2)],
        ["Net Payment", parseFloat(pay.namt || 0).toFixed(2)],
      ];

      return rows
        .map(
          ([label, value]) => `
          <tr>
            <td>${label}</td>
            <td>${value}</td>
          </tr>
        `
        )
        .join("");
    };

    const allPagesHTML = customerCodes
      .map((code) => {
        const custData = data.filter((d) => d.rno.toString() === code);
        if (custData.length === 0) return "";

        const customerName = custData[0]?.cname || "";
        const deductions = allDeductions.filter(
          (d) => d.Code.toString() === code
        );
        const payments = payDetails.filter(
          (p) => p.Code.toString() === code && p.dtype.toString() === "2"
        );
        const total = { liters: 0, amount: 0 };
        const netPaymentAmt =
          payments.length > 0 ? parseFloat(payments[0].namt || 0) : 0;

        return `
          <div class="page">
            <h3 class="center">${dairyname}</h3>
            <div class="small center">Period: ${formatDate(
              fromDate
            )} to ${formatDate(toDate)}</div>
            <div class="info"><strong>Code:</strong> ${code} | <strong>Name:</strong> ${customerName}</div>
  
            <table class="table">
              <thead>
                <tr>
                  <th>तारीख</th>
                  <th>लिटर</th>
                  <th>दर</th>
                  <th>FAT</th>
                  <th>SNF</th>
                  <th>रक्कम</th>
                </tr>
              </thead>
              <tbody>
                ${buildMergedMilkRows(custData, total)}
                <tr class="bold">
                  <td>Total</td>
                  <td>${total.liters.toFixed(2)}</td>
                  <td colspan="3"></td>
                  <td>${total.amount.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
  
            <div class="row">
              <table class="table small left-align">
                <thead>
                  <tr><th>कपातीचे नाव</th><th>रक्कम</th></tr>
                </thead>
                <tbody>${deductionRows(deductions)}</tbody>
              </table>
  
              <table class="table small left-align">
                <thead>
                  <tr><th colspan="2" class="center">Payment Summary</th></tr>
                </thead>
                <tbody>${buildPaymentSummary(payments)}</tbody>
              </table>
            </div>
  
            <div class="summary">
              <strong>एकूण रक्कम: ₹${netPaymentAmt.toFixed(2)}</strong><br />
              <em>Amount in Words: ${numberToWords(netPaymentAmt)}</em>
            </div>
          </div>
        `;
      })
      .join("");

    const win = window.open("", "_blank");
    win.document.write(`
      <html>
        <head>
          <title>Milk Bills</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 8px;
            }
            .page {
              width: 100%;
              page-break-after: always;
              border: 1px solid #000;
              padding: 6px;
              box-sizing: border-box;
            }
            .center {
              text-align: center;
            }
            .small {
              font-size: 11px;
            }
            .info {
              font-size: 11px;
              margin-bottom: 4px;
            }
            .table {
              width: 100%;
              border-collapse: collapse;
              font-size: 10px;
              margin-top: 4px;
            }
            .table th, .table td {
              border: 1px solid #000;
              padding: 2px 4px;
            }
            .left-align td, .left-align th {
              text-align: left;
            }
            .row {
              display: flex;
              gap: 10px;
              margin-top: 6px;
            }
            .row table {
              width: 50%;
            }
            .summary {
              margin-top: 6px;
              font-size: 11px;
            }
            .bold td {
              font-weight: bold;
            }
          </style>
        </head>
        <body>
          ${allPagesHTML}
        </body>
      </html>
    `);
    win.document.close();
    win.focus();
    win.print();
  };

  //Centerselection

  const handleClick = async () => {
    setLoading(true);
    try {
      await fetchData(); // assuming fetchData is a promise-based function
    } catch (error) {
      console.error("Error in fetchData:", error);
    } finally {
      setLoading(false);
    }
  };
  const fetchDataa = async () => {
    setIsLoading(true);
    try {
      // your fetch logic here
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="milk-bill-container w100 h1 d-flex-col center">
        <div className="date-checkbox-code-bill-payment-div w80 h50 d-flex-col bg p10">
          <span className="w100 heading t-center">Milk Bill Report</span>
          <div className="date-code-bill-payment w100 h1 d-flex-col sa ">
            <div className="from-to-date-bill-report w100  d-flex  ">
              <div className="from-to-date-milk-bill d-flex w70 ">
                <div className="from-date-bill-div w50 d-flex a-center  ">
                  <span className="px10 lable-text w50">दिनांक पासून :</span>
                  <input
                    className="data w50"
                    type="date"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                  />
                </div>
                <div className="from-date-bill-div w50 d-flex a-center  ">
                  <span className="px10 lable-text w30">पर्येंत :</span>
                  <input
                    className="data w50"
                    type="date"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="code-to-date-bill-report w100 d-flex sb">
              <div className="select-center-milk-payment-div w60 d-flex ">
                <div className="payment-register-centerwisee-data-show w100 h1 d-flex a-center">
                  <span className="info-text w30 px10">Center:</span>

                  <select
                    className="data w60 my10"
                    name="selection"
                    id="001"
                    onChange={handleCenterChange}
                    value={selectedCenterId}
                  >
                    <option value="">Select Center</option>
                    {centerList && centerList.length > 0 ? (
                      centerList.map((center, index) => (
                        <option key={index} value={center.center_id}>
                          {center.name ||
                            center.center_name ||
                            `Center ${index + 1}`}
                        </option>
                      ))
                    ) : (
                      <option disabled>No Centers Available</option>
                    )}
                  </select>
                </div>
              </div>
              <div className="from-to-code-milk-payment w50 d-flex">
                <div className="from-date-bill-div w50 d-flex a-center">
                  <span className="px10 lable-text w50">कोड :</span>
                  <input
                    className="data w50"
                    type="text"
                    value={fromCode}
                    onChange={(e) => setFromCode(e.target.value)}
                    placeholder="From Code"
                  />
                </div>
                <div className="to-code-bill-div w50 d-flex a-center">
                  <span className="px10 lable-text w50">ते :</span>
                  <input
                    className="data w50"
                    type="text"
                    value={toCode}
                    onChange={(e) => setToCode(e.target.value)}
                    placeholder="To Code"
                  />
                </div>
              </div>
            </div>

            <div className="bill-payments-reports w100 d-flex  ">
              <div className="milk-bill-report-buttons-first-half d-flex w50">
                <div className="report-buttons-div w50 d-flex px10">
                  <button
                    className="btn"
                    onClick={fetchData}
                    disabled={isloading}
                  >
                    {isloading ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        <span className="visually-hidden">Calculating...</span>
                      </>
                    ) : (
                      "Calculate"
                    )}
                  </button>
                </div>
                <div className="paymnet-register-report-div w50 d-flex">
                  <button className="w-btn " onClick={handlePDF}>
                    रजिस्टर प्रकार
                  </button>
                </div>
              </div>

              {/* <div className="report-buttons-div w70 d-flex px10">
                <button onClick={() => exportMilkCollectionPDF(cmilkdata)}>
                  Milk Collection PDF
                </button>
              </div> */}
              <div className="milk-bil-report-second-half d-flex w100 j-end">
                <button
                  className="btn mx10"
                  onClick={() =>
                    printMilkBillPages({
                      fromCode,
                      toCode,
                      data,
                      allDeductions,
                      payDetails,
                    })
                  }
                >
                  दुध बिले प्रकार 1
                </button>
                <button
                  className="btn mx10"
                  onClick={() =>
                    printMilkCollection(
                      cmilkdata,
                      "",
                      "",
                      [],
                      allDeductions,
                      payment
                    )
                  }
                >
                  दुध बिले प्रकार 2
                </button>
                <button
                  className="btn mx10"
                  onClick={() =>
                    printMilkBillpage3rd({
                      fromCode,
                      toCode,
                      data,
                      allDeductions,
                      payDetails,
                    })
                  }
                >
                  दुध बिले प्रकार 3
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Milkbill;
