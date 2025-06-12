import React, { useEffect, useState } from "react";
import "../../../../Styles/Deductionlist/Deductionlist.css";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import { BsCalendar3 } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

;

const Deductionlist = () => {
  const { t } = useTranslation(["common", "milkcollection"]);
  const dispatch = useDispatch();
  const manualMaster = useSelector((state) => state.manualMasters.masterlist);
  const customerlist = useSelector((state) => state.customer.customerlist);
  const deduction = useSelector((state) => state.deduction.alldeductionInfo);
  const dairyname = useSelector(
    (state) =>
      state.dairy.dairyData.SocietyName || state.dairy.dairyData.center_name
  );
  const CityName = useSelector((state) => state.dairy.dairyData.city);
  const status = useSelector((state) => state.deduction.deductionstatus);
  const [selectedMaster, setSelectedMaster] = useState("");
  const [selectIndex, setSelectedIndex] = useState([]);
  const [mergedData, setMergedData] = useState([]);
  const [filteredDeduction, setFilteredDeduction] = useState([]);
  const [dnameOptions, setDnameOptions] = useState([]);
  const [selectedDname, setSelectedDname] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [allData, setAllData] = useState([]); // fetched or static master data



// Filter data when from/to dates change
useEffect(() => {
  if (!fromDate || !toDate) return;

  const filtered = allData.filter((entry) => {
    const entryDate = new Date(entry.date); // ensure date is comparable
    return entryDate >= new Date(fromDate) && entryDate <= new Date(toDate);
  });

  setFilteredData(filtered);
}, [fromDate, toDate, allData]);

console.log("fromDate", fromDate);

  // Retrieve selected master from localStorage on component mount
  useEffect(() => {
    const savedMaster = localStorage.getItem("selectedMaster");
    if (savedMaster && savedMaster !== "undefined") {
      setSelectedMaster(JSON.parse(savedMaster));
    }
  }, []);

  //Extract Unique Acc Code and Merge customer names into deduction records ------------->
  useEffect(() => {
    // Extract unique AccCodes from deduction data
    const uniqueAccCodes = [...new Set(deduction.map((item) => item.AccCode))];
    const matchingCustomers = [];
    uniqueAccCodes.forEach((accCode) => {
      const matchingCustomer = customerlist.find(
        (customer) => String(customer.cid) === String(accCode)
      );
      if (matchingCustomer) {
        matchingCustomers.push(matchingCustomer);
      }
    });
    // Merge customer names into deduction records
    const updatedDeduction = deduction.map((deductionItem) => {
      const matchingCustomer = matchingCustomers.find(
        (customer) => String(customer.cid) === String(deductionItem.AccCode)
      );
      return {
        ...deductionItem,
        customerName: matchingCustomer?.cname ?? "-",
        Code: matchingCustomer?.srno ?? "0",
      };
    });

    // Update state with the merged data
    setMergedData(updatedDeduction);
  }, [deduction, customerlist]);

  //Extracting unique danmes ------------------------------------------------------------>
  useEffect(() => {
    if (mergedData.length > 0) {
      // Filter out empty dname values and get unique dnames
      const uniqueDnames = [
        ...new Set(
          mergedData
            .filter((item) => item.dname && item.dname.trim() !== "") // Exclude empty or whitespace-only dnames
            .map((item) => item.dname)
        ),
      ];
      setDnameOptions(uniqueDnames); // Set the deduction types (dname) in the state
    }
  }, [mergedData]);

  // Filter data based on selected dname ------------------------------------------------>
  useEffect(() => {
    if (selectedDname) {
      const filteredData = mergedData.filter(
        (item) => item.dname === selectedDname
      );
      setFilteredDeduction(filteredData); // Set filtered data
    } else {
      // If no deduction type is selected, show all data
      setFilteredDeduction(mergedData);
    }
  }, [selectedDname, mergedData]);

  return (
    <div className="deduction-list-container w100 h1 d-flex-col  bg ">
      <span className="heading px10">Deduction List</span>
      <div className="deduction-list-first-half-div w100 h30 d-flex-col sa ">
        <div className="select-deduction-report w100 h30 d-flex a-center px10">
          <span className="label-text w10">कपात निवडा:</span>
          <select
            className="w50 data"
            value={selectedDname}
            onChange={(e) => setSelectedDname(e.target.value)}
          >
            <option value="">-- Select --</option>
            {dnameOptions.map((dname, index) => (
              <option key={index} value={dname}>
                {dname}
              </option>
            ))}
          </select>
        </div>
        <div className="deduction-list-from-to-date-div w100 h30 a-center px10 d-flex">
          <div className="deduction-list-from-date w50 d-flex h1 a-center">
            <span className="label-text w20">दिनांकापासून:</span>
            <input
              className="data w40"
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
          </div>
          <div className="deduction-list-to-date w50 d-flex h1 a-center">
            <span className="label-text w20">दिनांकापर्येंत:</span>
            <input
              className="data w40"
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
          </div>
        </div>
        <div className="code-number-from-to-div-and-button-div w100 h30 d-flex px10 ">
          <div className="code-number-from-to-div w50 h1 d-flex">
            <div className="from-code-numbers-div w50 h1 d-flex a-center">
              <span className="label-heading w40">कोड.न.पासून</span>
              <input className="data w40" type="text" />
            </div>
            <div className="to-code-numbers-div w50 h1 d-flex a-center">
              <span className="label-heading w20">ते</span>
              <input className="data w30" type="text" />
            </div>
          </div>
          <div className="deduction-list-container-button d-flex sa w50 h1  ">
            <button className="w-btn">रिपोर्ट </button>
            <button className="w-btn">जमा नावे</button>
            <button className="w-btn">Print</button>
          </div>
        </div>
      </div>
      <div className="deduction-list-table w100 h70 d-flex-col ">
        <div className="deduction-heading-side-table w100 px10 sa d-flex">
          <span className="label-text">खाते क्र</span>
          <span className="label-text">उत्पादकचे नाव</span>
          <span className="label-text">लिटर</span>
          <span className="label-text">Bank Acc No</span>
          <span className="label-text">रक्कम</span>
        </div>
        <div className="deduction-list-table-data w100 mh90 hidescrollbar sa d-flex">
          <span className="label-text">001</span>
          <span className="label-text">yogesh shinde</span>
          <span className="label-text">100</span>
          <span className="label-text">3090033732</span>
          <span className="label-text">4000</span>
        </div>
      </div>
    </div>
  );
};

export default Deductionlist;
