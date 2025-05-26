import React, { useState } from "react";

const UpdateAllAmc = () => {
  const [formData, setFormData] = useState({
    type: "rs", // default selected option
    amount: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdate = (e) => {
    e.preventDefault();

    // Example: You can send `formData` to the backend here
    console.log("Updating AMC for all dairies with data:", formData);

    // Reset form if needed
    setFormData({ type: "rs", amount: "" });
  };

  return (
    <div className="update-all-amc-container w100 h1 d-flex-col center">
      <form
        onSubmit={handleUpdate}
        className="dairy-amc-update-container w50 h40 d-flex-col p10 bg"
      >
        <span className="heading py10 t-center">
          Update Annual Maintenance Charge (AMC) For All Dairies
        </span>

        <div className="dairy-details-div w100 h25 d-flex a-center">
          <label htmlFor="type" className="label-text w50">
            Select Type (Inc / Dec) :
          </label>
          <select
            className="w20 data mx10"
            name="type"
            id="type"
            value={formData.type}
            onChange={handleChange}
          >
            <option value="rs">RS</option>
            <option value="%">%</option>
          </select>
        </div>

        <div className="dairy-details-div w100 h25 d-flex a-center">
          <label htmlFor="amount" className="label-text w50">
            Amount (Rs / %) :
          </label>
          <input
            className="data w20 mx10"
            type="number"
            name="amount"
            id="amount"
            placeholder="0.0"
            value={formData.amount}
            onChange={handleChange}
            required
          />
        </div>

        <div className="button-div w100 h25 d-flex center">
          <button type="submit" className="w-btn">
            Update
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateAllAmc;
