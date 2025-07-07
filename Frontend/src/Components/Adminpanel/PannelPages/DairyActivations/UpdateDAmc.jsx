import React from "react";

const UpdateDAmc = () => {
  return (
    <div className="update-one-dairy-amc-container w100 h1 d-flex-col center">
      <span className="heading py10">Update Dairy AMC :</span>
      <div className="dairy-amc-update-container w70 h60 d-flex-col p10 bg">
        <div className="dairy-details-div w100 h10 d-flex a-center">
          <label htmlFor="" className="label-text w15">
            Select Dairy
          </label>
          <select className="w40 data" name="dairy_info" id="dairy_info">
            <option value={""}>dairy_info</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default UpdateDAmc;
