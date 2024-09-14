import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { generateMaster } from "../../../App/Features/Customers/Date/masterdateSlice";
import { getDeductionInfo } from "../../../App/Features/Deduction/deductionSlice";
import { BsCalendar3 } from "react-icons/bs";
import Spinner from "../../Home/Spinner/Spinner";

const CustDeductions = () => {
  const dispatch = useDispatch();
  const date = useSelector((state) => state.date.toDate);
  const master = useSelector((state) => state.masterdates.masterlist);
  const deduction = useSelector((state) => state.deduction.deductionInfo);
  const status = useSelector((state) => state.deduction.status);
  const [selectedPeriod, setSelectedPeriod] = useState(null);

  // Generate master dates based on the initial date
  useEffect(() => {
    dispatch(generateMaster(date));
  }, [dispatch]);

  // Handle the date selection
  const handleSelectChange = (e) => {
    const selectedIndex = e.target.value;
    if (selectedIndex !== "") {
      const selectedDates = master[selectedIndex];
      setSelectedPeriod(selectedDates);
      // Dispatch the action with the selected fromDate and toDate
      dispatch(
        getDeductionInfo({
          fromDate: selectedDates.fromDate,
          toDate: selectedDates.toDate,
        })
      );
    }
  };

  return (
    <div className="deduction-info-container w100 h1 d-flex-col p10">
      <div className="menu-title-div w100 h10 d-flex p10">
        <h2 className="heading">Deduction Reports</h2>
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
      {/* <div className="selection-container w100 p10 d-flex center">
        <span className="w40 heading px10">Select Period</span>
        <select
          className="custom-select text w50 p10 mh80 d-flex-col hidescrollbar"
          onChange={handleSelectChange}>
          <option value="">-- Select Master --</option>
          {master.map((dates, index) => (
            <option className="text" key={index} value={index}>
              {dates.start} To: {dates.end}
            </option>
          ))}
        </select>
      </div> */}
      <div className="purchase-details-table w100 h80 d-flex j-center p10 bg">
        {status === "loading" ? (
          <div className="w100 h80 d-flex center">
            <Spinner />
          </div>
        ) : deduction.length > 0 ? (
          <div className="deduction-info-container w100 h40 d-flex ">
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
        ) : (
          <div>No data available</div>
        )}
      </div>
    </div>
  );
};

export default CustDeductions;
