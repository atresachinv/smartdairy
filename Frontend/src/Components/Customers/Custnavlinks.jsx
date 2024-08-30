import React from "react";
import {
  BsHouseFill,
  BsCoin,
  BsGearFill,
  BsEscape,
  BsGridFill,
} from "react-icons/bs";

const Custnavlinks = ({ setselected, showNavbar }) => {
  const mainnavbuttons = [
    { name: "Dashboard", icon: <BsGridFill className="icon" /> },
    { name: "Profile", icon: <BsHouseFill className="icon" /> },
    { name: "Milk", icon: <BsHouseFill className="icon" /> },
    { name: "Payment", icon: <BsCoin className="icon" /> },
    { name: "Animals", icon: <BsCoin className="icon" /> },
    { name: "Purches", icon: <BsCoin className="icon" /> },
    { name: "Deductions", icon: <BsGearFill className="icon" /> },
  ];

  return (
    <>
      {mainnavbuttons.map((button, index) => (
        <span
          key={index}
          className="sidebar-list-item"
          onClick={() => {
            setselected(index);
          }}>
          <a onClick={showNavbar}>
            {button.icon}
            <span>{button.name}</span>
          </a>
        </span>
      ))}
    </>
  );
};

export default Custnavlinks;
