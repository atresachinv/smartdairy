import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { listEmployee } from "../../../../../App/Features/Mainapp/Masters/empMasterSlice";
import { centersLists } from "../../../../../App/Features/Dairy/Center/centerSlice";
import axiosInstance from "../../../../../App/axiosInstance";
import { TbSortAscending2, TbSortDescending2 } from "react-icons/tb";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";
import { IoClose } from "react-icons/io5";
import { FaDownload } from "react-icons/fa6";
import { NavLink } from "react-router-dom";
import jsPDF from "jspdf";
import Spinner from "../../../../Home/Spinner/Spinner";

const StockReport = () => {
  const { t } = useTranslation(["puchasesale", "common"]);
  const [deliveryList, setDeliveryList] = useState([]);
  const [returnDeliveryList, setReturnDeliveryList] = useState([]);
  const [filteredList, setFilteredList] = useState(deliveryList);
  const [returnFilteredList, setReturnFilteredList] =
    useState(returnDeliveryList);
  const [sales, setSales] = useState([]);
  const [filteredSalesList, setFilteredSalesList] = useState(sales);
  const [fcode, setFcode] = useState("");
  const [date1, SetDate1] = useState("");
  const [date2, SetDate2] = useState("");
  const [loading, SetLoading] = useState(false);
  const [saleloading, SetSaleLoading] = useState(false);
  const [sortOrder, setSortOrder] = useState("desc");
  const [sortKey, setSortKey] = useState("saledate");
  const dispatch = useDispatch();
  const { emplist } = useSelector((state) => state.emp);
  const centerList = useSelector((state) => state.center.centersList || []);
  const dairyInfo = useSelector(
    (state) =>
      state.dairy.dairyData.SocietyName || state.dairy.dairyData.center_name
  );
  const role = useSelector((state) => state.users.user?.role);
  const [userRole, setUserRole] = useState(role);
  //Remaining stock
  const [remainingStock, setRemainingStock] = useState([]);
  useEffect(() => {
    setUserRole(role);
  }, [role]);

  //get all
  useEffect(() => {
    dispatch(listEmployee());
    dispatch(centersLists());
  }, [dispatch]);

  // Fetch sales data from backend (API endpoint)
  useEffect(() => {
    const fetchSales = async () => {
      SetSaleLoading(true);
      try {
        const response = await axiosInstance.get(
          `/sale/all?cn=0&role=${userRole}`
        ); // Replace with your actual API URL
        setSales(response.data.salesData);
        SetSaleLoading(false);
      } catch (error) {
        SetSaleLoading(false);
        console.error("Error fetching sales:", error);
      }
    };

    fetchSales();
  }, []);

  // Fetch delivery stock list from API
  useEffect(() => {
    const fetchDeliveryList = async () => {
      SetLoading(true);
      try {
        const response = await axiosInstance.get(`/user/deliverystock?cn=0`);
        let list = response?.data?.data || [];
        list.sort((a, b) => new Date(b.saledate) - new Date(a.saledate));
        setDeliveryList(list);
        SetLoading(false);
      } catch (error) {
        SetLoading(false);
        toast.error("Error fetching delivery stock list.");
      }
    };
    fetchDeliveryList();
  }, []);

  // Fetch return delivery stock list from API
  useEffect(() => {
    const fetchDeliveryList = async () => {
      SetLoading(true);
      try {
        const response = await axiosInstance.get(`/user/deliverystock?cn=1`);
        let list = response?.data?.data || [];
        list.sort((a, b) => new Date(b.saledate) - new Date(a.saledate));
        setReturnDeliveryList(list);
        SetLoading(false);
      } catch (error) {
        SetLoading(false);
        toast.error("Error fetching delivery stock list.");
      }
    };
    fetchDeliveryList();
  }, []);

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
    if (groupedPurchaseArray.length === 0) {
      toast.warn("No data available to download.");
      return;
    }
    const columns = [
      "Sr No",
      "Date",
      "Item Name",
      "Purchase Qty",
      "Sale Qty",
      "Return Qty",
      "Remaining Qty",
    ];
    const rows = groupedPurchaseArray.map((item, index) => [
      index + 1,
      formatDateToDDMMYYYY(item.saledate),
      item.ItemName,
      item.TotalQty,
      handleSaleItemQty(item.ItemCode),
      findItemReturnQty(item.ItemCode),
      findRemQty(item.ItemCode),
    ]);

    const formattedData = groupedPurchaseArray.map((item) => ({
      Date: formatDateToDDMMYYYY(item.saledate),
      "Item Name": item.ItemName,
      "Purchase Qty": item.TotalQty,
      "Sale Qty": handleSaleItemQty(item.ItemCode),
      "Return Qty": findItemReturnQty(item.ItemCode),
      "Remaining Qty": findRemQty(item.ItemCode),
    }));

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, `DC_${date1}_to_${date2}.xlsx`);
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
      "Sr No",
      "Date",
      "Item Name",
      "Purchase Qty",
      "Sale Qty",
      "Return Qty",
      "Remaining Qty",
    ];
    const rows = groupedPurchaseArray.map((item, index) => [
      index + 1,
      formatDateToDDMMYYYY(item.saledate),
      item.ItemName,
      item.TotalQty,
      handleSaleItemQty(item.ItemCode),
      findItemReturnQty(item.ItemCode),
      findRemQty(item.ItemCode),
    ]);

    const totalAmount = remainingStock.reduce((acc, item) => acc + item.Qty, 0);

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
    const invoiceInfo = doc.getTextWidth("DC-Stock-Report");
    doc.text("DC-Stock-Report", (pageWidth - invoiceInfo) / 2, margin + 25);
    const gepInfo = doc.getTextWidth(
      `${formatDateToDDMMYYYY(date1)} to ${formatDateToDDMMYYYY(date2)}`
    );
    doc.text(
      `${formatDateToDDMMYYYY(date1)} to ${formatDateToDDMMYYYY(date2)}`,
      (pageWidth - gepInfo) / 2,
      margin + 35
    );
    // Add table for items with borders and centered text
    doc.autoTable({
      head: [columns],
      body: rows,
      startY: margin + 40,
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
    const totalAmountLabel = `Remaining Qty: ${totalAmount}`;
    doc.text(totalAmountLabel, 145, doc.lastAutoTable.finalY + 10);

    // Save the PDF
    doc.save(
      `Delivery_Chalan_Report_${formatDateToDDMMYYYY(
        date1
      )}_to_${formatDateToDDMMYYYY(date2)}.pdf`
    );
  };

  // ----------------------------------------------------------------------------->
  // Function to group and sort purchases ---------------------------------------->

  const groupPurchases = () => {
    const groupedPurchase = (filteredList || []).reduce((acc, item) => {
      const key = item.ItemCode;
      if (!acc[key]) {
        acc[key] = { ...item, TotalQty: 0 };
      }
      acc[key].TotalQty += item.Qty;
      return acc;
    }, {});

    return Object.values(groupedPurchase).sort((a, b) => {
      if (sortKey === "saledate") {
        return sortOrder === "asc"
          ? new Date(a.saledate) - new Date(b.saledate)
          : new Date(b.saledate) - new Date(a.saledate);
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

  // Toggle sorting order
  const handleSort = (key) => {
    setSortKey(key);
    setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
  };

  const [groupedPurchaseArray, setGroupPurchaseArray] = useState([]);
  useEffect(() => {
    setGroupPurchaseArray(groupPurchases());
  }, [sales, filteredList, sortKey, sortOrder]);
  // ----------------------------------------------------------------------------->
  // Function to group and sort purchases return ---------------------------------------->

  const groupPurchasesReturn = () => {
    const groupedPurchase = (returnFilteredList || []).reduce((acc, item) => {
      const key = item.ItemCode;
      if (!acc[key]) {
        acc[key] = { ...item, TotalQty: 0 };
      }
      acc[key].TotalQty += item.Qty;
      return acc;
    }, {});

    return Object.values(groupedPurchase).sort((a, b) => {
      if (sortKey === "saledate") {
        return sortOrder === "asc"
          ? new Date(a.saledate) - new Date(b.saledate)
          : new Date(b.saledate) - new Date(a.saledate);
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
  const groupedPurchaseReturnArray = groupPurchasesReturn();

  const handleShowbutton = async () => {
    SetLoading(true);
    SetLoading(true);

    const getItem = {
      from_date: date1,
      to_date: date2,
    };

    const saleItem = {
      date1,
      date2,
    };

    const queryParams1 = new URLSearchParams(getItem).toString();
    const queryParams2 = new URLSearchParams(saleItem).toString();

    const urls = [
      axiosInstance.get(
        `/all/deliverystock?cn=0&role=${userRole}&${queryParams1}`
      ),
      axiosInstance.get(`/sale/all?cn=0&role=${userRole}&${queryParams2}`),
      axiosInstance.get(
        `/all/deliverystock?cn=1&role=${userRole}&${queryParams1}`
      ),
    ];

    try {
      const [delivery0, sale, delivery1] = await Promise.all(urls);

      if (delivery0.data?.success) {
        setDeliveryList(delivery0.data.data || []);
      } else {
        setDeliveryList([]);
      }

      if (sale.data?.success) {
        setSales(sale.data.salesData);
      }

      if (delivery1.data?.success) {
        setReturnDeliveryList(delivery1.data.data || []);
      } else {
        setReturnDeliveryList([]);
      }
    } catch (error) {
      toast.error("Error fetching data");
      setDeliveryList([]);
      setReturnDeliveryList([]);
      setSales([]);
      SetLoading(false);
    } finally {
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

  //for searching  to get the  list ------------------------------------------->
  useEffect(() => {
    if (fcode) {
      const filteredItems = deliveryList.filter((item) =>
        item.ItemName.toLowerCase().includes(fcode.toLowerCase())
      );
      setFilteredList(filteredItems);
      setReturnFilteredList(returnFilteredList);
      setFilteredSalesList(filteredSalesList);
    } else {
      setFilteredList(deliveryList);
      setReturnFilteredList(returnDeliveryList);
      setFilteredSalesList(sales);
    }
  }, [fcode, sales, deliveryList]);

  //find name
  const findEmpName = (emp_id, deliver_to) => {
    if (emplist && deliver_to === 2) {
      const emp = emplist.find((item) => parseInt(item.emp_id) == emp_id);
      return emp?.emp_name || "";
    } else if (centerList && deliver_to === 1) {
      const center = centerList.find(
        (item) => parseInt(item.center_id) == emp_id
      );
      return center?.center_name || "";
    } else return "";
  };

  // Find item return quantity
  const findItemReturnQty = (item_id) => {
    const item = groupedPurchaseReturnArray.find(
      (item) => item.ItemCode === item_id
    );
    return item ? item.Qty : 0;
  };

  // ----------------------------------------------------------------------------->
  // Function to group sales by ItemCode ------------------------------------------->
  const groupSales = () => {
    const groupedSales = filteredSalesList.reduce((acc, sale) => {
      const key = sale.ItemCode;
      if (!acc[key]) {
        acc[key] = { ...sale, TotalAmount: 0, TotalQty: 0 };
      }
      acc[key].TotalAmount += sale.Amount;
      acc[key].TotalQty += sale.Qty;
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

  //sale grouping
  const [saleGrouping, setSaleGrouping] = useState([]);

  useEffect(() => {
    setSaleGrouping(groupSales());
  }, [filteredList, returnFilteredList, filteredSalesList]);

  //handle sale item quantity
  const handleSaleItemQty = (item_id) => {
    // console.log("saleGrouping", saleGrouping);
    const item = saleGrouping.find(
      (item) => Number(item.ItemCode) === Number(item_id)
    );
    // console.log("item", item);
    return item ? item.TotalQty : 0;
  };

  //calculate Remaining Stock item wise
  useEffect(() => {
    if (!saleloading) {
      const remainingStockData = () => {
        if (filteredList) {
          const stockMap = filteredList.reduce((acc, item) => {
            if (!acc[item.ItemCode]) {
              acc[item.ItemCode] = {
                ItemCode: item.ItemCode,
                ItemName: item.ItemName,
                Qty: 0,
              };
            }
            acc[item.ItemCode].Qty += item.Qty;
            return acc;
          }, {});

          // Subtract return quantities
          returnFilteredList.forEach((ret) => {
            if (stockMap[ret.ItemCode]) {
              stockMap[ret.ItemCode].Qty -= ret.Qty;
            }
          });

          // Subtract sale quantities
          filteredSalesList.forEach((ret) => {
            if (stockMap[ret.ItemCode]) {
              stockMap[ret.ItemCode].Qty -= ret.Qty;
            }
          });

          return Object.values(stockMap).map((item) => ({
            ItemCode: item.ItemCode,
            ItemName: item.ItemName,
            Qty: item.Qty > 0 ? item.Qty : 0,
          }));
        }
        return [];
      };
      setRemainingStock(remainingStockData());
    } // Call the function here
  }, [sales, filteredList, returnFilteredList, filteredSalesList]);

  //find total handler
  const findRemQty = (item_id) => {
    const item = remainingStock.find((item) => item.ItemCode === item_id);
    return item ? item.Qty : 0;
  };

  return (
    <div className="customer-list-container-div w100 h1 d-flex-col p10">
      <div className="download-print-pdf-excel-container w100 h30 d-flex-col sb">
        <div className="sales-dates-container w100 h50 d-flex a-center sb sales-dates-container-mobile">
          <div className="d-flex sb w60 sales-dates-container-mobile-w100">
            <div className="date-input-div   d-flex a-center sb">
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
            <div className="date-input-div d-flex a-center sb">
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
            <button className="w-btn " onClick={handleShowbutton}>
              {t("ps-show")}
            </button>
          </div>
          <div className="d-flex h1 sb center w25 sales-dates-container-mobile-w100  p10 bg">
            <label htmlFor="" className="label-text ">
              एकूण शिल्लक
            </label>
            <NavLink
              className="w-btn d-flex "
              style={{ textDecoration: "none" }}
            >
              {remainingStock.reduce((acc, item) => acc + item.Qty, 0)}
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
            <span className="f-label-text px10"> {t("ps-down-excel")}</span>
            <FaDownload className="icon" />
          </button>
          <button
            className="w-btn mx10 sales-dates-container-mobile-btn"
            onClick={downloadPdf}
          >
            <span className="f-label-text px10"> PDF </span>
            <FaDownload className="icon" />
          </button>
        </div>
      </div>
      <div className="customer-list-table w100 h1 d-flex-col  bg">
        <span className="heading p10">Delivery Stock Report</span>
        <div className="customer-heading-title-scroller w100 h1 mh100 hidescrollbar d-flex-col">
          <div className="data-headings-div h10 d-flex center forDWidth t-center bg7 sb">
            {/* <span className="f-info-text w5"> {t("ps-srNo")}</span> */}
            <span className="f-info-text w15">
              {t("ps-date")}
              <span
                className="px5 f-color-icon"
                type="button"
                onClick={() => handleSort("saledate")}
              >
                {sortKey === "saledate" ? (
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
            <span className="f-info-text w15">
              Item Name
              <span
                className="px5 f-color-icon"
                type="button"
                onClick={() => handleSort("ItemName")}
              >
                {sortKey === "ItemName" ? (
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
            <span className="f-info-text w15">Purchase Qty</span>
            <span className="f-info-text w15">Sale Qty</span>
            <span className="f-info-text w25">Return Qty</span>
            <span className="f-info-text w15">एकूण शिल्लक </span>
          </div>
          {loading || saleloading ? (
            <div className="box d-flex center">
              <Spinner />
            </div>
          ) : (
            <>
              {groupedPurchaseArray.length > 0 ? (
                groupedPurchaseArray.map((item, index) => (
                  <div
                    key={index}
                    className={`data-values-div w100 h10 d-flex forDWidth center t-center sa ${
                      index % 2 === 0 ? "bg-light" : "bg-dark"
                    }`}
                    style={{
                      backgroundColor: index % 2 === 0 ? "#faefe3" : "#fff",
                    }}
                  >
                    {/* <span className="text w5">{index + 1}</span> */}
                    <span className="text w15">
                      {formatDateToDDMMYYYY(item.saledate)}
                    </span>
                    <span className="text w15">
                      {item.ItemName.slice(0, 10)}.
                    </span>
                    <span className="text w15">{item.TotalQty}</span>
                    <span className="text w15">
                      {handleSaleItemQty(item.ItemCode)}
                    </span>
                    <span className="text w25">
                      {findItemReturnQty(item.ItemCode)}
                    </span>
                    <span className="text w15 ">
                      {findRemQty(item.ItemCode)}
                    </span>
                  </div>
                ))
              ) : (
                <div className="box d-flex center">
                  <span className="label-text">
                    {t("common:c-no-data-avai")}
                  </span>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default StockReport;
