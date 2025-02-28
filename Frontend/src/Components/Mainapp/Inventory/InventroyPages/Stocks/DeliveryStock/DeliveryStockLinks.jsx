import { useState } from "react";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";
import { SiElasticstack } from "react-icons/si";
import { MdOutlineAddTask } from "react-icons/md";
import { IoBagAddSharp } from "react-icons/io5";
import { FaListUl } from "react-icons/fa";
import { BsSignTurnSlightRight } from "react-icons/bs";
import "../../../../../../Styles/Mainapp/Inventory/InventoryPages/Stock.css";

// eslint-disable-next-line react/prop-types
const DeliveryStockLinks = ({ isselected, setIsSelected, userRole }) => {
  const { t } = useTranslation(["milkcollection"]);

  const hnavlinks = [
    {
      name: `Stock Keeper Sale`,
      icon: <SiElasticstack className="icon" />,
      index: 1,
      path: "list",
      role: ["super_admin", "admin"],
      // submenus: [
      //   {
      //     name: "Add Stock",
      //     index: 1.1,
      //     path: "delivery/add-stock",
      //     icon: <IoBagAddSharp />,
      //   },
      //   {
      //     name: "Stock List",
      //     index: 1.2,
      //     path: "delivery/list",
      //     icon: <FaListUl />,
      //   },
      // ],
    },
    {
      name: `Stock Keeper Return`,
      icon: <MdOutlineAddTask className="icon" />,
      index: 2,
      path: "return-list",
      role: ["super_admin", "admin", "salesman"],
      // submenus: [
      //   {
      //     name: "Add return",
      //     index: 2.1,
      //     path: "delivery/returns",
      //     icon: <BsSignTurnSlightRight />,
      //   },
      //   {
      //     name: "Return List",
      //     index: 2.2,
      //     path: "delivery/return-list",
      //     icon: <FaListUl />,
      //   },
      // ],
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
            <span>{button.icon}</span>
            {button.name}
          </NavLink>

          {/* {button.submenus && dropdownVisible[index] && (
            <ul className="dropdown-menu">
              {button.submenus.map((submenu, subIndex) => (
                <li key={subIndex}>
                  <NavLink to={submenu.path} className="dropdown-item">
                    <span className="px10">{submenu.icon}</span>
                    {submenu.name}
                  </NavLink>
                </li>
              ))}
            </ul>
          )} */}
        </li>
      ))}
    </>
  );
};

export default DeliveryStockLinks;
