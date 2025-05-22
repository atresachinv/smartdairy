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
    if (fromdate && todate) {
      console.log("hello.........");
    }
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
          <div className="amt-checkbox-div w30 d-flex a-center p10">
            <input
              className="w20"
              type="checkbox"
              checked={amtCustFilter}
              onChange={(e) => setAmtCustFilter(e.target.checked)}
            />
            <span className="label-text w40">Amt-cust</span>
          </div>

          <div className="centerwise-checkbox-div w30 h1 d-flex a-center">
            <input
              className="w20"
              type="checkbox"
              checked={showIFSC}
              onChange={handleIFSCCheckbox}
            />
            <span className="label-text w40">IFSC Code</span>
          </div>

          <div className="customerwise-checkbox-div w30 h1 d-flex a-center">
            <input className="w20" type="checkbox" />
            <span className="label-text w40">Custwise</span>
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
      <div className="demo-table-section w100 h60 d-flex-col">
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
