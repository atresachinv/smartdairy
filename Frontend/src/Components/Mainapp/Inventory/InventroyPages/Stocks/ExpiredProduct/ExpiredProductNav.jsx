import { useTranslation } from "react-i18next";
import { MdDomainVerification } from "react-icons/md";
import { SiElasticstack } from "react-icons/si";
import { NavLink } from "react-router-dom";

const ExpiredProductNav = ({ isselected, setIsSelected, userRole }) => {
  const { t } = useTranslation(["milkcollection", "puchasesale", "common"]);

  const hnavlinks = [
    {
      name: `${t("puchasesale:ps-nv-cattlefeed")}`,
      icon: <MdDomainVerification className="icon" />,
      index: 0,
      path: "cattlefeed",
      role: ["super_admin", "admin"],
    },
    {
      name: `${t("puchasesale:ps-nv-grocery")}`,
      icon: <MdDomainVerification className="icon" />,
      index: 1,
      path: "grocery",
      role: ["super_admin", "admin"],
    },
    {
      name: `${t("puchasesale:ps-nv-medicines")}`,
      icon: <MdDomainVerification className="icon" />,
      index: 2,
      path: "medicines",
      role: ["super_admin", "admin"],
    },
    {
      name: `${t("puchasesale:ps-nv-other")}`,
      icon: <MdDomainVerification className="icon" />,
      index: 3,
      path: "other-products",
      role: ["super_admin", "admin"],
    },
  ];

  // Filter links based on userRole
  const filteredLinks = hnavlinks.filter((link) =>
    link.role.includes(userRole)
  );

  return (
    <>
      {filteredLinks.map((button, index) => (
        <li
          key={index}
          className={`home-nav-item d-flex a-center ${
            isselected === button.index ? "selected" : ""
          }`}
          onClick={() => setIsSelected(button.index)}
        >
          <NavLink to={button.path} className="sub-navlinks f-label-text">
            <span>{button.icon}</span>
            {button.name}
          </NavLink>
        </li>
      ))}
    </>
  );
};

export default ExpiredProductNav;
