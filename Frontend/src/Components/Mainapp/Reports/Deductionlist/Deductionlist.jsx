import React from "react";
import "../../../../Styles/Deductionlist/Deductionlist.css";

const Deductionlist = () => {
  return (
    <div className="deduction-list-container w100 h1 d-flex-col  bg ">
      <span className="heading px10">Deduction List</span>
      <div className="deduction-list-first-half-div w100 h30 d-flex-col sa ">
        <div className="select-deduction-report w100 h30 d-flex a-center px10">
          <span className="label-text w10">कपात निवडा:</span>
          <select className="data w50" name="kapat" id=""></select>
        </div>
        <div className="deduction-list-from-to-date-div w100 h30 a-center px10 d-flex">
          <div className="deduction-list-from-date w50 d-flex h1 a-center">
            <span className="label-text w20">दिनांकापासून:</span>
            <input className="data w40" type="date" />
          </div>
          <div className="deduction-list-to-date w50 d-flex h1 a-center">
            <span className="label-text w20">दिनांकापर्येंत:</span>
            <input className="data w40" type="date" />
          </div>
        </div>
        <div className="code-number-from-to-div-and-button-div w100 h30 d-flex px10 ">
          <div className="code-number-from-to-div w50 h1 d-flex">
            <div className="from-code-numbers-div w50 h1 d-flex a-center">
              <span className="label-heading w40">कोड.न.पासून</span>
              <input className="data w40" type="text" />
            </div>
            <div className="to-code-numbers-div w50 h1 d-flex a-center">
              <span className="label-heading w20">ते</span>
              <input className="data w30" type="text" />
            </div>
          </div>
          <div className="deduction-list-container-button d-flex sa w50 h1  ">
            <button className="w-btn">रिपोर्ट </button>
            <button className="w-btn">जमा नावे</button>
            <button className="w-btn">Print</button>
          </div>
        </div>
      </div>
      <div className="deduction-list-table w100 h70 d-flex-col ">
        <div className="deduction-heading-side-table w100 px10 sa d-flex">
          <span className="label-text">खाते क्र</span>
          <span className="label-text">उत्पादकचे नाव</span>
          <span className="label-text">लिटर</span>
          <span className="label-text">Bank Acc No</span>
          <span className="label-text">रक्कम</span>
        </div>
        <div className="deduction-list-table-data w100 mh90 hidescrollbar sa d-flex">
          <span className="label-text">001</span>
          <span className="label-text">yogesh shinde</span>
          <span className="label-text">100</span>
          <span className="label-text">3090033732</span>
          <span className="label-text">4000</span>
        </div>
      </div>
    </div>
  );
};

export default Deductionlist;
