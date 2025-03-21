import React from "react";
import "../../../../../Styles/DeductionReport/Deduction.css";

const DeductionHead = () => {
  return (
    <>
      <div className="Deduction-head-container w100 h1 d-flex-col bg ">
        <h1 className="heading ">Deduction Head</h1>
        <div className="deduction-head-span-input-half-div w100 h40 d-flex-col">
          <div className="deduction-no-and-checkbox-div d-flex h20 a-center  ">
            <div className="deduction-code-milk-payment-div w50 h1 d-flex a-center">
              <div className="deduction-number-div w50 h1 d-flex a-center">
                <span className="label-text w50">Deduction No:</span>
                <input className="data w30" type="text" />
              </div>
              <div className="code-number-div w50 h1 d-flex a-center">
                <span className="label-text w20"> Code:</span>
                <input className="data w30" type="text" />
              </div>
            </div>
            <div className="checkbox-payment-bill-all-deduction w50 h1 d-flex a-center">
              <div className="Milk-pyment-Show-Stop-div w50 h1 d-flex a-center">
                <input className="data w20" type="checkbox" />
                <span className="label-text w100">Payment Bill Stop</span>
              </div>
              <div className="All-Deduction-Div w50 h1 d-flex a-center">
                <input className="data w20" type="checkbox" />
                <span className="label-text w100">All Deduction</span>
              </div>
            </div>
          </div>
          <div className="deduction-name-eng-and-marathi  w100 h25 d-flex a-center">
            <div className="Marathi-name-deduction-div d-flex w50 h1 a-center">
              <span className="label-text w30">कपात नाव :</span>
              <input className="data w60" type="text" />
            </div>
            <div className="English-name-deduction-div d-flex w50 h1 a-center">
              <span className="label-text w30">Eng name:</span>
              <input className="data w60" type="text" />
            </div>
          </div>
          <div className="nave-acc-no-jama-Acc-no w100 d-flex h20 a-center">
            <div className="name-acc-contsiner-div w50 d-flex h1 ">
              <div className="nave-acc-no-div w40 d-flex h1 a-center p10">
                <span className="label-text w80">Name-Acc-No:</span>
              </div>
              <div className="select-input-deduction-div w60">
                <select className="data w30 " name="" id=""></select>
                <input className="data w60" type="text" />
              </div>
            </div>

            <div className="name-acc-contsiner-div w50 d-flex h1 ">
              <div className="nave-acc-no-div w40 d-flex h1 a-center p10">
                <span className="label-text w80">Name-Acc-No:</span>
              </div>
              <div className="select-input-deduction-div w60">
                <select className="data w30 " name="" id=""></select>
                <input className="data w60" type="text" />
              </div>
            </div>
          </div>
          <div className="deduction-button-div w100 h20 d-flex a-center sa">
            <button className="w-btn">Register</button>
            <button className="w-btn">Edit</button>
            <button className="w-btn">Delete</button>
            <button className="w-btn">Cancel</button>
          </div>
        </div>
        <div className="Deductionhead-table-section-container w100 h60 d-flex-col">
          <div className="Deductionhead-table-heading-container w100  h20 d-flex sa a-center">
            <span className="">Deduction Code</span>
            <span className="">Deduction Name</span>
            <span className="">GL Number</span>
            <span className="">GL Name</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default DeductionHead;
