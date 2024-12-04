import React, { useEffect, useState } from "react";
import {
  BsCurrencyRupee,
  BsDatabaseAdd,
  BsFileTextFill,
  BsPassFill,
  BsSaveFill,
  BsFileEarmarkCodeFill,
} from "react-icons/bs";
import { TfiStatsUp } from "react-icons/tfi";
import "../../../Styles/Mainapp/Apphome/Apphome.css";

const AppNavlinks = ({ isselected, setIsSelected }) => {
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const myrole = localStorage.getItem("userRole");
    setUserRole(myrole);
  }, []);

  const hnavlinks = [
    {
      name: "Milk Collection",
      icon: <BsDatabaseAdd className="icon" />,
      index: 0,
      role: ["super_admin", "admin", "manager"],
    },
    {
      name: "Milk Collection",
      icon: <BsDatabaseAdd className="icon" />,
      index: 1,
      role: ["super_admin", "milkcollector", "mobilecollector"],
    },
    // {
    //   name: "Previous Collection",
    //   icon: <BsPassFill className="icon" />,
    //   index: 2,
    //   role: [
    //     "super_admin",
    //     "admin",
    //     "manager",
    //   ],
    // },
    {
      name: "Complete Collection",
      icon: <BsSaveFill className="icon" />,
      index: 2,
      role: ["super_admin", "admin", "manager"],
    },
    // {
    //   name: "Update Collection",
    //   icon: <BsFileEarmarkCodeFill className="icon" />,
    //   index: 3,
    //   role: ["super_admin", "admin", "manager"],
    // },
    // {
    //   name: "Report",
    //   icon: <BsFileTextFill className="icon" />,
    //   index: 5,
    //   role: ["super_admin", "admin", "manager", "milkcollector"],
    // },
    // {
    //   name: "Sales",
    //   icon: <TfiStatsUp className="icon" />,
    //   index: 6,
    //   role: ["super_admin", "admin", "manager"],
    // },
    // {
    //   name: "Payments",
    //   icon: <BsCurrencyRupee className="icon" />,
    //   index: 7,
    //   role: ["super_admin", "admin", "manager"],
    // },
    {
      name: "Report",
      icon: <BsFileTextFill className="icon" />,
      index: 4,
      role: ["super_admin", "milkcollector", "mobilecollector"],
    },
    // {
    //   name: "Reports",
    //   icon: <BsCurrencyRupee className="icon" />,
    //   index: 5,
    //   role: ["super_admin", "admin", "manager"],
    // },
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
            isselected === button.index ? "selected" : ""
          }`}
          onClick={() => {
            setIsSelected(button.index);
          }}>
          <a>
            {button.icon}
            <span>{button.name}</span>
          </a>
        </li>
      ))}
    </>
  );
};

export default AppNavlinks;
