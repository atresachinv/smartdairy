import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import {
  BsHouseFill,
  BsCoin,
  BsGearFill,
  BsGridFill,
  BsCaretUpFill,
  BsCaretDownFill,
  BsBuildingFillGear,
  BsHouseGearFill,
} from "react-icons/bs";
import { NavLink } from "react-router-dom";

const SidebarNavlinks = () => {
  const [activeMenu, setActiveMenu] = useState(null);

  const superadminnavs = [
    {
      name: "Dashboard",
      icon: <BsGridFill className="color-icon" />,
      index: 0,
      path: "dashboard",
    },
    {
      name: "Dairy Access",
      icon: <BsGridFill className="color-icon" />,
      index: 2,
      submenus: [
        {
          name: "Create Access",
          icon: <BsGridFill className="color-icon" />,
          path: "create/access",
          index: 2.1,
        },
        {
          name: "Add Access",
          icon: <BsGridFill className="color-icon" />,
          path: "milk-collection/access",
          index: 2.2,
        },
      ],
    },
    {
      name: "Message Settings",
      icon: <BsGridFill className="color-icon" />,
      index: 3,
      // path: "dairy-settings",
      submenus: [
        {
          name: "Milk Collection",
          icon: <BsGridFill className="color-icon" />,
          path: "milk/sangha",
          index: 2.1,
        },
        {
          name: "WhatsApp message",
          icon: <BsGridFill className="color-icon" />,
          path: "whatsapp-sms",
          index: 2.2,
        },
          {
            name: "Milk Filter Data",
            icon: <BsGridFill className="color-icon" />,
            path: "milk-filter-data",
            index: 2.3,
          },
          {
            name: "Upload Milk Entrys",
            icon: <BsGridFill className="color-icon" />,
            path: "upload-milk-entrys",
            index: 2.4,
          },
      ],
    },
  ];

  const handleMainClick = (button) => {
    if (button.submenus) {
      setActiveMenu(activeMenu === button.index ? null : button.index);
    } else {
      setActiveMenu(null);
    }
  };

  const handleSubmenuClick = () => {
    setActiveMenu(null);
  };

  return (
    <>
      {" "}
      <ul className="sidenav-btns">
        {superadminnavs.map((button, index) => (
          <li key={uuidv4()} className="main-navs py5">
            <div
              className="nav-link w90 d-flex a-center"
              onClick={() => handleMainClick(button)}
            >
              <div className="nav-main w80 d-flex a-center">
                {button.icon}
                <NavLink
                  className="main-nav-text px5 f-label-text"
                  to={button.path}
                >
                  {button.name}
                </NavLink>
              </div>
              {button.submenus && (
                <NavLink className="icon w10">
                  {activeMenu === button.index ? (
                    <BsCaretUpFill />
                  ) : (
                    <BsCaretDownFill />
                  )}
                </NavLink>
              )}
            </div>
            {button.submenus && activeMenu === button.index && (
              <ul className="submenu w100 d-flex-col j-end">
                {button.submenus.map((submenu) => (
                  <NavLink
                    key={submenu.index}
                    className="submenu-item w90 d-flex a-center"
                    to={submenu.path}
                    onClick={() => handleSubmenuClick(submenu)}
                  >
                    {submenu.icon}
                    <span className="f-label-text px10">{submenu.name}</span>
                  </NavLink>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </>
  );
};

export default SidebarNavlinks;
