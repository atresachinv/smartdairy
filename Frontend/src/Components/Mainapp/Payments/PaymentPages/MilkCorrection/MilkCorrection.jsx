import React, { useEffect, useState } from "react";
import {
  BsCalendar3,
  BsChevronDoubleLeft,
  BsChevronDoubleRight,
} from "react-icons/bs";
import { FaSave, FaEdit } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { generateMaster } from "../../../../../App/Features/Customers/Date/masterdateSlice";
import { listCustomer } from "../../../../../App/Features/Customers/customerSlice";
import { getAllMilkCollReport } from "../../../../../App/Features/Mainapp/Milk/MilkCollectionSlice";
import { getRateCharts } from "../../../../../App/Features/Mainapp/Masters/rateChartSlice";

const MilkCorrection = () => {
  const { t } = useTranslation(["common", "milkcollection"]);
  const dispatch = useDispatch();
  const date = useSelector((state) => state.date.toDate);
  const manualMaster = useSelector((state) => state.manualMasters.masterlist);
  const data = useSelector((state) => state.milkCollection.allMilkColl);

  //Local State
  const [customerList, setCustomerList] = useState([]); // customerlist
  const [customerName, setCustomerName] = useState(""); // customername
  const [milkRateChart, setMilkRatechart] = useState([]); // milk ratechart
  const [currentIndex, setCurrentIndex] = useState(1); // corrent index of selected customer
  const [fillteredData, setFillteredData] = useState([]); // corrent index of selected customer
  const [morningData, setMorningData] = useState([]);
  const [eveningData, setEveningData] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [editData, setEditData] = useState({});

  console.log("All collection data", data);

  //----------------------------------------------------------------->
  // Get master dates and list customer
  useEffect(() => {
    dispatch(generateMaster(date));
    dispatch(listCustomer());
    dispatch(getRateCharts());
  }, []);

  //----------------------------------------------------------------->
  // Handle the date selection
  const handleSelectChange = async (e) => {
    const selectedIndex = e.target.value;
    if (selectedIndex !== "") {
      const selectedDates = manualMaster[selectedIndex];
      dispatch(
        getAllMilkCollReport({
          fromDate: selectedDates.start,
          toDate: selectedDates.end,
        })
      );
    }
  };

  //----------------------------------------------------------------->
  // Effect to load customer list from local storage
  useEffect(() => {
    const storedCustomerList = localStorage.getItem("customerlist");
    if (storedCustomerList) {
      setCustomerList(JSON.parse(storedCustomerList));
    }
  }, [dispatch]);

  //----------------------------------------------------------------->
  // Retrieve the stored rate chart from localStorage on component mount
  useEffect(() => {
    const storedRateChart = localStorage.getItem("milkcollrcharts");
    if (storedRateChart) {
      try {
        const parsedRateChart = JSON.parse(storedRateChart);
        setMilkRatechart(parsedRateChart);
      } catch (error) {
        console.error(
          "Failed to parse milkcollrchart from localStorage:",
          error
        );
      }
    } else {
      console.log("No data found in localStorage for milkcollrchart");
    }
  }, []);

  //----------------------------------------------------------------->
  // Implemetation of customer prev next buttons and display customer name

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === customerList.length ? 1 : prevIndex + 1
    );
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 1 ? customerList.length : prevIndex - 1
    );
  };

  //----------------------------------------------------------------->
  // Filter milk collection data for the current customer

  useEffect(() => {
    if (data.length > 0) {
      const currentCustomerData = data.filter(
        (entry) => entry.rno.toString() === currentIndex.toString()
      );
      setCustomerName(currentCustomerData[0]?.cname || "");
      const morning = currentCustomerData.filter((entry) => entry.ME === 0);
      const evening = currentCustomerData.filter((entry) => entry.ME === 1);
      setMorningData(morning);
      setEveningData(evening);
    }
  }, [data, currentIndex]);

  //----------------------------------------------------------------->
  //functions to edit , save and delete the displayed data
  const handleEditClick = (index) => {
    setEditIndex(index);
    setEditData(morningData[index]);
  };

  //  const handleSaveClick = (index) => {
  //    updateRow(index, editData);
  //    setEditIndex(null);
  //  };

  const handleDeleteClick = (index) => {
    deleteRow(index);
  };

  const handleChange = (e, field) => {
    setEditData({ ...editData, [field]: e.target.value });
  };
  return (
    <div className="milk-correction-container w100 h1 d-flex-col">
      <span className="heading p10">Milk Correction</span>
      <div className="milk-collection-date-fillter-container w100 h20 d-flex">
        <div className="form-customer-details-container w50 h1 d-flex-col mx10 sb">
          <div className="custmize-report-div w65 h40 px10 d-flex a-center sb">
            <span className="cl-icon w20 h1 d-flex center info-text">
              <BsCalendar3 />
            </span>
            <select
              className="custom-select label-text w80 "
              onChange={handleSelectChange}>
              <option>--{t("c-select-master")}--</option>
              {manualMaster.map((dates, index) => (
                <option
                  className="label-text w100 d-flex  sa"
                  key={index}
                  value={index}>
                  {new Date(dates.start).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short", // Abbreviated month format
                    year: "numeric",
                  })}
                  To :
                  {new Date(dates.end).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short", // Abbreviated month format
                    year: "numeric",
                  })}
                </option>
              ))}
            </select>
          </div>
          <div className="customer-details-container w100 h50 d-flex a-center">
            <div className="btn-code-container w25 h1 d-flex a-center sb">
              <button className="btn" onClick={handlePrev}>
                <BsChevronDoubleLeft className="icon " />
              </button>
              <input
                className="data w30 t-center"
                type="text"
                value={currentIndex}
                readOnly
                placeholder="1"
              />
              <button className="btn" onClick={handleNext}>
                <BsChevronDoubleRight className="icon" />
              </button>
            </div>
            <input
              className="data w50 mx10"
              type="text"
              name=""
              id=""
              value={customerName}
              readOnly
              placeholder="Customer Name"
            />
          </div>
        </div>
        <div className="data-fillter-container w20 h1 d-flex-col">
          <div className="fillter-selection-container w100 h25 d-flex a-center sb">
            <input className="data w10 h70" type="checkbox" name="" id="" />
            <span className="info-text w80">Misplaced Milk Collection</span>
          </div>
          <div className="fillter-selection-container w100 h25 d-flex a-center sb">
            <input className="data w10 h70" type="checkbox" name="" id="" />
            <span className="info-text w80">
              Misplaced Milk To Inactive Customer
            </span>
          </div>
        </div>
      </div>
      <div className="milk-collection-data-container w100 h80 d-flex sa">
        <div className="morning-milk-collection-data w40 h1 mh100 hidescrollbar d-flex-col bg">
          <div className="collection-heading-container w100 h10 d-flex a-center bg1 sticky-top sa">
            <span className="f-info-text w10">Edit</span>
            <span className="f-info-text w20">Date</span>
            <span className="f-info-text w10">Liters</span>
            <span className="f-info-text w10">Fat</span>
            <span className="f-info-text w10">Deg</span>
            <span className="f-info-text w10">Snf</span>
            <span className="f-info-text w10">Rate</span>
            <span className="f-info-text w15">Amount</span>
          </div>
          {morningData.length > 0 ? (
            morningData.map((milk, index) => (
              <div
                key={index}
                className={`collection-data-container w100 h10 d-flex a-center t-center sb ${
                  index % 2 === 0 ? "bg-light" : "bg-dark"
                }`}
                style={{
                  backgroundColor:
                    editIndex === index
                      ? "#ffd5d5"
                      : index % 2 === 0
                      ? "#faefe3"
                      : "#fff",
                }}>
                <span className="text w5">
                  {editIndex === index ? (
                    <FaSave
                      className="color-icon"
                      onClick={() => handleSaveClick(index)}
                    />
                  ) : (
                    <FaEdit
                      className="color-icon"
                      onClick={() => handleEditClick(index)}
                    />
                  )}
                </span>
                <span className="text w20 t-start">
                  {milk.ReceiptDate.slice(0, 10)}
                </span>
                <span className="text w10">{milk.Litres}</span>
                <span className="text w10">{milk.fat}</span>
                <span className="text w10">{milk.degree || 0}</span>
                <span className="text w10">{milk.snf}</span>
                <span className="text w10">{milk.rate}</span>
                <span className="text w15">{milk.Amt}</span>
              </div>
            ))
          ) : (
            <div className="no-records w100 h1 d-flex center">
              <span className="label-text">{t("common:c-no-data-avai")}</span>
            </div>
          )}
        </div>
        <div className="evening-milk-collection-data w40 h1 mh100 hidescrollbar d-flex-col bg">
          <div className="collection-heading-container w100 h10 d-flex a-center bg1 sticky-top  sa">
            <span className="f-info-text w10">Edit</span>
            <span className="f-info-text w20">Date</span>
            <span className="f-info-text w10">Liters</span>
            <span className="f-info-text w10">Fat</span>
            <span className="f-info-text w10">Deg</span>
            <span className="f-info-text w10">Snf</span>
            <span className="f-info-text w10">Rate</span>
            <span className="f-info-text w15">Amount</span>
          </div>
          {eveningData.length > 0 ? (
            eveningData.map((milk, index) => (
              <div
                key={index}
                className={`collection-data-container w100 h10 d-flex a-center t-center sb ${
                  index % 2 === 0 ? "bg-light" : "bg-dark"
                }`}
                style={{
                  backgroundColor:
                    editIndex === index
                      ? "#ffd5d5"
                      : index % 2 === 0
                      ? "#faefe3"
                      : "#fff",
                }}>
                <span className="text w5 t-center">
                  {editIndex === index ? (
                    <FaSave
                      className="color-icon"
                      onClick={() => handleSaveClick(index)}
                    />
                  ) : (
                    <FaEdit
                      className="color-icon"
                      onClick={() => handleEditClick(index)}
                    />
                  )}
                </span>
                <span className="text w20 t-start">
                  {milk.ReceiptDate.slice(0, 10)}
                </span>
                <span className="text w10">{milk.Litres}</span>
                <span className="text w10">{milk.fat}</span>
                <span className="text w10">{milk.degree || 0}</span>
                <span className="text w10">{milk.snf}</span>
                <span className="text w10">{milk.rate}</span>
                <span className="text w15 t-center">{milk.Amt}</span>
              </div>
            ))
          ) : (
            <div className="no-records w100 h1 d-flex center">
              <span className="label-text">{t("common:c-no-data-avai")}</span>
            </div>
          )}
        </div>
        <div className="action-btn-container w10 h1 d-flex-col">
          <button className="btn">Transfer To Morning</button>
          <button className="btn my10">Transfer To Evening</button>
          <button className="danger-btn">Delete</button>
        </div>
      </div>
    </div>
  );
};

export default MilkCorrection;
