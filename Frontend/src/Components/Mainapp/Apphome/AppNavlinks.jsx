import React, { useEffect, useState } from "react";
import {
  BsDatabaseAdd,
  BsFileTextFill,
  BsFillFileEarmarkArrowUpFill,
} from "react-icons/bs";
import "../../../Styles/Mainapp/Apphome/Apphome.css";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";

const AppNavlinks = ({ isselected, setIsSelected }) => {
  const { t } = useTranslation(["milkcollection"]);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const myrole = localStorage.getItem("userRole");
    setUserRole(myrole);
  }, []);

  const hnavlinks = [
    {
      name: `${t("m-milkcoll")}`,
      icon: <BsDatabaseAdd className="icon" />,
      index: 0,
      role: ["super_admin", "admin", "manager"],
      path: "collection",
    },
    {
      name: `${t("m-milkcoll")}`,
      icon: <BsDatabaseAdd className="icon" />,
      index: 1,
      role: ["super_admin", "admin", "milkcollector", "mobilecollector"],
      path: "vehicle/collection",
    },
    {
      name: `${t("m-complete-coll")}`,
      icon: <BsFillFileEarmarkArrowUpFill className="icon" />,
      index: 2,
      path: "complete/collection",
      role: ["super_admin", "admin", "manager", "admin", "manager"],
    },
    {
      name: `${t("m-reports")}`,
      icon: <BsFileTextFill className="icon" />,
      index: 3,
      path: "collection/reports",
      role: ["super_admin", "admin", "milkcollector", "mobilecollector"],
    },
    {
      name: `${t("m-reports")}`,
      icon: <BsFileTextFill className="icon" />,
      index: 4,
      path: "vehicle/collection/reports",
      role: ["super_admin", "admin", "manager"],
    },
    {
      name: `${t("m-sales")}`,
      icon: <BsFileTextFill className="icon" />,
      index: 5,
      path: "vehicle/sales",
      role: ["super_admin", "admin", "milkcollector", "mobilecollector"],
    },
    {
      name: `sales Report`,
      icon: <BsFileTextFill className="icon" />,
      index: 6,
      path: "vehicle/sales/report",
      role: ["super_admin", "admin", "milkcollector", "mobilecollector"],
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
            isselected === index ? "selected" : ""
          }`}
          onClick={() => {
            setIsSelected(button.index);
          }}>
          <NavLink
            to={button.path}
            className={({ isActive }) =>
              isActive
                ? "sub-navlinks f-label-text"
                : "sub-navlinks f-label-text"
            }>
            <span>{button.icon}</span>
            {button.name}
          </NavLink>
        </li>
      ))}
    </>
  );
};

export default AppNavlinks;
