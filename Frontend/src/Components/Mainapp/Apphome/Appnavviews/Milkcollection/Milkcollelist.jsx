import React from "react";
import "../../../../../Styles/Mainapp/Apphome/Appnavview/Milkcollection.css";

const Milkcollelist = () => {
  return (
    <div className="milk-collection-list w100 h1 d-flex-col bg">
      <div className="title-container w100 h10 p10">
        <h2 className="heading">Milk Collection List</h2>
      </div>
      <div className="collection-list-container w100 h90 d-flex-col hidescrollbar p10">
        <div className="collection-details w100 d-flex-col bg3 br6">
          <div className="col-user-info w100 h40 d-flex a-center sa p10">
            <span className="text w20">0000</span>
            <span className="text w70">smart dairy</span>
          </div>
          <div className="line"></div>
          <div className="col-milk-info w100 h60 d-flex-col">
            <div className="info-title w100 h50 d-flex sa">
              <span className="text w15 d-flex center">FAT</span>
              <span className="text w15 d-flex center">SNF</span>
              <span className="text w10 d-flex center">Deg</span>
              <span className="text w20 d-flex center">Liters</span>
              <span className="text w20 d-flex center">Rate</span>
              <span className="text w20 d-flex center">Amount</span>
            </div>
            <div className="info-value w100 h50 d-flex sa">
              <span className="text w15 d-flex center">00.0</span>
              <span className="text w15 d-flex center">00.0</span>
              <span className="text w10 d-flex center">00.0</span>
              <span className="text w20 d-flex center">00.0</span>
              <span className="text w20 d-flex center">00.0</span>
              <span className="text w20 d-flex center">00.0</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Milkcollelist;
