// eslint-disable-next-line no-unused-vars
import React from "react";
import { useTranslation } from "react-i18next";
import { IoPersonAdd, IoList } from "react-icons/io5";
import { NavLink } from "react-router-dom";

// eslint-disable-next-line react/prop-types
const ProductsNavlinks = ({ isselected, setIsSelected }) => {
  const { t } = useTranslation(["puchasesale", "common"]);
  const CustNavbuttons = [
    {
      name: `${t("ps-nv-pro-list")}`,
      icon: <IoList className="icon" />,
      path: "list",
    },
    {
      name: `${t("ps-nv-pro-add")}`,
      icon: <IoPersonAdd className="icon" />,
      path: "add-product",
    },
  ];
  return (
    <>
      {CustNavbuttons.map((button, index) => (
        <li
          key={index}
          className={`home-nav-item d-flex a-center ${
            isselected === index ? "selected" : ""
          }`}
        >
          <NavLink
            to={button.path}
            onClick={() => {
              setIsSelected(index);
            }}
            className="sub-navlinks f-label-text"
          >
            {button.icon}
            <span>{button.name}</span>
          </NavLink>
        </li>
      ))}
    </>
  );
};

export default ProductsNavlinks;
