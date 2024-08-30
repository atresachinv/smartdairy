import React from "react";

const CollectionReport = () => {
  
  return (
    <div className="coll-report-container w100 h1 d-flex-col p10 bg">
      <div className="menu-title-div w100 h10 d-flex p10">
        <h2 className="heading">Collection Report</h2>
      </div>
      <form action="#" className="custmize-report-div w100 h20 d-flex-col">
        <span className="heading px10">Custmize Report</span>
        <div className="time-selection w50 h40 d-flex a-center sa">
          <span className="text w30">Select Time</span>
          <div className="radio-select-div w15 d-flex  a-center se center">
            <input type="radio" name="M" id="" />
            <span className="text">Mrg</span>
          </div>
          <div className="radio-select-div w15 d-flex  a-center se center">
            <input type="radio" name="M" id="" />
            <span className="text">Eve</span>
          </div>
          <div className="radio-select-div w15 d-flex  a-center se center">
            <input type="radio" name="M" id="" />
            <span className="text">Both</span>
          </div>
        </div>
        <div className="date-selection-div w100 h40 d-flex j-center sa">
          <span className="text w20">Select Dates</span>
          <div className="radio-select-div w30 d-flex se center">
            <span className="text">From :</span>
            <input type="date" />
          </div>
          <div className="radio-select-div w30 d-flex se center">
            <span className="text">To :</span>
            <input type="date" />
          </div>
          <div className="show-report-btn w20 h1 d-flex center">
            <button type="">Show</button>
          </div>
        </div>
      </form>
      <div className="current-pay-milk-report w100 h70 d-flex-col">
        <div className="invice-title-div w100 h10 d-flex a-center">
          <span className="heading px10">Collection Details :</span>
        </div>

        <div className="report-of-collection-div w100 h90 d-flex-col">
          <div className="pay-title-div w100 h10 d-flex a-center sa">
            <div className="date-div w80 text d-flex">Date: from: - to: </div>
            <span className="w20 text d-flex j-center">SAVE PDF</span>
          </div>
          <div className="content-titles-div w100 h10 d-flex center t-center sa  px10">
            <span className="text w10">Date</span>
            <span className="text w5">M/E</span>
            <span className="text w5">C/B</span>
            <span className="text w10">Liters</span>
            <span className="text w5">FAT</span>
            <span className="text w5">SNF</span>
            <span className="text w10">Rate</span>
            <span className="text w15">Amount</span>
          </div>
          <div className="report-data-container w100 h90 d-flex-col">
            <div className="content-values-div w100 h10 d-flex center t-center sa px10">
              <span className="text w10">0</span>
              <span className="text w5">0</span>
              <span className="text w5">0</span>
              <span className="text w10">0</span>
              <span className="text w5">0</span>
              <span className="text w5">0</span>
              <span className="text w10">0</span>
              <span className="text w15">0</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollectionReport;
