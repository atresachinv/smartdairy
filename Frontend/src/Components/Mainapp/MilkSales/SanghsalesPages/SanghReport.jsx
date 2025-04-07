import React, { useState } from "react";
import "../../../../Styles/SanghReport/SanghReport.css";

const SanghReport = () => {

  return (
    <>
      <div className="sanghsale-report-container w100 h1 d-flex-col sa">
        <div className="sangha-sales-date-buttons-div w100 h20 d-flex bg ">
          <div className="sangha-from-to-datediv-container w50 h1  d-flex ">
            <div className="sanghaa-from-date-divv w50 h1 d-flex a-center ">
              <span className="label-text w30 px10">पासून</span>
              <input className="data w80" type="date" />
            </div>
            <div className="sanghaa-to-date-divv w50 h1 d-flex a-center ">
              <span className="label-text w30 px10">पर्येंत</span>
              <input className="data w80" type="date" />
            </div>
          </div>
          <div className="sangha-sales-buttons-div w50 h1  d-flex sa a-center">
            <button className="w-btn">शोधा</button>
            <button className="w-btn">नवीन</button>
            <button className="w-btn">काडून टाका </button>
            
          </div>
        </div>
        <div className="sangha-details-table-section w100 h70 d-flex-col bg">
          <div className="sangha-sale-table-header w100 h20 d-flex sa  ">
            <span className="label-text w10">बिल न</span>
            <span className="label-text w20">बिल दिनांक </span>
            <span className="label-text w20">संघाचे नाव</span>
            <span className="label-text w10">एकूण लिटर </span>
            <span className="label-text w10">एकूण रक्कम </span>
            <span className="label-text w15">पासून</span>
            <span className="label-text w15">पर्येंत </span>
          </div>
          <div className="sangha-tabledata-section-div w100 d-flex-col  mh90 hidescrollbar">
            <div className="datasanghasales-div w100 d-flex mh90 sa">
              <span className="label-text w10">001</span>
              <span className="label-text w20">03/02/2025 </span>
              <span className="label-text w20 ">HariomDSk </span>
              <span className="label-text w10">1230</span>
              <span className="label-text w10">125063</span>
              <span className="label-text w15">02/03/2025</span>
              <span className="label-text w15">25/04/2025</span>
            </div>
          </div>
        </div>


        <div className="daybook-progress-div w100 h15 d-flex">
          <div className="Daybook-button-div w30 h1 d-flex a-center">
            <button className="w-btn">Day Book</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SanghReport;
