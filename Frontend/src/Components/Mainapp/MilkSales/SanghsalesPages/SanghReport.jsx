import React, { useState } from "react";
import "../../../../Styles/SanghReport/SanghReport.css";
import { FaEdit } from "react-icons/fa";
import Spinner from "../../../Home/Spinner/Spinner";
import { useDispatch, useSelector } from "react-redux";
import Sanghsales from "./Sanghsales";
import { fetchsanghaMilkColl } from "../../../../App/Features/Mainapp/Sangha/sanghaSlice";

const SanghReport = () => {
  const dispatch = useDispatch();
  const sanghaMilkColl = useSelector((state) => state.sangha.sanghamilkColl); // sangha milk collection
  const getstatus = useSelector((state) => state.sangha.fetchsmstatus); // fetch sangha milk collection status
  const [isModalOpen, setModalOpen] = useState(false);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const handleShowbtn = (e) => {
    e.preventDefault();
    dispatch(fetchsanghaMilkColl({ fromDate, toDate }));
  };
  // console.log("sanghaMilkColl", sanghaMilkColl);
  return (
    <div className="sanghsale-report-container w100 h1 d-flex-col p10 sb">
      <span className="heading mx10">संघ दुध विक्री रिपोर्ट :</span>
      <div className="sangha-sales-date-buttons-div w100 h15 d-flex bg-light-green br9">
        <div className="sangha-from-to-datediv-container w50 h1  d-flex ">
          <div className="sanghaa-from-date-divv w50 h1 d-flex a-center ">
            <span className="label-text w30 px10">पासून</span>
            <input
              className="data w80"
              type="date"
              onChange={(e) => setFromDate(e.target.value)}
            />
          </div>
          <div className="sanghaa-to-date-divv w50 h1 d-flex a-center ">
            <span className="label-text w30 px10">पर्येंत</span>
            <input
              className="data w80"
              type="date"
              onChange={(e) => setToDate(e.target.value)}
            />
          </div>
        </div>
        <div className="sangha-sales-buttons-div w50 h1  d-flex sa a-center">
          <button className="w-btn" type="button" onClick={handleShowbtn}>
            दाखवा
          </button>
          <button
            className="w-btn"
            type="button"
            onClick={() => setModalOpen(true)}
          >
            नवीन
          </button>
          <button className="w-btn">काडून टाका </button>
        </div>
      </div>
      <div className="sangha-details-table-section w100 h60 d-flex-col bg mh70 hidescrollbar">
        <div className="sangha-sale-report-table-header w100 h15 d-flex a-center t-center sb sticky-top">
          {/* <span className="f-label-text w5 t-center">बिल नं.</span> */}
          <span className="f-label-text w10 t-center">दिनांक </span>
          <span className="f-label-text w30">संघाचे नाव</span>
          <span className="f-label-text w10">चां. लिटर </span>
          <span className="f-label-text w10">क.प्र.लिटर</span>
          <span className="f-label-text w10">नाश लिटर</span>
          <span className="f-label-text w10">एकूण रक्कम </span>
          <span className="f-label-text w10">Action</span>
        </div>

        {getstatus === "loading" ? (
          <Spinner />
        ) : sanghaMilkColl.length > 0 ? (
          sanghaMilkColl.map((milk, index) => (
            <div
              key={index}
              className="sangha-report-tabledata-section-div w100 p10 d-flex a-center sb"
            >
              {/* <span className="text w5">001</span> */}
              <span className="text w10">{milk.colldate.slice(0, 10)}</span>
              <span className="text w30">{milk.sanghname}</span>
              <span className="text w10 t-end">{milk.liter}</span>
              <span className="text w10 t-end">{milk.kamiprat_ltr}</span>
              <span className="text w10 t-end">{milk.nash_ltr}</span>
              <span className="text w10 t-end">{milk.amt}</span>
              <span className="text w10 t-center">
                <FaEdit className="color-icon" />
              </span>
            </div>
          ))
        ) : (
          <div className="box d-flex center">
            <span className="label-text">Data Not Found!</span>
          </div>
        )}
      </div>

      <div className="daybook-progress-div w100 h10 d-flex">
        <div className="Daybook-button-div w30 h1 d-flex a-center">
          <button className="w-btn">Day Book</button>
        </div>
      </div>

      {isModalOpen && (
        <div className="model-container w100 d-flex center">
          <Sanghsales clsebtn={setModalOpen} isModalOpen={isModalOpen} />
        </div>
      )}
    </div>
  );
};

export default SanghReport;
