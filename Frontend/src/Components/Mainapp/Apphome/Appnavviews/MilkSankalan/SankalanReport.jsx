import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { mobileMilkCollReport } from "../../../../../App/Features/Mainapp/Milk/MilkCollectionSlice";
import "../../../../../Styles/Mainapp/Apphome/Appnavview/Milkcollection.css";

const SankalanReport = () => {
  const dispatch = useDispatch();
  const mobileMilkReport = useSelector(
    (state) => state.milkCollection.mobileColl
  );

  useEffect(() => {
    dispatch(mobileMilkCollReport());
  }, []);

  return (
    <div className="mobile-milk-collection-report w100 h1 d-flex-col center sa">
      <span className="heading h10 py10">Milk Collection Report</span>
      <div className="milk-collection-info-div w80 h90 d-flex-col sa p12">
        <div className="collection-info-heading w100 h10 d-flex a-center t-center sa bg1">
          <span className="label-text w10">NO.</span>
          <span className="label-text w10">Code</span>
          <span className="label-text w30">Customer Name</span>
          <span className="label-text w15">Liters</span>
          <span className="label-text w15">Sample No.</span>
        </div>
        <div className="milk-collection-data-div w100 d-flex-col h90 mh90 hidescrollbar">
          {mobileMilkReport.length > 0 ? (
            mobileMilkReport.map((collection, index) => (
              <div
                key={index}
                className={`collection-info-heading w100 h10 d-flex a-center t-center sa ${
                  index % 2 === 0 ? "bg-light" : "bg-dark"
                }`}
                style={{
                  backgroundColor: index % 2 === 0 ? "#faefe3" : "#fff",
                }}>
                <span className="text w10">{index + 1}</span>
                <span className="text w10">{collection.rno}</span>
                <span className="text w30">{collection.cname}</span>
                <span className="text w15">{collection.Litres}</span>
                <span className="text w15">{collection.SampleNo}</span>
              </div>
            ))
          ) : (
            <div className="wh100 d-flex center">
              <span>No Records Found</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SankalanReport;
