import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BsCalendar3 } from "react-icons/bs";
import Spinner from "../../Home/Spinner/Spinner";
import { getMasterReports } from "../../../App/Features/Customers/Milk/milkMasterSlice";
import { getDeductionInfo } from "../../../App/Features/Deduction/deductionSlice";
import { getPurchaseBill } from "../../../App/Features/Purchase/purchaseSlice";

const CustPayment = () => {
  const dispatch = useDispatch();
  const master = useSelector((state) => state.masterdates.masterlist);
  const records = useSelector((state) => state.mMilk.mrecords);
  const summary = useSelector((state) => state.mMilk.msummary);
  const purchaseBill = useSelector((state) => state.purchase.purchaseBill);
  const deduction = useSelector((state) => state.deduction.deductionInfo);
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
        }),
        getPurchaseBill({
          formDate: selectedDates.fromDate,
          toDate: selectedDates.toDate,
        }),
        getDeductionInfo({
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
    <div className="payment-container w100 h1 d-flex-col">
      <div className="menu-title-div w70 h10 d-flex p10">
        <h2 className="heading">Payment Summary</h2>
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

      <div className="payment-details-container w100 h80 mh80 d-flex-col p10">
        {selectedPeriod == null ? (
          <div>No data available</div>
        ) : status === "loading" ? (
          <div className="w100 h80 d-flex center">
            <Spinner />
          </div>
        ) : (
        <div className="payment-details-div w100 d-flex-col p10">
          <div className="milk-summary-container w100 h1 d-flex-col bg py10 ">
            <span className="heading px10">Milk Collection :</span>
            <div className="invoice-of-collection-div w100 h90 d-flex-col">
              <div className="content-titles-div w100 d-flex center t-center sa p10">
                <span className="text w15">Date</span>
                <span className="text w5">M/E</span>
                <span className="text w5">C/B</span>
                <span className="text w10">Liters</span>
                <span className="text w5">FAT</span>
                <span className="text w5">SNF</span>
                <span className="text w10">Rate</span>
                <span className="text w15">Amount</span>
              </div>
              <div className="report-data-container w100 h90 mh90 d-flex-col hidescrollbar">
                {Array.isArray(records) && records.length > 0 ? (
                  records.map((report, index) => (
                    <div
                      key={index}
                      className="content-values-div w100 h10 d-flex center t-center sb">
                      <span className="text w15">
                        {new Date(report.ReceiptDate).toLocaleDateString(
                          "en-GB",
                          {
                            day: "2-digit",
                            month: "2-digit",
                            year: "2-digit",
                          }
                        )}
                      </span>
                      <span className="text w5">
                        {report.ME === 0 ? "M" : "E"}
                      </span>
                      <span className="text w5">
                        {report.CB === 0 ? "C" : "B"}
                      </span>
                      <span className="text w10">
                        {safeToFixed(report.Litres, 1)}
                      </span>
                      <span className="text w5">
                        {safeToFixed(report.fat, 1)}
                      </span>
                      <span className="text w5">
                        {safeToFixed(report.snf, 1)}
                      </span>
                      <span className="text w10">
                        {safeToFixed(report.Rate, 1)}
                      </span>
                      <span className="text w15">
                        {safeToFixed(report.Amt, 2)}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="box d-flex center subheading">
                    No data available
                  </div>
                )}
              </div>
              {/* <hr />
              <div className="content-total-value-div w100 h50 d-flex-col sb p10 ">
                <div className="total-value-div w100 h10 d-flex sb">
                  <span className="info-text w30">Total Liters :</span>
                  <span className="text w30 t-center">
                    {safeToFixed(summary.totalLiters, 1)}
                  </span>
                </div>
                <div className="total-value-div w100 h10 d-flex sb">
                  <span className="info-text w30">Avrage FAT : </span>
                  <span className="text w30 t-center">
                    {safeToFixed(summary.avgFat, 1)}
                  </span>
                </div>
                <div className="total-value-div w100 h10 d-flex sb">
                  <span className="info-text w30">Avrage SNF : </span>
                  <span className="text w30 t-center">
                    {safeToFixed(summary.avgSNF, 1)}
                  </span>
                </div>
                <div className="total-value-div w100 h10 d-flex sb">
                  <span className="info-text w30">Avrage Rate : </span>
                  <span className="text w30 t-center">
                    {safeToFixed(summary.avgRate, 1)}
                  </span>
                </div>
                <div className="total-value-div w100 h10 d-flex sb">
                  <span className="text w30">Total Amount : </span>
                  <span className="text w30 t-center">
                    {safeToFixed(summary.totalAmount, 2)}
                  </span>
                </div>
              </div> */}
            </div>
          </div>
          <div className="cattel-feeds-summary-div w100 h50 d-flex-col py10 bg my10">
            <span className="heading px10">Cattel Feeds :</span>
            <div className="purchase-detailsitable w100 h80 mh80 d-flex-col hidescrollbar p10">
              {purchaseBill.length > 0 ? (
                purchaseBill.map((bill, index) => (
                  <div
                    key={index}
                    className="purchase-table-values w100 h10 t-center a-center d-flex sa ">
                    <span className="text w15">{bill.BillNo}</span>
                    <span className="text w15">
                      {new Date(bill.BillDate).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "2-digit",
                      })}
                    </span>
                    <span className="text w20">{bill.ItemName}</span>
                    <span className="text w15">{bill.Qty}</span>
                    <span className="text w15">{bill.Rate}</span>
                    <span className="text w15">{bill.Amount}</span>
                  </div>
                ))
              ) : (
                <div className="box d-flex center subheading">
                  No data available
                </div>
              )}
            </div>
          </div>
          <div className="deduction-summary-div w100 h50 d-flex-col py10 bg">
            <div className="deduction-info-details w100 h1 d-flex-col p10">
              <div className="date-billno-div w100 h20 d-flex sb">
                <div className="dates w50 h1 d-flex sb">
                  <span className="text">Payment Date : </span>
                  <span className="info-text">
                    {deduction[0]?.ToDate
                      ? new Date(deduction[0].ToDate).toLocaleDateString()
                      : "N/A"}
                  </span>
                </div>
                <div className="bill-div w30 h1 d-flex sb">
                  <span className="text">Bill No. : </span>
                  <span className="info-text">
                    {deduction[0]?.BillNo || "N/A"}
                  </span>
                </div>
              </div>
              <div className="rate-amount w100 h80 d-flex-col">
                <div className="rate w100 h1 d-flex sb">
                  <span className="text">Total Litters :</span>
                  <span className="info-text">
                    {deduction[0]?.tliters || "N/A"}
                  </span>
                </div>
                <div className="Amount w100 h1 d-flex sb">
                  <span className="text">Average Rate :</span>
                  <span className="info-text">
                    {deduction[0]?.arate || "N/A"}
                  </span>
                </div>
                <div className="rate w100 h1 d-flex sb">
                  <span className="text">Payment Amount :</span>
                  <span className="info-text">
                    {deduction[0]?.pamt || "N/A"}
                  </span>
                </div>
                <div className="Amount w100 h1 d-flex sb">
                  <span className="text">Deduction Amount :</span>
                  <span className="info-text">
                    {deduction[0]?.damt || "N/A"}
                  </span>
                </div>
                <div className="rate w100 h1 d-flex sb">
                  <span className="text">Net Payment :</span>
                  <span className="info-text">
                    {deduction[0]?.namt || "N/A"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        )}
      </div>
    </div>
  );
};

export default CustPayment;
