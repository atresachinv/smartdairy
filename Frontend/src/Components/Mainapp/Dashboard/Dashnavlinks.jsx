import { useTranslation } from "react-i18next";
import { BsHouseFill } from "react-icons/bs";
import { TbMilk } from "react-icons/tb";
import { NavLink } from "react-router-dom";

const Dashnavlinks = ({ isselected, setIsSelected }) => {
  const { t } = useTranslation(["puchasesale", "common"]);
  const Navbuttons = [
    {
      name: `${t("मिल्क डॅशबोर्ड")}`,
      icon: <TbMilk className="icon" />,
      path: "milk-dashboard",
    },
    {
      name: `${t("इन्व्हेंटरी डॅशबोर्ड")}`,
      icon: <BsHouseFill className="icon" />,
      path: "invertory-dashboard",
    },
  ];
  return (
    <>
      {Navbuttons.map((button, index) => (
        <li
          key={index}
          className={`home-nav-item  d-flex a-center ${
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
            <span className="nav-icon">{button.icon}</span>
            <span>{button.name}</span>
          </NavLink>
        </li>
      ))}
    </>
  );
};

export default Dashnavlinks;
