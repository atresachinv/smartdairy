import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Mainappviews from "./Mainappviews";
import Sidebar from "./Sidebar";
import Header from "./Header";

import "../../Styles/Mainapp/Mainapphome.css";

const Mainapp = () => {
  // fuctional sidebar
  const [openSidebar, setOpenSidebar] = useState(false);

  const handleSidebar = () => {
    setOpenSidebar(!openSidebar);
  };

  // Retrieve isselected from localStorage, defaulting to 0 if not set
  const [isselected, setIsselected] = useState(
    parseInt(localStorage.getItem("selectedTabIndex")) || 0
  );

  // Update localStorage whenever isselected changes
  useEffect(() => {
    localStorage.setItem("selectedTabIndex", isselected);
  }, [isselected]);

  // logout function
  axios.defaults.baseURL = "http://localhost:4000";
  axios.defaults.withCredentials = true;

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post("/smartdairy/api/logout");
      toast.success("Logout successful");
      navigate("/", { replace: true });
    } catch (error) {
      toast.error("Error during logout");
      console.error("Logout error:", error);
    }
  };

  return (
    <div className="main-home-container wh100 d-flex">
      <div
        className={`sidebar-container ${
          openSidebar ? "open-sidebar " : "close-sidebar"
        }`}>
        <Sidebar setselected={setIsselected} handleSidebar={handleSidebar} />
      </div>
      <div className="nav-main-view-container w80 h1 d-flex-col">
        <div className="header-navs w100 h10 d-flex a-center sb px10 bg6">
          <Header handleSidebar={handleSidebar} logout={handleLogout} />
        </div>
        <div className="main-view-container w100 h90 d-flex">
          <Mainappviews index={isselected} />
        </div>
      </div>
    </div>
  );
};

export default Mainapp;
