/* eslint-disable no-unused-vars */
import React from "react";
import "../../../../Styles/Sanghsales/Sanghsales.css";
const Sanghsales = () => {
  return (
    <>
      <div className="sangha-sale-container w100 h1 d-flex-col ">
        <div className="first-halfsangha-sale-container w100 h40 d-flex-col bg  sb ">
          <div className="bill-information-container w100 h30 d-flex a-center">
            <div className="bill-info-from-to-date-div w60 h1 d-flex ">
              <div className="sangh-phoch-from-date-div w35 h1 d-flex a-center">
                <span className="label-text px10 w40">दिनांक</span>
                <input className="w70 data" type="date" />
              </div>
              <div className="sangh-phoch-to-date-div w35 h1 d-flex a-center">
                <span className="label-text w40 px10">पासून</span>
                <input className="w70 data" type="date" />
              </div>
              <div className="sangh-phoch-paryent-date-div w35 h1 d-flex a-center">
                <span className="label-text w40 px10">पर्येंत</span>
                <input className="w70 data" type="date" />
              </div>
            </div>
            <div className="dudh-sangh-code-container-div w40 h1 d-flex">
              <div className="select-input-divdudh-sang a-center w100 h1 sa d-flex ">
                <span className="label-text  w20 px10">संघ कोड</span>
                <input className="data w20" type="text" />
                <select className="data w50" name="" id=""></select>
              </div>
            </div>
          </div>
          <div className="collection-phohach-container h30 w100 a-center  d-flex">
            <div className="time-date-liter-container w50 h1 d-flex">
              <div className="time-sangh-div w30 d-flex a-center h1">
                <span className="label-text  w30 px10">वेळ</span>
                <select className="data w70" name="select" id="001"></select>
              </div>
              <div className="time-sangh-div w40 d-flex a-center h1">
                <span className="label-text px10 w30">तारीख </span>
                <input className="data w70 " type="date" />
              </div>
              <div className="time-sangh-divv w30 d-flex a-center h1">
                <span className="label-text  w35 px10">लिटर </span>
                <select className="data w" name="select" id="001"></select>
              </div>
            </div>
            <div className="amount-kapat-per-liter-div w50 d-flex h1 a-center">
              <div className="amount-sangha-div w25 px10 d-flex a-center ">
                <span className="label-text w70 ">रक्कम </span>
                <input className="data" type="text" />
              </div>
              <div className="kapat-sangha-div w30 d-flex h1 a-center ">
                <span className="label-text w50 px10">क.प्र.ली</span>
                <input className="data" type="text" />
              </div>
              <div className="loss-sangha-div w25 d-flex a-center ">
                <span className="label-text w90 px10">नाश ली </span>
                <input className="data w50 " type="text" />
              </div>
              <div className="button-sangha-div w15 d-flex a-center px10 ">
                <button className="label-text px10 w-btn">जमा </button>
              </div>
            </div>
          </div>
          <div className="sangh-table-section-div w100 h60 a-center d-flex ">
            <div className="first-table-div-sangha w45 h1 d-flex-col ">
              <div className="table-heading-container-div w100 h30  sa d-flex">
                <span>Date</span>
                <span>सकाळ </span>
                <span>ली</span>
                <span>FAT</span>
                <span>SNF</span>
                <span>दर</span>
                <span>रक्कम </span>
                <span>क.प्र.ली</span>
              </div>
              <div className="sangha-table-data w100 mx90 hidescrollbar d-flex sa ">
                <span>Date</span>
                <span>संद्याकाळ </span>
                <span>100</span>
                <span>FAT</span>
                <span>SNF</span>
                <span>दर</span>
                <span>रक्कम </span>
                <span>क.प्र.ली</span>
              </div>
            </div>
            <div className="second-table-div-sangha w45 h1 d-flex-col ">
              <div className="table-heading-container-div w100 h30  sa d-flex">
                <span>Date</span>
                <span>सकाळ </span>
                <span>ली</span>
                <span>FAT</span>
                <span>SNF</span>
                <span>दर</span>
                <span>रक्कम </span>
                <span>क.प्र.ली</span>
              </div>
              <div className="sangha-table-data w100 mx90 hidescrollbar d-flex sa ">
                <span>03/04/2025</span>
                <span>सकाळ </span>
                <span>100</span>
                <span>4.3</span>
                <span>29.0</span>
                <span>35</span>
                <span>10500 </span>
                <span>1203</span>
              </div>
            </div>
          </div>
        </div>
        <div className="second-half-table-span-input-div w100 h60   d-flex-col">
          <div className="changle-dudh-kami-container w100 h40 d-flex">
            <div className="changle-dudh-contianer w40 h1  bg d-flex-col ">
              <fieldset className="w100 h1 sa d-flex-col sb">
                <legend className="heading ">चांगले दूध </legend>
                <div className="changle-dudh w100 h50 d-flex a-center">
                  <div className="all-liter-changle-dudh d-flex w50 a-center ">
                    <span className="label-text w40">ए.लिटर </span>
                    <input className="data w50" type="text" />
                  </div>
                  <div className="changle-dudh w50 h50 d-flex a-center">
                    <span className="label-text w40">रक्कम </span>
                    <input className="data w50" type="text" />
                  </div>
                </div>
                <div className="changle-dudh w100 h50 d-flex a-center">
                  <div className="all-liter-changle-dudh d-flex w50  a-center ">
                    <span className="label-text w40">एकूण </span>
                    <input className="data w50" type="text" />
                  </div>
                  <div className="changle-dudh-ekun w50 h50 d-flex a-center">
                    <span className="label-text w40">एकूण </span>
                    <input className="data w50" type="text" />
                  </div>
                </div>
              </fieldset>
            </div>

            <div className="prashashikya-and-other-experaince w15 h20 px10 d-flex-col bg ">
              <div className="prashashikya-div w100 d-flex-col  ">
                <span className="label-text w100 px10">इतरखर्च </span>
                <input className="data w60" type="text" />
              </div>
              <div className="prashashikya-divv w100 d-flex-col  ">
                <span className="label-text w100 px10">एकूण</span>
                <input className="data w60" type="text" />
              </div>
            </div>
            <div className="rebbit-and-other-experaince w15  h20 px10 d-flex-col ">
              <div className="prashashikya-rebbit-div w100   d-flex-col">
                <span className="label-text w100 px10">रॆबिट</span>
                <input className="data w60" type="text" />
              </div>
              <div className="prashashikya-shitkaran-div w100 d-flex-col ">
                <span className="label-text w100 px10">शीतकरण </span>
                <input className="data w60" type="text" />
              </div>
            </div>
            <div className="rebbit-and-other-experaince w15  h20  d-flex-col ">
              <div className="prashashikynash-div w100   d-flex-col ">
                <span className="label-text w100 px10">नाश.ली</span>
                <input className="data w60" type="text" />
              </div>
              <div className="prashashikya-div-all w100 d-flex-col ">
                <span className="label-text w100 px10">एकूण</span>
                <input className="data w60" type="text" />
              </div>
            </div>
            <div className="changle-dudh-contianer w40 h1 bg  d-flex-col ">
              <fieldset className="w90 h1 sa d-flex-col sb">
                <legend className="heading ">कमी प्रतीचे दूध </legend>
                <div className="changle-dudh w100 h50 d-flex a-center">
                  <div className="all-liter-changle-dudh d-flex w50 a-center ">
                    <span className="label-text w40">ए.लिटर </span>
                    <input className="data w50" type="text" />
                  </div>
                  <div className="changle-dudh w50 h50 d-flex a-center">
                    <span className="label-text w40">रक्कम </span>
                    <input className="data w50" type="text" />
                  </div>
                </div>
                <div className="changle-dudh w100 h50 d-flex a-center">
                  <div className="all-liter-changle-dudh d-flex w50  a-center ">
                    <span className="label-text w40">एकूण </span>
                    <input className="data w50" type="text" />
                  </div>
                  <div className="changle-dudh-ekun w50 h50 d-flex a-center">
                    <span className="label-text w40">एकूण </span>
                    <input className="data w50" type="text" />
                  </div>
                </div>
              </fieldset>
            </div>
          </div>
          <div className="sanghasales-table-and-gl-setup-div h60 w100 d-flex  bg ">
            <div className="sanghasales-table w60 h1 d-flex-col ">
              <div className="sanghasales-table-table-heading w100 sa h20 d-flex">
                <span className="label-text">खतावणी न</span>
                <span className="label-text">खतावणी नाव</span>
                <span className="label-text">वजावट</span>
                <span className="label-text">रक्कम</span>
              </div>
              <div className="sanghasales-table-data w100 d-flex-col  mx90 hidescrollbar">
                <div className="sanghatable-section-data w100 sa d-flex ">
                  <span className="label-text">001</span>
                  <span className="label-text">राऊंड ऑफ </span>
                  <span className="label-text">2500</span>
                  <span className="label-text">12500</span>
                </div>
              </div>
            </div>
            <div className="khatavni-setup-span-input w40 h1 d-flex-col">
              <div className="span-input-alls-amount w100 d-flex h50">
                <div className="all-amount-div h25 d-flex-col w30  px10 a-center ">
                  <span className="label-text w90">एकूण रक्कम</span>
                  <input
                    className="data"
                    type="text"
                    placeholder="एकूण रक्कम"
                  />
                </div>
                <div className="all-amount-div h25 d-flex-col w30 px10 a-center ">
                  <span className="label-text w90">वजावट रक्कम</span>
                  <input
                    className="data"
                    type="text"
                    placeholder="वजावट रक्कम"
                  />
                </div>
                <div className="all-amount-div h25 d-flex-col w30 px10 a-center ">
                  <span className="label-text w90">निव्वळ रक्कम </span>
                  <input
                    className="data"
                    type="text"
                    placeholder="निव्वळ रक्कम "
                  />
                </div>
              </div>
              <div className="gl-setup-register-butoon w100 sa d-flex h50 a-center">
                <button className="w-btn">खटावणी सेटअप</button>
                <button className="w-btn">नोंद </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sanghsales;
58;
