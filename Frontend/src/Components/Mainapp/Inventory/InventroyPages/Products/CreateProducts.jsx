import React, { useState } from "react";
import axiosInstance from "../../../../../App/axiosInstance";
import { toast } from "react-toastify";
import "./Product.css";

const CreateProducts = () => {
  const [formData, setFormData] = useState({
    ItemName: "",
    marname: "",
    ItemGroupCode: "",
    UnitCode: "",
    ItemDesc: "",
    Manufacturer: "",
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach((field) => {
      if (!formData[field]) {
        newErrors[field] = "This field is required";
      }
    });
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      formData.ItemName ||
      formData.marname ||
      formData.ItemGroupCode ||
      formData.UnitCode
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
        const res = await axiosInstance.post("/item/new", formData); // Replace with your actual API URL

        setFormData({
          ItemName: "",
          marname: "",
          ItemGroupCode: "",
          UnitCode: "",
          ItemDesc: "",
          Manufacturer: "",
        });
        toast.success("Product created successfully!");
      } catch (error) {
        // console.error("Error creating product: ", error);
        toast.error("There was an error server creating the product.");
      }
    }
  };

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

  const handleClear = () => {
    setFormData({
      ItemName: "",
      marname: "",
      ItemGroupCode: "",
      UnitCode: "",
      ItemDesc: "",
      Manufacturer: "",
    });
    setErrors({});
  };

  return (
    <div className="create-dealer-container w100 h1 d-flex-col p10 ">
      <span className="heading">Create Product</span>
      <div className="create-dealer-inner-container w100 h1 d-flex-col center">
        <form
          onSubmit={handleSubmit}
          className="create-dealer-form-container w50 h70 d-flex-col p10 bg">
          <div className="row d-flex my10">
            <div className="col">
              <label className="info-text px10">
                Item Name: <span className="req">*</span>
              </label>
              <input
                type="text"
                name="ItemName"
                value={formData.ItemName}
                onFocus={(e) => e.target.select()}
                className={`data form-field ${
                  errors.ItemName ? "input-error" : ""
                }`}
                onChange={handleInputChange}
                onKeyDown={(e) => handleKeyDown(e, "ItemName")}
                placeholder="Item Name"
              />
            </div>
            <div className="col">
              <label className="info-text px10">
                Item Marathi Name: <span className="req">*</span>
              </label>
              <input
                type="text"
                name="marname"
                onFocus={(e) => e.target.select()}
                value={formData.marname}
                className={`data form-field ${
                  errors.marname ? "input-error" : ""
                }`}
                onChange={handleInputChange}
                onKeyDown={(e) => handleKeyDown(e, "marname")}
                placeholder="Item Marathi Name"
              />
            </div>
          </div>
          <div className="row d-flex my10">
            <div className="col">
              <label className="info-text px10">
                Item Group Name: <span className="req">*</span>
              </label>
              <select
                name="ItemGroupCode"
                value={formData.ItemGroupCode}
                className={`data form-field ${
                  errors.ItemGroupCode ? "input-error" : ""
                }`}
                onChange={handleInputChange}
                onKeyDown={(e) => handleKeyDown(e, "ItemGroupCode")}>
                <option value="">Item Group Name</option>
                {[
                  { value: 1, label: "Cattle Feed" },
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
            <div className="col">
              <label className="info-text px10">
                Unit Code: <span className="req">*</span>
              </label>
              <select
                name="UnitCode"
                value={formData.UnitCode}
                className={`data form-field ${
                  errors.UnitCode ? "input-error" : ""
                }`}
                onChange={handleInputChange}
                onKeyDown={(e) => handleKeyDown(e, "UnitCode")}>
                <option value="">Select Unit</option>
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
          </div>
          <div className="row d-flex my10">
            <div className="col">
              <label className="info-text px10">Item Description:</label>
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
            <div className="col">
              <label className="info-text px10">Manufacturer:</label>
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
              Clear
            </button>
            <button className="w-btn mx10" type="submit">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProducts;
