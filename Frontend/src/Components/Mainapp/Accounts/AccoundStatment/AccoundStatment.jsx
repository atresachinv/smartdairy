import React, { useEffect, useMemo, useState } from "react";
import "../../../../Styles/AccoundStatment/AccoundStatment.css";
import { useDispatch, useSelector } from "react-redux";
import { listSubLedger } from "../../../../App/Features/Mainapp/Masters/ledgerSlice";
import { listCustomer } from "../../../../App/Features/Customers/customerSlice";
import Select from "react-select";

const getTodaysDate = () => {
  const today = new Date();
  return today.toISOString().split("T")[0];
};
const AccoundStatment = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    accCode: "",
    GLCode: "",
    autoCenter: "",
    fromVoucherDate: "",
    toVoucherDate: getTodaysDate(),
  });
  const [voucherList, setVoucherlist] = useState([]);
  const centerList = useSelector(
    (state) => state.center.centersList.centersDetails || []
  );
  const sledgerlist = useSelector((state) => state.ledger.sledgerlist);
  const [customerList, setCustomerList] = useState([]);
  const centerId = useSelector((state) => state.dairy.dairyData.center_id);
  const [filter, setFilter] = useState(0);

  useEffect(() => {
    dispatch(listSubLedger());
    dispatch(listCustomer());
  }, []);

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

  //----------------------------------------------------------------->
  // Effect to load customer list from local storage
  useEffect(() => {
    const storedCustomerList = localStorage.getItem("customerlist");
    if (storedCustomerList) {
      if (centerId === 0) {
        const filteredCustomerList = JSON.parse(storedCustomerList).filter(
          (customer) => Number(customer.centerid) === Number(filter)
        );
        setCustomerList(filteredCustomerList);

        const filteredVoucherList = voucherList.filter(
          (item) => Number(item.center_id) === Number(filter)
        );
        setVoucherlist(filteredVoucherList);
      } else {
        const filteredCustomerList = JSON.parse(storedCustomerList).filter(
          (customer) => Number(customer.centerid) === Number(centerId)
        );
        setCustomerList(filteredCustomerList);
        const filteredVoucherList = voucherList.filter(
          (item) => Number(item.center_id) === Number(centerId)
        );
        setVoucherlist(filteredVoucherList);
      }
    }
  }, [centerId, filter, voucherList]);

  // handle Select Change
  const handleSelectChange = (selectedOption, keyToUpdate) => {
    setFormData({
      ...formData,
      [keyToUpdate]: selectedOption.value,
    });
  };

  return (
    <div className="accound-Statment-container w100 h1 d-flex ">
      <div className="GL-customer-Date-first-half-containr w70 h1 d-flex-col ">
        <span className="px10 heading">Accound Statment</span>
        {centerId > 0 ? (
          <></>
        ) : (
          <div className="d-flex a-center mx10">
            <span className="info-text">सेंटर निवडा :</span>
            <select
              className="data w50 a-center  my5 mx5"
              name="center"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              {centerList &&
                [...centerList]
                  .sort((a, b) => a.center_id - b.center_id)
                  .map((center, index) => (
                    <option key={index} value={center.center_id}>
                      {center.center_name}
                    </option>
                  ))}
            </select>
          </div>
        )}
        <div
          className="w100  
                     row sb d-flex my5 "
        >
          <span className="info-text ">खतावणी नं.</span>
          <input
            type="text"
            id="GLCode"
            className="data w20"
            autoComplete="off"
            onFocus={(e) => e.target.select()}
            value={formData.GLCode}
            onChange={(e) =>
              setFormData({ ...formData, GLCode: e.target.value })
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
            value={
              formData.GLCode
                ? options.find(
                    (option) => option.value === Number(formData.GLCode)
                  )
                : null
            }
            onChange={(selectedOption) => {
              handleSelectChange(selectedOption, "GLCode");
            }}
          />
        </div>

        <div className="customer-number-span-inputdiv w100 h10 d-flex a-center ">
          <span className="label-text w15">ग्राहक</span>
          <input
            type="text"
            id="accCode"
            className="data w20"
            autoComplete="off"
            onFocus={(e) => e.target.select()}
            value={formData.accCode}
            onChange={(e) =>
              setFormData({ ...formData, accCode: e.target.value })
            }
          />

          <Select
            options={custOptions1}
            className=" mx10 w50"
            placeholder=""
            isSearchable
            styles={{
              menu: (provided) => ({
                ...provided,
                zIndex: 200,
              }),
            }}
            value={
              formData.accCode
                ? custOptions1.find(
                    (option) => option.value === Number(formData.accCode)
                  )
                : null
            }
            onChange={(selectedOption) => {
              handleSelectChange(selectedOption, "accCode");
            }}
          />
        </div>
        <div className="from-to-date-accound-statmentt w70 h10 d-flex a-center sb">
          <div className="date-from-acc-statment w50 d-flex a-center sa ">
            <span className="label-text w50">दिनाक पासून</span>
            <input className="data w60 " type="date" />
          </div>
          <div className="date-from-acc-statment w50 d-flex a-center sa ">
            <span className="label-text w50">दिनाक पर्येंत</span>
            <input
              className="data w60"
              value={formData.toVoucherDate}
              type="date"
            />
          </div>
        </div>
        <div className="Accound-Statment-buttons w70 h20 px10 d-flex a-center">
          <button className="w-btn">रिपोर्ट</button>
        </div>
      </div>
    </div>
  );
};

export default AccoundStatment;
