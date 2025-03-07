import Swal from "sweetalert2";
import { TbSortAscending2, TbSortDescending2 } from "react-icons/tb";
import { useEffect, useState } from "react";
import axiosInstance from "../../../../../../App/axiosInstance";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";
import { MdAddShoppingCart, MdDeleteOutline } from "react-icons/md";
import Spinner from "../../../../../Home/Spinner/Spinner";
import { IoClose } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { listEmployee } from "../../../../../../App/Features/Mainapp/Masters/empMasterSlice";
import { FaDownload } from "react-icons/fa6";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { centersLists } from "../../../../../../App/Features/Dairy/Center/centerSlice";
import jsPDF from "jspdf";

const ListDeliveryStock = () => {
  const { t } = useTranslation(["puchasesale", "common"]);
  const [deliveryList, setDeliveryList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filteredList, setFilteredList] = useState(deliveryList); // Store filtered items
  const [fcode, setFcode] = useState("");
  const [date1, SetDate1] = useState("");
  const [date2, SetDate2] = useState("");
  const [loading, SetLoading] = useState(false);
  const [sortOrder, setSortOrder] = useState("desc");
  const [sortKey, setSortKey] = useState("saledate");
  const [updatelist, setUpdateList] = useState([]);
  const dispatch = useDispatch();
  const { emplist } = useSelector((state) => state.emp);
  const centerList = useSelector(
    (state) => state.center.centersList.centersDetails
  );
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
    const filterList = deliveryList.filter((item) => item.billno === id) || [];
    setUpdateList(filterList);
    // console.log(filterList);
    setIsModalOpen(true);
  };

  //get all
  useEffect(() => {
    dispatch(listEmployee());
    dispatch(centersLists());
  }, [dispatch]);

  // Fetch delivery stock list from API
  useEffect(() => {
    const fetchDeliveryList = async () => {
      SetLoading(true);
      try {
        const response = await axiosInstance.get(
          `/all/deliverystock?cn=0&role=${userRole}`
        );
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
          setDeliveryList((prevItems) =>
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
    if (groupedPurchaseArray.length === 0) {
      toast.warn("No data available to download.");
      return;
    }

    const formattedData = groupedPurchaseArray.map((item) => ({
      Date: formatDateToDDMMYYYY(item.saledate),
      InvoiceIdBillNo: item.rctno,
      "Party Code": item.to_user,
      "Party Name": findEmpName(item.to_user, item.deliver_to),
      ItemCode: item.ItemCode,
      ItemName: item.ItemName,
      Qty: item.qty,
    }));

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, `DC_${date1}_to_${date2}.xlsx`);
  };

  // ----------------------------------------------------------------------------->
  // Function to group and sort purchases ---------------------------------------->

  const groupPurchases = () => {
    const groupedPurchase = (filteredList || []).reduce((acc, item) => {
      const key = item.billno;
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
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const groupedPurchaseArray = groupPurchases();
  // Function to fetch purchase data based on date and dealer code filt
  const handleShowbutton = async () => {
    SetLoading(true);
    const getItem = {
      from_date: date1,
      to_date: date2,
    };
    // console.log(getItem);
    try {
      const queryParams = new URLSearchParams(getItem).toString();
      const { data } = await axiosInstance.get(
        `/all/deliverystock?cn=0&role=${userRole}&${queryParams}`
      );
      // console.log(data);
      if (data?.success) {
        setDeliveryList(data.data || []);
      } else {
        setDeliveryList([]);
      }
      SetLoading(false);
    } catch (error) {
      toast.error("Error fetching Purchase items");
      setDeliveryList([]);
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
      const filteredItems = deliveryList.filter(
        (item) =>
          item.to_user.toString().includes(fcode) ||
          item.ItemName.toLowerCase().includes(fcode.toLowerCase()) ||
          item.rctno.toString().includes(fcode.toLowerCase())
      );
      setFilteredList(filteredItems);
    } else {
      setFilteredList(deliveryList);
    }
  }, [fcode, deliveryList]);

  // Function to handle changes in the  input field
  const handleItemChange = (index, field, value) => {
    setUpdateList((prevList) => {
      const updatedList = [...prevList];

      // Update the specific field with the new value
      updatedList[index] = {
        ...updatedList[index],
        [field]: value,
      };

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
      // try {
      //   // Sending updated data to the backend
      //   const res = await axiosInstance.put("/purchase/update", {
      //     purchases: updatelist.map((item) => ({
      //       purchaseid: item.purchaseid,
      //       rate: item.rate,
      //       salerate: item.salerate,
      //       qty: item.qty,
      //       amount: item.amount,
      //     })),
      //   });
      //   // Check if the update was successful
      //   if (res?.data?.success) {
      //     toast.success("Purchase data updated successfully!");
      //     // Optionally, update the frontend state with the new data
      //     setDeliveryList((prevList) =>
      //       prevList.map((item) => {
      //         const updatedItem = updatelist.find(
      //           (updated) => updated.purchaseid === item.purchaseid
      //         );
      //         return updatedItem ? { ...item, ...updatedItem } : item;
      //       })
      //     );
      //     setIsModalOpen(false); // Close the modal after successful update
      //   } else {
      //     toast.error("Error updating purchase data.");
      //   }
      // } catch (error) {
      //   toast.error("Error updating purchase data.");
      //   console.error(error);
      // }
    }
  };

  const handleFocus = (e) => {
    e.target.select();
  };

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
      "Chalan No",
      "Party Code",
      "Party Name",
      "Qty",
    ];
    const rows = groupedPurchaseArray.map((item, index) => [
      index + 1,
      formatDateToDDMMYYYY(item.saledate),
      item.rctno,
      item.to_user,
      findEmpName(item.to_user, item.deliver_to),
      item.TotalQty,
    ]);

    const totalAmount = groupedPurchaseArray.reduce(
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
    const invoiceInfo = doc.getTextWidth("DC-Info");
    doc.text("DC-Info", (pageWidth - invoiceInfo) / 2, margin + 25);
    const gepInfo = doc.getTextWidth("Delivery Chalan Report");
    doc.text("Delivery Chalan Report", (pageWidth - gepInfo) / 2, margin + 35);
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
    const totalAmountLabel = `Total Qty: ${totalAmount}`;
    doc.text(totalAmountLabel, 145, doc.lastAutoTable.finalY + 10);

    // Save the PDF
    doc.save(
      `Delivery_Chalan_Report_${formatDateToDDMMYYYY(
        date1
      )}_to_${formatDateToDDMMYYYY(date2)}.pdf`
    );
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
              Add sale
            </label>
            <NavLink
              className="w-btn d-flex "
              style={{ textDecoration: "none" }}
              to="add-stock"
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
            <span className="f-info-text w10">
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
              Chalan.No
              <span
                className="px5 f-color-icon"
                type="button"
                onClick={() => handleSort("rctno")}
              >
                {sortKey === "rctno" ? (
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
              Party Code
              <span
                className="px5 f-color-icon"
                type="button"
                onClick={() => handleSort("rctno")}
              >
                {sortKey === "rctno" ? (
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
            <span className="f-info-text w25">
              Party Name
              <span
                className="px5 f-color-icon"
                type="button"
                onClick={() => handleSort("rctno")}
              >
                {sortKey === "rctno" ? (
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
            <span className="f-info-text w5">
              Qty
              <span
                className="px5 f-color-icon"
                type="button"
                onClick={() => handleSort("TotalQty")}
              >
                {sortKey === "TotalQty" ? (
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
                <span className="f-info-text w15">CreatedBy</span>
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
                    className={`data-values-div w100 h10 d-flex forDWidth center t-center sa ${
                      index % 2 === 0 ? "bg-light" : "bg-dark"
                    }`}
                    style={{
                      backgroundColor: index % 2 === 0 ? "#faefe3" : "#fff",
                    }}
                  >
                    {/* <span className="text w5">{index + 1}</span> */}
                    <span className="text w10">
                      {formatDateToDDMMYYYY(item.saledate)}
                    </span>
                    <span className="text w15">{item.rctno}</span>
                    <span className="text w15">{item.to_user}</span>
                    <span className="text w25">
                      {findEmpName(item.to_user, item.deliver_to)}
                    </span>
                    <span className="text w5">{item.TotalQty}</span>

                    <span className="text w10 d-flex j-center a-center">
                      <button
                        style={{ cursor: "pointer" }}
                        className="px5 "
                        onClick={() => handleEditClick(item.billno)}
                      >
                        {t("ps-view")}
                      </button>
                      {/* <MdDeleteOutline
                        onClick={() => handleDelete(item.billno)}
                        size={17}
                        className="table-icon"
                        style={{ color: "red" }}
                      /> */}
                    </span>
                    {userRole === "salesman" ? (
                      <></>
                    ) : (
                      <>
                        <span className="text w15">
                          {item.saleby || "Unknown"}
                        </span>
                      </>
                    )}
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
      {isModalOpen && updatelist.length > 0 && (
        <div className="pramod modal">
          <div className="modal-content">
            <div className="d-flex sb deal-info">
              <label className="heading"> Bill Details</label>
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
                Rect. No :{" "}
                <span className="info-text">{updatelist[0]?.rctno || ""}</span>
              </label>
              <div className="10">
                <label className="label-text">
                  {t("ps-date")} :{" "}
                  <span className="info-text">
                    {formatDateToDDMMYYYY(updatelist[0]?.saledate)}
                  </span>
                </label>
              </div>
            </div>
            <div className=" d-flex sb mx15 px15 deal-info-name">
              <label className="lable-text">
                Emp code :{" "}
                <span className="info-text">
                  {updatelist[0]?.to_user || ""}
                </span>
              </label>
              <label className="label-text">
                Emp Name :{" "}
                <span className="info-text">
                  {findEmpName(updatelist[0]?.to_user) || ""}
                </span>
              </label>
            </div>
            <div className="modal-content w100  ">
              <div className="sales-table-container w100">
                <table className="sales-table w100 ">
                  <thead className="bg1">
                    <tr>
                      <th>{t("ps-srNo")}</th>
                      <th>{t("ps-itm-name")}</th>
                      <th>{t("ps-qty")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {updatelist.map((item, i) => (
                      <tr key={i}>
                        <td>{i + 1}</td>
                        <td>{item.ItemName}</td>

                        <td className="w15">
                          <input
                            name="qty"
                            type="number"
                            value={item.Qty}
                            onFocus={handleFocus}
                            onChange={(e) =>
                              handleItemChange(i, "qty", e.target.value)
                            }
                          />
                        </td>
                      </tr>
                    ))}
                    <tr>
                      <td></td>
                      <td>
                        <b>{t("ps-ttl-amt")}</b>
                      </td>
                      <td>
                        {(updatelist || []).reduce(
                          (acc, item) => acc + (item.Qty || 0),
                          0
                        )}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className="d-flex my5 j-end">
              {/* <button className="btn" onClick={handleUpdate}>
                {t("ps-update")}
              </button> */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListDeliveryStock;
