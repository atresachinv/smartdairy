import React from "react";
import { IoNotifications } from "react-icons/io5";
import "../../../../Styles/AdminPannel/AdminPannel.css";
const TopNavigation = () => {
  return (
    <div className="top-navbar w100 d-flex a-center sb bg6">
      <div className="greting-text w60 h1 d-flex t-center">
        <label className="title mx10">Welcome To Admin Pannel</label>
      </div>
      <div className="notification-container w5 h1 d-flex j-center px10">
        <IoNotifications className="color-icon" />
        <span className="notification-counter text">0</span>
      </div>
    </div>
  );
};

export default TopNavigation;
