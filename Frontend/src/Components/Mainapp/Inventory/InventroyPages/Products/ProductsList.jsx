/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import Spinner from "../../../../Home/Spinner/Spinner";
import { useTranslation } from "react-i18next";
import { FaDownload } from "react-icons/fa6";
import axiosInstance from "../../../../../App/axiosInstance";
import "./Product.css";
import { MdDeleteOutline } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { jsPDF } from "jspdf";
import { useSelector } from "react-redux";
import { TbSortAscending2, TbSortDescending2 } from "react-icons/tb";

const ProductsList = () => {
  const { t } = useTranslation(["puchasesale", "common"]);
  const [productList, setProductList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("1");

  const [editSale, setEditSale] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dairyInfo = useSelector(
    (state) =>
      state.dairy.dairyData.marathi_name ||
      state.dairy.dairyData.SocietyName ||
      state.dairy.dairyData.center_name
  );
  //open modal to edit product
  const handleEditClick = (id) => {
    setEditSale(id);
    setIsModalOpen(true);
  };

  const [sortOrder, setSortOrder] = useState("desc");
  const [sortKey, setSortKey] = useState("");

  //handle update product
  const handleSaveChanges = async () => {
    const result = await Swal.fire({
      title: "Confirm Updation?",
      text: "Are you sure you want to Update this Product?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Update it!",
    });
    if (result.isConfirmed) {
      const updateItem = {
        ItemCode: editSale.ItemCode,
        ItemName: editSale.ItemName,
        ItemDesc: editSale.ItemDesc,
      };
      if (productList) {
        const FoundItem = productList.filter(
          (item) =>
            item.id !== editSale.id &&
            (item.ItemName.toLowerCase().trim() ===
              updateItem.ItemName.toLowerCase().trim() ||
              item.marname.toLowerCase().trim() ===
                updateItem.ItemName.toLowerCase().trim())
        );

        if (FoundItem.length > 0) {
          toast.error("Product Name already exists!");
          return;
        }
      }
      try {
        const res = await axiosInstance.put("/item/update", updateItem);
        if (res?.data?.success) {
          toast.success(res?.data?.message);
          setProductList((prevCust) => {
            return prevCust.map((item) => {
              if (item.ItemCode === editSale.ItemCode) {
                return { ...item, ...editSale };
              }
              return item;
            });
          });
          setIsModalOpen(false);
        }
      } catch (error) {
        toast.error("error in update product to server");
        // console.error("Error updating cust:", error);
      }
    }
  };

  //handle download excel
  const downloadExcel = () => {
    if (productList.length === 0) {
      toast.warn("No Products to Download");
      return;
    }
    // Filter products based on the selected ItemGroupCode
    const filteredProducts = filter
      ? productList.filter(
          (product) => product.ItemGroupCode === parseInt(filter)
        )
      : productList; // If no filter, export all products

    // Prepare data for export with only displayed columns
    const dataToExport = filteredProducts.map((product, index) => ({
      "Sr. No.": index + 1,
      "Item Code": product.ItemCode,
      "Item Name": product.ItemName,
      Description: product.ItemDesc,
    }));

    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Products");
    XLSX.writeFile(wb, "Products_List.xlsx");
  };

  //onchange event for filter
  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };
  //getting all products
  useEffect(() => {
    const fetchProductList = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get("/item/all", {
          params: { ItemGroupCode: filter },
        });
        let products = response?.data?.itemsData || [];
        // Sort products by ItemCode
        products.sort((a, b) => a.ItemCode - b.ItemCode);
        setProductList(products);
        setLoading(false);
      } catch (error) {
        // console.error("Error fetching product list: ", error);
        // toast.error("Error fetching Product list.");
        setProductList([]);
        setLoading(false);
      }
    };
    fetchProductList();
  }, [filter]);

  //handle delete
  const handleDelete = async (ItemCode) => {
    const result = await Swal.fire({
      title: "Confirm Deletion?",
      text: "Are you sure you want to delete this Product?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        // console.log("saleid", id);
        const res = await axiosInstance.post("/item/delete", { ItemCode });
        toast.success(res?.data?.message);

        setProductList((item) =>
          item.filter((product) => product.ItemCode !== ItemCode)
        );
      } catch (error) {
        console.error("Error deleting sale item:", error);
      }
    }
  };

  //download PDF
  const downloadPdf = () => {
    if (productList.length === 0) {
      toast.warn("No data available to export.");
      return;
    }

    const doc = new jsPDF();
    const getCategoryName = (groupCode) => {
      switch (groupCode) {
        case 1:
          return "Cattle Feed";
        case 2:
          return "Medicines";
        case 3:
          return "Grocery";
        case 4:
          return "Other";
        default:
          return "Unknown";
      }
    };
    // Define columns and rows
    const columns = ["Sr.No", "Code", "Product Name", "Group", "Description"];
    const rows = productList.map((item, index) => [
      index + 1,
      item.ItemCode,
      item.ItemName,
      getCategoryName(item.ItemGroupCode),
      item.ItemDesc,
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
    const invoiceInfo = doc.getTextWidth("Product-Info");
    doc.text("Product-Info", (pageWidth - invoiceInfo) / 2, margin + 25);
    const gepInfo = doc.getTextWidth("Product List Report");
    doc.text("Product List Report", (pageWidth - gepInfo) / 2, margin + 35);
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
    doc.save(`Product_list_Report.pdf`);
  };

  //sort
  const handleSort = (key) => {
    const sortedList = [...productList].sort((a, b) => {
      if (sortOrder === "asc") {
        return a[key] > b[key] ? 1 : -1;
      } else {
        return a[key] < b[key] ? 1 : -1;
      }
    });

    setProductList(sortedList);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    setSortKey(key); // Update the sorted column
  };

  return (
    <div className="product-list-container w100 h1 d-flex-col p10">
      <div className="download-print-pdf-excel-container w100 h10 d-flex sb">
        <span className="w30 prod-page-title heading px10">
          {t("ps-nv-pro-list")}
        </span>
        <div className="group-code-and-button-div w100 h1  d-flex sb">
          <div className="d-flex w40 a-center">
            <label htmlFor="seletgrop" className="w30">
              {t("ps-sel-grp")}
            </label>
            <select
              name="ItemGroupCode"
              className="data w70 form-field"
              onChange={handleFilterChange}
              value={filter}
            >
              <option value={1}> {t("ps-nv-cattlefeed")}</option>
              {[
                { value: 2, label: `${t("ps-nv-medicines")}` },
                { value: 3, label: `${t("ps-nv-grocery")}` },
                { value: 4, label: `${t("ps-nv-other")}` },
              ].map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>
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
            <span className="f-label-text px10">PDF</span>
            <FaDownload />
          </button>
        </div>
      </div>

      <div className="product-list-table w100 h90 d-flex-col bg">
        <div className="product-heading-title-scroller w100 h1 mh100 hidescrollbar d-flex-col br6">
          <div className="sales-data-headings-div p10 d-flex center sticky-top bg7 sa">
            {/* <span className="f-info-text w5">{t("ps-srNo")}</span> */}
            <span className="f-info-text w15">
              {t("ps-code")}
              <span
                className="px10 f-color-icon"
                type="button"
                onClick={() => handleSort("ItemCode")}
              >
                {sortKey === "ItemCode" ? (
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
              English Name
              <span
                className="px10 f-color-icon"
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
            </span>{" "}
            <span className="f-info-text w30">
              Marathi Name
              <span
                className="px10 f-color-icon"
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
            {/* <span className="f-info-text w20">{t("ps-desc")}</span> */}
            <span className="f-info-text w10">Action</span>
          </div>
          {loading ? (
            <Spinner />
          ) : productList.length > 0 ? (
            productList.map((product, index) => (
              <div
                key={index}
                className={`sales-data-values-div w100 p10 d-flex center t-center sa ${
                  index % 2 === 0 ? "bg-light" : "bg-dark"
                }`}
                style={{
                  backgroundColor: index % 2 === 0 ? "#faefe3" : "#fff",
                }}
              >
                {/* <span className="info-text w5">{index + 1}</span> */}
                <span className="info-text w15">{product.ItemCode}</span>
                <span className="info-text w30 t-start">
                  {product.ItemName}
                </span>
                <span className="info-text w30 t-start">{product.marname}</span>
                {/* <span className="info-text w20 t-start">
                  {product.ItemDesc}
                </span> */}
                <span className="info-text w10 d-flex sa">
                  <FaRegEdit
                    size={18}
                    className="table-icon"
                    onClick={() => handleEditClick(product)}
                  />
                  <MdDeleteOutline
                    onClick={() => handleDelete(product.ItemCode)}
                    size={20}
                    className="table-icon"
                    style={{ color: "red" }}
                  />
                </span>
              </div>
            ))
          ) : (
            <div className="w100 h1 d-flex center">No product found</div>
          )}
        </div>
      </div>
      {isModalOpen && (
        <div className=" productModel">
          <div className="modal-content">
            <h2>{t("ps-up-pro-det")}</h2>
            <label className="info-text">
              {t("ps-itm-name")}
              <input
                type="text"
                className="data"
                value={editSale?.ItemName}
                onChange={(e) =>
                  setEditSale({ ...editSale, ItemName: e.target.value })
                }
                onFocus={(e) => e.target.select()}
              />
            </label>
            <label className="info-text">
              {t("ps-desc")}
              <input
                type="text"
                className="data"
                value={editSale?.ItemDesc}
                onFocus={(e) => e.target.select()}
                onChange={(e) =>
                  setEditSale({ ...editSale, ItemDesc: e.target.value })
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

export default ProductsList;
