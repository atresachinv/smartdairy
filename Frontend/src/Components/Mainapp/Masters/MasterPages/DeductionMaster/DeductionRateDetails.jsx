import React from "react";
import "../../../../../Styles/DeductionReport/DeductionRateDetails.css";

const DeductionRateDetails = () => {
  return (
    <>
      <div className="deduction-details-report-container w100 h1 d-flex-col ">
        <span className="heading">Deduction Details</span>
        <div className="deduction-details-first-half-div w100 h40 d-flex-col ">
          <div className="deduction-name-div w100 d-flex h20 a-center ">
            <span className="label-text w15">Deduction Name:</span>
            <select
              className="smallselect-div w15 data"
              name="deduction-name"
              id="001"
            >
              <option value=""></option>
              <option value=""></option>
              <option value=""></option>
            </select>
            <select
              className="bigestdiv w35 data"
              name="deduction-name"
              id="001"
            >
              <option value=""></option>
              <option value=""></option>
              <option value=""></option>
            </select>

            <button className="w-btn w30 ">List</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default DeductionRateDetails;
