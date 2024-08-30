import React from "react";
import {
  BsHouseFill,
  BsCoin,
  BsGearFill,
  BsEscape,
  BsGridFill,
} from "react-icons/bs";

const Mainappnavlinks = ({ setselected }) => {
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
          <a>
            {button.icon}
            <span>{button.name}</span>
          </a>
        </li>
      ))}
    </>
  );
};

export default Mainappnavlinks;
