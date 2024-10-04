// Mainappnavlinks.js
import React, { useState } from "react";
import { TbMilk } from "react-icons/tb";
import { BsHouseFill, BsCoin, BsGearFill, BsGridFill } from "react-icons/bs";
import "../../Styles/Mainapp/Mainapphome.css";

const Mainappnavlinks = ({ setselected, handleSidebar }) => {
  const [activeMenu, setActiveMenu] = useState(null); // Track which menu is expanded

  const mainnavbuttons = [
    { name: "Dashboard", icon: <BsGridFill className="icon" />, index: 0 },
    { name: "Milk", icon: <TbMilk className="icon" />, index: 1 },
    {
      name: "Inventory",
      icon: <BsHouseFill className="icon" />,
      index: 2,
      submenus: [
        {
          name: "Product List",
          icon: <BsGridFill className="icon" />,
          index: 2.1,
        },
        {
          name: "Product Purchase",
          icon: <BsGridFill className="icon" />,
          index: 2.2,
        },
        {
          name: "Product Sale",
          icon: <BsGridFill className="icon" />,
          index: 2.3,
        },
        {
          name: "Starting Stock",
          icon: <BsGridFill className="icon" />,
          index: 2.4,
        },
      ],
    },
    { name: "Accounts", icon: <BsCoin className="icon" />, index: 3 },
    {
      name: "Masters",
      icon: <TbMilk className="icon" />,
      index: 4,
      submenus: [
        {
          name: "Main Ledger",
          icon: <BsGridFill className="icon" />,
          index: 4.1,
        },
        {
          name: "Sub Ledger",
          icon: <BsGridFill className="icon" />,
          index: 4.2,
        },
        {
          name: "Customer Master",
          icon: <BsGridFill className="icon" />,
          index: 4.3,
        },
        {
          name: "Employee Master",
          icon: <BsGridFill className="icon" />,
          index: 4.4,
        },
        {
          name: "Milk Rate Master",
          icon: <BsGridFill className="icon" />,
          index: 4.5,
        },
      ],
    },
    {
      name: "Settings",
      icon: <BsGearFill className="icon" />,
      index: 5,
      submenus: [
        {
          name: "Dairy Settings",
          icon: <BsGridFill className="icon" />,
          index: 5.1,
        },
        {
          name: "Inventory Settings",
          icon: <BsGridFill className="icon" />,
          index: 5.2,
        },
        {
          name: "Machine Settings",
          icon: <BsGridFill className="icon" />,
          index: 5.3,
        },
      ],
    },
  ];

  const handleMainClick = (button) => {
    if (button.submenus) {
      // Toggle the submenu
      setActiveMenu(activeMenu === button.index ? null : button.index);
    } else {
      // Set the selected index for main menu items without submenus
      setselected(button.index);
      handleSidebar();
      setActiveMenu(null); // Close any open submenu
    }
  };

  const handleSubmenuClick = (submenu) => {
    console.log("Submenu clicked:", submenu.name, "Index:", submenu.index);
    setselected(submenu.index);
    handleSidebar();
    setActiveMenu(null); // Close the submenu after selection
  };

  return (
    <ul className="sidenav-btns">
      {mainnavbuttons.map((button) => (
        <li key={button.index} className="py5">
          <div className="nav-link w90 d-flex" onClick={() => handleMainClick(button)}>
            <div className="nav-main w70">
              {button.icon}
              <span className="px5 f-heading">{button.name}</span>
            </div>
            {button.submenus && (
              <span className="submenu-arrow w10">
                {activeMenu === button.index ? "▲" : "▼"}
              </span>
            )}
          </div>
          {button.submenus && activeMenu === button.index && (
            <ul className="submenu w100 d-flex-col j-end">
              {button.submenus.map((submenu) => (
                <li
                  key={submenu.index}
                  className="submenu-item"
                  onClick={() => handleSubmenuClick(submenu)}>
                  {submenu.icon}{" "}
                  <span className="submenu-text px10">{submenu.name}</span>
                </li>
              ))}
            </ul>
          )}
        </li>
      ))}
    </ul>
  );
};

export default Mainappnavlinks;
