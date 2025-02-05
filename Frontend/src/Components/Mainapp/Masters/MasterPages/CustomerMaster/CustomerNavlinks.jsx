import React from "react";
import { IoPersonAdd, IoList } from "react-icons/io5";
import { NavLink } from "react-router-dom";

const CustomerNavlinks = ({ isselected, setIsSelected }) => {
  const CustNavbuttons = [
    {
      name: "Customer List",
      icon: <IoList className="icon" />,
      index: 0,
      path: "list",
    },
    {
      name: "Create Customer",
      icon: <IoPersonAdd className="icon" />,
      index: 1,
      path: "add-new",
    },
  ];
  return (
    <>
      {CustNavbuttons.map((button, index) => (
        <li
          key={index}
          className={`home-nav-item d-flex a-center ${
            isselected === index ? "selected" : ""
          }`}
          onClick={() => {
            setIsSelected(index);
          }}>
          <NavLink
            to={button.path}
            className={({ isActive }) =>
              isActive
                ? "sub-navlinks f-label-text selected"
                : "sub-navlinks f-label-text"
            }>
            {button.icon}
            <span>{button.name}</span>
          </NavLink>
        </li>
      ))}
    </>
  );
};

export default CustomerNavlinks;
