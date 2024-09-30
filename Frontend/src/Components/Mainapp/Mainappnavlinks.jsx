import React from "react";
import { TbMilk } from "react-icons/tb";
import { BsHouseFill, BsCoin, BsGearFill, BsGridFill } from "react-icons/bs";
import "../../Styles/Mainapp/Mainapphome.css";

const Mainappnavlinks = ({ setselected, handleSidebar }) => {
  const mainnavbuttons = [
    { name: "Dashboard", icon: <BsGridFill className="icon" /> },
    { name: "Milk", icon: <TbMilk className="icon" /> },
    { name: "Inventry", icon: <BsHouseFill className="icon" /> },
    { name: "Accounts", icon: <BsCoin className="icon" /> },
    { name: "Settings", icon: <BsGearFill className="icon" /> },
  ];

  return (
    <>
      {mainnavbuttons.map((button, index) => (
        <li
          key={index}
          className="py5"
          onClick={() => {
            setselected(index);
          }}>
          <a onClick={handleSidebar}>
            {button.icon}
            <span className="px5 f-heading">{button.name}</span>
          </a>
        </li>
      ))}
    </>
  );
};

export default Mainappnavlinks;
