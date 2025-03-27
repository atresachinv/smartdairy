import React, { useEffect, useState } from "react";
import "../../../Styles/Billlist-div/Bill-list.css";

const Payments = () => {
  // Retrieve isselected from localStorage, defaulting to 0 if not set
  const [isselected, setIsselected] = useState(
    parseInt(localStorage.getItem("selectedNavIndex")) || 0
  );

  // Update localStorage whenever isselected changes
  useEffect(() => {
    localStorage.setItem("selectedNavIndex", isselected);
  }, [isselected]);

  return (
    <>
      <div className="Bil-list-container w100 h1 d-flex-col bg">
        <label className="heading " htmlFor="">
          Payment
        </label>
        <div className="bil-date-from-to-and-button-first-half-div w100 h35  d-flex-col">
          <div className="bill-date-15day-to-button-div p10 d-flex w100 ">
            <div className="bil-datee-div d-flex w40 a-center px10 ">
              <span className="label-text w30">बिल दिनांक :</span>
              <input className="data w50" type="date" />
            </div>
            <div className="panderwada-fromDay-From-datee-div d-flex w40 a-center px10 ">
              <span className="label-text w40">पंधरवडा दिनांक पासून </span>
              <input className="data w50" type="date" />
            </div>
            <div className="Bill-show-date-button w20">
              <button className="w-btn">दाखवा</button>
            </div>
          </div>
          <div className="Vochucher-date-15day-to-button-div p10 d-flex w100 ">
            <div className="Vochucher-datee-div d-flex w40 a-center px10 ">
              <span className="label-text w35">वोउचेर दिनांक:</span>
              <input className="data w50" type="date" />
            </div>
            <div className="pandarwadaDay-From-second-datee-div d-flex w40 a-center px10 ">
              <span className="label-text w40">पंधरवडा दिनांक पर्येंत</span>
              <input className="data w50" type="date" />
            </div>
            <div className="Bill-create-date-button w10">
              <button className="w-btn">बिल पाहणे </button>
            </div>
          </div>
          <div className="bill-list-checkbox-container w100 h20 d-flex">
            <div className="check-acc-div w30 d-flex h1 px10">
              <input className="w10" type="checkbox" />
              <span className="w30 label-text">Check Acc</span>
            </div>
            <div className="Auto-kapat-div w30 d-flex h1 px10">
              <input className="w10" type="checkbox" />
              <span className="w50 label-text">ऑटो कपात</span>
            </div>
          </div>
          <div className="code-no-from-to-button-div w100 h20 my10 d-flex px10 a-center">
            <div className="code-from-to-div w60 h1 d-flex">
              <div className="from-code-no-div w40 h1 d-flex a-center">
                <span className="w60">कोड.न पासून</span>
                <input className=" data w30" type="text" />
              </div>
              <div className="to-code-no-div w40 h1 d-flex a-center">
                <span className="w10"> ते </span>
                <input className=" data w30" type="text" />
              </div>
            </div>
            <div className="buttons-milk-payment w40 h1 d-flex a-center sa">
              <button className="w-btn w50"> बिल कपात</button>
              <button className="w-btn w50">कपात यादी</button>
            </div>
          </div>
        </div>
        <div className="Bil-list-table-button-link-second-container d-flex-col w100 h65 ">
          <div className="table-secoin-div-and-buttons-div w100 d-flex h80 px10">
            <div className="bil-list-tabel-section-div w60 d-flex-col h1">
              <div className="table-heading-section w100  h40 sa  d-flex">
                <span>उत्पादक.क्र </span>
                <span>उत्पादक नाव </span>
                <span>Amount</span>
              </div>
              <div className="table-data-section-div w100 d-flex mx90 hidescrollbar">
                <div className="Bill-list-table-data-div  w100 h1  d-flex sa  ">
                  <span>Code</span>
                  <span>Customer Name</span>
                  <span>Amount</span>
                </div>
              </div>
            </div>

            <div className="button-section-div px10 w40 h1 d-flex ">
              <div className="buttons-first-section-div w50 h1 d-flex-col sa ">
                <button className="w-btn  my5">संकलन रिपोर्ट </button>
                <button className="w-btn my5">कपात रिपोर्ट</button>
                <button className="w-btn my5">संकलन दुरुस्थी </button>
                <button className="w-btn my5">Payment रजिस्टर </button>
                <button className="w-btn my5">Payment समरी </button>
                <button className="w-btn my5">Payment रजिस्टर बँक </button>
                <button className="w-btn my5">बिल यादी 1 </button>
              </div>
              <div className="buttons-second-section-div w50 h1 d-flex-col sa ">
                <button className="w-btn  my5">Collection Report</button>
                <button className="w-btn my5">Deduction Report</button>
                <button className="w-btn my5">Collection Update</button>
                <button className="w-btn my5">Payment Register</button>
                <button className="w-btn my5">Payment Summary</button>
                <button className="w-btn my5">Payment Regi</button>
                <button className="w-btn my5">Bill List 1</button>
              </div>
            </div>
          </div>
          <div className="bill-payments-container-div w60 px10 sa d-flex">
            <button className="w-btn ">निवडलेले बिल Delete करा </button>
            <button className="w-btn">सर्व बिल Delete करा </button>
            <button className="w-btn">पंधरवडा दूध बिल रद्द करा </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Payments;
