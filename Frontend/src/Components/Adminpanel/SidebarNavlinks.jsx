import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { BsGridFill, BsCaretUpFill, BsCaretDownFill } from "react-icons/bs";
import { NavLink } from "react-router-dom";
import "../../Styles/AdminPannel/AdminPannel.css";

const SidebarNavlinks = ({ setselected, handleSidebar }) => {
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
      submenus: [
        {
          name: "Milk Collection",
          icon: <BsGridFill className="color-icon" />,
          path: "milk/sangha",
          index: 3.1,
        },
        {
          name: "WhatsApp message",
          icon: <BsGridFill className="color-icon" />,
          path: "whatsapp-sms",
          index: 3.2,
        },
        {
          name: "Milk Filter Data",
          icon: <BsGridFill className="color-icon" />,
          path: "milk-filter-data",
          index: 3.3,
        },
        {
          name: "Upload Milk Entrys",
          icon: <BsGridFill className="color-icon" />,
          path: "upload-milk-entrys",
          index: 3.4,
        },
      ],
    },
    {
      name: "Dairy Activation",
      icon: <BsGridFill className="color-icon" />,
      index: 4,
      submenus: [
        {
          name: "New Activation",
          icon: <BsGridFill className="color-icon" />,
          path: "new/activvation",
          index: 4.1,
        },
        {
          name: "Dairy Activations",
          icon: <BsGridFill className="color-icon" />,
          path: "dairy/activation",
          index: 4.2,
        },
      ],
    },
    {
      name: "AMC Settings",
      icon: <BsGridFill className="color-icon" />,
      index: 5,
      submenus: [
        {
          name: "Update Dairy Amc",
          icon: <BsGridFill className="color-icon" />,
          path: "update/dairy/amc",
          index: 5.1,
        },
        {
          name: "Update All Amc",
          icon: <BsGridFill className="color-icon" />,
          path: "update/all/amc",
          index: 5.2,
        },
      ],
    },
  ];

  const handleMainClick = (button) => {
    if (button.submenus) {
      setActiveMenu(activeMenu === button.index ? null : button.index);
    } else {
      setselected(button.index);
      handleSidebar();
      setActiveMenu(null);
    }
  };

  const handleSubmenuClick = () => {
    setselected(submenu.index);
    handleSidebar();
    setActiveMenu(null);
  };

  return (
    <ul className="sidenav-btns">
      {superadminnavs.map((button) => (
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
                  onClick={() => {
                    setselected(submenu.index);
                    handleSidebar();
                  }}
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
  );
};

export default SidebarNavlinks;
