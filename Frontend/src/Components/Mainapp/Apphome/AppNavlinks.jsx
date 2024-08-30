import React from "react";
import {
  BsHouseFill,
  BsCurrencyRupee,
  BsCoin,
  BsDatabaseAdd,
  BsFileTextFill,
  BsGridFill,
} from "react-icons/bs";
import { TfiStatsUp } from "react-icons/tfi";
import "../../../Styles/Mainapp/Apphome/Apphome.css";

const AppNavlinks = ({ setselected }) => {
  const hnavlinks = [
    { name: "Milk Collection", icon: <BsDatabaseAdd className="icon" /> },
    { name: "Sales", icon: <TfiStatsUp className="icon" /> },
    { name: "Report", icon: <BsFileTextFill className="icon" /> },
    { name: "Payments", icon: <BsCurrencyRupee className="icon" /> },
  ];
  return (
    <>
      {hnavlinks.map((button, index) => (
        <li
          key={index}
          className="home-nav-item d-flex a-center"
          onClick={() => {
            setselected(index);
          }}>
          <a>
            {button.icon}
            <span>{button.name}</span>
          </a>
        </li>
      ))}
    </>
  );
};

export default AppNavlinks;
