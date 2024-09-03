import React from "react";
import {
  BsHouseFill,
  BsCoin,
  BsGearFill,
  BsEscape,
  BsGridFill,
  BsPersonCircle,
} from "react-icons/bs";
import "../../Styles/Customer/Customer.css";

const Custnavlinks = ({ setselected }) => {
  const mainnavbuttons = [
    { name: "navbar", icon: <BsGridFill className="icon" /> },
    { name: "Dashboard", icon: <BsGridFill className="icon" /> },
    { name: "Milk Collection", icon: <BsHouseFill className="icon" /> },
    { name: "Payment Bills", icon: <BsCoin className="icon" /> },
    { name: "Cattel Feeds", icon: <BsCoin className="icon" /> },
    { name: "Deductions", icon: <BsGearFill className="icon" /> },
    { name: "Animals", icon: <BsCoin className="icon" /> },
    { name: "My Profile", icon: <BsPersonCircle className="icon" /> },
  ];

  return (
    <>
      <div className="main-menu-container w100 h1 d-flex center f-wrap">
        {mainnavbuttons.map(
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
    </>
  );
};

export default Custnavlinks;
