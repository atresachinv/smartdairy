import React from "react";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";
import { SiElasticstack } from "react-icons/si";
const DeductionNavlink = ({ isselected, setIsSelected }) => {
  const { t } = useTranslation(["milkcollection", "inventory"]);

  const dnavlinks = [
    {
      name: `${t("Deduction Head")}`,
      icon: <SiElasticstack className="icon" />,
      index: 0,
      path: "deduction/head",
      role: ["super_admin", "admin"],
    },
    {
      name: `${t("Deduction Details")}`,
      icon: <SiElasticstack className="icon" />,
      index: 1,
      path: "deduction/details",
      role: ["super_admin", "admin"],
    },
  ];

  return (
    <>
      {dnavlinks.map((button, index) => (
        <li
          key={index}
          className={`home-nav-item d-flex a-center ${
            isselected === button.index ? "selected" : ""
          }`}
          onClick={() => setIsSelected(button.index)}
        >
          <NavLink to={button.path} className="sub-navlinks f-label-text">
            <span>{button.icon}</span>
            {button.name}
          </NavLink>
        </li>
      ))}
    </>
  );
};

export default DeductionNavlink;
