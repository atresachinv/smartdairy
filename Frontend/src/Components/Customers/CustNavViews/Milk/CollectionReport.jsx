import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMasterReports } from "../../../../App/Features/Customers/Milk/milkMasterSlice";
import Spinner from "../../../Home/Spinner/Spinner";
import { BsCalendar3 } from "react-icons/bs";
import { useTranslation } from "react-i18next";
import "../../../../Styles/Customer/CustNavViews/Milk/Milk.css";

const CollectionReport = () => {
  const { t } = useTranslation("common");
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
        <h2 className="heading"> {t("c-coll-report")}</h2>
      </div>
      <div className="custmize-report-div w100 h10 px10 d-flex a-center sb">
        <span className="cl-icon w10 h1 d-flex center">
          <BsCalendar3 />
        </span>
        <select
          className="custom-select sub-heading w80 h1 p10"
          onChange={handleSelectChange}>
          <option className="sub-heading">--{t("c-select-master")}--</option>
          {master.map((dates, index) => (
            <option className="sub-heading" key={index} value={index}>
              {new Date(dates.fromDate).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short", // Abbreviated month format
                year: "numeric",
              })}
              To:
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
          <span className="text w15">{t("c-date")}</span>
          <span className="text w5">{t("c-m/e")}</span>
          <span className="text w10">{t("c-c/b")}</span>
          <span className="text w10">{t("c-liters")}</span>
          <span className="text w5">FAT</span>
          <span className="text w5">SNF</span>
          <span className="text w10">{t("c-rate")}</span>
          <span className="text w15">{t("c-amt")}</span>
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
                  <span className="text w5">
                    {report.ME === 0 ? `${t("c-m")}` : `${t("c-e")}`}
                  </span>
                  <span className="text w5">
                    {report.CB === 0 ? `${t("c-c")}` : `${t("c-b")}`}
                  </span>
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
                {t("c-no-data-avai")}
              </div>
            )}
          </div>
        )}
        <div className="content-total-value-div w100 h10 d-flex center t-center sa px10">
          <span className="label-text w15">{t("c-total")} : </span>
          <span className="text w5"></span>
          <span className="text w10"></span>
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
