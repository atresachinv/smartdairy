/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { FaDownload } from "react-icons/fa6";
import axiosInstance from "../../../../../../App/axiosInstance";
import "./Stock.css";
import { MdAddShoppingCart, MdDeleteOutline } from "react-icons/md";
import { toast } from "react-toastify";
import { FaRegEdit } from "react-icons/fa";
import Swal from "sweetalert2";
import Spinner from "../../../../../Home/Spinner/Spinner";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";

const StockList = () => {
  const { t } = useTranslation(["puchasesale", "common"]);
  const [productList, setProductList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [filteredProducts, setFilterProducts] = useState([]);
  const [editSale, setEditSale] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  //open modal to edit product
  const handleEditClick = (id) => {
    setEditSale(id);
    setIsModalOpen(true);
  };

  //handle update product
  const handleSaveChanges = async () => {
    const result = await Swal.fire({
      title: "Confirm Updation?",
      text: "Are you sure you want to Update this Item?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Update it!",
    });

    if (result.isConfirmed) {
      const amt = parseFloat(editSale.ItemQty) * parseFloat(editSale.ItemRate);
      const updateItem = {
        ItemCode: editSale.ItemCode,
        ItemQty: editSale.ItemQty,
        ItemRate: editSale.ItemRate,
        SaleRate: editSale.SaleRate,
        Amount: amt,
      };

      try {
        const res = await axiosInstance.patch("/item/stock/update", updateItem);
        if (res?.data?.success) {
          toast.success(res?.data?.message);
          setProductList((prevCust) => {
            return prevCust.map((item) => {
              if (item.ItemCode === editSale.ItemCode) {
                return { ...item, ...editSale, Amount: amt };
              }
              return item;
            });
          });
          setIsModalOpen(false);
        }
      } catch (error) {
        toast.error("Error in update Item to server");
        // console.error("Error updating cust:", error);
      }
    }
  };

  //handle download excel
  const downloadExcel = () => {
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
      Qty: product.ItemQty,
      Rate: product.ItemRate,
      "Sale Rate": product.SaleRate,
      Amount: product.Amount,
    }));

    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Products");
    XLSX.writeFile(wb, "Stock_List.xlsx");
  };

  //getting all products
  useEffect(() => {
    const fetchProductList = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get("/item/stock/all");
        let products = response?.data?.data || [];
        // Sort products by ItemCode
        products.sort((a, b) => a.ItemCode - b.ItemCode);
        setProductList(products);
        setLoading(false);
      } catch (error) {
        // console.error("Error fetching product list: ", error);
        // toast.error("There was an error fetching the product list.");
        setLoading(false);
      }
    };
    fetchProductList();
  }, []);

  //handle delete ny its item code
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
        const res = await axiosInstance.post("/item/stock/delete", {
          ItemCode,
        });
        toast.success(res?.data?.message);
        setProductList((prevSales) =>
          prevSales.filter((product) => product.ItemCode !== ItemCode)
        );
      } catch (error) {
        toast.error("Error deleting sale item to server");
        // console.error("Error deleting sale item:", error);
      }
    }
  };
  //onchange event for filter
  useEffect(() => {
    if (filter) {
      const filteredProducts = productList.filter(
        (product) => parseInt(product.ItemGroupCode) === parseInt(filter)
      );
      setFilterProducts(filteredProducts);
    } else {
      setFilterProducts(productList);
    }
  }, [productList, filter]);

  return (
    <div className="product-list-container w100 h1 d-flex-col p10">
      <div className="download-print-pdf-excel-container w100 h30 d-flex j-center">
        <div className="sales-dates-container w100 h80 d-flex a-center sb sales-dates-container-mobile">
          <div className="d-flex sb w60 sales-dates-container-mobile-w100">
            <div>
              <label htmlFor="seletgrop" className="mx5">
                {t("ps-sel-grp")}:
              </label>
              <select
                name="ItemGroupCode"
                className="data form-field"
                onChange={(e) => setFilter(e.target.value)}
                value={filter}
              >
                <option value=""> {t("ps-all")} </option>
                {[
                  { value: 1, label: `${t("ps-cattle")}` },
                  { value: 2, label: `${t("ps-medicine")}` },
                  { value: 3, label: `${t("ps-grocery")}` },
                  { value: 4, label: `${t("ps-other")}` },
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
          </div>
          <div className="d-flex h1 sb center w25 sales-dates-container-mobile-w100  p10 bg">
            <label htmlFor="" className="label-text px5 ">
              {t("ps-newStock")}
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
      </div>

      <div className="product-list-table w100 h1 d-flex-col hidescrollbar bg ">
        <span className="heading p10"> {t("ps-stockReport")}</span>
        <div className="product-heading-title-scroller w100 h1 mh100 d-flex-col">
          <div className="data-headings-div h10 d-flex forWidth center t-center sa bg7">
            <span className="f-info-text w5"> {t("ps-srNo")}</span>
            <span className="f-info-text w5">{t("ps-code")}</span>
            <span className="f-info-text w15">{t("ps-itm-name")}</span>
            <span className="f-info-text w5">{t("ps-qty")}</span>
            <span className="f-info-text w5">{t("ps-rate")}</span>
            <span className="f-info-text w5">{t("ps-sale-rate")}</span>
            <span className="f-info-text w5">{t("ps-amt")}</span>
            <span className="f-info-text w5">Action</span>
          </div>
          {loading ? (
            <Spinner />
          ) : filteredProducts.length > 0 ? (
            filteredProducts.map((product, index) => (
              <div
                key={index}
                className={`data-values-div w100 h10 d-flex forWidth center t-center sa ${
                  index % 2 === 0 ? "bg-light" : "bg-dark"
                }`}
                style={{
                  backgroundColor: index % 2 === 0 ? "#faefe3" : "#fff",
                }}
              >
                <span className="text w5">{index + 1}</span>
                <span className="text w5">{product.ItemCode}</span>
                <span className="text w15 t-start">{product.ItemName}</span>
                <span className="text w5">{product.ItemQty}</span>
                <span className="text w5">{product.ItemRate}</span>
                <span className="text w5">{product.SaleRate}</span>
                <span className="text w5">{product.Amount}</span>
                <span className="text w5">
                  <FaRegEdit
                    size={15}
                    className="table-icon"
                    onClick={() => handleEditClick(product)}
                  />
                  <MdDeleteOutline
                    onClick={() => handleDelete(product.ItemCode)}
                    size={15}
                    className="table-icon "
                    style={{ color: "red" }}
                  />
                </span>
              </div>
            ))
          ) : (
            <div className="d-flex h1 center">{t("ps-ProductFound")}</div>
          )}
        </div>
      </div>
      {isModalOpen && (
        <div className="pramod modal">
          <div className="modal-content forMin">
            <h2>{t("ps-stockProductDetail")}</h2>
            <label>
              {t("ps-itm-name")}: {editSale?.ItemCode}&nbsp;{editSale?.ItemName}
            </label>
            <label>
              {t("ps-rate")}:
              <input
                type="text"
                value={editSale?.ItemRate}
                onChange={(e) =>
                  setEditSale({ ...editSale, ItemRate: e.target.value })
                }
                onFocus={(e) => e.target.select()}
              />
            </label>
            <label>
              {t("ps-qty")}:
              <input
                type="text"
                value={editSale?.ItemQty}
                onFocus={(e) => e.target.select()}
                onChange={(e) =>
                  setEditSale({ ...editSale, ItemQty: e.target.value })
                }
              />
            </label>{" "}
            <label>
              {t("ps-sale-rate")}:
              <input
                type="text"
                value={editSale?.SaleRate}
                onFocus={(e) => e.target.select()}
                onChange={(e) =>
                  setEditSale({ ...editSale, SaleRate: e.target.value })
                }
              />
            </label>
            <div>
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
  );
};

export default StockList;
