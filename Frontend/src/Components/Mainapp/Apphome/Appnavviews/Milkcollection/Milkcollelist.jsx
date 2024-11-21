import React from "react";
import { useSelector } from "react-redux";
import "../../../../../Styles/Mainapp/Apphome/Appnavview/Milkcollection.css";

const Milkcollelist = () => {
  // Retrieve milk collection data and sort in descending order
  const milkColl = useSelector((state) => state.milkCollection.entries || [])
    .slice()
    .reverse();

  return (
    <div className="milk-collection-list w100 h1 d-flex-col bg">
      <div className="title-container w100 h10 p10">
        <h2 className="heading">Milk Collection List</h2>
      </div>
      <div className="collection-list-container w100 h90 d-flex-col hidescrollbar p10">
        {milkColl.length > 0 ? (
          milkColl.map((entry, i) => (
            <div key={i} className="collection-details w100 d-flex-col bg3 br6">
              <div className="col-user-info w100 h40 d-flex a-center sa p10">
                <span className="text w20">{entry.code}</span>
                <span className="text w70">{entry.cname}</span>
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
                  <span className="text w15 d-flex center">
                    {entry.fat || "00.0"}
                  </span>
                  <span className="text w15 d-flex center">
                    {entry.snf || "00.0"}
                  </span>
                  <span className="text w10 d-flex center">
                    {entry.degree || "00.0"}
                  </span>
                  <span className="text w20 d-flex center">
                    {entry.liters || "00.0"}
                  </span>
                  <span className="text w20 d-flex center">
                    {entry.rate || "00.0"}
                  </span>
                  <span className="text w20 d-flex center">
                    {entry.amt || "00.0"}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="no-records w100 h1 d-flex center">
            <span className="heading">No record found !</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Milkcollelist;
