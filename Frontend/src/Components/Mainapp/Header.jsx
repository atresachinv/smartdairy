import React from "react";
import { useSelector } from "react-redux";
import { BsJustify, BsEscape, BsPersonCircle } from "react-icons/bs";
import "../../Styles/Mainapp/Mainapphome.css";

const Header = ({ handleSidebar, logout }) => {
  const toDate = useSelector((state) => state.date.toDate);

  return (
    <>
      <div className="menu d-flex a-center ">
        <BsJustify className="menu-icon c1" onClick={handleSidebar} />
        <span className="title px10">Smart sankalkendra ,Sangamner</span>
      </div>
      <div className="header-right d-flex">
        <h2 className="heading d-flex center mx10">
          <BsPersonCircle className="icon" />
          <span>smartdairy</span>
          <span>{toDate}</span>
        </h2>
        <h2 className="heading logout-btn d-flex center" onClick={logout}>
          <BsEscape className="icon " />
          <span>Logout</span>
        </h2>
      </div>
    </>
  );
};

export default Header;
