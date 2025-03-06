// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import axiosInstance from "../../../../../../../App/axiosInstance";
import { MdAddShoppingCart, MdDeleteOutline } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import * as XLSX from "xlsx";
import Spinner from "../../../../../../Home/Spinner/Spinner";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FaDownload } from "react-icons/fa6";
import { useSelector } from "react-redux";

const GroList = () => {
  const { t } = useTranslation(["puchasesale", "common"]);
  const [date1, SetDate1] = useState("");
  const [date2, SetDate2] = useState("");
  const [fcode, setFcode] = useState("");
  const [purchaseList, setPurchaseList] = useState([]);

  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
  const [filteredPurchaseList, setfilteredPurchaseList] =
    useState(purchaseList);
  const [viewItems, setViewItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const dairyInfo = useSelector(
    (state) =>
      state.dairy.dairyData.marathi_name ||
      state.dairy.dairyData.SocietyName ||
      state.dairy.dairyData.center_name
  );

  const role = useSelector((state) => state.users.user?.role);
  const [userRole, setUserRole] = useState(role);

  useEffect(() => {
    setUserRole(role);
  }, [role]);

  //download Excel sheet
  const downloadExcel = () => {
    const exportData = filteredPurchaseList.map((sale) => ({
      BillDate: formatDateToDDMMYYYY(sale.purchasedate),
      BillNo: sale.receiptno,
      DealerCode: sale.dealerCode,
      DealerName: sale.dealerName,
      ItemCode: sale.itemcode,
      ItemName: sale.itemname,
      Qty: sale.qty,
      Rate: sale.rate,
      Amt: sale.Amount,
      cgst: sale.cgst || 0,
      sgst: sale.sgst || 0,
      cn: sale.cn || 0,
    }));

    if (!Array.isArray(exportData) || exportData.length === 0) {
      alert("No data available to export.");
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(exportData); // Convert sales data to Excel sheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1"); // Add sheet to workbook
    XLSX.writeFile(workbook, `${date1}_to_${date2}.xlsx`); // Trigger download as .xlsx file
  };

  // Fetch purchase list from API
  useEffect(() => {
    const fetchPurchaseList = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get(
          `/purchase/all?cn=1&ItemGroupCode=3&role=${userRole}`
        );
        let purchase = response?.data?.purchaseData || [];
        purchase.sort(
          (a, b) => new Date(b.purchasedate) - new Date(a.purchasedate)
        );
        setPurchaseList(purchase);
        setLoading(false);
      } catch (error) {
        toast.error("Error fetching purchase list.");
        setLoading(false);
      }
    };
    fetchPurchaseList();
  }, []);

  //set to date of range to  get default data
  useEffect(() => {
    SetDate1(getPreviousDate(0));
    SetDate2(getTodaysDate());
  }, []);
  //get today day
  const getTodaysDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };
  //get previous date with give to number
  const getPreviousDate = (daysAgo) => {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    return date.toISOString().split("T")[0];
  };

  // Function to fetch purchase data based on date and dealer code filt
  const handleShowbutton = async () => {
    setLoading(true);
    const getItem = {
      date1,
      date2,
    };
    // console.log(getItem);
    try {
      const queryParams = new URLSearchParams(getItem).toString();
      const { data } = await axiosInstance.get(
        `/purchase/all?cn=1&ItemGroupCode=3&role=${userRole}&${queryParams}`
      );
      // console.log(data);
      if (data?.success) {
        setPurchaseList(data.purchaseData || []);
        setFcode("");
      } else {
        setPurchaseList([]);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error("Error fetching Purchase list");
      setPurchaseList([]);
    }
  };

  // Function to delete a purchase item
  const handleDelete = async (id) => {
    // Show the confirmation dialog
    const result = await Swal.fire({
      title: "Confirm Deletion?",
      text: "Are you sure you want to delete this Bill?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        // Delete the item using axios
        const res = await axiosInstance.delete(`/purchase/delete/${id}`);
        toast.success(res?.data?.message);

        // Remove the deleted item from the list
        setPurchaseList((prevItems) =>
          prevItems.filter((item) => item.billno !== id)
        );

        // Show success message
        Swal.fire({
          title: "Deleted!",
          text: "Item deleted successfully.",
          icon: "success",
        });
      } catch (error) {
        // Handle error in deletion
        toast.error("Error deleting purchase item.");
      }
    }
  };

  //get date like DD/MM/YYYY formate
  const formatDateToDDMMYYYY = (dateStr) => {
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Group purchase by bill number
  const groupedPurchase = (filteredPurchaseList || []).reduce((acc, item) => {
    const key = item.billno;
    if (!acc[key]) {
      acc[key] = { ...item, TotalAmount: 0, TotalQty: 0 };
    }
    acc[key].TotalAmount += item.amount;
    acc[key].TotalQty += item.qty;
    return acc;
  }, {});

  const groupedPurchaseArray = Object.values(groupedPurchase);

  //for searching Name /code to get the purchase list ------------------------------------------->
  useEffect(() => {
    if (fcode) {
      const filteredItems = purchaseList.filter(
        (item) =>
          item.dealerCode.toString().includes(fcode) ||
          item.dealerName.toLowerCase().includes(fcode.toLowerCase()) ||
          item.receiptno.toString().includes(fcode.toLowerCase())
      );
      setfilteredPurchaseList(filteredItems);
    } else {
      setfilteredPurchaseList(purchaseList);
    }
  }, [fcode, purchaseList]);

  const handleView = (billno) => {
    const filterList = purchaseList.filter((item) => item.billno === billno);
    setViewItems(filterList);
    // console.log(filterList);
    setIsInvoiceOpen(true);
  };

  //download PDF
  const downloadPdf = () => {
    if (groupedPurchaseArray.length === 0) {
      toast.warn("No data available to export.");
      return;
    }

    const doc = new jsPDF();

    // Define columns and rows
    const columns = [
      "Sr.No",
      "Date",
      "Bill No",
      "Dealer Code",
      "Dealer Name",
      "Qty",
      "Amount",
    ];
    const rows = groupedPurchaseArray.map((item, index) => [
      index + 1,
      formatDateToDDMMYYYY(item.purchasedate),
      item.receiptno,
      item.dealerCode,
      item.dealerName,
      item.TotalQty,
      item.TotalAmount,
    ]);
    const totalAmount = groupedPurchaseArray.reduce(
      (acc, item) => acc + item.TotalAmount,
      0
    );
    const totalQty = groupedPurchaseArray.reduce(
      (acc, item) => acc + item.TotalQty,
      0
    );
    // Page width for centering text
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Define the margin and the height of the box
    const margin = 10;
    const boxHeight = pageHeight - 20; // Adjust as needed

    // Add border for the entire content
    doc.rect(margin, margin, pageWidth - 2 * margin, boxHeight);

    // Add dairy name with border inside the box
    const dairyName = dairyInfo;
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    const dairyTextWidth = doc.getTextWidth(dairyName);
    doc.text(dairyName, (pageWidth - dairyTextWidth) / 2, margin + 15);

    // Add "Sale-Info" heading with border
    doc.setFontSize(14);
    const invoiceInfo = doc.getTextWidth("Return-Info");
    doc.text("Return-Info", (pageWidth - invoiceInfo) / 2, margin + 25);
    const gepInfo = doc.getTextWidth("Grocery Dealer Return Report");
    doc.text(
      "Grocery Dealer Return Report",
      (pageWidth - gepInfo) / 2,
      margin + 35
    );
    // Add table for items with borders and centered text
    doc.autoTable({
      head: [columns],
      body: rows,
      startY: margin + 45,
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

    // Add total amount with border
    doc.text(
      `Total Qty: ${totalQty}     Total Amount: ${totalAmount}`,
      75,
      doc.lastAutoTable.finalY + 10
    );

    // Save the PDF
    doc.save(
      `Grocery_Dealer_Return_Report_${formatDateToDDMMYYYY(
        date1
      )}_to_${formatDateToDDMMYYYY(date2)}.pdf`
    );
  };

  return (
    <div className="customer-list-container-div w100 h1 d-flex-col p10">
      <div
        className="download-print-pdf-excel-container w100 h10 d-flex j-end"
        style={{ display: "contents" }}
      >
        <div className="sales-dates-container w100  d-flex a-center sb sales-dates-container-mobile">
          <div className="d-flex sb w60 sales-dates-container-mobile-w100">
            <div className="date-input-div w35 d-flex a-center sb">
              <label htmlFor="" className="label-text w30">
                {t("ps-from")} :
              </label>
              <input
                type="date"
                className="data w70"
                value={date1}
                onChange={(e) => SetDate1(e.target.value)}
                max={date2}
              />
            </div>
            <div className="date-input-div w35 d-flex a-center sb">
              <label htmlFor="" className="label-text w30">
                {t("ps-to")} :
              </label>
              <input
                type="date"
                className="data w70"
                value={date2}
                onChange={(e) => SetDate2(e.target.value)}
                min={date1}
              />
            </div>
            <button className="w-btn" onClick={handleShowbutton}>
              {t("ps-show")}
            </button>
          </div>
          <div className="d-flex h1 sb center w30 sales-dates-container-mobile-w100 bg p10 ">
            <label htmlFor="" className="label-text   ">
              {t("ps-addDealReturnGrocery")}
            </label>
            <NavLink
              className="w-btn d-flex "
              style={{ textDecoration: "none" }}
              to="add-deal-return"
            >
              <MdAddShoppingCart className="icon f-label" />
              {t("ps-new")}
            </NavLink>
          </div>
        </div>
        <div className="find-customer-container w100   d-flex a-center my5 py5">
          <div className="customer-search-div  d-flex a-center sb">
            <input
              type="text"
              className="data w100"
              name="code"
              onFocus={(e) => e.target.select()}
              value={fcode}
              onChange={(e) =>
                setFcode(e.target.value.replace(/[^a-zA-Z0-9 ]/g, ""))
              }
              min="0"
              title="Enter code or name to search details"
              placeholder={`${t("ps-search")}`}
            />
          </div>
          <button
            className="w-btn mx10 sales-dates-container-mobile-btn"
            onClick={downloadExcel}
          >
            <span className="f-label-text px10"> {t("ps-down-excel")}</span>
            <FaDownload />
          </button>
          <button
            className="w-btn mx10 sales-dates-container-mobile-btn"
            onClick={downloadPdf}
          >
            <span className="f-label-text px10">PDF</span>
            <FaDownload />
          </button>
        </div>
      </div>
      <div className="customer-list-table w100 h1 d-flex-col hidescrollbar bg">
        <span className="heading p10">{t("ps-dealRetrnRep")}</span>
        <div className="customer-heading-title-scroller w100 h1 mh100 d-flex-col">
          <div className="data-headings-div sale-data-headings-div h10 d-flex center t-center sb bg7">
            <span className="f-info-text w5">{t("ps-srNo")}</span>
            <span className="f-info-text w5">{t("ps-date")}</span>
            <span className="f-info-text w5">{t("ps-rect-no")}</span>
            <span className="f-info-text w10">{t("ps-code")}</span>
            <span className="f-info-text w25">{t("ps-dealer-name")}</span>
            <span className="f-info-text w5">{t("ps-ttl-amt")}</span>
            {userRole === "salesman" ? (
              <></>
            ) : (
              <>
                <span className="f-info-text w10">{t("CreatedBy")}</span>
              </>
            )}
            <span className="f-info-text w5">Actions</span>
          </div>
          {/* Show Spinner if loading, otherwise show the feed list */}
          {loading ? (
            <Spinner />
          ) : groupedPurchaseArray.length > 0 ? (
            groupedPurchaseArray.map((item, index) => (
              <div
                key={index}
                className={`data-values-div sale-data-values-div w100 h10 d-flex center t-center sa ${
                  index % 2 === 0 ? "bg-light" : "bg-dark"
                }`}
                style={{
                  backgroundColor: index % 2 === 0 ? "#faefe3" : "#fff",
                }}
              >
                <span className="text w5">{index + 1}</span>
                <span className="text w5">
                  {formatDateToDDMMYYYY(item.purchasedate)}
                </span>
                <span className="text w5 ">{item.receiptno}</span>
                <span className="text w10">{item.dealerCode}</span>
                <span className="text w25">{item.dealerName}</span>

                <span className="text w5">{item.TotalAmount}</span>
                {userRole === "salesman" ? (
                  <></>
                ) : (
                  <>
                    <span className="text w10">
                      {item.createdby || "Unknown"}
                    </span>
                  </>
                )}
                <span className="text w5 d-flex j-center a-center">
                  <button
                    className="px5"
                    onClick={() => handleView(item?.billno)}
                    title="View the Bill"
                  >
                    {t("ps-view")}
                  </button>
                  <MdDeleteOutline
                    onClick={() => handleDelete(item?.billno)}
                    size={15}
                    className="table-icon "
                    title="Delete the Bill"
                    style={{ color: "red" }}
                  />
                </span>

                {/* Assuming all customers are active */}
              </div>
            ))
          ) : (
            <div className="d-flex h1 center">{t("common:c-no-data-avai")}</div>
          )}
        </div>
      </div>
      {/* show invoice */}
      {isInvoiceOpen && viewItems.length > 0 && (
        <div className="pramod modal">
          <div className="modal-content">
            <div className="d-flex sb deal-info">
              <h2> {t("ps-InvoiceDetails")}</h2>
              <IoClose
                style={{ cursor: "pointer" }}
                className="icon"
                onClick={() => setIsInvoiceOpen(false)}
              />
            </div>
            <hr />
            <div className=" d-flex sb mx15 px15 deal-info-name">
              <h4>
                {" "}
                {t("ps-rect-no")} : {viewItems[0]?.receiptno || ""}
              </h4>
              <div className="10">
                {t("ps-date")} :
                {formatDateToDDMMYYYY(viewItems[0]?.purchasedate)}
              </div>
            </div>
            <div className=" d-flex sb mx15 px15 deal-info-name">
              <h4>
                {" "}
                {t("ps-code")} : {viewItems[0]?.dealerCode || ""}
              </h4>
              <h4 className="mx15">{viewItems[0]?.dealerName || ""}</h4>
            </div>
            <div className="modal-content w100  ">
              <div className="sales-table-container w100">
                <table className="sales-table w100 ">
                  <thead className="bg1">
                    <tr>
                      <th className="f-info-text"> {t("ps-srNo")}</th>
                      <th className="f-info-text"> {t("ps-itm-name")}</th>
                      <th className="f-info-text"> {t("ps-rate")}</th>
                      <th className="f-info-text"> {t("ps-qty")}</th>
                      <th className="f-info-text"> {t("ps-amt")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {viewItems.map((item, i) => (
                      <tr key={i}>
                        <td>{i + 1}</td>
                        <td>{item.itemname}</td>
                        <td className="w15"> {item.rate}</td>

                        <td className="w15">{item.qty}</td>
                        <td>{item.amount}</td>
                      </tr>
                    ))}
                    <tr>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td>
                        <b> {t("ps-ttl-amt")}</b>
                      </td>
                      <td>
                        {(viewItems || []).reduce(
                          (acc, item) => acc + (item.amount || 0),
                          0
                        )}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            {/* <div className="d-flex my15 j-end">
                      <button className="btn">Update</button>
                    </div> */}
          </div>
        </div>
      )}
    </div>
  );
};

export default GroList;
