import { useTranslation } from "react-i18next";
import { MdLocalGroceryStore, MdOutlineDevicesOther } from "react-icons/md";
import { GiFertilizerBag, GiMedicines } from "react-icons/gi";
import { NavLink } from "react-router-dom";

const PurchaseNavlinks = ({ isselected, setIsSelected }) => {
  const { t } = useTranslation(["puchasesale", "common"]);
  const CustNavbuttons = [
    {
      name: `${t("ps-nv-cattlefeed")}`,
      icon: <GiFertilizerBag className="icon" />,
      index: 1,
      path: "cattlefeed",
      role: ["super_admin", "admin"],
    },
    {
      name: `${t("ps-nv-grocery")}`,
      icon: <MdLocalGroceryStore className="icon" />,
      index: 2,
      path: "grocery",
      role: ["super_admin", "admin"],
    },
    {
      name: `${t("ps-nv-medicines")}`,
      icon: <GiMedicines className="icon" />,
      index: 3,
      path: "medicines",
      role: ["super_admin", "admin"],
    },
    {
      name: `${t("ps-nv-other")}`,
      icon: <MdOutlineDevicesOther className="icon" />,
      index: 4,
      path: "other-products",
      role: ["super_admin", "admin"],
      // submenus: [
      //   {
      //     name: `${t("ps-nv-list-other")}`,
      //     icon: <MdListAlt className="icon" />,
      //     path: "other-products/list",
      //     index: 4.1,
      //     role: ["super_admin", "admin"],
      //   },
      //   {
      //     name: `${t("ps-nv-add-other")}`,
      //     icon: <MdAddShoppingCart className="icon" />,
      //     path: "other-products/add-new",
      //     index: 4.2,
      //     role: ["super_admin", "admin"],
      //   },
      // ],
    },
  ];
  return (
    <>
      <ul className="nav-list d-flex">
        {CustNavbuttons.map((button, index) => (
          <li
            key={index}
            className={`home-nav-item d-flex a-center ${
              isselected === button.index ? "selected" : ""
            }`}
            onClick={() => setIsSelected(button.index)}
          >
            <NavLink
              to={button.path}
              className="sub-navlinks f-label-text d-flex a-center"
            >
              <span>{button.icon}</span>
              {button.name}
            </NavLink>

            {/* {button.submenus && hoveredIndex === index && (
              <ul className="dropdown-menu">
                {button.submenus.map((submenu, subIndex) => (
                  <li key={subIndex}>
                    <NavLink
                      to={submenu.path}
                      className="dropdown-item d-flex a-center"
                    >
                      <span className="color-icon mx5">{submenu.icon}</span>
                      {submenu.name}
                    </NavLink>
                  </li>
                ))}
              </ul>
            )} */}
          </li>
        ))}
      </ul>
    </>
  );
};

export default PurchaseNavlinks;
