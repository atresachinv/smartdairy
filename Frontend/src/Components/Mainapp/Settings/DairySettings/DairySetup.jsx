import React from "react";

const DairySetup = () => {
  return (
    <div className="sanstha-setup-container w100 h1 d-flex-col sb p10">
      <label className="heading">Dairy Setup :</label>
      <div className="dairy-setup-inner-container w100 h95 d-flex-col bg5 p10">
        <div className="dairy-setup-inner-container w100 h15 d-flex se bg-light-skyblue br9">
          <div className="dairy-setup-form w20 h1 d-flex-col se">
            <label className="label">दुधबिल निर्माणाचे दिवस :</label>
            <input type="text" className="data" placeholder="10" />
          </div>
          <div className="dairy-setup-form w30 h1 d-flex-col se">
            <label className="label">कमीत-कमी दुधबील पेमेंट रक्कम :</label>
            <input type="text" className="data" placeholder="0.0" />
          </div>
          <div className="dairy-setup-form w25 h1 d-flex-col se">
            <label className="label">प्रिंटर प्रकार निवडा :</label>
            <select name="" id="" className="data">
              <option value="">-- select Printer --</option>
            </select>
          </div>
          <div className="dairy-setup-form w20 h1 d-flex-col a-center se">
            <label className="label w100">किरकोळ दुधविक्री दर :</label>
            <input type="text" className="data w100" placeholder="0.0" />
          </div>
        </div>
        <div className="sms-setting-container w100 h30 d-flex sb bg-light-green br9 my10">
          <label htmlFor="" className="label-text p10">Whatsapp Message Settings :</label>
        </div>
      </div>
    </div>
  );
};

export default DairySetup;
