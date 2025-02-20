/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import {
  BsDatabaseAdd,
  BsFileTextFill,
  BsFillFileEarmarkArrowUpFill,
} from "react-icons/bs";

import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";

const SanghsalesNavlinks = ({ isselected, setIsSelected }) => {
  const { t } = useTranslation(["milkcollection"]);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const myrole = localStorage.getItem("userRole");
    setUserRole(myrole);
  }, []);

  const hnavlinks = [
    {
      name: `Add New Sangha`,
      icon: <BsDatabaseAdd className="icon" />,
      index: 0,
      role: ["super_admin", "admin", "manager"],
      path: "add/new-sangha",
    },
    {
      name: `Sangha Sales`,
      icon: <BsDatabaseAdd className="icon" />,
      index: 1,
      role: ["super_admin", "admin", "milkcollector", "mobilecollector"],
      path: "sangha/sales",
    },
    {
      name: `Sangha Sales Report`,
      icon: <BsDatabaseAdd className="icon" />,
      index: 2,
      role: ["super_admin", "admin", "milkcollector", "mobilecollector"],
      path: "sangha/report",
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

export default SanghsalesNavlinks;
