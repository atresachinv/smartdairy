import React from "react";
import { BsHouseFill, BsCoin, BsFileRichtext } from "react-icons/bs";
import { FaFillDrip } from "react-icons/fa";
import { FaIndianRupeeSign } from "react-icons/fa6";
import { GiCow } from "react-icons/gi";

const Menulinks = ({ setselected }) => {
  const menubuttons = [
    { name: "Home", icon: <BsHouseFill className="menu-icons" /> },
    { name: "Milk Report", icon: <BsFileRichtext className="menu-icons" /> },
    { name: "Milk Collection", icon: <FaFillDrip className="menu-icons" /> },
    { name: "Payment", icon: <FaIndianRupeeSign className="menu-icons" /> },
    { name: "Animals", icon: <GiCow className="menu-icons" /> },
    { name: "Purches", icon: <BsCoin className="menu-icons" /> },
    // { name: "Deductions", icon: <BsGearFill className="menu-icons" /> },
  ];

  return (
    <div className="main-menu-container w100 h1 d-flex center f-wrap">
      {menubuttons.map(
        (button, index) =>
          index !== 0 && ( // This condition hides the first element
            <div
              key={index}
              className="menu-icon-btn w30 h20 d-flex-col center"
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
  );
};

export default Menulinks;
