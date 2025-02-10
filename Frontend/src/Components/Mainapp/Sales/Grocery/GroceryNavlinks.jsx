// eslint-disable-next-line no-unused-vars
import React from "react";
import { IoPersonAdd, IoList } from "react-icons/io5";
import { NavLink } from "react-router-dom";

const GroceryNavlinks = ({ isselected, setIsSelected }) => {
  const CustNavbuttons = [
    {
      name: "Sale List",
      icon: <IoList className="icon" />,
      index: 1,
      path: "sale/list",
    },
    {
      name: "Add Sale",
      icon: <IoPersonAdd className="icon" />,
      index: 2,
      path: "add/sale",
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

export default GroceryNavlinks;
