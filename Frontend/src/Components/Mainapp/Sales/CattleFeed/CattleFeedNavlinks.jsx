import React from "react";
import { IoPersonAdd, IoList } from "react-icons/io5";
import { NavLink } from "react-router-dom";

const CattleFeedNavlinks = ({ isselected, setIsSelected }) => {
  const CustNavbuttons = [
    { name: "Sale List", icon: <IoList className="icon" />, path: "sale/list" },
    {
      name: "Create Sale",
      icon: <IoPersonAdd className="icon" />,
      path: "add/feeds",
    },
  ];
  return (
    <>
      {CustNavbuttons.map((button, index) => (
        <li key={index} className="home-nav-item d-flex a-center">
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

export default CattleFeedNavlinks;
