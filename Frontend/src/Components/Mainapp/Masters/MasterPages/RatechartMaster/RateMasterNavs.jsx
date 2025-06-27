import { BsSaveFill } from "react-icons/bs";
import { VscSave } from "react-icons/vsc";
import { IoIosSave } from "react-icons/io";
import { GrUpdate } from "react-icons/gr";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";

const RateMasterNavs = ({ isselected, setIsSelected }) => {
  const { t } = useTranslation("ratechart");
  const ratechartnavlinks = [
    {
      name: `${t("मागील दरपत्रक")}`,
      icon: <IoIosSave className="icon" />,
      index: 0,
      path: "previous/list",
    },
    {
      name: `${t("rc-add-type")}`,
      icon: <IoIosSave className="icon" />,
      index: 1,
      path: "add/new-type",
    },
    {
      name: `एक्सेल वरून दरपत्रक`,
      icon: <VscSave className="icon" />,
      index: 2,
      path: "save",
    },
    {
      name: `${t("दर वाढ/कमी करा")}`,
      icon: <GrUpdate className="icon" />,
      index: 3,
      path: "update",
    },
    {
      name: `${t("rc-apply")} करा`,
      icon: <BsSaveFill className="icon" />,
      index: 4,
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

export default RateMasterNavs;
