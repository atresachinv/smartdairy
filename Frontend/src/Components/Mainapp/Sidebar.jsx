import React from "react";
import { BsXLg } from "react-icons/bs";
import applogo from "../../assets/samrtdairylogo.png";
import Mainappnavlinks from "./Mainappnavlinks";
import "../../Styles/Mainapp/Sidebar.css";

const Sidebar = ({ setselected, handleSidebar }) => {
  return (
    <>
      <aside id="sidebar">
        <div className="sidebar-logo d-flex center sb ">
          <img src={applogo} alt="sm" width={"100px"} />
          <span className="close-icon" onClick={handleSidebar}>
            <BsXLg />
          </span>
        </div>
        <ul className="sidebar-list w100 d-flex-col px10">
          <Mainappnavlinks
            setselected={setselected}
            handleSidebar={handleSidebar}
          />
        </ul>
      </aside>
    </>
  );
};

export default Sidebar;
