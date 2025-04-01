import React from "react";

import "../../../Styles/DairyInitialInfo/DairyInitialInfo.css";

const DairyInitialInfo = () => {
  return (
    <>
      <div className="Society-info-contianer w100 h1 d-flex-col">
        <span className="heading px10">Society In Detail</span>
        <div className="dairy-lager-info-outer-container w100 h1 d-flex sa">
          <div className="dairy-main-ladger-info-container w65 h1 d-flex-col sb p10 bg">
            <div className="in-hand-cash-and-closing-date w100 h10 d-flex a-center sb">
              <div className="starting-info-div w50 d-flex a-center sb">
                <label htmlFor="investment-amt" className="label-text w60 px10">
                  अधिकृत भागभांडवल :
                </label>
                <input
                  id="investment-amt"
                  className="data w35"
                  type="text"
                  placeholder="0.000"
                />
              </div>
              <div className="colsing-date-div w50 d-flex a-center sb">
                <span className="label-text w50 px10">
                  क्लोजिंग कॅश दिनांक :
                </span>
                <input className="data w45" type="date" />
              </div>
            </div>
            <div className="in-hand-cash-and-closing-date w100 h10 d-flex a-center sb">
              <div className="grocary-cash-div w50 h10 d-flex a-center sa">
                <span className="label-text w65 px10">
                  रोख रक्कम शिल्लख हेड :
                </span>
                <input className="data w35" placeholder="0.000" type="text" />
              </div>
              <div className="grocary-cash-div w50 d-flex a-center sb">
                <span className="label-text w65 px10">
                  हातातील रोख शिल्लख किराणा :
                </span>
                <input className="data w30" placeholder="0.000" type="text" />
              </div>
            </div>
            <div className="cash-gl-no-div w100 h10 d-flex a-center">
              <span className="label-text w30 px10">कॅश खतवानी क्र.</span>
              <select className="data w20" name="" id=""></select>
              <select className="data w60" name="" id=""></select>
            </div>
            <div className="profit-lossgl-div w100 h30 d-flex-col sa">
              <span className="heading px10">नफा तोटा खतावणी संबंधित :</span>
              <div className="profitloss-current-div w100 d-flex sa a-center">
                <span className="label-text w30 px10 ">
                  चालू नफा तोटा ख. क्र.
                </span>
                <select className="data w20" name="" id=""></select>
                <select className="data w60" name="" id=""></select>
              </div>
              <div className="profitloss-current-div w100 d-flex sa a-center">
                <span className="label-text w30 px10 ">
                  मागील नफा तोटा ख. क्र.
                </span>
                <select className="data w20" name="" id=""></select>
                <select className="data w60" name="" id=""></select>
              </div>
              <div className="profitloss-current-div w100 d-flex  sa a-center">
                <span className="label-text w30 px10 ">
                  व्यापारी नफा तोटा ख. क्र.
                </span>
                <select className="data w20" name="" id=""></select>
                <select className="data w60" name="" id=""></select>
              </div>
            </div>
            <div className="profit-lossgl-div w100 h40 d-flex-col sb">
              <span className="heading px10">
                खरेदी विक्री खतावणी संबंधित :
              </span>
              <div className="profitloss-current-div w100 d-flex sa a-center">
                <span className="label-text w30 px10 ">खरेदी खर्च ख. क्र.</span>
                <select className="data w20" name="" id=""></select>
                <select className="data w60" name="" id=""></select>
              </div>
              <div className="profitloss-current-div w100 d-flex sa a-center">
                <span className="label-text w30 px10 ">
                  विक्री उत्पन्न ख. क्र.{" "}
                </span>
                <select className="data w20" name="" id=""></select>
                <select className="data w60" name="" id=""></select>
              </div>
              <div className="profitloss-current-div w100 d-flex  sa a-center">
                <span className="label-text w30 px10 ">खरेदी देणे ख. क्र.</span>
                <select className="data w20" name="" id=""></select>
                <select className="data w60" name="" id=""></select>
              </div>
              <div className="profitloss-current-div w100 d-flex  sa a-center">
                <span className="label-text w30 px10 ">
                  विक्री येणे ख. क्र.
                </span>
                <select className="data w20" name="" id=""></select>
                <select className="data w60" name="" id=""></select>
              </div>
            </div>
          </div>

          <div className="second-half-container w30 d-flex-col h1 p10 bg">
            <div className="round-amount-container w100 d-flex sb">
              <span className="label-text w40 ">राऊंड रक्कम :</span>
              <input className="data w50 h70" type="text" />
            </div>
            <div className="round-amount-container w100 d-flex sb">
              <span className="label-text w40 ">पशुखाद्य :</span>
              <input className="data w50 h70" type="text" />
            </div>
            <div className="round-amount-container w100 d-flex sb">
              <span className="label-text w40 ">अनामत :</span>
              <input className="data w50 h70" type="text" />
            </div>
            <div className="round-amount-container w100 d-flex sb">
              <span className="label-text w40 ">ऍडव्हान्स :</span>
              <input className="data w50 h70" type="text" />
            </div>
            <div className="round-amount-container w100 d-flex sb">
              <span className="label-text w40">किरकोळ दूध वि. :</span>
              <input className="data w50 h70" type="text" />
            </div>
            <div className="round-amount-container w100 d-flex sb">
              <span className="label-text w40 ">घट नाश खतावणी :</span>
              <input className="data w50 h70" type="text" />
            </div>
            <div className="round-amount-container w100 d-flex sb">
              <span className="label-text w40 ">आरंभी शिल्लख माल:</span>
              <input className="data w50 h70" type="text" />
            </div>

            <div className="round-amount-container w100 d-flex sb">
              <span className="label-text w40 ">Ribbit उत्त्पन्न</span>
              <input className="data w50 h70" type="text" />
            </div>
            <div className="round-amount-container w100 d-flex sb">
              <span className="label-text w40 ">Ribbit खर्च :</span>
              <input className="data w50 h70" type="text" />
            </div>
            <div className="round-amount-container w100 d-flex sb">
              <span className="label-text w40 ">दूध दर फरक:</span>
              <input className="data w50 h70" type="text" />
            </div>
            <div className="round-amount-container w100 d-flex sb">
              <span className="label-text w40 ">शितकार :</span>
              <input className="data w50 h70" type="text" />
            </div>
            <div className="round-amount-container w100 d-flex sb">
              <span className="label-text w40">वाहतूक खर्च :</span>
              <input className="data w50 h70" type="text" />
            </div>
            <div className="buttons-amount-container w100 d-flex sb">
              <button className="w-btn">Update</button>
              <button className="w-btn">Save</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DairyInitialInfo;
