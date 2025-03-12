import React from "react";
 import "../../../../Styles/Master/Mainlegder.css";
const MainLedger = () => {
  return (
    <div className="main-glmaster-container w100 h1 d-flex-col center">
      <span className="heading ">Main Ledger</span>
      <div className="GL-master-div w60 h30 d-flex-col ">
        <div className="gl-master-inside-div h70 w100">
          <div className="first-span-input w100 h30  d-flex center my10">
            <span className="w20 d-flex info-text">Gl number:</span>
            <input className="w50 d-flex data " type="text" />
            <input className="w10 h50 checkbox" type="checkbox" />
            <span className="info-text w20">user Define</span>
          </div>
          <div className="gl-name-div w100 h30 d-flex center my10">
            <span className=" w20 info-text ">Gl Name:</span>
            <input className="w50 data" type="text" />
            <input className="w10 h50 checkbox" type="checkbox" />
            <span className=" w20 info-text">Pot khate</span>
          </div>
        </div>

        <div className="input-buttons-div w100 h10 d-flex-col  ">
          <div className="buttonss-div w80 h30 d-flex j-cente sb ">
            <button className="w-btn">Save</button>
            <button className="w-btn">upadte</button>
            <button className="w-btn">Delate</button>
            <button className="w-btn">Cancel</button>
          </div>
        </div>
      </div>
      <div className="katavani-table-conatiner w60 h70 d-flex-col bg  ">
        <div className="table-headers-div  w100 h10 d-flex center sa ">
          <span className="info-text w30">Main GL Number</span>
          <span className="info-text w30">Khatavni Name</span>
        </div>
        <div className="table-data-container w100 h90 mh90 hidescrollbar d-flex-col">
          <div className="table-data-div w100 h10 d-flex center sa ">
            <span className=""></span>
            <span className=""></span>
          </div>
          <div className="table-data-div w100 h10 d-flex sa">
            <span className=""></span>
            <span className="second"></span>
          </div>
          <div className="table-data-div w100 h10 d-flex sa">
            <span className=""></span>
            <span className="second"></span>
          </div>
          <div className="table-data-div w100 h10 d-flex sa">
            <span className=""></span>
            <span className="second"></span>
          </div>
          <div className="table-data-div w100 h10 d-flex sa">
            <span className=""></span>
            <span className="second"></span>
          </div>
          <div className="table-data-div w100 h10 d-flex sa">
            <span className=""></span>
            <span className="second"></span>
          </div>
          <div className="table-data-div w100 h10 d-flex sa">
            <span className=""></span>
            <span className="second"></span>
          </div>

          <div className="table-data-div w100 h10 d-flex sa">
            <span className=""></span>
            <span className="second"></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainLedger;
