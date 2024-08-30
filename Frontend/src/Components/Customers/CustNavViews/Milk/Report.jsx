import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchMilkReports,
  savePDF,
  clearMilkReportState,
} from "../../../../App/Features/Customers/Milk/milkSlice";
import "../../../../Styles/Customer/CustNavViews/Milk/Milk.css";
import Spinner from "../../../Home/Spinner/Spinner";

const MilkReport = () => {
  const dispatch = useDispatch();

  const {
    records,
    summary,
    toDate: storedToDate,
  } = useSelector((state) => state.milk.milkReport);
  const loading = useSelector((state) => state.milk.loading);
  const error = useSelector((state) => state.milk.error);
  const fDate = useSelector((state) => state.date.formDate);
  const tDate = useSelector((state) => state.date.toDate);

  const fromDate = fDate + "T18:30:00.000Z";
  const toDate = tDate + "T18:30:00.000Z";

  useEffect(() => {
    // Clear milk report state when the component mounts
    dispatch(clearMilkReportState());

    if (toDate !== storedToDate || records.length === 0) {
      dispatch(fetchMilkReports({ fromDate, toDate }));
    }

    // Fetch the milk report for the current date range
    // dispatch(fetchMilkReports({ fromDate, toDate }));
  }, [dispatch, fromDate, toDate]);

  const handleSavePDF = () => {
    dispatch(
      savePDF({ fromDate: fDate, toDate: tDate, milkReport: records, summary })
    );
  };

  if (loading) {
    return <Spinner />;
  }
  if (error) {
    return <div>Error: {error.message || error}</div>;
  }

  return (
    <div className="cust-milk-col-report w100 h1 d-flex-col bg">
      <div className="menu-title-div w100 h10 d-flex p10">
        <h2 className="heading">Current Payment Milk Collection</h2>
      </div>
      <div className="current-pay-milk-report w100 h90 d-flex-col">
        <div className="pay-title-div w100 d-flex a-center sa px10">
          <div className="date-div w80 text d-flex">
            Date: from: {fDate} - to: {tDate}
          </div>
          <button
            className="save-btn-btn w10 text d-flex j-center"
            onClick={handleSavePDF}>
            SAVE PDF
          </button>
        </div>
        <div className="invoice-of-collection-div w100 h90 d-flex-col">
          <div className="invoice-title-div w100 h10 d-flex a-center">
            <span className="heading">Collection Details :</span>
          </div>
          <div className="content-titles-div w100 h10 d-flex center t-center sa px10">
            <span className="text w10">Date</span>
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
                  <span className="text w10">
                    {new Date(report.ReceiptDate).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "2-digit",
                    })}
                  </span>
                  <span className="text w5">{report.ME}</span>
                  <span className="text w5">{report.CB}</span>
                  <span className="text w10">{report.Litres}</span>
                  <span className="text w5">{report.fat}</span>
                  <span className="text w5">{report.snf}</span>
                  <span className="text w10">{report.Rate}</span>
                  <span className="text w15">{report.Amt}</span>
                </div>
              ))
            ) : (
              <div className="box d-flex center subheading">
                No data available
              </div>
            )}
          </div>
          <div className="content-titles-div w100 h10 d-flex center t-center sa px10">
            <span className="text w10">Total : </span>
            <span className="text w5"></span>
            <span className="text w5"></span>
            <span className="text w10">{summary.totalLiters}</span>
            <span className="text w5">{summary.avgFat}</span>
            <span className="text w5">{summary.avgSNF}</span>
            <span className="text w10">{summary.avgRate}</span>
            <span className="text w15">{summary.totalAmount}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MilkReport;
