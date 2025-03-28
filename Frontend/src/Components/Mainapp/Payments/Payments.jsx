import React, { useEffect, useRef, useState } from "react";
import "../../../Styles/Mainapp/Payments/Payments.css";
import { useDispatch, useSelector } from "react-redux";
import { listCustomer } from "../../../App/Features/Mainapp/Masters/custMasterSlice";

const Payments = () => {
  const dispatch = useDispatch();
  const tDate = useSelector((state) => state.date.toDate);
  const custno = useSelector((state) => state.customer.maxCustNo);
  const bdateRef = useRef(null);
  const vcdateRef = useRef(null);
  const fdateRef = useRef(null);
  const tdateRef = useRef(null);
  const fcustRef = useRef(null);
  const tcustRef = useRef(null);
  const submitbtn = useRef(null);

  const initialData = {
    billDate: "",
    vcDate: "",
    fromDate: "",
    toDate: "",
    custFrom: "" || 1,
    custTo: "",
    commission: "",
    autodeduct: "",
  };

  const [formData, setFormData] = useState(initialData);

  useEffect(() => {
    dispatch(listCustomer());
  }, [dispatch]);

  useEffect(() => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      custTo: `${Math.abs(custno - 1)}`,
      billDate: tDate,
    }));
  }, [custno, tDate]);

  const handleInput = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // handle enter press move cursor to next refrence Input -------------------------------->
  const handleKeyDown = (e, nextRef) => {
    if (e.key === "Enter" && nextRef.current) {
      e.preventDefault();
      nextRef.current.focus();
    }
  };

  return (
    <>
      <div className="Bil-list-container w100 h1 d-flex-col sb p10">
        <label className="heading " htmlFor="">
          Payment
        </label>
        <form className="generate-bill-form-container w100 h20 d-flex sb br6">
          <div className="bill-voucher-date-container w30 px10 d-flex-col bg-light-skyblue br6 sa px10">
            <div className="bil-date-div d-flex w100 h1 a-center sb">
              <label htmlFor="billdate" className="label-text w40">
                बिल दिनांक :
              </label>
              <input
                className="data w60"
                type="date"
                id="billdate"
                name="billDate"
                onChange={handleInput}
                value={formData.billDate || ""}
                onKeyDown={(e) => handleKeyDown(e, vcdateRef)}
                ref={bdateRef}
              />
            </div>
            <div className="Voucher-date-div d-flex w100 h1 a-center sb">
              <label htmlFor="vcdate" className="label-text w40">
                व्हाऊचर दिनांक :
              </label>
              <input
                id="vcdate"
                className="data w60"
                type="date"
                name="vcDate"
                onChange={handleInput}
                onKeyDown={(e) => handleKeyDown(e, fdateRef)}
                ref={vcdateRef}
              />
            </div>
          </div>
          <div className="payment-dates-container w40 d-flex-col  bg-light-skyblue br6 sa px10">
            <div className="pay-fromdate-div d-flex w100 h1 a-center sb">
              <label htmlFor="fdate" className="label-text w40">
                पंधरवडा दिनांक पासून :
              </label>
              <input
                id="fdate"
                className="data w50"
                type="date"
                name="fromDate"
                onChange={handleInput}
                onKeyDown={(e) => handleKeyDown(e, tdateRef)}
                ref={fdateRef}
                max={formData.toDate}
              />
            </div>
            <div className="pay-todate-div d-flex w100 h1 a-center sb">
              <label htmlFor="tdate" className="label-text w40">
                पंधरवडा दिनांक पर्येंत :
              </label>
              <input
                id="tdate"
                className="data w50"
                type="date"
                name="toDate"
                onChange={handleInput}
                ref={tdateRef}
                max={formData.billDate}
              />
            </div>
          </div>
          <div className="checkbox-container w10 h1 d-flex-col se a-center">
            <div className="check-acc-div w100 h50 d-flex a-center sb">
              <input
                id="comm"
                className="w20"
                type="checkbox"
                name="commission"
                onChange={handleInput}
              />
              <label htmlFor="comm" className="w70 label-text">
                कमिशन
              </label>
            </div>
            <div className="Auto-kapat-div w100 h50 d-flex a-center sb">
              <input
                id="adeduct"
                className="w20"
                name="autodeduct"
                type="checkbox"
                onChange={handleInput}
              />
              <label htmlFor="adeduct" className="w70 label-text">
                ऑटो कपात
              </label>
            </div>
          </div>
          <div className="code-no-from-to-button-div w10 h1 d-flex-col se a-center">
            <button type="button" className="w-btn">
              पाहणे
            </button>
            <button type="submit" className="w-btn">
              बिल निर्माण
            </button>
          </div>
        </form>
        <div className="payment-details-and-report-btn-div w100 h70 d-flex sb">
          <div className="payment-data-report-btn-div w70 h1 d-flex-col se px10">
            <div className="customer-code-div w100 h10 d-flex a-center sb px10">
              <span className="label-text">Payment Details : </span>
              <div className="cust-code-div d-flex w50 h1 sb a-center">
                <label htmlFor="cform" className="w30">
                  कोड नं पासून :
                </label>
                <input
                  id="cform"
                  className="data w30"
                  type="text"
                  name="custFrom"
                  value={formData.custFrom}
                  onChange={handleInput}
                  onKeyDown={(e) => handleKeyDown(e, tcustRef)}
                  ref={fcustRef}
                />
                <label htmlFor="custTo" className="w10 t-center">
                  ते :
                </label>
                <input
                  id="custTo"
                  className="data w30"
                  type="text"
                  name="custTo"
                  value={formData.custTo}
                  onChange={handleInput}
                  ref={tcustRef}
                />
              </div>
            </div>
            <div className="bill-payments-details-container w100 h70 d-flex-col mh70 hidescrollbar bg">
              <div className="bill-heading-div w100 p10 d-flex a-center t-center sb sticky-top bg7 br6">
                <span className="f-label-text w10">उत्पा.क्र </span>
                <span className="f-label-text w40">उत्पादकाचे नाव </span>
                <span className="f-label-text w20">रक्कम</span>
              </div>
              <div className="bill-data-div w100 p10 d-flex a-center t-center sb">
                <span className="info-text w10">उत्पा.क्र</span>
                <span className="info-text w40">उत्पादकाचे नाव</span>
                <span className="info-text w20">रक्कम</span>
              </div>
            </div>

            <div className="bill-form-btn-div w100 h10 d-flex j-end">
              <button className="btn">काढूण टाका</button>
              <button className="w-btn mx10">सर्व काढूण टाका</button>
              <button className="btn">बिल रद्द करा </button>
            </div>
          </div>
          <div className="bill-payments-container-div w30 d-flex f-wrap se">
            <button className="w-btn w45">संकलन रिपोर्ट </button>
            <button className="w-btn w45">कपात रिपोर्ट</button>
            <button className="w-btn w45">संकलन दुरुस्थी </button>
            <button className="w-btn w45">Payment रजिस्टर </button>
            <button className="w-btn w45">Payment समरी </button>
            <button className="w-btn w45">Payment रजिस्टर बँक </button>
            <button className="w-btn w45">बिल यादी 1 </button>
            <button className="w-btn w45">Collection Report</button>
            <button className="w-btn w45">Deduction Report</button>
            <button className="w-btn w45">Collection Update</button>
            <button className="w-btn w45">Payment Register</button>
            <button className="w-btn w45">Payment Summary</button>
            <button className="w-btn w45">Payment Regi</button>
            <button className="w-btn w45">Bill List 1</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Payments;
