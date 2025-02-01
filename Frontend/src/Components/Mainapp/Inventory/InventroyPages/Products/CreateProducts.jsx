import React, { useRef, useState } from "react";
import axiosInstance from "../../../../../App/axiosInstance";
import "../../../../../Styles/Mainapp/Inventory/InventoryPages/Products.css";
const CreateProducts = () => {
  const nameRef = useRef(null);
  const marathiNameRef = useRef(null);
  const groupCodeRef = useRef(null);
  const unitCodeRef = useRef(null);
  const itemDescRef = useRef(null);
  const manufacturerRef = useRef(null);

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
    const newErrors = validateForm();
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      try {
        console.log("Product Data Submitted: ", formData);
        const res = await axiosInstance.post("/item/new", formData); // Replace with your actual API URL
        alert(res?.data?.message);

        setFormData({
          ItemName: "",
          marname: "",
          ItemGroupCode: "",
          UnitCode: "",
          ItemDesc: "",
          Manufacturer: "",
        });
        alert("Product created successfully!");
      } catch (error) {
        console.error("Error creating product: ", error);
        alert("There was an error creating the product.");
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
    <div className="create-product-container w100 h1 d-flex j-center p10">
      <div className="create-product-inner-container w60 h70 bg p10">
        <span className="heading t-center">Create Product</span>
        <form onSubmit={handleSubmit} className="w100 d-flex-col sb">
          <div className="w100 row d-flex my10">
            <div className="col w50">
              <label className="info-text px10">
                Item Name: <span className="req">*</span>
              </label>
              <input
                ref={nameRef}
                type="text"
                name="ItemName"
                value={formData.ItemName}
                className={`data form-field ${
                  errors.ItemName ? "input-error" : ""
                }`}
                onChange={handleInputChange}
                onKeyDown={(e) => handleKeyDown(e, "ItemName")}
                placeholder="Item Name"
              />
            </div>
            <div className="col w50">
              <label className="info-text px10">
                Item Marathi Name: <span className="req">*</span>
              </label>
              <input
                ref={marathiNameRef}
                type="text"
                name="marname"
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
          <div className="w100 row d-flex my10">
            <div className="col w70">
              <label className="info-text px10">
                Item Group Name: <span className="req">*</span>
              </label>
              <select
                disabled={!formData.marname}
                ref={groupCodeRef}
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
            <div className="col w30">
              <label className="info-text px10">
                Unit Code: <span className="req">*</span>
              </label>
              <select
                ref={unitCodeRef}
                disabled={!formData.ItemGroupCode}
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
          <div className="row w100 d-flex my10">
            <div className="col w70">
              <label className="info-text px10">
                Item Description: <span className="req">*</span>
              </label>
              <input
                ref={itemDescRef}
                type="text"
                name="ItemDesc"
                value={formData.ItemDesc}
                className={`data form-field ${
                  errors.ItemDesc ? "input-error" : ""
                }`}
                disabled={!formData.UnitCode}
                onChange={handleInputChange}
                onKeyDown={(e) => handleKeyDown(e, "ItemDesc")}
                placeholder="Item Description"
              />
            </div>
            <div className="col w30">
              <label className="info-text px10">
                Manufacturer: <span className="req">*</span>
              </label>
              <input
                disabled={!formData.ItemDesc}
                ref={manufacturerRef}
                type="text"
                name="Manufacturer"
                value={formData.Manufacturer}
                className={`data form-field ${
                  errors.Manufacturer ? "input-error" : ""
                }`}
                onChange={handleInputChange}
                onKeyDown={(e) => handleKeyDown(e, "Manufacturer")}
                placeholder="Manufacturer"
              />
            </div>
          </div>
          <div className="but-row w100 d-flex a-center j-end my10">
            <button className="w-btn mx10" type="button" onClick={handleClear}>
              Clear
            </button>
            <button className="w-btn" type="submit">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProducts;
