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
  BsFillCollectionFill,
  BsSignTurnSlightRight,
} from "react-icons/bs";
import {
  FaUserTie,
  FaUserCircle,
  FaAlignJustify,
  FaFileAlt,
} from "react-icons/fa";
import {
  FaGears,
  FaFileLines,
  FaFileContract,
  FaFileInvoice,
  FaFileInvoiceDollar,
  FaSitemap,
} from "react-icons/fa6";
import { TbTruckReturn } from "react-icons/tb";
import { IoAnalyticsOutline } from "react-icons/io5";
import {
  MdAddchart,
  MdGroupAdd,
  MdDomainAdd,
  MdOutlineAddTask,
} from "react-icons/md";
import { GrNotes, GrOrganization } from "react-icons/gr";
import { NavLink } from "react-router-dom";
import "../../Styles/Mainapp/Mainapphome.css";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { GiEdgeCrack } from "react-icons/gi";

const Mainappnavlinks = ({ setselected, handleSidebar }) => {
  const { t } = useTranslation([
    "common",
    "milkcollection",
    "msales",
    "inventory",
    "master",
  ]);
  const [activeMenu, setActiveMenu] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const center_id = useSelector((state) => state.dairy.dairyData.center_id);
  useEffect(() => {
    const myrole = localStorage.getItem("userRole");
    setUserRole(myrole);
  }, []);

  const mainnavbuttons = [
    {
      name: `${t("nv-dash")}`,
      icon: <BsGridFill className="icon" />,
      index: 0,
      path: "dashboard",
      role: ["admin", "super_admin", "manager"],
    },
    {
      name: `${t("nv-milk-purchase")}`,
      icon: <TbMilk className="icon" />,
      path: "#",
      index: 1,
      role: [
        "admin",
        "super_admin",
        "manager",
        "milkcollector",
        "mobilecollector",
      ],
      submenus: [
        {
          name: `${t("milkcollection:m-milkcoll")}`,
          icon: <BsGridFill className="icon" />,
          path: "milk/collection/collection/morning",
          index: 1.0,
          role: ["admin", "manager", "mobilecollector"],
        },
        {
          name: `${t("milkcollection:m-mrgcoll")}`,
          icon: <BsGridFill className="icon" />,
          path: "milk/collection/morning",
          index: 1.1,
          role: ["admin", "manager", "milkcollector", "salesman"],
        },
        {
          name: `${t("milkcollection:m-evecoll")}`,
          icon: <BsGridFill className="icon" />,
          path: "milk/collection/evening",
          index: 1.2,
          role: ["admin", "manager", "milkcollector", "salesman"],
        },
        {
          name: `${t("milkcollection:m-nv-custmaster")}`,
          icon: <BsGridFill className="icon" />,
          path: "milk/customer/master",
          index: 1.4,
          role: ["admin", "manager", "salesman"],
        },
        {
          name: `${t("milkcollection:m-nv-ratemaster")}`,
          icon: <BsGridFill className="icon" />,
          path: "milk/rate/master",
          index: 1.5,
          role: ["admin", "manager", "salesman"],
        },
        {
          name: `${t("milkcollection:m-milk-coll-report")}`,
          icon: <BsGridFill className="icon" />,
          path: "milk/vehicle/milk-report",
          index: 1.6,
          role: ["admin", "manager", "salesman"],
        },
        {
          name: `${t("milkcollection:m-sale-report")}`,
          icon: <BsGridFill className="icon" />,
          path: "milk/vehicle/sales-report",
          index: 1.7,
          role: ["admin", "manager", "salesman"],
        },
        {
          name: `${t("milkcollection:m-retail-ms-report")}`,
          icon: <BsGridFill className="icon" />,
          path: "milk/retail/sales-report",
          index: 1.8,
          role: ["admin", "manager", "salesman"],
        },
      ],
    },
    {
      name: `${t("nv-milk-sales")}`,
      icon: <TbMilk className="icon" />,
      index: 2,
      role: ["admin", "super_admin", "manager"],
      submenus: [
        {
          name: `${t("msales:m-s-sales")}`,
          icon: <BsGridFill className="icon" />,
          path: "milk/sangha",
          index: 2.1,
          role: ["admin", "manager", "salesman"],
        },
        {
          name: `${t("milkcollection:m-milk-sale")}`,
          icon: <BsGridFill className="icon" />,
          path: "milk/retail/sales",
          index: 2.2,
          role: ["admin", "manager", "salesman"],
        },
      ],
    },
    {
      name: `${t("nv-inventory")}`,
      icon: <BsHouseFill className="icon" />,
      index: 3,
      role: ["admin", "super_admin", "manager", "salesman"],
      submenus: [
        {
          name: `${t("inventory:in-nv-dealar-master")}`,
          icon: <FaUserTie className="icon" />,
          index: 3.1,
          path: "inventory/dealer",
          role: ["admin", "manager"],
        },
        {
          name: `${t("inventory:in-nv-prod-master")}`,
          icon: <FaSitemap className="icon" />,
          path: "inventory/product",
          index: 3.2,
          role: ["admin", "manager"],
        },
        {
          name: `${t("inventory:in-nv-prod-purch")}`,
          icon: <MdAddchart className="icon" />,
          path: "inventory/product/purchase/cattlefeed",
          index: 3.3,
          role: ["admin", "manager", "salesman"],
        },
        {
          name: `${t("inventory:in-nv-prod-sale")}`,
          icon: <IoAnalyticsOutline className="icon" />,
          path: "inventory/product/sales/cattlefeed",
          index: 3.4,
          role: ["admin", "manager", "salesman"],
        },
        {
          name: `${t("inventory:in-nv-init-stock")}`,
          icon: <FaAlignJustify className="icon" />,
          path: "inventory/product/stock/starting/stock",
          index: 3.5,
          role: ["admin", "super_admin", "manager"],
        },
        {
          name: `${t("inventory:nv-dealer-return")}`,
          icon: <TbTruckReturn className="icon" />,
          path: "inventory/returns/",
          index: 3.6,
          role: ["admin", "manager", "salesman"],
        },
        {
          name: `${t("inventory:nv-cust-return")}`,
          icon: <BsSignTurnSlightRight className="icon" />,
          path: "inventory/returns/cust-return-list/",
          index: 3.7,
          role: ["admin", "manager", "salesman"],
        },
        {
          name: `${t("inventory:nv-stockKeeper")}`,
          icon: <TbTruckReturn className="icon" />,
          path: "inventory/stock-keeper/list",
          index: 3.8,
          role: ["admin", "manager", "salesman"],
        },
        {
          name: `${t("inventory:nv-updateSellRate")}`,
          icon: <MdOutlineAddTask className="icon" />,
          path: "inventory/update-sell-rate",
          index: 3.9,
          role: ["admin", "manager"],
        },
        {
          name: `${t("inventory:nv-expiredPro")}`,
          icon: <GiEdgeCrack className="icon" />,
          path: "inventory/expired-product",
          index: 3.11,
          role: ["admin", "manager"],
        },
      ],
    },
    {
      name: `${t("nv-acc")}`,
      icon: <GrNotes className="icon" />,
      index: 4,
      path: "accounts",
      role: ["admin", "super_admin", "manager"],
    },
    {
      name: `${t("nv-master")}`,
      icon: <BsFillCollectionFill className="icon" />,
      index: 5,
      role: ["super_admin", "admin", "manager"],
      submenus: [
        {
          name: `${t("master:m-nv-mledger")}`,
          icon: <FaFileInvoice className="icon" />,
          index: 5.1,
          path: "master/main-ledger",
          role: ["admin", "super_admin", "manager"],
        },
        {
          name: `${t("master:m-nv-sledger")}`,
          icon: <FaFileAlt className="icon" />,
          index: 5.2,
          path: "master/sub-ledger",
          role: ["admin", "super_admin", "manager"],
        },
        // {
        //   name: "Customer Master",
        //   icon: <BsGridFill className="icon" />,
        //   index: 5.3,
        //   path: "master/customer",
        //   role: ["admin", "super_admin", "manager"],
        // },
        {
          name: `${t("master:m-nv-empmaster")}`,
          icon: <MdGroupAdd className="icon" />,
          index: 5.4,
          path: "master/employee",
          role: ["admin", "super_admin", "manager"],
        },
        {
          name: `${t("master:m-nv-bankmaster")}`,
          icon: <MdDomainAdd className="icon" />,
          index: 5.5,
          path: "master/bank",
          role: ["admin", "super_admin", "manager"],
        },
      ],
    },
    {
      name: `${t("nv-reports")}`,
      icon: <TbMilk className="icon" />,
      index: 6,
      role: ["super_admin", "admin", "manager"],
      submenus: [
        ...(center_id === 0
          ? [
              {
                name: `${t("center-report")}`,
                icon: <BsGridFill className="icon" />,
                index: 6.1,
                path: "reports/center",
                role: ["admin", "super_admin", "manager"],
              },
            ]
          : []),
        {
          name: `${t("milk-report")}`,
          icon: <FaFileContract className="icon" />,
          index: 6.2,
          path: "reports/milk",
          role: ["admin", "super_admin", "manager"],
        },
        {
          name: `${t("cust-report")}`,
          icon: <FaFileLines className="icon" />,
          index: 6.3,
          path: "reports/customer",
          role: ["admin", "super_admin", "manager"],
        },
        {
          name: `${t("emp-report")}`,
          icon: <FaFileLines className="icon" />,
          index: 6.4,
          path: "reports/employee",
          role: ["admin", "super_admin", "manager"],
        },
        {
          name: `${t("inventory-report")}`,
          icon: <FaFileInvoice className="icon" />,
          index: 6.5,
          path: "reports/inventory",
          role: ["admin", "super_admin", "manager"],
        },
        {
          name: `${t("sales-report")}`,
          icon: <FaFileInvoice className="icon" />,
          index: 6.6,
          path: "reports/sales",
          role: ["admin", "super_admin", "manager"],
        },
        {
          name: `${t("pay-report")}`,
          icon: <FaFileInvoiceDollar className="icon" />,
          index: 6.7,
          path: "reports/payment",
          role: ["admin", "super_admin", "manager"],
        },
      ],
    },
    {
      name: `${t("nv-pay")}`,
      icon: <TbMilk className="icon" />,
      index: 7,
      role: ["super_admin", "admin", "manager"],
      submenus: [
        {
          name: `${t("milk-correction")}`,
          icon: <BsGridFill className="icon" />,
          index: 7.1,
          path: "payment/milk-correction",
          role: ["admin", "super_admin", "manager"],
        },
        {
          name: `${t("milk-transfer")}`,
          icon: <BsGridFill className="icon" />,
          index: 7.2,
          path: "payment/milk-transfer",
          role: ["admin", "super_admin", "manager"],
        },
        {
          name: `${t("pay-deduction")}`,
          icon: <BsGridFill className="icon" />,
          index: 7.3,
          path: "payment/add-deductions",
          role: ["admin", "super_admin", "manager"],
        },
        {
          name: `${t("gen-payments")}`,
          icon: <BsGridFill className="icon" />,
          index: 7.4,
          path: "payment/generate",
          role: ["admin", "super_admin", "manager"],
        },
      ],
    },
    {
      name: `${t("nv-dairy-info")}`,
      icon: <BsCoin className="icon" />,
      index: 8,
      role: ["admin", "super_admin", "manager"],
      submenus: [
        {
          name: `${t("nv-dairy-info")}`,
          icon: <GrOrganization className="icon" />,
          index: 8.1,
          path: "dairy/information",
          role: ["admin", "super_admin", "manager"],
        },
        {
          name: `${t("dairy-init-info")}`,
          icon: <BsGridFill className="icon" />,
          index: 8.2,
          path: "dairy/initial-info",
          role: ["admin", "super_admin", "manager"],
        },
        ...(center_id === 0
          ? [
              {
                name: `${t("dairy-cre-center")}`,
                icon: <BsGridFill className="icon" />,
                index: 8.3,
                path: "dairy/create/center",
                role: ["admin", "super_admin", "manager"],
              },
            ]
          : []),
      ],
    },
    {
      name: `${t("nv-settings")}`,
      icon: <BsGearFill className="icon" />,
      index: 9,
      role: ["super_admin", "admin"],
      submenus: [
        ...(center_id === 0
          ? [
              {
                name: `${t("dairy-settings")}`,
                icon: <BsBuildingFillGear className="icon" />,
                index: 9.1,
                path: "settings/dairy",
                role: ["super_admin", "admin"],
              },
            ]
          : []),

        {
          name: `${t("inventory-settings")}`,
          icon: <BsHouseGearFill className="icon" />,
          index: 9.2,
          path: "settings/inventory",
          role: ["super_admin", "admin"],
        },
        {
          name: `${t("machine-settings")}`,
          icon: <FaGears className="icon" />,
          index: 9.3,
          path: "settings/machine",
          role: ["super_admin", "admin"],
        },
      ],
    },
    {
      name: `${t("nv-profile")}`,
      icon: <FaUserCircle className="icon" />,
      index: 10,
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
              <NavLink className="main-nav-text px5" to={button.path}>
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
