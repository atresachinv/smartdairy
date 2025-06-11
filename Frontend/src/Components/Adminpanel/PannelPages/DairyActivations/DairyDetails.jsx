import React from "react";

const DairyDetails = ({ clsebtn }) => {
  return (
    <div className="dairy-details-container w65 h80 d-flex-col bg-light-skyblue br9 p10">
      <div className="heading-and-close-btn-container w100 d-flex sb px10">
        <span className="heading">DairyDetails</span>
        <span
          type="button"
          className="heading span-btn"
          onClick={() => clsebtn(false)}
        >
          X
        </span>
      </div>
    </div>
  );
};

export default DairyDetails;
