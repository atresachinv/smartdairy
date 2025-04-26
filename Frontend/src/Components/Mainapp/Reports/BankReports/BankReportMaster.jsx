import React, { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import * as XLSX from "xlsx";
import { useDispatch, useSelector } from "react-redux";
import { getBankList } from "../../../../App/Features/Mainapp/Masters/bankSlice";
const BankReportMaster = () => {
  const dispatch = useDispatch();
  const [fromDate, setFromDate] = useState(""); // Make sure fromDate and toDate are set correctly
  const [toDate, setToDate] = useState("");
  const [bankData, setBankData] = useState([]);
  const customerlist = useSelector((state) => state.customer.customerlist); //api call Using reducx
  const [mergedData, setMergedData] = useState([]);
  const bankList = useSelector((state) => state.bank.banksList || []);
  const [filteredDeduction, setFilteredDeduction] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showBankWise, setShowBankWise] = useState(true);
  const [showAllCustomers, setShowAllCustomers] = useState(false); //cehckbox of All-cust
  const [showIfscCode, setShowIfscCode] = useState(false); // show Ifsc code
  const [showCustomerwiseDateFilter, setShowCustomerwiseDateFilter] =
    useState(false); // State for Customerwise checkbox
  const [fromCode, setFromCode] = useState(""); // State for From code input
  const [toCode, setToCode] = useState(""); // State for To code input
  const [selectedCode, setSelectedCode] = useState("");
  const [selectedBank, setSelectedBank] = useState("");


  //......   Dairy name And City name   for PDf heading
  const dairyname = useSelector(
    (state) =>
      state.dairy.dairyData.SocietyName || state.dairy.dairyData.center_name
  );
  const CityName = useSelector((state) => state.dairy.dairyData.city);

  // console.log(" Hiii", fromDate, toDate);
  console.log("mergedData", mergedData);
  // console.log("customerlist", customerlist);

  // referesh button

  const handleRefresh = () => {
    setFromDate("");
    setToDate("");
    setFromCode("");
    setToCode("");
    setShowAllCustomers(false);
    setShowIfscCode(false);
    setShowCustomerwiseDateFilter(false);
    setBankData([]);
    setMergedData([]);
  };

  const englishHeaders = [
    "SEQ NO",
    "AMOUNT",
    "AC TYPE",
    "SMS/EMAIL",
    "MOBILE NO",
    "BENEFICIARY ACC NO",
    "BENEFICIARY NAME",
    "ADDRESS 1",
    "ADDRESS 2",
    "IFSC",
    "SENDER INFO 1",
    "SENDER INFO 2",
  ];

  // Column Headers in Marathi
  const marathiHeaders = [
    "क्रमांक",
    "रक्कम",
    "खाते प्रकार",
    "SMS/ई-मेल",
    "मोबाईल नंबर",
    "प्राप्तकर्ता खाते क्रमांक",
    "प्राप्तकर्ता नाव",
    "पत्ता 1",
    "पत्ता 2",
    "IFSC कोड",
    "पाठवणारा माहिती 1",
    "पाठवणारा माहिती 2",
  ];

  // Fetch Data
  const handlefetchData = async () => {
    if (!fromDate || !toDate) {
      alert("Please select both From and To dates.");
      return;
    }
    try {
      const response = await axios.post("/bank/list", { fromDate, toDate });
      console.log("API Response Data:", response.data.Deduction);
      setBankData(response.data.Deduction);
    } catch (error) {
      console.error(
        "Error during fetch request:",
        error.response ? error.response.data : error.message
      );
      alert("Failed to fetch data. Please try again later.");
    }

    handleTableClick();
  };

  //.. banklist
  useEffect(() => {
    dispatch(getBankList());
  }, [dispatch]);
  //.... AddC BAnk Excel
  const exportADDCToExcel = () => {
    if (loading) {
      alert("Data is still loading. Please wait.");
      return;
    }

    if (combinedFilteredData.length === 0) {
      alert("No data available to export.");
      return;
    }

    // Calculate the Remark based on fromDate and toDate
    const from = new Date(fromDate);
    const to = new Date(toDate);

    // Extract month name and week/half
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const monthName = monthNames[from.getMonth()];
    const remark = from.getDate() <= 15 ? `${monthName}-I` : `${monthName}-II`; // First or second half of the month

    // Prepare data for Excel
    const worksheetData = combinedFilteredData.map((item, index) => ({
      Code: item.Code || "N/A",
      "Customer Name": item.customerName || "N/A",
      "Bank ACC No": item.cust_accno || "N/A",
      Mobile: item.mobile || "N/A", // Include mobile number
      "Beneficiary Scheme": item.scheme || "Milk Pay", // Default to "Milk Pay"
      "All Payment": item.namt || "N/A",
      Remark: remark, // Add the Remark column
    }));

    // Create a new worksheet
    const worksheet = XLSX.utils.json_to_sheet(worksheetData);

    // Define headers (optional if you want to customize)
    XLSX.utils.sheet_add_aoa(
      worksheet,
      [
        [
          "Code",
          "Customer Name",
          "Bank ACC No",
          "Mobile",
          "Beneficiary Scheme",
          "All Payment",
          "Remark",
        ],
      ],
      { origin: "A1" }
    );

    // Create a new workbook and append the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, " Sheet 1");

    // Generate and download the Excel file
    const excelFileName = "ADCC_Bank_Report.xlsx";
    XLSX.writeFile(workbook, excelFileName);
  };
  console.log("Bankdata", bankList);

  //.... AddCB BAnk Excel
  const exportADCCBToExcel = () => {
    if (loading) {
      alert("Data is still loading. Please wait.");
      return;
    }

    if (combinedFilteredData.length === 0) {
      alert("No data available to export.");
      return;
    }

    // Prepare data for Excel
    const worksheetData = combinedFilteredData.map((item, index) => ({
      "Sr.no": index + 1,
      "Customer Name": item.customerName || "N/A",
      "Bank ACC No": item.cust_accno || "N/A",
      Mobile: item.mobile || "N/A", // Include mobile number
      ID: index + 1, // Separate column for ID as a number
      "ID Name": "ADCCB", // Separate column for ID Name
      "All Payment": item.namt || "N/A",
    }));

    // Create a new worksheet
    const worksheet = XLSX.utils.json_to_sheet(worksheetData);

    // Define headers (optional if you want to customize)
    XLSX.utils.sheet_add_aoa(
      worksheet,
      [
        [
          "SR.NO",
          "Customer Name",
          "Bank ACC No",
          "Mobile",
          "ID",
          "ID NAME",
          "All Payment",
        ],
      ],
      { origin: "A1" }
    );

    // Create a new workbook and append the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, " Sheet 1");

    // Generate and download the Excel file
    const excelFileName = "ADCCB_Bank_Report.xlsx";
    XLSX.writeFile(workbook, excelFileName);
  };

  //....  UNIONBANK BAnk Excel
  const exportUNIONBANKExcel = () => {
    if (loading) {
      alert("Data is still loading. Please wait.");
      return;
    }

    if (combinedFilteredData.length === 0) {
      alert("No data available to export.");
      return;
    }

    // Sanstha Name (replace with your desired name or dynamic variable)
    const sansthaName = "Sanstha Name:  Hariom DSK Nimon ";

    // Prepare data for Excel
    const worksheetData = combinedFilteredData.map((item, index) => ({
      "Bank ACC No": item.cust_accno || "N/A",
      Scheme: "C",
      Remark: "Dairy Pay",
      "Customer Name": item.customerName || "N/A",
      "All Payment": item.namt || "N/A",
    }));

    // Create a new worksheet
    const worksheet = XLSX.utils.json_to_sheet(worksheetData);

    // Add "Sanstha Name" at the top-left corner
    XLSX.utils.sheet_add_aoa(
      worksheet,
      [[sansthaName]], // Add Sanstha Name
      { origin: "A1" }
    );

    // Add headers below the Sanstha Name
    XLSX.utils.sheet_add_aoa(
      worksheet,
      [["Accound- No", "Scheme", "Remark", "Customer Name", "AMT"]],
      { origin: "A2" } // Start the headers at row 2 (below the Sanstha Name)
    );

    // Create a new workbook and append the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet 1");

    // Generate and download the Excel file
    const excelFileName = "Union_Bank_Report.xlsx";
    XLSX.writeFile(workbook, excelFileName);
  };
  //.... SBI Bank

  const exportSBIBANKExcel = () => {
    if (loading) {
      alert("Data is still loading. Please wait.");
      return;
    }

    if (combinedFilteredData.length === 0) {
      alert("No data available to export.");
      return;
    }

    // Define the Sanstha Name
    const sansthaName = "Sanstha Name: Hariom DSK Nimon";

    // Prepare data for Excel
    const worksheetData = combinedFilteredData.map((item, index) => ({
      "sr.no": index + 1,
      "IFSC Code": item.cust_ifsc || "N/A",
      "Bank ACC No": item.cust_accno || "N/A",
      "All Payment": item.namt || "N/A",
      "Customer Name": item.customerName || "N/A",
      "Bank Place": item.city || "N/A",
    }));

    // Create a new worksheet
    const worksheet = XLSX.utils.json_to_sheet([]);

    // Add "Sanstha Name" at the top-left corner (row 1)
    XLSX.utils.sheet_add_aoa(worksheet, [[sansthaName]], { origin: "A1" });

    // Add headers below the Sanstha Name (row 2)
    XLSX.utils.sheet_add_aoa(
      worksheet,
      [
        [
          "SR.NO",
          "IFSC CODE",
          "AMT",
          "BENIFICIARY A/C",
          "BENIFICIARY NAME",
          "BANK PLACE",
        ],
      ],
      { origin: "A2" }
    );

    // Add data below the headers (starting from row 3)
    XLSX.utils.sheet_add_json(worksheet, worksheetData, {
      origin: "A3",
      skipHeader: true,
    });

    // Create a new workbook and append the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet 1");

    // Generate and download the Excel file
    const excelFileName = "SBI_Bank_Report.xlsx";
    XLSX.writeFile(workbook, excelFileName);
  };
  //.......... Canara Bank
  const exportCANARABANKExcel = () => {
    if (loading) {
      alert("Data is still loading. Please wait.");
      return;
    }

    if (combinedFilteredData.length === 0) {
      alert("No data available to export.");
      return;
    }

    // Get the current date in DD-MM-YYYY format
    const currentDate = new Date()
      .toLocaleDateString("en-GB")
      .replace(/\//g, "-");
    const processDate = `Process Date: ${currentDate}`;

    // Prepare data for Excel
    const worksheetData = combinedFilteredData.map((item, index) => ({
      "Txn Type": "1",
      "Bank ACC No": item.cust_accno || "N/A",
      "Branch Code": "125",
      "Txn Code": "1408",
      "Txn Date": currentDate, // Replaced with current date
      "DR/CR": "C",
      "Value Dt": currentDate, // Replaced with current date
      "Txn CCY": "104",
      "AMT LCY": item.namt || "N/A",
      "AMT TCY": item.namt || "N/A",
      "Rate Con": "1",
      "Ref No": "0",
      "Ref Doc No": "0",
      "Transaction-Description": "MILK PAYMENT",
      "Benef IO": "",
      "Benef Name": item.customerName || "N/A",
      "IFSC Code": item.cust_ifsc || "N/A",
      "Benef ADD 1": "",
      "Benef ADD 2": "",
      "Benef ADD 3": item.mobile || "N/A",
      "Benef City": item.city || "N/A",
      "Benef State": "",
      "Benef Country": "",
      "Benef Zip": "",
      Option: "10",
      "Issuer Code": "",
      "Payable At": "",
      "Fig FDT": "N",
      "MIS Account Number": "",
      END: "END",
    }));

    // Create a new worksheet
    const worksheet = XLSX.utils.json_to_sheet([]);

    // Add "Process Date" at the top-left corner (row 1)
    XLSX.utils.sheet_add_aoa(worksheet, [[processDate]], { origin: "A1" });

    // Add headers below the process date (row 2)
    XLSX.utils.sheet_add_aoa(
      worksheet,
      [
        [
          "Txn Type",
          "Bank ACC No",
          "Branch Code",
          "Txn Code",
          "Txn Date",
          "DR/CR",
          "Value Dt",
          "Txn CCY",
          "AMT LCY",
          "AMT TCY",
          "Rate Con",
          "Ref No",
          "Ref Doc No",
          "Transaction-Description",
          "Benef IO",
          "Benef Name",
          "IFSC Code",
          "Benef ADD 1",
          "Benef ADD 2",
          "Benef ADD 3",
          "Benef City",
          "Benef State",
          "Benef Country",
          "Benef Zip",
          "Option",
          "Issuer Code",
          "Payable At",
          "Fig FDT",
          "MIS Account Number",
          "END",
        ],
      ],
      { origin: "A2" }
    );

    // Add data below the headers (starting from row 3)
    XLSX.utils.sheet_add_json(worksheet, worksheetData, {
      origin: "A3",
      skipHeader: true,
    });

    // Create a new workbook and append the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet 1");

    // Generate and download the Excel file
    const excelFileName = "CANARA_Bank_Report.xlsx";
    XLSX.writeFile(workbook, excelFileName);
  };

  const exportIDBIBANKExcel = () => {
    if (loading) {
      alert("Data is still loading. Please wait.");
      return;
    }

    if (combinedFilteredData.length === 0) {
      alert("No data available to export.");
      return;
    }
    const currentDate = new Date()
      .toLocaleDateString("en-GB")
      .replace(/\//g, "-");
    const processDate = `Process Date: ${currentDate}`;

    // Prepare data for Excel
    const worksheetData = combinedFilteredData.map((item, index) => {
      // Combine all column values into a single string for "Bulk Data" using tilde (~) as a separator
      const bulkData = [
        item.namt || "N/A",
        "0",
        item.cust_ifsc || "N/A",
        item.cust_accno || "N/A",
        "10",
        item.customerName || "N/A",
        item.cust_bankname || "N/A",
        "Milk Payment",
        item.createdby || "N/A",
      ].join(" ~ "); // Using " ~ " as a separator

      return {
        AMT: item.namt || "N/A",
        "Sender AC": "0",
        "IFSC Code": item.cust_ifsc || "N/A",
        "Bank ACC No": item.cust_accno || "N/A",
        "Bene Ac Type": "10",
        "Benef Name": item.customerName || "N/A",
        "Bank Name": item.cust_bankname || "N/A",
        info: "Milk Payment",
        "Originator Of Remittance": item.createdby || "N/A",
        "Bulk Data": bulkData, // Updated separator in Bulk Data
      };
    });

    // Create a new worksheet
    const worksheet = XLSX.utils.json_to_sheet([]);

    // Add an **empty first row** (row 1)
    XLSX.utils.sheet_add_aoa(worksheet, [[]], { origin: "A1" });

    // Add headers below the empty row (row 2)
    XLSX.utils.sheet_add_aoa(
      worksheet,
      [
        [
          "AMOUNT",
          "Sender AC",
          "Bene IFSC",
          "Bene AC No",
          "Bene AC Type",
          "Bene AC Name",
          "Bank Name",
          "Info",
          "Originator of Remittance",
          "Bulk Data",
        ],
      ],
      { origin: "A2" }
    );

    // Add data below the headers (starting from row 3)
    XLSX.utils.sheet_add_json(worksheet, worksheetData, {
      origin: "A3",
      skipHeader: true,
    });

    // Create a new workbook and append the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet 1");

    // Generate and download the Excel file
    const excelFileName = "IDBI_Bank_Report.xlsx";
    XLSX.writeFile(workbook, excelFileName);
  };

  const exportBadodaraToExcel = () => {
    if (loading) {
      alert("Data is still loading. Please wait.");
      return;
    }

    if (combinedFilteredData.length === 0) {
      alert("No data available to export.");
      return;
    }

    // Get the current date in DD-MM-YYYY format
    const currentDate = new Date()
      .toLocaleDateString("en-GB")
      .replace(/\//g, "-");

    // Ensure fromDate and toDate are not empty
    if (!fromDate || !toDate) {
      alert("Please select a valid From Date and To Date.");
      return;
    }

    // Convert fromDate and toDate to Date objects for formatting
    const fromDateObj = new Date(fromDate);
    const toDateObj = new Date(toDate);

    // Format dates as "1 TO 10 NOV 2024"
    const formattedFromDate = fromDateObj.getDate();
    const formattedToDate = toDateObj.getDate();
    const formattedMonthYear = toDateObj
      .toLocaleDateString("en-GB", {
        month: "short",
        year: "numeric",
      })
      .toUpperCase(); // Converts "Nov 2024" to "NOV 2024"

    const formattedDateRange = `${formattedFromDate} TO ${formattedToDate} ${formattedMonthYear}`;

    console.log("Exporting Excel with date range:", formattedDateRange);

    // Prepare data for Excel
    const worksheetData = combinedFilteredData.map((item) => ({
      "Value Date": currentDate || "N/A",
      "Bank ACC No": item.cust_accno || "N/A",
      Description: `DUDH PAY ${formattedDateRange}`, // Correctly formatted date in Description
      Currency: "INR",
      "D/C": "C",
      "Transaction Amount": item.namt || "N/A",
      "Account Name": item.customerName || "N/A",
    }));

    // Create a new worksheet
    const worksheet = XLSX.utils.json_to_sheet([]);

    // Add headers at the top
    XLSX.utils.sheet_add_aoa(
      worksheet,
      [
        [
          "Value Date",
          "Bank ACC No",
          "Description",
          "Currency",
          "D/C",
          "Transaction Amount",
          "Account Name",
        ],
      ],
      { origin: "A1" }
    );

    // Add data below the headers (starting from row 2)
    XLSX.utils.sheet_add_json(worksheet, worksheetData, {
      origin: "A2",
      skipHeader: true,
    });

    // Create a new workbook and append the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet 1");

    // Generate and download the Excel file
    const excelFileName = "Badodata-Bank_Report.xlsx";
    XLSX.writeFile(workbook, excelFileName);
  };

  const exportAXISToExcel = () => {
    if (loading) {
      alert("Data is still loading. Please wait.");
      return;
    }

    if (combinedFilteredData.length === 0) {
      alert("No data available to export.");
      return;
    }

    const currentDate = new Date()
      .toLocaleDateString("en-GB")
      .replace(/\//g, "-");

    // Prepare data for Excel
    const worksheetData = combinedFilteredData.map((item, index) => ({
      Payment: "N", // Fixed the column name from " Payment"
      Amount: item.namt || "N/A",
      Date: currentDate || "N/A",
      "Beneficiary Account Name": item.customerName || "N/A",
      "Beneficiary Account No": item.cust_accno || "N/A",
      "For BANK": "", // Corrected this to one column
      "DSK Account No": "0",
      "Min 6 Digit Code": item.Code || "N/A", // Fixed the column name from "Min 6 Digit Codee"
      "IFSC Code-bank": item.cust_ifsc || "N/A",
      "Number 10": "10", // Fixed the column name from " number 10"
      Remark: "0", // You can customize this based on the need
    }));

    // Create a new worksheet
    const worksheet = XLSX.utils.json_to_sheet(worksheetData);

    // Define headers (matching the data columns)
    XLSX.utils.sheet_add_aoa(
      worksheet,
      [
        [
          "Payment",
          "Amount",
          "Date",
          "Beneficiary Account Name",
          "Beneficiary Account No",
          "For BANK",
          "DSK Account No",
          "Min 6 Digit Code",
          "IFSC Code-bank",
          "Number 10",
          "Remark",
        ],
      ],
      { origin: "A1" } // Set the header to start from cell A1
    );

    // Create a new workbook and append the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet 1");

    // Generate and download the Excel file
    const excelFileName = "AXIS-Bank_Report.xlsx";
    XLSX.writeFile(workbook, excelFileName);
  };

  const exportOverseasBANKExcel = () => {
    if (loading) {
      alert("Data is still loading. Please wait.");
      return;
    }

    if (combinedFilteredData.length === 0) {
      alert("No data available to export.");
      return;
    }

    const dairyName = "Your Dairy Name"; // Set the dairy name here

    // Calculate total sum of the AMOUNT column
    const totalAmount = combinedFilteredData.reduce(
      (sum, item) => sum + (parseFloat(item.namt) || 0),
      0
    );

    // Prepare data for Excel
    const worksheetData = combinedFilteredData.map((item, index) => ({
      "SEQ NO": index + 1,
      AMOUNT: item.namt || "N/A",
      "AC Type": "",
      "SMS/EMAIl": "SMS",
      Mobile: item.mobile || "N/A",
      "BEN ACC No": item.cust_accno || "N/A",
      "Benef Name": item.customerName || "N/A",
      ADDR1: item.city || "N/A",
      ADDR2: item.Code || "N/A",
      "IFSC ": item.cust_ifsc || "N/A",
      "SENDER INFO1": item.createdby || "N/A",
      "SENDER INFO2": "",
    }));

    // Append total row at the end
    worksheetData.push({
      "SEQ NO": "", // Leave empty
      AMOUNT: `Total: ${totalAmount.toFixed(2)}`, // Total amount value
      "AC Type": "",
      "SMS/EMAIl": "",
      Mobile: "",
      "BEN ACC No": "",
      "Benef Name": "",
      ADDR1: "",
      ADDR2: "",
      "IFSC ": "",
      "SENDER INFO1": "",
      "SENDER INFO2": "",
    });

    // Create a new worksheet
    const worksheet = XLSX.utils.json_to_sheet([]);

    // Insert the dairy name in the first row (A1)
    XLSX.utils.sheet_add_aoa(worksheet, [[dairyName]], { origin: "A1" });

    // Add a blank line (A2) before the headers
    XLSX.utils.sheet_add_aoa(worksheet, [[""]], { origin: "A2" });

    // Add headers in row 3 (A3)
    XLSX.utils.sheet_add_aoa(
      worksheet,
      [
        [
          "SEQ NO",
          "AMOUNT",
          "AC TYPE",
          "SMS/EMAIL",
          "MOB NO",
          "BEN AC NO",
          "BEN AC NAME",
          "ADDR 1",
          "ADDR 2",
          "IFSC ",
          "SENDER INFO1",
          "SENDER INFO2",
        ],
      ],
      { origin: "A3" }
    );

    // Add data below the headers (starting from row 4)
    XLSX.utils.sheet_add_json(worksheet, worksheetData, {
      origin: "A4",
      skipHeader: true,
    });

    // Create a new workbook and append the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet 1");

    // Generate and download the Excel file
    const excelFileName = "Overseas_Bank_Report.xlsx";
    XLSX.writeFile(workbook, excelFileName);
  };

  const exportToMarathiPDF = () => {
    if (loading) {
      alert("डेटा लोड होत आहे. कृपया थांबा.");
      return;
    }

    if (!combinedFilteredData || combinedFilteredData.length === 0) {
      alert("नाही डेटा निर्यात करण्यासाठी उपलब्ध.");
      return;
    }

    const doc = new jsPDF();

    // Add and use the embedded font
    doc.addFileToVFS("NotoSansDevanagari.ttf", NotoSansDevanagari);
    doc.addFont("NotoSansDevanagari.ttf", "NotoSansDevanagari", "normal");
    doc.setFont("NotoSansDevanagari");

    // The rest of your code
    const columns = [
      { header: "कोड", dataKey: "Code" },
      { header: "ग्राहकाचे नाव", dataKey: "customerName" },
      { header: "बँक अकाउंट नंबर", dataKey: "cust_accno" },
      { header: "सर्व पेमेंट", dataKey: "namt" },
    ];

    const rows = combinedFilteredData.map((item) => ({
      Code: item.Code || "N/A",
      customerName: item.customerName || "N/A",
      cust_accno: item.cust_accno || "N/A",
      namt: item.namt || "N/A",
    }));

    const pageWidth = doc.internal.pageSize.getWidth();
    const createdby = dairyname;
    doc.setFontSize(16);
    const dairyTextWidth = doc.getTextWidth(createdby);
    doc.text(createdby, (pageWidth - dairyTextWidth) / 2, 15);

    const City = CityName;
    const cityTextWidth = doc.getTextWidth(`शहर: ${City}`);
    doc.text(`शहर: ${City}`, (pageWidth - cityTextWidth) / 2, 25);

    const reportTitle = "पेमेंट बँक रिपोर्ट";
    const titleTextWidth = doc.getTextWidth(reportTitle);
    doc.text(reportTitle, (pageWidth - titleTextWidth) / 2, 35);

    const dateText = `पासून: ${fromDate} पर्यंत: ${toDate}`;
    const dateTextWidth = doc.getTextWidth(dateText);
    doc.text(dateText, (pageWidth - dateTextWidth) / 2, 45);

    doc.setFontSize(12);

    doc.autoTable({
      columns: columns,
      body: rows,
      startY: 55,
      headStyles: {
        fillColor: [22, 160, 133],
        fontSize: 12,
        textColor: [255, 255, 255],
        halign: "center",
      },
      bodyStyles: {
        fontSize: 10,
        halign: "center",
      },
      theme: "grid",
    });

    doc.save("Deduction_Report.pdf");
  };

  const exportToPDF = () => {
    if (loading) {
      alert("Data is still loading. Please wait.");
      return;
    }

    if (combinedFilteredData.length === 0) {
      alert("No data available to export.");
      return;
    }

    // Proceed with PDF export logic
    const doc = new jsPDF();
    const columns = [
      { header: "Code", dataKey: "Code" },
      { header: "Customer Name", dataKey: "customerName" },
      { header: "Bank ACC No", dataKey: "cust_accno" },
      { header: "All Payment", dataKey: "namt" },
    ];

    const rows = combinedFilteredData.map((item, index) => ({
      Code: item.Code || "N/A",
      customerName: item.customerName || "N/A",
      cust_accno: item.cust_accno || "N/A",
      namt: item.namt || "N/A",
    }));

    const pageWidth = doc.internal.pageSize.getWidth();
    const createdby = dairyname; // Replace this with actual dairy name
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    const dairyTextWidth = doc.getTextWidth(createdby);
    doc.text(createdby, (pageWidth - dairyTextWidth) / 2, 15);

    // Get unique city names from the data
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    const City = CityName; // Replace with actual city
    const cityTextWidth = doc.getTextWidth(`City: ${City}`);
    doc.text(`City: ${City}`, (pageWidth - cityTextWidth) / 2, 25);

    //... Add report title below the city name
    const reportTitle = "Payment Bank Report";
    const titleTextWidth = doc.getTextWidth(reportTitle);
    doc.text(reportTitle, (pageWidth - titleTextWidth) / 2, 35);

    //... From to date
    const dateText = `From: ${fromDate} To: ${toDate}`;
    const dateTextWidth = doc.getTextWidth(dateText);
    doc.text(dateText, (pageWidth - dateTextWidth) / 2, 45);

    doc.autoTable({
      columns: columns,
      body: rows,
      startY: 55, // Start position for table
      headStyles: { fillColor: [22, 160, 133] }, // Custom styling for header
      theme: "grid", // Grid theme for table
    });

    doc.save("Deduction_Report.pdf");
  };
  const exportToNEWPDF = () => {
    if (loading) {
      alert("Data is still loading. Please wait.");
      return;
    }

    if (combinedFilteredData.length === 0) {
      alert("No data available to export.");
      return;
    }

    // Proceed with PDF export logic
    const doc = new jsPDF();
    const columns = [
      { header: "Code", dataKey: "Code" },
      { header: "Customer Name", dataKey: "customerName" },
      { header: "Bank ACC No", dataKey: "cust_accno" },
      { header: "All Payment", dataKey: "namt" },
    ];

    const rows = combinedFilteredData.map((item, index) => ({
      Code: item.Code || "N/A",
      customerName: item.customerName || "N/A",
      cust_accno: item.cust_accno || "N/A",
      namt: item.namt || "N/A",
    }));

    const pageWidth = doc.internal.pageSize.getWidth();
    const createdby = dairyname; // Replace this with actual dairy name
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    const dairyTextWidth = doc.getTextWidth(createdby);
    doc.text(createdby, (pageWidth - dairyTextWidth) / 2, 15);

    // Get unique city names from the data
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    const City = CityName; // Replace with actual city
    const cityTextWidth = doc.getTextWidth(`City: ${City}`);
    doc.text(`City: ${City}`, (pageWidth - cityTextWidth) / 2, 25);

    //... Add report title below the city name
    const reportTitle = "Payment Bank Report";
    const titleTextWidth = doc.getTextWidth(reportTitle);
    doc.text(reportTitle, (pageWidth - titleTextWidth) / 2, 35);

    //... From to date
    const dateText = `From: ${fromDate} To: ${toDate}`;
    const dateTextWidth = doc.getTextWidth(dateText);
    doc.text(dateText, (pageWidth - dateTextWidth) / 2, 45);

    doc.autoTable({
      columns: columns,
      body: rows,
      startY: 55, // Start position for table
      headStyles: { fillColor: [22, 160, 133] }, // Custom styling for header
      theme: "grid", // Grid theme for table
    });

    doc.save("Deduction_Report.pdf");
  };
  //.. Bankwise And Table section button

  const handleBankWiseClick = () => {
    setShowBankWise(true); // Show BankWise List
  };

  const handleTableClick = () => {
    setShowBankWise(false); // Show demo table
  };

  const BankExportFunctions = {
    "ADCC Report": exportADDCToExcel,
    "ADCCB Report": exportADCCBToExcel,
    "Union Bank": exportUNIONBANKExcel,
    "SBI Bank": exportSBIBANKExcel,
    "AXIS Bank": exportAXISToExcel,
    "IDBI Bank": exportIDBIBANKExcel,
    "Badodara Bank": exportBadodaraToExcel,
    "Overseas Bank": exportOverseasBANKExcel,
    "Canara Bank": exportCANARABANKExcel,
  };

  const  handleBankSelection = (event) => {
    const selectedBank = event.target.value;

    if (selectedBank && BankExportFunctions[selectedBank]) {
      BankExportFunctions[selectedBank](); // Call the corresponding export function
    } else {
      alert("Please select a valid bank report.");
    }
  };
  console.log("bankData", bankData);

  //marge data

  useEffect(() => {
    // Extract unique AccCodes from bank data
    const uniqueAccCodes = [...new Set(bankList.map((item) => item.AccCode))];

    // Find matching customers based on AccCode
    const matchingCustomers = uniqueAccCodes
      .map((accCode) =>
        customerlist.find(
          (customer) => String(customer.cid) === String(accCode)
        )
      )
      .filter(Boolean); // Filter out undefined values

    // Merge customer details into bank data
    const updatedDeduction = bankList.map((deductionItem) => {
      const matchingCustomer = matchingCustomers.find(
        (customer) => String(customer.cid) === String(deductionItem.AccCode)
      );

      return {
        ...deductionItem,
        customerName: matchingCustomer?.cname ?? "Unknown",
        Code: matchingCustomer?.srno ?? "Unknown",
        cust_accno: matchingCustomer?.cust_accno ?? "Unknown",
        cust_ifsc: matchingCustomer?.cust_ifsc ?? "Unknown",
        mobile: matchingCustomer?.mobile ?? "Unknown",
      };
    });

    // Update state with merged data
    setMergedData(updatedDeduction);
  }, [bankData, customerlist]);

  // Filter and transform the data
  // const combinedFilteredData = mergedData.filter((item) => {
  //   // Check Show All Customers filter
  //   const passesCustomerFilter = showAllCustomers
  //     ? item.DeductionId === 0 // Show all customers
  //     : item.DeductionId === 0 && item.namt > 0; // Only show customers with namt > 0 if unchecked

  //   // Check From-To Code filter
  //   const isCodeInRange =
  //     (fromCode === "" || item.Code >= fromCode) &&
  //     (toCode === "" || item.Code <= toCode); // Check if code is in range

  //   // Combine both filters
  //   return passesCustomerFilter && isCodeInRange;
  // });
  const combinedFilteredData = mergedData.filter((item) => {
    // Convert codes to numbers safely
    const itemCode = Number(item.Code);
    const from = fromCode !== "" ? Number(fromCode) : null;
    const to = toCode !== "" ? Number(toCode) : null;

    const passesCustomerFilter = showAllCustomers
      ? item.DeductionId === 0 // Show all customers
      : item.DeductionId === 0 && item.namt > 0; // Only show customers with namt > 0 if unchecked

    const isCodeInRange =
      (from === null || itemCode >= from) && (to === null || itemCode <= to); // Check if code is in range

    return passesCustomerFilter && isCodeInRange;
  });


  // Log mergedData and combinedFilteredData for debugging
  useEffect(() => {
    console.log("Merged Data:", mergedData);
    console.log("Filtered Data:", combinedFilteredData);
  }, [mergedData, combinedFilteredData]);

  // Calculate the total namt value
  const totalNamt = combinedFilteredData.reduce(
    (sum, item) => sum + item.namt,
    0
  );

  // Append a row for the total
  if (totalNamt > 0) {
    combinedFilteredData.push({
      DeductionId: null,
      Code: "Total", // Display as "Total" in the Code column
      namt: totalNamt,
      // Add other properties as needed or leave null
    });
  }
  //... map the bank code and bank list
  const handleCodeChange = (e) => {
    const code = e.target.value;
    setSelectedCode(code);

    const matchedBank = bankList.find(
      (bank) => String(bank.code).trim() === code.trim()
    );

    setSelectedBank(matchedBank ? matchedBank.name : "");
  };


  // When bank name is selected
 const handleBankChange = (e) => {
   const name = e.target.value;
   setSelectedBank(name);

   const matchedBank = bankList.find(
     (bank) => bank.name.trim().toLowerCase() === name.trim().toLowerCase()
   );

   setSelectedCode(matchedBank ? String(matchedBank.code) : "");
 };

  return (
    <div className="bank-register-container w100 h1 d-flex-col bg">
      <span className="heading">Bank Register Report</span>

      {/* First Part */}
      <div className="bank-first-container w100 h40 d-flex-col sa">
        <div className="date-from-to-bank d-flex w100 h20 p10 bg">
          <div className="from-date-bank-div w30 d-flex  a-center">
            <span className="label-text w20">from:</span>
            <input
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="data w60"
              type="date"
            />
          </div>
          <div className="bank-to-date-div w30 d-flex h1 a-center">
            <span className="label-text w20">To :</span>
            <input
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="data w60"
              type="date"
            />
          </div>
          <div className="report-show-button w10 h1 d-flex a-center">
            <button className="w-btn" onClick={handlefetchData}>
              Report
            </button>
          </div>
        </div>
        <div className="checkbox-side-div w100  d-flex bg a-center">
          <div className="amt-checkbox-div w20  d-flex a-center p10">
            <input
              className="w20"
              type="checkbox"
              checked={showAllCustomers}
              onChange={(e) => setShowAllCustomers(e.target.checked)}
            />
            <span className="label-text w40">Amt-cust</span>
          </div>
          <div className="centerwise-checkbox-div w20 h1 d-flex a-center">
            <input
              className="w20"
              type="checkbox"
              checked={showIfscCode}
              onChange={(e) => setShowIfscCode(e.target.checked)} // Update checkbox state
            />
            <span className="label-text w40">Ifsc Code </span>
          </div>
          <div className="customerwise-checkbox-div w20 h1 d-flex a-center">
            <input
              className="w20"
              type="checkbox"
              checked={showCustomerwiseDateFilter}
              onChange={(e) => setShowCustomerwiseDateFilter(e.target.checked)} // Update checkbox state
            />
            <span className="label-text w40">Custwise</span>
          </div>
          <div className="refresh-button-container w10 h10 d-flex a-center">
            <button className="w-btn" onClick={handleRefresh}>
              Refresh
            </button>
          </div>
        </div>
        <div v className="bank-code-div w90  d-flex a-center">
          <div className="bank-textfield-div w30  a-center p10 ">
            <span className="w70 label-text px10 ">Bank Code:</span>
            <input
              className="w30 data"
              value={selectedCode}
              onChange={handleCodeChange}
              type="text"
            />
          </div>
          <div className="bank-reprts-dropdown  w40 h30 d-flex a-center ">
            <span className=" label-text w40 "> Select Bank:</span>
            <select className="data w60" value={selectedBank} onChange={handleBankChange}>
              <option value="">-- Select Bank --</option>
              {bankList.map((bank) => (
                <option key={bank.code} value={bank.name}>
                  {bank.name}
                </option>
              ))}
            </select>
          </div>
          <div className="bank-regsiter-buttons-pdf-excel w40 sa d-flex">
            <div className="report-show-button w30  px10 d-flex a-center">
              <button className="w-btn" onClick={exportToPDF}>
                pdf
              </button>
            </div>
            <div className="report-old-bank d-flex w30 h90 a-center">
              <button className="btn" onClick={exportToNEWPDF}>
                English Excel
              </button>
            </div>
            <div className="report-old-bank d-flex w30 h90 a-center">
              <button className="btn" onClick={exportToMarathiPDF}>
                Marathi Excel
              </button>
            </div>
          </div>
        </div>

        {showCustomerwiseDateFilter && (
          <div className=" hide-from-to-code w100 h10 d-flex ">
            <div className="from-date-bank-div w20 d-flex h1 a-center">
              <span className="info-text w20">From :</span>
              <input
                className="data w30"
                type="text"
                value={fromCode}
                onChange={(e) => setFromCode(e.target.value)} // Update From Code
                placeholder=" From "
              />
            </div>
            <div className="bank-to-date-code-div w20 d-flex h1 a-center">
              <span className="info-text w20">To :</span>
              <input
                className="data w30"
                type="text"
                value={toCode}
                onChange={(e) => setToCode(e.target.value)} // Update To Code
                placeholder=" To "
              />
            </div>
          </div>
        )}
      </div>

      {/* Second Part */}

      {/* Add Button to Toggle Views */}
      {/* <div className="toggle-buttons-div  w100 h10 d-flex a-center ">
        <div className="bank-data-div w20 h60 px10 ">
          <button onClick={handleBankWiseClick} className="w-btn ">
            Bank
          </button>
        </div>
        <div className="report-show-button w10 h1 d-flex a-center">
          <button className="w-btn" onClick={exportToPDF}>
            pdf
          </button>
        </div>
      </div> */}
      {/* {showBankWise ? (
        <div className="bankwise-list-container w100 h60 d-flex-col bg">
          <div className="list-and-all-banks-div w100 h10 d-flex ">
            <div className="collected-list-checkbox w50 h1 d-flex a-center">
              <input className="w10" type="checkbox" />
              <span className="w50label-text">Collected</span>
            </div>
            <div className="collected-list-checkbox w50 h1 d-flex a-center">
              <input className="w10" type="checkbox" />
              <span className="w50label-text">All Banks</span>
            </div>
          </div>

          <div className="bank-selection-div-container w100 h70 d-flex">
            <div className="a-list-button-and-report-div w40 h30 d-flex-col  j-center  my10">
              <div className="dropdown-bank-div w100 h80 d-flex a-center p10 ">
                <select className="w50 data" name="" id="">
                  <option value="">AC List</option>
                </select>
              </div>
              <div className="button-section-div w100 h80 a-center d-flex">
                <div className="report-old-bank d-flex w80 h90 a-center">
                  <button className="btn">Update hold PMT</button>
                </div>
              </div>
            </div>

            <div className="dropdown-for-bank-reprots d-flex-col  w50 h80  ">
              <span className="heading label-text  ">
                Bankwise Report Download:
              </span>
            </div>
          </div>
        </div>
      ) : (
         */}
      <div className="demo-table-section w100 h60 d-flex-col bg">
        <span className="heading">Table</span>

        {/* Add your table-related functionalities or interactions here */}

        {combinedFilteredData.length > 0 ? (
          <div className="table-container">
            <table className="styled-table">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Customer Name</th>
                  <th>Bank ACC No</th>
                  <th>All payment</th>
                  {showIfscCode && <th>IFSC Code</th>}{" "}
                  {/* Conditionally render IFSC column */}
                </tr>
              </thead>
              <tbody>
                {combinedFilteredData.map((item, index) => (
                  <tr key={index}>
                    <td>{item.Code}</td> {/* Display Code */}
                    <td>{item.customerName}</td> {/* Display Customer Name */}
                    <td>{item.cust_accno}</td> {/* Display Account No */}
                    <td>{item.namt}</td> {/* Display Payment */}
                    {showIfscCode && <td>{item.cust_ifsc}</td>}{" "}
                    {/* Conditionally render IFSC code */}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>No data available.</p>
        )}
      </div>
    </div>
  );
};

export default BankReportMaster;
