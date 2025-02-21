/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { TbMilk } from "react-icons/tb";
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
import { FaUserCircle } from "react-icons/fa";
import {
  FaGears,
  FaFileLines,
  FaFileContract,
  FaFileInvoice,
  FaFileInvoiceDollar,
} from "react-icons/fa6";
import { GrNotes, GrOrganization } from "react-icons/gr";
import { NavLink } from "react-router-dom";
import "../../Styles/Mainapp/Mainapphome.css";

const Mainappnavlinks = ({setselected, handleSidebar }) => {
  const [activeMenu, setActiveMenu] = useState(null);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const myrole = localStorage.getItem("userRole");
    setUserRole(myrole);
  }, []);

  const mainnavbuttons = [
    {
      name: "Dashboard",
      icon: <BsGridFill className="icon" />,
      index: 0,
      path: "dashboard",
      role: ["admin", "super_admin", "manager"],
    },
    {
      name: "Milk Collection",
      icon: <TbMilk className="icon" />,
      path: "milk",
      index: 1,
      role: [
        "admin",
        "super_admin",
        "manager",
        "milkcollector",
        "mobilecollector",
      ],
    },
    {
      name: "Milk Sales",
      icon: <TbMilk className="icon" />,
      index: 2,
      role: [
        "admin",
        "super_admin",
        "manager",
        "milkcollector",
        "mobilecollector",
      ],
      submenus: [
        {
          name: "Sangha Sales",
          icon: <BsGridFill className="icon" />,
          path: "milk/sangha",
          index: 2.1,
          role: ["admin", "manager", "salesman"],
        },
      ],
    },
    {
      name: "Inventory",
      icon: <BsHouseFill className="icon" />,
      index: 3,
      role: ["admin", "super_admin", "manager", "salesman"],
      submenus: [
        {
          name: "Dealer Master",
          icon: <BsGridFill className="icon" />,
          index: 3.1,
          path: "inventory/dealer",
          role: ["admin", "manager", "salesman"],
        },
        {
          name: "Product List",
          icon: <BsGridFill className="icon" />,
          path: "inventory/product",
          index: 3.2,
          role: ["admin", "manager", "salesman"],
        },
        {
          name: "Stock",
          icon: <BsGridFill className="icon" />,
          path: "inventory/product/stock",
          index: 3.3,
          role: [
            "admin",
            "super_admin",
            "manager",
            "milkcollector",
            "mobilecollector",
          ],
        },
        {
          name: "Returns",
          icon: <BsGridFill className="icon" />,
          path: "inventory/returns",
          index: 3.4,
          role: ["admin", "manager", "salesman"],
        },
      ],
    },
    {
      name: "Accounts",
      icon: <GrNotes className="icon" />,
      index: 4,
      path: "accounts",
      role: ["admin", "super_admin", "manager", "salesman"],
    },
    {
      name: "Masters",
      icon: <TbMilk className="icon" />,
      index: 5,
      role: ["super_admin", "admin", "manager"],
      submenus: [
        {
          name: "Main Ledger",
          icon: <BsGridFill className="icon" />,
          index: 5.1,
          path: "master/main-ledger",
          role: ["admin", "super_admin", "manager"],
        },
        {
          name: "Sub Ledger",
          icon: <BsGridFill className="icon" />,
          index: 5.2,
          path: "master/sub-ledger",
          role: ["admin", "super_admin", "manager"],
        },
        {
          name: "Customer Master",
          icon: <BsGridFill className="icon" />,
          index: 5.3,
          path: "master/customer",
          role: ["admin", "super_admin", "manager"],
        },
        {
          name: "Employee Master",
          icon: <BsGridFill className="icon" />,
          index: 5.4,
          path: "master/employee",
          role: ["admin", "super_admin", "manager"],
        },
        {
          name: "Bank Master",
          icon: <BsGridFill className="icon" />,
          index: 5.5,
          path: "master/bank",
          role: ["admin", "super_admin", "manager"],
        },
        {
          name: "Milk Rate Master",
          icon: <BsGridFill className="icon" />,
          index: 5.6,
          path: "master/ratechart",
          role: ["admin", "super_admin", "manager"],
        },
      ],
    },
    {
      name: "Purchase",
      icon: <TbMilk className="icon" />,
      index: 6,
      role: ["super_admin", "admin", "manager"],
      submenus: [
        {
          name: "Cattel Feed",
          icon: <BsGridFill className="icon" />,
          index: 6.1,
          path: "purchase/cattlefeed",
          role: ["admin", "super_admin", "manager"],
        },
        {
          name: "Grocery",
          icon: <BsGridFill className="icon" />,
          index: 6.2,
          path: "purchase/grocery",
          role: ["admin", "super_admin", "manager"],
        },
        {
          name: "Medicines",
          icon: <BsGridFill className="icon" />,
          index: 6.3,
          path: "purchase/medicines",
          role: ["admin", "super_admin", "manager"],
        },
        {
          name: "Others",
          icon: <BsGridFill className="icon" />,
          index: 6.4,
          path: "purchase/other",
          role: ["admin", "super_admin", "manager"],
        },
      ],
    },
    {
      name: "Sales",
      icon: <TbMilk className="icon" />,
      index: 7,
      role: ["super_admin", "admin", "manager"],
      submenus: [
        {
          name: "Cattle Feed",
          icon: <BsGridFill className="icon" />,
          index: 7.1,
          path: "sales/cattlefeed",
          role: ["admin", "super_admin", "manager"],
        },
        {
          name: "Grocery",
          icon: <BsGridFill className="icon" />,
          index: 7.2,
          path: "sales/grocery",
          role: ["admin", "super_admin", "manager"],
        },
        {
          name: "Medicines",
          icon: <BsGridFill className="icon" />,
          index: 7.3,
          path: "sales/medicines",
          role: ["admin", "super_admin", "manager"],
        },
        {
          name: "Others",
          icon: <BsGridFill className="icon" />,
          index: 7.4,
          path: "sales/other-items",
          role: ["admin", "super_admin", "manager"],
        },
      ],
    },
    {
      name: "Reports",
      icon: <TbMilk className="icon" />,
      index: 8,
      role: ["super_admin", "admin", "manager"],
      submenus: [
        {
          name: "Center Reports",
          icon: <FaFileLines className="icon" />,
          index: 8.1,
          path: "reports/center",
          role: ["admin", "super_admin", "manager"],
        },
        {
          name: "Milk Reports",
          icon: <FaFileContract className="icon" />,
          index: 8.2,
          path: "reports/milk",
          role: ["admin", "super_admin", "manager"],
        },
        {
          name: "Customer Reports",
          icon: <FaFileLines className="icon" />,
          index: 8.3,
          path: "reports/customer",
          role: ["admin", "super_admin", "manager"],
        },
        {
          name: "Employee Reports",
          icon: <FaFileLines className="icon" />,
          index: 8.4,
          path: "reports/employee",
          role: ["admin", "super_admin", "manager"],
        },
        {
          name: "Inventory Reports",
          icon: <FaFileInvoice className="icon" />,
          index: 8.5,
          path: "reports/inventory",
          role: ["admin", "super_admin", "manager"],
        },
        {
          name: "Sales Reports",
          icon: <FaFileInvoice className="icon" />,
          index: 8.6,
          path: "reports/sales",
          role: ["admin", "super_admin", "manager"],
        },
        {
          name: "Payment Reports",
          icon: <FaFileInvoiceDollar className="icon" />,
          index: 8.7,
          path: "reports/payment",
          role: ["admin", "super_admin", "manager"],
        },
      ],
    },
    {
      name: "Payments",
      icon: <TbMilk className="icon" />,
      index: 9,
      role: ["super_admin", "admin", "manager"],
      submenus: [
        {
          name: "Milk Correction",
          icon: <BsGridFill className="icon" />,
          index: 9.1,
          path: "payment/milk-correction",
          role: ["admin", "super_admin", "manager"],
        },
        {
          name: "Milk Transfer",
          icon: <BsGridFill className="icon" />,
          index: 9.2,
          path: "payment/milk-transfer",
          role: ["admin", "super_admin", "manager"],
        },
        {
          name: "Payment Deductions",
          icon: <BsGridFill className="icon" />,
          index: 9.3,
          path: "payment/add-deductions",
          role: ["admin", "super_admin", "manager"],
        },
        {
          name: "Generate Payments",
          icon: <BsGridFill className="icon" />,
          index: 9.4,
          path: "payment/generate",
          role: ["admin", "super_admin", "manager"],
        },
      ],
    },
    {
      name: "Dairy",
      icon: <BsCoin className="icon" />,
      index: 10,
      role: ["admin", "super_admin", "manager"],
      submenus: [
        {
          name: "Dairy Information",
          icon: <GrOrganization className="icon" />,
          index: 10.1,
          path: "dairy/information",
          role: ["admin", "super_admin", "manager"],
        },
        {
          name: "Initial Information",
          icon: <BsGridFill className="icon" />,
          index: 10.2,
          path: "dairy/initial-info",
          role: ["admin", "super_admin", "manager"],
        },
        {
          name: "Create New Center",
          icon: <BsGridFill className="icon" />,
          index: 10.3,
          path: "dairy/create/center",
          role: ["admin", "super_admin", "manager"],
        },
      ],
    },
    {
      name: "Settings",
      icon: <BsGearFill className="icon" />,
      index: 11,
      role: ["super_admin", "admin"],
      submenus: [
        {
          name: "Dairy Settings",
          icon: <BsBuildingFillGear className="icon" />,
          index: 11.1,
          path: "settings/dairy",
          role: ["super_admin", "admin"],
        },
        {
          name: "Inventory Settings",
          icon: <BsHouseGearFill className="icon" />,
          index: 11.2,
          path: "settings/inventory",
          role: ["super_admin", "admin"],
        },
        {
          name: "Machine Settings",
          icon: <FaGears className="icon" />,
          index: 11.3,
          path: "settings/machine",
          role: ["super_admin", "admin"],
        },
      ],
    },
    {
      name: "My Profile",
      icon: <FaUserCircle className="icon" />,
      index: 12,
      path: "profile-info",
      role: ["milkcollector", "mobilecollector"],
    },
  ];

  const filterRoutesByRole = (routes, userRole) => {
    return routes
      .filter(
        (route) => route.role.includes(userRole) // Only return the routes for which the user's role is allowed
      )
      .map((route) => {
        if (route.submenus) {
          // If the route has submenus, filter them based on the user's role too
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

  const filteredNavButtons = filterRoutesByRole(mainnavbuttons, userRole);

  const handleMainClick = (button) => {
    if (button.submenus) {
      setActiveMenu(activeMenu === button.index ? null : button.index);
    } else {
      setselected(button.index);
      handleSidebar();
      setActiveMenu(null);
    }
  };

  const handleSubmenuClick = (submenu) => {
    setselected(submenu.index);
    handleSidebar();
    setActiveMenu(null);
  };

  return (
    <ul className="sidenav-btns">
      {filteredNavButtons.map((button, index) => (
        <li key={uuidv4()} className="main-navs py5">
          <div
            className="nav-link w90 d-flex a-center"
            onClick={() => handleMainClick(button)}
          >
            <div className="nav-main w80 d-flex a-center">
              {button.icon}
              <NavLink className="main-nav-text px5 f-heading" to={button.path}>
                {button.name}
              </NavLink>
            </div>
            {button.submenus && (
              <NavLink className="submenu-arrow w10">
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
                  <span className="submenu-text px10">{submenu.name}</span>
                </NavLink>
              ))}
            </ul>
          )}
        </li>
      ))}
    </ul>
  );
};

export default Mainappnavlinks;
