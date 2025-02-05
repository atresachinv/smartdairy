import React from "react";
import { IoPersonAdd, IoList } from "react-icons/io5";
import { NavLink } from "react-router-dom";

const EmployeeNavlinks = ({ isselected, setIsSelected }) => {
  const empNavbuttons = [
    {
      name: "Employee List",
      icon: <IoList className="icon" />,
      index: 1,
      path: "list",
    },
    {
      name: "Create Employee",
      icon: <IoPersonAdd className="icon" />,
      index: 0,
      path: "add-new",
    },
  ];
  return (
    <>
      {empNavbuttons.map((button, index) => (
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

export default EmployeeNavlinks;
