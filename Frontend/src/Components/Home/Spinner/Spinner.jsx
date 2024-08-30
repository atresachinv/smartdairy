import React from "react";
import "../../../Styles/Home/Spinner/Spinner.css";

const Spinner = () => {
  return (
    <div className="box d-flex center">
      <div class="spinner">
        <div class="rect1"></div>
        <div class="rect2"></div>
        <div class="rect3"></div>
        <div class="rect4"></div>
        <div class="rect5"></div>
      </div>
    </div>
  );
};

export default Spinner;
