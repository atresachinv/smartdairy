import React, { useEffect } from "react";
import {
  BsHouseFill,
  BsCoin,
  BsGearFill,
  BsGridFill,
  BsPersonCircle,
  BsBriefcaseFill,
} from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import "../../Styles/Customer/Customer.css";
import { fetchDairyInfo } from "../../App/Features/Admin/Dairyinfo/dairySlice";
import { generateMaster } from "../../App/Features/Customers/Date/masterdateSlice";
import { getMasterDates } from "../../App/Features/Customers/Date/masterSlice";

const Custnavlinks = ({ setselected }) => {
  const dispatch = useDispatch();
  const dairyname = useSelector((state) => state.dairy.dairyData.SocietyName);
  const date = useSelector((state) => state.date.toDate);
  const yearStart = useSelector((state) => state.date.yearStart);
  const yearEnd = useSelector((state) => state.date.yearEnd);
  const masterlist = useSelector((state) => state.masterdates.masterlist);

  useEffect(() => {
    dispatch(fetchDairyInfo());
    dispatch(generateMaster(date));
    if (yearStart && yearEnd) {
      dispatch(getMasterDates({ yearStart, yearEnd }));
    }
  }, [dispatch]);

  const mainnavbuttons = [
    { name: "navbar", icon: <BsGridFill className="icon" /> },
    { name: "Dashboard", icon: <BsGridFill className="icon" /> },
    { name: "Milk Collection", icon: <BsHouseFill className="icon" /> },
    { name: "Payment Bills", icon: <BsCoin className="icon" /> },
    { name: "Cattle Feeds", icon: <BsCoin className="icon" /> },
    { name: "Deductions", icon: <BsGearFill className="icon" /> },
    { name: "Animals", icon: <BsCoin className="icon" /> },
    { name: "My Profile", icon: <BsPersonCircle className="icon" /> },
  ];

  return (
    <div className="main-menu-container w100 h1 d-flex-col">
      <div className="center-selection-div w100 h20 d-flex-col p10">
        <span className="dairyname w100 h40">{dairyname}</span>
        <div className="select-div w100 h40 d-flex a-center sb">
          <span className="icons w10 px10">
            <BsBriefcaseFill />
          </span>
          <select disabled className="centers w80 h1 d-flex-col">
            <option value="">{dairyname}</option>
            <option value="">1</option>
            <option value="">1</option>
          </select>
        </div>
      </div>
      <div className="nav-menu-container w100 h50 d-flex center f-wrap">
        {mainnavbuttons.map(
          (button, index) =>
            index !== 0 && (
              <div
                key={index}
                className="menu-icon-btn w25 h30 d-flex-col center"
                onClick={() => {
                  setselected(index);
                }}>
                <div className="icon-div w100 h70 d-flex center">
                  {button.icon}
                </div>
                <div className="menu-text-div w100 h30 d-flex center">
                  <span>{button.name}</span>
                </div>
              </div>
            )
        )}
      </div>
    </div>
  );
};

export default Custnavlinks;
