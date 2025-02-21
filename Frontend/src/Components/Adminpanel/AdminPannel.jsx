import React from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import Sidebar from "./PannelPages/Sidebar";
import Dashboard from "./PannelPages/Dashboard/Dashboard";
import TopNavigation from "./PannelPages/Dashboard/TopNavigation";
import DairyAccess from "./PannelPages/DairyAccesses/DairyAccess";
import CreateAccess from "./CreateAccess";
import MilkCollAccess from "./PannelPages/DairyAccesses/MilkCollAccess";

const AdminPannel = () => {
  return (
    <div className="super-admin-dashboard-container w100 h100 d-flex">
      <div className="sidebar-nav-container w20 h1 d-flex-col bg7">
        <Sidebar />
      </div>
      <div className="main-page-views-container w80 h1 d-flex-col sb">
        <div className="top-navigation-container w100 h10 d-flex a-center bg6">
          <TopNavigation />
        </div>
        <div className="page-view-container w100 h90 d-flex center p10">
          <Routes>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="create/access" element={<CreateAccess />} />
            <Route path="milk-collection/access" element={<MilkCollAccess />} />
            <Route path="*" element={<Dashboard />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default AdminPannel;
