/* eslint-disable react/prop-types */
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";
import { BsSignTurnRight, BsSignTurnSlightRight } from "react-icons/bs";
import { FaListUl } from "react-icons/fa";
import { IoBagAddSharp } from "react-icons/io5";

const ReturnsNavlinks = ({ isselected, setIsSelected }) => {
  const { t } = useTranslation(["milkcollection"]);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const hnavlinks = [
    {
      name: `Dealer Returns`,
      icon: <BsSignTurnRight className="icon" />,
      index: 0,
      path: "add-deal-return",
      submenus: [
        { name: "Add", path: "add-deal-return", icon: <IoBagAddSharp /> },
        { name: "List", path: "deal-return-list", icon: <FaListUl /> },
      ],
    },
    {
      name: `Customer Returns`,
      icon: <BsSignTurnSlightRight className="icon" />,
      index: 1,
      path: "add-cust-return",
      submenus: [
        { name: "Add", path: "add-cust-return", icon: <IoBagAddSharp /> },
        { name: "List", path: "cust-return-list", icon: <FaListUl /> },
      ],
    },
  ];

  return (
    <>
      {hnavlinks.map((button, index) => (
        <li
          key={index}
          className={`home-nav-item d-flex a-center ${
            isselected === button.path ? "selected" : ""
          }`}
          onClick={() => setIsSelected(button.path)}
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <NavLink to={button.path} className={"sub-navlinks f-label-text"}>
            <span>{button.icon}</span>
            {button.name}
          </NavLink>

          {button.submenus && hoveredIndex === index && (
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

export default ReturnsNavlinks;
