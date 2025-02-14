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

const ProductsList = () => {
  const [productList, setProductList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("1");

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

  return (
    <div className="product-list-container w100 h1 d-flex-col p10">
      <div className="download-print-pdf-excel-container w100 h10 d-flex sb">
        <span className="w30 prod-page-title heading px10">Products List</span>
        <div className="group-code-and-button-div w100 h1 d-flex sb">
          <div>
            <label htmlFor="seletgrop" className="mx5">
              Select Item Group:
            </label>
            <select
              name="ItemGroupCode"
              className="data form-field"
              onChange={handleFilterChange}
              value={filter}
            >
              <option value={1}>Cattle Feed</option>
              {[
                { value: 2, label: "Medicines" },
                { value: 3, label: "Grocery" },
                { value: 4, label: "Other" },
              ].map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>
          <button className="btn" onClick={downloadExcel}>
            <span className="f-label-text px10">Download</span>
            <FaDownload />
          </button>
        </div>
      </div>

      <div className="product-list-table w100 h90 d-flex-col bg">
        <div className="product-heading-title-scroller w100 h1 mh100 hidescrollbar d-flex-col br6">
          <div className="sales-data-headings-div p10 d-flex center sticky-top bg7 sa">
            <span className="f-info-text w5">Sr.No.</span>
            <span className="f-info-text w10">Code</span>
            <span className="f-info-text w25">Item Name</span>
            <span className="f-info-text w20">Description</span>
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
                <span className="info-text w5">{index + 1}</span>
                <span className="info-text w10">{product.ItemCode}</span>
                <span className="info-text w25 t-start">
                  {product.ItemName}
                </span>
                <span className="info-text w20 t-start">
                  {product.ItemDesc}
                </span>
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
        <div className="pramod modal">
          <div className="modal-content">
            <h2>Update Product Details</h2>
            <label>
              Item Name:
              <input
                type="text"
                value={editSale?.ItemName}
                onChange={(e) =>
                  setEditSale({ ...editSale, ItemName: e.target.value })
                }
              />
            </label>{" "}
            <label>
              Item Desc:
              <input
                type="text"
                value={editSale?.ItemDesc}
                onChange={(e) =>
                  setEditSale({ ...editSale, ItemDesc: e.target.value })
                }
              />
            </label>
            <div>
              <button onClick={() => setIsModalOpen(false)}>Cancel</button>
              <button onClick={handleSaveChanges}>Update</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsList;
