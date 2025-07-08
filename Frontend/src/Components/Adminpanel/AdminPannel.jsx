import React, { useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import Dashboard from "./PannelPages/Dashboard/Dashboard";
import TopNavigation from "./PannelPages/Dashboard/TopNavigation";
import CreateAccess from "./CreateAccess";
import MilkCollAccess from "./PannelPages/DairyAccesses/MilkCollAccess";
import WhatsappSms from "./PannelPages/DairyAccesses/WhatsappSms";
import WhRechargeHistory from "./PannelPages/DairyAccesses/WhRechargeHistory";
import MilkFilterData from "./PannelPages/MilkFilterData/MilkFilterData";
import UploadMilkEntrys from "./PannelPages/UploadMilkEntrys/UploadMilkEntrys";
import AmcSettings from "./PannelPages/DairyActivations/AmcSettings";
import DairyList from "./PannelPages/DairyActivations/DairyList";
import NewActivation from "./PannelPages/DairyActivations/NewActivation";
import UpdateDAmc from "./PannelPages/DairyActivations/UpdateDAmc";
import UpdateAllAmc from "./PannelPages/DairyActivations/UpdateAllAmc";
import "../../Styles/AdminPannel/AdminPannel.css";
import Sidebar from "./Sidebar";

const AdminPannel = () => {
  const [openSidebar, setOpenSidebar] = useState(false);
  // handle open close sidebar ---------------------------------------------------------->
  const handleSidebar = () => {
    setOpenSidebar(!openSidebar);
  };

  // Retrieve isselected from localStorage, defaulting to 0 if not set ------------------>
  const [isselected, setIsselected] = useState(
    parseInt(localStorage.getItem("selectedNavIndex")) || 0
  );
  return (
    <div className="super-admin-dashboard-container w100 h100 d-flex">
      <div
        className={`sidebar-nav-container ${
          openSidebar ? "open-sidebar-container" : "close-sidebar-container"
        }`}
      >
        <Sidebar setselected={setIsselected} handleSidebar={handleSidebar} />
      </div>
      <div className="main-page-views-container w80 h1 d-flex-col sb">
        <div className="top-navigation-container w100 h10 d-flex a-center bg6">
          <TopNavigation handleSidebar={handleSidebar} />
        </div>
        <div className="page-view-container w100 h90 d-flex center p10">
          <Routes>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="create/access" element={<CreateAccess />} />
            <Route path="milk-collection/access" element={<MilkCollAccess />} />
            <Route path="whatsapp-sms" element={<WhRechargeHistory />} />
            <Route path="whatsapp-sms/add" element={<WhatsappSms />} />
            <Route path="milk-filter-data" element={<MilkFilterData />} />
            <Route path="upload-milk-entrys" element={<UploadMilkEntrys />} />
            <Route path="new/activation" element={<NewActivation />} />
            <Route path="dairy/activation" element={<DairyList />} />
            <Route path="amc/settings" element={<AmcSettings />} />
            <Route path="update/dairy/amc" element={<UpdateDAmc />} />
            <Route path="update/all/amc" element={<UpdateAllAmc />} />
            <Route path="*" element={<Dashboard />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default AdminPannel;
