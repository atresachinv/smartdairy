import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import Spinner from "../../../Home/Spinner/Spinner";
import { useSelector } from "react-redux";
import axiosInstance from "../../../../App/axiosInstance";
import { MdAddShoppingCart, MdDeleteOutline } from "react-icons/md";
import Swal from "sweetalert2";
import { IoClose } from "react-icons/io5";
import { FaRegEdit } from "react-icons/fa";
import { toast } from "react-toastify";
import { TbSortAscending2, TbSortDescending2 } from "react-icons/tb";
import "../../../../Styles/Mainapp/Sales/Sales.css";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FaDownload } from "react-icons/fa6";
import jsPDF from "jspdf";

const GrocerySaleList = () => {
  const { t } = useTranslation(["puchasesale", "common"]);
  const [date1, SetDate1] = useState("");
  const [date2, SetDate2] = useState("");
  const [fcode, setFcode] = useState("");
  const [sales, setSales] = useState([]);
  const [editSale, setEditSale] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
  const [filteredSalesList, setFilteredSalesList] = useState(sales);
  const [viewItems, setViewItems] = useState([]);
  const [loadings, SetLoadings] = useState(false);
  const [sortOrder, setSortOrder] = useState("desc");
  const [sortKey, setSortKey] = useState("BillDate");

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

  //download Excel sheet ------------------------------------------------->
  const downloadExcel = () => {
    const exportData = filteredSalesList.map((sale) => ({
      BillDate: formatDateToDDMMYYYY(sale.BillDate),
      BillNo: sale.ReceiptNo,
      custCode: sale.CustCode,
      custName: sale.cust_name,
      ItemCode: sale.ItemCode,
      ItemName: sale.ItemName,
      Qty: sale.Qty,
      Rate: sale.Rate,
      Amt: sale.Amount,
      cgst: sale.cgst || 0,
      sgst: sale.sgst || 0,
      cn: sale.cn || 0,
    }));

    if (!Array.isArray(exportData) || exportData.length === 0) {
      toast.error("No data available to export.");
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(exportData); // Convert sales data to Excel sheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1"); // Add sheet to workbook
    XLSX.writeFile(workbook, `${date1}_to_${date2}.xlsx`); // Trigger download as .xlsx file
  };

  // Fetch sales data from backend (API endpoint) ------------------------->
  useEffect(() => {
    const fetchSales = async () => {
      SetLoadings(true);
      try {
        const { data } = await axiosInstance.get(
          `/sale/all?ItemGroupCode=3&cn=0&role=${userRole}`
        ); // Replace with your actual API URL
        if (data.success) {
          // console.log(data);
          setSales(data.salesData); // Assuming 'sales' is the array returned by your backend
        }
        SetLoadings(false);
      } catch (error) {
        SetLoadings(false);
        console.error("Error fetching sales:", error);
      }
    };

    fetchSales();
  }, []);

  //set to date of range to  get default data ----------------------------->
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

  // get sale to backend on date range
  const handleShowbutton = async () => {
    SetLoadings(true);
    const getItem = {
      date1,
      date2,
    };
    // console.log(getItem);
    try {
      const queryParams = new URLSearchParams(getItem).toString();
      const { data } = await axiosInstance.get(
        `/sale/all?ItemGroupCode=3&cn=0&role=${userRole}&${queryParams}`
      );
      if (data?.success) {
        setSales(data.salesData);
      }
      SetLoadings(false);
    } catch (error) {
      console.error("Error fetching items:", error);
      SetLoadings(false);
    }
  };

  //its used to edit and update
  const handleEditClick = (item) => {
    setEditSale(item);
    setIsModalOpen(true);
  };

  //its to delete  invoice based on billno
  const handleDelete = async (BillNo) => {
    const result = await Swal.fire({
      title: "Confirm Deletion?",
      text: "Are you sure you want to delete this?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        const res = await axiosInstance.post("/sale/delete", {
          billNo: BillNo,
        });
        toast.success(res?.data?.message);
        setSales((prevSales) =>
          prevSales.filter((sale) => sale.BillNo !== BillNo)
        );
      } catch (error) {
        // console.error("Error deleting sale item:", error);
        toast.error("Failed to server delete the Invoice");
      }
    }
  };

  //its to delete  invoice based on billno
  const handleDeleteItem = async (saleid) => {
    const result = await Swal.fire({
      title: "Confirm Deletion?",
      text: "Are you sure you want to delete this?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        const res = await axiosInstance.post("/sale/delete", {
          saleid: saleid,
        });
        toast.success(res?.data?.message);
        setSales((prevSales) =>
          prevSales.filter((sale) => sale.saleid !== saleid)
        );
        setViewItems((prevSales) =>
          prevSales.filter((sale) => sale.saleid !== saleid)
        );
      } catch (error) {
        // console.error("Error deleting sale item:", error);
        toast.error("Failed to server delete the Invoice");
      }
    }
  };

  // calculate total amount
  const handleAmountCalculation = () => {
    const qty = parseFloat(editSale?.Qty || 0);
    const rate = parseFloat(editSale?.Rate || 0);
    return qty * rate;
  };

  //get date like DD/MM/YYYY formate
  const formatDateToDDMMYYYY = (dateStr) => {
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // update invoice and its item
  const handleSaveChanges = async () => {
    const updatedAmount = parseFloat(editSale.Qty) * parseFloat(editSale.Rate);

    const updateItem = {
      saleid: editSale.saleid,
      ReceiptNo: editSale.ReceiptNo,
      Rate: editSale.Rate,
      Qty: editSale.Qty,
      Amount: updatedAmount,
    };
    // console.log(updateItem);
    // console.log("Updatiing sales");
    try {
      const res = await axiosInstance.put("/sale/update", updateItem);
      if (res?.data?.success) {
        toast.success("Sale updated successfully");

        setSales((prevSales) => {
          return prevSales.map((sale) => {
            if (sale.saleid === editSale.saleid) {
              return { ...sale, ...editSale, Amount: updatedAmount };
            }
            return sale;
          });
        });
        setViewItems((prevSales) => {
          return prevSales.map((sale) => {
            if (sale.saleid === editSale.saleid) {
              return { ...sale, ...editSale, Amount: updatedAmount };
            }
            return sale;
          });
        });
        setIsModalOpen(false);
      }
    } catch (error) {
      toast.error("Server Error to update sale");
      // console.error("Error updating sale:", error);
    }
  };

  // ----------------------------------------------------------------------------->
  // Function to group sales by BillNo ------------------------------------------->
  const groupSales = () => {
    const groupedSales = filteredSalesList.reduce((acc, sale) => {
      const key = sale.BillNo;
      if (!acc[key]) {
        acc[key] = { ...sale, TotalAmount: 0 };
      }
      acc[key].TotalAmount += sale.Amount;
      return acc;
    }, {});

    return Object.values(groupedSales).sort((a, b) => {
      if (sortKey === "BillDate") {
        return sortOrder === "asc"
          ? new Date(a.BillDate) - new Date(b.BillDate)
          : new Date(b.BillDate) - new Date(a.BillDate);
      } else {
        return sortOrder === "asc"
          ? a[sortKey] > b[sortKey]
            ? 1
            : -1
          : a[sortKey] < b[sortKey]
          ? 1
          : -1;
      }
    });
  };

  // ---------------------------------------------------------------------------->
  // Toggle sorting order ------------------------------------------------------->
  const handleSort = (key) => {
    setSortKey(key);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const groupedSalesArray = groupSales();

  //for searching Name or code to get the sale list------------------------------------>

  useEffect(() => {
    if (fcode) {
      const filteredItems = sales.filter((item) => {
        const isCodeMatch = item.CustCode.toString().includes(fcode);
        const isRecptMatch = item.ReceiptNo.toString().includes(fcode);

        const isNameMatch = item.cust_name
          ?.toLowerCase()
          .includes(fcode.toLowerCase());

        return isCodeMatch || isRecptMatch || isNameMatch;
      });

      setFilteredSalesList(filteredItems);
    } else {
      setFilteredSalesList(sales);
    }
  }, [fcode, sales]);

  const handleView = (billno) => {
    const filterList = sales.filter((item) => item.BillNo === billno);
    setViewItems(filterList);
    // console.log(filterList);
    setIsInvoiceOpen(true);
  };

  //download PDF
  const downloadPdf = () => {
    if (groupedSalesArray.length === 0) {
      toast.warn("No data available to export.");
      return;
    }

    const doc = new jsPDF();

    // Define columns and rows
    const columns = [
      "Sr No",
      "Date",
      "Bill No",
      "Code",
      "Customer Name",
      "Amount",
    ];
    const rows = groupedSalesArray.map((item, index) => [
      index + 1,
      formatDateToDDMMYYYY(item.BillDate),
      item.ReceiptNo,
      item.CustCode,
      item.cust_name,
      item.TotalAmount,
    ]);

    const totalAmount = groupedSalesArray.reduce(
      (acc, item) => acc + item.TotalAmount,
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
    const invoiceInfo = doc.getTextWidth("Sale-Info");
    doc.text("Sale-Info", (pageWidth - invoiceInfo) / 2, margin + 25);
    const gepInfo = doc.getTextWidth("Grocery Report");
    doc.text("Grocery Report", (pageWidth - gepInfo) / 2, margin + 35);

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
    doc.setFontSize(12);
    const totalAmountLabel = `Total Amount: ${totalAmount}`;
    doc.text(totalAmountLabel, 145, doc.lastAutoTable.finalY + 10);

    // Save the PDF
    doc.save(
      `Grocery_SaleReport_${formatDateToDDMMYYYY(
        date1
      )}_to_${formatDateToDDMMYYYY(date2)}.pdf`
    );
  };

  return (
    <div className="sold-products-list-container w100 h1 d-flex-col sb p10">
      <span className="heading">किराणा विक्री :</span>
      <div className="download-print-pdf-excel-container w100 h25 d-flex-col sb">
        <div className="sales-dates-add-new-sales-container w100 h50 d-flex a-center sb">
          <div className="sales-dates-container w65 d-flex a-center sb">
            <div className="date-input-div w40 d-flex a-center sb">
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
            <div className="date-input-div w40 d-flex a-center sb">
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
          <div className="add-new-sales-div w30 d-flex h1 sb center bg p10">
            <label htmlFor="btnss" className="label-text">
              {t("ps-nv-add-grocery")}
            </label>
            <NavLink
              id="btnss"
              className="w-btn"
              style={{ textDecoration: "none" }}
              to="add-new"
            >
              <MdAddShoppingCart className="icon f-label mx10" />
              {t("ps-new")}
            </NavLink>
          </div>
        </div>
        <div className="find-returns-by-customer-container w100 h50 d-flex a-center">
          <input
            type="text"
            className="data w40"
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
          <button className="w15 btn mx10" onClick={downloadExcel}>
            <span className="f-label-text px10"> {t("ps-down-excel")}</span>
            <FaDownload className="icon" />
          </button>
          <button className="w15 btn" onClick={downloadPdf}>
            <span className="f-label-text px10"> PDF </span>
            <FaDownload className="icon" />
          </button>
        </div>
      </div>
      <div className="sales-prod-list-container w100 h65 d-flex-col bg">
        <span className="heading p10">{t("ps-gro-rep")} :</span>
        <div className="sales-prod-detilas-table-div w100 h1 mh100 d-flex-col hidescrollbar">
          <div className="data-headings-div w100 py10 d-flex a-center t-center sb sticky-top bg7">
            <span className="f-info-text w15">
              {t("ps-date")}
              <span
                className="px5 f-color-icon"
                type="button"
                onClick={() => handleSort("BillDate")}
              >
                {sortKey === "BillDate" ? (
                  sortOrder === "asc" ? (
                    <TbSortAscending2 />
                  ) : (
                    <TbSortDescending2 />
                  )
                ) : (
                  <TbSortAscending2 />
                )}
              </span>
            </span>
            <span className="f-info-text w10">{t("ps-rect-no")}</span>
            <span className="f-info-text w10">
              {t("ps-custCode")}
              <span
                className="px5 f-color-icon"
                type="button"
                onClick={() => handleSort("CustCode")}
              >
                {sortKey === "CustCode" ? (
                  sortOrder === "asc" ? (
                    <TbSortAscending2 />
                  ) : (
                    <TbSortDescending2 />
                  )
                ) : (
                  <TbSortAscending2 />
                )}
              </span>
            </span>
            <span className="f-info-text w30"> {t("ps-cutName")}</span>
            <span className="f-info-text w10">
              {t("ps-amt")}
              <span
                className="px5 f-color-icon"
                type="button"
                onClick={() => handleSort("TotalAmount")}
              >
                {sortKey === "TotalAmount" ? (
                  sortOrder === "asc" ? (
                    <TbSortAscending2 />
                  ) : (
                    <TbSortDescending2 />
                  )
                ) : (
                  <TbSortAscending2 />
                )}
              </span>
            </span>
            <span className="f-info-text w10">Actions</span>
            {userRole === "salesman" ? (
              <></>
            ) : (
              <>
                <span className="f-info-text w15 d-flex a-center">
                  {t("CreatedBy")}
                  <span
                    className="px5 f-color-icon"
                    type="button"
                    onClick={() => handleSort("createdby")}
                  >
                    {sortKey === "createdby" ? (
                      sortOrder === "asc" ? (
                        <TbSortAscending2 />
                      ) : (
                        <TbSortDescending2 />
                      )
                    ) : (
                      <TbSortAscending2 />
                    )}
                  </span>
                </span>
              </>
            )}
          </div>
          {loadings ? (
            <Spinner />
          ) : groupedSalesArray.length > 0 ? (
            groupedSalesArray.map((sale, index) => (
              <div
                key={index}
                className={`data-values-div sale-data-values-div w100 h10 d-flex center t-center sa`}
                style={{
                  backgroundColor: index % 2 === 0 ? "#faefe3" : "#fff",
                }}
              >
                <span className="text w20">
                  {formatDateToDDMMYYYY(sale.BillDate)}
                </span>
                <span className="text w5">{sale.ReceiptNo}</span>
                <span className="text w5">{sale.CustCode}</span>
                <span className="text w35 ">{sale.cust_name}</span>

                <span className="text w10">{sale.TotalAmount}</span>

                <span className="text w10 d-flex j-center a-center ">
                  <button
                    className="px5"
                    onClick={() => handleView(sale?.BillNo)}
                  >
                    {t("ps-view")}
                  </button>
                  <MdDeleteOutline
                    onClick={() => handleDelete(sale?.BillNo)}
                    size={15}
                    className="table-icon"
                    style={{ color: "red" }}
                  />
                </span>
                {userRole === "salesman" ? (
                  <></>
                ) : (
                  <>
                    <span className="text w20 ">{sale.createdby}</span>
                  </>
                )}
              </div>
            ))
          ) : (
            <div className="box d-flex center"> {t("ps-sale-item")}</div>
          )}
        </div>
        {/* show invoice */}
        {isInvoiceOpen && viewItems.length > 0 && (
          <div className="saleModal">
            <div className="modal-content ">
              <div className="d-flex sb">
                <h2>{t("ps-sale-bill-det")} :</h2>
                <IoClose
                  style={{ cursor: "pointer" }}
                  size={25}
                  onClick={() => setIsInvoiceOpen(false)}
                />
              </div>
              <hr />
              <div className=" d-flex sb mx15 px15 ">
                <h4>
                  {t("ps-rect-no")} : {viewItems[0]?.ReceiptNo || ""}
                </h4>
                <div className="10">
                  {t("ps-date")} :{formatDateToDDMMYYYY(viewItems[0]?.BillDate)}
                </div>
              </div>
              <div className=" d-flex sb mx15 px15 ">
                <h4>
                  {t("ps-custCode")} : {viewItems[0]?.CustCode || ""}
                </h4>
                <h4 className="mx15">{viewItems[0]?.cust_name || ""}</h4>
              </div>
              <div className=" w100">
                <div className="sales-table-container w100">
                  <table className="sales-table1">
                    <thead className="bg1 w100">
                      <tr>
                        {/* <th>{t("ps-srNo")}</th> */}
                        <th>{t("ps-itm-name")}</th>
                        <th>{t("ps-rate")}</th>
                        <th>{t("ps-qty")}</th>
                        <th>{t("ps-amt")}</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {viewItems.map((item, i) => (
                        <tr key={i}>
                          {/* <td>{i + 1}</td> */}
                          <td>{item.ItemName}</td>
                          <td className="w15"> {item.Rate}</td>

                          <td className="w15">{item.Qty}</td>
                          <td>{item.Amount}</td>
                          <td>
                            <FaRegEdit
                              size={15}
                              className="table-icon"
                              title="Update Item details"
                              onClick={() => handleEditClick(item)}
                            />
                            <MdDeleteOutline
                              onClick={() => handleDeleteItem(item?.saleid)}
                              size={15}
                              title="Delete the Item"
                              className="table-icon "
                              style={{ color: "red" }}
                            />
                          </td>
                        </tr>
                      ))}
                      <tr>
                        {/* <td></td> */}
                        <td></td>
                        <td></td>
                        <td>
                          <b> {t("ps-ttl-amt")}</b>
                        </td>
                        <td>
                          {(viewItems || []).reduce(
                            (acc, item) => acc + (item.Amount || 0),
                            0
                          )}
                        </td>
                        <td></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* its used for edit item */}
        {isModalOpen && (
          <div className="modal">
            <div className="saleModal-content">
              <h2>{t("ps-up-sale-item")} :</h2>
              <label className="info-text">
                {t("ps-rect-no")} :
                <input
                  type="number"
                  className="data"
                  value={editSale?.ReceiptNo}
                  onChange={(e) =>
                    setEditSale({ ...editSale, ReceiptNo: e.target.value })
                  }
                  onFocus={(e) => e.target.select()}
                />
              </label>
              <label className="info-text">
                {t("ps-qty")}:
                <input
                  type="number"
                  className="data"
                  value={editSale?.Qty}
                  onChange={(e) =>
                    setEditSale({ ...editSale, Qty: e.target.value })
                  }
                  onFocus={(e) => e.target.select()}
                />
              </label>
              <label className="info-text">
                {t("ps-rate")}:
                <input
                  className="data"
                  type="number"
                  value={editSale?.Rate}
                  onFocus={(e) => e.target.select()}
                  onChange={(e) =>
                    setEditSale({ ...editSale, Rate: e.target.value })
                  }
                />
              </label>
              <label className="info-text">
                {t("ps-amt")}:
                <input
                  type="number"
                  className="data"
                  value={handleAmountCalculation()}
                  disabled
                />
              </label>
              <div className="button-container w100 d-flex a-center">
                <button onClick={() => setIsModalOpen(false)}>
                  {" "}
                  {t("ps-cancel")}
                </button>
                <button
                  onClick={handleSaveChanges}
                  style={{ marginLeft: "10px" }}
                >
                  {" "}
                  {t("ps-update")}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GrocerySaleList;
