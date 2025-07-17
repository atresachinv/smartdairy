import { useState } from "react";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";
import { SiElasticstack } from "react-icons/si";
import "../../../../../Styles/Mainapp/Inventory/InventoryPages/Stock.css";

// eslint-disable-next-line react/prop-types
const StocksNavlinks = ({ isselected, setIsSelected, userRole }) => {
  const { t } = useTranslation(["milkcollection", "inventory"]);

  const hnavlinks = [
    {
      name: `${t("inventory:in-nv-init-stock")}`,
      icon: <SiElasticstack className="icon" />,
      index: 0,
      path: "starting/stock",
      role: ["super_admin", "admin"],
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
            isselected === button.path ? "selected" : ""
          }`}
          onClick={() => setIsSelected(button.path)}
        >
          <NavLink to={button.path} className="sub-navlinks f-label-text">
            <span className="nav-icon">{button.icon}</span>
            {button.name}
          </NavLink>
        </li>
      ))}
    </>
  );
};

export default StocksNavlinks;
