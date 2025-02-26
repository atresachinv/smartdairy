import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  MdDomainVerification,
  MdAddShoppingCart,
  MdListAlt,
} from "react-icons/md";
import { NavLink } from "react-router-dom";

const PurchaseNavlinks = ({ isselected, setIsSelected }) => {
  const { t } = useTranslation(["puchasesale", "common"]);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const CustNavbuttons = [
    {
      name: `${t("ps-nv-cattlefeed")}`,
      icon: <MdDomainVerification className="icon" />,
      index: 1,
      path: "#",
      role: ["super_admin", "admin"],
      submenus: [
        {
          name: `${t("ps-nv-list-cattlefeed")}`,
          icon: <MdListAlt className="icon" />,
          path: "cattlefeed/list",
          index: 1.1,
          role: ["super_admin", "admin"],
        },
        {
          name: `${t("ps-nv-add-cattlefeed")}`,
          icon: <MdAddShoppingCart className="icon" />,
          path: "cattlefeed/add-new",
          index: 1.2,
          role: ["super_admin", "admin"],
        },
      ],
    },
    {
      name: `${t("ps-nv-grocery")}`,
      icon: <MdDomainVerification className="icon" />,
      index: 2,
      path: "#",
      role: ["super_admin", "admin"],
      submenus: [
        {
          name: `${t("ps-nv-list-grocery")}`,
          icon: <MdListAlt className="icon" />,
          path: "grocery/list",
          index: 2.1,
          role: ["super_admin", "admin"],
        },
        {
          name: `${t("ps-nv-add-grocery")}`,
          icon: <MdAddShoppingCart className="icon" />,
          path: "grocery/add-new",
          index: 2.2,
          role: ["super_admin", "admin"],
        },
      ],
    },
    {
      name: `${t("ps-nv-medicines")}`,
      icon: <MdDomainVerification className="icon" />,
      index: 3,
      path: "#",
      role: ["super_admin", "admin"],
      submenus: [
        {
          name: `${t("ps-nv-list-medicines")}`,
          icon: <MdListAlt className="icon" />,
          path: "medicines/list",
          index: 3.1,
          role: ["super_admin", "admin"],
        },
        {
          name: `${t("ps-nv-add-medicines")}`,
          icon: <MdAddShoppingCart className="icon" />,
          path: "medicines/add-new",
          index: 3.2,
          role: ["super_admin", "admin"],
        },
      ],
    },
    {
      name: `${t("ps-nv-other")}`,
      icon: <MdDomainVerification className="icon" />,
      index: 4,
      path: "#",
      role: ["super_admin", "admin"],
      submenus: [
        {
          name: `${t("ps-nv-list-other")}`,
          icon: <MdListAlt className="icon" />,
          path: "other-products/list",
          index: 4.1,
          role: ["super_admin", "admin"],
        },
        {
          name: `${t("ps-nv-add-other")}`,
          icon: <MdAddShoppingCart className="icon" />,
          path: "other-products/add-new",
          index: 4.2,
          role: ["super_admin", "admin"],
        },
      ],
    },
  ];
  return (
    <>
      <ul className="nav-list d-flex">
        {CustNavbuttons.map((button, index) => (
          <li
            key={index}
            className={`home-nav-item d-flex a-center ${
              isselected === button.index ? "selected" : ""
            }`}
            onClick={() => setIsSelected(button.index)}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <NavLink
              to={button.path}
              className="sub-navlinks f-label-text d-flex a-center"
            >
              <span>{button.icon}</span>
              {button.name}
            </NavLink>

            {button.submenus && hoveredIndex === index && (
              <ul className="dropdown-menu">
                {button.submenus.map((submenu, subIndex) => (
                  <li key={subIndex}>
                    <NavLink
                      to={submenu.path}
                      className="dropdown-item d-flex a-center"
                    >
                      <span className="color-icon mx5">{submenu.icon}</span>
                      {submenu.name}
                    </NavLink>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </>
  );
};

export default PurchaseNavlinks;
