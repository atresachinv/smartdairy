import React, { useEffect } from "react";
import "../../../../Styles/Mainapp/Dairy/Center.css";
import { useDispatch, useSelector } from "react-redux";
import { centersLists } from "../../../../App/Features/Dairy/Center/centerSlice";

const CenterList = ({ onEdit }) => {
  const dispatch = useDispatch();
  const centerList = useSelector((state) => state.center.centersList || []);
  useEffect(() => {
    dispatch(centersLists());
  }, []);


  return (
    <div className="center-list-container w100 h1 d-flex-col p10">
      <div className="center-list-div w100 h1 mh100  d-flex-col bg">
        <div className="table-titles w100 p10 d-flex a-center t-center hidescrollbar sb">
          <span className="label-text w5">No.</span>
          <span className="label-text w30">Center Name</span>
          <span className="label-text w15">Mobile</span>
          <span className="label-text w25">Email</span>
          <span className="label-text w15">City</span>
          <span className="label-text w15">Tehsil</span>
          <span className="label-text w15">District</span>
          <span className="label-text w10">Pincode</span>
          <span className="label-text w5">Prefix</span>
        </div>

        {centerList ? (
          centerList.map((center, index) => (
            <div
              key={index}
              className={`table-data w100 p10 d-flex a-center t-center hidescrollbar sb ${
                index % 2 === 0 ? "bg-light" : "bg-dark"
              }`}
              style={{
                backgroundColor: index % 2 === 0 ? "#fff" : "#faefe3",
              }}
            >
              <span className="label-text w5">{center.center_id}</span>
              <span className="label-text w30 t-start">
                {center.center_name}
              </span>
              <span className="label-text w15">{center.mobile}</span>
              <span className="label-text w25">{center.email}</span>
              <span className="label-text w15">{center.city}</span>
              <span className="label-text w15">{center.tehsil}</span>
              <span className="label-text w15">{center.district}</span>
              <span className="label-text w10">{center.pincode}</span>
              <span className="label-text w5">{center.prefix}</span>
            </div>
          ))
        ) : (
          <div className="no-data">No centers available.</div>
        )}
      </div>
    </div>
  );
};

export default CenterList;
