import React, { useEffect, useState } from "react";
import {
  BsDatabaseAdd,
  BsFillFileEarmarkArrowUpFill,
} from "react-icons/bs";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";
import "../../../../Styles/Mainapp/Dashbaord/Dashboard.css";

const DashboardNavlinks = ({ isselected, setIsSelected }) => {
  const { t } = useTranslation(["milkcollection"]);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const myrole = localStorage.getItem("userRole");
    setUserRole(myrole);
  }, []);

  const hnavlinks = [
    {
      name: `${t("Milk Purchase")}`,
      icon: <BsDatabaseAdd className="icon" />,
      index: 0,
      role: ["super_admin", "admin", "manager"],
      path: "milk/purchase-info",
    },
    {
      name: `${t("Milk Sales")}`,
      icon: <BsDatabaseAdd className="icon" />,
      index: 1,
      role: ["super_admin", "admin", "manager"],
      path: "milk/sales-info",
    },
    {
      name: `${t("Inventory")}`,
      icon: <BsDatabaseAdd className="icon" />,
      index: 2,
      role: ["super_admin", "admin", "manager"],
      path: "inventory-info",
    },
    {
      name: `${t("Loss Gain")}`,
      icon: <BsFillFileEarmarkArrowUpFill className="icon" />,
      index: 3,
      path: "lossgain-info",
      role: ["super_admin", "admin", "manager"],
    }
  ];

  const filterRoutesByRole = (routes, userRole) => {
    return routes
      .filter((route) => route.role.includes(userRole))
      .map((route) => {
        if (route.submenus) {
          return {
            ...route,
            submenus: route.submenus.filter((submenu) =>
              submenu.role ? submenu.role.includes(userRole) : true
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
          className={`dashboard-nav-item d-flex a-center ${
            isselected === button.index ? "active" : ""
          }`}
          onClick={() => setIsSelected(button.index)} 
        >
          <NavLink to={button.path} className={"sub-navlinks label-text"}>
            {button.name}
          </NavLink>
        </li>
      ))}
    </>
  );
};

export default DashboardNavlinks;