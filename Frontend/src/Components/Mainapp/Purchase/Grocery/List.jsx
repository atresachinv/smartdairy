import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { MdAddShoppingCart, MdDeleteOutline } from "react-icons/md";
import axiosInstance from "../../../../App/axiosInstance";
import { toast } from "react-toastify";
import Spinner from "../../../Home/Spinner/Spinner";
import "../purchase.css";
import { IoClose } from "react-icons/io5";
import Swal from "sweetalert2";
import { TbSortAscending2, TbSortDescending2 } from "react-icons/tb";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";
import { FaDownload } from "react-icons/fa6";
import jsPDF from "jspdf";
import { useSelector } from "react-redux";

const List = () => {
  const { t } = useTranslation(["puchasesale", "common"]);
  const [purchaseList, setPurchaseList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filteredList, setFilteredList] = useState(purchaseList); // Store filtered items
  const [fcode, setFcode] = useState("");
  const [date1, SetDate1] = useState("");
  const [date2, SetDate2] = useState("");
  const [loading, SetLoading] = useState(false);
  const [sortOrder, setSortOrder] = useState("desc");
  const [sortKey, setSortKey] = useState("purchasedate");
  const [updatelist, setUpdateList] = useState([]);
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

  // Handle view button click for purchase list
  const handleEditClick = (id) => {
    const filterList = purchaseList.filter((item) => item.billno === id) || [];
    setUpdateList(filterList);
    // console.log(filterList);
    setIsModalOpen(true);
  };

  // Fetch purchase list from API
  useEffect(() => {
    const fetchPurchaseList = async () => {
      SetLoading(true);
      try {
        const response = await axiosInstance.get(
          `/purchase/all?itemgroupcode=3&cn=0&role=${userRole}`
        );
        let purchase = response?.data?.purchaseData || [];
        purchase.sort(
          (a, b) => new Date(b.purchasedate) - new Date(a.purchasedate)
        );
        setPurchaseList(purchase);
        SetLoading(false);
      } catch (error) {
        SetLoading(false);
        toast.error("Error fetching purchase list.");
      }
    };
    fetchPurchaseList();
  }, []);

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
        if (res.data?.success) {
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
        }
      } catch (error) {
        // Handle error in deletion
        toast.error("Error deleting purchase item.");
      }
    }
  };

  // Function to get today's date in YYYY-MM-DD format
  const getTodaysDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  // Function to get date from X days ago
  const getPreviousDate = (daysAgo) => {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    return date.toISOString().split("T")[0];
  };

  useEffect(() => {
    SetDate1(getPreviousDate(0));
    SetDate2(getTodaysDate());
  }, []);

  // Function to download dealer list as an Excel file
  const downloadExcel = () => {
    if (filteredList.length === 0) {
      toast.warn("No data available to download.");
      return;
    }

    const formattedData = filteredList.map((item) => ({
      PurchaseDate: formatDateToDDMMYYYY(item.purchasedate),
      InvoiceIdBillNo: item.receiptno,
      SupplierCode: item.dealerCode,
      CustName: item.dealerName,
      ItemCode: item.itemcode,
      ItemName: item.itemname,
      Qty: item.qty,
      Rate: item.rate,
      Amt: item.amount,
      "cgst%": item.cgst || 0,
      "sgst%": item.sgst || 0,
      CN: item.cn || 0,
    }));

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, `PurchaseData_${date1}_to_${date2}.xlsx`);
  };

  // ----------------------------------------------------------------------------->
  // Function to group and sort purchases ---------------------------------------->

  const groupPurchases = () => {
    const groupedPurchase = (filteredList || []).reduce((acc, item) => {
      const key = item.billno;
      if (!acc[key]) {
        acc[key] = { ...item, TotalAmount: 0 };
      }
      acc[key].TotalAmount += item.amount;
      return acc;
    }, {});

    return Object.values(groupedPurchase).sort((a, b) => {
      if (sortKey === "purchasedate") {
        return sortOrder === "asc"
          ? new Date(a.purchasedate) - new Date(b.purchasedate)
          : new Date(b.purchasedate) - new Date(a.purchasedate);
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

  // Toggle sorting order ------------------------------------------------------->
  const handleSort = (key) => {
    setSortKey(key);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const groupedPurchaseArray = groupPurchases();
  // Function to fetch purchase data based on date and dealer code filt
  const handleShowbutton = async () => {
    SetLoading(true);
    const getItem = {
      date1,
      date2,
    };
    // console.log(getItem);
    try {
      const queryParams = new URLSearchParams(getItem).toString();
      const { data } = await axiosInstance.get(
        `/purchase/all?ItemGroupCode=3&cn=0&role=${userRole}&${queryParams}`
      );
      // console.log(data);
      if (data?.success) {
        setPurchaseList(data.purchaseData || []);
        setFcode("");
      } else {
        setPurchaseList([]);
      }
      SetLoading(false);
    } catch (error) {
      toast.error("Error fetching Purchase items");
      setPurchaseList([]);
      SetLoading(false);
    }
  };

  const formatDateToDDMMYYYY = (dateStr) => {
    const date = new Date(dateStr); // Parse the ISO string
    const day = String(date.getDate()).padStart(2, "0"); // Ensures two digits for day
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Ensures two digits for month
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  //for searching Name /code to get the purchase list ------------------------------------------->
  useEffect(() => {
    if (fcode) {
      const filteredItems = purchaseList.filter(
        (item) =>
          item.dealerCode.toString().includes(fcode) ||
          item.dealerName.toLowerCase().includes(fcode.toLowerCase()) ||
          item.receiptno.toString().includes(fcode.toLowerCase())
      );
      setFilteredList(filteredItems);
    } else {
      setFilteredList(purchaseList);
    }
  }, [fcode, purchaseList]);

  // Function to handle changes in the  input field
  const handleItemChange = (index, field, value) => {
    setUpdateList((prevList) => {
      const updatedList = [...prevList];

      // Update the specific field with the new value
      updatedList[index] = {
        ...updatedList[index],
        [field]: value,
      };

      // Convert rate & qty to numbers before calculating amount
      const rate = parseFloat(updatedList[index].rate) || 0;
      const qty = parseFloat(updatedList[index].qty) || 0;

      // Update amount only when rate or qty is changed
      if (field === "rate" || field === "qty") {
        updatedList[index].amount = rate * qty;
      }

      return updatedList;
    });
  };

  // Function to handle the update action (e.g., saving the changes to the server)
  const handleUpdate = async () => {
    const result = await Swal.fire({
      title: "Confirm Update?",
      text: "Are you sure you want to Update this?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Update it!",
    });

    if (result.isConfirmed) {
      try {
        // Sending updated data to the backend
        const res = await axiosInstance.put("/purchase/update", {
          purchases: updatelist.map((item) => ({
            purchaseid: item.purchaseid,
            rate: item.rate,
            salerate: item.salerate,
            qty: item.qty,
            amount: item.amount,
          })),
        });

        // Check if the update was successful
        if (res?.data?.success) {
          toast.success("Purchase data updated successfully!");

          // Optionally, update the frontend state with the new data
          setPurchaseList((prevList) =>
            prevList.map((item) => {
              const updatedItem = updatelist.find(
                (updated) => updated.purchaseid === item.purchaseid
              );
              return updatedItem ? { ...item, ...updatedItem } : item;
            })
          );

          setIsModalOpen(false); // Close the modal after successful update
        } else {
          toast.error("Error updating purchase data.");
        }
      } catch (error) {
        toast.error("Error updating purchase data.");
        console.error(error);
      }
    }
  };

  const handleFocus = (e) => {
    e.target.select();
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
      "Sr. No",
      "Date",
      "Bill No",
      "Code",
      "Dealer Name",
      "Amount",
    ];
    const rows = groupedPurchaseArray.map((item, index) => [
      index + 1,
      formatDateToDDMMYYYY(item.purchasedate),
      item.receiptno,
      item.dealerCode,
      item.dealerName,
      item.TotalAmount,
    ]);

    const totalAmount = groupedPurchaseArray.reduce(
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
    const invoiceInfo = doc.getTextWidth("Purchase-Info");
    doc.text("Purchase-Info", (pageWidth - invoiceInfo) / 2, margin + 25);
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
      `Grocery_PurchaseReport_${formatDateToDDMMYYYY(
        date1
      )}_to_${formatDateToDDMMYYYY(date2)}.pdf`
    );
  };

  return (
    <div className="purchase-product-bill-list-container w100 h1 d-flex-col sb p10">
      <span className="heading">किराणा खरेदी यादी :</span>
      <div className="download-print-pdf-excel-container w100 h25 d-flex-col sb">
        <div className="purchase-dates-add-new-purchase-container w100 h50 d-flex a-center sb">
          <div className="purchase-dates-container w65 d-flex a-center sb">
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
          <div className="add-new-purchase-div w30 d-flex h1 sb center  bg p10">
            <label htmlFor="" className="label-text">
              {t("ps-nv-add-grocery")}
            </label>
            <NavLink
              className="w-btn d-flex "
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
      <div className="purchase-prod-list-container w100 h65 d-flex-col bg">
        <span className="heading p10"> {t("ps-cattle-gro-rep")} :</span>
        <div className="purchase-prod-detilas-table-div w100 h1 mh100 d-flex-col hidescrollbar">
          <div className="data-headings-div w100 py10 d-flex a-center t-center sb sticky-top bg7">
            <span className="f-info-text w10">
              {t("ps-date")}
              <span
                className="px5 f-color-icon"
                type="button"
                onClick={() => handleSort("purchasedate")}
              >
                {sortKey === "purchasedate" ? (
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
            <span className="f-info-text w15">
              {t("ps-dealer-no")}
              <span
                className="px5 f-color-icon"
                type="button"
                onClick={() => handleSort("dealerCode")}
              >
                {sortKey === "dealerCode" ? (
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
            <span className="f-info-text w30">
              {t("ps-dealer-name")}
              <span
                className="px5 f-color-icon"
                type="button"
                onClick={() => handleSort("dealerName")}
              >
                {sortKey === "dealerName" ? (
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
            <span className="f-info-text w10">{t("ps-ttl-amt")}</span>
            <span className="f-info-text w10">Actions</span>
            {userRole === "salesman" ? (
              <></>
            ) : (
              <>
                <span className="f-info-text w15">
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
          {loading ? (
            <div className="box d-flex center">
              <Spinner />
            </div>
          ) : (
            <>
              {groupedPurchaseArray.length > 0 ? (
                groupedPurchaseArray.map((item, index) => (
                  <div
                    key={index}
                    className={`data-values-div sale-data-values-div w100 h10 d-flex center t-center sa`}
                    style={{
                      backgroundColor: index % 2 === 0 ? "#faefe3" : "#fff",
                    }}
                  >
                    {/* <span className="text w5">{index + 1}</span> */}
                    <span className="text w10">
                      {formatDateToDDMMYYYY(item.purchasedate)}
                    </span>
                    <span className="text w10">{item.receiptno}</span>
                    <span className="text w15">{item.dealerCode}</span>
                    <span className="text w30">
                      {item.dealerName || "Unknown"}
                    </span>
                    <span className="text w10">{item.TotalAmount}</span>
                    <span className="text w10 d-flex j-center a-center">
                      <button
                        style={{ cursor: "pointer" }}
                        className="px5 "
                        onClick={() => handleEditClick(item.billno)}
                      >
                        {t("ps-view")}
                      </button>
                      <MdDeleteOutline
                        onClick={() => handleDelete(item.billno)}
                        size={17}
                        className="table-icon"
                        style={{ color: "red" }}
                      />
                    </span>
                    {userRole === "salesman" ? (
                      <></>
                    ) : (
                      <>
                        <span className="text w15">
                          {item.createdby || "Unknown"}
                        </span>
                      </>
                    )}
                  </div>
                ))
              ) : (
                <div className="box d-flex center">{t("ps-no-pur-foun")}</div>
              )}
            </>
          )}
        </div>
      </div>
      {isModalOpen && updatelist.length > 0 && (
        <div className="pramod modal">
          <div className="modal-content">
            <div className="d-flex sb deal-info">
              <label className="heading">{t("ps-pur-bill-det")}</label>
              <IoClose
                style={{
                  cursor: "pointer",
                  background: "#34078e",
                  color: "#fff",
                  borderRadius: "6px",
                }}
                size={25}
                onClick={() => setIsModalOpen(false)}
              />
            </div>
            <hr />
            <div className=" d-flex sb mx15 px15 deal-info-name">
              <label className="label-text">
                {t("ps-rect-no")}:{" "}
                <span className="info-text">
                  {updatelist[0]?.receiptno || ""}
                </span>
              </label>
              <div className="10">
                <label className="label-text">
                  {t("ps-date")} :{" "}
                  <span className="info-text">
                    {formatDateToDDMMYYYY(updatelist[0]?.purchasedate)}
                  </span>
                </label>
              </div>
            </div>
            <div className=" d-flex sb mx15 px15 deal-info-name">
              <label className="lable-text">
                {t("ps-dealer-no")}:{" "}
                <span className="info-text">
                  {updatelist[0]?.dealerCode || ""}
                </span>
              </label>
              <label className="label-text">
                {t("ps-dealer-name")} :{" "}
                <span className="info-text">
                  {updatelist[0]?.dealerName || ""}
                </span>
              </label>
            </div>
            {/* <div className="modal-content w100  "> */}
            <div className="sales-table-container w100">
              <table className="sales-table w100 ">
                <thead className="bg1">
                  <tr>
                    {/* <th className="f-info-text"> {t("ps-srNo")}</th> */}
                    <th className="f-info-text"> {t("ps-itm-name")}</th>
                    <th className="f-info-text"> {t("खरेदी दर")}</th>
                    <th className="f-info-text"> {t("ps-sale-rate")}</th>
                    <th className="f-info-text"> {t("ps-qty")}</th>
                    <th className="f-info-text"> {t("ps-amt")}</th>
                  </tr>
                </thead>
                <tbody>
                  {updatelist.map((item, i) => (
                    <tr key={i}>
                      {/* <td>{i + 1}</td> */}
                      <td className="info-text">{item.itemname}</td>
                      <td className="w20">
                        <input
                          name="rate"
                          type="number"
                          className="data"
                          value={item.rate}
                          onFocus={handleFocus}
                          onChange={(e) =>
                            handleItemChange(i, "rate", e.target.value)
                          }
                        />
                      </td>
                      <td className="w20">
                        <input
                          name="sale"
                          type="number"
                          className="data"
                          value={item.salerate}
                          onFocus={handleFocus}
                          onChange={(e) =>
                            handleItemChange(i, "salerate", e.target.value)
                          }
                        />
                      </td>
                      <td className="w20">
                        <input
                          name="qty"
                          type="number"
                          className="data"
                          value={item.qty}
                          onFocus={handleFocus}
                          onChange={(e) =>
                            handleItemChange(i, "qty", e.target.value)
                          }
                        />
                      </td>
                      <td>{item.rate * item.qty}</td>
                    </tr>
                  ))}
                  <tr>
                    {/* <td></td> */}
                    <td></td>
                    <td></td>
                    <td></td>
                    <td>
                      <b> {t("ps-ttl-amt")}</b>
                    </td>
                    <td>
                      {(updatelist || []).reduce(
                        (acc, item) => acc + (item.amount || 0),
                        0
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            {/* </div> */}
            <div className="d-flex my15 j-end">
              <button className="btn" onClick={handleUpdate}>
                {t("ps-update")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default List;
