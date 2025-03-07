// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axiosInstance from "../../../../../../App/axiosInstance";
import { useTranslation } from "react-i18next";
import "./Stock.css";

// Function to get the current date
const getTodaysDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const startYear = today.getMonth() >= 3 ? year : year - 1;
  const start = `${startYear}-04-01`;
  return start;
};

const CreateStock = () => {
  const { t } = useTranslation(["puchasesale", "common"]);
  const [itemList, setItemList] = useState([]);
  const [date, setDate] = useState(getTodaysDate());
  const [filteredList, setFilteredList] = useState([]);
  const [formData, setFormData] = useState({
    itemcode: "",
    itemname: "",
    purchasedate: getTodaysDate(),
    qty: 0,
    itemgroupcode: 0,
    rate: 0,
    amount: 0,
    salerate: 0,
  });
  const [errors, setErrors] = useState({});

  // Fetch all items from API
  useEffect(() => {
    const fetchAllItems = async () => {
      try {
        const { data } = await axiosInstance.get("/item/all");
        setItemList(data.itemsData || []);
      } catch (error) {
        console.error("Failed to fetch items.", error);
      }
    };
    fetchAllItems();
  }, []);

  // Set today's date on mount
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      purchasedate: date,
    }));
  }, [date]);

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updatedData = { ...prev, [name]: value };

      if (name === "qty" || name === "rate") {
        const qty = parseFloat(updatedData.qty) || 0;
        const rate = parseFloat(updatedData.rate) || 0;
        updatedData.amount = qty * rate;
      }

      return updatedData;
    });
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach((field) => {
      if (!formData[field]) {
        newErrors[field] = "This field is required";
      }
    });
    return newErrors;
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      try {
        const res = await axiosInstance.post("/item/stock/new", formData);
        if (res?.data?.success) {
          toast.success(res.data?.message);
        }
        handleClear();
      } catch (error) {
        // console.error("Error creating product: ", error);
        toast.error("There was server error creating the product.");
      }
    }
  };

  // Handle enter key navigation
  const handleKeyDown = (e, fieldName) => {
    if (e.key === "Enter") {
      e.preventDefault();

      const formElements = document.querySelectorAll(".form-field");
      const currentIndex = [...formElements].findIndex(
        (el) => el.name === fieldName
      );
      if (currentIndex !== -1 && currentIndex < formElements.length - 1) {
        formElements[currentIndex + 1].focus();
      }
    }
  };

  // Handle clear
  const handleClear = () => {
    setFormData({
      itemcode: "",
      itemname: "",
      purchasedate: getTodaysDate(),
      qty: 0,
      itemgroupcode: 0,
      rate: 0,
      amount: 0,
      salerate: 0,
    });
    setErrors({});
  };

  // Filter items by item group
  useEffect(() => {
    if (formData.itemgroupcode) {
      const filteredItems = itemList.filter(
        (item) =>
          parseInt(item.ItemGroupCode) === parseInt(formData.itemgroupcode)
      );
      setFilteredList(filteredItems);
    } else {
      setFilteredList(itemList);
    }
  }, [formData.itemgroupcode, itemList]);

  // Update item name when itemcode changes
  useEffect(() => {
    if (formData.itemcode) {
      const selectedItem = itemList.find(
        (item) => item.ItemCode === parseInt(formData.itemcode)
      );
      setFormData((prev) => ({
        ...prev,
        itemname: selectedItem ? selectedItem.ItemName : "Unknown Item",
      }));
    }
  }, [formData.itemcode, itemList]);

  return (
    <div className="h1 w100 d-flex center startingStock">
      <div className="w50 h70 d-flex startingStockForm">
        <div className="bg p10 w100">
          <span className="heading "> {t("ps-startingStock")}</span>
          <form className="my10 " onSubmit={handleSubmit}>
            <div className="d-flex sb w100">
              <div className="col w45">
                <label className="info-text px10">
                  {t("ps-date")}: <span className="req">*</span>
                </label>
                <input
                  disabled
                  type="date"
                  name="purchasedate"
                  value={formData.purchasedate}
                  max={date}
                  className={`data form-field ${
                    errors.purchasedate ? "input-error" : ""
                  }`}
                  onChange={handleInputChange}
                />
              </div>
              <div className="col w45">
                <label className="info-text px10">
                  {t("ps-sel-grp")}: <span className="req">*</span>
                </label>
                <select
                  name="itemgroupcode"
                  value={formData.itemgroupcode}
                  className={`data form-field ${
                    errors.itemgroupcode ? "input-error" : ""
                  }`}
                  onChange={handleInputChange}
                  onKeyDown={(e) => handleKeyDown(e, "itemgroupcode")}
                >
                  <option value=""> {t("ps-sel-grp")} </option>
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
            </div>
            <div className="d-flex sb my10 w100">
              <div className="col  w45">
                <label className="info-text  ">
                  {t("ps-itm-name")}: <span className="req">*</span>
                </label>
                <select
                  name="itemcode"
                  value={formData.itemcode}
                  className={`data w100 form-field ${
                    errors.itemcode ? "input-error" : ""
                  }`}
                  onChange={handleInputChange}
                  onKeyDown={(e) => handleKeyDown(e, "itemcode")}
                  disabled={!formData.itemgroupcode}
                >
                  <option value=""> {t("ps-itm-name")}</option>
                  {filteredList &&
                    filteredList.map((item) => (
                      <option key={item.ItemCode} value={item.ItemCode}>
                        {item.ItemName}
                      </option>
                    ))}
                </select>
              </div>
              <div className="col  w45">
                <label className="info-text  ">
                  {t("ps-qty")}: <span className="req">*</span>
                </label>
                <input
                  name="qty"
                  type="number"
                  value={formData.qty}
                  onFocus={(e) => e.target.select()}
                  min={1}
                  className={`data form-field ${
                    errors.qty ? "input-error" : ""
                  }`}
                  onChange={handleInputChange}
                  onKeyDown={(e) => handleKeyDown(e, "qty")}
                  disabled={!formData.itemcode}
                />
              </div>
            </div>
            <div className=" d-flex sb my10 w100">
              <div className="col w45">
                <label className="info-text px10">
                  {t("ps-rate")}: <span className="req">*</span>
                </label>
                <input
                  name="rate"
                  type="number"
                  value={formData.rate}
                  onFocus={(e) => e.target.select()}
                  onKeyDown={(e) => handleKeyDown(e, "rate")}
                  className={`data w100 form-field ${
                    errors.rate ? "input-error" : ""
                  }`}
                  onChange={handleInputChange}
                  min={1}
                  disabled={!formData.itemcode}
                />
              </div>
              <div className="col w45">
                <label className="info-text px10">
                  {t("ps-sale-rate")}: <span className="req">*</span>
                </label>
                <input
                  name="salerate"
                  type="number"
                  value={formData.salerate}
                  onFocus={(e) => e.target.select()}
                  min={1}
                  className={`data form-field ${
                    errors.salerate ? "input-error" : ""
                  }`}
                  onChange={handleInputChange}
                  disabled={!formData.itemcode}
                />
              </div>
            </div>
            <div className=" d-flex j-end my10 wrap">
              <button className="btn" type="button" onClick={handleClear}>
                {t("ps-clr")}
              </button>
              <button className="btn mx10" type="submit">
                {t("ps-smt")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateStock;
