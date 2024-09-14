import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMasterReports } from "../../../../App/Features/Customers/Milk/milkMasterSlice";
import Spinner from "../../../Home/Spinner/Spinner";
import { BsCalendar3 } from "react-icons/bs";
import "../../../../Styles/Customer/CustNavViews/Milk/Milk.css";

const CollectionReport = () => {
  const dispatch = useDispatch();
  const master = useSelector((state) => state.masterdates.masterlist);
  const records = useSelector((state) => state.mMilk.mrecords);
  const summary = useSelector((state) => state.mMilk.msummary);
  const status = useSelector((state) => state.mMilk.status);
  const [selectedPeriod, setSelectedPeriod] = useState(null);

  const handleSelectChange = (e) => {
    const selectedIndex = e.target.value;
    if (selectedIndex !== "") {
      const selectedDates = master[selectedIndex];
      setSelectedPeriod(selectedDates);

      // Dispatch the action with the selected fromDate and toDate
      dispatch(
        getMasterReports({
          fromDate: selectedDates.fromDate,
          toDate: selectedDates.toDate,
        })
      );
    }
  };

  const safeToFixed = (value, decimals = 2) => {
    return value !== null && value !== undefined
      ? value.toFixed(decimals)
      : "0.00";
  };

  return (
    <div className="coll-report-container w100 h1 d-flex-col bg">
      <div className="menu-title-div w100 h10 d-flex p10">
        <h2 className="heading">Collection Report</h2>
      </div>
      <div className="custmize-report-div w100 h10 px10 d-flex a-center sb">
        <span className="cl-icon w10 h1 d-flex center">
          <BsCalendar3 />
        </span>
        <select
          className="custom-select text w80 h1 p10"
          onChange={handleSelectChange}>
          <option className="info-text">1 April 2024 - 31 March 2025</option>
          {master.map((dates, index) => (
            <option className="info-text" key={index} value={index}>
              {new Date(dates.fromDate).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short", // Abbreviated month format
                year: "numeric",
              })}{" "}
              To:{" "}
              {new Date(dates.toDate).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short", // Abbreviated month format
                year: "numeric",
              })}
            </option>
          ))}
        </select>
      </div>
      <div className="invoice-of-collection-div w100 h80 d-flex-col">
        <div className="content-titles-div w100 h10 d-flex center t-center sa px10">
          <span className="text w15">Date</span>
          <span className="text w5">M/E</span>
          <span className="text w5">C/B</span>
          <span className="text w10">Liters</span>
          <span className="text w5">FAT</span>
          <span className="text w5">SNF</span>
          <span className="text w10">Rate</span>
          <span className="text w15">Amount</span>
        </div>

        {status === "loading" ? (
          <div className="w100 h80 d-flex center">
            <Spinner />
          </div>
        ) : (
          <div className="report-data-container w100 h90 d-flex-col hidescrollbar">
            {Array.isArray(records) && records.length > 0 ? (
              records.map((report, index) => (
                <div
                  key={index}
                  className="content-values-div w100 h10 d-flex center t-center sa px10">
                  <span className="text w15">
                    {new Date(report.ReceiptDate).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "2-digit",
                    })}
                  </span>
                  <span className="text w5">{report.ME === 0 ? "M" : "E"}</span>
                  <span className="text w5">{report.CB === 0 ? "C" : "B"}</span>
                  <span className="text w10">
                    {safeToFixed(report.Litres, 1)}
                  </span>
                  <span className="text w5">{safeToFixed(report.fat, 1)}</span>
                  <span className="text w5">{safeToFixed(report.snf, 1)}</span>
                  <span className="text w10">
                    {safeToFixed(report.Rate, 1)}
                  </span>
                  <span className="text w15">{safeToFixed(report.Amt, 2)}</span>
                </div>
              ))
            ) : (
              <div className="box d-flex center subheading">
                No data available
              </div>
            )}
          </div>
        )}
        <div className="content-total-value-div w100 h10 d-flex center t-center sa px10">
          <span className="label-text w15">Total : </span>
          <span className="text w5"></span>
          <span className="text w5"></span>
          <span className="text w10">
            {safeToFixed(summary.totalLiters, 1)}
          </span>
          <span className="text w5">{safeToFixed(summary.avgFat, 1)}</span>
          <span className="text w5">{safeToFixed(summary.avgSNF, 1)}</span>
          <span className="text w10">{safeToFixed(summary.avgRate, 1)}</span>
          <span className="text w15">
            {safeToFixed(summary.totalAmount, 2)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CollectionReport;
