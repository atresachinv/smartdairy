import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BsChevronDoubleLeft, BsChevronDoubleRight } from "react-icons/bs";
import "../../../../../Styles/PayDeductions/PayDeductions.css";

const PayDeductions = () => {
  const dispatch = useDispatch();
  const customerlist = useSelector(
    (state) => state.customers.customerlist || []
  );
  const [customerName, setCustomerName] = useState(""); // customername
  const [currentIndex, setCurrentIndex] = useState(1); // corrent index of selected customer

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
      prevIndex === customerlist.length ? 1 : prevIndex + 1
    );
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 1 ? customerlist.length : prevIndex - 1
    );
  };

  //----------------------------------------------------------------->
  // Filter milk collection data for the current customer

  useEffect(() => {
    // if (data.length > 0) {
    //   const currentCustomerData = data.filter(
    //     (entry) => entry.rno.toString() === currentIndex.toString()
    //   );
    //   setCustomerName(currentCustomerData[0]?.cname || "");
    //   const morning = currentCustomerData.filter((entry) => entry.ME === 0);
    //   const evening = currentCustomerData.filter((entry) => entry.ME === 1);
    //   setMorningData(morning);
    //   setEveningData(evening);
    // }
  }, [currentIndex]);

  return (
    <>
      <div className="payment-bill-deduction-main-container w100 h1 d-flex-col p10">
        <span className="heading px10">Bill</span>
        <div className="payment-deduction-info-outer-container w100 h50 d-flex">
          <div className="payment-deduction-info-container w50 h1 d-flex-col sb">
            <div className="paymebt-bill-customer-details-div w100 h20 d-flex a-center sb">
              <div className="bill-no-comopent w30 d-flex a-center sb px10">
                <span className="label-text w40">Bill No :</span>
                <input className="data w50" type="text" />
              </div>
              <div className="bill-date-comopent w40 d-flex a-center sb px10">
                <span className="label-text w40">Bill Date:</span>
                <input className="data w60" type="date" />
              </div>
              <button className="btn">संकलन तपशील दर्शवा </button>
            </div>
            <div className="customer-details-container w100 h20 d-flex a-center sb">
              <div className="btn-code-container w35 h1 d-flex a-center sb">
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
                className="cust_name data w60"
                type="text"
                name=""
                id=""
                value={customerName}
                readOnly
                placeholder="Customer Name"
              />
            </div>
            <div className="bil-payment-deduction-first-half w100 h60 d-flex-col sa">
              <div className="morening-evening-all-collection w100 d-flex sb">
                <div className="morening-liter-compoentv w32 d-flex a-center sb">
                  <span className="label-text w60">सकाळ लि :</span>
                  <input className="data w40" type="text" />
                </div>
                <div className="morening-liter-compoentv w32 d-flex a-center sb">
                  <span className="label-text w60">सायंकाळ लि :</span>
                  <input className="data w40" type="text" />
                </div>
                <div className="morening-liter-compoentv w32 d-flex a-center sb">
                  <span className="label-text w60">एकूण संकलन :</span>
                  <input className="data w40" type="text" />
                </div>
              </div>
              <div className="collection-commision-all-commission w100 sb d-flex">
                <div className="morening-commision-compoent w32 d-flex a-center sb">
                  <span className="label-text w60">स.कमिशन:</span>
                  <input className="data w40" type="text" />
                </div>
                <div className="Eveninng-commission-compoent w32 d-flex a-center sb">
                  <span className="label-text w60">सायं.कमिशन:</span>
                  <input className="data w40" type="text" />
                </div>
                <div className="all-commission w32 d-flex a-center sb">
                  <span className="label-text w60">एकूण कमिशन :</span>
                  <input className="data w40" type="text" />
                </div>
              </div>
              <div className="sari-all-commission-container w100 sb d-flex">
                <div className="sari-all-commission-compoent w32 d-flex a-center sb">
                  <span className="label-text w60">स. रीबेट क. :</span>
                  <input className="data w40" type="text" />
                </div>
                <div className="evening-ri-compoentv w32 d-flex a-center sb">
                  <span className="label-text w60">सायं. रीबेट क. :</span>
                  <input className="data w40" type="text" />
                </div>
                <div className="all-ri-liter-compoentv w32 d-flex a-center sb">
                  <span className="label-text w60">एकूण रीबेट क. :</span>
                  <input className="data w40" type="text" />
                </div>
              </div>
            </div>
          </div>
          <div className="payment-milk-details-container w50 h1 d-flex"></div>
        </div>
        <div className="payment-deduction-details-table-container  w100 h60  d-flex sb">
          <div className="payment-deduction-table-container  w50 h1 mh100 hidescrollbar d-flex-col bg">
            <div className="deduction-heading-container w100 p10 sa d-flex a-center t-center sticky-top bg7 br6">
              <span className="f-label-text w30">कपातीचे नाव</span>
              <span className="f-label-text w20">मागील</span>
              <span className="f-label-text w20">कपात</span>
              <span className="f-label-text w20">शिल्लक</span>
            </div>
            <div className="deduction-heading-container w100 p10 sa d-flex a-center">
              <span className="info-text w30 t-start">कपातीचे नाव</span>
              <span className="info-text w20 t-end">मागील</span>
              <span className="info-text w20 t-end">कपात</span>
              <span className="info-text w20 t-end">शिल्लक</span>
            </div>
          </div>
          <div className="payment-amt-details-container w45 h1 d-flex-col se">
            <div className="deduction-amount-container w100 h25 d-flex a-center sb">
              <div className="deduction-details w20 h1 d-flex-col a-center sb">
                <label htmlFor="">एकूण रक्कम </label>
                <span id="" className="data t-center label-text">
                  0.0
                </span>
              </div>
              <div className="deduction-details w20 h1 d-flex-col a-center sb">
                <label htmlFor="">एकूण कमिशन</label>
                <span id="" className="data t-center label-text">
                  0.0
                </span>
              </div>
              <div className="deduction-details w20 h1 d-flex-col a-center sb">
                <label htmlFor="">एकूण अनामत</label>
                <span id="" className="data t-center label-text">
                  0.0
                </span>
              </div>
              <div className="deduction-details w20 h1 d-flex-col a-center sb">
                <label htmlFor="">एकूण वाहतूक</label>
                <span id="" className="data t-center label-text">
                  0.0
                </span>
              </div>
            </div>
            <div className="deduction-amount-container w100 h25 d-flex a-center sb">
              <div className="deduction-details w20 h1 d-flex-col a-center sb">
                <label htmlFor="">एकूण कपात</label>
                <span id="" className="data t-center label-text">
                  0.0
                </span>
              </div>
              <div className="deduction-details w20 h1 d-flex-col a-center sb">
                <label htmlFor="">राउंड रक्कम</label>
                <span id="" className="data t-center label-text">
                  0.0
                </span>
              </div>
              <div className="deduction-details w20 h1 d-flex-col a-center sb">
                <label htmlFor="">निव्वळ देय</label>
                <span id="" className="data t-center label-text">
                  0.0
                </span>
              </div>
              <div className="deduction-details w20 h1 d-flex-col a-center sb"></div>
            </div>
            <div className="deduction-amount-container w100 h25 d-flex a-center sb">
              <div className="deduction-details w30 h1 d-flex-col a-center sb">
                <label htmlFor="">कमीत कमी रक्कम</label>
                <span id="" className="data t-center label-text">
                  0.0
                </span>
              </div>
              <button type="submit" className="btn">
                बिल सेव्ह करा
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PayDeductions;
