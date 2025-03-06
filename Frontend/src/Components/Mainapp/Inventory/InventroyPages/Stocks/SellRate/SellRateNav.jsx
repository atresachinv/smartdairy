import React from "react";
import { useTranslation } from "react-i18next";
import { SiElasticstack } from "react-icons/si";
import { NavLink } from "react-router-dom";

const SellRateNav = ({ isselected, setIsSelected, userRole }) => {
  const { t } = useTranslation(["milkcollection"]);

  const hnavlinks = [
    {
      name: `Update Sale Rate`,
      icon: <SiElasticstack className="icon" />,
      index: 0,
      path: "*",
      role: ["admin", "manager", "salesman"],
    },
  ];

  // Filter links based on userRole
  const filteredLinks = hnavlinks.filter((link) =>
    link.role.includes(userRole)
  );

  return (
    <>
      {filteredLinks.map((button, index) => (
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

export default SellRateNav;
