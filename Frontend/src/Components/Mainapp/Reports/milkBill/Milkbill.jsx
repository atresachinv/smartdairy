import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPaymentsDeductionInfo } from "../../../../App/Features/Deduction/deductionSlice";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { generateMaster } from "../../../../App/Features/Customers/Date/masterdateSlice";
import { getAllMilkCollReport } from "../../../../App/Features/Mainapp/Milk/MilkCollectionSlice";
import { fetchPaymentDetails } from "../../../../App/Features/Payments/paymentSlice";

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
  const centerList = useSelector(
    (state) => state.center.centersList.centersDetails
  );
  const dairyinfo = useSelector((state) => state.dairy.dairyData);
  const [selectedCenterId, setSelectedCenterId] = useState("");
  const [fromCode, setFromCode] = React.useState("");
  const [toCode, setToCode] = React.useState("");

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
    const cityName = CityName || "City";
    const reportTitle = "पेमेंट Register";

    // Header banner
    doc.setFillColor(300, 300, 3000);
    doc.rect(0, 10, 210, 30, "F");

    doc.setFont("NotoSansDevanagari");
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text(dairyName, 105, 18, { align: "center" });

    doc.setFontSize(12);
    doc.setFont("NotoSansDevanagari");
    doc.text(`शहर: ${cityName}`, 105, 24, { align: "center" });
    doc.text(reportTitle, 105, 30, { align: "center" });
    doc.text(`शहर: ${formattedFromDate} to ${formattedToDate}`, 105, 36, {
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
        })
      ).unwrap();
    }
    console.log("payDetails", payDetails);
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
  // console.log(summaryData);
  //filter for seprating
  console.log(fromCode);
  useEffect(() => {
  
    const deductions = payDetails.filter(
      (entry) =>
        entry.Code.toString() === fromCode.toString() &&
        (entry.dtype === 0 || entry.dtype === 1)
    );
    const payments = payDetails.filter(
      (entry) => entry.Code.toString() === fromCode && entry.dtype === 2
    );
    setDeduction(deductions);
    setPayment(payments);
  }, [data, payDetails, fromCode]);

  useEffect(() => {
    const milkData = data.filter(
      (d) => d.rno.toString() === fromCode.toString()
    );
    

    setCmilkdata(milkData);
  }, [data, fromCode]);

  // ---------------------------------------------------------->
  //... milk collection pdf
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
      parseFloat(item.Amt || item.damt|| 0).toFixed(2),
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

  console.log("deduction", deduction);
  return (
    <>
      <div className="milk-bill-container w100 h1 d-flex-col">
        <span className="px10 heading">Milk Bill Report</span>
        <div className="date-checkbox-code-bill-payment-div w100 h40 d-flex bg">
          <div className="date-code-bill-payment w70 h1 d-flex-col sa ">
            <div className="from-to-date-bill-report w100  d-flex  ">
              <div className="from-date-bill-div w50 d-flex a-center  ">
                <span className="px10 lable-text w30">दिनांक पासून</span>
                <input
                  className="data w40"
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                />
              </div>
              <div className="from-date-bill-div w50 d-flex a-center  ">
                <span className="px10 lable-text w20">पर्येंत:</span>
                <input
                  className="data w40"
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                />
              </div>
            </div>
            <div className="code-to-date-bill-report w100 d-flex">
              <div className="from-date-bill-div w50 d-flex a-center">
                <span className="px10 lable-text w30">कोड न पासून</span>
                <input
                  className="data w40"
                  type="text"
                  value={fromCode}
                  onChange={(e) => setFromCode(e.target.value)}
                  placeholder="From Code"
                />
              </div>
              <div className="to-code-bill-div w50 d-flex a-center">
                <span className="px10 lable-text w20">पर्येंत:</span>
                <input
                  className="data w40"
                  type="text"
                  value={toCode}
                  onChange={(e) => setToCode(e.target.value)}
                  placeholder="To Code"
                />
              </div>
            </div>

            <div className="bill-payments-reports w70 d-flex">
              <div className="report-buttons-div w70 d-flex px10">
                <button className="btn" onClick={fetchData}>
                  Calculate
                </button>
              </div>
              <div className="report-buttons-div w70 d-flex px10">
                <button onClick={() => exportMilkCollectionPDF(cmilkdata)}>
                  Milk Collection PDF
                </button>
              </div>
              <div className="report-buttons-div w70 d-flex px10">
                <button className="btn">दुध बिले प्रकार 2</button>
              </div>
            </div>
          </div>

          <div className="checkbox-transport-center-div w30 d-flex-col sa">
            <div className="trasport-code-div d-flex w100 ">
              <input className="w10" type="checkbox" />
              <span className="">वाहतूक असलेले कोड</span>
            </div>
            <div className="trasport-code-div d-flex w100 ">
              <input className="w10" type="checkbox" />
              <span>Center/Route</span>
            </div>
            <div className="paymnet-register-report-div w100">
              <button className="w-btn " onClick={handlePDF}>
                रजिस्टर प्रकार
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Milkbill;
