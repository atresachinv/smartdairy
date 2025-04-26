import React, { useEffect, useState } from "react";
import {
  BsCalendar3,
  BsChevronDoubleLeft,
  BsChevronDoubleRight,
} from "react-icons/bs";
import { FaEdit, FaSave } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { generateMaster } from "../../../../../App/Features/Customers/Date/masterdateSlice";
import { listCustomer } from "../../../../../App/Features/Customers/customerSlice";
import { getAllMilkCollReport } from "../../../../../App/Features/Mainapp/Milk/MilkCollectionSlice";
import { getRateCharts } from "../../../../../App/Features/Mainapp/Masters/rateChartSlice";
import {
  deleteMilkRecord,
  getPayMasters,
  transferTOEvening,
  transferTOMorning,
  updateMilkData,
} from "../../../../../App/Features/Payments/paymentSlice";
import "../../../../../Styles/Mainapp/Payments/MilkCorrection.css";
import { selectPaymasters } from "../../../../../App/Features/Payments/paymentSelectors";

const MilkCorrection = ({ showbtn, setCurrentPage }) => {
  const { t } = useTranslation(["common", "milkcollection"]);
  const dispatch = useDispatch();
  const date = useSelector((state) => state.date.toDate);

  const manualMaster = useSelector((state) => state.manualMasters.masterlist);
  const data = useSelector((state) => state.milkCollection.allMilkColl);
  const payMasters = useSelector(selectPaymasters); // is payment lock
  const milkcollRatechart = useSelector((state) => state.ratechart.rateChart); // rate to update rates
  //Local State
  const [customerList, setCustomerList] = useState([]); // customerlist
  const [customerName, setCustomerName] = useState(""); // customername
  const [currentIndex, setCurrentIndex] = useState(1); // corrent index of selected customer
  const [selectedMaster, setSelectedMaster] = useState([]); // corrent index of selected customer
  const [morningData, setMorningData] = useState([]);
  const [eveningData, setEveningData] = useState([]);
  const [editmrgIndex, setEditmrgIndex] = useState(null);
  const [editeveIndex, setEditeveIndex] = useState(null);
  const [selectedMorningItems, setSelectedMorningItems] = useState([]);
  const [selectedEveningItems, setSelectedEveningItems] = useState([]);
  const [isLocked, setIsLocked] = useState(false); // is payment master lock

  const initialData = {
    id: "",
    fat: "",
    degree: "",
    snf: "",
    rate: "",
    amt: "",
    liters: "",
  };
  const [editedData, setEditedData] = useState(initialData);
  // ----------------------------------------------------------------------->
  // check if payment is lock or not ------------------------------------->
  useEffect(() => {
    if (!payMasters || payMasters.length === 0) {
      dispatch(getPayMasters());
    }
  }, [dispatch, payMasters]);

  useEffect(() => {
    if (selectedMaster) {
      const foundLocked = payMasters.some(
        (master) =>
          master.FromDate.slice(0, 10) === selectedMaster.start.slice(0, 10) &&
          master.ToDate.slice(0, 10) === selectedMaster.end.slice(0, 10) &&
          master.islock === 1
      );

      setIsLocked(foundLocked);
    }
  }, [selectedMaster, payMasters]);

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
      setSelectedMaster(selectedDates);
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
  // Implemetation of customer prev next buttons and display customer name

  // Handling Code inputs ----------------------------->
  const handleInputChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value)) {
      setCurrentIndex(Math.min(Math.max(value, 1), customerList.length)); // Ensure within bounds
    } else {
      setCurrentIndex(""); // If not a valid number, reset to empty
    }
  };

  // Handling "Enter" key press
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      const value = parseInt(e.target.value, 10);
      if (!isNaN(value)) {
        setCurrentIndex(Math.min(Math.max(value, 1), customerList.length)); // Ensure within bounds
      }
    }
  };

  // Handling Prev Next Buttons ------------------------------------------>

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
  //functions to edit and save the displayed data
  const handleEditMrgClick = (index, milk) => {
    setEditmrgIndex(index);
    setEditedData({
      id: milk.id,
      fat: milk.fat,
      liters: milk.Litres,
      snf: milk.snf,
      rate: milk.rate,
      amt: milk.Amt,
      rctype: milk.rctype,
    });
  };

  const handleEditEveClick = (index, milk) => {
    setEditeveIndex(index);
    setEditedData({
      id: milk.id,
      fat: milk.fat,
      liters: milk.Litres,
      snf: milk.snf,
      rate: milk.rate,
      amt: milk.Amt,
      rctype: milk.rctype,
    });
  };

  const handleEditedDataChange = (field, value) => {
    setEditedData((prevData) => ({ ...prevData, [field]: value }));
  };

  const handleSaveData = async (milk) => {
    try {
      dispatch(updateMilkData({ data: editedData }));
      const handler = setTimeout(() => {
        dispatch(
          getAllMilkCollReport({
            fromDate: selectedMaster.start,
            toDate: selectedMaster.end,
          })
        );
        setEditedData(initialData);
        setEditmrgIndex(null);
        setEditeveIndex(null);
        toast.success("Selected record updated successfully!");
      }, 500);
      return () => clearTimeout(handler);
    } catch (error) {
      toast.error("Failed to update record!");
      console.error("Error during handleTransferToEvening: ", error);
    }
  };

  // Claculate rate and amount on value change >>>>>----------->
  const calculateRateAndAmount = async () => {
    try {
      const { fat, snf, liters, rctype } = editedData;
      const parsedFat = parseFloat(fat);
      const parsedSnf = parseFloat(snf);
      const parsedLiters = parseFloat(liters);
      const rateEntry = milkcollRatechart.find(
        (entry) =>
          entry.fat === parsedFat &&
          entry.snf === parsedSnf &&
          entry.rctypename === rctype
      );
      if (rateEntry) {
        const rate = parseFloat(rateEntry.rate);
        const amount = rate * parsedLiters;

        setEditedData((prev) => ({
          ...prev,
          rate: rate.toFixed(1),
          amt: amount.toFixed(1),
          degree: 0,
        }));
      } else {
        setEditedData((prev) => ({
          ...prev,
          rate: 0,
          amt: 0,
          degree: 0,
        }));
      }
    } catch (error) {
      console.error("Error calculating rate and amount:", error);
    }
  };

  // Trigger calculation whenever liters, fat, or snf change-------------------------->
  useEffect(() => {
    if (editedData.liters && editedData.fat && editedData.snf) {
      calculateRateAndAmount();
    }
  }, [editedData.liters, editedData.fat, editedData.snf]);

  // ------------------------------------------------------------------------------------------------->
  // Multiselect Feature
  const handleSelectItem = (type, id) => {
    if (type === "morning") {
      setSelectedMorningItems((prev) =>
        prev.includes(id)
          ? prev.filter((itemId) => itemId !== id)
          : [...prev, id]
      );
    } else {
      setSelectedEveningItems((prev) =>
        prev.includes(id)
          ? prev.filter((itemId) => itemId !== id)
          : [...prev, id]
      );
    }
  };

  //---------------------------------------------------------------------------------->
  // morning to evening -------------------->

  const handleTransferToEvening = () => {
    if (isLocked) {
      toast.error("Payment Master is lock, Unlock and try again!");
      return;
    }
    try {
      dispatch(transferTOEvening({ records: selectedMorningItems }));
      setSelectedMorningItems([]);
      const handler = setTimeout(() => {
        dispatch(
          getAllMilkCollReport({
            fromDate: selectedMaster.start,
            toDate: selectedMaster.end,
          })
        );
        toast.success("Selected records transferred to Evening successfully!");
      }, 500);
      return () => clearTimeout(handler);
    } catch (error) {
      toast.error("Failed to transfer records or fetch updated data.");
      console.error("Error during Transfer milk Evening: ", error);
    }
  };

  // evening to morning -------------------->
  const handleTransferToMorning = () => {
    if (isLocked) {
      toast.error("Payment Master is lock, Unlock and try again!");
      return;
    }
    try {
      dispatch(transferTOMorning({ records: selectedEveningItems }));
      setSelectedEveningItems([]);
      const handler = setTimeout(() => {
        dispatch(
          getAllMilkCollReport({
            fromDate: selectedMaster.start,
            toDate: selectedMaster.end,
          })
        );
        toast.success("Selected records Tranferred to Morning successfully!");
      }, 500);
      return () => clearTimeout(handler);
    } catch (error) {
      toast.error("Failed to transfer records or fetch updated data.");
      console.error("Error during Transfer milk Evening: ", error);
    }
  };

  // delete selected record ---------------->
  const handleDeleteRecord = () => {
    if (isLocked) {
      toast.error("Payment Master is lock, Unlock and try again!");
      return;
    }
    if (
      selectedMorningItems.length === 0 &&
      selectedEveningItems.length === 0
    ) {
      toast.error("Please select record or records to delete!");
      return;
    }
    if (selectedMorningItems.length > 0) {
      dispatch(deleteMilkRecord({ records: selectedMorningItems }));
      setSelectedMorningItems([]);

      const handler = setTimeout(() => {
        dispatch(
          getAllMilkCollReport({
            fromDate: selectedMaster.start,
            toDate: selectedMaster.end,
          })
        );
        toast.success("Selected record or records delete successfully!");
      }, 500);
      return () => clearTimeout(handler);
    }
    if (selectedEveningItems.length > 0) {
      dispatch(deleteMilkRecord({ records: selectedEveningItems }));
      setSelectedEveningItems([]);
      const handler = setTimeout(() => {
        dispatch(
          getAllMilkCollReport({
            fromDate: selectedMaster.start,
            toDate: selectedMaster.end,
          })
        );
        toast.success("Selected record or records delete successfully!");
      }, 500);
      return () => clearTimeout(handler);
    }
  };

  return (
    <div className="milk-correction-container w100 h1 d-flex-col">
      <div className="title-btn-container w100 h10 d-flex a-center sb">
        <span className="heading mx10">Milk Correction</span>
        {showbtn ? (
          <button
            className="btn-danger mx10"
            onClick={() => setCurrentPage("main")}
          >
            बाहेर पडा
          </button>
        ) : (
          ""
        )}
      </div>
      <div className="milk-collection-date-fillter-container w100 h20 d-flex">
        <div className="form-customer-details-container w50 h1 d-flex-col mx10 sb">
          <div className="custmize-report-div w65 h40 px10 d-flex a-center sb">
            <span className="cl-icon w20 h1 d-flex center info-text">
              <BsCalendar3 />
            </span>
            <select
              className="custom-select label-text w80 "
              onChange={handleSelectChange}
            >
              <option>--{t("c-select-master")}--</option>
              {manualMaster.map((dates, index) => (
                <option
                  className="label-text w100 d-flex  sa"
                  key={index}
                  value={index}
                >
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
          <div className="customer-details-container w100 h60 d-flex a-center">
            <div className="btn-code-container w25 h1 d-flex a-center sb">
              <button className="btn" onClick={handlePrev}>
                <BsChevronDoubleLeft className="icon " />
              </button>
              <input
                className="data w45 t-center mx5"
                type="text"
                value={currentIndex || ""}
                name="code"
                placeholder="code"
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
              />
              <button className="btn" onClick={handleNext}>
                <BsChevronDoubleRight className="icon" />
              </button>
            </div>
            <input
              className="cust_name data w50 mx10"
              type="text"
              name=""
              id=""
              value={customerName}
              readOnly
              placeholder="Customer Name"
            />
          </div>
        </div>
        <div className="data-fillter-container w40 h1 d-flex-col sa">
          <div className="fillter-selection-container w100 h25 d-flex a-center sb">
            <input
              disabled
              className="checkbx w5 h70"
              type="checkbox"
              name="mmc"
              id="mmc"
            />
            <label htmlFor="mmc" className="label-text w90">
              Misplaced Milk Collection
            </label>
          </div>
          <div className="fillter-selection-container w100 h25 d-flex a-center sb">
            <input
              disabled
              className="checkbx w5 h70"
              type="checkbox"
              name="mmic"
              id="mmic"
            />
            <label htmlFor="mmic" className="label-text w90">
              Misplaced Milk To Inactive Customer
            </label>
          </div>
        </div>
      </div>
      <div className="milk-correction-data-container w100 h80 d-flex sa">
        <div className="milk-correction-inner-container w100 h1 d-flex sa">
          <div className="morning-milk-correction-data  h1 mh100 hidescrollbar d-flex-col bg">
            <div className="correction-heading-container w100 h10 d-flex a-center t-center bg7 sticky-top sa">
              <span className="f-info-text w10">Edit</span>
              <span className="f-info-text w20">Date</span>
              <span className="f-info-text w10">Liters</span>
              <span className="f-info-text w10">Fat</span>
              {/* <span className="f-info-text w10">Deg</span> */}
              <span className="f-info-text w10">Snf</span>
              <span className="f-info-text w10">Rate</span>
              <span className="f-info-text w15">Amount</span>
            </div>
            {morningData.length > 0 ? (
              morningData.map((milk, index) => (
                <div
                  key={index}
                  className={`correction-data-container w100 p10 d-flex a-center t-center sb`}
                  style={{
                    backgroundColor:
                      selectedMorningItems.includes(milk.id) ||
                      editmrgIndex === index
                        ? "#f7bb79"
                        : index % 2 === 0
                        ? "#faefe3"
                        : "#fff",
                  }}
                  onClick={() => handleSelectItem("morning", milk.id)}
                >
                  <span className="text w10 t-center d-flex a-center sa">
                    {editmrgIndex === index ? (
                      <FaSave
                        className="color-icon"
                        onClick={() => handleSaveData(milk)}
                      />
                    ) : (
                      <FaEdit
                        className="color-icon"
                        onClick={() => handleEditMrgClick(index, milk)}
                      />
                    )}
                  </span>
                  <span className="text w20 t-start">
                    {milk.ReceiptDate.slice(0, 10)}
                  </span>
                  {editmrgIndex === index ? (
                    <>
                      <span className="text w10 d-flex center">
                        <input
                          className="data w100 t-center"
                          type="text"
                          value={editedData.liters}
                          onChange={(e) =>
                            handleEditedDataChange("liters", e.target.value)
                          }
                        />
                      </span>
                      <span className="text w10">
                        <input
                          className="data w100 d-flex center t-center"
                          type="text"
                          value={editedData.fat}
                          onChange={(e) =>
                            handleEditedDataChange("fat", e.target.value)
                          }
                        />
                      </span>
                      {/* <span className="text w10">{milk.degree || 0}</span> */}
                      <span className="text w10">
                        <input
                          className="data w100 h1 d-flex center t-center"
                          type="text"
                          value={editedData.snf}
                          onChange={(e) =>
                            handleEditedDataChange("snf", e.target.value)
                          }
                        />
                      </span>
                      <span className="text w10">{editedData.rate}</span>
                      <span className="text w15">{editedData.amt}</span>
                    </>
                  ) : (
                    <>
                      <span className="text w10">{milk.Litres}</span>
                      <span className="text w10">{milk.fat}</span>
                      {/* <span className="text w10">{milk.degree || 0}</span> */}
                      <span className="text w10">{milk.snf}</span>
                      <span className="text w10">{milk.rate}</span>
                      <span className="text w15">{milk.Amt}</span>
                    </>
                  )}
                </div>
              ))
            ) : (
              <div className="no-records w100 h1 d-flex center">
                <span className="label-text">{t("common:c-no-data-avai")}</span>
              </div>
            )}
          </div>
          <div className="evening-milk-correction-data  h1 mh100 hidescrollbar d-flex-col bg">
            <div className="correction-heading-container w100 h10 d-flex a-center t-center bg7 sticky-top  sa">
              <span className="f-info-text w10">Edit</span>
              <span className="f-info-text w20">Date</span>
              <span className="f-info-text w10">Liters</span>
              <span className="f-info-text w10">Fat</span>
              {/* <span className="f-info-text w10">Deg</span> */}
              <span className="f-info-text w10">Snf</span>
              <span className="f-info-text w10">Rate</span>
              <span className="f-info-text w15">Amount</span>
            </div>
            {eveningData.length > 0 ? (
              eveningData.map((milk, index) => (
                <div
                  key={index}
                  className={`correction-data-container w100 p10 d-flex a-center t-center sb ${
                    index % 2 === 0 ? "bg-light" : "bg-dark"
                  }`}
                  style={{
                    backgroundColor:
                      selectedEveningItems.includes(milk.id) ||
                      editeveIndex === index
                        ? "#f7bb79"
                        : index % 2 === 0
                        ? "#faefe3"
                        : "#fff",
                  }}
                  onClick={() => handleSelectItem("evening", milk.id)}
                >
                  <span className="text w10 t-center d-flex a-center sa">
                    {editeveIndex === index ? (
                      <FaSave
                        className="color-icon"
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent row click event
                          handleSaveData(milk);
                        }}
                      />
                    ) : (
                      <FaEdit
                        className="color-icon"
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent row click event
                          handleEditEveClick(index, milk);
                        }}
                      />
                    )}
                  </span>
                  <span className="text w20 t-start">
                    {milk.ReceiptDate.slice(0, 10)}
                  </span>
                  {editeveIndex === index ? (
                    <>
                      <span className="text w10 d-flex center">
                        <input
                          className="data w100 t-center"
                          type="text"
                          value={editedData.liters}
                          onClick={(e) => e.stopPropagation()} // Prevent row click event
                          onChange={(e) =>
                            handleEditedDataChange("liters", e.target.value)
                          }
                        />
                      </span>
                      <span className="text w10">
                        <input
                          className="data w100 d-flex center t-center"
                          type="text"
                          value={editedData.fat}
                          onClick={(e) => e.stopPropagation()} // Prevent row click event
                          onChange={(e) =>
                            handleEditedDataChange("fat", e.target.value)
                          }
                        />
                      </span>
                      {/* <span className="text w10">{milk.degree || 0}</span> */}
                      <span className="text w10">
                        <input
                          className="data w100 h1 d-flex center t-center"
                          type="text"
                          value={editedData.snf}
                          onClick={(e) => e.stopPropagation()} // Prevent row click event
                          onChange={(e) =>
                            handleEditedDataChange("snf", e.target.value)
                          }
                        />
                      </span>
                      <span className="text w10">{editedData.rate}</span>
                      <span className="text w15">{editedData.amt}</span>
                    </>
                  ) : (
                    <>
                      <span className="text w10">{milk.Litres}</span>
                      <span className="text w10">{milk.fat}</span>
                      {/* <span className="text w10">{milk.degree || 0}</span> */}
                      <span className="text w10">{milk.snf}</span>
                      <span className="text w10">{milk.rate}</span>
                      <span className="text w15">{milk.Amt}</span>
                    </>
                  )}
                </div>
              ))
            ) : (
              <div className="no-records w100 h1 d-flex center">
                <span className="label-text">{t("common:c-no-data-avai")}</span>
              </div>
            )}
          </div>
        </div>
        <div className="action-btn-container w10 h1 d-flex-col">
          <button
            type="button"
            className="btn"
            onClick={handleTransferToMorning}
          >
            Transfer To Morning
          </button>
          <button
            type="button"
            className="btn my10"
            onClick={handleTransferToEvening}
          >
            Transfer To Evening
          </button>
          <button
            type="button"
            className="btn-danger del"
            onClick={handleDeleteRecord}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default MilkCorrection;
