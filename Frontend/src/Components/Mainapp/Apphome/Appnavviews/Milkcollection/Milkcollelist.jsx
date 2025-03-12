import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import "../../../../../Styles/Mainapp/Apphome/Appnavview/Milkcollection.css";
import { useParams } from "react-router-dom";

const Milkcollelist = () => {
  const { t } = useTranslation(["milkcollection", "common", "master"]);
  const { time } = useParams();
  // Retrieve milk collection data and sort in descending order
  const milkColl = useSelector((state) => state.milkCollection.entries || [])
    .slice()
    .reverse();

  const [custList, setCustomersList] = useState({}); // to check remainning customer list
  const [milkData, setMilkData] = useState([]); // to check remainning customer list
  const [isRCust, setIsRCust] = useState(false); // to show remainning customer list

  useEffect(() => {
    if (!milkColl || milkColl.length === 0) return; // Ensure milkColl is not empty

    const ME = time === "morning" ? 0 : 1; // Determine ME based on time
    const MilkEntries = milkColl.filter(
      (entry) => entry.shift.toString() === ME.toString()
    );
    // Only update state if filtered data has changed
    setMilkData((prevMilkData) => {
      return JSON.stringify(prevMilkData) !== JSON.stringify(MilkEntries)
        ? MilkEntries
        : prevMilkData;
    });
  }, [milkColl, time]); // Only re-run when milkColl or time changes

  const handleRemainingCustomers = async (e) => {
    e.preventDefault();
    setIsRCust(!isRCust);
    const storedCustList = localStorage.getItem("rcustlist");
    if (storedCustList) {
      setCustomersList(JSON.parse(storedCustList));
    } else {
      setCustomersList([]);
    }
  };

  return (
    <div className="milk-collection-list w100 h1 d-flex-col bg">
      <div className="title-container w100 h10 d-flex a-center sb p10">
        <h2 className="heading">
          {isRCust ? "Customer List" : t("m-coll-list")}
        </h2>
        <button className="btn info-text" onClick={handleRemainingCustomers}>
          {isRCust ? t("m-coll-list") : "Customer List"}
        </button>
      </div>

      {!isRCust ? (
        <div className="collection-list-container w100 h90 d-flex-col hidescrollbar p10">
          {milkData.length > 0 ? (
            milkData.map((entry, i) => (
              <div
                key={i}
                className="collection-details w100 d-flex-col bg3 br6"
              >
                <div className="col-user-info w100 h40 d-flex a-center sa p10">
                  <span className="text w20">{entry.code}</span>
                  <span className="text w70">{entry.cname}</span>
                </div>
                <div className="line"></div>
                <div className="col-milk-info w100 h60 d-flex-col">
                  <div className="info-title w100 h50 d-flex sa">
                    <span className="text w15 d-flex center">
                      {t("common:c-liters")}
                    </span>
                    <span className="text w15 d-flex center">
                      {t("common:c-fat")}
                    </span>
                    <span className="text w15 d-flex center">
                      {t("common:c-snf")}
                    </span>
                    {/* <span className="text w15 d-flex center">
                      {t("common:c-deg")}
                    </span> */}
                    <span className="text w20 d-flex center">
                      {t("common:c-rate")}
                    </span>
                    <span className="text w20 d-flex center">
                      {t("common:c-amt")}
                    </span>
                  </div>
                  <div className="info-value w100 h50 d-flex sa">
                    <span className="text w15 d-flex center">
                      {entry.liters || "00.0"}
                    </span>
                    <span className="text w15 d-flex center">
                      {entry.fat || "00.0"}
                    </span>
                    <span className="text w15 d-flex center">
                      {entry.snf || "00.0"}
                    </span>
                    {/* <span className="text w15 d-flex center">
                      {entry.degree || "00.0"}
                    </span> */}
                    <span className="text w20 d-flex center">
                      {entry.rate || "00.0"}
                    </span>
                    <span className="text w20 d-flex center">
                      {entry.amt || "00.0"}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="no-records w100 h1 d-flex center">
              <span className="label-text">{t("common:c-no-data-avai")}</span>
            </div>
          )}
        </div>
      ) : (
        <div className="remaing-customer-list-container w100 h90 mh90 d-flex-col hidescrollbar">
          <div className="customer-details-heading-container w100 h10 p10 d-flex a-center t-center sb sticky-top bg1">
            <span className="f-info-text w15">{t("master:m-ccode")}</span>
            <span className="f-info-text w50">{t("master:m-cname")}</span>
            <span className="f-info-text w30">{t("master:m-mobile")}</span>
          </div>
          {custList.length > 0 ? (
            custList.map((customer, index) => (
              <div
                key={index}
                className={`customer-details-data-container w100 h10 d-flex a-center sb ${
                  index % 2 === 0 ? "bg-light" : "bg-dark"
                }`}
                style={{
                  backgroundColor: index % 2 === 0 ? "#faefe3" : "#fff",
                }}
              >
                <span className="info-text w15 t-center">{customer.srno}</span>
                <span className="info-text w50">{customer.cname}</span>
                <span className="info-text w30 t-start">{customer.Phone}</span>
              </div>
            ))
          ) : (
            <div className="no-records w100 h1 d-flex center">
              <span className="label-text">{t("common:c-no-data-avai")}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Milkcollelist;
