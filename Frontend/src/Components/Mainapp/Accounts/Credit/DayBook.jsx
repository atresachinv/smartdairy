import React from "react";
import "../../../../Styles/Daybook/daybook.css";
const DayBook = () => {
  return (
    <div className="Day-Book-container w100  h1 d-flex-col bg ">
      <span className="heading px10">डे बुक </span>
      <div className="first-day-book-half-div w100 h40 d-flex ">
        <div className="back-front-date-div w30 h1 d-flex-col sa">
          <div className="dates-books-div w100  h30   d-flex a-center">
            <span className="label-text w30 px10 ">दिनांक </span>
            <input className="data" type="date" />
          </div>

          <div className="front-and-backs-button w100 d-flex a-center h30 sa">
            <button className="w-btn">मागे</button>
            <button className="w-btn">पुढे</button>
            <button className="w-btn">पाहणे </button>
          </div>
          <div className="front-and-backs-button w100 d-flex a-center h30 sa">
            <button className="w-btn">दूध विक्री </button>
            <button className="w-btn">किरकोळ विक्री </button>
            <button className="w-btn">बाहेर </button>
          </div>
        </div>
        <div className="print-rokh-milk-payment div w35 h1  d-flex-col sa ">
          <div className="print-payment-rokh-div w100 d-flex  sa h30">
            <button className="w-btn">प्रिंट1</button>
            <button className="w-btn">रोख </button>
            <button className="w-btn">दूध पायमेन्ट </button>
          </div>
          <div className="print-payment-rokh-div w100 d-flex  sa h30">
            <button className="w-btn">प्रिंट2</button>
            <button className="w-btn">ट्रान्सफर </button>
            <button className="w-btn">ज.लेजर </button>
          </div>
          <div className="print-payment-rokh-div w100 d-flex  sa h30">
            <button className="w-btn">दूध पायमेन्ट चेक </button>
            <button className="w-btn">पायमेन्ट लॉक अनलॉक</button>
            <button className="w-btn">अकाऊंड स्टेटमेंट </button>
          </div>
        </div>
        <div className="second-print-rokh-milk-payment div w35 h1  d-flex-col sa">
          <div className="secondprint-payment-rokh-div w100 d-flex  sa h30">
            <button className="w-btn">प.वि.</button>
            <button className="w-btn">अ.वि </button>
            <button className="w-btn">कि.वि </button>
          </div>
          <div className="secondprint-payment-rokh-div w100 d-flex  sa h30">
            <button className="w-btn">Sale ghu.tpv</button>
            <button className="w-btn">Sale ghu.tMv</button>
            <button className="w-btn">Sale ghu.tkv</button>
          </div>
          <div className="secondprint-payment-rokh-div w100 d-flex  sa h30">
            <button className="w-btn">प ख. </button>
            <button className="w-btn">औ ख. </button>
            <button className="w-btn">कि ख. </button>
          </div>
          <div className="secondprint-payment-rokh-div w100 d-flex  sa h30">
            <button className="w-btn">Pure.Rate PV </button>
            <button className="w-btn">Pure.Rate MV </button>
            <button className="w-btn">Pure.Rate KV</button>
          </div>
        </div>
      </div>
      <div className="day-book-table-section w100 h50 d-flex-col br">
        <div className="heading-tableof-dy-book w100 h10 sa d-flex">
          <span className="label-text w5">खटावणी न </span>
          <span className="label-text w20">खटावणी नाव </span>
          <span className="label-text w10 ">जमा कॅश</span>
          <span className="label-text w10">जमा ट्रान्सफर</span>
          <span className="label-text w10">एकूण जमा </span>
          <span className="label-text w10 ">नावे कॅश</span>
          <span className="label-text w10 ">नावे ट्रान्सफर</span>
          <span className="label-text w10 ">एकूण नावे</span>
        </div>
        <div className="day-book-table-data-section w100 mx90 hidescrollbar d-flex-col">
          <div className="daybook-data w100 h1 sa d-flex">
            <span className="label-text w5">01</span>
            <span className="label-text w20">Sales</span>
            <span className="label-text w10">2000</span>
            <span className="label-text w10">3500</span>
            <span className="label-text w10">10000</span>
            <span className="label-text w10">3520</span>
            <span className="label-text w10">2550</span>
            <span className="label-text w10">36985</span>
          </div>
        </div>
      </div>
      <div className="arabhichi-remening-qtyall-nameamt-transer w100 h15 d-flex ">
        <div className="satring-remining-qty w15 a-center d-flex-col">
          <span className="label-text">आरंभीची शिल्लक </span>
          <input className="data w60" type="text" />
        </div>
        <div className="satring-remining-qty w15 a-center d-flex-col">
          <span className="label-text">अखेर शिल्लक </span>
          <input className="data w60" type="text" />
        </div>
        <div className="satring-remining-qty w15 a-center d-flex-col">
          <span className="label-text">एकूण जमा रोख </span>
          <input className="data w60" type="text" />
        </div>
        <div className="satring-remining-qty w15 a-center d-flex-col">
          <span className="label-text"> एकूण जमा ट्रान्सफर </span>
          <input className="data w60" type="text" />
        </div>
        <div className="satring-remining-qty w15 a-center d-flex-col">
          <span className="label-text">एकूण नाव रोख </span>
          <input className="data w60" type="text" />
        </div>
        <div className="satring-remining-qty w15 a-center d-flex-col">
          <span className="label-text">एकूण ट्रान्सफर नावे</span>
          <input className="data w60" type="text" />
        </div>
      </div>
    </div>
  );
};

export default DayBook;
