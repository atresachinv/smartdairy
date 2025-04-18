import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { listSubLedger } from "../../../../App/Features/Mainapp/Masters/ledgerSlice";
import Select from "react-select";
import { toast } from "react-toastify";
import axiosInstance from "../../../../App/axiosInstance";
import { listCustomer } from "../../../../App/Features/Customers/customerSlice";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";

//gett todays date------------>
const getTodaysDate = () => {
  const today = new Date();
  return today.toISOString().split("T")[0];
};
//set default date to today------------->

const LedgerList = () => {
  const dispatch = useDispatch();
  const [customerList, setCustomerList] = useState([]);
  const sledgerlist = useSelector((state) => state.ledger.sledgerlist);
  const [formData, setFormData] = useState({
    GLCode: "",
    date: getTodaysDate(),
  });
  const [voucherList, setVoucherlist] = useState([]);
  const [filterVoucherList, setFilterVoucherlist] = useState([]);
  const [filter, setFilter] = useState(0);
  const centerSetting = useSelector(
    (state) => state.dairySetting.centerSetting
  );
  const centerList = useSelector(
    (state) => state.center.centersList.centersDetails || []
  );
  const [settings, setSettings] = useState({});
  const autoCenter = useMemo(() => settings?.autoCenter, [settings]);
  const centerId = useSelector((state) => state.dairy.dairyData.center_id);
  const [loading, setLoading] = useState(false);
  const dairyInfo = useSelector(
    (state) =>
      state.dairy.dairyData.SocietyName || state.dairy.dairyData.center_name
  );

  //set setting
  useEffect(() => {
    if (centerSetting?.length > 0) {
      setSettings(centerSetting[0]);
    }
  }, [centerSetting]);

  //option list show only name
  const options = sledgerlist.map((i) => ({
    value: i.lno,
    label: i.marathi_name,
  }));

  useEffect(() => {
    dispatch(listSubLedger());
    dispatch(listCustomer());
  }, []);

  //----------------------------------------------------------------->
  // Effect to load customer list from local storage
  useEffect(() => {
    const storedCustomerList = localStorage.getItem("customerlist");
    if (storedCustomerList) {
      if (centerId === 0) {
        const filteredCustomerList = JSON.parse(storedCustomerList).filter(
          (customer) => Number(customer.centerid) === Number(filter)
        );
        setCustomerList(filteredCustomerList);

        const filteredVoucherList = voucherList.filter(
          (item) => Number(item.center_id) === Number(filter)
        );
        setFilterVoucherlist(filteredVoucherList);
      } else {
        const filteredCustomerList = JSON.parse(storedCustomerList).filter(
          (customer) => Number(customer.centerid) === Number(centerId)
        );
        setCustomerList(filteredCustomerList);
        const filteredVoucherList = voucherList.filter(
          (item) => Number(item.center_id) === Number(centerId)
        );
        setFilterVoucherlist(filteredVoucherList);
      }
    }
  }, [centerId, filter, voucherList]);

  // handle Select Change
  const handleSelectChange = (selectedOption, keyToUpdate) => {
    setFormData({
      ...formData,
      [keyToUpdate]: selectedOption.value,
    });
  };

  const handleFetchData = async (e) => {
    e.preventDefault();
    if (formData.GLCode && formData.date) {
      setLoading(true);
      try {
        //   GLCode, autoCenter, VoucherDate;
        const res = await axiosInstance.get(
          `/voucher-sublegder-list?GLCode=${formData.GLCode}&VoucherDate=${formData.date}&autoCenter=${autoCenter}`
        );
        if (res.status === 200) {
          setVoucherlist(res.data?.voucherList || []);
        }
        setLoading(false);
      } catch (error) {
        // console.error("Error fetching data:", error);
        toast.error("Server failed fetching data");
        setLoading(false);
      }
    } else {
      toast.error("Please fill all the fields");
    }
  };
  //  handle download excel
  const handleExcel = (e) => {
    e.preventDefault();
    if (filterVoucherList.length === 0) {
      toast.warn("No data available to download.");
      return;
    }
    const data = filterVoucherList.map((item, i) => ({
      SrNo: i + 1,
      Code: item.AccCode,
      AccountName:
        customerList.find((i) => i.srno === item.AccCode)?.engName || "-",
      Amount: item.totalamt,
      Type: item.totalamt < 0 ? "नावे" : "जमा",
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, `${dairyInfo} Ledger List.xlsx`);
  };
  //  handle download pdf
  const handlePdf = (e) => {
    e.preventDefault();
    if (filterVoucherList.length === 0) {
      toast.warn("No data available to download.");
      return;
    }

    // Placeholder for PDF generation logic
    toast.info("PDF generation is a work in progress.");

    const doc = new jsPDF();

    // Define columns and rows
    const columns = ["SrNo", "Code", "AccName", "Amount", "Credit / Debit"];
    const rows = filterVoucherList.map((item, index) => [
      index + 1,
      item.AccCode,
      customerList.find((i) => i.srno === item.AccCode)?.cname || "-",
      item.totalamt,
      item.totalamt < 0 ? "Debit" : "Credit",
    ]);

    // Page width for centering text
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Define the margin and the height of the box
    const margin = 10;
    const boxHeight = pageHeight - 20; // Adjust as needed

    // Add border for the entire content
    doc.rect(margin, margin, pageWidth - 2 * margin, boxHeight);

    // Add dairy name with border inside the box
    const dairyName =
      centerId > 0
        ? dairyInfo
        : filter > 0
        ? centerList.find((i) => Number(i.center_id) === Number(filter))
            ?.center_name
        : dairyInfo;
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    const dairyTextWidth = doc.getTextWidth(dairyName);
    doc.text(dairyName, (pageWidth - dairyTextWidth) / 2, margin + 15);

    // Add "Sale-Info" heading with border
    doc.setFontSize(14);
    const invoiceInfo = doc.getTextWidth("Credit Debit List");
    doc.text("Credit Debit List", (pageWidth - invoiceInfo) / 2, margin + 25);

    // Add table for items with borders and centered text
    doc.autoTable({
      head: [columns],
      body: rows,
      startY: margin + 35,
      margin: { top: 10 },
      styles: {
        cellPadding: 2,
        fontSize: 11,
        halign: "center", // Horizontal alignment for cells (centered)
        valign: "middle", // Vertical alignment for cells (centered)
        lineWidth: 0.08, // Line width for the borders
        lineColor: [0, 0, 0], // Black border color
      },
      headStyles: {
        fontSize: 12,
        fontStyle: "bold",
        fillColor: [225, 225, 225], // Light gray background for the header
        textColor: [0, 0, 0], // Black text color for header
      },
      tableLineColor: [0, 0, 0], // Table border color (black)
      tableLineWidth: 0.1, // Border width
    });

    // Save the PDF
    doc.save(`Credits/Debits List.pdf`);
  };

  // Call the function to generate the print
  const handlePrint = (e) => {
    e.preventDefault();
    if (filterVoucherList.length === 0) {
      toast.warn("No data available to print.");
      return;
    }

    // Create a new window for printing
    const printWindow = window.open("", "_blank");

    // Define the HTML content for the print window
    const printContent = `
    <html>
      <head>
        <title>Print Ledger List</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 20px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
          }
          th, td {
            border: 1px solid #000;
            padding: 8px;
            text-align: center;
          }
          th {
            background-color: #f2f2f2;
          }
          h2, h3 {
            text-align: center;
          }
        </style>
      </head>
      <body>
        <h2>${
          centerId > 0
            ? dairyInfo
            : filter > 0
            ? centerList.find((i) => Number(i.center_id) === Number(filter))
                ?.center_name
            : dairyInfo
        }</h2>
        <h3>Credit Debit List</h3>
        <table>
          <thead>
            <tr>
              <th>SrNo</th>
              <th>Code</th>
              <th>AccName</th>
              <th>Amount</th>
              <th>Credit / Debit</th>
            </tr>
          </thead>
          <tbody>
            ${filterVoucherList
              .map(
                (item, index) => `
                  <tr>
                    <td>${index + 1}</td>
                    <td>${item.AccCode}</td>
                    <td>${
                      customerList.find((i) => i.srno === item.AccCode)
                        ?.cname || "-"
                    }</td>
                    <td>${item.totalamt}</td>
                    <td>${item.totalamt < 0 ? "Debit" : "Credit"}</td>
                  </tr>
                `
              )
              .join("")}
          </tbody>
        </table>
         <script>
          window.print();
          window.onafterprint = () => {
            window.close();
            window.opener.focus(); // Focus back to the main window
          };
        </script>
      </body>
    </html>
  `;

    printWindow.document.open();
    printWindow.document.write(printContent);
    printWindow.document.close();
  };
  return (
    <div className="w100 h1 d-flex-col m10 ">
      <div className="w100 p10 bg">
        {centerId > 0 ? (
          <></>
        ) : (
          <div className="d-flex a-center mx10">
            <span className="info-text">सेंटर निवडा :</span>
            <select
              className="data w50 a-center  my5 mx5"
              name="center"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              {centerList &&
                [...centerList]
                  .sort((a, b) => a.center_id - b.center_id)
                  .map((center, index) => (
                    <option key={index} value={center.center_id}>
                      {center.marathi_name || center.center_name}
                    </option>
                  ))}
            </select>
          </div>
        )}
        <div className="w100 d-flex center sa f-wrap">
          <input
            type="date"
            className="data w20"
            value={formData.date}
            onChange={(e) =>
              setFormData({
                ...formData,
                date: e.target.value,
              })
            }
          />
          <span className="info-text">खतावणी नं.</span>
          <input
            type="text"
            id="GLCode"
            className="data w10"
            autoComplete="off"
            onFocus={(e) => e.target.select()}
            value={formData.GLCode}
            onChange={(e) =>
              setFormData({ ...formData, GLCode: e.target.value })
            }
          />
          <Select
            options={options}
            className=" mx10 w40"
            placeholder=""
            isSearchable
            styles={{
              menu: (provided) => ({
                ...provided,
                zIndex: 200,
              }),
            }}
            value={
              formData.GLCode
                ? options.find(
                    (option) => option.value === Number(formData.GLCode)
                  )
                : null
            }
            onChange={(selectedOption) => {
              handleSelectChange(selectedOption, "GLCode");
            }}
          />
          <button type="button" className="w-btn" onClick={handleFetchData}>
            यादी
          </button>
        </div>
        <div className="w100 d-flex center sa my10">
          <button type="button" className="w-btn" onClick={handleExcel}>
            एक्सेल
          </button>
          <button type="button" className="w-btn" onClick={handlePdf}>
            PDF
          </button>
          <button type="button" className="w-btn" onClick={handlePrint}>
            प्रिंट
          </button>
        </div>
      </div>
      <div
        className="account-legder-table w100 my10 bg p10 h1"
        style={{ overflow: "hidden" }}
      >
        <table className="account-legder-table w100">
          <thead>
            <tr>
              <th
                style={{
                  textAlign: "center",
                }}
                className="w10"
              >
                खाते नं.
              </th>
              <th className="w50">खातेदार</th>
              <th
                className="w20"
                style={{
                  textAlign: "center",
                }}
              >
                रक्कम
              </th>
              <th
                className="w20"
                style={{
                  textAlign: "center",
                }}
              >
                जमा / नावे
              </th>
            </tr>
          </thead>
        </table>
        <div style={{ maxHeight: "456px", overflowY: "auto" }}>
          <table className="account-legder-table w100">
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="4" style={{ textAlign: "center" }}>
                    Loading...
                  </td>
                </tr>
              ) : filterVoucherList.length > 0 ? (
                filterVoucherList.map((item, i) => (
                  <tr key={i}>
                    <td
                      style={{
                        textAlign: "center",
                      }}
                      className="w10"
                    >
                      {item.AccCode}
                    </td>
                    <td className="w50">
                      {customerList.find((i) => i.srno === item.AccCode)
                        ?.engName || "-"}
                    </td>

                    <td
                      className="w20"
                      style={{
                        textAlign: "center",
                      }}
                    >
                      {Math.abs(item.totalamt)}
                    </td>
                    <td
                      className="w20"
                      style={{
                        textAlign: "center",
                      }}
                    >
                      {item.totalamt < 0 ? "नावे" : "जमा"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" style={{ textAlign: "center" }}>
                    No data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LedgerList;
