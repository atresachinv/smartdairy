import { useState } from "react";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";
import { SiElasticstack } from "react-icons/si";
import { GiEdgeCrack } from "react-icons/gi";
import { MdOutlineAddTask } from "react-icons/md";
import "../../../../../Styles/Mainapp/Inventory/InventoryPages/Stock.css";
import { IoBagAddSharp } from "react-icons/io5";
import { FaListUl } from "react-icons/fa";
import { BsSignTurnSlightRight } from "react-icons/bs";

// eslint-disable-next-line react/prop-types
const StocksNavlinks = ({ isselected, setIsSelected, userRole }) => {
  const { t } = useTranslation(["milkcollection"]);
  const [dropdownVisible, setDropdownVisible] = useState({});

  const toggleDropdown = (index, isOpen) => {
    setDropdownVisible((prev) => ({ ...prev, [index]: isOpen }));
  };

  const hnavlinks = [
    {
      name: `Starting Stock`,
      icon: <SiElasticstack className="icon" />,
      index: 0,
      path: "starting/stock",
      role: ["super_admin", "admin"],
      submenus: [
        { name: "Add", path: "add-stock", icon: <IoBagAddSharp /> },
        { name: "List", path: "list", icon: <FaListUl /> },
      ],
    },
    {
      name: `Expired Product`,
      icon: <GiEdgeCrack className="icon" />,
      index: 1,
      path: "expired/product",
      role: ["super_admin", "admin"],
    },
    {
      name: `Update Sale Rate`,
      icon: <MdOutlineAddTask className="icon" />,
      index: 2,
      path: "update/sale/rate",
      role: ["super_admin", "admin"],
    },
    {
      name: `Delivery Stock`,
      icon: <MdOutlineAddTask className="icon" />,
      index: 3,
      path: "delivery/add-stock",
      submenus: [
        { name: "Add", path: "delivery/add-stock", icon: <IoBagAddSharp /> },
        {
          name: "Add return",
          path: "delivery/returns",
          icon: <BsSignTurnSlightRight />,
        },
        { name: "List", path: "delivery/list", icon: <FaListUl /> },
      ],
      role: ["super_admin", "admin", "salesman"],
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
          onMouseEnter={() => button.submenus && toggleDropdown(index, true)}
          onMouseLeave={() => button.submenus && toggleDropdown(index, false)}
        >
          <NavLink to={button.path} className="sub-navlinks f-label-text">
            <span>{button.icon}</span>
            {button.name}
          </NavLink>

          {button.submenus && dropdownVisible[index] && (
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
          )}
        </li>
      ))}
    </>
  );
};

export default StocksNavlinks;
