import React, { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import DashboardNavlinks from "./DashboardNavlinks";
import InventoryDashboard from "./InventoryDashboard";
import LossGainInfo from "./LossGainInfo";
import MilkPurInfo from "./MilkPurInfo";
import MilkSaleInfo from "./MilkSaleInfo";
import "../../../../Styles/Mainapp/Dashbaord/Dashboard.css";

const DashboardTabs = () => {
  // Retrieve isselected from localStorage, defaulting to 0 if not set ------------------>
  const [isselected, setIsselected] = useState(
    parseInt(localStorage.getItem("dashnavIndex")) || 0
  );

  // Update localStorage whenever isselected changes ------------------------------------>
  useEffect(() => {
    localStorage.setItem("dashnavIndex", isselected);
  }, [isselected]);
  return (
    <div className="dasboard-tab-container w100 h1">
      <div className="w100 h10 d-flex a-center">
        <DashboardNavlinks
          isselected={isselected}
          setIsSelected={setIsselected}
        />
      </div>
      <div className="dashboard-tab-nav-views w100 h90 d-flex center">
        <Routes>
          <Route path="milk/purchase-info" element={<MilkPurInfo />} />
          <Route path="milk/sales-info" element={<MilkSaleInfo />} />
          <Route path="inventory-info" element={<InventoryDashboard />} />
          <Route path="lossgain-info" element={<LossGainInfo />} />
        </Routes>
      </div>
    </div>
  );
};

export default DashboardTabs;
