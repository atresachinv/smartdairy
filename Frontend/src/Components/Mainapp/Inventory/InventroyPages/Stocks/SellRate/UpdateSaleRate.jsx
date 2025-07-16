import "./SellRate.css";
import { toast } from "react-toastify";
import { FaRegEdit } from "react-icons/fa";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";
import axiosInstance from "../../../../../../App/axiosInstance";
import { useTranslation } from "react-i18next";
import "../../../../../../Styles/Mainapp/Inventory/InventoryPages/UpdateSellRate.css";

const UpdateSaleRate = () => {
  const { t } = useTranslation(["puchasesale", "common"]);
  const [purchaseList, setPurchaseList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filteredList, setFilteredList] = useState(purchaseList); // Store filtered items
  const [filteredList2, setFilteredList2] = useState(filteredList); // Store filtered items

  const [selectcode, setSelectcode] = useState("");
  const [itemcode, setItemcode] = useState("");

  const [date1, SetDate1] = useState("");
  const [date2, SetDate2] = useState("");

  const [editSale, setEditSale] = useState(null);
  const uniqueItems = new Set();

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
    SetDate1(getPreviousDate(30));
    SetDate2(getTodaysDate());
  }, []);

  // Fetch purchase list from API
  useEffect(() => {
    const fetchPurchaseList = async () => {
      if (!date1 || !date2) return; // Ensure dates are defined before making the request

      const getItem = { date1, date2 };

      try {
        const queryParams = new URLSearchParams(getItem).toString();
        const response = await axiosInstance.get(
          `/purchase/all?${queryParams}`
        );

        let purchase = response?.data?.purchaseData || [];
        purchase.sort(
          (a, b) => new Date(b.purchasedate) - new Date(a.purchasedate)
        );

        setPurchaseList(purchase);
      } catch (error) {
        toast.error("Error fetching purchase list.");
      }
    };

    fetchPurchaseList();
  }, [date1, date2]);

  // Handle view button click for purchase list
  const handleEditClick = (id) => {
    const filterList =
      purchaseList.find((item) => item.purchaseid === id) || [];
    setEditSale(filterList);
    setIsModalOpen(true);
  };

  const formatDateToDDMMYYYY = (dateStr) => {
    const date = new Date(dateStr); // Parse the ISO string
    const day = String(date.getDate()).padStart(2, "0"); // Ensures two digits for day
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Ensures two digits for month
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  useEffect(() => {
    if (selectcode) {
      // First filter by itemgroupcode
      const filteredItems = purchaseList.filter(
        (item) => item.itemgroupcode.toString() === selectcode
      );
      setFilteredList(filteredItems);
      setItemcode(""); // Reset itemcode when itemgroupcode changes
      setFilteredList2(filteredItems); // Initialize filteredList2 with filteredItems
    } else {
      setItemcode("");
      setFilteredList(purchaseList);
      setFilteredList2(purchaseList); // Reset both when no itemgroupcode is selected
    }
  }, [purchaseList, selectcode]);

  useEffect(() => {
    if (itemcode) {
      // Then filter by itemcode
      const filteredItems = filteredList.filter(
        (item) => item.itemcode.toString() === itemcode
      );
      setFilteredList2(filteredItems);
    } else {
      setFilteredList2(filteredList); // If no itemcode is selected, show all from selected group
    }
  }, [itemcode, filteredList]);

  // Function to handle the update action
  const handleUpdate = async () => {
    const result = await Swal.fire({
      title: "Confirm Updation?",
      text: "Are you sure you want to Update this Sale Rate?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Update it!",
    });

    if (result.isConfirmed) {
      try {
        const res = await axiosInstance.put("/purchase/update", {
          purchases: [editSale],
        });

        if (res?.data?.success) {
          toast.success("Purchase data updated successfully!");

          setPurchaseList((prevList) =>
            prevList.map((item) =>
              item.purchaseid === editSale.purchaseid
                ? { ...item, ...editSale }
                : item
            )
          );
          setFilteredList2((prevList) =>
            prevList.map((item) =>
              item.purchaseid === editSale.purchaseid
                ? { ...item, ...editSale }
                : item
            )
          );

          setIsModalOpen(false);
        } else {
          toast.error("Error updating purchase data.");
        }
      } catch (error) {
        toast.error("Error updating purchase data.");
      }
    }
  };

  return (
    <div className="update-prod-sell-rate-container w100 h1 d-flex-col sb p10">
      <span className="heading">उपडेट विक्री दर :</span>
      <div className="download-print-pdf-excel-container w100 h15 d-flex sb">
        <div className="select-dates-container w50 d-flex sa">
          <div className="dates-div w48 d-flex-col sb">
            <label htmlFor="" className="info-text">
              {t("ps-from")} :
            </label>
            <input
              type="date"
              className="data "
              value={date1}
              onChange={(e) => SetDate1(e.target.value)}
              max={date2}
            />
          </div>
          <div className="dates-div w48 d-flex-col sb">
            <label className="info-text" htmlFor="">
              {t("ps-to")} :
            </label>
            <input
              type="date"
              name="date"
              className="data"
              value={date2}
              onChange={(e) => SetDate2(e.target.value)}
              min={date1}
            />
          </div>
        </div>
        <div className="select-group-prod-container w45 d-flex sa">
          <div className="group-div w50 d-flex-col sb">
            <label className="info-text w100" htmlFor="itemGroupCode">
              {t("ps-sel-grp")}:
            </label>
            <select
              id="itemGroupCode"
              name="ItemGroupCode"
              className="data"
              onChange={(e) => setSelectcode(e.target.value)}
              value={selectcode}
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
          <div className="prod-name-div w45 d-flex-col sb">
            <label className="info-text w100" htmlFor="Itemname">
              {t("ps-itm-name")}:
            </label>
            <select
              id="Itemname"
              name="Itemname"
              className="data"
              onChange={(e) => setItemcode(e.target.value)}
              value={itemcode}
              disabled={!selectcode}
            >
              <option value=""> {t("ps-all")}</option>
              {filteredList.map((item) => {
                if (!uniqueItems.has(item.itemcode)) {
                  uniqueItems.add(item.itemcode);
                  return (
                    <option key={item.itemcode} value={item.itemcode}>
                      {item.itemname}
                    </option>
                  );
                }
                return null;
              })}
            </select>
          </div>
        </div>
      </div>
      <div className="update-product-list-container w100 h70 d-flex-col  bg">
        <span className="heading p10"> {t("ps-productList")}</span>
        <div className="update-prod-sell-rate-table w100 h1 mh100 hidescrollbar d-flex-col">
          <div className="data-headings-div py10 d-flex center t-center sb sticky-top bg7">
            <span className="f-info-text w15"> {t("ps-date")}</span>
            <span className="f-info-text w5"> {t("ps-rect-no")}</span>
            <span className="f-info-text w40"> {t("ps-itm-name")}</span>
            <span className="f-info-text w10">{t("ps-rate")}</span>
            <span className="f-info-text w10">{t("ps-sale-rate")}</span>
            <span className="f-info-text w10">{t("ps-qty")}</span>
            <span className="f-info-text w10">Actions</span>
          </div>
          {filteredList2.length > 0 ? (
            filteredList2.map((item, index) => (
              <div
                key={index}
                className={`data-headings-div w100 py10 d-flex center t-center py5 sa`}
                style={{
                  backgroundColor: index % 2 === 0 ? "#faefe3" : "#fff",
                }}
              >
                <span className="text w15">
                  {formatDateToDDMMYYYY(item.purchasedate)}
                </span>
                <span className="text w5">{item.receiptno}</span>
                <span className="text w40">{item.itemname}</span>
                <span className="text w10">{item.rate}</span>
                <span className="text w10">{item.salerate}</span>
                <span className="text w10">{item.qty}</span>
                <span className="text w10 d-flex j-center a-center">
                  <FaRegEdit
                    size={15}
                    className="table-icon"
                    onClick={() => handleEditClick(item.purchaseid)}
                  />
                </span>
              </div>
            ))
          ) : (
            <div className="w100 h1 d-flex center"> {t("ps-no-pur-foun")}</div>
          )}
        </div>
      </div>
      {isModalOpen && (
        <div className="updateSellModal">
          <div className="modal-content ">
            <h2 className="my10"> {t("ps-update-Product")}</h2>
            <b>
              <div className="d-flex w100 sb">
                <label className="info-text">
                  {" "}
                  {t("ps-itm-name")}: {editSale?.itemname}
                </label>
                <label className="info-text">
                  {" "}
                  {t("ps-rate")}: {editSale?.rate}
                </label>
                <label className="info-text">
                  {" "}
                  {t("ps-qty")}: {editSale?.qty}
                </label>
              </div>
            </b>
            <label className="info-text">
              {t("ps-sale-rate")}:
              <input
                type="text"
                className="data"
                value={editSale?.salerate}
                onChange={(e) =>
                  setEditSale({ ...editSale, salerate: e.target.value })
                }
                onFocus={(e) => e.target.select()}
              />
            </label>
            <div>
              <button onClick={() => setIsModalOpen(false)}>
                {" "}
                {t("ps-cancel")}
              </button>
              <button onClick={handleUpdate}>{t("ps-update")}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UpdateSaleRate;
