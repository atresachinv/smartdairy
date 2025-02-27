import React, { useEffect, useState } from "react";
import axiosInstance from "../../../../../App/axiosInstance";
import { toast } from "react-toastify";
import "./Product.css";
import { useTranslation } from "react-i18next";

const CreateProducts = () => {
  const { t } = useTranslation(["puchasesale", "common"]);
  const [formData, setFormData] = useState({
    ItemCode: "",
    ItemName: "",
    marname: "",
    ItemGroupCode: "",
    UnitCode: "",
    ItemDesc: "",
    Manufacturer: "",
  });

  //hanlde on change data
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  //handle submit to create product
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    if (
      !formData.ItemName ||
      !formData.marname ||
      !formData.ItemGroupCode ||
      !formData.UnitCode
    ) {
      toast.error("Please fill all required filled to save new Product!");
      return;
    }
    if (
      formData.ItemName &&
      formData.marname &&
      formData.ItemGroupCode &&
      formData.UnitCode
    ) {
      try {
        console.log("Product Data Submitted: ", formData);
        const res = await axiosInstance.post("/item/new", formData);
        if (res?.data?.success) {
          toast.success("Product Created Successfully!");
          setFormData({
            ItemCode: formData.ItemCode + 1,
            ItemName: "",
            marname: "",
            ItemGroupCode: "",
            UnitCode: "",
            ItemDesc: "",
            Manufacturer: "",
          });
        }
      } catch (error) {
        // console.error("Error creating product: ", error);
        toast.error("There was an error server creating the product.");
      }
    }
  };
  //handle to down on enter key
  const handleKeyDown = (e, fieldName) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const formElements = Array.from(document.querySelectorAll(".form-field"));
      const currentIndex = formElements.findIndex(
        (el) => el.name === fieldName
      );
      if (currentIndex !== -1 && currentIndex < formElements.length - 1) {
        formElements[currentIndex + 1].focus();
      }
    }
  };

  //handle to clear
  const handleClear = () => {
    setFormData({
      ItemName: "",
      marname: "",
      ItemGroupCode: "",
      UnitCode: "",
      ItemDesc: "",
      Manufacturer: "",
    });
  };

  //get max Itemcode
  useEffect(() => {
    const fetchMaxItemCode = async () => {
      try {
        const res = await axiosInstance.get("/item/maxcode");

        if (res.data.success) {
          setFormData({
            ...formData,
            ItemCode: parseInt(res.data.maxItemCode) + 1,
          });
        }
      } catch (error) {
        console.error("Failed to fetch max item code:", error);
      }
    };

    fetchMaxItemCode();
  }, []);

  return (
    <div className="create-dealer-container w100 h1 d-flex-col p10 ">
      <span className="heading">{t("ps-nv-pro-add")}</span>
      <div className="create-dealer-inner-container w100 h1 d-flex-col center">
        <form
          onSubmit={handleSubmit}
          className="create-dealer-form-container w50 h90 d-flex-col p10 bg"
        >
          <div className="row d-flex my10">
            <div className="col">
              <label className="info-text px10">
                {t("ps-code")}
                <span className="req">*</span>
              </label>
              <input
                type="number"
                name="ItemCode"
                value={formData.ItemCode}
                onFocus={(e) => e.target.select()}
                className={`data form-field  `}
                onChange={handleInputChange}
                onKeyDown={(e) => handleKeyDown(e, "ItemCode")}
                placeholder="Item Code"
                required
              />
            </div>
            <div className="col">
              <label className="info-text px10">
                {t("ps-itm-name")} <span className="req">*</span>
              </label>
              <input
                type="text"
                name="ItemName"
                value={formData.ItemName}
                onFocus={(e) => e.target.select()}
                className={`data form-field `}
                onChange={handleInputChange}
                onKeyDown={(e) => handleKeyDown(e, "ItemName")}
                placeholder="Item Name"
                required
              />
            </div>
          </div>
          <div className="row d-flex my10">
            <div className="col">
              <label className="info-text px10">
                {t("ps-mar-name")}
                <span className="req">*</span>
              </label>
              <input
                type="text"
                name="marname"
                onFocus={(e) => e.target.select()}
                value={formData.marname}
                className={`data form-field `}
                onChange={handleInputChange}
                onKeyDown={(e) => handleKeyDown(e, "marname")}
                placeholder="Item Marathi Name"
                required
              />
            </div>
            <div className="col">
              <label className="info-text px10">
                {t("ps-sel-grp")} <span className="req">*</span>
              </label>
              <select
                name="ItemGroupCode"
                value={formData.ItemGroupCode}
                className={`data form-field `}
                onChange={handleInputChange}
                onKeyDown={(e) => handleKeyDown(e, "ItemGroupCode")}
                required
              >
                <option value="">------ Select ------- </option>
                {[
                  { value: 1, label: `${t("ps-nv-cattlefeed")}` },
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
          </div>
          <div className="row d-flex my10">
            <div className="col">
              <label className="info-text px10">
                Unit Code: <span className="req">*</span>
              </label>
              <select
                name="UnitCode"
                value={formData.UnitCode}
                className={`data form-field `}
                onChange={handleInputChange}
                onKeyDown={(e) => handleKeyDown(e, "UnitCode")}
                required
              >
                <option value="">-----Select Unit-----</option>
                {[
                  { value: "KG", label: "KG" },
                  { value: "QTY", label: "QTY" },
                  { value: "Others", label: "Others" },
                ].map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="col">
              <label className="info-text px10">{t("ps-desc")}</label>
              <input
                type="text"
                name="ItemDesc"
                value={formData.ItemDesc}
                onFocus={(e) => e.target.select()}
                className={`data form-field`}
                onChange={handleInputChange}
                onKeyDown={(e) => handleKeyDown(e, "ItemDesc")}
                placeholder="Item Description"
              />
            </div>
          </div>
          <div className="row d-flex my10">
            <div className="col">
              <label className="info-text px10">{t("ps-manuf")}</label>
              <input
                type="text"
                name="Manufacturer"
                value={formData.Manufacturer}
                onFocus={(e) => e.target.select()}
                className={`data form-field`}
                onChange={handleInputChange}
                onKeyDown={(e) => handleKeyDown(e, "Manufacturer")}
                placeholder="Manufacturer"
              />
            </div>
          </div>
          <div className="button-container d-flex a-center j-end my10">
            <button className="w-btn" type="button" onClick={handleClear}>
              {t("ps-cancel")}
            </button>
            <button className="w-btn mx10" type="submit">
              {t("ps-smt")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProducts;
