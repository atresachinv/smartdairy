import React, { useEffect, useState } from "react";
import { listCustomer } from "../../../../../App/Features/Customers/customerSlice";
import { generateMaster } from "../../../../../App/Features/Customers/Date/masterdateSlice";
import { useDispatch, useSelector } from "react-redux";
import { getAllMilkCollReport } from "../../../../../App/Features/Mainapp/Milk/MilkCollectionSlice";
import { useTranslation } from "react-i18next";
import Select from "react-select";
import { getDeductionDetails } from "../../../../../App/Features/Deduction/deductionSlice";
import { listSubLedger } from "../../../../../App/Features/Mainapp/Masters/ledgerSlice";

const DedeutionName = () => {
  const [formData, setFormData] = useState({
    DeductionId: "",
    srno: "",
    lno: "",
  });
  const { t } = useTranslation(["common", "milkcollection"]);
  const manualMaster = useSelector((state) => state.manualMasters.masterlist);
  const date = useSelector((state) => state.date.toDate);
  const dispatch = useDispatch();
  const [customerList, setCustomerList] = useState([]); // customerlist
  const [selectedMaster, setSelectedMaster] = useState([]); // corrent index of selected customer
  const deductionData = useSelector((state) => state.deduction.deductionData);
  const sledgerlist = useSelector((state) => state.ledger.sledgerlist);

  const centerSetting = useSelector(
    (state) => state.dairySetting.centerSetting
  );
  const [settings, setSettings] = useState({});
  const autoCenter = settings?.autoCenter;
  //set setting
  useEffect(() => {
    if (centerSetting?.length > 0) {
      setSettings(centerSetting[0]);
    }
  }, [centerSetting]);
  //----------------------------------------------------------------->
  // Get master dates and list customer
  useEffect(() => {
    dispatch(generateMaster(date));
    dispatch(listCustomer());
    dispatch(listSubLedger());
  }, []);

  //----------------------------------------------------------------->
  // Effect to load customer list from local storage
  useEffect(() => {
    const storedCustomerList = localStorage.getItem("customerlist");
    if (storedCustomerList) {
      setCustomerList(JSON.parse(storedCustomerList));
    }
  }, [dispatch]);

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

  //get dedeution details---->
  useEffect(() => {
    if (settings?.autoCenter !== undefined) {
      dispatch(getDeductionDetails(autoCenter));
    }
  }, [settings]);

  //option list show only name---------------->
  const options = deductionData.map((item) => ({
    DeductionId: item.DeductionId,
    value: item.DeductionId,
    label: `${item.DeductionName}`,
  }));

  // handle Select Change---------->
  const handleSelect1Change = (selectedOption) => {
    setFormData({
      ...formData,
      DeductionId: selectedOption.value,
    });
  };

  //cust option list show only code---------------->
  const custOptions = customerList.map((item) => ({
    srno: item.srno,
    value: item.srno,
    label: `${item.srno}`,
  }));

  //cust option list show only name---------------->
  const custOptions1 = customerList.map((item) => ({
    srno: item.srno,
    value: item.srno,
    label: `${item.cname}`,
  }));

  // handle cust Select Change---------->
  const handleCustSelectChange = (selectedOption) => {
    setFormData({
      ...formData,
      srno: selectedOption.value,
    });
  };

  //option sleg list show only name
  const slegOptions = sledgerlist.map((i) => ({
    value: i.lno,
    label: i.lno,
  }));
  //option sleg list show only id
  const slegOptions1 = sledgerlist.map((i) => ({
    value: i.lno,
    label: i.marathi_name,
  }));

  // handle sleg Select Change---------->
  const handleSlegSelectChange = (selectedOption) => {
    setFormData({
      ...formData,
      lno: selectedOption.value,
    });
  };

  return (
    <div className="dedeutionName-container w100 h1 d-flex-col">
      <span className="heading p10">कपात नावे भरणे</span>
      <div className="dedeutionName-form  d-flex-col mx10 px10 bg">
        <div className="    d-flex  my10 sb">
          <select
            className="custom-select label-text w30 "
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

          <div className="    d-flex">
            <span className="info-text">Batch No</span>
            <input type="text" className="data   h1" />
          </div>
        </div>
        <div className="w100     d-flex my10">
          <div className="w100 d-flex">
            <span className="info-text">कपात </span>
            <Select
              options={options}
              className="mx5 w30"
              placeholder=""
              isSearchable
              styles={{
                menu: (provided) => ({
                  ...provided,
                  zIndex: 200,
                }),
              }}
              value={options.find(
                (option) => option.value === formData.DeductionId
              )}
              onChange={handleSelect1Change}
            />
          </div>
        </div>
        <div className=" sb   d-flex my10">
          <div className="w90 d-flex">
            <span className="info-text">उत्पादक क्रमांक </span>
            <Select
              options={custOptions}
              className=" w20"
              placeholder=""
              isSearchable
              styles={{
                menu: (provided) => ({
                  ...provided,
                  zIndex: 200,
                }),
              }}
              value={custOptions.find(
                (option) => option.value === formData.srno
              )}
              onChange={handleCustSelectChange}
            />
            <Select
              options={custOptions1}
              className=" mx10 w80"
              placeholder=""
              isSearchable
              styles={{
                menu: (provided) => ({
                  ...provided,
                  zIndex: 200,
                }),
              }}
              value={custOptions1.find(
                (option) => option.value === formData.srno
              )}
              onChange={handleCustSelectChange}
            />
          </div>
          <div className=" d-flex">
            <span className="info-text">रक्कम </span>
            <input type="text" className="data " />
          </div>
          <div className=" d-flex">
            <button className="w-btn mx10">Add</button>
            <button className="w-btn ">Delete</button>
          </div>
        </div>
      </div>
      <div className="m10 d-flex-col h1 bg">
        <div className="d-flex   my5">
          <span className="info-text p10  ">जमा व्यवहार खतावणी नं. </span>
          <Select
            options={slegOptions}
            className="w10 mx5"
            placeholder=""
            isSearchable
            styles={{
              menu: (provided) => ({
                ...provided,
                zIndex: 200,
              }),
            }}
            value={slegOptions.find((option) => option.value === formData.lno)}
            onChange={handleSlegSelectChange}
          />

          {/* Second Select */}
          <Select
            options={slegOptions1}
            className="w40 mx5"
            placeholder=""
            isSearchable
            styles={{
              menu: (provided) => ({
                ...provided,
                zIndex: 200,
              }),
            }}
            value={slegOptions1.find((option) => option.value === formData.lno)}
            onChange={handleSlegSelectChange}
          />
        </div>
        <hr className="my15" />
        <div className="dedeutionName-custom-table d-flex mx5">
          <table className="dedeutionNamecustom">
            <thead>
              <tr>
                <th>Cust. No</th>
                <th>Cust. Name</th>
                <th>Names</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>ABC</td>
                <td>XYZ</td>
              </tr>
              <tr>
                <td>2</td>
                <td>DEF</td>
                <td>PQR</td>
              </tr>
              {/* Add more rows here */}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DedeutionName;
