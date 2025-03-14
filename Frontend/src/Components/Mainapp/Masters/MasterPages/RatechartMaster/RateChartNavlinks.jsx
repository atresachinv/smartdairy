import React from "react";
import { BsSaveFill } from "react-icons/bs";
import { VscSave } from "react-icons/vsc";
import { IoIosSave } from "react-icons/io";
import { GrUpdate } from "react-icons/gr";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

const RateChartNavlinks = ({ isselected, setIsSelected }) => {
  const { t } = useTranslation("ratechart");
  const ratechart = useSelector((state) => state.ratechart.excelRatechart);
  const ratechartnavlinks = [
    {
      name: `${t("rc-add-type")}`,
      icon: <IoIosSave className="icon" />,
      index: 0,
      path: "add/new-type",
    },
    ratechart.length > 0 && {
      name: `${t("rc-save")}`,
      icon: <VscSave className="icon" />,
      index: 1,
      path: "save-new",
    },
    {
      name: `${t("rc-update")}`,
      icon: <GrUpdate className="icon" />,
      index: 2,
      path: "update-save",
    },
    {
      name: `${t("rc-apply")}`,
      icon: <BsSaveFill className="icon" />,
      index: 3,
      path: "apply",
    },
  ];
  return (
    <>
      {ratechartnavlinks.map((button, index) => (
        <li
          key={index}
          className={`home-nav-item d-flex a-center ${
            isselected === button.index ? "selected" : ""
          }`}
          onClick={() => {
            setIsSelected(button.index);
          }}
        >
          <NavLink
            to={button.path}
            className="sub-navlinks f-label-text d-flex a-center"
          >
            <span>{button.icon}</span>
            {button.name}
          </NavLink>
        </li>
      ))}
    </>
  );
};

export default RateChartNavlinks;
