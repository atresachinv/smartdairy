/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
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

const CattleSaleList = () => {
  const { t } = useTranslation(["puchasesale", "common"]);
  const { customerlist, loading } = useSelector((state) => state.customer);
  const [date1, SetDate1] = useState("");
  const [date2, SetDate2] = useState("");
  const [fcode, setFcode] = useState("");
  const [sales, setSales] = useState([]);
  const [itemList, setItemList] = useState([]);
  const [editSale, setEditSale] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
  const [filteredSalesList, setFilteredSalesList] = useState(sales);
  const [viewItems, setViewItems] = useState([]);
  const [loadings, SetLoadings] = useState(false);
  const [sortOrder, setSortOrder] = useState("desc");
  //download Excel sheet
  const downloadExcel = () => {
    const exportData = sales.map((sale) => ({
      BillDate: formatDateToDDMMYYYY(sale.BillDate),
      BillNo: sale.ReceiptNo,
      custCode: sale.CustCode,
      custName: handleFindCustName(sale.CustCode),
      ItemCode: sale.ItemCode,
      ItemName: handleFindItemName(sale.ItemCode),
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

  //getall Item
  useEffect(() => {
    const fetchAllItems = async () => {
      try {
        const { data } = await axiosInstance.get("/item/all?ItemGroupCode=1");
        setItemList(data.itemsData || []);
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    };
    fetchAllItems();
  }, []);

  // Fetch sales data from backend (API endpoint)
  useEffect(() => {
    const fetchSales = async () => {
      SetLoadings(true);
      try {
        const { data } = await axiosInstance.get(
          "/sale/all?ItemGroupCode=1&cn=0"
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
        `/sale/all?ItemGroupCode=1&cn=0&${queryParams}`
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

  //get item name from item code
  const handleFindItemName = (id) => {
    const selectedItem = itemList.find((item) => item.ItemCode === id);
    return selectedItem?.ItemName || "Unknown Item";
  };

  //get cust name from cust code
  const handleFindCustName = (id) => {
    const selectedItem = customerlist.find((item) => item.srno === id);
    return selectedItem?.cname || "Unknown Customer";
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

  // update invoice and its item ----------------------------------------------------->
  const handleSaveChanges = async () => {
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
      const updatedAmount =
        parseFloat(editSale.Qty) * parseFloat(editSale.Rate);

      const updateItem = {
        saleid: editSale.saleid,
        ReceiptNo: editSale.ReceiptNo,
        Rate: editSale.Rate,
        Qty: editSale.Qty,
        Amount: updatedAmount,
      };
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
      }
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

    // Convert object to array and sort based on the selected order
    return Object.values(groupedSales).sort((a, b) =>
      sortOrder === "asc"
        ? new Date(a.BillDate) - new Date(b.BillDate)
        : new Date(b.BillDate) - new Date(a.BillDate)
    );
  };

  // ---------------------------------------------------------------------------->
  // Toggle sorting order ------------------------------------------------------->
  const toggleSortOrder = () => {
    setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
  };

  const groupedSalesArray = groupSales();

  //for searching Name or code to get the sale list------------------------------------>

  useEffect(() => {
    if (fcode) {
      const filteredItems = sales.filter((item) => {
        const isCodeMatch = item.CustCode.toString().includes(fcode);
        const isRecptMatch = item.ReceiptNo.toString().includes(fcode);

        const isNameMatch = handleFindCustName(item.CustCode)
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

  return (
    <div className="customer-list-container-div w100 h1 d-flex-col p10">
      <div className="download-print-pdf-excel-container w100 h30 d-flex-col sb">
        <div className="sales-dates-container w100 h50 d-flex a-center sb sales-dates-container-mobile">
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
          <div className="d-flex h1 sb center w25 sales-dates-container-mobile-w100  p10 bg">
            <label htmlFor="" className="label-text px5 ">
              {t("ps-nv-add-cattlefeed")}
            </label>
            <NavLink
              className="w-btn d-flex "
              style={{ textDecoration: "none" }}
              to="add-new"
            >
              <MdAddShoppingCart className="icon f-label" />
              {t("ps-new")}
            </NavLink>
          </div>
        </div>
        <div className="find-customer-container w100 h50 d-flex a-center my5">
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
            {t("ps-down-excel")}
          </button>
        </div>
      </div>
      <div className="sales-list-table w100 h80 d-flex-col bg">
        <span className="heading p10"> {t("ps-cattel-rep")}</span>
        <div className="sales-heading-title-scroller w100 h1 mh100 d-flex-col hidescrollbar">
          <div className="sale-data-headings-div py10 d-flex center t-center sb sticky-top t-heading-bg">
            <span className="f-info-text w5"> {t("ps-srNo")}</span>
            <span className="f-info-text w15 t-center d-flex a-center ">
              {t("ps-date")}{" "}
              <span
                className="px10 f-color-icon"
                type="button"
                onClick={toggleSortOrder}
              >
                {sortOrder === "asc" ? (
                  <TbSortAscending2 />
                ) : (
                  <TbSortDescending2 />
                )}
              </span>
            </span>
            <span className="f-info-text w10">{t("ps-rect-no")}</span>
            <span className="f-info-text w10"> {t("ps-custCode")}</span>
            <span className="f-info-text w30"> {t("ps-cutName")}</span>
            <span className="f-info-text w10">{t("ps-amt")}</span>
            <span className="f-info-text w15">Actions</span>
          </div>
          {loadings ? (
            <Spinner />
          ) : groupedSalesArray.length > 0 ? (
            groupedSalesArray.map((sale, index) => (
              <div
                key={index}
                className={`sale-data-values-div w100 h10 d-flex center t-center sa ${
                  index % 2 === 0 ? "bg-light" : "bg-dark"
                }`}
                style={{
                  backgroundColor: index % 2 === 0 ? "#faefe3" : "#fff",
                }}
              >
                <span className="text w5">{index + 1}</span>
                <span className="text w10">
                  {formatDateToDDMMYYYY(sale.BillDate)}
                </span>
                <span className="text w10">{sale.ReceiptNo}</span>
                <span className="text w10">{sale.CustCode}</span>
                <span className="text w30 t-start">
                  {handleFindCustName(sale.CustCode)}
                </span>

                <span className="text w10 t-end">{sale.TotalAmount}</span>
                <span className="text w15 d-flex j-center a-center sa">
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
              </div>
            ))
          ) : (
            <div className="box d-flex center"> {t("ps-sale-item")}</div>
          )}
        </div>
        {/* show invoice */}
        {isInvoiceOpen && viewItems.length > 0 && (
          <div className="pramod modal ">
            <div className="modal-content invoiceModel">
              <div className="d-flex sb">
                <h2> {t("ps-sale-bill-det")}</h2>
                <IoClose
                  style={{ cursor: "pointer" }}
                  size={25}
                  onClick={() => setIsInvoiceOpen(false)}
                />
              </div>
              <hr />
              <div className=" d-flex sb mx15 px15 invoiceModelInfo">
                <h4>
                  {t("ps-rect-no")} : {viewItems[0]?.ReceiptNo || ""}
                </h4>
                <div className="10">
                  {t("ps-date")} :{formatDateToDDMMYYYY(viewItems[0]?.BillDate)}
                </div>
              </div>
              <div className=" d-flex sb mx15 px15 invoiceModelInfo">
                <h4>
                  {t("ps-custCode")} : {viewItems[0]?.CustCode || ""}
                </h4>
                <h4 className="mx15">
                  {handleFindCustName(viewItems[0]?.CustCode) || ""}
                </h4>
              </div>
              <div className="modal-content w100  ">
                <div className="sales-table-container w100">
                  <table className="sales-table w100 ">
                    <thead className="bg1">
                      <tr>
                        <th>{t("ps-srNo")}</th>
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
                          <td>{i + 1}</td>
                          <td>{handleFindItemName(item.ItemCode)}</td>
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
                        <td></td>
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
          <div className="modal sale">
            <div className="modal-content">
              <h2> {t("ps-up-sale-item")}</h2>
              <label>
                {t("ps-rect-no")} :
                <input
                  type="number"
                  value={editSale?.ReceiptNo}
                  onChange={(e) =>
                    setEditSale({ ...editSale, ReceiptNo: e.target.value })
                  }
                  onFocus={(e) => e.target.select()}
                />
              </label>
              <label>
                {t("ps-qty")}:
                <input
                  type="number"
                  value={editSale?.Qty}
                  onChange={(e) =>
                    setEditSale({ ...editSale, Qty: e.target.value })
                  }
                  onFocus={(e) => e.target.select()}
                />
              </label>
              <label>
                {t("ps-rate")}:
                <input
                  type="number"
                  value={editSale?.Rate}
                  onFocus={(e) => e.target.select()}
                  onChange={(e) =>
                    setEditSale({ ...editSale, Rate: e.target.value })
                  }
                />
              </label>
              <label>
                {t("ps-amt")}:
                <input
                  type="number"
                  value={handleAmountCalculation()}
                  disabled
                />
              </label>
              <div className="button-container w100 d-flex a-center">
                <button onClick={() => setIsModalOpen(false)}>
                  {" "}
                  {t("ps-cancel")}
                </button>
                <button onClick={handleSaveChanges}> {t("ps-update")}</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CattleSaleList;
