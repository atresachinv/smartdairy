import React from "react";
import { IoPersonAdd, IoList } from "react-icons/io5";
import { NavLink } from "react-router-dom";

// eslint-disable-next-line react/prop-types
const DealersNavlinks = ({ isselected, setIsSelected }) => {
  const CustNavbuttons = [
    { name: "Dealers List", icon: <IoList className="icon" />, path: "list" },
    {
      name: "Create Dealers",
      icon: <IoPersonAdd className="icon" />,
      path: "add-dealer",
    },
  ];
  return (
    <>
      {CustNavbuttons.map((button, index) => (
        <li
          key={index}
          className={`home-nav-item w20 d-flex a-center ${
            isselected === index ? "selected" : ""
          }`}
          onClick={() => {
            setIsSelected(index);
          }}>
          <NavLink to={button.path} className="sub-navlinks f-label-text">
            {button.icon}
            <span>{button.name}</span>
          </NavLink>
        </li>
      ))}
    </>
  );
};

export default DealersNavlinks;
