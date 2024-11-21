import React, { useEffect } from "react";
import { MdOutlineEditNote, MdDelete } from "react-icons/md";
import "../../../../Styles/Mainapp/Dairy/Center.css";
import { useDispatch, useSelector } from "react-redux";

const CenterList = ({ onEdit }) => {
  const dispatch = useDispatch();
  const centerList = useSelector(
    (state) => state.center.centersList.centersDetails
  );

  // Function to format the date
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };



  return (
    <div className="center-list-container w100 h1 d-flex-col p10">
      <div className="center-list-div w100 h1 d-flex-col bg">
        <div className="table-titles w100 h10 d-flex a-center t-center hidescrollbar sb">
          <span className="label-text w5">Edit</span>
          <span className="label-text w5">No.</span>
          <span className="label-text w40">Center Name</span>
          <span className="label-text w10">Reg. No</span>
          <span className="label-text w10">Reg. Date</span>
          <span className="label-text w10">Mobile</span>
          <span className="label-text w30">Email</span>
          <span className="label-text w10">City</span>
          <span className="label-text w10">Tehsil</span>
          <span className="label-text w10">District</span>
          <span className="label-text w10">Pincode</span>
          <span className="label-text w5">AuditClass</span>
          <span className="label-text w5">Delete</span>
        </div>

        {centerList.length > 0 ? (
          centerList.map((center, index) => (
            <div
              className="table-data w100 h10 d-flex a-center t-center hidescrollbar sb"
              key={index}>
              <span className="label-text w5">
                <MdOutlineEditNote
                  className="icons"
                  onClick={() => onEdit(center)}
                />
              </span>
              <span className="label-text w5">{center.center_id}</span>
              <span className="label-text w40">{center.center_name}</span>
              <span className="label-text w10">{center.reg_no}</span>
              <span className="label-text w10">
                {formatDate(center.reg_date)}
              </span>
              <span className="label-text w10">{center.mobile}</span>
              <span className="label-text w30">{center.email}</span>
              <span className="label-text w10">{center.city}</span>
              <span className="label-text w10">{center.tehsil}</span>
              <span className="label-text w10">{center.district}</span>
              <span className="label-text w10">{center.pincode}</span>
              <span className="label-text w5">{center.auditclass}</span>
              <span className="label-text w5">
                <MdDelete className="delete-icons" />
              </span>
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
