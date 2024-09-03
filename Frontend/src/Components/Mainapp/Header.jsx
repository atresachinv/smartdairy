import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BsJustify, BsEscape, BsPersonCircle } from "react-icons/bs";

import "../../Styles/Mainapp/Mainapphome.css";
import { fetchDairyInfo } from "../../App/Features/Admin/Dairyinfo/dairySlice";

const Header = ({ handleSidebar, logout }) => {
  const dispatch = useDispatch();

  const toDate = useSelector((state) => state.date.toDate);
  const dairyname = useSelector((state) => state.dairy.dairyData.SocietyName);

  useEffect(() => {
    dispatch(fetchDairyInfo());
  }, []);

  return (
    <>
      <div className="menu-header d-flex a-center ">
        <BsJustify className="menu-icon c1" onClick={handleSidebar} />
        <span className="title px10">{dairyname}</span>
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
