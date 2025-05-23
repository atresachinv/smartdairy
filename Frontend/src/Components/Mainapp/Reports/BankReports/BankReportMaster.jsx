import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import autoTable from "jspdf-autotable";
import jsPDF from "jspdf";
import * as XLSX from "xlsx";
import { useDispatch, useSelector } from "react-redux";
import { getBankList } from "../../../../App/Features/Mainapp/Masters/bankSlice";
import { fetchPaymentDetails } from "../../../../App/Features/Payments/paymentSlice";
import { listCustomer } from "../../../../App/Features/Customers/customerSlice";
import "../../../../Styles/Reportsbanks/Bankreport.css";
const BankReportMaster = () => {
  const dispatch = useDispatch();
  const customerlist = useSelector((state) => state.customer.customerlist); //api call Using reducx
  const status = useSelector((state) => state.payment.fpaystatus); //api call Using reducx
  const payDetails = useSelector((state) => state.payment.paymentDetails);
  const bankList = useSelector((state) => state.bank.banksList || []); // bank list
  const [fromdate, setFromDate] = useState("");
  const [todate, setToDate] = useState("");
  const [bankdetails, setBankdetails] = useState([]);
  const [selectedBank, setSelectedBank] = useState("");
  const [selectedCode, setSelectedCode] = useState("");
  const [filteredBankDetails, setFilteredBankDetails] = useState([]);
  const [showIFSC, setShowIFSC] = useState(false);
  const [amtCustFilter, setAmtCustFilter] = useState(false);
  const [loading, setLoading] = useState(false);


  const dairyname = useSelector(
    (state) =>
      state.dairy.dairyData.SocietyName || state.dairy.dairyData.center_name
  );
  const CityName = useSelector((state) => state.dairy.dairyData.city);

  // Handle Bank Code change
  const handleCodeChange = (e) => {
    const code = e.target.value.trim();
    setSelectedCode(code);

    const matchedBank = bankList.find(
      (bank) => String(bank.code).trim() === code
    );

    const name = matchedBank ? matchedBank.name : "";
    setSelectedBank(name);

    const filtered = bankdetails.filter(
      (bank) => String(bank.bankcode).trim() === code
    );
    setFilteredBankDetails(filtered);
  };
  console.log(customerlist);

  // Handle Bank Name change
  const handleBankChange = (e) => {
    const name = e.target.value.trim();
    setSelectedBank(name);

    const matchedBank = bankList.find(
      (bank) => bank.name.trim().toLowerCase() === name.toLowerCase()
    );

    const code = matchedBank ? String(matchedBank.code) : "";
    setSelectedCode(code);

    // Bank code and name wise filter
    const filtered = bankdetails.filter(
      (bank) => bank.bankname.trim().toLowerCase() === name.toLowerCase()
    );
    setFilteredBankDetails(filtered);
  };

  // console.log("payment", payDetails);
  // console.log(customerlist, bankList);
  // console.log("dates", fromdate, todate);
  //fetchpayment data
  const handlepayment = () => {
    dispatch(fetchPaymentDetails({ fromdate, todate }));
    dispatch(listCustomer());
    dispatch(getBankList());
  };

  // useEffect(() => {
  //   // we have payDetails we want just DeductionId: 0
  //   // match payDetails.Code with customerlist.srno
  //   // after this generate data (bankdetails) get cname , srno from customerlist and payDetails.pamt
  //   // then match  customerlist.cust_bankname  with bankList.name
  //   // push backList all in above generated data (bankdetails)
  // }, [payDetails, customerlist, bankList]);

  useEffect(() => {
    if (!payDetails?.length || !customerlist?.length || !bankList?.length)
      return;

    const filtered = payDetails.filter((pay) => pay.DeductionId === 0);

    const result = filtered
      .map((pay) => {
        const customer = customerlist.find((cust) => cust.srno === pay.Code);
        if (!customer) return null;

        const bank = bankList.find((b) => b.name === customer.cust_bankname);

        return {
          cname: customer?.cname,
          srno: customer?.srno,
          accno: customer?.cust_accno,
          mobile: customer?.Phone || customer?.mobile,
          City: customer?.City || customer?.City,
          pamt: pay?.pamt,
          bankcode: bank?.code || "N/A",
          bankname: bank?.name || "N/A",

          bankIFSC: bank?.ifsc || "N/A",
          bankbranch: bank?.branch || "N/A",
        };
      })
      .filter(Boolean);

    setBankdetails(result);
  }, [payDetails, customerlist, bankList]);

  useEffect(() => {
    console.log("bankdetails:", bankdetails);
  }, [bankdetails]);

  // bank Ifcs Code
  const handleIFSCCheckbox = (e) => {
    setShowIFSC(e.target.checked);
  };

  // Excel
  const exportToExcel = () => {
    const dataSource =
      filteredBankDetails.length > 0 ? filteredBankDetails : bankdetails;

    const excelData = dataSource.map((bank) => ({
      Code: bank.bankcode,
      Cust_Code: bank.srno,
      "Bank Name": bank.bankname,
      ...(showIFSC ? { "Bank IFSC": bank.bankIFSC } : {}),
      "Bank ACC No": bank.accno || "N/A",
      "All payment": bank.pamt,
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Bank Details");

    // Write workbook to binary string
    const wbout = XLSX.write(workbook, { bookType: "xlsx", type: "binary" });

    // Convert binary string to blob
    const blob = new Blob([s2ab(wbout)], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    // Create a temporary link to download
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "bank-details-report.xlsx";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  // Marathi Excel
  const exportToExcelMarathi = () => {
    const dataSource =
      filteredBankDetails.length > 0 ? filteredBankDetails : bankdetails;

    const excelData = dataSource
      .filter((bank) => !amtCustFilter || parseFloat(bank.pamt) > 0) // Apply Amt-cust filter
      .map((bank) => ({
        कोड: bank.bankcode,
        "ग्राहक कोड": bank.srno,
        "बँकेचे नाव": bank.bankname,
        ...(showIFSC ? { "बँक IFSC कोड": bank.bankIFSC } : {}),
        "बँक खाते क्रमांक": bank.accno || "N/A",
        "एकूण पेमेंट": bank.pamt,
      }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "बँक माहिती");

    // Convert to binary string
    const wbout = XLSX.write(workbook, { bookType: "xlsx", type: "binary" });

    // Convert binary string to Blob
    const blob = new Blob([s2ab(wbout)], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    // Download
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "बँक-तपशील- अहवाल.xlsx";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Helper to convert string to ArrayBuffer
  const s2ab = (s) => {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xff;
    return buf;
  };

  //pdf Function
  const generatePDF = () => {
    const doc = new jsPDF();
    const tableData = [];

    const dataSource =
      filteredBankDetails.length > 0 ? filteredBankDetails : bankdetails;

    let totalPayment = 0;

    dataSource.forEach((bank) => {
      const payment = parseFloat(bank.pamt) || 0;
      totalPayment += payment;

      const row = [
        bank.bankcode || "",
        bank.srno || "",
        bank.bankname || "",
        ...(showIFSC ? [bank.bankIFSC || ""] : []),
        bank.accno || "N/A",
        payment.toFixed(2),
      ];
      tableData.push(row);
    });

    const tableHeaders = [
      "Code",
      "Cust_Code",
      "Bank Name",
      ...(showIFSC ? ["Bank IFSC"] : []),
      "Bank ACC No",
      "All payment",
    ];

    // Add total row
    const totalRow = new Array(tableHeaders.length).fill(""); // Empty cells
    totalRow[tableHeaders.length - 2] = "Total"; // Second last cell
    totalRow[tableHeaders.length - 1] = totalPayment.toFixed(2); // Last cell with total

    tableData.push(totalRow);

    // Header info
    doc.setFontSize(16);
    doc.text(String(dairyname), 105, 15, { align: "center" });

    doc.setFontSize(12);
    doc.text(String(CityName), 105, 23, { align: "center" });

    doc.setFontSize(13);
    doc.text("Bank Details Report", 105, 32, { align: "center" });

    doc.setFontSize(11);
    doc.text(`From: ${fromdate}   To: ${todate}`, 105, 40, { align: "center" });

    // Table
    autoTable(doc, {
      startY: 45,
      head: [tableHeaders],
      body: tableData,
    });

    doc.save("bank-details-report.pdf");
  };

  const displayedBankDetails = useMemo(() => {
    const source =
      filteredBankDetails.length > 0 ? filteredBankDetails : bankdetails;
    return amtCustFilter
      ? source.filter((b) => parseFloat(b.pamt) > 0)
      : source;
  }, [amtCustFilter, filteredBankDetails, bankdetails]);

  //. total payment
  const totalPayment = displayedBankDetails.reduce(
    (sum, bank) => sum + parseFloat(bank.pamt || 0),
    0
  );
  //......ADDC bank Excel Format
  const exportADDCToExcel = () => {
    if (loading) {
      alert("Data is still loading. Please wait.");
      return;
    }

    if (displayedBankDetails.length === 0) {
      alert("No data available to export.");
      return;
    }

    // Calculate the Remark based on fromDate and toDate
    const from = new Date(fromdate);
    const to = new Date(todate);

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
    const worksheetData = displayedBankDetails.map((item, index) => ({
      Code: item.srno || "N/A",
      "Customer Name": item.cname || "N/A",
      "Bank ACC No": item.accno || "N/A",
      Mobile: item.mobile || "N/A", // Include mobile number
      "Beneficiary Scheme": item.scheme || "Milk Pay", // Default to "Milk Pay"
      "All Payment": item.pamt || "N/A",
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

  //.... AddCB BAnk Excel
  const exportADCCBToExcel = () => {
    if (loading) {
      alert("Data is still loading. Please wait.");
      return;
    }

    if (displayedBankDetails.length === 0) {
      alert("No data available to export.");
      return;
    }

    // Prepare data for Excel
    const worksheetData = displayedBankDetails.map((item, index) => ({
      "Sr.no": index + 1,
      "Customer Name": item.cname || "N/A",
      "Bank ACC No": item.accno || "N/A",
      Mobile: item.mobile || "N/A", // Include mobile number
      ID: index + 1, // Separate column for ID as a number
      "ID Name": "ADCCB", // Separate column for ID Name
      "All Payment": item.pamt || "N/A",
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

    if (displayedBankDetails.length === 0) {
      alert("No data available to export.");
      return;
    }

    // Sanstha Name (replace with your desired name or dynamic variable)
    const sansthaName = "Sanstha Name:  Hariom DSK Nimon ";

    // Prepare data for Excel
    const worksheetData = displayedBankDetails.map((item, index) => ({
      "Bank ACC No": item.accno || "N/A",
      Scheme: "C",
      Remark: "Dairy Pay",
      "Customer Name": item.cname || "N/A",
      "All Payment": item.pamt || "N/A",
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

    if (displayedBankDetails.length === 0) {
      alert("No data available to export.");
      return;
    }

    // Define the Sanstha Name
    const sansthaName = "Sanstha Name: Hariom DSK Nimon";

    // Prepare data for Excel
    const worksheetData = displayedBankDetails.map((item, index) => ({
      "sr.no": index + 1,
      "IFSC Code": item.bankIFSC || "N/A",
      "Bank ACC No": item.accno || "N/A",
      "All Payment": item.pamt || "N/A",
      "Customer Name": item.cname || "N/A",
      "Bank Place": item.bankbranch || "N/A",
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

    if (displayedBankDetails.length === 0) {
      alert("No data available to export.");
      return;
    }

    // Get the current date in DD-MM-YYYY format
    const currentDate = new Date()
      .toLocaleDateString("en-GB")
      .replace(/\//g, "-");
    const processDate = `Process Date: ${currentDate}`;

    // Prepare data for Excel
    const worksheetData = displayedBankDetails.map((item, index) => ({
      "Txn Type": "1",
      "Bank ACC No": item.accno || "N/A",
      "Branch Code": "125",
      "Txn Code": "1408",
      "Txn Date": currentDate, // Replaced with current date
      "DR/CR": "C",
      "Value Dt": currentDate, // Replaced with current date
      "Txn CCY": "104",
      "AMT LCY": item.pamt || "N/A",
      "AMT TCY": item.pamt || "N/A",
      "Rate Con": "1",
      "Ref No": "0",
      "Ref Doc No": "0",
      "Transaction-Description": "MILK PAYMENT",
      "Benef IO": "",
      "Benef Name": item.cname || "N/A",
      "IFSC Code": item.bankIFSC || "N/A",
      "Benef ADD 1": "",
      "Benef ADD 2": "",
      "Benef ADD 3": item.mobile || "N/A",
      "Benef City": item.bankbranch || "N/A",
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

    if (displayedBankDetails.length === 0) {
      alert("No data available to export.");
      return;
    }
    const currentDate = new Date()
      .toLocaleDateString("en-GB")
      .replace(/\//g, "-");
    const processDate = `Process Date: ${currentDate}`;

    // Prepare data for Excel
    const worksheetData = displayedBankDetails.map((item, index) => {
      // Combine all column values into a single string for "Bulk Data" using tilde (~) as a separator
      const bulkData = [
        item.pamt || "N/A",
        "0",
        item.bankIFSC || "N/A",
        item.accno || "N/A",
        "10",
        item.cname || "N/A",
        item.bankname || "N/A",
        "Milk Payment",
        item.createdby || "N/A",
      ].join(" ~ "); // Using " ~ " as a separator

      return {
        AMT: item.pamt || "N/A",
        "Sender AC": "0",
        "IFSC Code": item.bankIFSC || "N/A",
        "Bank ACC No": item.accno || "N/A",
        "Bene Ac Type": "10",
        "Benef Name": item.cname || "N/A",
        "Bank Name": item.bankname || "N/A",
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

    if (displayedBankDetails.length === 0) {
      alert("No data available to export.");
      return;
    }

    // Get the current date in DD-MM-YYYY format
    const currentDate = new Date()
      .toLocaleDateString("en-GB")
      .replace(/\//g, "-");

    // Ensure fromDate and toDate are not empty
    if (!fromdate || !todate) {
      alert("Please select a valid From Date and To Date.");
      return;
    }

    // Convert fromDate and toDate to Date objects for formatting
    const fromDateObj = new Date(fromdate);
    const toDateObj = new Date(todate);

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
    const worksheetData = displayedBankDetails.map((item) => ({
      "Value Date": currentDate || "N/A",
      "Bank ACC No": item.accno || "N/A",
      Description: `DUDH PAY ${formattedDateRange}`, // Correctly formatted date in Description
      Currency: "INR",
      "D/C": "C",
      "Transaction Amount": item.pamt || "N/A",
      "Account Name": item.cname || "N/A",
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

    if (displayedBankDetails.length === 0) {
      alert("No data available to export.");
      return;
    }

    const currentDate = new Date()
      .toLocaleDateString("en-GB")
      .replace(/\//g, "-");

    // Prepare data for Excel
    const worksheetData = displayedBankDetails.map((item, index) => ({
      Payment: "N", // Fixed the column name from " Payment"
      Amount: item.pamt || "N/A",
      Date: currentDate || "N/A",
      "Beneficiary Account Name": item.cname || "N/A",
      "Beneficiary Account No": item.accno || "N/A",
      "For BANK": "", // Corrected this to one column
      "DSK Account No": "0",
      "Min 6 Digit Code": item.srno || "N/A", // Fixed the column name from "Min 6 Digit Codee"
      "IFSC Code-bank": item.bankIFSC || "N/A",
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

    if (displayedBankDetails.length === 0) {
      alert("No data available to export.");
      return;
    }

    const dairyName = dairyname; // Set the dairy name here

    // Calculate total sum of the AMOUNT column
    const totalAmount = displayedBankDetails.reduce(
      (sum, item) => sum + (parseFloat(item.namt) || 0),
      0
    );

    // Prepare data for Excel
    const worksheetData = displayedBankDetails.map((item, index) => ({
      "SEQ NO": index + 1,
      AMOUNT: item.pamt || "N/A",
      "AC Type": "",
      "SMS/EMAIl": "SMS",
      Mobile: item.mobile || "N/A",
      "BEN ACC No": item.accno || "N/A",
      "Benef Name": item.cname || "N/A",
      ADDR1: item.City || "N/A",
      ADDR2: item.srno || "N/A",
      "IFSC ": item.bankIFSC || "N/A",
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
  
  //
  
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

    const handleBankSelection = (event) => {
      const selected = event.target.value;
      setSelectedBank(selected);
  
      if (selected && BankExportFunctions[selected]) {
        BankExportFunctions[selected](); // Call the corresponding export function
      } else {
        alert("Please select a valid bank report.");
      }
    }

  return (
    <div className="bank-register-container w100 h1 d-flex-col  bg ">
      <span className="heading">Bank Register Report</span>
      {/* First Part */}
      <div className="bank-first-container w100 h40 d-flex-col sa">
        <div className="date-from-to-bank d-flex w100 h20">
          <div className="from-to-date-containerr w70 d-flex">
            <div className="from-date-bank-div w50 d-flex  a-center">
              <span className="label-text w20">from:</span>
              <input
                className="data w70"
                type="date"
                value={fromdate}
                onChange={(e) => setFromDate(e.target.value)}
              />
            </div>
            <div className="bank-to-date-div w50 d-flex h1 a-center">
              <span className="label-text w20">To :</span>
              <input
                className="data w70"
                type="date"
                value={todate}
                onChange={(e) => setToDate(e.target.value)}
              />
            </div>
          </div>
          <div className="report-show-button w100 h1 d-flex a-center">
            <button
              className="w-btn"
              type="button"
              onClick={handlepayment}
              disabled={status === "loading"}
            >
              {status === "loading" ? "Showing..." : "Show"}
            </button>
          </div>
        </div>
        <div className="checkbox-side-div w100  d-flex a-center">
          <div className="amt-cust-ifsc-div w60 d-flex a-center ">
            <div className="amt-checkbox-div w50 d-flex a-center p10">
              <input
                className="w20"
                type="checkbox"
                checked={amtCustFilter}
                onChange={(e) => setAmtCustFilter(e.target.checked)}
              />
              <span className="label-text w40">Amt-cust</span>
            </div>

            <div className="centerwise-checkbox-div w50 h1 d-flex a-center">
              <input
                className="w20"
                type="checkbox"
                checked={showIFSC}
                onChange={handleIFSCCheckbox}
              />
              <span className="label-text w40">IFSC Code</span>
            </div>
          </div>

          <div className="excel-bank-report w40 d-flex a-center ">
            <span className="label-text">Bank Report:</span>
            <select
              className="w60 data"
              value={selectedBank}
              onChange={handleBankSelection}
            >
              <option value="">-- Select Bank --</option>
              {Object.keys(BankExportFunctions).map((bankName) => (
                <option key={bankName} value={bankName}>
                  {bankName}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="bank-code-div w100  d-flex a-center">
          <div className="bank-code-select-bank-span-input d-flex w60 a-center ">
            <div className="bank-textfield-div w30 d-flex a-center ">
              <span className="w70 label-text  ">Bank Code:</span>
              <input
                className="w30 data"
                value={selectedCode}
                onChange={handleCodeChange}
                type="text"
              />
            </div>
            <div className="bank-reprts-dropdown w50 h30 d-flex a-center p10 ">
              <select
                className="data w100 "
                value={selectedBank}
                onChange={handleBankChange}
              >
                <option value="">-- Select Bank --</option>
                {bankList.map((bank) => (
                  <option key={bank.code} value={bank.name}>
                    {bank.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="bank-regsiter-buttons-pdf-excel w40 sa d-flex">
            <div className="report-show-button w30  px10 d-flex a-center">
              <button className="w-btn" onClick={generatePDF}>
                pdf
              </button>
            </div>
            <div className="report-old-bank d-flex w30 h90 a-center">
              <button className="btn" onClick={exportToExcel}>
                English Excel
              </button>
            </div>
            <div className="report-old-bank d-flex w30 h90 a-center">
              <button className="btn" onClick={exportToExcelMarathi}>
                Marathi Excel
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="demo-table-section w100 h60 d-flex-col bg">
        <div className="table-container">
          {Array.isArray(displayedBankDetails) &&
          displayedBankDetails.length > 0 ? (
            <table className="bank-details-table">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Cust_Code</th>
                  <th>Bank Name</th>
                  {showIFSC && <th>Bank IFSC</th>}
                  <th>Bank ACC No</th>
                  <th>All payment</th>
                </tr>
              </thead>
              <tbody>
                {displayedBankDetails.map((bank, index) => (
                  <tr key={index}>
                    <td>{bank.bankcode}</td>
                    <td>{bank.srno}</td>
                    <td>{bank.bankname}</td>
                    {showIFSC && <td>{bank.bankIFSC}</td>}
                    <td>{bank.accno || "N/A"}</td>
                    <td>{parseFloat(bank.pamt || 0).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td
                    colSpan={showIFSC ? 5 : 4}
                    style={{ textAlign: "right", fontWeight: "bold" }}
                  >
                    Total
                  </td>
                  <td style={{ fontWeight: "bold" }}>
                    {totalPayment.toFixed(2)}
                  </td>
                </tr>
              </tfoot>
            </table>
          ) : (
            <div
              style={{
                textAlign: "center",
                padding: "20px",
                fontSize: "16px",
                fontWeight: "500",
              }}
            >
              No data available
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BankReportMaster;
