import React, { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import DashboardNavlinks from "./DashboardNavlinks";
import InventoryDashboard from "./InventoryDashboard";
import LossGainInfo from "./LossGainInfo";
import MilkPurInfo from "./MilkPurInfo";
import MilkSaleInfo from "./MilkSaleInfo";
import { BsCalendar3 } from "react-icons/bs";
import "../../../../Styles/Mainapp/Dashbaord/Dashboard.css";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { generateMaster } from "../../../../App/Features/Customers/Date/masterdateSlice";
import { getAllMilkCollReport } from "../../../../App/Features/Mainapp/Milk/MilkCollectionSlice";
import {
  getCenterCustCount,
  getCenterMilkData,
} from "../../../../App/Features/Mainapp/Dashboard/dashboardSlice";
import { centersLists } from "../../../../App/Features/Dairy/Center/centerSlice";

const DashboardTabs = () => {
  const { t } = useTranslation("common");
  const dispatch = useDispatch();
  const date = useSelector((state) => state.date.toDate);
  const center_id = useSelector((state) => state.dairy.dairyData.center_id);
  const manualMaster = useSelector((state) => state.manualMasters.masterlist);
  const fDate = useSelector((state) => state.date.formDate); // to fetch default date data
  const tDate = useSelector((state) => state.date.toDate); // to fetch default date data
  const [selectedDate, setSelectedDate] = useState(null);
  // Retrieve isselected from localStorage, defaulting to 0 if not set ------------------>
  const [isselected, setIsselected] = useState(
    parseInt(localStorage.getItem("dashnavIndex")) || 0
  );

  // Update localStorage whenever isselected changes ------------------------------------>
  useEffect(() => {
    localStorage.setItem("dashnavIndex", isselected);
  }, [isselected]);

  // Generate master dates based on the initial date
  useEffect(() => {
    dispatch(generateMaster(date));
  }, []);

  // Handle the date selection ------------------------------------------------------------------>

  useEffect(() => {
    if (selectedDate) {
      // If a date is selected from manualMaster, use it
      dispatch(
        getAllMilkCollReport({
          fromDate: selectedDate.start,
          toDate: selectedDate.end,
        })
      );
      if (center_id === 0) {
        dispatch(
          getCenterMilkData({
            fromDate: selectedDate.start,
            toDate: selectedDate.end,
          })
        );
        dispatch(centersLists());
        dispatch(getCenterCustCount());
      }
    } else if (fDate && tDate) {
      // If no date is selected, use fDate and tDate from Redux store
      dispatch(
        getAllMilkCollReport({
          fromDate: fDate,
          toDate: tDate,
        })
      );
      if (center_id === 0) {
        dispatch(
          getCenterMilkData({
            fromDate: fDate,
            toDate: tDate,
          })
        );
      }
    }
  }, [dispatch, selectedDate, fDate, tDate]);

  const handleSelectChange = (e) => {
    const selectedIndex = e.target.value;
    if (selectedIndex !== "") {
      const selectedDates = manualMaster[selectedIndex];
      setSelectedDate(selectedDates);
      // Store selected master in localStorage
      localStorage.setItem("selectedMaster", JSON.stringify(selectedDates));

      // The dispatch is now handled by useEffect
    } else {
      // If the user selects the default option, reset selectedDate to null
      setSelectedDate(null);
    }
  };
  return (
    <div className="dasboard-tab-container w100 h1">
      <div className="dashboard-title w100 d-flex p10 ">
        <h3 className="subtitle">{t("nv-dash")}</h3>
      </div>
      <form className="selection-container w100 h10 d-flex a-center j-start">
        <div className="select-data-text w50 h1 d-flex a-center p10">
          <span className="w50 label-text">
            {selectedDate !== null ? (
              <h2 className="label-text px10">
                <span className="info-text">
                  {new Date(selectedDate.start).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short", // Abbreviated month format
                    year: "numeric",
                  })}
                </span>
                <span> To : </span>
                <span className="info-text">
                  {new Date(selectedDate.end).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short", // Abbreviated month format
                    year: "numeric",
                  })}
                </span>
              </h2>
            ) : fDate && tDate ? (
              <h2 className="label-text px10">
                <span className="info-text">
                  {new Date(fDate).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
                <span> To : </span>
                <span className="info-text">
                  {new Date(tDate).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </h2>
            ) : (
              <span></span>
            )}
          </span>
        </div>
        <div className="custmize-report-div w30 h1 px10 d-flex a-center sb">
          <span className="cl-icon w10 h1 d-flex center">
            <BsCalendar3 />
          </span>
          <select
            className="custom-select label-text w90 h1 p10"
            onChange={handleSelectChange}
          >
            <option className="label-text w100 d-flex">
              --{t("c-select-master")}--
            </option>
            {manualMaster.map((dates, index) => (
              <option
                className="label-text w100 d-flex sa"
                key={index}
                value={index}
              >
                {new Date(dates.start).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short", // Abbreviated month format
                  year: "numeric",
                })}
                {t("c-to")} :
                {new Date(dates.end).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short", // Abbreviated month format
                  year: "numeric",
                })}
              </option>
            ))}
          </select>
        </div>
      </form>
      <div className="w100 h10 d-flex a-center">
        <DashboardNavlinks
          isselected={isselected}
          setIsSelected={setIsselected}
        />
      </div>
      <div className="dashboard-tab-nav-views w100 h70 d-flex center">
        <Routes>
          <Route path="*" element={<MilkPurInfo />} />
          <Route path="milk/purchase-info" element={<MilkPurInfo />} />
          <Route path="milk/sales-info" element={<MilkSaleInfo />} />
          <Route path="inventory-info" element={<InventoryDashboard />} />
          <Route path="lossgain-info" element={<LossGainInfo />} />
        </Routes>
      </div>
    </div>
  );
};

export default DashboardTabs;
