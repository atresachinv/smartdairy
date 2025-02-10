import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";
import { SiElasticstack } from "react-icons/si";
import { GiEdgeCrack } from "react-icons/gi";
import { MdOutlineAddTask } from "react-icons/md";

const StocksNavlinks = ({ isselected, setIsSelected }) => {
  const { t } = useTranslation(["milkcollection"]);
  const hnavlinks = [
    {
      name: `Starting Stock`,
      icon: <SiElasticstack className="icon" />,
      index: 0,
      path: "starting/stock",
    },
    {
      name: `Expired Product`,
      icon: <GiEdgeCrack className="icon" />,
      index: 1,
      path: "expired/product",
    },
    {
      name: `Update Sale Rate`,
      icon: <MdOutlineAddTask className="icon" />,
      index: 2,
      path: "update/sale/rate",
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

export default StocksNavlinks;
