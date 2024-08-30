import React from "react";

import { BsPencilSquare } from "react-icons/bs";
import "../../../Styles/Customer/CustNavViews/CustProfile.css";

const CustProfile = () => {
  return (
    <div className="cust-profile-container w100 h1 d-flex-col">
      <div className="menu-title-div w70 mx-15 h10 d-flex p10">
        <h2 className="heading">Customer Profile</h2>
      </div>
      <div className="user-info-container w70 mx-15 h90 d-flex-col p10">
        <div className="buttons-div w100 h10 d-flex a-center sb bg p10">
          <span className="heading">User Details</span>
          <BsPencilSquare />
        </div>
        <div className="user-details bg p10">
          <h2 className="heading">
            Code : <span className="text"></span>
          </h2>
          <h2 className="heading">
            Name : <span className="text"></span>
          </h2>
          <h2 className="heading">
            Bank Name : <span className="text"></span>
          </h2>
          <h2 className="heading">
            Bank Account Number : <span className="text"></span>
          </h2>
          <h2 className="heading">
            Bank IFSC Code : <span className="text"></span>
          </h2>
          <h2 className="heading">
            Farmer Id : <span className="text"></span>
          </h2>
          <h2 className="heading">
            Mobile Number : <span className="text"></span>
          </h2>
          <h2 className="heading">
            Adhhar Number : <span className="text"></span>
          </h2>
        </div>
      </div>
    </div>
  );
};

export default CustProfile;
