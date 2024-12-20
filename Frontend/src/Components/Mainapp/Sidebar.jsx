import React from "react";
import { BsXLg } from "react-icons/bs";
import { BiLogOutCircle } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import applogo from "../../assets/samrtdairylogo.png";
import Mainappnavlinks from "./Mainappnavlinks";

import axios from "axios";
import "../../Styles/Mainapp/Sidebar.css";
import { useSelector } from "react-redux";

const Sidebar = ({ setselected, handleSidebar }) => {
  const navigate = useNavigate();

  axios.defaults.baseURL = import.meta.env.VITE_BASE_URI;
  axios.defaults.withCredentials = true;

  const userRole = useSelector((state) => state.users.userRole);

  const handleLogout = async () => {
    try {
      await axios.post("/logout");
      await localStorage.removeItem("customerlist");
      await localStorage.removeItem("milkentries");
      await localStorage.removeItem("literCount");
      await localStorage.removeItem("collCount");

      if (userRole === "milkcollector" || userRole === "mobilecollector") {
        await localStorage.setItem("MilkCollTabIndex", 1);
        await localStorage.setItem("selectedTabIndex", 0);
      } else {
        await localStorage.setItem("MilkCollTabIndex", 0);
        await localStorage.setItem("selectedTabIndex", 0);
      }

      localStorage.removeItem("token");
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <>
      <aside id="sidebar" className="w100 h1 d-flex-col sb">
        <div className="sidebar-logo d-flex center sb ">
          <img src={applogo} alt="sm" width={"100px"} />
          <span className="close-icon" onClick={handleSidebar}>
            <BsXLg />
          </span>
        </div>
        <ul className="sidebar-list w100 h80 d-flex-col px10">
          <Mainappnavlinks
            setselected={setselected}
            handleSidebar={handleSidebar}
          />
        </ul>
        <div
          className="logout-btn-div w100 d-flex p10 my10"
          onClick={handleLogout}>
          <span className="f-heading mx10">LOGOUT</span>
          <BiLogOutCircle className="logout-icon" />
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
