import React from "react";
 import "../../../../../Styles/Trn-check/Trncheck.css";
const TrnCheck = () => {
  return (
    <div className="Trncheck-container w100 h1 d-flex-col  ">
      <span className="px10 heading">TRN Check</span>
      <div className="trn-first-half-div w100 h40 d-flex-col  sa ">
        <div className="centerwise-data-selection-div w100 d-flex a-center h15">
          <span className="px10 label-text w10">निवडा सेंटर :</span>
          <select className="data w50" name="" id=""></select>
        </div>
        <div className="from-to-date-andradio-button w100 h50 d-flex">
          <div className="from-to-date-trn-date w50 d-flex h1  ">
            <div className="from-to-datetrn-check w70 d-flex-col sa   ">
              <div className="from-date-trn-cheks-div w100 d-flex a-center">
                <span className="px10 label-text w30">पासून</span>
                <input className="data w40" type="date" />
              </div>
              <div className="To-date-trn-cheks-div w100 d-flex a-center">
                <span className="px10 label-text w30">पर्येंत </span>
                <input className="data w40" type="date" />
              </div>
            </div>
            <div className="sale-and-purches-trn-div w30 d-flex-col sa   ">
              <div className="saleing-trn-div w70  d-flex se">
                <input className="w10" type="radio" />
                <span className="label-text">विक्री</span>
              </div>
              <div className="purches-trn-div w70 se  d-flex">
                <input className="w10" type="radio" />
                <span className="label-text">खरेदी</span>
              </div>
            </div>
          </div>
          <div className="pashukhandya-radio-btn-trn-div w50 d-flex a-center sa   ">
            <div className="first-radio-and-span-inputbtn w50 d-flex-col a-center sa ">
              <div className="saleing-trn-div w100 a-center  d-flex se">
                <input className="w10" type="radio" />
                <span className="label-text w20">पशुखाद्य </span>
              </div>
              <div className="purches-trn-div w100 se a-center  d-flex">
                <input className="w10" type="radio" />
                <span className="label-text w20">औषधें</span>
              </div>
              <div className="purches-trn-div w100 se  d-flex a-center">
                <input className="w10" type="radio" />
                <span className="label-text w20">किराणा</span>
              </div>
              <div className="purches-trn-div w100 se  d-flex a-center">
                <input className="w10" type="radio" />
                <span className="label-text w20">साहित्य भांडार</span>
              </div>
            </div>
            <div className="radio-buttons-second-div w50 d-flex-col ">
              <div className="purches-trn-div w100 se  d-flex a-center">
                <input className="w10" type="radio" />
                <span className="label-text w30">बिल </span>
              </div>
              <div className="purches-trn-div w100 se  d-flex a-center">
                <input className="w10" type="radio" />
                <span className="label-text w30">परत माल</span>
              </div>
              <div className="purches-trn-div w100 se  d-flex a-center">
                <input className="w10" type="radio" />
                <span className="label-text w30">घट नाश</span>
              </div>
            </div>
          </div>
        </div>
        <div className="bill-header-bill-details w100 d-flex h20">
          <div className="Bill-header-trn-div w45 d-flex a-center">
            <span className="w30 label-text px10">BILL HEADER</span>
            <button className="w-btn w50 "> Delete Select in Header</button>
          </div>
          <div className="Bill-details-trn-div w45 d-flex a-center">
            <span className="w30 label-text px10">BILL DETAILS</span>
            <button className="w-btn w50 "> Delete Select in Header</button>
          </div>
          <div className="button-cheks-trn w10 d-flex">
            <button className="w-btn">Check</button>
          </div>
        </div>
      </div>
      <div className="Trn-table-container w100 d-flex h50 sa    ">
        <div className="first-table-trndiv w45 h1 d-flex-col ">
          <div className="table-heading-trn w100 d-flex  sa">
            <span className="label-text w10">ID</span>
            <span className="label-text w10">Recipt</span>
            <span className="label-text w20 ">Bill.No</span>
            <span className="label-text w20">Date</span>
            <span className="label-text w10">Cust</span>
            <span className="label-text w20">Name</span>
            <span className="label-text w10">Amt</span>
          </div>
          <div className="trn-first-table-data w100 hidescrollbar d-flex  mx90 sa ">
            <span className="lable-text w10">1</span>
            <span className="lable-text w10">9</span>
            <span className="lable-text w20">36563</span>
            <span className="lable-text w20">18-06-1999</span>
            <span className="lable-text w10">8</span>
            <span className="lable-text w20">Shinde</span>
            <span className="lable-text w10">1230</span>
          </div>
        </div>
        <div className="second-table-trndiv w45 h1 d-flex-col">
          <div className="second-table-heading-trn w100 d-flex  sa">
            <span className="label-text w10">ID</span>
            <span className="label-text w10">Recipt</span>
            <span className="label-text w20 ">Bill.No</span>
            <span className="label-text w20">Date</span>
            <span className="label-text w10">Cust</span>
            <span className="label-text w20">Name</span>
            <span className="label-text w10">Amt</span>
          </div>
          <div className="trn-second-table-data w100 hidescrollbar d-flex  mx90 sa ">
            <span className="lable-text w10">1</span>
            <span className="lable-text w10">9</span>
            <span className="lable-text w20">36563</span>
            <span className="lable-text w20">18-06-1999</span>
            <span className="lable-text w10">8</span>
            <span className="lable-text w20"> YOgesh</span>
            <span className="lable-text w10">1000</span>
          </div>
        </div>
      </div>
      <div className="Total-anddifferance-div w100 h10 d-flex">
        <div className="fisrdt-table-total w50 d-flex a-center ">
          <span className="label-text w30">TotalAmt</span>
          <input className="data w30" type="text" />
        </div>
        <div className="fisrdt-table-total w30 d-flex a-center ">
          <span className="label-text w30">TotalAmt</span>
          <input className="data w30" type="text" />
        </div>
        <div className="deffrance-price-div w20 d-flex a-center">
          <span className="label-text w30">फारक</span>
          <input className="data w40" type="text" />
        </div>
      </div>
    </div>
  );
};

export default TrnCheck;
