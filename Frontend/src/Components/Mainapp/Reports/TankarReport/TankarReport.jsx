import React from "react";

const TankarReport = () => {
  return (
    <div classname="tankar-Report-outer-container w100 h1 d-flex-col">
      <span className="heading px10">Tankar Report</span>
      <div className="tankar-report-form-div w100 h30 d-flex-col">
        <div className="tankar-report-from-to-date-div w100 h1 d-flex">
          <div className="tankar-from-div w50 d-flex a-center">
            <span className="label-text w50">From</span>
            <input className="data w90" type="date" />
          </div>
          <div className="tankar-to-div w50 d-flex a-center">
            <span className="label-text w50">To</span>
            <input className="data w90" type="date" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TankarReport;
