import React from "react";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";
import { BsSignTurnRight, BsSignTurnSlightRight } from "react-icons/bs";

const ReturnsNavlinks = ({ isselected, setIsSelected }) => {
  const { t } = useTranslation(["milkcollection"]);
  const hnavlinks = [
    {
      name: `Dealer Returns`,
      icon: <BsSignTurnRight className="icon" />,
      index: 0,
      path: "dealer/returns",
    },
    {
      name: `Customer Returns`,
      icon: <BsSignTurnSlightRight className="icon" />,
      index: 1,
      path: "customer/returns",
    },
  ];

  return (
    <>
      {hnavlinks.map((button, index) => (
        <li
          key={index}
          className={`home-nav-item d-flex a-center ${
            isselected === button.index ? "selected" : ""
          }`}
          onClick={() => {
            setIsSelected(button.index);
          }}>
          <NavLink to={button.path} className={"sub-navlinks f-label-text"}>
            <span>{button.icon}</span>
            {button.name}
          </NavLink>
        </li>
      ))}
    </>
  );
};

export default ReturnsNavlinks;
