import React from "react";
import { IoPersonAdd, IoList } from "react-icons/io5";
import { NavLink } from "react-router-dom";

const EmployeeNavlinks = ({ isselected, setIsSelected }) => {
  const empNavbuttons = [
    {
      name: "सेवक यादी",
      icon: <IoList className="icon" />,
      index: 1,
      path: "list",
    },
    {
      name: "सेवक नोंदवा",
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
          }}
        >
          <NavLink
            to={button.path}
            className={({ isActive }) =>
              isActive
                ? "sub-navlinks f-label-text selected"
                : "sub-navlinks f-label-text"
            }
          >
            <span className="nav-icon">{button.icon}</span>
            <span>{button.name}</span>
          </NavLink>
        </li>
      ))}
    </>
  );
};

export default EmployeeNavlinks;
