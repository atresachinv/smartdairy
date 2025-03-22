import React from "react";
import "../../../../../Styles/DeductionReport/DeductionRateDetails.css";

const DeductionRateDetails = () => {
  return (
    <>
      <div className="deduction-details-report-container w100 h1 d-flex-col bg ">
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
          <div className="deduction-code-and-date w80 d-flex h30 a-center">
            <div className="deduction-code-div w40 d-flex h1 a-center">
              <span className="label-text w30 ">Code:</span>
              <input className="data w60" type="text" />
            </div>
            <div className="deduction-code-date-div w40 d-flex h1 a-center">
              <span className="label-text w30 ">Date:</span>
              <input className="data w50" type="date" />
            </div>
          </div>
          <div className="radio-buttonsdeductiona-deatilas w80 d-flex h20 a-center">
            <div className="as-per-liter-deduction-div w30 d-flex h1 a-center">
              <input className="w20" type="radio" />
              <span className="label-text">LiterWsie</span>
            </div>
            <div className="Pymentwise-deduction-div w30 d-flex h1 a-center">
              <input className="w20" type="radio" />
              <span className="label-text">PaymentWsie</span>
            </div>
            <div className="as-per-liter-deduction-div w30 d-flex h1 a-center">
              <input className="w20" type="radio" />
              <span className="label-text">GoodsSaleWsie</span>
            </div>
          </div>
          <div className="Rate-typecontainer-div w80 h20 d-flex a-center">
            <div className="One-rate-div w30 d-flex h1 a-center">
              <input className="w20" type="radio" />
              <span className="label-text">One Rate</span>
            </div>
            <div className="Round-AMount-div w30 d-flex h1 a-center">
              <input className="w20" type="radio" />
              <span className="label-text">+Round AMt</span>
            </div>
            <div className="deduction-rate-div w30 h1 d-flex a-center ">
              <span className="label-text w100"> Rate:</span>
              <input className="data w50" type="text" />
            </div>
          </div>
          <div className="Deduction-details-button w100 h20 d-flex a-center sa ">
            <button className="w-btn">ADD</button>
            <button className="w-btn">Update</button>
            <button className="w-btn">Delete</button>
            <button className="w-btn">Cancel</button>
          </div>
        </div>
        <div className="Deduction-details-table-container-div w100 h60 d-flex-col ">
          <div className="table-heading-deduction-details w100 d-flex h10 sa">
            <span className="label-text ">Deduction</span>
            <span className="label-text ">GL</span>
            <span className="label-text ">Rate</span>
            <span className="label-text ">Date</span>
            <span className="label-text ">Rate Type</span>
            <span className="label-text ">Rate Wise</span>
          </div>
          <div className="deduction-details-table-data-div w100 d-flex sa h90">
            <span className="label-text ">Deduction</span>
            <span className="label-text ">GL</span>
            <span className="label-text ">Rate</span>
            <span className="label-text ">Date</span>
            <span className="label-text ">Rate Type</span>
            <span className="label-text ">Rate Wise</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default DeductionRateDetails;
