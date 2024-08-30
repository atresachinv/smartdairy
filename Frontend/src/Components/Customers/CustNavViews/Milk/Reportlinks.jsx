import React from "react";
import {
  BsHouseFill,
  BsCoin,
  BsGearFill,
  BsEscape,
  BsGridFill,
} from "react-icons/bs";

const Reportlinks = ({ setselected }) => {
  const mainnavbuttons = [
    { name: "Milk Report", icon: <BsGridFill className="icon" /> },
    // { name: "Collection Report", icon: <BsGridFill className="icon" /> },
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

export default Reportlinks;
