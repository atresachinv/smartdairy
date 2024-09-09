import React from "react";
import { useSelector } from "react-redux";
import "../../../../Styles/Customer/CustNavViews/Milk/Milk.css";
import Spinner from "../../../Home/Spinner/Spinner";

const MilkReport = () => {
  const records = useSelector((state) => state.milk.records);
  const summary = useSelector((state) => state.milk.summary);
  const status = useSelector((state) => state.milk.status);
  const error = useSelector((state) => state.milk.error);
  const fDate = useSelector((state) => state.date.formDate);
  const tDate = useSelector((state) => state.date.toDate);

  if (status === "loading") {
    return <Spinner />;
  }

  if (status === "failed") {
    return <div>Error: {error.message || error}</div>;
  }

  const safeToFixed = (value, decimals = 2) => {
    return value !== null && value !== undefined
      ? value.toFixed(decimals)
      : "0.00";
  };

  return (
    <div className="cust-milk-col-report w100 h1 d-flex-col bg">
      <div className="menu-title-div w100 h10 d-flex p10">
        <h2 className="heading">Current Payment Milk Collection</h2>
      </div>
      <div className="current-pay-milk-report w100 h90 d-flex-col">
        <div className="date-div w80 info-text d-flex px10">
          Date: from: {fDate} - to: {tDate}
        </div>
        <div className="invoice-of-collection-div w100 h1 d-flex-col">
          <div className="invoice-title-div w100 h10 d-flex a-center">
            <span className="heading px10">Collection Details :</span>
          </div>
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
          <div className="content-titles-div w100 h10 d-flex center t-center sa px10">
            <span className="text w15">Total : </span>
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
    </div>
  );
};

export default MilkReport;
