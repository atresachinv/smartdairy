import { FaRegEdit } from "react-icons/fa";
import React, { useEffect, useState } from "react";
import { MdDeleteOutline } from "react-icons/md";
import Select from "react-select";
import "./credit.css";
import { useDispatch, useSelector } from "react-redux";
import { listSubLedger } from "../../../../App/Features/Mainapp/Masters/ledgerSlice";
import { listCustomer } from "../../../../App/Features/Customers/customerSlice";
const TransferCredit = () => {
  const [customerList, setCustomerList] = useState([]);
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    srno: "",
    GLCode: "",
    VoucherDate: "",
    BatchNo: "",
    Vtype: "",
    InstrType: "",
  });

  const sledgerlist = useSelector((state) => state.ledger.sledgerlist);

  // set today date
  useEffect(() => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      VoucherDate: getTodaysDate(),
    }));
  }, []);

  //gett todays date------------>
  const getTodaysDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };
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

  //option list show only name
  const options = sledgerlist.map((i) => ({
    value: i.lno,
    label: i.marathi_name,
  }));
  //option list show only id
  const options2 = sledgerlist.map((i) => ({
    value: i.lno,
    label: i.lno,
  }));
  // handle Select Change
  const handleSelectChange = (selectedOption, keyToUpdate) => {
    setFormData({
      ...formData,
      [keyToUpdate]: selectedOption.value,
    });
  };

  return (
    <div className="Credit-container w100 h1 d-flex-col">
      <div className="Credit-container-scroll d-flex-col w100">
        <span className=" heading p10">ट्रान्सफर चलन</span>
        <div className="credit-all-form d-flex w100 ">
          <div className="credit-form d-flex-col mx10 p10 bg">
            <div className="row d-flex w100  sb a-center ">
              <div className="w80  Deal-date-div d-flex a-center">
                <span className="info-text  ">व्यवहार दिनांक</span>
                <input
                  type="date"
                  className="data w50 "
                  value={formData.VoucherDate}
                  onChange={(e) =>
                    setFormData({ ...formData, VoucherDate: e.target.value })
                  }
                />
              </div>
              <div className="Batch No-div d-flex a-center mx10 sb">
                <span className="info-text   ">Batch No:</span>
                <input
                  type="text"
                  className="data w50"
                  value={formData.BatchNo}
                  onChange={(e) =>
                    setFormData({ ...formData, BatchNo: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="deal-container row w100 d-flex my5  sb a-center">
              <div className=" Deal-typr-div  w40  d-flex a-center">
                <span className="info-text w50">व्यवहार प्रकार</span>
                <select
                  className="data w50"
                  value={formData.Vtype}
                  onChange={(e) =>
                    setFormData({ ...formData, Vtype: e.target.value })
                  }
                >
                  <option value=""> Select</option>
                  <option value="1">नावे</option>
                  <option value="4">जमा</option>
                </select>
              </div>
              <div className=" bill-no-div w50 d-flex mx15 a-center sb">
                <span className="info-text">चलन नंबर</span>
                <input type="text" className="data w40" />
              </div>
            </div>
            <div className="  bill-type-check-container row w100 d-flex my5 sb a-center">
              <div className=" bill-type-div w50 d-flex a-center  ">
                <span className="info-text w50">पावती प्रकार</span>
                <select
                  className="data w50"
                  value={formData.InstrType}
                  onChange={(e) =>
                    setFormData({ ...formData, InstrType: e.target.value })
                  }
                >
                  <option value="">select</option>
                  <option value="0">चेक </option>
                  <option value="1">व्हॉउचर </option>
                </select>
              </div>
              <div className=" bill-number-div w50 d-flex mx15 a-center sb">
                <span className="info-text">पावती नं.</span>
                <input type="text" className="data w40" />
              </div>
            </div>
            <div
              className="w100  
            row sb d-flex my5"
            >
              <span className="info-text ">खतावणी नं.</span>
              <Select
                options={options2}
                className=" w20"
                placeholder=""
                isSearchable
                styles={{
                  menu: (provided) => ({
                    ...provided,
                    zIndex: 200,
                  }),
                }}
                value={options2.find(
                  (option) => option.value === formData.GLCode
                )}
                onChange={(selectedOption) =>
                  handleSelectChange(selectedOption, "GLCode")
                }
              />
              <Select
                options={options}
                className=" mx10 w50"
                placeholder=""
                isSearchable
                styles={{
                  menu: (provided) => ({
                    ...provided,
                    zIndex: 200,
                  }),
                }}
                value={options.find(
                  (option) => option.value === formData.GLCode
                )}
                onChange={(selectedOption) =>
                  handleSelectChange(selectedOption, "GLCode")
                }
              />
            </div>

            <div className=" w100  row sb d-flex my5">
              <span className="info-text">खाते क्र.</span>
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
                onChange={(selectedOption) =>
                  handleSelectChange(selectedOption, "srno")
                }
              />
              <Select
                options={custOptions1}
                className=" mx10 w60"
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
                onChange={(selectedOption) =>
                  handleSelectChange(selectedOption, "srno")
                }
              />
            </div>
            <div className="Amount-button-container  d-flex sb">
              <div className=" Amountt-div d-flex a-center w40 ">
                <span className="info-text ">रक्कम</span>
                <input type="text" className="data" />
              </div>
              <div className=" Amountt-div d-flex a-center w40 ">
                <span className="info-text">आज बॅलेन्स </span>
                <input type="text" className="data" />
              </div>
            </div>
            <div className="Amount-button-container  w100 d-flex sb">
              <div className=" Amountt-div d-flex a-center  w60 mx5">
                <span className="info-text ">तपशील </span>
                <input type="text" className="data  " />
              </div>
              <div className=" Amountt-div d-flex a-center  ">
                <input type="checkbox" name="" id="" />
                <span className="info-text mx10 w100 ">एक खतावणी व्यवहार</span>
              </div>
            </div>
          </div>
          <div className="credit-batchTally d-flex-col mx5  bg ">
            <div className="m10 p10 bg-light-skyblue">
              बॅच टॅलि
              <div className="d-flex a-center ">
                <span className="w50 info-text">नावे </span>
                <input type="text" className="data" />
              </div>
              <div className="d-flex a-center my10">
                <span className="w50 info-text">जमा </span>
                <input type="text" className="data" />
              </div>
              <div className="d-flex a-center ">
                <span className="w50 info-text">बॅच फरक </span>
                <span className="w50 req info-text">{0} </span>
              </div>
            </div>
            <div className="m10 p10 bg-light-green">
              चेक/डी.डी. माहिती
              <div className="d-flex a-center ">
                <span className="w50 info-text"> चेक/डी.डी.</span>
                <input type="text" className="data" />
              </div>
              <div className="d-flex a-center my10  ">
                <span className="  info-text">दिनांक </span>
                <input type="date" className="w70 data " />
              </div>
            </div>
          </div>
          <div className="credit-batchTally-buttons d-flex-col mx10 p10 bg">
            <button className="w-btn ">नवीन बॅच</button>
            <button className="w-btn ">नवीन चलन</button>
            <button className="w-btn ">सेव करा</button>
            <button className="w-btn ">अपडेट करा</button>
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
                  <td className="info-text">चलन</td>
                  <td className="info-text">ख. नं.</td>
                  <td className="info-text">खतावणी नाव</td>
                  <td className="info-text">खाते</td>
                  <td className="info-text">खातेदार नाव</td>
                  <td className="info-text">रक्कम</td>
                  <td className="info-text">व्यवहार</td>
                  <td className="info-text">बॅच</td>
                  <td>
                    <MdDeleteOutline className="icon" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransferCredit;
