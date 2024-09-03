import React from "react";
import {
  BsHouseFill,
  BsCoin,
  BsGearFill,
  BsGridFill,
} from "react-icons/bs";
import "../../Styles/Mainapp/Mainapphome.css";

const Mainappnavlinks = ({ setselected, handleSidebar }) => {
  const mainnavbuttons = [
    { name: "Dashboard", icon: <BsGridFill className="icon" /> },
    { name: "Milk", icon: <BsHouseFill className="icon" /> },
    { name: "Inventry", icon: <BsHouseFill className="icon" /> },
    { name: "Accounts", icon: <BsCoin className="icon" /> },
    { name: "Settings", icon: <BsGearFill className="icon" /> },
    // { name: "Logout", icon: <BsEscape className="icon" /> },
  ];

  return (
    <>
      {mainnavbuttons.map((button, index) => (
        <li
          key={index}
          className="sidebar-list-item"
          onClick={() => {
            setselected(index);
          }}>
          <a onClick={handleSidebar}>
            {button.icon}
            <span>{button.name}</span>
          </a>
        </li>
      ))}
    </>
  );
};

export default Mainappnavlinks;
