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

const Mainappnavlinks = ({ setselected, handleSidebar }) => {
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
      // index: 0,
      path: "dashboard",
      role: ["admin", "super_admin", "manager"],
    },
    {
      name: "Milk Collection",
      icon: <TbMilk className="icon" />,
      path: "milk",
      role: [
        "admin",
        "super_admin",
        "manager",
        "milkcollector",
        "mobilecollector",
      ],
    },
    {
      name: "Inventory",
      icon: <BsHouseFill className="icon" />,
      index: 2,
      role: ["admin", "super_admin", "manager", "salesman"],
      submenus: [
        {
          name: "Dealer Master",
          icon: <BsGridFill className="icon" />,
          index: 2.1,
          path: "inventory/dealer",
          role: ["admin", "manager", "salesman"],
        },
        {
          name: "Product List",
          icon: <BsGridFill className="icon" />,
          path: "inventory/product",
          index: 2.2,
          role: ["admin", "manager", "salesman"],
        },
        {
          name: "Stock",
          icon: <BsGridFill className="icon" />,
          path: "inventory/product/stock",
          index: 2.3,
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
          index: 2.4,
          role: ["admin", "manager", "salesman"],
        },
        {
          name: "Reports",
          icon: <BsGridFill className="icon" />,
          path: "inventory/customer/returns",
          role: ["admin", "manager", "salesman"],
        },
        {
          name: "Dealer Returns",
          icon: <BsGridFill className="icon" />,
          path: "inventory/dealer/returns",
          role: ["admin", "manager", "salesman"],
        },
        {
          name: "Update Sale Rate",
          icon: <BsGridFill className="icon" />,
          path: "inventory/update/sale-rates",
          role: ["admin", "manager", "salesman"],
        },
      ],
    },
    {
      name: "Accounts",
      icon: <GrNotes className="icon" />,
      // index: 3,
      path: "accounts",
      role: ["admin", "super_admin", "manager", "salesman"],
    },
    {
      name: "Masters",
      icon: <TbMilk className="icon" />,
      index: 4,
      role: ["super_admin", "admin", "manager"],
      submenus: [
        {
          name: "Main Ledger",
          icon: <BsGridFill className="icon" />,
          path: "master/main-ledger",
          role: ["admin", "super_admin", "manager"],
        },
        {
          name: "Sub Ledger",
          icon: <BsGridFill className="icon" />,
          path: "master/sub-ledger",
          role: ["admin", "super_admin", "manager"],
        },
        {
          name: "Customer Master",
          icon: <BsGridFill className="icon" />,
          path: "master/customer",
          role: ["admin", "super_admin", "manager"],
        },
        {
          name: "Employee Master",
          icon: <BsGridFill className="icon" />,
          path: "master/employee",
          role: ["admin", "super_admin", "manager"],
        },
        {
          name: "Bank Master",
          icon: <BsGridFill className="icon" />,
          path: "master/bank",
          role: ["admin", "super_admin", "manager"],
        },
        {
          name: "Milk Rate Master",
          icon: <BsGridFill className="icon" />,
          path: "master/ratechart",
          role: ["admin", "super_admin", "manager"],
        },
      ],
    },
    {
      name: "Purchase",
      icon: <TbMilk className="icon" />,
      index: 5,
      role: ["super_admin", "admin", "manager"],
      submenus: [
        {
          name: "Cattel Feed",
          icon: <BsGridFill className="icon" />,
          path: "purchase/cattlefeed",
          role: ["admin", "super_admin", "manager"],
        },
        {
          name: "Grocery",
          icon: <BsGridFill className="icon" />,
          path: "purchase/grocery",
          role: ["admin", "super_admin", "manager"],
        },
        {
          name: "Medicines",
          icon: <BsGridFill className="icon" />,
          path: "purchase/medicines",
          role: ["admin", "super_admin", "manager"],
        },
        {
          name: "Others",
          icon: <BsGridFill className="icon" />,
          path: "purchase/other",
          role: ["admin", "super_admin", "manager"],
        },
      ],
    },
    {
      name: "Sales",
      icon: <TbMilk className="icon" />,
      role: ["super_admin", "admin", "manager"],
      submenus: [
        {
          name: "Cattle Feed",
          icon: <BsGridFill className="icon" />,
          path: "sales/cattlefeed",
          role: ["admin", "super_admin", "manager"],
        },
        {
          name: "Grocery",
          icon: <BsGridFill className="icon" />,
          path: "sales/grocery",
          role: ["admin", "super_admin", "manager"],
        },
        {
          name: "Medicines",
          icon: <BsGridFill className="icon" />,
          path: "sales/medicines",
          role: ["admin", "super_admin", "manager"],
        },
        {
          name: "Others",
          icon: <BsGridFill className="icon" />,
          path: "sales/other-items",
          role: ["admin", "super_admin", "manager"],
        },
      ],
    },
    {
      name: "Reports",
      icon: <TbMilk className="icon" />,
      index: 7,
      role: ["super_admin", "admin", "manager"],
      submenus: [
        {
          name: "Center Reports",
          icon: <FaFileLines className="icon" />,
          index: 7.1,
          path: "reports/center",
          role: ["admin", "super_admin", "manager"],
        },
        {
          name: "Milk Reports",
          icon: <FaFileContract className="icon" />,
          path: "reports/milk",
          role: ["admin", "super_admin", "manager"],
        },
        {
          name: "Customer Reports",
          icon: <FaFileLines className="icon" />,
          path: "reports/customer",
          role: ["admin", "super_admin", "manager"],
        },
        {
          name: "Employee Reports",
          icon: <FaFileLines className="icon" />,
          path: "reports/employee",
          role: ["admin", "super_admin", "manager"],
        },
        {
          name: "Inventory Reports",
          icon: <FaFileInvoice className="icon" />,
          path: "reports/inventory",
          role: ["admin", "super_admin", "manager"],
        },
        {
          name: "Sales Reports",
          icon: <FaFileInvoice className="icon" />,
          path: "reports/sales",
          role: ["admin", "super_admin", "manager"],
        },
        {
          name: "Payment Reports",
          icon: <FaFileInvoiceDollar className="icon" />,
          path: "reports/payment",
          role: ["admin", "super_admin", "manager"],
        },
        {
          name: "IR Purches Report",
          icon: <FaFileInvoiceDollar className="icon" />,
          path: "reports/inventory",
          role: ["admin", "super_admin", "manager"],
        },
      ],
    },
    {
      name: "Payments",
      icon: <TbMilk className="icon" />,
      index: 8,
      role: ["super_admin", "admin", "manager"],
      submenus: [
        {
          name: "Milk Correction",
          icon: <BsGridFill className="icon" />,
          path: "payment/milk-correction",
          role: ["admin", "super_admin", "manager"],
        },
        {
          name: "Milk Transfer",
          icon: <BsGridFill className="icon" />,
          path: "payment/milk-transfer",
          role: ["admin", "super_admin", "manager"],
        },
        {
          name: "Payment Deductions",
          icon: <BsGridFill className="icon" />,
          path: "payment/add-deductions",
          role: ["admin", "super_admin", "manager"],
        },
        {
          name: "Generate Payments",
          icon: <BsGridFill className="icon" />,
          path: "payment/generate",
          role: ["admin", "super_admin", "manager"],
        },
      ],
    },
    {
      name: "Dairy",
      icon: <BsCoin className="icon" />,
      index: 9,
      role: ["admin", "super_admin", "manager"],
      submenus: [
        {
          name: "Dairy Information",
          icon: <GrOrganization className="icon" />,
          path: "dairy/information",
          role: ["admin", "super_admin", "manager"],
        },
        {
          name: "Initial Information",
          icon: <BsGridFill className="icon" />,
          path: "dairy/initial-info",
          role: ["admin", "super_admin", "manager"],
        },
        {
          name: "Create New Center",
          icon: <BsGridFill className="icon" />,
          path: "dairy/create/center",
          role: ["admin", "super_admin", "manager"],
        },
      ],
    },
    {
      name: "Settings",
      icon: <BsGearFill className="icon" />,
      index: 10,
      role: ["super_admin", "admin", "manager"],
      submenus: [
        {
          name: "Dairy Settings",
          icon: <BsBuildingFillGear className="icon" />,
          path: "settings/dairy",
          role: ["super_admin", "admin", "manager"],
        },
        {
          name: "Inventory Settings",
          icon: <BsHouseGearFill className="icon" />,
          path: "settings/inventory",
          role: ["super_admin", "admin", "manager"],
        },
        {
          name: "Machine Settings",
          icon: <FaGears className="icon" />,
          path: "settings/machine",
          role: ["super_admin", "admin", "manager"],
        },
      ],
    },
    {
      name: "My Profile",
      icon: <FaUserCircle className="icon" />,
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
            onClick={() => handleMainClick(button)}>
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
                  onClick={() => handleSubmenuClick(submenu)}>
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
