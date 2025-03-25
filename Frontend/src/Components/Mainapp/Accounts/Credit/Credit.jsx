import { FaRegEdit } from "react-icons/fa";
import React, { useEffect, useState } from "react";
import { MdDeleteOutline } from "react-icons/md";
import Select from "react-select";
import "./credit.css";
import { useDispatch } from "react-redux";
import { listSubLedger } from "../../../../App/Features/Mainapp/Masters/ledgerSlice";
import { listCustomer } from "../../../../App/Features/Customers/customerSlice";
const Credit = () => {
  const [customerList, setCustomerList] = useState([]);
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    srno: "",
  });
  // Get master dates and list customer
  useEffect(() => {
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

  return (
    <div className="Credit-container w100 h1 d-flex-col">
      <span className="heading p10">व्यवहार भरणे</span>
      <div className="credit-form d-flex-col mx10 px10 bg">
        <div className="row d-flex my10 sb">
          <div className="d-flex">
            <span className="info-text w70">व्यवहार दिनांक</span>
            <input type="date" className="data" />
          </div>
          <div className="d-flex">
            <span className="info-text">Batch No</span>
            <input type="text" className="data h1" />
          </div>
        </div>
        <div className="row w100 d-flex my10 sb">
          <div className="w50 d-flex">
            <span className="info-text w50">व्यवहार प्रकार</span>
            <select className="data w40">
              <option value=""> </option>
              <option value="0">ट्रान्सफर </option>
              <option value="1">रोख </option>
            </select>
          </div>
          <div className="w50 d-flex mx15">
            <span className="info-text">चलन नंबर</span>
            <input type="text" className="data w30" />
          </div>
        </div>
        <div className="row w100 d-flex my10 sb">
          <div className="w50 d-flex">
            <span className="info-text w50">पावती प्रकार</span>
            <select className="data w40">
              <option value=""> </option>
              <option value="0">चेक </option>
              <option value="1">कार्यालय चलन </option>
            </select>
          </div>
          <div className="w50 d-flex mx15">
            <span className="info-text">पावती नं.</span>
            <input type="text" className="data w30" />
          </div>
        </div>
        <div className="row sb d-flex my10">
          <div className="w90 d-flex">
            <span className="info-text">उत्पादक क्रमांक</span>
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
          <div className="d-flex">
            <span className="info-text">रक्कम</span>
            <input type="text" className="data" />
          </div>
          <div className=" d-flex">
            <button className="w-btn mx10">Add</button>
            <button className="w-btn">Delete</button>
          </div>
        </div>
      </div>
      <div className="credit-table d-flex-col m10 px10 h1 bg">
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Edit</th>
                <th>चलन</th>
                <th>ख. नं.</th>
                <th>खतावणी नाव</th>
                <th>खाते</th>
                <th>खातेदार नाव</th>
                <th>रक्कम</th>
                <th>व्यवहार</th>
                <th>बॅच</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <FaRegEdit className="icon" />
                </td>
                <td>चलन</td>
                <td>ख. नं.</td>
                <td>खतावणी नाव</td>
                <td>खाते</td>
                <td>खातेदार नाव</td>
                <td>रक्कम</td>
                <td>व्यवहार</td>
                <td>बॅच</td>
                <td>
                  {" "}
                  <MdDeleteOutline className="icon" />
                </td>
              </tr>
              <tr>
                <td>
                  <FaRegEdit className="icon" />
                </td>
                <td>चलन</td>
                <td>ख. नं.</td>
                <td>खतावणी नाव</td>
                <td>खाते</td>
                <td>खातेदार नाव</td>
                <td>रक्कम</td>
                <td>व्यवहार</td>
                <td>बॅच</td>
                <td>
                  <MdDeleteOutline className="icon" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Credit;
