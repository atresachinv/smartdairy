import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BsJustify } from "react-icons/bs";
import { fetchDairyInfo } from "../../App/Features/Admin/Dairyinfo/dairySlice";

import "../../Styles/Mainapp/Mainapphome.css";

const Header = ({ handleSidebar, logout }) => {
  const dispatch = useDispatch();

  const toDate = useSelector((state) => state.date.toDate);

  const dairyname = useSelector(
    (state) =>
      state.dairy.dairyData.marathiName || state.dairy.dairyData.marathi_name
  );
  
  useEffect(() => {
    dispatch(fetchDairyInfo());
  }, []);

  return (
    <>
      <div className="menu-header d-flex a-center">
        <BsJustify className="menu-icon w100 c1" onClick={handleSidebar} />
      </div>
      <div className="dairy-name-container w100 d-flex-col sb">
        <span className="title w100">{dairyname}</span>
        <span className="label-text w100 ">{toDate}</span>
      </div>
    </>
  );
};

export default Header;
