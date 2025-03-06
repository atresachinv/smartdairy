/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import Spinner from "../../../../Home/Spinner/Spinner";
import * as XLSX from "xlsx";
import { FaDownload } from "react-icons/fa6";
import axiosInstance from "../../../../../App/axiosInstance";
import { MdDeleteOutline } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";
import { jsPDF } from "jspdf";
import { useSelector } from "react-redux";
import { TbSortAscending2, TbSortDescending2 } from "react-icons/tb";

const DealersList = () => {
  const { t } = useTranslation(["puchasesale", "common"]);
  const [dealerList, setDealerList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editSale, setEditSale] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState("desc");
  const [sortKey, setSortKey] = useState("");

  const dairyInfo = useSelector(
    (state) =>
      state.dairy.dairyData.marathi_name ||
      state.dairy.dairyData.SocietyName ||
      state.dairy.dairyData.center_name
  );
  //open to edit item
  const handleEditClick = (id) => {
    setEditSale(id);
    setIsModalOpen(true);
  };

  //update item
  const handleSaveChanges = async () => {
    const result = await Swal.fire({
      title: "Confirm Updation?",
      text: "Are you sure you want to Update this Dealer?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Update it!",
    });
    if (result.isConfirmed) {
      const updateCust = {
        id: editSale.id,
        cname: editSale.cname,
        Phone: editSale.Phone,
        City: editSale.City,
        cust_ifsc: editSale.cust_ifsc,
        dist: editSale.dist,
        cust_accno: editSale.cust_accno,
      };
      // console.log(updateCust);
      try {
        const res = await axiosInstance.patch("/update/dealer", updateCust);
        if (res?.data?.success) {
          toast.success("Dealers updated successfully");
          setDealerList((prevCust) => {
            return prevCust.map((item) => {
              if (item.id === editSale.id) {
                return { ...item, ...editSale };
              }
              return item;
            });
          });
          setIsModalOpen(false);
        }
      } catch (error) {
        toast.error("Dealers updated Error to server");
        // console.error("Error updating cust:", error);
      }
    }
  };

  //download excel file
  const downloadExcel = () => {
    if (dealerList.length === 0) {
      toast.warn("No data available to download.");
      return;
    }

    // Map dealerList to create a formatted array of objects
    const formattedData = dealerList.map((customer, index) => ({
      "Sr No": index + 1,
      Code: customer.srno,
      "Dealer Name": customer.cname,
      Mobile: customer.mobile || customer.Phone,
      City: customer.City,
      District: customer.dist,
      "Bank Name": customer.cust_bankname,
      "A/C No": customer.cust_accno,
      IFSC: customer.cust_ifsc,
    }));

    // Create a new worksheet and workbook
    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();

    // Append the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Dealers List");

    // Write the workbook and download it
    XLSX.writeFile(workbook, "Dealers_List.xlsx");
  };

  //fetch Dealer list through API
  useEffect(() => {
    const fetchDealerList = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.post("/dealer");
        let customers = response?.data?.customerList || [];
        // Sort customers by createdon in descending order (newest first)
        customers.sort((a, b) => new Date(b.createdon) - new Date(a.createdon));
        setDealerList(customers);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        // console.error("Error fetching dealer list: ", error);
        toast.error("There was an error fetching the dealer list.");
      }
    };
    fetchDealerList();
  }, []);

  //handle delete with api
  const handleDelete = async (cid) => {
    const result = await Swal.fire({
      title: "Confirm Deletion?",
      text: "Are you sure you want to delete this Dealer?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        // console.log("saleid", id);
        const res = await axiosInstance.post("/delete/customer", { cid }); // Replace with your actual API URL
        toast.success(res?.data?.message);

        setDealerList((prevSales) =>
          prevSales.filter((sale) => sale.cid !== cid)
        );
      } catch (error) {
        // console.error("Error deleting dealer:", error);
        toast.error("Error deleting  dealer to server");
      }
    }
  };

  // Handle Enter key press to move to the next field
  const handleKeyPress = (e, nextField) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (nextField) {
        nextField.focus();
      }
    }
  };
  //download PDF
  const downloadPdf = () => {
    if (dealerList.length === 0) {
      toast.warn("No data available to export.");
      return;
    }

    const doc = new jsPDF();

    // Define columns and rows
    const columns = [
      "Sr. No",
      "Code",
      "Dealer Name",
      "Phone No",
      "City",
      "Dist.",
      "Bank Name",
      "A/C No",
      "IFSC",
    ];
    const rows = dealerList.map((item, index) => [
      index + 1,
      item.srno,
      item.cname,
      item.Phone,
      item.City,
      item.dist,
      item.cust_bankname,
      item.cust_accno,
      item.cust_ifsc,
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
    const dairyName = dairyInfo;
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    const dairyTextWidth = doc.getTextWidth(dairyName);
    doc.text(dairyName, (pageWidth - dairyTextWidth) / 2, margin + 15);

    // Add "Sale-Info" heading with border
    doc.setFontSize(14);
    const invoiceInfo = doc.getTextWidth("Dealer-Info");
    doc.text("Dealer-Info", (pageWidth - invoiceInfo) / 2, margin + 25);
    const gepInfo = doc.getTextWidth("Dealerlist Report");
    doc.text("Dealerlist Report", (pageWidth - gepInfo) / 2, margin + 35);
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

    // Save the PDF
    doc.save(`Dealerlist_Report.pdf`);
  };

  //sort
  const sortDealers = (key) => {
    const sortedList = [...dealerList].sort((a, b) => {
      if (sortOrder === "asc") {
        return a[key] > b[key] ? 1 : -1;
      } else {
        return a[key] < b[key] ? 1 : -1;
      }
    });

    setDealerList(sortedList);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    setSortKey(key); // Update the sorted column
  };
  return (
    <div className="customer-list-container-div w100 h1 d-flex-col p10">
      <div className="download-print-pdf-excel-container w100 h10 d-flex sb">
        <span className="w30 prod-page-title heading px10">
          {t("ps-nv-dealer-list")}
        </span>
        <div className="group-code-and-button-div w100 h1 d-flex sb">
          <div></div>
          <button
            className="btn sales-dates-container-mobile-btn"
            onClick={downloadExcel}
          >
            <span className="f-label-text px10"> {t("ps-down-excel")}</span>
            <FaDownload />
          </button>
          <button
            className="btn sales-dates-container-mobile-btn"
            onClick={downloadPdf}
          >
            <span className="f-label-text px10"> PDF</span>
            <FaDownload />
          </button>
        </div>
      </div>
      <div className="customer-list-table w100 h1 d-flex-col bg">
        <div className="customer-heading-title-scroller w100 h1 mh100  hidescrollbar d-flex-col sticky-top">
          <div className="data-headings-div h10 d-flex center forDWidth t-center sb bg7">
            {/* <span className="f-info-text w5">{t("ps-srNo")}</span> */}
            <span className="f-info-text w10">
              {t("ps-code")}
              <span
                className="px10 f-color-icon"
                type="button"
                onClick={() => sortDealers("srno")}
              >
                {sortKey === "srno" ? (
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
              {t("ps-dealer-name")}
              <span
                className="px10 f-color-icon"
                type="button"
                onClick={() => sortDealers("cname")}
              >
                {sortKey === "cname" ? (
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
            <span className="f-info-text w15">{t("ps-mono")}</span>
            <span className="f-info-text w15">{t("ps-city")}</span>
            <span className="f-info-text w10">{t("ps-dist")}</span>
            {/* <span className="f-info-text w10">PinCode</span> */}
            <span className="f-info-text w15">{t("ps-bank-name")}</span>
            <span className="f-info-text w20">{t("ps-ac-no")}</span>
            <span className="f-info-text w10">{t("ps-ifsc")}</span>
            <span className="f-info-text w10">Actions</span>
          </div>
          {/* Show Spinner if loading, otherwise show the customer list */}
          {loading ? (
            <Spinner />
          ) : dealerList.length > 0 ? (
            dealerList.map((customer, index) => (
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
                <span className="text w10">{customer.srno}</span>
                <span className="text w25">{customer.cname}</span>
                <span className="text w15">{customer.Phone}</span>
                <span className="text w15">{customer.City}</span>
                <span className="text w10">{customer.dist}</span>
                {/* <span className="text w10">{customer.cust_pincode}</span> */}
                <span className="text w15">{customer.cust_bankname}</span>
                <span className="text w20">{customer.cust_accno}</span>
                <span className="text w10">{customer.cust_ifsc}</span>
                <span className="text w10">
                  <FaRegEdit
                    size={15}
                    className="table-icon"
                    onClick={() => handleEditClick(customer)}
                  />
                  <MdDeleteOutline
                    onClick={() => handleDelete(customer.cid)}
                    size={15}
                    className="table-icon "
                    style={{ color: "red" }}
                  />
                </span>
              </div>
            ))
          ) : (
            <div className="d-flex h1 center">No Dealer found</div>
          )}
        </div>
      </div>
      {isModalOpen && (
        <div className="pramod modal ">
          <div className="modal-content minSize">
            <h2>{t("ps-up-deal-detail")}</h2>

            <label>
              {t("ps-mono")}
              <input
                type="number"
                id="phono"
                value={editSale?.Phone}
                onFocus={(e) => e.target.select()}
                onChange={(e) =>
                  setEditSale({ ...editSale, Phone: e.target.value })
                }
                onKeyDown={(e) =>
                  handleKeyPress(e, document.getElementById("city"))
                }
              />
            </label>
            <div className="row d-flex my10">
              <label>
                {t("ps-city")}
                <input
                  type="text"
                  id="city"
                  value={editSale?.City}
                  onFocus={(e) => e.target.select()}
                  onChange={(e) =>
                    setEditSale({ ...editSale, City: e.target.value })
                  }
                  onKeyDown={(e) =>
                    handleKeyPress(e, document.getElementById("dist"))
                  }
                />
              </label>
              <label style={{ marginLeft: "10px" }}>
                {t("ps-dist")}
                <input
                  type="text"
                  id="dist"
                  onFocus={(e) => e.target.select()}
                  value={editSale?.dist}
                  onKeyDown={(e) =>
                    handleKeyPress(e, document.getElementById("ifsc"))
                  }
                  onChange={(e) =>
                    setEditSale({ ...editSale, dist: e.target.value })
                  }
                />
              </label>
            </div>
            <label>
              {t("ps-ifsc")}
              <input
                type="text"
                id="ifsc"
                value={editSale?.cust_ifsc}
                onFocus={(e) => e.target.select()}
                onKeyDown={(e) =>
                  handleKeyPress(e, document.getElementById("acno"))
                }
                onChange={(e) =>
                  setEditSale({ ...editSale, cust_ifsc: e.target.value })
                }
              />
            </label>
            <label>
              {t("ps-ac-no")}
              <input
                id="acno"
                type="number"
                value={editSale?.cust_accno}
                onFocus={(e) => e.target.select()}
                onChange={(e) =>
                  setEditSale({ ...editSale, cust_accno: e.target.value })
                }
              />
            </label>
            <div>
              <button onClick={() => setIsModalOpen(false)}>
                {t("ps-cancel")}
              </button>
              <button onClick={handleSaveChanges}> {t("ps-update")}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DealersList;
