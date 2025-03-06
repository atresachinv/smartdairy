import React, { useEffect, useState } from "react";
import {
  BsDatabaseAdd,
  BsFileTextFill,
  BsFillFileEarmarkArrowUpFill,
} from "react-icons/bs";
// import "../../../Styles/Mainapp/Apphome/Apphome.css";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";

const InventoryNavlinks = ({ isselected, setIsSelected }) => {
  const { t } = useTranslation(["milkcollection"]);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const myrole = localStorage.getItem("userRole");
    setUserRole(myrole);
  }, []);

  const hnavlinks = [
    {
      name: `Purchase Reports`,
      icon: <BsDatabaseAdd className="icon" />,
      index: 0,
      role: ["super_admin", "admin", "manager"],
      path: "purchase/reports",
    },
    {
      name: `Sales Reports`,
      icon: <BsDatabaseAdd className="icon" />,
      index: 1,
      role: ["super_admin", "admin", "manager"],
      path: "sales/reports",
    },
    {
      name: `Stocks Reports`,
      icon: <BsFillFileEarmarkArrowUpFill className="icon" />,
      index: 2,
      path: "stocks/reports",
      role: ["super_admin", "admin", "manager"],
    },
  ];

  const filterRoutesByRole = (routes, userRole) => {
    return routes
      .filter((route) => route.role.includes(userRole))
      .map((route) => {
        if (route.submenus) {
          return {
            ...route,
            submenus: route.submenus.filter((submenu) =>
              submenu.role.includes(userRole)
            ),
          };
        }
        return route;
      });
  };

  const filteredNavButtons = filterRoutesByRole(hnavlinks, userRole);

  return (
    <>
      {filteredNavButtons.map((button, index) => (
        <li
          key={index}
          className={`home-nav-item d-flex a-center ${
            isselected === button.path ? "selected" : ""
          }`}
          onClick={() => {
            setIsSelected(button.path);
          }}
        >
          <NavLink to={button.path} className={"sub-navlinks f-label-text"}>
            <span>{button.icon}</span>
            {button.name}
          </NavLink>
        </li>
      ))}
    </>
  );
};

export default InventoryNavlinks;
